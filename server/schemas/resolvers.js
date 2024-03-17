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
    //*DONE
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
    //*DONE
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
    //TODO
    deleteContact: async (_, args, context) => {
      try {
        return await context.Contact.deleteContact(args);
      } catch (error) {
        console.error(error);
        throw new Error("An error occurred while deleting a client.");
      }
    },
    //*DONE
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
    //TODO
    updateProject: async (_, args, context) => {
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

          console.log(`${projectArrayType} updated: `, projectContacts);

          // Prepare the update data for the project
          const updateProjectData = {};
          updateProjectData[projectArrayType] = projectContacts; // Dynamically update the correct array

          // Update the project with the new contact information
          await context.Project.updateProject(ProjectData, updateProjectData);

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
    //TODO
    deleteProject: async (_, args, context) => {
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
