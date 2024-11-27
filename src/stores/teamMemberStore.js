import { create } from "zustand";
import { generateClient } from "aws-amplify/api";

const client = generateClient({
	authMode: "userPool",
});

export const useTeamMemberStore = create((set, get) => ({
	teamMembers: [],
	loading: false,
	error: null,
	subscription: null,

	fetchTeamMembers: async (teamId) => {
		console.log("TeamMemberStore: Starting fetchTeamMembers for teamId:", teamId);
		if (!teamId) {
			console.error("TeamMemberStore: No teamId provided");
			set({ error: "Team ID is required", loading: false });
			return;
		}

		set({ loading: true });
		try {
			const subscription = client.models.TeamMember.observeQuery({
				filter: { teamId: { eq: teamId } },
				include: {
					contact: true,
				},
			}).subscribe({
				next: ({ items }) => {
					console.log("TeamMemberStore: Received team members update:", items);
					set({
						teamMembers: items,
						loading: false,
						error: null,
					});
				},
				error: (err) => {
					console.error("TeamMemberStore: Subscription error:", err);
					set({ error: "Failed to fetch team members", loading: false });
				},
			});
			set({ subscription });
		} catch (err) {
			console.error("TeamMemberStore: Error in fetchTeamMembers:", err);
			set({ error: "Failed to fetch team members", loading: false });
		}
	},

	addTeamMember: async ({ teamId, contactId, role }) => {
		console.log("TeamMemberStore: Adding team member:", { teamId, contactId, role });
		set({ loading: true });
		try {
			// Check if contact is already a member of any team
			const existingMember = await client.models.TeamMember.list({
				filter: { contactId: { eq: contactId } },
			});

			if (existingMember.data?.length > 0) {
				throw new Error("Contact is already a member of another team");
			}

			const teamMember = await client.models.TeamMember.create({
				teamId,
				contactId,
				role,
			});

			set((state) => ({
				teamMembers: [...state.teamMembers, teamMember],
				loading: false,
				error: null,
			}));
			return teamMember;
		} catch (err) {
			console.error("TeamMemberStore: Error adding team member:", err);
			set({ error: err.message || "Failed to add team member", loading: false });
			throw err;
		}
	},

	updateTeamMember: async (id, updates) => {
		console.log("TeamMemberStore: Updating team member:", { id, updates });
		set({ loading: true });
		try {
			const updatedMember = await client.models.TeamMember.update({
				id,
				...updates,
			});

			set((state) => ({
				teamMembers: state.teamMembers.map((member) => (member.id === id ? updatedMember : member)),
				loading: false,
				error: null,
			}));
			return updatedMember;
		} catch (err) {
			console.error("TeamMemberStore: Error updating team member:", err);
			set({ error: "Failed to update team member", loading: false });
			throw err;
		}
	},

	removeTeamMember: async (id) => {
		console.log("TeamMemberStore: Removing team member:", id);
		set({ loading: true });
		try {
			await client.models.TeamMember.delete({ id });

			set((state) => ({
				teamMembers: state.teamMembers.filter((member) => member.id !== id),
				loading: false,
				error: null,
			}));
		} catch (err) {
			console.error("TeamMemberStore: Error removing team member:", err);
			set({ error: "Failed to remove team member", loading: false });
			throw err;
		}
	},

	cleanup: () => {
		console.log("TeamMemberStore: Cleaning up subscription");
		const { subscription } = get();
		if (subscription) {
			subscription.unsubscribe();
			set({ subscription: null });
		}
	},
}));
