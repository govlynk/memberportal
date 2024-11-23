import { create } from "zustand";
import { generateClient } from "aws-amplify/data";
import { useAuthStore } from "./authStore";

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
			const filter = userId ? { userId: { eq: userId } } : undefined;

			const subscription = client.models.UserCompanyRole.observeQuery({
				filter,
			}).subscribe({
				next: async ({ items }) => {
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
			const { userId, companyId, roleId, status } = roleData;

			if (!userId || !companyId) {
				throw new Error("userId and companyId are required");
			}

			const userCompanyRole = await client.models.UserCompanyRole.create({
				userId,
				companyId,
				roleId,
				status: status || "ACTIVE",
			});

			const [user, company] = await Promise.all([
				client.models.User.get({ id: userCompanyRole.userId }),
				client.models.Company.get({ id: userCompanyRole.companyId }),
			]);

			const completeRole = {
				...userCompanyRole,
				user,
				company,
			};

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
			const updatedRole = await client.models.UserCompanyRole.update({
				id,
				...updates,
			});

			const [user, company] = await Promise.all([
				client.models.User.get({ id: updatedRole.userId }),
				client.models.Company.get({ id: updatedRole.companyId }),
			]);

			const completeRole = {
				...updatedRole,
				user,
				company,
			};

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
