import { gql } from "graphql-tag";

export const typeDefs = gql`#graphql

    type User {
     id: ID!
     name: String!
     userName: String!
     age: Int!
     nationality: Nationality!
     friends: [User]
    }

    enum Nationality {
        PAKISTAN
        CHINA
        INDIA
        USA
        CANADA
    }
   
    type Query {
     users: [User!]!
     user(id: ID!): User
    }
      
`;
