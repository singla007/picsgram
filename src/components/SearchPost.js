import React, {useState} from 'react';
import Post from './Post';
import {useLazyQuery, gql} from '@apollo/client';
import { Typography,Toolbar } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import NavBar from './NavBar';
import { AUTH_TOKEN } from './util/constants';
import { useNavigate } from 'react-router-dom';

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    height: "30px",
    '&:focus': {
        backgroundColor:"lightGrey",
    },
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '30px',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        height: "30px",
        [theme.breakpoints.up('sm')]: {
            width: '50ch',
            '&:focus': {
                width: '50ch',
            },
        },
    },
}));

const FEED_SEARCH_QUERY = gql`
    query FeedSearchQuery($filter: String!) {
        feed(filter: $filter) {
            id
            posts {
                id
                caption
                description
                createdAt
                createdBy {
                    id
                    name
                }
                likes {
                    id
                    user {
                        id
                    }
                }
            }
        }
    }
`;
const SearchPost = (props) => {
  const query = props?.query;
  const authToken = localStorage.getItem(AUTH_TOKEN);
  const navigate = useNavigate();
  const [executeSearch, {data}] = useLazyQuery(
    FEED_SEARCH_QUERY
  );
  React.useEffect(() => {
    if (!authToken) {
      navigate('/SignIn')}
     
}, [authToken])
  return (
    <>
    <NavBar/>
    <Toolbar style={{border:"1px solid",borderRadius:"6px",margin:"10px 10px"}}>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search posts by caption…"
              inputProps={{ 'aria-label': 'search' }}
              onChange = {(event)=>executeSearch({variables: {filter: event.target.value}}) }
            />
          </Search>
          </Toolbar>
      {data && <Typography>Search Results: { data?.feed?.posts?.length}</Typography>}
      {data &&
      data.feed.posts.map((post, index) => (
        <Post key={post.id} post={post} index={index} />
      ))}
    </>
  );
};

export default SearchPost;