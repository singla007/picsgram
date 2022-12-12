import React from "react";
import NavBar from './NavBar';
import { useQuery, gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import Post from './Post';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { AUTH_TOKEN } from './util/constants';
import { Typography } from '@mui/material';
import { NEW_POSTS_SUBSCRIPTION, NEW_LIKES_SUBSCRIPTION, FEED_QUERY } from './util/queries';

const getPostsToRender = (data) => {
    const rankedPosts = data.feed.posts.slice();
    rankedPosts.sort(
        (l1, l2) => l2.likes.length - l1.likes.length
    );
    return rankedPosts;
};

function TopPosts() {
    const navigate = useNavigate();
    const authToken = localStorage.getItem(AUTH_TOKEN);
    const { data, loading, error, subscribeToMore } = useQuery(FEED_QUERY, {
        variables: {
            skip: 0,
            take: 100,
            orderBy: { createdAt: 'desc' }
        },
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
    }, [authToken]);

    return (
        <>
            <NavBar />
            {loading && <Box sx={{ display: 'flex' }}>
                <CircularProgress />
            </Box>}
            {error && <Typography>{JSON.stringify(error, null, 2)}</Typography>}
            {data && (
                <>
                    <Typography align="center" sx={{ margin: "auto" }}>
                        Top Feed
                    </Typography>
                    {
                        getPostsToRender(data).map((post, index) => {
                            return (
                                <Post
                                    key={post.id}
                                    post={post}
                                    index={index}
                                />)
                        }
                        )}
                </>
            )}
        </>
    );
}
export default TopPosts;