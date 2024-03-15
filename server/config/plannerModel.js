const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  QueryCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
  GetCommand
} = require("@aws-sdk/lib-dynamodb");
const { v4: uuidv4 } = require("uuid");

// Configure AWS DynamoDB Client
const dbClient = new DynamoDBClient({
  region: process.env.AWS_REGION,
  // other configurations as needed
});

const docClient = DynamoDBDocumentClient.from(dbClient);

const TABLE_NAME = "WeddingCRM2";

const PlannerModel = {
  getPlanners: async function () {
    const params = {
      TableName: TABLE_NAME,
      KeyConditionExpression: "PK = :PK and begins_with(SK, :SKprefix)",
      ExpressionAttributeValues: {
        ":PK": "ORG::1", //! hard coded needs to pull from the context user
        ":SKprefix": "PLANNER::",
      },
    };

    try {
      const data = await docClient.send(new QueryCommand(params));
      return data.Items; // Returns the list of planners
    } catch (error) {
      console.error("Error querying table by organization:", error);
      throw new Error("Error querying table by organization");
    }
  },
  getSinglePlanner: async function (args) {
    const params = {
      TableName: TABLE_NAME,
      Key: { PK: args.PK, SK: args.SK },
    };

    try {
      const data = await docClient.send(new GetCommand(params));

      if (!data.Item) {
        throw new Error("Planner not found");
      }
      console.log("data", data.Item);
      
      return data.Item; // Returns the planner data with planners attached
    } catch (error) {
      console.error(
        "Error querying table for a single planner and associated planners:",
        error
      );
      throw new Error(
        "Error querying table for a single planner and associated planners"
      );
    }
  },

  addPlanner: async (data) => {
    const plannerData = {
      ...data,
      PK: "ORG::1", //! hard coded needs to pull from the context user
      SK: "PLANNER::" + uuidv4(),
    };
    const params = {
      TableName: TABLE_NAME, // Replace w ith your table name
      Item: plannerData,
    };

    try {
      await docClient.send(new PutCommand(params));
      return plannerData; // Return the added planner data
    } catch (error) {
      console.error("Error adding planner:", error);
      throw new Error("Error adding planner");
    }
  },

  updatePlanner: async (plannerData, updateData) => {
    console.log("updateData", updateData);
    console.log("plannerData", plannerData);
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
      Key: { PK: plannerData.PK, SK: plannerData.SK },
      UpdateExpression: updateExpression,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: "UPDATED_NEW",
    };

    try {
      const data = await docClient.send(new UpdateCommand(params));
      return data.Attributes; // Returns the updated attributes
    } catch (error) {
      console.error("Error updating planner:", error);
      throw new Error("Error updating planner");
    }
  },

  deletePlanner: async (plannerData) => {
    const params = {
      TableName: TABLE_NAME,
      Key: { PK: plannerData.PK, SK: plannerData.SK },
    };

    try {
      const data = await docClient.send(new DeleteCommand(params));
      return data.Attributes; // Returns the deleted planner data
    } catch (error) {
      console.error("Error deleting client:", error);
      throw new Error("Error deleting client");
    }
  },
};

module.exports = PlannerModel;
