import React from "react";
import { Authenticator } from "@aws-amplify/ui-react";
import { useAuthStore } from "./stores/authStore";
import AppRouter from "./components/layout/AppRouter";

// Separate component to handle authenticated state
const AuthenticatedApp = ({ signOut, user }) => {
	const initializeAuth = useAuthStore((state) => state.initialize);

	React.useEffect(() => {
		if (user) {
			initializeAuth(user);
		}
	}, [user, initializeAuth]);

	return <AppRouter signOut={signOut} user={user} />;
};

export default function App() {
	return <Authenticator loginMechanisms={["email"]}>{(props) => <AuthenticatedApp {...props} />}</Authenticator>;
}
