import type { VendorStats } from '../hooks/useVendorData';

interface LeaderboardProps {
  vendors: VendorStats[];
}

function DeltaValue({ value }: { value: number }) {
  const color = value <= 0 ? 'text-green-400' : 'text-red-400';
  return <span className={color}>{value}</span>;
}

export function Leaderboard({ vendors }: LeaderboardProps) {
  const fasterVendor =
    vendors.length === 2 &&
    vendors[0]!.medianDelta !== vendors[1]!.medianDelta
      ? vendors.reduce((a, b) =>
          a.medianDelta < b.medianDelta ? a : b
        ).vendor
      : null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {vendors.map(v => (
        <div
          key={v.vendor}
          className="bg-gray-900 border border-gray-800 rounded-lg p-6"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xl font-bold text-gray-100">{v.vendor}</p>
              <p className="text-sm text-gray-400">{v.product}</p>
            </div>
            {fasterVendor === v.vendor && (
              <span className="text-xs bg-green-900 text-green-300 px-2 py-0.5 rounded font-medium">
                Faster
              </span>
            )}
          </div>

          <div className="flex gap-6 mb-4">
            <div>
              <p className="text-5xl font-mono font-bold">
                <DeltaValue value={v.medianDelta} />
              </p>
              <p className="text-sm text-gray-400 mt-1">Median Delta (days)</p>
            </div>
            <div>
              <p className="text-5xl font-mono font-bold">
                <DeltaValue value={v.avgDelta} />
              </p>
              <p className="text-sm text-gray-400 mt-1">Avg Delta (days)</p>
            </div>
            {v.proactiveCount > 0 && (
              <div>
                <p className="text-5xl font-mono font-bold text-green-400">
                  {v.proactiveCount}
                </p>
                <p className="text-sm text-gray-400 mt-1">Proactive</p>
              </div>
            )}
          </div>

          <p className="text-sm text-gray-500">{v.totalCves} CVEs tracked</p>

          {v.kevMedianDelta !== null && (
            <p className="text-sm text-gray-400 mt-1">
              KEV Median: {v.kevMedianDelta} days
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
