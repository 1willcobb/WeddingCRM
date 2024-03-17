const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Query {
    hello: String
    sup: String
    getContacts: [Contact]
    getSingleContact(PK: ID!, SK: ID!): Contact
    getProjects: [Project]
    getSingleProject(PK: ID!, SK: ID!): Project
  }

  type Mutation {
    addContact(
      name: String
      budget: Int
      email: String
      eventDate: String
      inquiry: String
      notes: String
      package: String
      phone: String
      status: String
      type: String
    ): Contact

    updateContact(
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
      projects: ID
    ): Contact

    deleteContact(PK: ID!, SK: ID!): Contact

    addProject(
      budget: Int
      eventDate: String
      name: String
      notes: String
      package: String
    ): Project

    updateProject(
      PK: ID!
      SK: ID!
      budget: Int
      eventDate: String
      name: String
      notes: String
      package: String
      clients: [ClientInput]
      planners: [PlannerInput]
      venues: [VenueInput]
      vendors: [VendorInput]
    ): Project

    deleteProject(PK: ID!, SK: ID!): Project
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

  type VendorOutput {
    id: ID
    name: String!
  }

  input ClientInput {
    id: ID!
    name: String
  }

  input PlannerInput {
    id: ID!
    name: String
  }

  input ProjectInput {
    id: ID!
    name: String
  }

  input VenueInput {
    id: ID!
    name: String
  }

  input VendorInput {
    id: ID!
    name: String
  }

  type Contact {
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
    projects: [ProjectOutput]
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
    vendors: [VendorOutput]
  }
`;

module.exports = typeDefs;
