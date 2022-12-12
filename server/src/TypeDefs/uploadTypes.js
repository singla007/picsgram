const {gql} = require("apollo-server-express");

module.exports = gql`
    extend type Query {
        info: String!
        feed(
          filter: String
          skip: Int
          take: Int
          orderBy: PostOrderByInput
        ): Feed!
      }
      
      type Feed {
        id: ID!
        posts: [Post!]!
        count: Int!
      }
      
      extend type Mutation {
        createPost(caption: String!, description: String!, file: Upload!): Post!
        signup(
          email: String!
          password: String!
          name: String!
        ): AuthPayload
        login(email: String!, password: String!): AuthPayload
        like(postId: ID!): Like
      }
      
      
      type Subscription {
        newPost: Post
        newLike: Like
      }
      
      type AuthPayload {
        token: String
        user: User
      }
      
      type User {
        id: ID!
        name: String!
        email: String!
        posts: [Post!]!
      }
      
      
      
      
      type Post {
        id: ID!
        description: String!
        caption: String!
        imageUrl : String
        createdBy: User!
        likes: [Like!]!
        createdAt: DateTime!
      }
      
      type File {
        filename: String!
        mimetype: String!
        path: String!
      }
      
      type Like {
        id: ID!
        post: Post!
        user: User!
      }
      
      input PostOrderByInput {
        description: Sort
        caption: Sort
        createdAt: Sort
      }
      
      enum Sort {
        asc
        desc
      }
      
      scalar DateTime
      
`;