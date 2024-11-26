import { create } from "zustand";
import { generateClient } from "aws-amplify/data";

const client = generateClient({
	authMode: "userPool",
});

export const useTeamStore = create((set, get) => ({
	teams: [],
	loading: false,
	error: null,
	subscription: null,

	fetchTeams: async (companyId) => {
		set({ loading: true });
		try {
			const subscription = client.models.Team.observeQuery({
				filter: { companyId: { eq: companyId } },
				include: {
					members: {
						include: {
							contact: true,
						},
					},
				},
			}).subscribe({
				next: ({ items }) => {
					set({
						teams: items,
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

	addTeam: async ({ companyId, name, description }) => {
		set({ loading: true });
		try {
			const team = await client.models.Team.create({
				companyId,
				name,
				description,
			});

			set((state) => ({
				teams: [...state.teams, team],
				loading: false,
				error: null,
			}));

			return team;
		} catch (err) {
			console.error("Create team error:", err);
			set({ error: err.message || "Failed to create team", loading: false });
			throw err;
		}
	},

	addTeamMember: async ({ teamId, contactId, role }) => {
		set({ loading: true });
		try {
			const teamMember = await client.models.TeamMember.create({
				teamId,
				contactId,
				role,
			});

			// Refresh the teams to get updated data
			const team = await client.models.Team.get({
				id: teamId,
				include: {
					members: {
						include: {
							contact: true,
						},
					},
				},
			});

			set((state) => ({
				teams: state.teams.map((t) => (t.id === teamId ? team : t)),
				loading: false,
				error: null,
			}));

			return teamMember;
		} catch (err) {
			console.error("Add team member error:", err);
			set({ error: err.message || "Failed to add team member", loading: false });
			throw err;
		}
	},

	updateTeam: async (id, updates) => {
		try {
			const updatedTeam = await client.models.Team.update({
				id,
				...updates,
			});

			set((state) => ({
				teams: state.teams.map((t) => (t.id === id ? updatedTeam : t)),
				error: null,
			}));

			return updatedTeam;
		} catch (err) {
			console.error("Error updating team:", err);
			set({ error: "Failed to update team" });
			throw err;
		}
	},

	updateTeamMember: async (teamMemberId, updates) => {
		try {
			const updatedMember = await client.models.TeamMember.update({
				id: teamMemberId,
				...updates,
			});

			// Refresh the teams to get updated data
			const team = await client.models.Team.get({
				id: updatedMember.teamId,
				include: {
					members: {
						include: {
							contact: true,
						},
					},
				},
			});

			set((state) => ({
				teams: state.teams.map((t) => (t.id === updatedMember.teamId ? team : t)),
				error: null,
			}));

			return updatedMember;
		} catch (err) {
			console.error("Error updating team member:", err);
			set({ error: "Failed to update team member" });
			throw err;
		}
	},

	removeTeamMember: async (teamMemberId) => {
		try {
			const teamMember = await client.models.TeamMember.get({ id: teamMemberId });
			if (!teamMember) throw new Error("Team member not found");

			await client.models.TeamMember.delete({ id: teamMemberId });

			// Refresh the teams to get updated data
			const team = await client.models.Team.get({
				id: teamMember.teamId,
				include: {
					members: {
						include: {
							contact: true,
						},
					},
				},
			});

			set((state) => ({
				teams: state.teams.map((t) => (t.id === teamMember.teamId ? team : t)),
				error: null,
			}));
		} catch (err) {
			console.error("Error removing team member:", err);
			set({ error: "Failed to remove team member" });
			throw err;
		}
	},

	removeTeam: async (id) => {
		try {
			// First remove all team members
			const teamMembers = await client.models.TeamMember.list({
				filter: { teamId: { eq: id } },
			});

			for (const member of teamMembers.data) {
				await client.models.TeamMember.delete({ id: member.id });
			}

			// Then remove the team
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
