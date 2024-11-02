import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { SubscriptionData } from '../types';

interface SubscriptionStore {
  data: Record<string, SubscriptionData[]>;
  addData: (clientId: string, data: SubscriptionData) => void;
  getLatestData: (clientId: string) => SubscriptionData | null;
  clearData: (clientId: string) => void;
  resetData: (clientId: string) => void;
}

export const useSubscriptionStore = create<SubscriptionStore>()(
  persist(
    (set, get) => ({
      data: {},

      addData: (clientId, newData) => set((state) => ({
        data: {
          ...state.data,
          [clientId]: [...(state.data[clientId] || []), newData]
        }
      })),

      getLatestData: (clientId) => {
        const clientData = get().data[clientId] || [];
        return clientData[clientData.length - 1] || null;
      },

      clearData: (clientId) => set((state) => {
        const newData = { ...state.data };
        delete newData[clientId];
        return { data: newData };
      }),

      resetData: (clientId) => set((state) => ({
        data: {
          ...state.data,
          [clientId]: []
        }
      }))
    }),
    {
      name: 'subscription-store',
      storage: createJSONStorage(() => localStorage),
      version: 1,
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          return {
            ...persistedState,
            data: persistedState.data || {}
          };
        }
        return persistedState;
      },
    }
  )
);