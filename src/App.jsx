import React, { useEffect } from "react";
import { withAuthenticator } from "@aws-amplify/ui-react";
import { Routes, Route } from "react-router-dom";
import { MainLayout } from "./components/layout/MainLayout";
import TodoScreen from "./screens/TodoScreen";
import UserScreen from "./screens/UserScreen";
import CompanyScreen from "./screens/CompanyScreen";
import TeamScreen from "./screens/TeamScreen";
import NotFoundPage from "./screens/NotFoundPage";
import { useAuthStore } from "./stores/authStore";

function App({ user, signOut }) {
	const initializeAuth = useAuthStore((state) => state.initialize);

	useEffect(() => {
		if (user) {
			initializeAuth(user);
		}
	}, [user, initializeAuth]);

	return (
		<Routes>
			<Route path='/' element={<MainLayout signOut={signOut} />}>
				<Route index element={<TodoScreen />} />
				<Route path='/todos' element={<TodoScreen />} />
				<Route path='/users' element={<UserScreen />} />
				<Route path='/company' element={<CompanyScreen />} />
				<Route path='/company/:companyId/team' element={<TeamScreen />} />
				<Route path='/team' element={<TeamScreen />} />
				<Route path='*' element={<NotFoundPage />} />
			</Route>
		</Routes>
	);
}

export default withAuthenticator(App);
