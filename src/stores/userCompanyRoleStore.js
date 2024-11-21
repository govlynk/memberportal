import { create } from 'zustand';
import { generateClient } from 'aws-amplify/data';

const client = generateClient();

export const useUserCompanyRoleStore = create((set, get) => ({
  userCompanyRoles: [],
  loading: false,
  error: null,
  subscription: null,

  fetchUserCompanyRoles: async (userId) => {
    set({ loading: true });
    try {
      const subscription = client.models.UserCompanyRole.observeQuery({
        filter: { userId: { eq: userId } }
      }).subscribe({
        next: ({ items }) => {
          set({
            userCompanyRoles: items,
            loading: false,
          });
        },
        error: (err) => {
          console.error("Fetch user company roles error:", err);
          set({ error: "Failed to fetch user company roles", loading: false });
        },
      });
      set({ subscription });
    } catch (err) {
      console.error("Fetch user company roles error:", err);
      set({ error: "Failed to fetch user company roles", loading: false });
    }
  },

  addUserCompanyRole: async (roleData) => {
    set({ loading: true });
    try {
      const userCompanyRole = await client.models.UserCompanyRole.create({
        userId: roleData.userId,
        companyId: roleData.companyId,
        roleId: roleData.roleId,
        status: roleData.status || "ACTIVE",
      });

      set((state) => ({
        userCompanyRoles: [...state.userCompanyRoles, userCompanyRole],
        loading: false,
        error: null,
      }));

      return userCompanyRole;
    } catch (err) {
      console.error("Create user company role error:", err);
      set({ error: err.message || "Failed to create user company role", loading: false });
      throw err;
    }
  },

  updateUserCompanyRole: async (id, updates) => {
    try {
      const updatedRole = await client.models.UserCompanyRole.update({
        id,
        ...updates,
      });

      set((state) => ({
        userCompanyRoles: state.userCompanyRoles.map((role) => 
          role.id === id ? updatedRole : role
        ),
        error: null,
      }));
      return updatedRole;
    } catch (err) {
      console.error("Error updating user company role:", err);
      set({ error: "Failed to update user company role" });
      throw err;
    }
  },

  removeUserCompanyRole: async (id) => {
    try {
      await client.models.UserCompanyRole.delete({
        id,
      });
      set((state) => ({
        userCompanyRoles: state.userCompanyRoles.filter((role) => role.id !== id),
        error: null,
      }));
    } catch (err) {
      console.error("Error removing user company role:", err);
      set({ error: "Failed to remove user company role" });
      throw err;
    }
  },

  cleanup: () => {
    const { subscription } = get();
    if (subscription) {
      subscription.unsubscribe();
    }
  },
}));