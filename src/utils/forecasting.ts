import { SeasonalChurn } from '../types';

export function calculateRevenueProjection(
  mrr: number,
  growthRate: number,
  churnRate: number,
  months: number,
  seasonalChurn?: SeasonalChurn[]
): number[] {
  const projections = [mrr];
  
  for (let i = 0; i < months; i++) {
    const currentMRR = projections[i];
    const monthlyGrowth = growthRate / 100;
    let adjustedChurnRate = churnRate / 100;

    // Apply seasonal adjustments if provided
    if (seasonalChurn && seasonalChurn[i % 12]) {
      const adjustment = seasonalChurn[i % 12].adjustment / 100;
      adjustedChurnRate *= (1 + adjustment);
    }

    const netGrowth = monthlyGrowth - adjustedChurnRate;
    const nextMRR = currentMRR * (1 + netGrowth);
    projections.push(nextMRR);
  }

  return projections;
}

export function calculateChurnImpact(
  mrr: number,
  growthRate: number,
  currentChurnRate: number,
  simulatedChurnRate: number,
  months: number,
  seasonalChurn?: SeasonalChurn[]
) {
  const baseline = calculateRevenueProjection(mrr, growthRate, currentChurnRate, months, seasonalChurn);
  const impacted = calculateRevenueProjection(mrr, growthRate, simulatedChurnRate, months, seasonalChurn);
  
  return {
    baseline,
    impacted,
    difference: baseline.map((base, i) => base - impacted[i])
  };
}

export function calculateSeasonalImpact(
  baseChurnRate: number,
  seasonalAdjustments: SeasonalChurn[]
): number[] {
  return seasonalAdjustments.map(adjustment => {
    return baseChurnRate * (1 + adjustment.adjustment / 100);
  });
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function calculateNetRetention(
  churnRate: number,
  expansionRate: number,
  seasonalChurn?: SeasonalChurn[]
): number {
  let baseRetention = 100 - churnRate;
  
  if (seasonalChurn) {
    const averageAdjustment = seasonalChurn.reduce((sum, adj) => sum + adj.adjustment, 0) / 12;
    baseRetention *= (1 + averageAdjustment / 100);
  }
  
  return baseRetention + expansionRate;
}