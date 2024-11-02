import { describe, it, expect } from 'vitest';
import { calculateChurnImpact, calculateRevenueProjection, formatCurrency, formatNumber } from '../forecasting';

describe('Forecasting Utilities', () => {
  describe('formatCurrency', () => {
    it('formats currency correctly', () => {
      expect(formatCurrency(1000)).toBe('$1,000');
      expect(formatCurrency(1000.50)).toBe('$1,001');
      expect(formatCurrency(0)).toBe('$0');
    });
  });

  describe('formatNumber', () => {
    it('formats numbers correctly', () => {
      expect(formatNumber(1000)).toBe('1,000');
      expect(formatNumber(1000000)).toBe('1,000,000');
      expect(formatNumber(0)).toBe('0');
    });
  });

  describe('calculateChurnImpact', () => {
    it('calculates churn impact correctly', () => {
      const result = calculateChurnImpact(10000, 100, 5, 12);
      expect(result).toHaveLength(13); // Including initial month
      expect(result[0].baseline).toBe(10000);
      expect(result[0].subscribers).toBe(100);
    });

    it('handles zero churn rate', () => {
      const result = calculateChurnImpact(10000, 100, 0, 12);
      expect(result[12].subscribers).toBe(100);
      expect(result[12].impacted).toBe(10000);
    });
  });

  describe('calculateRevenueProjection', () => {
    it('calculates revenue projection correctly', () => {
      const result = calculateRevenueProjection(10000, 100, 10, 12);
      expect(result).toHaveLength(13); // Including initial month
      expect(result[0].baseline).toBe(10000);
      expect(result[0].subscribers).toBe(100);
    });

    it('handles zero growth rate', () => {
      const result = calculateRevenueProjection(10000, 100, 0, 12);
      expect(result[12].subscribers).toBe(100);
      expect(result[12].impacted).toBe(10000);
    });
  });
});