import { generateClient } from "aws-amplify/data";
import { create } from "zustand";

const client = generateClient();

export const useTodoStore = create((set) => ({
	todos: [],
	loading: false,
	error: null,
	subscription: null,

	fetchTodos: async () => {
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
			// Create todo matching the schema structure
			const todo = await client.models.Todo.create({
				title: todoData.title,
				description: todoData.description,
				status: "TODO", // Enum value must match schema
				priority: todoData.priority || "MEDIUM", // Enum value must match schema
				dueDate: todoData.dueDate,
				estimatedEffort: todoData.estimatedEffort || 0,
				actualEffort: todoData.actualEffort || 0,
				tags: todoData.tags || [],
				position: todoData.position || 0,
				assigneeId: todoData.assigneeId,
			});

			// Update local state with new todo
			set((state) => ({
				todos: [...state.todos, todo],
				loading: false,
				error: null,
			}));

			console.log("Todo created successfully:", todo);
			return todo;
		} catch (err) {
			console.error("Create todo error:", err);
			set({ error: err.message || "Failed to create todo", loading: false });
			throw err;
		}
	},

	updateTodo: async (id, updates) => {
		try {
			const { data: updatedTodo } = await client.models.Todo.update({
				id,
				...updates,
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
