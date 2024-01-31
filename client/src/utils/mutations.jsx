import { gql } from "@apollo/client";

export const ADD_CLIENT = gql`
  mutation Mutation(
    $pk: ID!
    $sk: ID!
    $budget: Int
    $email: String
    $eventDate: String
    $inquiry: String
    $name: String
    $notes: String
    $package: String
    $phone: String
    $plannerPk: ID
    $projectPk: ID
    $status: String
    $venuePk: ID
  ) {
    addClient(
      PK: $pk
      SK: $sk
      budget: $budget
      email: $email
      eventDate: $eventDate
      inquiry: $inquiry
      name: $name
      notes: $notes
      package: $package
      phone: $phone
      plannerPK: $plannerPk
      projectPK: $projectPk
      status: $status
      venuePK: $venuePk
    ) {
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
