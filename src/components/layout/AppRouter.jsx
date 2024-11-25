import { Routes, Route } from "react-router-dom";

import TodoScreen from "../../screens/TodoScreen";
import UserScreen from "../../screens/UserScreen";
import CompanyScreen from "../../screens/CompanyScreen";
import TeamScreen from "../../screens/TeamScreen";
import TeamAdminScreen from "../../screens/TeamAdminScreen";
import AdminScreen from "../../screens/AdminScreen";
import UserCompanyRoleScreen from "../../screens/UserCompanyRoleScreen";
import ContactsScreen from "../../screens/ContactsScreen";
import SAMRegistrationScreen from "../../screens/SAMRegistrationScreen";
import NotFoundPage from "../../screens/NotFoundPage";
import MainLayout from "../layout/MainLayout";
import ClienSetupScreen from "../../screens/ClientSetupScreen";

const AppRouter = ({ signOut, user }) => {
	return (
		<Routes>
			<Route path='/' element={<MainLayout signOut={signOut} />}>
				<Route index element={<TodoScreen />} />
				<Route path='todos' element={<TodoScreen />} />
				<Route path='users' element={<UserScreen />} />
				<Route path='company' element={<CompanyScreen />} />
				<Route path='company/:companyId/team' element={<TeamScreen />} />
				<Route path='team' element={<TeamScreen />} />
				<Route path='team-admin' element={<TeamAdminScreen />} />
				<Route path='admin' element={<AdminScreen />} />
				<Route path='user-company-roles' element={<UserCompanyRoleScreen />} />
				<Route path='client-setup' element={<ClienSetupScreen />} />
				<Route path='contacts' element={<ContactsScreen />} />
				<Route path='sam' element={<SAMRegistrationScreen />} />
				<Route path='*' element={<NotFoundPage />} />
			</Route>
		</Routes>
	);
};

export default AppRouter;
