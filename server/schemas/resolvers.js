const resolvers = {
  Query: {
    hello: () => "Hello, worlds!",
    sup: () => "Sup, world!",
    getClients: async (parent, args, context) => {
      return await context.Client.getClients();
    },
    getSingleClient: async (parent, args, context) => {
      return await context.Client.getSingleClient(args);
    },
    getPlanners: async (parent, args, context) => {
      return await context.Planner.getPlanners();
    },
    getSinglePlanner: async (parent, args, context) => {
      return await context.Planner.getSinglePlanner(args);
    },
    getVenues: async (parent, args, context) => {
      return await context.Venue.getVenues();
    },
    getSingleVenue: async (parent, args, context) => {
      return await context.Venue.getSingleVenue(args);
    },
  },
  Mutation: {
    addClient: async (_, args, context) => {
      try {
        template = {
          ...args,
          planners: [],
          venues: [],
          projects: [],
        };

        return await context.Client.addClient(template);
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

        const client = await context.Client.getSingleClient(clientData);

        if (!client) {
          throw new Error("Client not found");
        }

        let clientPlanners = [];
        if (client.plannerPK) {
          clientPlanners.push(client.plannerPK);
        }

        if (args.plannerPK) {
          const plannerData = {
            PK: args.PK,
            SK: args.planners[0].id, // {id: "PLANER::**", name: "JACK"}
          };

          const singlePlanner = await context.Planner.getSinglePlanner(
            plannerData
          );

          if (!singlePlanner) {
            throw new Error("Planner not found");
          }

          let clientPlanners = [
            ...singlePlanner.clients,
            { id: client.SK, name: client.name },
          ];

          console.log("clientPlanners " + clientPlanners);

          const updatePlannerData = {
            clients: clientPlanners,
          };

          const plannerUpdate = await context.Planner.updatePlanner(
            plannerData,
            updatePlannerData
          );
          console.log("planner updated", plannerUpdate);
        }

        //??????????????????????dd
        if (args.venuePK) {
          const venueData = {
            PK: args.PK,
            SK: args.venuePK[args.venuePK.length - 1],
          };

          const singleVenue = await context.Venue.getSingleVenue(venueData);
          if (!singleVenue) {
            throw new Error("Planner not found");
          }

          let venueClientPKList = [...singleVenue.clients, client.SK];
          let venueClientNameList = [...singleVenue.clientNames, client.name];

          console.log("venueClientPKList " + venueClientPKList);
          console.log("venueClientNameList " + venueClientNameList);

          const updateVenueData = {
            clients: venueClientPKList,
            clientNames: venueClientNameList,
          };

          const venueUpdate = await context.Venue.updateVenue(
            venueData,
            updateVenueData
          );
          console.log("venue updated", venueUpdate);
        }
        //??????????????????????

        const clientUpdate = await context.Client.updateClient(
          clientData,
          updateData
        );

        console.log("args", args);

        return clientUpdate;
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
        template = {
          ...args,
          clients: [],
          projects: [],
          venues: [],
        };
        return await context.Planner.addPlanner(template);
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
        template = {
          ...args,
          planners: [],
          projects: [],
          clients: [],
        };
        return await context.Venue.addVenue(template);
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
