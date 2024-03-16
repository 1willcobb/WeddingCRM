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

const ProjectModel = {
  //GET all clients for orginization
  getProjects: async function () {
    const params = {
      TableName: TABLE_NAME,
      KeyConditionExpression: "PK = :PK and begins_with(SK, :SKprefix)",
      ExpressionAttributeValues: {
        ":PK": "ORG::1", //! hard coded needs to change
        ":SKprefix": "PROJECT::",
      },
    };

    try {
      const data = await docClient.send(new QueryCommand(params));

      if (!data.Items) {
        throw new Error("Projects not found");
      }

      return data.Items; // Returns the list of Projects
    } catch (error) {
      console.error("Error querying table by organization:", error);
      throw new Error("Error querying table by organization");
    }
  },
  getSingleProject: async function (args) {
    const params = {
      TableName: TABLE_NAME,
      Key: { PK: args.PK, SK: args.SK },
    };

    try {
      const data = await docClient.send(new GetCommand(params));

      if (!data.Item) {
        throw new Error("Project not found");
      }

      console.log("data", data.Item);

      return data.Item; // Returns the project data with planners attached
    } catch (error) {
      console.error(
        "Error querying table for a single project and associated planners:",
        error
      );
      throw new Error(
        "Error querying table for a single project and associated planners"
      );
    }
  },

  //PUT NEW client data
  addProject: async (data) => {
    const projectData = {
      ...data,
      PK: "ORG::1",
      SK: "PROJECT::" + uuidv4(),
    };

    const params = {
      TableName: TABLE_NAME, // Replace w ith your table name
      Item: projectData,
    };

    try {
      await docClient.send(new PutCommand(params));
      console.log("client successfully added: ", projectData);
      const getParams = {
        TableName: TABLE_NAME,
        Key: {
          PK: projectData.PK,
          SK: projectData.SK,
        },
      };

      const fetchedProject = await docClient.send(new GetCommand(getParams));

      if (!fetchedProject.Item) {
        throw new Error("Error fetching newly added client");
      }

      console.log("Fetched new client", fetchedProject.Item);

      return fetchedProject.Item; // Return the actual data from DynamoDB
    } catch (error) {
      console.error("Error adding client:", error);
      throw new Error("Error adding client");
    }
  },

  //PUT update client data
  updateProject: async (projectData, updateData) => {
    console.log("updateData", updateData);
    console.log("projectData", projectData);
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
      Key: { PK: projectData.PK, SK: projectData.SK },
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
          PK: projectData.PK,
          SK: projectData.SK,
        },
      };

      const fetchedProject = await docClient.send(new GetCommand(getParams));

      if (!fetchedProject.Item) {
        throw new Error("Error fetching newly added project");
      }

      console.log("Fetched new project", fetchedProject.Item);

      return fetchedProject.Item; // Return the actual data from DynamoDB
    } catch (error) {
      console.error("Error updating project:", error);
      throw new Error("Error updating project");
    }
  },


  deleteProject: async (projectData) => {
    const params = {
      TableName: TABLE_NAME,
      Key: { PK: projectData.PK, SK: projectData.SK },
    };

    try {
      await docClient.send(new DeleteCommand(params));
      return projectData; // Returns the deleted project
    } catch (error) {
      console.error("Error deleting project:", error);
      throw new Error("Error deleting project");
    }
  },
};

module.exports = ProjectModel;
