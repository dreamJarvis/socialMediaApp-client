import React,  { useContext, useState } from 'react';
import { Form, Button } from 'semantic-ui-react';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { AuthContext } from '../context/auth';
import { useForm } from '../util/hooks';

function Register(props){
  const context = useContext(AuthContext);
  const [errors, setErrors] = useState({});

  // using hooks to declare and execute change and submit event's
  const { onChange, onSubmit, values } = useForm(registerUser, {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // read it here =>  https://www.apollographql.com/docs/tutorial/mutations/
  // useMutation() => returns mutation fumction, in this case we call it addUser()
  const [addUser, { loading }] = useMutation(REGISTER_USER, { 
    update(_, {data:{register: userData}}){
      context.login(userData);  // setting up the register context
      props.history.push('/');  
    },
    onError(err){
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },  
    variables: values     //TODO what is it's purpose ??      
  });

  // calling mutaiton function, to register the user
  function registerUser(){
    addUser();
  }

  return(
    <div className="form-container">
      <Form onSubmit={onSubmit} noValidate className={loading ? 'loading' : ''}>
        <h1>Register</h1> 
        <Form.Input
          label="Username"
          placeholder="Username..."
          type="text"
          name="username"
          value={values.username}
          error={errors.username ? true : false}
          onChange={onChange}
        />

        <Form.Input
          label="Email"
          placeholder="Email..."
          type="email"
          name="email"
          value={values.email}
          error={errors.email ? true : false}
          onChange={onChange}
        />

        <Form.Input
          label="Password"
          placeholder="Password..."
          type="password"
          name="password"
          value={values.password}
          error={errors.password ? true : false}
          onChange={onChange}
        />

        <Form.Input
          label="Confirm Password"
          placeholder="Confirm Password..."
          type="password"
          name="confirmPassword"
          value={values.confirmPassword}
          error={errors.confirmPassword ? true : false}
          onChange={onChange}
        />

        <Button type="submit" primary>
          Register
        </Button>
      </Form>

      {/* error messages according to error's recieved */}
      { Object.keys(errors).length > 0 && (         //  the error's might not exist at all
        <div className="ui error message">
        <ul className="list">
          {Object.values(errors).map((values) => (
            <li key={values}>{values}</li>
          ))}
        </ul>
      </div>
      )}
    </div>
  );
}

// graphQl mutation query for registering the user to db
const REGISTER_USER = gql`
  mutation register(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ){
    register(
      registerInput: {
        username: $username
        email: $email
        password: $password
        confirmPassword: $confirmPassword
      }
    ){
      id
      email
      username
      createdAt
      token
    }
  }
`

export default Register;