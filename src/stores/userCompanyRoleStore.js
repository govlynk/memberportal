import { create } from "zustand";
import { generateClient } from "aws-amplify/data";

const client = generateClient({
	authMode: "userPool",
});

export const useUserCompanyRoleStore = create((set, get) => ({
	userCompanyRoles: [],
	loading: false,
	error: null,
	subscription: null,

	fetchUserCompanyRoles: async (userId = null) => {
		set({ loading: true, error: null });
		try {
			console.log("Fetching user company roles with userId:", userId);
			const filter = userId ? { userId: { eq: userId } } : undefined;

			// First, get all UserCompanyRoles
			const subscription = client.models.UserCompanyRole.observeQuery({
				filter,
			}).subscribe({
				next: async ({ items }) => {
					console.log("Received user company roles:", items);

					// Fetch related user and company data for each role
					const rolesWithRelations = await Promise.all(
						items.map(async (role) => {
							const [user, company] = await Promise.all([
								client.models.User.get({ id: role.userId }),
								client.models.Company.get({ id: role.companyId }),
							]);

							return {
								...role,
								user,
								company,
							};
						})
					);

					console.log("Roles with relations:", rolesWithRelations);

					set({
						userCompanyRoles: rolesWithRelations,
						loading: false,
					});
				},
				error: (err) => {
					console.error("Fetch user company roles error:", err);
					set({ error: "Failed to fetch user company roles", loading: false });
				},
			});
			set({ subscription });
		} catch (err) {
			console.error("Fetch user company roles error:", err);
			set({ error: "Failed to fetch user company roles", loading: false });
		}
	},

	addUserCompanyRole: async (roleData) => {
		set({ loading: true, error: null });
		try {
			console.log("Creating user company role with data:", roleData);
			const userCompanyRole = await client.models.UserCompanyRole.create({
				userId: roleData.userId,
				companyId: roleData.companyId,
				roleId: roleData.roleId,
				status: roleData.status || "ACTIVE",
			});

			// Fetch the related user and company data
			const [user, company] = await Promise.all([
				client.models.User.get({ id: userCompanyRole.userId }),
				client.models.Company.get({ id: userCompanyRole.companyId }),
			]);

			const completeRole = {
				...userCompanyRole,
				user,
				company,
			};

			console.log("Created role with complete data:", completeRole);

			set((state) => ({
				userCompanyRoles: [...state.userCompanyRoles, completeRole],
				loading: false,
				error: null,
			}));

			return completeRole;
		} catch (err) {
			console.error("Create user company role error:", err);
			set({ error: err.message || "Failed to create user company role", loading: false });
			throw err;
		}
	},

	updateUserCompanyRole: async (id, updates) => {
		set({ loading: true, error: null });
		try {
			console.log("Updating user company role:", { id, updates });
			const updatedRole = await client.models.UserCompanyRole.update({
				id,
				...updates,
			});

			// Fetch the related user and company data
			const [user, company] = await Promise.all([
				client.models.User.get({ id: updatedRole.userId }),
				client.models.Company.get({ id: updatedRole.companyId }),
			]);

			const completeRole = {
				...updatedRole,
				user,
				company,
			};

			console.log("Updated role with complete data:", completeRole);

			set((state) => ({
				userCompanyRoles: state.userCompanyRoles.map((role) => (role.id === id ? completeRole : role)),
				loading: false,
				error: null,
			}));
			return completeRole;
		} catch (err) {
			console.error("Error updating user company role:", err);
			set({ error: "Failed to update user company role", loading: false });
			throw err;
		}
	},

	removeUserCompanyRole: async (id) => {
		set({ loading: true, error: null });
		try {
			console.log("Removing user company role:", id);
			await client.models.UserCompanyRole.delete({
				id,
			});
			set((state) => ({
				userCompanyRoles: state.userCompanyRoles.filter((role) => role.id !== id),
				loading: false,
				error: null,
			}));
		} catch (err) {
			console.error("Error removing user company role:", err);
			set({ error: "Failed to remove user company role", loading: false });
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
