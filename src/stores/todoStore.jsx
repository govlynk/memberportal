// todoStore.jsx
import { generateClient } from "aws-amplify/data";
import { create } from "zustand";

const client = generateClient();

export const useTodoStore = create((set) => ({
	todos: [],
	loading: false,
	error: null,
	subscription: null,

	fetchTodos: async () => {
		// Added fetchTodos function
		set({ loading: true });
		try {
			const subscription = client.models.Todo.observeQuery().subscribe({
				next: ({ items }) => {
					set({
						todos: items.sort((a, b) => a.position - b.position),
						loading: false,
					});
				},
				error: (err) => {
					console.error("Fetch todos error:", err);
					set({ error: "Failed to fetch todos", loading: false });
				},
			});
			set({ subscription });
		} catch (err) {
			console.error("Fetch todos error:", err);
			set({ error: "Failed to fetch todos", loading: false });
		}
	},

	addTodo: async (todoData) => {
		set({ loading: true });
		try {
			await client.models.Todo.create({
				...todoData,
				status: "TODO",
				priority: "MEDIUM",
				position: todoData.position || 0,
				dueDate: todoData.dueDate || new Date().toISOString(),
			});
			set({ loading: false });
		} catch (err) {
			console.error("Create todo error:", err);
			set({ error: "Failed to create todo", loading: false });
		}
	},

	updateTodo: async (id, updates) => {
		try {
			const { data: updatedTodo } = await client.models.Todo.update({
				id,
				title: updates.title,
				description: updates.description,
				status: updates.status,
				priority: updates.priority,
				dueDate: updates.dueDate ? new Date(updates.dueDate).toISOString() : undefined,
				estimatedEffort: updates.estimatedEffort !== undefined ? parseFloat(updates.estimatedEffort) : undefined,
				actualEffort: updates.actualEffort !== undefined ? parseFloat(updates.actualEffort) : undefined,
				tags: updates.tags,
				position: updates.position,
				assigneeId: updates.assigneeId,
			});

			set((state) => ({
				todos: state.todos.map((todo) => (todo.id === id ? updatedTodo : todo)),
				error: null,
			}));
			return updatedTodo;
		} catch (err) {
			console.error("Error updating todo:", err);
			set({ error: "Failed to update todo" });
			throw err;
		}
	},

	updateTodos: async (newTodos) => {
		try {
			// Update todos one by one to ensure proper error handling
			for (let i = 0; i < newTodos.length; i++) {
				const todo = newTodos[i];
				await client.models.Todo.update({
					id: todo.id,
					position: i + 1,
					status: todo.status,
				});
			}
			set({ todos: newTodos, error: null });
		} catch (err) {
			console.error("Error updating todos:", err);
			set({ error: "Failed to update todos" });
			throw err;
		}
	},

	removeTodo: async (id) => {
		try {
			await client.models.Todo.delete({
				id,
			});
			set((state) => ({
				todos: state.todos.filter((todo) => todo.id !== id),
				error: null,
			}));
		} catch (err) {
			console.error("Error removing todo:", err);
			set({ error: "Failed to remove todo" });
			throw err;
		}
	},
	updateTodoStatus: async (id, status) => {
		set({ loading: true });
		try {
			await client.models.Todo.update({
				id,
				status,
			});
			set({ loading: false });
		} catch (err) {
			console.error("Update status error:", err);
			set({ error: "Failed to update status", loading: false });
		}
	},

	cleanup: () => {
		const { subscription } = useTodoStore.getState();
		if (subscription) {
			subscription.unsubscribe();
		}
	},
}));
