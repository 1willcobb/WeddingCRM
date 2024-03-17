require("dotenv").config();
const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");
const { typeDefs, resolvers } = require("./schemas");
const contactModel = require("./config/contactModel.js");
const projectModel = require("./config/projectModel.js");

const PORT = process.env.PORT || 3001;
const app = express();

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({
    Contact: contactModel,
    Project: projectModel,
  }),
});

const startApolloServer = async () => {
  await apolloServer.start();
  apolloServer.applyMiddleware({ app });

  app.listen(PORT, () => {
    console.log(`API server running on port http://localhost:${PORT} !`);
    console.log(
      `Use GraphQL at http://localhost:${PORT}${apolloServer.graphqlPath}`
    );
  });
};

startApolloServer();
