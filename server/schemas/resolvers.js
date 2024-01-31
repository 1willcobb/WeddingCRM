const resolvers = {
  Query: {
    hello: () => "Hello, worlds!",
    sup: () => "Sup, world!",
    clients: async (parent, args, context) => {
      return await context.Client.scan();
    },
    queryByOrg: async (parent, args, context) => {
      return await context.Client.queryByOrg();
    }
  },
  Mutation: {
    addClient: async (_, args, context) => {
      try {
        // Assuming context.ClientModel is your DynamoDB client model
        console.log("addClient")
        console.log("args", args)
        return await context.Client.addClient(args);
      } catch (error) {
        // Handle the error here
        console.error(error);
        throw new Error("An error occurred while adding a client.");
      }
    },
    updateClient: async (_, args, context) => {
      try {
        // Assuming context.ClientModel is your DynamoDB client model
        return await context.Client.updateClient(args);
      } catch (error) {
        // Handle the error here
        console.error(error);
        throw new Error("An error occurred while updating a client.");
      }
    },
    deleteClient: async (_, args, context) => {
      try {
        // Assuming context.ClientModel is your DynamoDB client model
        return await context.Client.deleteClient(args);
      } catch (error) {
        // Handle the error here
        console.error(error);
        throw new Error("An error occurred while deleting a client.");
      }
    },
  },
};

module.exports = resolvers;