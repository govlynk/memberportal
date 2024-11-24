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
						},
					},
					contact: true,
					todos: {
						include: {
							assignee: true,
						},
					},
				},
			}).subscribe({
				next: ({ items }) => {
					set({
						users: items,
						loading: false,
						error: null,
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
			// Validate required fields
			if (!userData.cognitoId || !userData.email || !userData.name) {
				throw new Error("Missing required fields: cognitoId, email, or name");
			}

			const user = await client.models.User.create({
				cognitoId: userData.cognitoId,
				email: userData.email.toLowerCase(),
				name: userData.name,
				phone: userData.phone || null,
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
		set({ loading: true });
		try {
			const updatedUser = await client.models.User.update({
				id,
				...updates,
				lastLogin: updates.lastLogin || new Date().toISOString(),
			});

			set((state) => ({
				users: state.users.map((user) => (user.id === id ? updatedUser : user)),
				loading: false,
				error: null,
			}));

			return updatedUser;
		} catch (err) {
			console.error("Error updating user:", err);
			set({ error: "Failed to update user", loading: false });
			throw err;
		}
	},

	removeUser: async (id) => {
		set({ loading: true });
		try {
			// First get all UserCompanyRole associations for this user
			const userCompanyRoles = await client.models.UserCompanyRole.list({
				filter: { userId: { eq: id } },
			});

			// Delete all UserCompanyRole associations
			for (const role of userCompanyRoles.data) {
				await client.models.UserCompanyRole.delete({ id: role.id });
			}

			// Get and update all todos assigned to this user
			const todos = await client.models.Todo.list({
				filter: { assigneeId: { eq: id } },
			});

			// Update todos to remove assignee
			for (const todo of todos.data) {
				await client.models.Todo.update({
					id: todo.id,
					assigneeId: null,
				});
			}

			// Update associated contact if exists
			const contact = await client.models.Contact.list({
				filter: { userId: { eq: id } },
			});

			if (contact.data.length > 0) {
				await client.models.Contact.update({
					id: contact.data[0].id,
					userId: null,
				});
			}

			// Finally delete the user
			await client.models.User.delete({ id });

			set((state) => ({
				users: state.users.filter((user) => user.id !== id),
				loading: false,
				error: null,
			}));
		} catch (err) {
			console.error("Error removing user:", err);
			set({ error: "Failed to remove user", loading: false });
			throw err;
		}
	},

	getUserById: (id) => {
		return get().users.find((user) => user.id === id);
	},

	getUserCompanies: (userId) => {
		const user = get().users.find((u) => u.id === userId);
		return user?.companies?.items || [];
	},

	getUserTodos: (userId) => {
		const user = get().users.find((u) => u.id === userId);
		return user?.todos?.items || [];
	},

	cleanup: () => {
		const { subscription } = get();
		if (subscription) {
			subscription.unsubscribe();
		}
	},
}));
