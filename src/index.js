import React from 'react';
import ReactDOM from 'react-dom';
// import './styles/index.css';
import App from './components/App';
import {BrowserRouter} from 'react-router-dom';
import {setContext} from '@apollo/client/link/context';
import { split } from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import {
  createUploadLink
} from 'apollo-upload-client';
import {
  ApolloProvider,
  ApolloClient,
  createHttpLink,
  InMemoryCache,

} from '@apollo/client';
import {AUTH_TOKEN} from "./components/util/constants";

const uploadLink = createUploadLink({
  uri: 'http://localhost:3001/graphql',
  
});

const httpLink = createHttpLink({
  uri: 'http://localhost:3001/graphql',
  
});

const authLink = setContext((_, {headers}) => {
  const token = localStorage.getItem(AUTH_TOKEN);
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  };
});

const wsLink = new WebSocketLink({
  uri: `ws://localhost:3001/graphql`,
  options: {
    reconnect: true,
    connectionParams: {
      authToken: localStorage.getItem(AUTH_TOKEN)
    }
  }
});

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return (
      kind === 'OperationDefinition' &&
      operation === 'subscription'
    );
  },
  wsLink,
  authLink.concat(uploadLink).concat(httpLink)
);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache({
    typePolicies: {
      Post: {
        keyFields: ["id"]
      }
    }
  })
});

ReactDOM.render(
  <BrowserRouter>
    <ApolloProvider client={client}>
      <App/>
    </ApolloProvider>
  </BrowserRouter>,
  document.getElementById('root')
);
