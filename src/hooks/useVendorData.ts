import fortinetRaw from '../data/fortinet.json';
import panRaw from '../data/pan.json';
import type { VendorData, CveEntry } from '../types';

export interface VendorStats {
  vendor: string;
  product: string;
  medianDelta: number;
  avgDelta: number;
  totalCves: number;
  kevMedianDelta: number | null; // null if no KEV CVEs
  proactiveCount: number;
  cves: (CveEntry & { vendor: string })[];
}

export interface AppData {
  vendors: VendorStats[];
  allCves: (CveEntry & { vendor: string })[];
  lastUpdated: string; // most recent last_updated from either file
}

function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0
    ? sorted[mid]!
    : ((sorted[mid - 1]! + sorted[mid]!) / 2);
}

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
}

function computeStats(data: VendorData): VendorStats {
  const deltas = data.cves.map(c => c.delta_days);
  const kevDeltas = data.cves.filter(c => c.in_kev).map(c => c.delta_days);
  const proactiveCount = data.cves.filter(c => c.delta_days < 0).length;
  return {
    vendor: data.vendor,
    product: data.product,
    medianDelta: median(deltas),
    avgDelta: average(deltas),
    totalCves: data.cves.length,
    kevMedianDelta: kevDeltas.length > 0 ? median(kevDeltas) : null,
    proactiveCount,
    cves: data.cves.map(c => ({ ...c, vendor: data.vendor })),
  };
}

export function useVendorData(): AppData {
  const fortinet = fortinetRaw as unknown as VendorData;
  const pan = panRaw as unknown as VendorData;

  const fortinetStats = computeStats(fortinet);
  const panStats = computeStats(pan);
  const allCves = [...fortinetStats.cves, ...panStats.cves];
  const lastUpdated = [fortinet.last_updated, pan.last_updated]
    .sort()
    .reverse()[0]!;

  return {
    vendors: [fortinetStats, panStats],
    allCves,
    lastUpdated,
  };
}
