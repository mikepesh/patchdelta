import { useState } from 'react';
import type { CveEntry } from '../types';

type CveRow = CveEntry & { vendor: string };
type SortCol = keyof CveEntry | 'vendor';
type SortDir = 'asc' | 'desc';

interface CveTableProps {
  cves: CveRow[];
}

const VENDOR_FILTERS = ['All', 'Fortinet', 'Palo Alto Networks'] as const;
const SEVERITY_FILTERS = ['All', 'Critical', 'High', 'Medium', 'Low'] as const;

const SEVERITY_BADGE: Record<string, string> = {
  Critical: 'bg-red-900 text-red-300',
  High: 'bg-orange-900 text-orange-300',
  Medium: 'bg-yellow-900 text-yellow-300',
  Low: 'bg-gray-700 text-gray-300',
};

function deltaColor(days: number): string {
  if (days <= 0) return 'text-green-400';
  if (days <= 30) return 'text-yellow-400';
  return 'text-red-400';
}

interface ColDef {
  key: SortCol;
  label: string;
  numeric?: boolean;
}

const COLUMNS: ColDef[] = [
  { key: 'cve', label: 'CVE ID' },
  { key: 'vendor', label: 'Vendor' },
  { key: 'severity', label: 'Severity' },
  { key: 'cvss_score', label: 'CVSS', numeric: true },
  { key: 'nvd_published', label: 'NVD Published' },
  { key: 'advisory_first_published', label: 'Advisory Published' },
  { key: 'delta_days', label: 'Delta (days)', numeric: true },
  { key: 'epss_score', label: 'EPSS', numeric: true },
  { key: 'in_kev', label: 'KEV' },
];

export function CveTable({ cves }: CveTableProps) {
  const [sortCol, setSortCol] = useState<SortCol>('delta_days');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [filterVendor, setFilterVendor] = useState('All');
  const [filterSeverity, setFilterSeverity] = useState('All');

  function handleSort(col: SortCol) {
    if (col === sortCol) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortCol(col);
      setSortDir('desc');
    }
  }

  const filtered = cves
    .filter(c => filterVendor === 'All' || c.vendor === filterVendor)
    .filter(c => filterSeverity === 'All' || c.severity === filterSeverity);

  const sorted = [...filtered].sort((a, b) => {
    const av = a[sortCol as keyof CveRow];
    const bv = b[sortCol as keyof CveRow];
    let cmp: number;
    if (av === null && bv === null) cmp = 0;
    else if (av === null) cmp = -1;
    else if (bv === null) cmp = 1;
    else if (typeof av === 'string' && typeof bv === 'string') cmp = av.localeCompare(bv);
    else if (typeof av === 'number' && typeof bv === 'number') cmp = av - bv;
    else if (typeof av === 'boolean' && typeof bv === 'boolean') cmp = Number(av) - Number(bv);
    else cmp = 0;
    return sortDir === 'asc' ? cmp : -cmp;
  });

  return (
    <div>
      {/* Filter pills */}
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="flex gap-1">
          {VENDOR_FILTERS.map(v => (
            <button
              key={v}
              onClick={() => setFilterVendor(v)}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                filterVendor === v
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {v}
            </button>
          ))}
        </div>
        <div className="flex gap-1">
          {SEVERITY_FILTERS.map(s => (
            <button
              key={s}
              onClick={() => setFilterSeverity(s)}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                filterSeverity === s
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr className="bg-gray-900">
              {COLUMNS.map(col => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  title={
                    col.key === 'delta_days'
                      ? 'Negative values mean the vendor published their advisory before NVD cataloged the CVE — indicating proactive or coordinated disclosure.'
                      : col.key === 'epss_score'
                      ? 'Exploit Prediction Scoring System (FIRST.org) — probability of exploitation in the next 30 days. Snapshotted at ingest.'
                      : undefined
                  }
                  className="cursor-pointer select-none px-3 py-2 text-gray-400 hover:text-gray-100 whitespace-nowrap border-b border-gray-800"
                >
                  {col.label}
                  {sortCol === col.key && (
                    <span className="ml-1">{sortDir === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((cve, i) => (
              <tr
                key={`${cve.cve}-${cve.vendor}`}
                className={`border-b border-gray-800 ${
                  i % 2 === 0 ? 'bg-gray-950' : 'bg-gray-900'
                } ${cve.withdrawn ? 'opacity-40' : ''}`}
              >
                <td className="px-3 py-2 whitespace-nowrap">
                  <a
                    href={cve.source_nvd_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline"
                  >
                    {cve.cve}
                  </a>
                  {cve.withdrawn && (
                    <span className="ml-1.5 text-xs text-gray-500 line-through">withdrawn</span>
                  )}
                  {!cve.withdrawn && cve.confidence !== 'high' && (
                    <span
                      title={cve.confidence_note ?? `Confidence: ${cve.confidence}`}
                      className="ml-1.5 text-xs text-yellow-600 cursor-help"
                    >
                      {cve.confidence === 'low' ? '⚠ low' : '~'}
                    </span>
                  )}
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-gray-300">
                  {cve.vendor}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {cve.severity && (
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded font-mono ${
                        SEVERITY_BADGE[cve.severity] ?? 'bg-gray-700 text-gray-300'
                      }`}
                    >
                      {cve.severity.toUpperCase()}
                    </span>
                  )}
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-gray-300">
                  {cve.cvss_score !== null ? cve.cvss_score.toFixed(1) : '—'}
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-gray-300">
                  {cve.nvd_published}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <a
                    href={cve.source_advisory_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline"
                  >
                    {cve.advisory_first_published}
                  </a>
                  {cve.advisory_cve_linked && (
                    <div className="text-xs text-gray-500 mt-0.5">
                      CVE linked: {cve.advisory_cve_linked}
                    </div>
                  )}
                </td>
                <td
                  className={`px-3 py-2 whitespace-nowrap font-mono ${deltaColor(cve.delta_days)}`}
                  title={
                    cve.delta_days < 0
                      ? 'Negative values mean the vendor published their advisory before NVD cataloged the CVE — indicating proactive or coordinated disclosure.'
                      : undefined
                  }
                >
                  {cve.delta_days}
                  {cve.delta_days < 0 && (
                    <span className="ml-1.5 text-xs font-sans font-medium text-green-500 border border-green-800 rounded px-1 py-px">
                      Proactive
                    </span>
                  )}
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-gray-400 font-mono text-xs">
                  {cve.epss_score !== null ? `${(cve.epss_score * 100).toFixed(1)}%` : '—'}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {cve.in_kev && (
                    <span className="text-xs bg-red-900 text-red-300 px-1.5 py-0.5 rounded font-mono">
                      KEV
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
