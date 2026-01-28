'use client';

import { useEffect, useState } from 'react';

interface Metrics {
  mixtapesCreated: number;
  viralCoefficient: number;
  avgTracksPerMixtape: number;
}

interface Targets {
  mixtapesCreated: { target: number; stretch: number };
  viralCoefficient: { target: number; stretch: number };
  avgTracksPerMixtape: { target: number; stretch: number };
}

interface RecentError {
  id: string;
  event_type: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

interface RecentTrack {
  id: string;
  track_name: string;
  artist_name: string;
  mixtape_title: string;
  created_at: string;
}

interface AnalyticsData {
  metrics: Metrics;
  targets: Targets;
  recentErrors: RecentError[];
  recentTracks: RecentTrack[];
}

// Default values to prevent crashes from missing data
const defaultMetrics: Metrics = {
  mixtapesCreated: 0,
  viralCoefficient: 0,
  avgTracksPerMixtape: 0,
};

const defaultTargets: Targets = {
  mixtapesCreated: { target: 500, stretch: 2000 },
  viralCoefficient: { target: 0.3, stretch: 0.5 },
  avgTracksPerMixtape: { target: 7, stretch: 9 },
};

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
    <div className="border border-white/50 p-4">
      <h3 className="font-pixel text-xs text-gray-400 mb-3">{title}</h3>
      <p className="font-pixel text-2xl text-white mb-4">
        {formatValue(numValue)}
      </p>

      {/* Target progress bar */}
      <div className="mb-3">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>Target</span>
          <span>
            {formatValue(numValue)} / {formatValue(target)}
          </span>
        </div>
        <div className="h-2 border border-gray-600">
          <div
            className="h-full bg-white transition-all duration-500"
            style={{ width: `${targetPercent}%` }}
          />
        </div>
      </div>

      {/* Stretch progress bar */}
      <div>
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>Stretch</span>
          <span>
            {formatValue(numValue)} / {formatValue(stretch)}
          </span>
        </div>
        <div className="h-2 border border-gray-600">
          <div
            className="h-full bg-gray-400 transition-all duration-500"
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
      console.log('[Admin] Starting fetch...');
      try {
        const response = await fetch('/api/admin/analytics');
        console.log('[Admin] Response status:', response.status);
        if (!response.ok) {
          const text = await response.text();
          console.error('[Admin] Response error:', text);
          throw new Error(`Failed to fetch analytics: ${response.status}`);
        }
        const result = await response.json();
        console.log('[Admin] Data received:', result);
        setData(result);
      } catch (err) {
        console.error('[Admin] Fetch error:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        console.log('[Admin] Setting loading to false');
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white text-sm animate-pulse">
          LOADING DASHBOARD...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-red-500 text-sm">ERROR: {error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white text-sm">NO DATA AVAILABLE</p>
      </div>
    );
  }

  // Use defaults to prevent crashes from missing/malformed data
  const metrics = { ...defaultMetrics, ...data.metrics };
  const targets = {
    mixtapesCreated: { ...defaultTargets.mixtapesCreated, ...data.targets?.mixtapesCreated },
    viralCoefficient: { ...defaultTargets.viralCoefficient, ...data.targets?.viralCoefficient },
    avgTracksPerMixtape: { ...defaultTargets.avgTracksPerMixtape, ...data.targets?.avgTracksPerMixtape },
  };
  const recentErrors = data.recentErrors || [];
  const recentTracks = data.recentTracks || [];

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="border border-white/50 p-4 mb-8">
          <h1 className="font-pixel text-2xl text-white text-center tracking-wider">
            ADMIN DASHBOARD
          </h1>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <MetricCard
            title="MIXTAPES CREATED"
            value={metrics.mixtapesCreated}
            target={targets.mixtapesCreated.target}
            stretch={targets.mixtapesCreated.stretch}
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

        {/* Recent Tracks */}
        <div className="border border-white/50 p-4 mb-8">
          <h3 className="font-pixel text-xs text-gray-400 mb-4 border-b border-gray-600 pb-2">
            RECENT TRACKS ({recentTracks.length})
          </h3>
          {recentTracks.length === 0 ? (
            <p className="text-gray-400 text-sm">No tracks yet</p>
          ) : (
            <div className="overflow-x-auto max-h-96 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-black">
                  <tr className="border-b border-gray-600">
                    <th className="text-left py-2 px-4 font-pixel text-xs text-gray-400">
                      TRACK
                    </th>
                    <th className="text-left py-2 px-4 font-pixel text-xs text-gray-400">
                      ARTIST
                    </th>
                    <th className="text-left py-2 px-4 font-pixel text-xs text-gray-400">
                      MIXTAPE
                    </th>
                    <th className="text-left py-2 px-4 font-pixel text-xs text-gray-400">
                      DATE
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentTracks.map((track) => (
                    <tr
                      key={track.id}
                      className="border-b border-gray-600/50 hover:bg-white/5"
                    >
                      <td className="py-2 px-4 text-white">
                        {track.track_name}
                      </td>
                      <td className="py-2 px-4 text-gray-300">
                        {track.artist_name}
                      </td>
                      <td className="py-2 px-4 text-primary">
                        {track.mixtape_title}
                      </td>
                      <td className="py-2 px-4 text-gray-400">
                        {track.created_at ? new Date(track.created_at).toLocaleDateString() : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Errors */}
        <div className="border border-white/50 p-4">
          <h3 className="font-pixel text-xs text-gray-400 mb-4 border-b border-gray-600 pb-2">
            RECENT ERRORS
          </h3>
          {recentErrors.length === 0 ? (
            <p className="text-gray-400 text-sm">No recent errors</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-600">
                    <th className="text-left py-2 px-4 font-pixel text-xs text-gray-400">
                      TIME
                    </th>
                    <th className="text-left py-2 px-4 font-pixel text-xs text-gray-400">
                      ERROR
                    </th>
                    <th className="text-left py-2 px-4 font-pixel text-xs text-gray-400">
                      DETAILS
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentErrors.map((err) => (
                    <tr
                      key={err.id}
                      className="border-b border-gray-600"
                    >
                      <td className="py-2 px-4 text-white">
                        {new Date(err.created_at).toLocaleString()}
                      </td>
                      <td className="py-2 px-4 text-red-400">
                        {(err.metadata?.error as string) || 'Unknown error'}
                      </td>
                      <td className="py-2 px-4 text-gray-400 max-w-xs truncate">
                        {(err.metadata?.context as string) ||
                          JSON.stringify(err.metadata)}
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
