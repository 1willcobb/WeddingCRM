const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  QueryCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
  GetCommand,
} = require("@aws-sdk/lib-dynamodb");
const { v4: uuidv4 } = require("uuid");

// Configure AWS DynamoDB Client
const dbClient = new DynamoDBClient({
  region: process.env.AWS_REGION,
  // other configurations as needed
});

const docClient = DynamoDBDocumentClient.from(dbClient);

const TABLE_NAME = "WeddingCRM2";

const ContactModel = {
  getContacts: async function () {
    const params = {
      TableName: TABLE_NAME,
      KeyConditionExpression: "PK = :PK and begins_with(SK, :SKprefix)",
      ExpressionAttributeValues: {
        ":PK": "ORG::1", //! hard coded needs to change
        ":SKprefix": "CONTACT::",
      },
    };

    try {
      const data = await docClient.send(new QueryCommand(params));

      if (!data.Items) {
        throw new Error("Contacts not found");
      }

      return data.Items;
    } catch (error) {
      console.error("Error querying table by organization:", error);
      throw new Error("Error querying table by organization");
    }
  },
  getSingleContact: async function (args) {
    // Added clientId as a parameter
    const params = {
      TableName: TABLE_NAME,
      Key: { PK: args.PK, SK: args.SK },
    };

    try {
      const data = await docClient.send(new GetCommand(params));

      if (!data.Item) {
        throw new Error("Contact not found");
      }

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
  addContact: async (data) => {
    const contactData = {
      ...data,
      PK: "ORG::1",
      SK: `CONTACT::${data.type.toUpperCase()}::` + uuidv4(),
    };
    delete contactData.type

    const params = {
      TableName: TABLE_NAME, // Replace with your table name
      Item: contactData,
    };

    try {
      await docClient.send(new PutCommand(params));
      console.log("client successfully added: ", contactData);
      const getParams = {
        TableName: TABLE_NAME,
        Key: {
          PK: contactData.PK,
          SK: contactData.SK,
        },
      };

      const fetchedClient = await docClient.send(new GetCommand(getParams));

      if (!fetchedClient.Item) {
        throw new Error("Error fetching newly added client");
      }

      console.log("Fetched new client", fetchedClient.Item);

      return fetchedClient.Item; // Return the actual data from DynamoDB
    } catch (error) {
      console.error("Error adding client:", error);
      throw new Error("Error adding client");
    }
  },
  updateContact: async (clientData, updateData) => {
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
      await docClient.send(new UpdateCommand(params));

      const getParams = {
        TableName: TABLE_NAME,
        Key: {
          PK: clientData.PK,
          SK: clientData.SK,
        },
      };

      const fetchedClient = await docClient.send(new GetCommand(getParams));

      if (!fetchedClient.Item) {
        throw new Error("Error fetching newly added client");
      }

      console.log("Fetched new client", fetchedClient.Item);

      return fetchedClient.Item; // Return the actual data from DynamoDB
    } catch (error) {
      console.error("Error updating client:", error);
      throw new Error("Error updating client");
    }
  },
  deleteContact: async (clientId) => {
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

module.exports = ContactModel;
