import React, { useEffect, useState } from "react";
import { withAuthenticator } from "@aws-amplify/ui-react";
import { generateClient } from "aws-amplify/data";
import { getCurrentUser } from "aws-amplify/auth";
import "@aws-amplify/ui-react/styles.css";
import TodoScreen from "./screens/TodoScreen";

const client = generateClient();

function App({ signOut }) {
	const [todos, setTodos] = useState([]);
	const [loading, setLoading] = useState(true);
	const [user, setUser] = useState(null);
	const [error, setError] = useState(null);

	// async function createTodo() {
	// 	try {
	// 		const title = window.prompt("Enter todo title:");
	// 		const description = window.prompt("Enter todo description:");

	// 		if (title && description) {
	// 			await client.models.Todo.create({
	// 				title,
	// 				description,
	// 				status: "TODO",
	// 				priority: "MEDIUM",
	// 				position: todos.length + 1,
	// 				dueDate: new Date().toISOString(),
	// 			});
	// 		}
	// 	} catch (err) {
	// 		console.error("Error creating todo:", err);
	// 		setError("Failed to create todo");
	// 	}
	// }

	useEffect(() => {
		// let subscription;
		const userData = getCurrentUser();
		setUser(userData);

		// async function init() {
		// 	try {
		// 		const userData = await getCurrentUser();
		// 		setUser(userData);

		// subscription = client.models.Todo.observeQuery().subscribe({
		// 	next: ({ items }) => {
		// 		setTodos(items.sort((a, b) => a.position - b.position));
		// 		setLoading(false);
		// 	},
		// 	error: (err) => {
		// 		console.error("Subscription error:", err);
		// 		setError("Failed to load todos");
		// 		setLoading(false);
		// 	},
		// });
		// } catch (err) {
		// 	console.error("Initialization error:", err);
		// 	setError("Failed to initialize app");
		// 	setLoading(false);
		// }
		// }

		// init();
		// return () => subscription?.unsubscribe();
	}, []);

	// if (loading) return <div>Loading...</div>;
	// if (error) return <div>Error: {error}</div>;

	return (
		<div className='container mx-auto p-4'>
			<header className='flex justify-between items-center mb-6'>
				<div>
					<h1 className='text-2xl font-bold'>Todo List</h1>
					{user && <p>Welcome, {user.username}</p>}
				</div>
				<button onClick={signOut}>Sign Out</button>
			</header>

			<TodoScreen />

			{/* <button onClick={createTodo}>+ Add Todo</button>

			<div className='grid gap-4'>
				{todos.map((todo) => (
					<div key={todo.id}>
						<h3>{todo.title}</h3>
						<p>{todo.description}</p>
						<div>
							<span>{todo.status}</span>
							<span>{todo.priority}</span>
						</div>
					</div>
				))}
			</div> */}
		</div>
	);
}

export default withAuthenticator(App);
