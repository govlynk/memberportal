import { create } from "zustand";
import { generateClient } from "aws-amplify/data";

const client = generateClient();

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
						error: null,
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
		set({ loading: true, error: null });
		try {
			const response = await client.models.Company.create(companyData);
			console.log("response", response);

			if (!response?.data?.id) {
				throw new Error("Company creation failed - invalid response");
			}

			const company = response.data;

			set((state) => ({
				companies: [...state.companies, company],
				loading: false,
				error: null,
			}));

			return company;
		} catch (err) {
			console.error("Create company error:", err);
			const errorMessage = err.message || "Failed to create company";
			set({ error: errorMessage, loading: false });
			throw new Error(errorMessage);
		}
	},

	updateCompany: async (id, updates) => {
		set({ loading: true, error: null });
		try {
			const response = await client.models.Company.update({
				id,
				...updates,
			});

			if (!response?.data?.id) {
				throw new Error("Company update failed - invalid response");
			}

			const company = response.data;

			set((state) => ({
				companies: state.companies.map((c) => (c.id === id ? company : c)),
				loading: false,
				error: null,
			}));

			return company;
		} catch (err) {
			console.error("Update company error:", err);
			const errorMessage = err.message || "Failed to update company";
			set({ error: errorMessage, loading: false });
			throw new Error(errorMessage);
		}
	},

	removeCompany: async (id) => {
		set({ loading: true, error: null });
		try {
			await client.models.Company.delete({ id });

			set((state) => ({
				companies: state.companies.filter((c) => c.id !== id),
				loading: false,
				error: null,
			}));
		} catch (err) {
			console.error("Remove company error:", err);
			const errorMessage = err.message || "Failed to remove company";
			set({ error: errorMessage, loading: false });
			throw new Error(errorMessage);
		}
	},

	cleanup: () => {
		const { subscription } = get();
		if (subscription) {
			subscription.unsubscribe();
		}
	},
}));
