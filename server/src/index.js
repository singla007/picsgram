require('dotenv/config');
const { PubSub } = require('graphql-subscriptions');
const { ApolloServer } = require("apollo-server-express");
const { PrismaClient } = require('@prisma/client');
const Query = require('./resolvers/Query');
const Mutation = require('./resolvers/Mutation');
const Subscription = require('./resolvers/Subscription');
const User = require('./resolvers/User');
const Post = require('./resolvers/Post');
const Like = require('./resolvers/Like');
const path = require('path');
const express = require("express");
const cors = require("cors");
const http = require('http');


const { graphqlUploadExpress } = require("graphql-upload");
const { GraphQLUpload } = require("graphql-upload");
// import { gql } from 'apollo-server-express';
const typeDefs = require("./TypeDefs/main");

const { getUserId } = require('./utils');

const pubsub = new PubSub();

const prisma = new PrismaClient({
  errorFormat: 'minimal'
});

const resolvers = {
  Upload: GraphQLUpload,
  Query,
  Mutation,
  Subscription,
  User,
  Post,
  Like
};

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    return {
      ...req,
      prisma,
      pubsub,
      userId:
        req && req.headers.authorization
          ? getUserId(req)
          : null
    };
  },
  subscriptions: {
    onConnect: (connectionParams) => {
      if (connectionParams.authToken) {
        return {
          prisma,
          userId: getUserId(
            null,
            connectionParams.authToken
          )
        };
      } else {
        return {
          prisma
        };
      }
    }
  },
});


const app = express();

app.use(express.json());
app.use(cors());
app.use("/static", express.static(__dirname + '/Upload'));


async function startServer() {
  app.use(graphqlUploadExpress());
  await apolloServer.start();

  apolloServer.applyMiddleware({ app });
  app.get('/', (req, res) => {
    res.send("Welcome to Graphql Upload!")
  })
  app.get('/statics', (req, res) => {
    res.send("Static")
  })
  app.get('/static', express.static('public'));

};

startServer();

const port = process.env.PORT || 3001
app.listen(port, () => {
  console.log(`App is running on port ${port}`);
  console.log(`Graphql EndPoint Path: ${apolloServer.graphqlPath}`);
})
