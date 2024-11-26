import { create } from "zustand";
import { generateClient } from "aws-amplify/data";

const client = generateClient({
	authMode: "userPool",
});

export const useUserCompanyRoleStore = create((set) => ({
	userCompanyRoles: [],
	loading: false,
	error: null,

	fetchUserCompanyRoles: async (companyId) => {
		set({ loading: true, error: null });
		try {
			const response = await client.models.UserCompanyRole.list({
				filter: { companyId: { eq: companyId } },
			});
			set({ userCompanyRoles: response.data, loading: false });
		} catch (err) {
			set({ error: "Failed to fetch user-company roles", loading: false });
		}
	},

	setUserCompanyRoles: (roles) => {
		set({ userCompanyRoles: roles });
	},

	removeUserCompanyRole: async (roleId) => {
		set({ loading: true, error: null });
		try {
			await client.models.UserCompanyRole.delete({ id: roleId });
			set((state) => ({
				userCompanyRoles: state.userCompanyRoles.filter((role) => role.id !== roleId),
				loading: false,
			}));
		} catch (err) {
			set({ error: "Failed to delete user-company role", loading: false });
		}
	},
}));
