const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  QueryCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
  GetCommand,
  BatchGetCommand,
} = require("@aws-sdk/lib-dynamodb");
const { v4: uuidv4 } = require("uuid");

// Configure AWS DynamoDB Client
const dbClient = new DynamoDBClient({
  region: process.env.AWS_REGION,
  // other configurations as needed
});

const docClient = DynamoDBDocumentClient.from(dbClient);

const TABLE_NAME = "WeddingCRM2";

const ClientModel = {
  //GET all clients for orginization
  getClients: async function () {
    const params = {
      TableName: TABLE_NAME,
      KeyConditionExpression: "PK = :PK and begins_with(SK, :SKprefix)",
      ExpressionAttributeValues: {
        ":PK": "ORG::1", //! hard coded needs to change
        ":SKprefix": "CLIENT::",
      },
    };

    try {
      const data = await docClient.send(new QueryCommand(params));
      return data.Items; // Returns the list of clients
    } catch (error) {
      console.error("Error querying table by organization:", error);
      throw new Error("Error querying table by organization");
    }
  },
  //GET a single client for an organization
  getSingleClient: async function (args) {
    // Added clientId as a parameter
    const params = {
      TableName: TABLE_NAME,
      Key: { PK: args.PK, SK: args.SK },
    };

    try {
      const data = await docClient.send(new GetCommand(params));

      if (!data.Item) {
        throw new Error("Client not found");
      }

      console.log("data", data.Item);

      return data.Item; // Returns the client data with planners attached
    } catch (error) {
      console.error(
        "Error querying table for a single client and associated planners:",
        error
      );
      throw new Error(
        "Error querying table for a single client and associated planners"
      );
    }
  },

  //PUT NEW client data
  addClient: async (data) => {
    const clientData = {
      ...data,
      PK: "ORG::1",
      SK: "CLIENT::" + uuidv4(),
    };
    const params = {
      TableName: TABLE_NAME, // Replace w ith your table name
      Item: clientData,
    };

    try {
      await docClient.send(new PutCommand(params));
      return clientData; // Return the added client data
    } catch (error) {
      console.error("Error adding client:", error);
      throw new Error("Error adding client");
    }
  },

  //PUT update client data
  updateClient: async (clientData, updateData) => {
    console.log("updateData", updateData);
    console.log("clientData", clientData);
    if (!updateData || Object.keys(updateData).length === 0) {
      throw new Error("No update data provided");
    }

    let updateExpression = "set";
    let expressionAttributeNames = {};
    let expressionAttributeValues = {};

    Object.keys(updateData).forEach((key, index) => {
      updateExpression += ` #${key} = :${key}`;
      expressionAttributeNames[`#${key}`] = key;
      expressionAttributeValues[`:${key}`] = updateData[key];

      if (index < Object.keys(updateData).length - 1) {
        updateExpression += ",";
      }
    });

    const params = {
      TableName: TABLE_NAME,
      Key: { PK: clientData.PK, SK: clientData.SK },
      UpdateExpression: updateExpression,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: "UPDATED_NEW",
    };

    try {
      const data = await docClient.send(new UpdateCommand(params));
      return data.Attributes; // Returns the updated attributes
    } catch (error) {
      console.error("Error updating client:", error);
      throw new Error("Error updating client");
    }
  },

  //DELETE client data
  deleteClient: async (clientId) => {
    const params = {
      TableName: TABLE_NAME,
      Key: { PK: clientId.PK, SK: clientId.SK }, // Assuming 'SK' is the primary key
    };

    try {
      await docClient.send(new DeleteCommand(params));
      return clientId; // Returns the deleted client id
    } catch (error) {
      console.error("Error deleting client:", error);
      throw new Error("Error deleting client");
    }
  },
};

module.exports = ClientModel;
