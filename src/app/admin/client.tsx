'use client';

import { useEffect, useState } from 'react';

interface Metrics {
  mixtapesCreated: number;
  totalUsers: number;
  emailsCaptured: number;
  viralCoefficient: number;
  avgTracksPerMixtape: number;
}

interface Targets {
  mixtapesCreated: { target: number; stretch: number };
  emailsCaptured: { target: number; stretch: number };
  viralCoefficient: { target: number; stretch: number };
  avgTracksPerMixtape: { target: number; stretch: number };
}

interface RecentError {
  id: string;
  event_type: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

interface AnalyticsData {
  metrics: Metrics;
  targets: Targets;
  recentErrors: RecentError[];
}

interface MetricCardProps {
  title: string;
  value: number | string;
  target: number;
  stretch: number;
  isDecimal?: boolean;
}

function MetricCard({
  title,
  value,
  target,
  stretch,
  isDecimal = false,
}: MetricCardProps) {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  const targetPercent = Math.min((numValue / target) * 100, 100);
  const stretchPercent = Math.min((numValue / stretch) * 100, 100);

  const formatValue = (val: number) => {
    if (isDecimal) {
      return val.toFixed(2);
    }
    return val.toLocaleString();
  };

  return (
    <div className="bg-retro-navy p-6 border-4 border-retro-brown">
      <h3 className="font-pixel text-xs text-retro-cream mb-4">{title}</h3>
      <p className="font-pixel text-2xl text-retro-orange mb-4">
        {formatValue(numValue)}
      </p>

      {/* Target progress bar */}
      <div className="mb-2">
        <div className="flex justify-between text-xs text-retro-cream mb-1">
          <span>Target</span>
          <span>
            {formatValue(numValue)} / {formatValue(target)}
          </span>
        </div>
        <div className="h-3 bg-retro-black border-2 border-retro-brown">
          <div
            className="h-full bg-retro-teal transition-all duration-500"
            style={{ width: `${targetPercent}%` }}
          />
        </div>
      </div>

      {/* Stretch progress bar */}
      <div>
        <div className="flex justify-between text-xs text-retro-cream mb-1">
          <span>Stretch</span>
          <span>
            {formatValue(numValue)} / {formatValue(stretch)}
          </span>
        </div>
        <div className="h-3 bg-retro-black border-2 border-retro-brown">
          <div
            className="h-full bg-retro-orange transition-all duration-500"
            style={{ width: `${stretchPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const response = await fetch('/api/admin/analytics');
        if (!response.ok) {
          throw new Error('Failed to fetch analytics');
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-retro-black flex items-center justify-center">
        <p className="font-pixel text-retro-cream text-sm animate-pulse">
          LOADING DASHBOARD...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-retro-black flex items-center justify-center">
        <p className="font-pixel text-retro-red text-sm">ERROR: {error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-retro-black flex items-center justify-center">
        <p className="font-pixel text-retro-cream text-sm">NO DATA AVAILABLE</p>
      </div>
    );
  }

  const { metrics, targets, recentErrors } = data;

  return (
    <div className="min-h-screen bg-retro-black p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <h1 className="font-pixel text-2xl text-retro-cream mb-8">
          ADMIN DASHBOARD
        </h1>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="MIXTAPES CREATED"
            value={metrics.mixtapesCreated}
            target={targets.mixtapesCreated.target}
            stretch={targets.mixtapesCreated.stretch}
          />
          <MetricCard
            title="EMAILS CAPTURED"
            value={metrics.emailsCaptured}
            target={targets.emailsCaptured.target}
            stretch={targets.emailsCaptured.stretch}
          />
          <MetricCard
            title="VIRAL COEFFICIENT"
            value={metrics.viralCoefficient}
            target={targets.viralCoefficient.target}
            stretch={targets.viralCoefficient.stretch}
            isDecimal
          />
          <MetricCard
            title="AVG TRACKS/MIXTAPE"
            value={metrics.avgTracksPerMixtape}
            target={targets.avgTracksPerMixtape.target}
            stretch={targets.avgTracksPerMixtape.stretch}
            isDecimal
          />
        </div>

        {/* Total Users */}
        <div className="bg-retro-navy p-6 border-4 border-retro-brown mb-8">
          <h3 className="font-pixel text-xs text-retro-cream mb-2">
            TOTAL USERS
          </h3>
          <p className="font-pixel text-3xl text-retro-teal">
            {metrics.totalUsers.toLocaleString()}
          </p>
        </div>

        {/* Recent Errors */}
        <div className="bg-retro-navy p-6 border-4 border-retro-brown">
          <h3 className="font-pixel text-xs text-retro-cream mb-4">
            RECENT ERRORS
          </h3>
          {recentErrors.length === 0 ? (
            <p className="text-retro-cream text-sm">No recent errors</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-retro-brown">
                    <th className="text-left py-2 px-4 font-pixel text-xs text-retro-cream">
                      TIME
                    </th>
                    <th className="text-left py-2 px-4 font-pixel text-xs text-retro-cream">
                      ERROR
                    </th>
                    <th className="text-left py-2 px-4 font-pixel text-xs text-retro-cream">
                      DETAILS
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentErrors.map((error) => (
                    <tr
                      key={error.id}
                      className="border-b border-retro-brown/50"
                    >
                      <td className="py-2 px-4 text-retro-cream">
                        {new Date(error.created_at).toLocaleString()}
                      </td>
                      <td className="py-2 px-4 text-retro-red">
                        {(error.metadata?.error as string) || 'Unknown error'}
                      </td>
                      <td className="py-2 px-4 text-retro-cream/70 max-w-xs truncate">
                        {(error.metadata?.context as string) ||
                          JSON.stringify(error.metadata)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
