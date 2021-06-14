import React, { useContext, useState, useRef } from 'react'
import gql from 'graphql-tag'
import { useQuery, useMutation } from '@apollo/react-hooks';
import {Form, Button, Card, Grid, Icon, Image, Label } from 'semantic-ui-react';
import moment from 'moment';
 
import { AuthContext } from '../context/auth';
import LikeButton from '../components/LikeButton';
import DeleteButton from '../components/DeleteButton';
import MyPopup from '../util/MyPopup';

export default function SinglePost(props) {
  const { user } = useContext(AuthContext);
  const postId = props.match.params.postId;
  const commentInputRef = useRef(null);

  const [comment, setComment] = useState('');

  const { data: { getPost }={}} = useQuery(FETCH_POST_QUERY, {
    variables: {
      postId: postId          //TODO why do we need variables ??
    }
  });

  // post a comment
  const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
    update(){
      setComment('');
      commentInputRef.current.blur();   // shift's focus from the input bar once comment is posted
    },
    variables: {
      postId,
      body: comment
    }
  })

  // go to the home page after deleting the post
  function deletePostCallback(){
    props.history.push('/');
  }

  let postMarkup;
  if(!getPost){
    postMarkup = <p  className='loading'></p>
  }else{
    const { id, body, createdAt, username, comments, likes, likeCount, commentCount } = getPost;

    postMarkup = (
      <Grid>
        <Grid.Row>
          <Grid.Column width={2}>
            <Image
              src='https://react.semantic-ui.com/images/avatar/large/molly.png'
              size="small"
              float="right"
            />
          </Grid.Column>

          <Grid.Column width={10}>
            <Card fluid>
              <Card.Content>
                <Card.Header>{username}</Card.Header>
                <Card.Meta>{ moment(createdAt).fromNow() }</Card.Meta>
                <Card.Description>{body}</Card.Description>
              </Card.Content>

              <hr/>

              {/* Buttons */}
              <Card.Content>
                {/* like button */}
                <LikeButton user={user} post={{id, likeCount, likes}}/>
                
                {/* comment button */}
                <MyPopup
                  content="Comment on post"
                >
                  <Button
                    as='div'
                    labelPosition='right'
                    onClick={
                      () => commentInputRef.current.focus()
                    }
                  >
                    <Button basic color='blue'>
                      <Icon name='comments'/>
                    </Button>
                    <Label basic color='blue' pointing='left'>
                      {commentCount}
                    </Label>
                  </Button>
                </MyPopup>

                {/* delete post button */}
                {
                  user && user.username === username && <DeleteButton postId={id} callback={deletePostCallback}/>
                }
              </Card.Content>
            </Card>
            
            {/* posting a comment */}
            {
              user && 
              <Card fluid>
                <Card.Content>
                  <p>Post a comment</p>
                  <Form>
                    <div className="ui action input fluid">
                      <input
                        type="text"
                        placeholder="Comment.."
                        name="comment"
                        value={comment}
                        onChange={event => setComment(event.target.value)}
                        ref={commentInputRef}
                      />
                      <button 
                        type="submit"
                        className="ui button teal"
                        disabled={comment.trim() === ''}
                        onClick={submitComment}
                      >
                        Submit
                      </button>
                    </div>
                  </Form>
                </Card.Content>
              </Card>
            }

            {/* displaying comments */}
            {
              comments.map((comment) =>(
                <Card fluid key={comment.id}>
                  <Card.Content>
                    { 
                      //button to delete a comment
                      user && user.username === comment.username && 
                      (
                        <DeleteButton postId={id} commentId={comment.id}/>
                      )
                    }
                    <Card.Header>{comment.username}</Card.Header>
                    <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                    <Card.Description>{comment.body}</Card.Description>
                  </Card.Content>
                </Card>
              ))
            }
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }

  return postMarkup;
}

// gql query to post a comment
const SUBMIT_COMMENT_MUTATION = gql`
  mutation($postId: ID!, $body: String!){
    createComment(postId: $postId, body: $body){
      id
      comments{
        id
        body
        createdAt
        username
      }
      commentCount
    }
  }
`;

// gql query to fetch a specific post
const FETCH_POST_QUERY = gql`
  query($postId: ID!){
    getPost(postId: $postId){
      id
      body
      createdAt
      username
      likeCount
      likes {
        username
      }
      commentCount
      comments{
        id
        username
        createdAt
        body
      }
    }
  }
`;
