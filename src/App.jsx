import React, { useEffect } from "react";
import { withAuthenticator } from "@aws-amplify/ui-react";
import { useAuthStore } from "./stores/authStore";
import AppRouter from "./components/layout/AppRouter";

function App({ user, signOut }) {
	const initializeAuth = useAuthStore((state) => state.initialize);

	useEffect(() => {
		if (user) {
			initializeAuth(user);
			console.log("User authenticated:", user);
		}
	}, [user, initializeAuth]);

	return <AppRouter signOut={signOut} user={user} />;
}

export default withAuthenticator(App);
