import { create } from "zustand";
import { generateClient } from "aws-amplify/data";

const client = generateClient();

export const useTeamMemberStore = create((set) => ({
	teamMembers: [],
	loading: false,
	error: null,

	fetchTeamMembers: async (teamId) => {
		if (!teamId) {
			set({ error: "Team ID is required", loading: false });
			return;
		}

		set({ loading: true });
		try {
			const response = await client.models.TeamMember.list({
				filter: { teamId: { eq: teamId } },
				include: {
					contact: true,
				},
			});

			if (!response?.data) {
				throw new Error("Failed to fetch team members");
			}

			set({
				teamMembers: response.data,
				loading: false,
				error: null,
			});
		} catch (err) {
			console.error("Error fetching team members:", err);
			set({
				error: err.message || "Failed to fetch team members",
				loading: false,
			});
		}
	},

	addTeamMember: async ({ teamId, contactId, role }) => {
		if (!teamId || !contactId || !role) {
			throw new Error("Team ID, Contact ID, and Role are required");
		}

		set({ loading: true });
		try {
			// Check if contact is already a member
			const existingMember = await client.models.TeamMember.list({
				filter: {
					and: [{ teamId: { eq: teamId } }, { contactId: { eq: contactId } }],
				},
			});

			if (existingMember.data?.length > 0) {
				throw new Error("Contact is already a member of this team");
			}

			const response = await client.models.TeamMember.create({
				teamId,
				contactId,
				role,
				status: "ACTIVE",
			});

			if (!response?.data) {
				throw new Error("Failed to add team member");
			}

			set((state) => ({
				teamMembers: [...state.teamMembers, response.data],
				loading: false,
				error: null,
			}));

			return response.data;
		} catch (err) {
			console.error("Error adding team member:", err);
			set({
				error: err.message || "Failed to add team member",
				loading: false,
			});
			throw err;
		}
	},

	updateTeamMember: async (id, updates) => {
		if (!id) {
			throw new Error("Team member ID is required");
		}

		set({ loading: true });
		try {
			const response = await client.models.TeamMember.update({
				id,
				...updates,
			});

			if (!response?.data) {
				throw new Error("Failed to update team member");
			}

			set((state) => ({
				teamMembers: state.teamMembers.map((member) => (member.id === id ? response.data : member)),
				loading: false,
				error: null,
			}));

			return response.data;
		} catch (err) {
			console.error("Error updating team member:", err);
			set({
				error: err.message || "Failed to update team member",
				loading: false,
			});
			throw err;
		}
	},

	removeTeamMember: async (id) => {
		if (!id) {
			throw new Error("Team member ID is required");
		}

		set({ loading: true });
		try {
			await client.models.TeamMember.delete({ id });

			set((state) => ({
				teamMembers: state.teamMembers.filter((member) => member.id !== id),
				loading: false,
				error: null,
			}));
		} catch (err) {
			console.error("Error removing team member:", err);
			set({
				error: err.message || "Failed to remove team member",
				loading: false,
			});
			throw err;
		}
	},
}));
