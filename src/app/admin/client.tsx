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
    <div className="border border-wire-white p-4">
      <h3 className="font-pixel text-xs text-wire-gray mb-3">{title}</h3>
      <p className="font-pixel text-2xl text-wire-white mb-4">
        {formatValue(numValue)}
      </p>

      {/* Target progress bar */}
      <div className="mb-3">
        <div className="flex justify-between text-xs text-wire-gray mb-1">
          <span>Target</span>
          <span>
            {formatValue(numValue)} / {formatValue(target)}
          </span>
        </div>
        <div className="h-2 border border-wire-dim">
          <div
            className="h-full bg-wire-white transition-all duration-500"
            style={{ width: `${targetPercent}%` }}
          />
        </div>
      </div>

      {/* Stretch progress bar */}
      <div>
        <div className="flex justify-between text-xs text-wire-gray mb-1">
          <span>Stretch</span>
          <span>
            {formatValue(numValue)} / {formatValue(stretch)}
          </span>
        </div>
        <div className="h-2 border border-wire-dim">
          <div
            className="h-full bg-wire-gray transition-all duration-500"
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
      <div className="min-h-screen bg-wire-black flex items-center justify-center">
        <p className="font-pixel text-wire-white text-sm animate-pulse">
          LOADING DASHBOARD...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-wire-black flex items-center justify-center">
        <p className="font-pixel text-wire-red text-sm">ERROR: {error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-wire-black flex items-center justify-center">
        <p className="font-pixel text-wire-white text-sm">NO DATA AVAILABLE</p>
      </div>
    );
  }

  const { metrics, targets, recentErrors } = data;

  return (
    <div className="min-h-screen bg-wire-black p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="border border-wire-white p-4 mb-8">
          <h1 className="font-pixel text-2xl text-wire-white text-center tracking-wider">
            ADMIN DASHBOARD
          </h1>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
        <div className="border border-wire-white p-4 mb-8">
          <h3 className="font-pixel text-xs text-wire-gray mb-2">
            TOTAL USERS
          </h3>
          <p className="font-pixel text-3xl text-wire-white">
            {metrics.totalUsers.toLocaleString()}
          </p>
        </div>

        {/* Recent Errors */}
        <div className="border border-wire-white p-4">
          <h3 className="font-pixel text-xs text-wire-gray mb-4 border-b border-wire-dim pb-2">
            RECENT ERRORS
          </h3>
          {recentErrors.length === 0 ? (
            <p className="text-wire-gray text-sm">No recent errors</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-wire-dim">
                    <th className="text-left py-2 px-4 font-pixel text-xs text-wire-gray">
                      TIME
                    </th>
                    <th className="text-left py-2 px-4 font-pixel text-xs text-wire-gray">
                      ERROR
                    </th>
                    <th className="text-left py-2 px-4 font-pixel text-xs text-wire-gray">
                      DETAILS
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentErrors.map((error) => (
                    <tr
                      key={error.id}
                      className="border-b border-wire-dim"
                    >
                      <td className="py-2 px-4 text-wire-white">
                        {new Date(error.created_at).toLocaleString()}
                      </td>
                      <td className="py-2 px-4 text-wire-red">
                        {(error.metadata?.error as string) || 'Unknown error'}
                      </td>
                      <td className="py-2 px-4 text-wire-gray max-w-xs truncate">
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
