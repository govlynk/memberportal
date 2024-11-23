import { create } from "zustand";
import { generateClient } from "aws-amplify/data";
import { useAuthStore } from "./authStore";

const client = generateClient({
	authMode: "userPool",
});

export const useCompanyStore = create((set, get) => ({
	companies: [],
	loading: false,
	error: null,
	subscription: null,

	fetchCompanies: async () => {
		set({ loading: true });
		try {
			const subscription = client.models.Company.observeQuery().subscribe({
				next: ({ items }) => {
					set({
						companies: items,
						loading: false,
					});
				},
				error: (err) => {
					console.error("Fetch companies error:", err);
					set({ error: "Failed to fetch companies", loading: false });
				},
			});
			set({ subscription });
		} catch (err) {
			console.error("Fetch companies error:", err);
			set({ error: "Failed to fetch companies", loading: false });
		}
	},

	addCompany: async (companyData) => {
		set({ loading: true });
		try {
			const currentUser = useAuthStore.getState().user;
			if (!currentUser?.sub) {
				throw new Error("User not authenticated");
			}

			const company = await client.models.Company.create({
				legalBusinessName: companyData.legalBusinessName,
				dbaName: companyData.dbaName,
				uei: companyData.uei,
				cageCode: companyData.cageCode,
				ein: companyData.ein,
				companyEmail: companyData.companyEmail,
				companyPhoneNumber: companyData.companyPhoneNumber,
				companyWebsite: companyData.companyWebsite,
				status: companyData.status || "ACTIVE",
			});

			await client.models.UserCompanyRole.create({
				userId: currentUser.sub,
				companyId: company.id,
				roleId: "ADMIN",
				status: "ACTIVE",
			});

			set((state) => ({
				companies: [...state.companies, company],
				loading: false,
				error: null,
			}));

			return company;
		} catch (err) {
			console.error("Create company error:", err);
			set({ error: err.message || "Failed to create company", loading: false });
			throw err;
		}
	},

	updateCompany: async (id, updates) => {
		try {
			const updatedCompany = await client.models.Company.update({
				id,
				...updates,
			});

			set((state) => ({
				companies: state.companies.map((company) => (company.id === id ? updatedCompany : company)),
				error: null,
			}));
			return updatedCompany;
		} catch (err) {
			console.error("Error updating company:", err);
			set({ error: "Failed to update company" });
			throw err;
		}
	},

	removeCompany: async (id) => {
		try {
			// First remove all UserCompanyRoles associated with this company
			const userCompanyRoles = await client.models.UserCompanyRole.query({
				companyId: { eq: id },
			});

			for (const role of userCompanyRoles.data) {
				await client.models.UserCompanyRole.delete({ id: role.id });
			}

			// Then remove all team members associated with this company
			const teams = await client.models.Team.query({
				companyId: { eq: id },
			});

			for (const team of teams.data) {
				await client.models.Team.delete({ id: team.id });
			}

			// Finally remove the company
			await client.models.Company.delete({ id });

			set((state) => ({
				companies: state.companies.filter((company) => company.id !== id),
				error: null,
			}));
		} catch (err) {
			console.error("Error removing company:", err);
			set({ error: "Failed to remove company" });
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
