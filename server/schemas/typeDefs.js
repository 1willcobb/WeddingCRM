const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Query {
    hello: String
    sup: String
    getClients: [Client]
    getSingleClient(PK: ID!, SK: ID!): Client
    getPlanners: [Planner]
    getSinglePlanner(PK: ID!, SK: ID!): Planner
    getVenues: [Venue]
    getSingleVenue(PK: ID!, SK: ID!): Venue
  }

  type Mutation {
    addClient(
      name: String
      budget: Int
      email: String
      eventDate: String
      inquiry: String
      notes: String
      package: String
      phone: String
      status: String
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
      status: String
      plannerPK: [String]
      projectPK: [String]
      venuePK: [String]
      plannerNames: [String]
      projectNames: [String]
      venueNames: [String]
    ): Client

    deleteClient(PK: ID!, SK: ID!): Client

    addPlanner(
      name: String
      email: String
      notes: String
      phone: String
    ): Planner

    updatePlanner(
      PK: ID!
      SK: ID!
      name: String
      email: String
      notes: String
      phone: String
      clients: [String]
      plannerPK: [String]
      projectPK: [String]
      clientNames: [String]
      projectNames: [String]
      venueNames: [String]
    ): Planner

    deletePlanner(PK: ID!, SK: ID!): Planner

    addVenue(
      budget: Int
      email: String
      guestCount: Int
      name: String
      notes: String
      phone: String
    ): Venue

    updateVenue(
      PK: ID!
      SK: ID!
      budget: Int
      email: String
      guestCount: Int
      name: String
      notes: String
      phone: String
      clients: [String]
      plannerPK: [String]
      projectPK: [String]
      plannerNames: [String]
      projectNames: [String]
      clientNames: [String]
    ): Venue

    deleteVenue(PK: ID!, SK: ID!): Venue
  }

  type Client {
    PK: ID!
    SK: ID!
    name: String
    budget: Int
    email: String
    eventDate: String
    inquiry: String
    notes: String
    package: String
    phone: String
    status: String
    plannerPK: [String]
    projectPK: [String]
    venuePK: [String]
    plannerNames: [String]
    projectNames: [String]
    venueNames: [String]
  }

  type Venue {
    PK: ID!
    SK: ID!
    budget: Int
    email: String
    guestCount: Int
    name: String
    notes: String
    phone: String
    clients: [String]
    plannerPK: [String]
    projectPK: [String]
    plannerNames: [String]
    projectNames: [String]
    clientNames: [String]
  }

  type Planner {
    PK: ID!
    SK: ID!
    name: String
    email: String
    notes: String
    phone: String
    clients: [String]
    plannerPK: [String]
    projectPK: [String]
    clientNames: [String]
    projectNames: [String]
    venueNames: [String]
  }

  type Project {
    PK: ID!
    SK: ID!
    budget: Int
    eventDate: String
    name: String
    notes: String
    package: String
    clients: [String]
    plannerPK: [String]
    venuePK: [String]
    venueNames: [String]
    plannerNames: [String]
    clientNames: [String]
  }
`;

module.exports = typeDefs;
