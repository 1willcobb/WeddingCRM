const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  QueryCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
} = require("@aws-sdk/lib-dynamodb");
const { v4: uuidv4 } = require("uuid");

// Configure AWS DynamoDB Client
const dbClient = new DynamoDBClient({
  region: process.env.AWS_REGION,
  // other configurations as needed
});

const docClient = DynamoDBDocumentClient.from(dbClient);

const TABLE_NAME = "WeddingCRM2";

const VenueModel = {
  getVenues: async function () {
    const params = {
      TableName: TABLE_NAME,
      KeyConditionExpression: "PK = :PK and begins_with(SK, :SKprefix)",
      ExpressionAttributeValues: {
        ":PK": "ORG::1", //! hard coded needs to pull from the context user
        ":SKprefix": "VENUE::",
      },
    };
    try {
      const data = await docClient.send(new QueryCommand(params));
      return data.Items; // Returns the list of venues
    } catch (error) {
      console.error("Error querying table by organization:", error);
      throw new Error("Error querying table by organization");
    }
  },

  addVenue: async (data) => {
    const venueData = {
      ...data,
      PK: "ORG::1", //! hard coded needs to pull from the context user
      SK: "VENUE::" + uuidv4(),
    };
    const params = {
      TableName: TABLE_NAME, // Replace w ith your table name
      Item: venueData,
    };

    try {
      await docClient.send(new PutCommand(params));
      return venueData; // Return the added planner data
    } catch (error) {
      console.error("Error adding venue:", error);
      throw new Error("Error adding venue");
    }
  },

  updateVenue: async (venueData, updateData) => {
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
      Key: { PK: venueData.PK, SK: venueData.SK },
      UpdateExpression: updateExpression,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: "UPDATED_NEW",
    };

    try {
      const data = await docClient.send(new UpdateCommand(params));
      console.log("Data:", data.Attributes);
      return data.Attributes; // Returns the updated attributes
    } catch (error) {
      console.error("Error updating planner:", error);
      throw new Error("Error updating planner");
    }
  },

  deleteVenue: async (venueData) => {
    const params = {
      TableName: TABLE_NAME,
      Key: { PK: venueData.PK, SK: venueData.SK },
    };
    try {
      const data = await docClient.send(new DeleteCommand(params));
      return data.Attributes; // Returns the deleted venue data
    } catch (error) {
      console.error("Error deleting client:", error);
      throw new Error("Error deleting client");
    }
  },
};

module.exports = VenueModel;
