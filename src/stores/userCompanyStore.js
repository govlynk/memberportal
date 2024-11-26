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

	fetchUserCompanies: async () => {
		const currentUser = useAuthStore.getState().user;
		console.log("UserCompanyStore: Fetching companies for user:", currentUser?.id);

		if (!currentUser?.id) {
			console.log("UserCompanyStore: No user ID found, skipping fetch");
			return;
		}

		set({ loading: true, error: null });

		try {
			console.log("UserCompanyStore: Making API call to fetch user company roles");
			const response = await client.models.UserCompanyRole.list({
				filter: { userId: { eq: currentUser.id } },
			});

			console.log("UserCompanyStore: Raw API response:", response);

			if (!response?.data) {
				throw new Error("Failed to fetch user companies");
			}

			// Fetch full company details for each role
			const companiesWithDetails = await Promise.all(
				response.data.map(async (ucr) => {
					const companyResponse = await client.models.Company.get({ id: ucr.companyId });
					console.log("UserCompanyStore: Fetched company details:", companyResponse);

					return {
						...companyResponse.data,
						roleId: ucr.roleId,
						userCompanyRoleId: ucr.id,
						status: ucr.status,
					};
				})
			);

			console.log("UserCompanyStore: Processed companies with details:", companiesWithDetails);

			set((state) => {
				const newState = {
					userCompanies: companiesWithDetails,
					activeCompanyId: state.activeCompanyId || (companiesWithDetails[0]?.id ?? null),
					loading: false,
					error: null,
				};
				console.log("UserCompanyStore: Setting new state:", newState);
				return newState;
			});
		} catch (err) {
			console.error("UserCompanyStore: Error fetching companies:", err);
			set({
				error: err.message || "Failed to fetch user companies",
				loading: false,
				userCompanies: [],
			});
		}
	},

	setActiveCompany: (companyId) => {
		console.log("UserCompanyStore: Setting active company:", companyId);
		set({ activeCompanyId: companyId });
	},

	getActiveCompany: () => {
		const state = get();
		const activeCompany = state.userCompanies.find((company) => company.id === state.activeCompanyId);
		console.log("UserCompanyStore: Getting active company:", activeCompany);
		return activeCompany;
	},
}));
