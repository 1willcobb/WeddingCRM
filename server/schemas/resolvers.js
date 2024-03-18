const { json } = require("express");
const { ApolloError } = require("apollo-server-errors");

const resolvers = {
  Query: {
    hello: () => "Hello, worlds!",
    sup: () => "Sup, world!",
    getContacts: async (parent, args, context) => {
      return await context.Contact.getContacts();
    },
    getSingleContact: async (parent, args, context) => {
      return await context.Contact.getSingleContact(args);
    },
    getProjects: async (parent, args, context) => {
      return await context.Project.getProjects();
    },
    getSingleProject: async (parent, args, context) => {
      return await context.Project.getSingleProject(args);
    },
  },
  Mutation: {
    addContact: async (_, args, context) => {
      try {
        template = {
          ...args,
          projects: [],
        };

        return await context.Contact.addContact(template);
      } catch (error) {
        console.error(error);
        throw new Error("An error occurred while adding a client.");
      }
    },
    updateContact: async (_, args, context) => {
      try {
        // Destructure PK and SK for readability
        const { PK, SK } = args;
        const contactData = { PK, SK };

        // Validate and extract contact type from SK
        if (!SK.startsWith("CONTACT::")) {
          throw new Error("Invalid contact type");
        }
        const [, contactType, contactUUID] = SK.split("::");
        if (!["VENDOR", "PLANNER", "VENUE", "CLIENT"].includes(contactType)) {
          throw new Error("Unknown contact type");
        }

        // Generate the property name dynamically
        const projectArrayType = contactType.toLowerCase() + "s"; // e.g., "vendors"

        // Remove PK and SK from the update data
        const updateData = { ...args };
        delete updateData.PK;
        delete updateData.SK;

        // Retrieve the single contact
        const contact = await context.Contact.getSingleContact(contactData);
        if (!contact) {
          throw new Error("Contact not found");
        }

        // Logic for adding a new project to the contact
        if (args.projects) {
          let contactProjects = contact.projects || [];
          if (contactProjects.some((project) => project.id === args.projects)) {
            throw new Error("Project Already Exists", "DUPLICATE_PROJECT");
          }

          const ProjectData = { PK, SK: args.projects };
          const singleProject = await context.Project.getSingleProject(
            ProjectData
          );
          if (!singleProject) {
            throw new Error("Project not found");
          }

          // Retrieve or initialize the array for the specific contact type on the Project
          const projectContacts = singleProject[projectArrayType] || [];
          projectContacts.push({ id: contact.SK, name: contact.name });

          console.log(`Project updated: `, projectContacts);

          // Prepare the update data for the project
          const updateProjectData = {};
          updateProjectData[projectArrayType] = projectContacts; // Dynamically update the correct array

          // Update the project with the new contact information
          await context.Project.updateProject(ProjectData, updateProjectData);

          console.log("Project updated------------------------");
          // Update the contact's projects list
          contactProjects.push({
            id: singleProject.SK,
            name: singleProject.name,
          });
          updateData.projects = contactProjects;
        }

        // Update the contact
        const contactUpdate = await context.Contact.updateContact(
          contactData,
          updateData
        );
        if (!contactUpdate) {
          throw new Error("Failed to update contact");
        }

        // Confirm the contact has been updated
        const confirmUpdatedContact = await context.Contact.getSingleContact(
          contactData
        );
        console.log("Contact updated", confirmUpdatedContact);

        return confirmUpdatedContact;
      } catch (error) {
        console.error(error);
        throw new Error("An error occurred while updating the contact.");
      }
    },
    deleteContact: async (_, args, context) => {
      const { PK, SK } = args;
      console.log("deleting contact");

      try {
        const contact = await context.Contact.getSingleContact(args);
        if (!contact) {
          throw new Error("Contact not found");
        }

        if (!SK.startsWith("CONTACT::")) {
          throw new Error("Invalid contact type");
        }

        const [, contactType, contactUUID] = SK.split("::");
        if (!["VENDOR", "PLANNER", "VENUE", "CLIENT"].includes(contactType)) {
          throw new Error("Unknown contact type");
        }
        if (contact.projects) {
          const projectArrayType = contactType.toLowerCase() + "s"; // e.g., "vendors"

          for (let project of contact.projects) {
            const ProjectData = { PK: PK, SK: project.id };

            const singleProject = await context.Project.getSingleProject(
              ProjectData
            );
            if (!singleProject) {
              throw new Error("Project not found");
            }

            const projectContacts = singleProject[projectArrayType] || [];
            const updatedProjectContacts = projectContacts.filter(
              (contact) => contact.id !== SK
            );

            const updateProjectData = {};
            updateProjectData[projectArrayType] = updatedProjectContacts;

            console.log(
              `${projectArrayType} updated: `,
              updatedProjectContacts
            );

            await context.Project.updateProject(ProjectData, updateProjectData);
          }
        }

        await context.Contact.deleteContact(args);

        return contact;
      } catch (error) {
        console.error(error);
        throw new Error("An error occurred while deleting a client.");
      }
    },
    addProject: async (_, args, context) => {
      try {
        template = {
          ...args,
          clients: [],
          planners: [],
          venues: [],
          vendors: [],
        };

        return await context.Project.addProject(template);
      } catch (error) {
        console.error(error);
        throw new Error("An error occurred while adding a project.");
      }
    },
    //Updates must be done on the contact level
    updateProject: async (_, args, context) => {
      try {
        const { PK, SK } = args;
        const projectData = { PK, SK };

        const project = await context.Project.getSingleProject(args);

        if (!project) {
          throw new Error("Project not found");
        }

        // Prepare the update data object
        let updateData = { ...args };
        delete updateData.PK;
        delete updateData.SK;

        // // Check for client, venue, planner, or vendor in args and add them to the project
        // if (args.client) {
        //   const client = await context.Contact.getSingleContact({
        //     PK,
        //     SK: args.client,
        //   });

        //   if (!client) {
        //     throw new Error("Client not found");
        //   }

        //   project.clients = project.clients || []; // Ensure the array exists
        //   project.clients.push({ id: args.client, name: client.name }); // Add the new client
        //   updateData.clients = project.clients; // Prepare update data

        //   const contactProjects = [
        //     ...client.projects,
        //     { id: project.SK, name: project.name },
        //   ];
        //   await context.Contact.updateContact(
        //     { PK, SK: args.client },
        //     { contactProjects }
        //   );
        // } else if (args.venue) {
        //   const venue = await context.Contact.getSingleContact({
        //     PK,
        //     SK: args.venue,
        //   });

        //   if (!venue) {
        //     throw new Error("venue not found");
        //   }

        //   project.venues = project.venues || []; // Ensure the array exists
        //   project.venues.push({ id: args.venue, name: venue.name }); // Add the new venue
        //   updateData.venues = project.venues; // Prepare update data
        //   const contactProjects = [
        //     ...venue.projects,
        //     { id: project.SK, name: project.name },
        //   ];
        //   await context.Contact.updateContact(
        //     { PK, SK: args.venue },
        //     { contactProjects }
        //   );
        // } else if (args.planner) {
        //   console.log("planner", args.planner);
        //   const planner = await context.Contact.getSingleContact({
        //     PK,
        //     SK: args.planner,
        //   });

        //   if (!planner) {
        //     throw new Error("planner not found");
        //   }
        //   project.planners = project.planners || []; // Ensure the array exists
        //   project.planners.push({ id: args.planner, name: planner.name }); // Add the new planner
        //   updateData.planners = project.planners; // Prepare update data
        //   const contactProjects = [
        //     ...planner.projects,
        //     { id: project.SK, name: project.name },
        //   ];
        //   await context.Contact.updateContact(
        //     { PK, SK: args.planner },
        //     { contactProjects }
        //   );
        // } else if (args.vendor) {
        //   const vendor = await context.Contact.getSingleContact({
        //     PK,
        //     SK: args.vendor,
        //   });

        //   if (!vendor) {
        //     throw new Error("vendor not found");
        //   }
        //   project.vendors = project.vendors || []; // Ensure the array exists
        //   project.vendors.push({ id: args.vendor, name: vendor.name }); // Add the new vendor
        //   updateData.vendors = project.vendors; // Prepare update data
        //   const contactProjects = [
        //     ...vendor.projects,
        //     { id: project.SK, name: project.name },
        //   ];
        //   await context.Contact.updateContact(
        //     { PK, SK: args.vendor },
        //     { contactProjects }
        //   );
        // }

        // delete updateData.vendor;
        // delete updateData.planner;
        // delete updateData.client;
        // delete updateData.venue;

        // Update the project
        const projectUpdate = await context.Project.updateProject(
          projectData,
          updateData
        );
        if (!projectUpdate) {
          throw new Error("Failed to update contact");
        }

        // Confirm the contact has been updated
        const confirmUpdatedProject = await context.Project.getSingleProject(
          projectData
        );

        return confirmUpdatedProject;
      } catch (error) {
        console.error(error);
        throw new Error("An error occurred while updating the contact.");
      }
    },
    deleteProject: async (_, args, context) => {
      try {
        const project = await context.Project.getSingleProject(args);
        if (!project) {
          throw new Error("Project not found");
        }

        console.log("project Found", project);

        if (project.clients) {
          for (let client of project.clients) {
            const contactData = { PK: args.PK, SK: client.id };
            const contact = await context.Contact.getSingleContact(contactData);
            const contactProjects = contact.projects.filter(
              (project) => project.id !== args.SK
            );
            await context.Contact.updateContact(contactData, { projects: contactProjects });
          }
        }

        if (project.venues) {
          for (let client of project.venues) {
            const contactData = { PK: args.PK, SK: client.id };
            const contact = await context.Contact.getSingleContact(contactData);
            const contactProjects = contact.projects.filter(
              (project) => project.id !== args.SK
            );
            await context.Contact.updateContact(contactData, { projects: contactProjects });
          }
        }

        if (project.planners) {
          for (let client of project.planners) {
            const contactData = { PK: args.PK, SK: client.id };
            const contact = await context.Contact.getSingleContact(contactData);
            const contactProjects = contact.projects.filter(
              (project) => project.id !== args.SK
            );
            await context.Contact.updateContact(contactData, { projects: contactProjects });
          }
        }

        if (project.vendors) {
          for (let client of project.vendors) {
            const contactData = { PK: args.PK, SK: client.id };
            const contact = await context.Contact.getSingleContact(contactData);
            const contactProjects = contact.projects.filter(
              (project) => project.id !== args.SK
            );
            await context.Contact.updateContact(contactData, { projects: contactProjects });
          }
        }

        await context.Project.deleteProject(args);

        return project
      } catch (error) {
        console.error(error);
        throw new Error("An error occurred while deleting a project.");
      }
    },
  },
};

module.exports = resolvers;
