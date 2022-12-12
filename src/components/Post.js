import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { AUTH_TOKEN, POSTS_PER_PAGE } from './util/constants';
import { timeDifferenceForDate } from '../utils';
import { useMutation, gql } from '@apollo/client';
import { FEED_QUERY } from "./util/queries";
import Popover from '@mui/material/Popover';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CardHeader from '@mui/material/CardHeader';
import {LIKE_MUTATION } from './util/mutations'
export default function Post(props) {
    const { post } = props;
    const authToken = localStorage.getItem(AUTH_TOKEN);
    const [likeState, setLikeState] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handlePopoverOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };
    const take = POSTS_PER_PAGE;
    const skip = 0;
    const orderBy = { createdAt: 'desc' };
    const likeHandler = () => {
        setLikeState(true)
        like()
    }
    const [like] = useMutation(LIKE_MUTATION, {
        variables: {
            postId: post.id
        },
        update: (cache, { data: { like } }) => {
            const { feed } = cache.readQuery({
                query: FEED_QUERY,
                variables: {
                    take,
                    skip,
                    orderBy
                }
            });

            const updatedPosts = feed.posts.map((feedLink) => {
                if (feedLink.id === post.id) {
                    return {
                        ...feedLink,
                        likes: [...feedLink.likes, like]
                    };
                }
                return feedLink;
            });

            cache.writeQuery({
                query: FEED_QUERY,
                data: {
                    feed: {
                        posts: updatedPosts
                    }
                },
                variables: {
                    take,
                    skip,
                    orderBy
                }
            });
        }
    });
    React.useEffect(() => {
        post.likes.map((like, key) => {
            if (like?.user?.id === sessionStorage.getItem("userId")) {
                setLikeState(true);
            }
        })

    })

    return (
        <Card style={{ margin: "auto", marginBottom: "20px" }} align="center" sx={{ maxWidth: 345 }}>
            <CardHeader
                avatar={
                    <Avatar sx={{ bgcolor: "#1976d2" }} aria-label="recipe">
                        {post.createdBy ? post.createdBy?.name.trim().split('')[0]?.toUpperCase() : ''}
                    </Avatar>
                }
                colour='warning'
                action={
                    <IconButton aria-label="settings">
                        <MoreVertIcon />
                    </IconButton>
                }
                title={post.createdBy ? post.createdBy.name.trim() : 'Unknown User'}
                subheader={timeDifferenceForDate(post.createdAt)}
            />

            <CardMedia
                component="img"
                height="200"
                src={"http://localhost:3001/static"+post.imageUrl}
                alt={post.createdBy ? post.createdBy.name.trim() : 'Unknown User'}
            />
            <CardContent>
                <Typography variant="body2" color="text.secondary" textAlign={'left'}>
                    {post.caption}
                </Typography>
                <Typography textAlign={'left'} variant="body2" color="text.secondary">
                    Description: {post.description}
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small" onClick={likeHandler}>
                    {(likeState) ? <FavoriteOutlinedIcon color="error" /> : <FavoriteBorderOutlinedIcon color="error" />}
                </Button>

                <div>
                    <Typography
                        aria-owns={open ? 'mouse-over-popover' : undefined}
                        aria-haspopup="true"
                        onMouseEnter={handlePopoverOpen}
                        onMouseLeave={handlePopoverClose}
                    >
                        {post.likes.length} Likes
                    </Typography>
                    <Popover
                        id="user_name-mouse-over-popover"
                        sx={{
                            pointerEvents: 'none',
                        }}
                        open={open}
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                        onClose={handlePopoverClose}
                        disableRestoreFocus
                    >
                        {
                            (post.likes).map((post, key) => {

                                return (<Typography key={key} sx={{ p: 1 }}>{post?.user?.name || "Unknown User"}</Typography>)
                            }
                            )}
                    </Popover>
                </div>
            </CardActions>
        </Card>
    );
}