export interface SubscriptionData {
  mrr: number;
  subscribers: number;
  arpu: number;
  churnRate: number;
  growthRate: number;
  date: string;
  segments: Segment[];
  seasonalChurn: SeasonalChurn;
  cac: CACData;
}

export interface Segment {
  name: SegmentType;
  subscribers: number;
  mrr: number;
  churnRate: number;
  growthRate: number;
}

export type SegmentType = 'SMB' | 'Mid-Market' | 'Enterprise';

export interface SeasonalChurn {
  [month: string]: number;
}

export interface CACData {
  smb: number;
  midMarket: number;
  enterprise: number;
  average: number;
}