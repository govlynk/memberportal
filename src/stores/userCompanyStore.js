import { create } from "zustand";
import { generateClient } from "aws-amplify/data";
import { useAuthStore } from "./authStore";

const client = generateClient({
	authMode: "userPool",
});

export const useUserCompanyStore = create((set, get) => ({
	userCompanies: [],
	activeCompanyId: null,
	loading: false,
	error: null,
	subscription: null,

	fetchUserCompanies: async () => {
		set({ loading: true });
		try {
			const currentUser = useAuthStore.getState().user;
			if (!currentUser?.sub) {
				throw new Error("User not authenticated");
			}

			// Query UserCompanyRole to get all companies associated with the user
			const subscription = client.models.UserCompanyRole.observeQuery({
				filter: { userId: { eq: currentUser.sub } },
			}).subscribe({
				next: async ({ items }) => {
					// Fetch full company details for each association
					const companiesWithDetails = await Promise.all(
						items.map(async (ucr) => {
							const company = await client.models.Company.get({ id: ucr.companyId });
							return {
								...company,
								roleId: ucr.roleId,
								userCompanyRoleId: ucr.id,
								status: ucr.status,
							};
						})
					);

					set((state) => ({
						userCompanies: companiesWithDetails,
						// Set active company to first one if not already set
						activeCompanyId: state.activeCompanyId || (companiesWithDetails[0]?.id ?? null),
						loading: false,
					}));
				},
				error: (err) => {
					console.error("Fetch user companies error:", err);
					set({ error: "Failed to fetch user companies", loading: false });
				},
			});
			set({ subscription });
		} catch (err) {
			console.error("Fetch user companies error:", err);
			set({ error: "Failed to fetch user companies", loading: false });
		}
	},

	setActiveCompany: (companyId) => {
		set({ activeCompanyId: companyId });
	},

	getActiveCompany: () => {
		const state = get();
		return state.userCompanies.find((company) => company.id === state.activeCompanyId);
	},

	associateUserWithCompany: async (companyId, roleId = "TEAM_MEMBER") => {
		set({ loading: true });
		try {
			const currentUser = useAuthStore.getState().user;
			if (!currentUser?.sub) {
				throw new Error("User not authenticated");
			}

			// Create the association in UserCompanyRole
			const association = await client.models.UserCompanyRole.create({
				userId: currentUser.sub,
				companyId,
				roleId,
				status: "ACTIVE",
			});

			// Fetch the complete company details
			const company = await client.models.Company.get({ id: companyId });

			const newCompany = {
				...company,
				roleId,
				userCompanyRoleId: association.id,
				status: "ACTIVE",
			};

			set((state) => ({
				userCompanies: [...state.userCompanies, newCompany],
				// Set as active company if it's the first one
				activeCompanyId: state.activeCompanyId || newCompany.id,
				loading: false,
				error: null,
			}));

			return association;
		} catch (err) {
			console.error("Associate user with company error:", err);
			set({ error: err.message || "Failed to associate user with company", loading: false });
			throw err;
		}
	},

	removeUserCompanyAssociation: async (userCompanyRoleId) => {
		try {
			await client.models.UserCompanyRole.delete({
				id: userCompanyRoleId,
			});

			set((state) => {
				const newCompanies = state.userCompanies.filter((uc) => uc.userCompanyRoleId !== userCompanyRoleId);

				// Update active company if the removed one was active
				const removedCompany = state.userCompanies.find((uc) => uc.userCompanyRoleId === userCompanyRoleId);

				let newActiveCompanyId = state.activeCompanyId;
				if (removedCompany?.id === state.activeCompanyId) {
					newActiveCompanyId = newCompanies[0]?.id ?? null;
				}

				return {
					userCompanies: newCompanies,
					activeCompanyId: newActiveCompanyId,
					error: null,
				};
			});
		} catch (err) {
			console.error("Remove user company association error:", err);
			set({ error: "Failed to remove user company association" });
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
