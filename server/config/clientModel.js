const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  QueryCommand,
  ScanCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
} = require("@aws-sdk/lib-dynamodb");

// Configure AWS DynamoDB Client
const dbClient = new DynamoDBClient({
  region: process.env.AWS_REGION,
  // other configurations as needed
});

const docClient = DynamoDBDocumentClient.from(dbClient);

const TABLE_NAME = "WeddingCRM";

const ClientModel = {
  // Define a method to scan all items in the table
  scan: async function () {
    const params = {
      TableName: TABLE_NAME, // Replace with your table name
    };

    try {
      const data = await docClient.send(new ScanCommand(params));
      return data.Items;
    } catch (error) {
      console.error("Error scanning table:", error);
      throw new Error("Error scanning table");
    }
  },

  queryByOrg: async function () {
    const params = {
      TableName: TABLE_NAME,
      KeyConditionExpression: "PK = :partitionKeyId",
      ExpressionAttributeValues: {
        ":partitionKeyId": "ORG::1",
      },
    };
  
    try {
      const data = await docClient.send(new QueryCommand(params));
      return data.Items;
    } catch (error) {
      console.error("Error querying table by organization:", error);
      throw new Error("Error querying table by organization");
    }
  },

  addClient: async (clientData) => {
    const params = {
      TableName: TABLE_NAME, // Replace with your table name
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

  updateClient: async (clientId, updateData) => {
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
      Key: { PK: clientId }, // Assuming 'PK' is the primary key
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

  deleteClient: async (clientId) => {
    const params = {
      TableName: TABLE_NAME,
      Key: { SK: clientId }, // Assuming 'SK' is the primary key
    };

    try {
      await docClient.send(new DeleteCommand(params));
      return clientId; // Returns the deleted client id
    } catch (error) {
      console.error("Error deleting client:", error);
      throw new Error("Error deleting client");
    }
  },

  // Add other methods as needed (e.g., create, get, update, delete)
};

module.exports = ClientModel;
