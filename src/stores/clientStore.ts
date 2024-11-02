import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface Client {
  id: string;
  name: string;
  industry: string;
  createdAt: string;
}

interface ClientStore {
  clients: Client[];
  selectedClientId: string | null;
  addClient: (name: string, industry: string) => void;
  selectClient: (clientId: string) => void;
  deleteClient: (clientId: string) => void;
  getSelectedClient: () => Client | null;
  resetClientData: (clientId: string) => void;
}

export const useClientStore = create<ClientStore>()(
  persist(
    (set, get) => ({
      clients: [],
      selectedClientId: null,

      addClient: (name, industry) => {
        const newClient: Client = {
          id: crypto.randomUUID(),
          name,
          industry,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          clients: [...state.clients, newClient],
          selectedClientId: newClient.id,
        }));
      },

      selectClient: (clientId) => {
        set({ selectedClientId: clientId });
      },

      deleteClient: (clientId) => {
        set((state) => ({
          clients: state.clients.filter((c) => c.id !== clientId),
          selectedClientId: state.selectedClientId === clientId ? null : state.selectedClientId,
        }));
      },

      getSelectedClient: () => {
        const { clients, selectedClientId } = get();
        return clients.find((client) => client.id === selectedClientId) || null;
      },

      resetClientData: (clientId) => {
        // This will be implemented to clear subscription data for a specific client
        console.log('Resetting data for client:', clientId);
      },
    }),
    {
      name: 'client-store',
      storage: createJSONStorage(() => localStorage),
      version: 1,
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          return {
            ...persistedState,
            clients: persistedState.clients || [],
            selectedClientId: null
          };
        }
        return persistedState;
      },
    }
  )
);