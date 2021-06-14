import React from 'react';
import App from './App';
import ApolloClient from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
import { ApolloProvider } from '@apollo/react-hooks';
import { setContext } from 'apollo-link-context';

// linking with the graph-ql server
const httpLink = createHttpLink({
  uri: 'http://localhost:5000/',
});

// add's user authorization token to the req
// when it is made, so the server can authenticate the user
const authLink = setContext(() => {
  const token = localStorage.getItem('jwtToken');

  // add authorization to the request header to the request
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : ''
    }
  }
})

const client = new ApolloClient({
  link: authLink.concat(httpLink),    // concatinating the authorization to the link
  cache: new InMemoryCache()  
});

export default (
  <ApolloProvider client={client}>
    <App/>
  </ApolloProvider>
)