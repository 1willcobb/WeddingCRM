const resolvers = {
  Query: {
    hello: () => "Hello, worlds!",
    sup: () => "Sup, world!",
    getClients: async (parent, args, context) => {
      return await context.Client.getClients();
    },
    //TODO getSingleClient
    getPlanners: async (parent, args, context) => {
      return await context.Planner.getPlanners();
    },
    //TODO getSinglePlanner
    getVenues: async (parent, args, context) => {
      return await context.Venue.getVenues();
    }
    //TODO getSingleVenue
  },
  Mutation: {
    addClient: async (_, args, context) => {
      try {
  
        return await context.Client.addClient(args);
      } catch (error) {
        // Handle the error here
        console.error(error);
        throw new Error("An error occurred while adding a client.");
      }
    },
    updateClient: async (_, args, context) => {
      try {
        const clientData = {
          PK: args.PK,
          SK: args.SK,
        };
        const updateData = { ...args };
        delete updateData.PK; // Remove PK from updateData
        delete updateData.SK; // Remove SK from updateData
        
        return await context.Client.updateClient(clientData, updateData);
      } catch (error) {
        console.error(error);
        throw new Error("An error occurred while updating a client.");
      }
    },
    deleteClient: async (_, args, context) => {
      try {
        return await context.Client.deleteClient(args);
      } catch (error) {
        console.error(error);
        throw new Error("An error occurred while deleting a client.");
      }
    },
    addPlanner: async (_, args, context) => {
      try {
  
        return await context.Planner.addPlanner(args);
      } catch (error) {
        // Handle the error here
        console.error(error);
        throw new Error("An error occurred while adding a planner.");
      }
    },
    updatePlanner: async (_, args, context) => {
      try {
        const plannerData = {
          PK: args.PK,
          SK: args.SK,
        };
        const updateData = { ...args };
        delete updateData.PK; // Remove PK from updateData
        delete updateData.SK; // Remove SK from updateData
        
        return await context.Planner.updatePlanner(plannerData, updateData);
      } catch (error) {
        console.error(error);
        throw new Error("An error occurred while updating a planner.");
      }
    },
    deletePlanner: async (_, args, context) => {
      try {
        return await context.Planner.deletePlanner(args);
      } catch (error) {
        console.error(error);
        throw new Error("An error occurred while deleting a planner.");
      }
    },
    addVenue: async (_, args, context) => {
      try {
  
        return await context.Venue.addVenue(args);
      } catch (error) {
        // Handle the error here
        console.error(error);
        throw new Error("An error occurred while adding a venue.");
      }
    },
    updateVenue: async (_, args, context) => {
      try {
        const venueData = {
          PK: args.PK,
          SK: args.SK,
        };
        const updateData = { ...args };
        delete updateData.PK; // Remove PK from updateData
        delete updateData.SK; // Remove SK from updateData
        
        return await context.Venue.updateVenue(venueData, updateData);
      } catch (error) {
        console.error(error);
        throw new Error("An error occurred while updating a venue.");
      }
    },
    deleteVenue: async (_, args, context) => {
      try {
        return await context.Venue.deleteVenue(args);
      } catch (error) {
        console.error(error);
        throw new Error("An error occurred while deleting a venue.");
      }
    },
  },
};

module.exports = resolvers;