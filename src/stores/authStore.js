import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isAdmin: false,

      initialize: (userData) => {
        console.log('Raw userData:', userData);
        
        // Get groups from token
        const groups = Array.isArray(userData.groups) ? userData.groups : [];
        console.log('Processed groups:', groups);
        
        // Check if user is in admin group (case-insensitive)
        const isAdmin = groups.some(group => 
          typeof group === 'string' && group.toLowerCase() === 'admin'
        );
        console.log('Is admin?', isAdmin);
        
        const user = {
          email: userData.email,
          name: userData.name,
          username: userData.username,
          sub: userData.sub,
          groups: groups,
          rawToken: userData.rawToken
        };
        
        set({
          user,
          isAuthenticated: true,
          isAdmin,
          groups
        });

        // Log final state for verification
        const newState = get();
        console.log('Final auth state:', {
          user: newState.user,
          isAuthenticated: newState.isAuthenticated,
          isAdmin: newState.isAdmin,
          groups: newState.user?.groups
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
      onRehydrateStorage: () => (state) => {
        console.log('Rehydrated auth state:', state);
      },
    }
  )
);