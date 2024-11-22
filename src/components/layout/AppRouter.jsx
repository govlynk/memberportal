import { Routes, Route } from "react-router-dom";

import TodoScreen from "../../screens/TodoScreen";
import UserScreen from "../../screens/UserScreen";
import CompanyScreen from "../../screens/CompanyScreen";
import TeamScreen from "../../screens/TeamScreen";
import UserCompanyRoleScreen from "../../screens/UserCompanyRoleScreen";
import NotFoundPage from "../../screens/NotFoundPage";
import MainLayout from "../layout/MainLayout";

const AppRouter = ({ signOut, user }) => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route path="/" element={<TodoScreen />} />
        <Route path="/todos" element={<TodoScreen />} />
        <Route path="/users" element={<UserScreen />} />
        <Route path="/company" element={<CompanyScreen />} />
        <Route path="/company/:companyId/team" element={<TeamScreen />} />
        <Route path="/team" element={<TeamScreen />} />
        <Route path="/user-company-roles" element={<UserCompanyRoleScreen />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;