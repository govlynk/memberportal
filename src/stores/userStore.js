import { create } from "zustand";
import { generateClient } from "aws-amplify/data";

const client = generateClient({
	authMode: "userPool",
});

export const useUserStore = create((set, get) => ({
	users: [],
	loading: false,
	error: null,
	subscription: null,

	fetchUsers: async () => {
		set({ loading: true });
		try {
			const subscription = client.models.User.observeQuery({
				include: {
					companies: {
						include: {
							company: true,
							role: true,
						},
					},
				},
			}).subscribe({
				next: ({ items }) => {
					set({
						users: items,
						loading: false,
					});
				},
				error: (err) => {
					console.error("Fetch users error:", err);
					set({ error: "Failed to fetch users", loading: false });
				},
			});
			set({ subscription });
		} catch (err) {
			console.error("Fetch users error:", err);
			set({ error: "Failed to fetch users", loading: false });
		}
	},

	addUser: async (userData) => {
		set({ loading: true });
		try {
			const user = await client.models.User.create({
				cognitoId: userData.cognitoId,
				email: userData.email,
				name: userData.name,
				phone: userData.phone,
				status: userData.status || "ACTIVE",
				lastLogin: new Date().toISOString(),
			});

			set((state) => ({
				users: [...state.users, user],
				loading: false,
				error: null,
			}));

			return user;
		} catch (err) {
			console.error("Create user error:", err);
			set({ error: err.message || "Failed to create user", loading: false });
			throw err;
		}
	},

	updateUser: async (id, updates) => {
		try {
			const updatedUser = await client.models.User.update({
				id,
				...updates,
			});

			set((state) => ({
				users: state.users.map((user) => (user.id === id ? updatedUser : user)),
				error: null,
			}));
			return updatedUser;
		} catch (err) {
			console.error("Error updating user:", err);
			set({ error: "Failed to update user" });
			throw err;
		}
	},

	removeUser: async (id) => {
		try {
			// First remove all UserCompanyRole associations
			const userCompanyRoles = await client.models.UserCompanyRole.query({
				filter: { userId: { eq: id } },
			});

			for (const role of userCompanyRoles.data) {
				await client.models.UserCompanyRole.delete({ id: role.id });
			}

			// Then delete the user
			await client.models.User.delete({
				id,
			});

			set((state) => ({
				users: state.users.filter((user) => user.id !== id),
				error: null,
			}));
		} catch (err) {
			console.error("Error removing user:", err);
			set({ error: "Failed to remove user" });
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
