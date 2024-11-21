import { create } from "zustand";
import { generateClient } from "aws-amplify/data";

const client = generateClient();

export const useUserStore = create((set, get) => ({
	users: [],
	loading: false,
	error: null,
	subscription: null,

	fetchUsers: async () => {
		set({ loading: true });
		try {
			const subscription = client.models.User.observeQuery().subscribe({
				next: ({ items }) => {
					set({
						users: items,
						loading: false,
					});
				},
				error: (err) => {
					console.error("Fetch users error:", err);
					// Handle auth errors specifically
					if (err.name === "NotAuthorizedException") {
						set({ error: "Session expired. Please sign in again.", loading: false });
					} else {
						set({ error: "Failed to fetch users", loading: false });
					}
				},
			});
			set({ subscription });
		} catch (err) {
			console.error("Fetch users error:", err);
			// Handle auth errors specifically
			if (err.name === "NotAuthorizedException") {
				set({ error: "Session expired. Please sign in again.", loading: false });
			} else {
				set({ error: "Failed to fetch users", loading: false });
			}
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
