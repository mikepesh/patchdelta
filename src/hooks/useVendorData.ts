import fortinetRaw from '../data/fortinet.json';
import panRaw from '../data/pan.json';
import type { VendorData, CveEntry } from '../types';

const fortinet = fortinetRaw as unknown as VendorData;
const pan = panRaw as unknown as VendorData;

if (fortinet.schema_version !== '2.0') {
  throw new Error(`fortinet.json schema mismatch: expected 2.0, got ${fortinet.schema_version}`);
}
if (pan.schema_version !== '2.0') {
  throw new Error(`pan.json schema mismatch: expected 2.0, got ${pan.schema_version}`);
}

export interface VendorStats {
  vendor: string;        // vendor_display_name
  product: string;       // in_scope_products joined
  medianDelta: number;
  avgDelta: number;
  totalCves: number;     // all entries including withdrawn / low-confidence
  kevMedianDelta: number | null;
  proactiveCount: number;
  cves: (CveEntry & { vendor: string })[];  // all entries, vendor overridden to display name
}

export interface AppData {
  vendors: VendorStats[];
  allCves: (CveEntry & { vendor: string })[];
  lastUpdated: string;
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

function isStatEligible(entry: CveEntry): boolean {
  return !entry.withdrawn && entry.confidence !== 'low';
}

function computeStats(data: VendorData): VendorStats {
  const eligible = data.entries.filter(isStatEligible);
  const deltas = eligible.map(c => c.delta_days);
  const kevDeltas = eligible.filter(c => c.in_kev).map(c => c.delta_days);
  const proactiveCount = eligible.filter(c => c.delta_days < 0).length;

  return {
    vendor: data.vendor_display_name,
    product: data.in_scope_products.join(' / '),
    medianDelta: median(deltas),
    avgDelta: average(deltas),
    totalCves: data.entries.length,
    kevMedianDelta: kevDeltas.length > 0 ? median(kevDeltas) : null,
    proactiveCount,
    cves: data.entries.map(c => ({ ...c, vendor: data.vendor_display_name })) as (CveEntry & { vendor: string })[],
  };
}

export function useVendorData(): AppData {
  const fortinetStats = computeStats(fortinet);
  const panStats = computeStats(pan);
  const allCves = [...fortinetStats.cves, ...panStats.cves];
  const lastUpdated = [fortinet.last_ingest_run, pan.last_ingest_run]
    .sort()
    .reverse()[0]!;

  return {
    vendors: [fortinetStats, panStats],
    allCves,
    lastUpdated,
  };
}
