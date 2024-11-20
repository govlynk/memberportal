import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isAdmin: false,
      groups: [],

      initialize: (userData) => {
        if (!userData) return;

        // Extract groups from Cognito token
        const groups = userData.signInUserSession?.accessToken?.payload?.['cognito:groups'] || [];
        const isAdmin = groups.some(group => 
          typeof group === 'string' && group.toLowerCase() === 'admin'
        );

        // Create a normalized user object with all necessary fields
        const user = {
          sub: userData.userId || userData.attributes?.sub || userData.username,
          email: userData.attributes?.email || userData.email,
          name: userData.attributes?.name || userData.username,
          username: userData.username,
          groups: groups,
          attributes: userData.attributes || {},
          signInUserSession: userData.signInUserSession
        };

        set({
          user,
          isAuthenticated: true,
          isAdmin,
          groups
        });
      },

      reset: () => {
        set({
          user: null,
          isAuthenticated: false,
          isAdmin: false,
          groups: []
        });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);