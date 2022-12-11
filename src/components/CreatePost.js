import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { FEED_QUERY } from "./util/queries";
import { CREATE_POST_MUTATION } from "./util/mutations";
import { POSTS_PER_PAGE } from "./util/constants";
import NavBar from './NavBar';

const CreatePost = () => {

  const navigate = useNavigate();
  const [formState, setFormState] = useState({
    description: '',
    caption: '',
    file: ''
  });
console.log(formState)
  const [CreatePost, { loading, error }] = useMutation(CREATE_POST_MUTATION, {
    variables: {
      description: formState.description,
      caption: formState.caption,
      file: formState.file
    },
    update: (cache, { data: { createPost } }) => {
      const take = POSTS_PER_PAGE;
      const skip = 0;
      const orderBy = { createdAt: 'desc' };

      const data = cache.readQuery({
        query: FEED_QUERY,
        variables: {
          take,
          skip,
          orderBy
        }
      });

      cache.writeQuery({
        query: FEED_QUERY,
        data: {
          feed: {
            posts: [createPost, ...data.feed.posts]
          }
        },

        variables: {
          take,
          skip,
          orderBy
        }
      });
    },
    onCompleted: () => {
      navigate("/")
    }
  });
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{JSON.stringify(error, null, 2)}</div>;
  return (
    <div>
      <NavBar />
      <form encType={'multipart/form-data'}
        onSubmit={(e) => {
          e.preventDefault();
          CreatePost();
        }}
      >


        <div className="flex flex-column mt3">
          <input
            className="mb2"
            value={formState.caption}
            onChange={(e) =>
              setFormState({
                ...formState,
                caption: e.target.value
              })
            }
            type="text"
            placeholder="A caption for the Post"
          />
          <input
            className="mb2"
            value={formState.description}
            onChange={(e) =>
              setFormState({
                ...formState,
                description: e.target.value
              })
            }
            type="text"
            placeholder="The description for the link"
          />
          <input type="file" onChange={(e) =>{
            setFormState({
              ...formState,
              file: e.target.files[0]
            })}} />
        </div>
        <button type="submit">Submit</button>
      </form>

    </div>
  );
};

export default CreatePost;