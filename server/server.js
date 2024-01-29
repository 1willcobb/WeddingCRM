require('dotenv').config();
const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const { typeDefs, resolvers } = require("./schemas");
const ClientModel = require('./ClientModel');


const PORT = process.env.PORT || 3001;
const app = express();

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({
    Client: ClientModel,
    // Include other models or data as needed
  }),
});

const startApolloServer = async () => {
  await apolloServer.start();
  apolloServer.applyMiddleware({ app });

  // Express now listens on the specified port
  app.listen(PORT, () => {
    console.log(`API server running on port http://localhost:${PORT} !`);
    console.log(`Use GraphQL at http://localhost:${PORT}${apolloServer.graphqlPath}`);
  });
};

startApolloServer();
