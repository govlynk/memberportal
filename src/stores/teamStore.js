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
			}));
		} catch (err) {
			console.error("Add team error:", err);
			set({ error: "Failed to add team", loading: false });
		}
	},

	removeTeam: async (teamId) => {
		set({ loading: true });
		try {
			await client.models.Team.delete({ id: teamId });
			set((state) => ({
				teams: state.teams.filter((team) => team.id !== teamId),
				loading: false,
			}));
		} catch (err) {
			console.error("Remove team error:", err);
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
