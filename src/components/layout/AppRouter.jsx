import { Routes, Route } from "react-router-dom";

import TodoScreen from "../../screens/TodoScreen";
import UserScreen from "../../screens/UserScreen";
import CompanyScreen from "../../screens/CompanyScreen";
import TeamScreen from "../../screens/TeamScreen";
import NotFoundPage from "../../screens/NotFoundPage";
import MainLayout from "../layout/MainLayout";
// import Dashboard from "../scenes/Dashboard/Dashboard";
// import Team from "../scenes/Team/Team";
// import ValidateSAM from "../scenes/Profile/ValidateSAM";
// import Invoices from "../scenes/Invoices";
// import Contacts from "../scenes/Contacts/Contacts";
// import WelcomeMessage from "../scenes/Welcome/WelcomeMessage";
// import Opportunities from "../scenes/Opportunities/Opportunities";
// import Pipeline from "../scenes/Pipeline/Pipeline";
// import ClientAdmin from "../scenes/Admin/Client";
// import CompanyAdmin from "../scenes/Admin/Company";
// import TeamAdmin from "../scenes/Admin/Team";
// import AccountAdmin from "../scenes/Admin/Account";
// import Test from "../scenes/Admin/Test";

// import ColorSections from "../scenes/Admin/ColorSelections";
// import MenuManager from "../scenes/Admin/MenuManager";
// import Awards from "../scenes/Awards/Awards";
// import ToDoList from "../scenes/Todo/ToDoList";

const AppRouter = ({ signOut, user }) => {
	return (
		<Routes>
			<Route path='/' element={<MainLayout />}>
				<Route path='/' element={<TodoScreen />} />
				<Route path='/todos' element={<TodoScreen />} />
				<Route path='/users' element={<UserScreen />} />
				<Route path='/company' element={<CompanyScreen />} />
				<Route path='/company/:companyId/team' element={<TeamScreen />} />
				<Route path='/team' element={<TeamScreen />} />

				{/* 			<Route path='/dashboard' element={<Dashboard />} />
				<Route path='/todo' element={<ToDoList />} />
				<Route path='/team' element={<Team />} />
				<Route path='/SAM' element={<ValidateSAM />} />
				<Route path='/contacts' element={<Contacts />} />
				<Route path='/invoices' element={<Invoices />} />
				<Route path='/welcome' element={<WelcomeMessage />} />
				<Route path='/opportunities' element={<Opportunities />} />
				<Route path='/awards' element={<Awards />} />
				<Route path='/pipeline' element={<Pipeline />} />
				<Route path='/addteam' element={<TeamAdmin />} />
				<Route path='/addcompany' element={<CompanyAdmin />} />
				<Route path='/test' element={<Test email='admin@govlynk.com' />} />
				<Route path='/brand' element={<ColorSections />} />
				<Route path='/menu' element={<MenuManager />} /> */}
				<Route path='*' element={<NotFoundPage />} />
			</Route>
		</Routes>
	);
};

export default AppRouter;
