import { create } from 'zustand';
import { generateClient } from 'aws-amplify/data';

const client = generateClient();

export const useTeamStore = create((set, get) => ({
  teams: [],
  loading: false,
  error: null,
  subscription: null,

  fetchTeams: async (companyId) => {
    set({ loading: true });
    try {
      // First fetch all teams for the company
      const subscription = client.models.Team.observeQuery({
        filter: { companyId: { eq: companyId } }
      }).subscribe({
        next: async ({ items }) => {
          // For each team, fetch the associated contact details
          const teamsWithContacts = await Promise.all(
            items.map(async (team) => {
              const contact = await client.models.Contact.get({ id: team.contactId });
              return { ...team, contact };
            })
          );

          set({
            teams: teamsWithContacts,
            loading: false,
          });
        },
        error: (err) => {
          console.error("Fetch teams error:", err);
          set({ error: "Failed to fetch teams", loading: false });
        },
      });
      set({ subscription });
    } catch (err) {
      console.error("Fetch teams error:", err);
      set({ error: "Failed to fetch teams", loading: false });
    }
  },

  addTeam: async ({ companyId, role, contact }) => {
    set({ loading: true });
    try {
      // First create the contact
      const newContact = await client.models.Contact.create({
        firstName: contact.firstName,
        lastName: contact.lastName,
        title: contact.title,
        department: contact.department,
        contactEmail: contact.contactEmail,
        contactMobilePhone: contact.contactMobilePhone,
        contactBusinessPhone: contact.contactBusinessPhone,
      });

      // Then create the team member with the contact ID
      const team = await client.models.Team.create({
        companyId,
        contactId: newContact.id,
        role,
      });

      const teamWithContact = { ...team, contact: newContact };

      set((state) => ({
        teams: [...state.teams, teamWithContact],
        loading: false,
        error: null,
      }));

      return teamWithContact;
    } catch (err) {
      console.error("Create team error:", err);
      set({ error: err.message || "Failed to create team", loading: false });
      throw err;
    }
  },

  updateTeam: async (id, updates) => {
    try {
      const team = await client.models.Team.get({ id });
      if (!team) throw new Error("Team not found");

      // Update contact information
      if (updates.contact) {
        await client.models.Contact.update({
          id: team.contactId,
          ...updates.contact,
        });
      }

      // Update team information
      const updatedTeam = await client.models.Team.update({
        id,
        role: updates.role,
      });

      // Fetch updated contact
      const updatedContact = await client.models.Contact.get({ id: team.contactId });
      const teamWithContact = { ...updatedTeam, contact: updatedContact };

      set((state) => ({
        teams: state.teams.map((t) => t.id === id ? teamWithContact : t),
        error: null,
      }));

      return teamWithContact;
    } catch (err) {
      console.error("Error updating team:", err);
      set({ error: "Failed to update team" });
      throw err;
    }
  },

  removeTeam: async (id) => {
    try {
      const team = await client.models.Team.get({ id });
      if (!team) throw new Error("Team not found");

      // Delete the contact first
      await client.models.Contact.delete({ id: team.contactId });

      // Then delete the team
      await client.models.Team.delete({ id });

      set((state) => ({
        teams: state.teams.filter((t) => t.id !== id),
        error: null,
      }));
    } catch (err) {
      console.error("Error removing team:", err);
      set({ error: "Failed to remove team" });
      throw err;
    }
  },

  cleanup: () => {
    const { subscription } = get();
    if (subscription) {
      subscription.unsubscribe();
    }
  },
}));