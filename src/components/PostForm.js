import React from 'react'
import { Button, Form } from 'semantic-ui-react';
import { gql } from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

import { useForm } from '../util/hooks';
import { FETCH_POSTS_QUERY } from '../util/graphql';

export default function PostForm() {
  const { values, onChange, onSubmit } = useForm(createPostCallback, {
    body: ''
  });

  // useMutation -> gives you 3 callbacks: update, onError & variables
  const [createPost, {error}] = useMutation(CREATE_POST_MUTATION, {
    variables: values,
    
    update(proxy, result) {
      // fetching all the data from the apollo-cache 
      // here we are getting the root query
      const data = proxy.readQuery({
        query: FETCH_POSTS_QUERY,     // fetch client data that is stored in the cache
      });

      // now saving our newly edited data (persisting our data)
      // writes newly updated data to the cache
      proxy.writeQuery({
        query: FETCH_POSTS_QUERY,
        data: {
          /* extracting posts data from the root cache data,
            adding the new post to the getPosts cache */
          getPosts: [result.data.createPost, ...data.getPosts], 
        },
      });
      values.body = '';
    },

    onError(err) {  // <== also add this so the page doesn't break
      return err;
    },
  });

  function createPostCallback(){
    createPost();
  }

  return (
    <>
      <Form onSubmit={onSubmit}>
        <h2>Create a Post:</h2>
        <Form.Field>
          <Form.Input
            placeholder="pingle.."
            name="body"
            onChange={onChange}
            value={values.body}
            error={error ? true : false}
          />
          <Button type="submit" color="teal">
            Submit
          </Button>
        </Form.Field>
      </Form>

      {
        error && (
          <div className="ui error message" style={{marginBottom:20}}>
            <li>{error.graphQLErrors[0].message}</li>
          </div>
        )
      }
    </>
  )
}

// graph-ql query to create a post
const CREATE_POST_MUTATION = gql`
  mutation createPost($body: String!){
    createPost(body: $body){
      id
      body
      createdAt
      username
      likes{
        id
        username
        createdAt
      }
      likeCount
      comments{
        id
        body
        username
        createdAt
      }
      commentCount
    }
  }
`;