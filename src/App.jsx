import React, { useEffect } from "react";
import { Authenticator } from "@aws-amplify/ui-react";
import { useAuthStore } from "./stores/authStore";
import AppRouter from "./components/layout/AppRouter";

export default function App() {
	const initializeAuth = useAuthStore((state) => state.initialize);

	useEffect(() => {
		if (user) {
			initializeAuth(user);
		}
	}, [user, initializeAuth]);

	return (
		<Authenticator loginMechanisms={["email"]}>
			{({ signOut, user }) => <AppRouter signOut={signOut} user={user} />}
		</Authenticator>
	);
}
