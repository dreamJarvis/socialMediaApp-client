import React, { useState } from 'react'
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

import { Button, Icon, Confirm} from 'semantic-ui-react';

import { FETCH_POSTS_QUERY } from '../util/graphql';
import MyPopup from '../util/MyPopup';

export default function DeleteButton({postId, commentId, callback}) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;

  const [deletePostOrMutation] = useMutation(mutation,{
    update(proxy){
      setConfirmOpen(false);    // close the confirm modal when the post has been deleted

      // if removing a post
      if(!commentId){
        // fetch post from cache
        const data = proxy.readQuery({
          query: FETCH_POSTS_QUERY
        });

        // update the cache in the server
        proxy.writeQuery({
          query: FETCH_POSTS_QUERY,
          data: {
            getPosts: data.getPosts.filter(p => p.id !== postId)
          }
        })  
      }

      // route back to home, if the postCard is deleted
      if(callback) callback();
    },
    variables: {
      postId,
      commentId
    }
  });

  return (
    <>
      <MyPopup
        content={commentId ? "Delete Comment": "Delete Post"}
      >
      <Button 
          as='div'  
          color='red' 
          floated='right'
          onClick={
            () => setConfirmOpen(true)
          }
        >
          <Icon name='trash' style={{margin:0}}/>
        </Button>
      </MyPopup>
      <Confirm
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={deletePostOrMutation}
      />
    </>
  )
}


// gql qurey to delete a post
const DELETE_POST_MUTATION = gql`
  mutation deletePost($postId: ID!){
    deletePost(postId:$postId)
  }
`;

// gql query to delete a comment
const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($postId: ID! $commentId: ID!){
    deleteComment(postId: $postId commentId: $commentId){
      id
      comments{
        id 
        username 
        createdAt 
        body
      }
      commentCount
    }
  }
`;
