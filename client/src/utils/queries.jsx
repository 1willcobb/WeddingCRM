import { gql } from "@apollo/client";

export const SUP = gql`
  query Query {
    sup
    hello
  }
`;


export const CLIENTS = gql`
  query Query {
    clients {
      PK
      SK
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