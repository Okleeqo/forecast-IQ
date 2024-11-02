import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import DashboardHome from '../DashboardHome';
import { useSubscriptionStore } from '../../stores/subscriptionStore';

vi.mock('../../stores/subscriptionStore');

describe('DashboardHome', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders welcome message when no data is available', () => {
    vi.mocked(useSubscriptionStore).mockImplementation(() => ({
      getLatestData: () => null,
    }));

    render(<DashboardHome />);
    expect(screen.getByText(/Welcome to ForecastIQ/)).toBeInTheDocument();
  });

  it('renders metrics when data is available', () => {
    const mockData = {
      mrr: 10000,
      subscribers: 100,
      arpu: 100,
      churnRate: 5,
      growthRate: 10,
    };

    vi.mocked(useSubscriptionStore).mockImplementation(() => ({
      getLatestData: () => mockData,
    }));

    render(<DashboardHome />);
    expect(screen.getByText('Monthly Revenue')).toBeInTheDocument();
    expect(screen.getByText('$10,000')).toBeInTheDocument();
  });
});