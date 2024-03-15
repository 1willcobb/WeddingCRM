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
      name: String = ""
      budget: Int = 0
      email: String = ""
      eventDate: String = ""
      inquiry: String = ""
      notes: String = ""
      package: String = ""
      phone: String = ""
      plannerPK: [String] = []
      projectPK: [String] = []
      status: String = "New" # Example of setting a default status
      venuePK: [String] = []
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
      plannerPK: [String]
      projectPK: [String]
      status: String
      venuePK: [String]
    ): Client

    deleteClient(PK: ID!, SK: ID!): Client

    addPlanner(
      name: String = ""
      email: String = ""
      notes: String = ""
      phone: String = ""
      clients: [String] = []
    ): Planner

    updatePlanner(
      PK: ID!
      SK: ID!
      name: String
      email: String
      notes: String
      phone: String
      clients: [String]
    ): Planner

    deletePlanner(PK: ID!, SK: ID!): Planner

    addVenue(
      budget: Int = 0
      email: String = ""
      guestCount: Int = 0
      name: String = ""
      notes: String = ""
      phone: String = ""
      clients: [String] = []
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
    plannerPK: [String]
    projectPK: [String]
    status: String
    venuePK: [String]
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
  }

  type Planner {
    PK: ID!
    SK: ID!
    name: String
    email: String
    notes: String
    phone: String
    clients: [String]
  }

  type Project {
    PK: ID!
    SK: ID!
    clients: [String]
    budget: Int
    eventDate: String
    name: String
    notes: String
    package: String
    plannerPK: [String]
    venuePK: [String]
  }
`;

module.exports = typeDefs;
