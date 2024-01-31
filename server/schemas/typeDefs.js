const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Query {
    hello: String
    sup: String
    clients: [Client]
    queryByOrg: [Client]
  }

  type Mutation {
    addClient(
      PK: ID!
      SK: ID!
      budget: Int
      email: String
      eventDate: String
      inquiry: String
      name: String
      notes: String
      package: String
      phone: String
      plannerPK: ID
      projectPK: ID
      status: String
      venuePK: ID
    ): Client

    updateClient(
      PK: ID!
      SK: ID!
      budget: Int
      email: String
      eventDate: String
      inquiry: String
      name: String
      notes: String
      package: String
      phone: String
      plannerPK: ID
      projectPK: ID
      status: String
      venuePK: ID
    ): Client

    deleteClient(
      PK: ID!
      SK: ID!
      budget: Int
      email: String
      eventDate: String
      inquiry: String
      name: String
      notes: String
      package: String
      phone: String
      plannerPK: ID
      projectPK: ID
      status: String
      venuePK: ID
    ): Client
  }

  type Client {
    PK: ID!
    SK: ID!
    budget: Int
    email: String
    eventDate: String
    inquiry: String
    name: String
    notes: String
    package: String
    phone: String
    plannerPK: ID
    projectPK: ID
    status: String
    venuePK: ID
  }

  type Venue {
    PK: ID!
    SK: ID!
    budget: Int
    email: String
    guestCount: Int
    name: String
    notes: String
    package: String
    phone: String
    clients: [Client]
  }

  type Planner {
    PK: ID!
    SK: ID!
    email: String
    name: String
    notes: String
    phone: String
    clients: [Client]
  }

  type Project {
    PK: ID!
    SK: ID!
    clients: [Client]
    budget: Int
    eventDate: String
    name: String
    notes: String
    package: String
    plannerPK: ID
    venuePK: ID
  }
`;

module.exports = typeDefs;
