import React from 'react';
import { POSTS_PER_PAGE } from './util/constants';
import NavBar from './NavBar';
import { useQuery, gql } from '@apollo/client';
import { useLocation, useNavigate } from 'react-router-dom';
import Post from './Post';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { AUTH_TOKEN } from './util/constants';
import { Typography } from '@mui/material';
import { NEW_POSTS_SUBSCRIPTION, NEW_LIKES_SUBSCRIPTION, FEED_QUERY } from './util/queries';


const getQueryVariables = (isNewPage, page) => {
    const skip = isNewPage ? (page - 1) * POSTS_PER_PAGE : 0;
    const take = isNewPage ? POSTS_PER_PAGE : 100;
    const orderBy = { createdAt: 'desc' };
    return { take, skip, orderBy };
};

const getPostsToRender = (isNewPage, data) => {
    if (isNewPage) {
        return data.feed.posts;
    }
    const rankedPosts = data.feed.posts.slice();
    rankedPosts.sort(
        (l1, l2) => l2.likes.length - l1.likes.length
    );
    return rankedPosts;
};


const Posts = ({ client }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const authToken = localStorage.getItem(AUTH_TOKEN);

    const isNewPage = location.pathname.includes(
        'new'
    );
    const pageIndexParams = location.pathname.split(
        '/'
    );
    const page = parseInt(
        pageIndexParams[pageIndexParams.length - 1]
    );
    const pageIndex = page ? (page - 1) * POSTS_PER_PAGE : 0;

    const handlePages = (event, pageArg) => {
        console.log("count: " + pageArg)
        navigate(`/new/${pageArg}`)
    }


    const {
        data,
        loading,
        error,
        subscribeToMore
    } = useQuery(FEED_QUERY, {
        variables: getQueryVariables(isNewPage, page),
    });


    subscribeToMore({
        document: NEW_POSTS_SUBSCRIPTION,
        updateQuery: (prev, { subscriptionData }) => {
            if (!subscriptionData.data) return prev;
            const newPost = subscriptionData.data.newPost;
            const exists = prev.feed.posts.find(
                ({ id }) => id === newPost.id
            );
            if (exists) return prev;

            return Object.assign({}, prev, {
                feed: {
                    posts: [newPost, ...prev.feed.posts],
                    count: prev.feed.posts.length + 1,
                    __typename: prev.feed.__typename
                }
            });
        }
    });



    subscribeToMore({
        document: NEW_LIKES_SUBSCRIPTION
    });
    React.useEffect(() => {
        if (!authToken) {
            navigate('/SignIn')
        }
    }, [authToken])
    console.log(data)

    return (
        <><NavBar />
            {loading && <Box sx={{ display: 'flex' }}>
                <CircularProgress />
            </Box>}
            {error && <pre>{JSON.stringify(error, null, 2)}</pre>}
            {data && (
                <>
                    {isNewPage ? <Typography align="center" sx={{ margin: "auto" }}>New Feed</Typography> : <Typography align="center" sx={{ margin: "auto" }}>Top Feed</Typography>}
                    {getPostsToRender(isNewPage, data).map(
                        (post, index) => {
                            return (
                                <Post
                                    key={post.id}
                                    post={post}
                                    index={index + pageIndex}
                                />)
                        }
                    )}
                    {isNewPage &&
                        <Stack style={{ alignItems: "center" }} spacing={2}>
                            <Pagination color="primary" count={Math.ceil(data.feed.count / POSTS_PER_PAGE)} page={page}
                                onChange={handlePages} variant="outlined" shape="rounded" />
                        </Stack>
                    }
                </>
            )}
        </>
    );
};

export default Posts;