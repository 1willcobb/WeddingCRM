const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Query {
    hello: String
    sup: String
  }

  # type Mutation {
  #   createClient(input: ClientInput!): Client
  #   updateClient(id: ID!, input: ClientInput!): Client
  #   deleteClient(id: ID!): Boolean

  #   createVenue(input: VenueInput!): Venue
  #   updateVenue(id: ID!, input: VenueInput!): Venue
  #   deleteVenue(id: ID!): Boolean

  #   createPlanner(input: PlannerInput!): Planner
  #   updatePlanner(id: ID!, input: PlannerInput!): Planner
  #   deletePlanner(id: ID!): Boolean

  #   createProject(input: ProjectInput!): Project
  #   updateProject(id: ID!, input: ProjectInput!): Project
  #   deleteProject(id: ID!): Boolean
  # }
  

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
