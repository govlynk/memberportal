import { create } from "zustand";
import { generateClient } from "aws-amplify/data";

const client = generateClient();

export const useCurrentUserStore = create((set) => ({
	currentUser: null,
	isAuthenticated: false,
	isAdmin: false,
	groups: [],
	userCompanies: [],
	userRoles: [],
	loading: false,
	error: null,

	initializeCurrentUser: async (cognitoUser) => {
		if (!cognitoUser?.sub) return;

		set({ loading: true });
		try {
			// Fetch user data from the database
			const userData = await client.models.User.get({ id: cognitoUser.sub });

			// Extract groups from Cognito token
			const groups = userData.signInUserSession?.accessToken?.payload?.["cognito:groups"] || [];
			const isAdmin = groups.some((group) => typeof group === "string" && group.toLowerCase() === "admin");

			if (!userData) {
				// Create new user if doesn't exist
				const newUser = await client.models.User.create({
					cognitoId: cognitoUser.sub,
					email: cognitoUser.email,
					name: cognitoUser.name || cognitoUser.username,
					status: "ACTIVE",
					lastLogin: new Date().toISOString(),
				});
				set({ currentUser: newUser, loading: false });
				return;
			}

			// Update last login
			const updatedUser = await client.models.User.update({
				id: userData.id,
				lastLogin: new Date().toISOString(),
			});

			// Fetch user's companies and roles
			const userCompanyRoles = await client.models.UserCompanyRole.query({
				userId: { eq: updatedUser.id },
			});

			const companies = await Promise.all(
				userCompanyRoles.data.map(async (ucr) => {
					const company = await client.models.Company.get({ id: ucr.companyId });
					const role = await client.models.Role.get({ id: ucr.roleId });
					return { ...company, role };
				})
			);

			set({
				currentUser: updatedUser,
				isAuthenticated: true,
				isAdmin,
				groups,
				userCompanies: companies,
				userRoles: userCompanyRoles.data.map((ucr) => ucr.role),
				loading: false,
			});
		} catch (err) {
			console.error("Error initializing current user:", err);
			set({ error: "Failed to initialize user data", loading: false });
		}
	},

	updateCurrentUser: async (updates) => {
		set({ loading: true });
		try {
			const updatedUser = await client.models.User.update({
				id: updates.id,
				...updates,
			});
			set((state) => ({
				currentUser: { ...state.currentUser, ...updatedUser },
				loading: false,
			}));
		} catch (err) {
			console.error("Error updating current user:", err);
			set({ error: "Failed to update user data", loading: false });
		}
	},

	reset: () => {
		set({
			currentUser: null,
			isAuthenticated: false,
			isAdmin: false,
			groups: [],
			userCompanies: [],
			userRoles: [],
			loading: false,
			error: null,
		});
	},
}));
