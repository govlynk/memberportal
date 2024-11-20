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

	useEffect(() => {
		const userData = getCurrentUser();
		setUser(userData);
	}, []);

	return (
		<div style={{ width: "100vw", height: "100vh" }}>
			<header className='flex justify-between items-center p-4'>
				<div>
					<h1 className='text-2xl font-bold'>Todo List</h1>
					{user && <p>Welcome, {user.username}</p>}
				</div>
				<button onClick={signOut}>Sign Out</button>
			</header>

			<TodoScreen />
		</div>
	);
}

export default withAuthenticator(App);
