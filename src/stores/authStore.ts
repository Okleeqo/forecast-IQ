import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

// For demo purposes, we'll use a mock user
const DEMO_USER = {
  id: '1',
  email: 'demo@example.com',
  name: 'Demo User'
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        // For demo, accept any email/password combination
        if (email && password) {
          set({ user: DEMO_USER, isAuthenticated: true });
          return;
        }
        throw new Error('Invalid credentials');
      },

      signup: async (name: string, email: string, password: string) => {
        // For demo, create account with provided details
        if (name && email && password) {
          const newUser = { ...DEMO_USER, name, email };
          set({ user: newUser, isAuthenticated: true });
          return;
        }
        throw new Error('Invalid signup details');
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-store',
      storage: createJSONStorage(() => localStorage),
      version: 1,
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          // Migration from version 0 to 1
          return {
            ...persistedState,
            isAuthenticated: false,
            user: null
          };
        }
        return persistedState;
      },
    }
  )
);