import { ScenarioInput, ScenarioProjection } from '../types/scenario';

export function calculateScenarioProjections(
  scenario: ScenarioInput,
  baseMrr: number,
  baseSubscribers: number
): ScenarioProjection {
  const months = Array.from({ length: 12 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() + i + 1);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  });

  const projections = {
    mrr: [baseMrr],
    arr: [baseMrr * 12],
    subscribers: [baseSubscribers],
    cltv: [calculateCLTV(scenario.arpu, scenario.churnRate)],
    months,
  };

  for (let i = 1; i <= 12; i++) {
    const monthlyGrowth = scenario.growthRate / 100;
    const monthlyChurn = scenario.churnRate / 100;
    
    // Apply seasonal adjustments if enabled
    let adjustedChurn = monthlyChurn;
    if (scenario.seasonalityEnabled && scenario.seasonalAdjustments) {
      const monthKey = months[i - 1].split(' ')[0].toLowerCase();
      const adjustment = scenario.seasonalAdjustments[monthKey] || 0;
      adjustedChurn *= (1 + adjustment / 100);
    }

    const netGrowth = monthlyGrowth - adjustedChurn;
    const previousMrr = projections.mrr[i - 1];
    const previousSubscribers = projections.subscribers[i - 1];

    // Calculate new values
    const newMrr = previousMrr * (1 + netGrowth);
    const newSubscribers = previousSubscribers * (1 + netGrowth);
    const cltv = calculateCLTV(scenario.arpu, scenario.churnRate);

    // Add to projections
    projections.mrr.push(newMrr);
    projections.arr.push(newMrr * 12);
    projections.subscribers.push(newSubscribers);
    projections.cltv.push(cltv);
  }

  return projections;
}

function calculateCLTV(arpu: number, churnRate: number): number {
  return arpu / (churnRate / 100);
}