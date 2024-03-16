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
      planners: [PlannerInput]
      venues: [VenueInput]
      projects: [ProjectInput]
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
      clients: [ClientInput]
      projects: [ProjectInput]
      venues: [VenueInput]
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
      clients: [ClientInput]
      planners: [PlannerInput]
      projects: [ProjectInput]
    ): Venue

    deleteVenue(PK: ID!, SK: ID!): Venue
  }

  type PlannerOutput {
    id: ID!
    name: String!
  }

  type ProjectOutput {
    id: ID!
    name: String!
  }

  type VenueOutput {
    id: ID!
    name: String!
  }

  type ClientOutput {
    id: ID!
    name: String!
  }

  input ClientInput {
    id: ID!
    name: String!
  }

  input PlannerInput {
    id: ID!
    name: String!
  }

  input ProjectInput {
    id: ID!
    name: String!
  }

  input VenueInput {
    id: ID!
    name: String!
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
    planners: [PlannerOutput]
    venues: [VenueOutput]
    projects: [ProjectOutput]
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
    planners: [PlannerOutput]
    projects: [ProjectOutput]
    clients: [ClientOutput]
  }

  type Planner {
    PK: ID!
    SK: ID!
    name: String
    email: String
    notes: String
    phone: String
    clients: [ClientOutput]
    projects: [ProjectOutput]
    venues: [VenueOutput]
  }

  type Project {
    PK: ID!
    SK: ID!
    budget: Int
    eventDate: String
    name: String
    notes: String
    package: String
    venues: [VenueOutput]
    planners: [PlannerOutput]
    clients: [ClientOutput]
  }
`;

module.exports = typeDefs;
