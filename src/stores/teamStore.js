import { create } from "zustand";
import { generateClient } from "aws-amplify/data";
import { teamQueries } from "../utils/team/teamQueries";
import { teamMutations } from "../utils/team/teamMutations";

const client = generateClient({
	authMode: "userPool",
});

export const useTeamStore = create((set, get) => ({
	teams: [],
	loading: false,
	error: null,
	subscription: null,

	fetchTeams: async (companyId) => {
		console.log("TeamStore: Starting fetchTeams for companyId:", companyId);
		if (!companyId) {
			console.error("TeamStore: No companyId provided");
			set({ error: "Company ID is required", loading: false });
			return;
		}

		set({ loading: true });
		try {
			console.log("TeamStore: Setting up subscription");
			const subscription = teamQueries.observeTeams(client, companyId).subscribe({
				next: ({ items }) => {
					console.log("TeamStore: Received teams update:", items);
					set({
						teams: items,
						loading: false,
						error: null,
					});
				},
				error: (err) => {
					console.error("TeamStore: Subscription error:", err);
					set({ error: "Failed to fetch teams", loading: false });
				},
			});
			console.log("TeamStore: Subscription set up successfully");
			set({ subscription });
		} catch (err) {
			console.error("TeamStore: Error in fetchTeams:", err);
			set({ error: "Failed to fetch teams", loading: false });
		}
	},

	addTeam: async (teamData) => {
		console.log("TeamStore: Adding team:", teamData);
		set({ loading: true });
		try {
			const response = await teamMutations.createTeam(client, teamData);
			console.log("TeamStore: Team added successfully:", response);
			return response;
		} catch (err) {
			console.error("TeamStore: Error adding team:", err);
			set({ error: "Failed to add team", loading: false });
			throw err;
		}
	},

	updateTeam: async (id, updates) => {
		console.log("TeamStore: Updating team:", { id, updates });
		set({ loading: true });
		try {
			const response = await teamMutations.updateTeam(client, id, updates);
			console.log("TeamStore: Team updated successfully:", response);
			return response;
		} catch (err) {
			console.error("TeamStore: Error updating team:", err);
			set({ error: "Failed to update team", loading: false });
			throw err;
		}
	},

	removeTeam: async (teamId) => {
		console.log("TeamStore: Removing team:", teamId);
		set({ loading: true });
		try {
			await teamMutations.deleteTeam(client, teamId);
			set((state) => ({
				teams: state.teams.filter((team) => team.id !== teamId),
				loading: false,
			}));
		} catch (err) {
			console.error("TeamStore: Error removing team:", err);
			set({ error: "Failed to remove team", loading: false });
		}
	},

	cleanup: () => {
		const { subscription } = get();
		if (subscription) {
			subscription.unsubscribe();
			set({ subscription: null });
		}
	},
}));
