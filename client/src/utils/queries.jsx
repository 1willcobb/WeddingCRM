import { gql } from "@apollo/client";

export const SUP = gql`
  query Query {
    sup
    hello
  }
`;

export const CLIENTS = gql`
  query Query {
    getClients {
      budget
      email
      eventDate
      inquiry
      name
      notes
      package
      phone
      plannerPK
      projectPK
      status
      venuePK
      plannerNames
    }
  }
`;

export const SINGLECLIENT = gql`
  query Query($PK: ID!, $SK: ID!) {
    getSingleClient(PK: $PK, SK: $SK) {
      budget
      email
      eventDate
      inquiry
      name
      notes
      package
      phone
      plannerPK
      projectPK
      status
      venuePK
    }
  }
`;

export const PLANNERS = gql`
  query Query($PK: ID!, $SK: ID!) {
    getPlanners(PK: $PK, SK: $SK) {
      name
      email
      notes
      phone
      clients
    }
  }
`;

export const SINGLEPLANNER = gql`
  query Query($PK: ID!, $SK: ID!) {
    getSinglePlanner(PK: $PK, SK: $SK) {
      name
      email
      notes
      phone
      clients
    }
  }
`;