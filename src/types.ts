export interface CveEntry {
  cve_id: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  cvss: number;
  nvd_published: string;       // YYYY-MM-DD
  advisory_id: string;
  advisory_url: string;
  advisory_published: string;  // YYYY-MM-DD
  delta_days: number;
  in_kev: boolean;
}

export interface VendorData {
  vendor: string;
  product: string;
  last_updated: string;        // YYYY-MM-DD
  cves: CveEntry[];
}
