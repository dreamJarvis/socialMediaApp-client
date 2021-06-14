import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';
import { Button, Icon, Label } from 'semantic-ui-react';
import gql from 'graphql-tag';

import MyPopup from '../util/MyPopup';

export default function LikeButton({ user, post: {id, likes, likeCount}}) {
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if(user && likes.find(like => like.username === user.username)){
      setLiked(true);
    }else setLiked(false);
  }, [user, likes]);

  // updating like status
  const [likePost] = useMutation(LIKE_POST_MUTATION, {
    variables: { postId: id}
  });

  // if liked show filled icon, else show outline
  const likeButton = user ? (
    liked ? (
      <Button color='teal'>
        <Icon name='heart' />
      </Button>
    ) : (
      <Button color='teal' basic>
        <Icon name='heart' />
      </Button>
    )
  ):(
    <Button as={Link} to="/login" color='teal' basic>
      <Icon name='heart' />
    </Button> 
  );

  return (
    <Button as='div' labelPosition='right' onClick={likePost}>
      <MyPopup
        content={liked ? "unlike" : "like"}
      >
        {likeButton}
      </MyPopup>
      <Label basic color='teal' pointing='left'>
        {likeCount}
      </Label>
    </Button>
  )
};

// to update the post like
const LIKE_POST_MUTATION = gql`
  mutation likePost($postId: ID!){
    likePost(postId: $postId){
      id
      likes {
        id
        username
      }
      likeCount
    }
  }
`;