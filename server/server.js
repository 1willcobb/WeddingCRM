require("dotenv").config();
const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");
const { typeDefs, resolvers } = require("./schemas");
const clientModel = require("./config/clientModel.js");
const plannerModel = require("./config/plannerModel.js");
const venueModel = require("./config/venueModel.js");
const projectModel = require("./config/projectModel.js");

const PORT = process.env.PORT || 3001;
const app = express();

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({
    Client: clientModel,
    Planner: plannerModel,
    Venue: venueModel,
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
