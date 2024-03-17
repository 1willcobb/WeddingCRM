const { json } = require("express");
const { ApolloError } = require("apollo-server-errors");

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
    getProjects: async (parent, args, context) => {
      return await context.Project.getProjects();
    },
    getSingleProject: async (parent, args, context) => {
      return await context.Project.getSingleProject(args);
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

        //**** check if a new planner was supplied  **////
        let clientPlanners = [];
        if (client.planners) {
          clientPlanners.push(...client.planners);
        }

        console.log("clientPlanners " + clientPlanners);
        
        if (args.planners) {
          if (
            clientPlanners.some((planner) => planner.id === args.planners)
          ) {
            throw new Error("Planner Already Exists", "DUPLICATE_PLANNER");
          }

          const plannerData = {
            PK: args.PK,
            SK: args.planners, // {id: "PLANER::**", name: "JACK"}
          };

          const singlePlanner = await context.Planner.getSinglePlanner(
            plannerData
          );

          if (!singlePlanner) {
            throw new Error("Planner not found");
          }

          const plannerClients = singlePlanner.clients;

          plannerClients.push({ id: client.SK, name: client.name });

          console.log("plannerClients " + plannerClients);

          const updatePlannerData = {
            clients: plannerClients,
          };

          await context.Planner.updatePlanner(plannerData, updatePlannerData);

          clientPlanners.push({
            id: singlePlanner.SK,
            name: singlePlanner.name,
          });
          updateData.planners = clientPlanners;
        }

        //*****  check if a new Venue was supplied *////
        let clientVenues = [];
        if (client.venues) {
          clientVenues.push(...client.venues);
        }

        if (args.venues) {
          if (
            clientVenues.some((venues) => venues.id === args.venues)
          ) {
            throw new Error("VENUE Already Exists", "DUPLICATE_VENUE");
          }

          const venueData = {
            PK: args.PK,
            SK: args.venues, // {id: "PLANER::**", name: "JACK"}
          };

          const singleVenue = await context.Venue.getSingleVenue(
            venueData
          );

          if (!singleVenue) {
            throw new Error("Venue not found");
          }

          const venueClients = singleVenue.clients;

          venueClients.push({ id: client.SK, name: client.name });

          console.log("venueClients " + venueClients);

          const updateVenueData = {
            clients: venueClients,
          };

          await context.Venue.updateVenue(venueData, updateVenueData);

          clientVenues.push({
            id: singleVenue.SK,
            name: singleVenue.name,
          });
          updateData.venues = clientVenues;
        }

        //*****  check if a new Project was supplied *////
        let clientProjects = [];
        if (client.projects) {
          clientProjects.push(...client.projects);
        }

        if (args.projects) {
          if (
            clientProjects.some((projects) => projects.id === args.projects)
          ) {
            throw new Error("VENUE Already Exists", "DUPLICATE_VENUE");
          }

          const venueData = {
            PK: args.PK,
            SK: args.projects, // Project ID
          };

          const singleVenue = await context.Venue.getSingleVenue(
            venueData
          );

          if (!singleVenue) {
            throw new Error("Venue not found");
          }

          const venueClients = singleVenue.clients;

          venueClients.push({ id: client.SK, name: client.name });

          console.log("venueClients " + venueClients);

          const updateVenueData = {
            clients: venueClients,
          };

          await context.Venue.updateVenue(venueData, updateVenueData);

          clientProjects.push({
            id: singleVenue.SK,
            name: singleVenue.name,
          });
          updateData.projects = clientProjects;
        }

        //*** FINALLY update the client */
        const clientUpdate = await context.Client.updateClient(
          clientData,
          updateData
        );

        console.log("client updated", clientUpdate);

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
    addProject: async (_, args, context) => {
      try {
        template = {
          ...args,
          clients: [],
          planners: [],
          venues: [],
        };

        return await context.Project.addProject(template);
      } catch (error) {
        console.error(error);
        throw new Error("An error occurred while adding a project.");
      }
    },
    updateProject: async (_, args, context) => {
      try {
        const projectData = {
          PK: args.PK,
          SK: args.SK,
        };
        const updateData = { ...args };
        delete updateData.PK; // Remove PK from updateData
        delete updateData.SK; // Remove SK from updateData

        const project = await context.Project.getSingleProject(projectData);

        if (!project) {
          throw new Error("Project not found");
        }

        let projectPlanners = [];
        if (project.planners) {
          projectPlanners.push(...project.planners);
        }

        //* check if a new planner was supplied
        if (args.planners) {
          if (
            projectPlanners.some((planner) => planner.id === args.planners[0].id)
          ) {
            throw new Error("Planner Already Exists", "DUPLICATE_PLANNER");
          }

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

          const plannerClients = singlePlanner.clients;

          plannerClients.push({ id: project.SK, name: project.name });

          console.log("plannerClients " + plannerClients);

          const updatePlannerData = {
            clients: plannerClients,
          };

          await context.Planner.updatePlanner(plannerData, updatePlannerData);

          projectPlanners.push({
            id: singlePlanner.SK,
            name: singlePlanner.name,
          });
          updateData.planners = projectPlanners;
        }

        let projectVenues = [];
        if (project.venues) {
          projectVenues.push(...project.venues);
        }

        //* check if a new Venue was supplied
        if (args.venues) {
          if (
            projectVenues.some((venues) => venues.id === args.venues[0].id)
          ) {
            throw new Error("VENUE Already Exists", "DUPLICATE_VENUE");
          }

          const venueData = {
            PK: args.PK,
            SK: args.venues[0].id, // {id: "PLANER::**", name: "JACK"}
          };

          const singleVenue = await context.Venue.getSingleVenue(
            venueData
          );

          if (!singleVenue) {
            throw new Error("Venue not found");
          }

          const venueClients = singleVenue.clients;

          venueClients.push({ id: project.SK, name: project.name });

          console.log("venueClients " + venueClients);

          const updateVenueData = {
            clients: venueClients,
          };

          await context.Venue.updateVenue(venueData, updateVenueData);

          projectVenues.push({
            id: singleVenue.SK,
            name: singleVenue.name,
          });
          updateData.venues = projectVenues;
        }

        //*** FINALLY update the project */
        const projectUpdate = await context.Project.updateProject(
          projectData,
          updateData
        );

        console.log("project updated", projectUpdate);

        return projectUpdate;
      } catch (error) {
        console.error(error);
        throw new Error("An error occurred while updating a project.");
      }
    },
    deleteClient: async (_, args, context) => {
      try {
        return await context.Project.deleteProject(args);
      } catch (error) {
        console.error(error);
        throw new Error("An error occurred while deleting a project.");
      }
    },
  },
};

module.exports = resolvers;
