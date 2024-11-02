import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ScenarioInput, ScenarioProjection, ScenarioComparison } from '../types/scenario';
import { calculateScenarioProjections } from '../utils/scenarioCalculations';

interface ScenarioState {
  scenarios: ScenarioInput[];
  selectedScenarioId: string | null;
  addScenario: (scenario: Omit<ScenarioInput, 'id'>) => void;
  updateScenario: (id: string, updates: Partial<ScenarioInput>) => void;
  deleteScenario: (id: string) => void;
  selectScenario: (id: string) => void;
  getProjections: (baseMrr: number, baseSubscribers: number) => Record<string, ScenarioProjection>;
  getComparisons: (baseMrr: number, baseSubscribers: number) => Record<string, ScenarioComparison>;
}

export const useScenarioStore = create<ScenarioState>()(
  persist(
    (set, get) => ({
      scenarios: [],
      selectedScenarioId: null,

      addScenario: (scenario) => {
        const id = crypto.randomUUID();
        set((state) => ({
          scenarios: [...state.scenarios, { ...scenario, id }],
          selectedScenarioId: id,
        }));
      },

      updateScenario: (id, updates) => {
        set((state) => ({
          scenarios: state.scenarios.map((s) =>
            s.id === id ? { ...s, ...updates } : s
          ),
        }));
      },

      deleteScenario: (id) => {
        set((state) => ({
          scenarios: state.scenarios.filter((s) => s.id !== id),
          selectedScenarioId:
            state.selectedScenarioId === id ? null : state.selectedScenarioId,
        }));
      },

      selectScenario: (id) => {
        set({ selectedScenarioId: id });
      },

      getProjections: (baseMrr, baseSubscribers) => {
        const { scenarios } = get();
        return scenarios.reduce((acc, scenario) => {
          acc[scenario.id] = calculateScenarioProjections(
            scenario,
            baseMrr,
            baseSubscribers
          );
          return acc;
        }, {} as Record<string, ScenarioProjection>);
      },

      getComparisons: (baseMrr, baseSubscribers) => {
        const projections = get().getProjections(baseMrr, baseSubscribers);
        return Object.entries(projections).reduce((acc, [id, projection]) => {
          acc[id] = {
            sixMonth: {
              mrr: projection.mrr[5],
              arr: projection.arr[5],
              cltv: projection.cltv[5],
              subscribers: projection.subscribers[5],
            },
            twelveMonth: {
              mrr: projection.mrr[11],
              arr: projection.arr[11],
              cltv: projection.cltv[11],
              subscribers: projection.subscribers[11],
            },
          };
          return acc;
        }, {} as Record<string, ScenarioComparison>);
      },
    }),
    {
      name: 'scenario-store',
      storage: createJSONStorage(() => localStorage),
      version: 1,
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          // Migration from version 0 to 1
          return {
            ...persistedState,
            scenarios: persistedState.scenarios || [],
            selectedScenarioId: null
          };
        }
        return persistedState;
      },
    }
  )
);