export interface ScenarioInput {
  id: string;
  name: string;
  churnRate: number;
  growthRate: number;
  arpu: number;
  cacAdjustment: number;
  seasonalityEnabled: boolean;
  seasonalAdjustments?: Record<string, number>;
}

export interface ScenarioProjection {
  mrr: number[];
  arr: number[];
  subscribers: number[];
  cltv: number[];
  months: string[];
}

export interface ScenarioComparison {
  sixMonth: {
    mrr: number;
    arr: number;
    cltv: number;
    subscribers: number;
  };
  twelveMonth: {
    mrr: number;
    arr: number;
    cltv: number;
    subscribers: number;
  };
}