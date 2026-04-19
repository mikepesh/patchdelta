export type VendorId = "fortinet" | "panw";

export interface Revision {
  date: string;
  field: keyof CveEntry;
  from: unknown;
  to: unknown;
  reason: string;
  actor: string;
}

export interface CveEntry {
  // Identifier
  cve: string;

  // Vendor / product
  vendor: VendorId;
  affected_products: string[];

  // Dates (ISO 8601, no time)
  nvd_published: string;
  advisory_first_published: string;
  advisory_cve_linked: string | null;
  delta_days: number;

  // Severity / exploitation context
  cvss_score: number | null;
  cvss_vector: string | null;
  severity: "Critical" | "High" | "Medium" | "Low" | "None" | null;
  in_kev: boolean;
  kev_added: string | null;
  epss_score: number | null;
  epss_captured_at: string | null;

  // Disclosure context
  disclosure_type: "coordinated" | "zeroday" | "unclear";

  // Withdrawal
  withdrawn: boolean;

  // Provenance
  source_nvd_url: string;
  source_advisory_url: string;
  source_advisory_superseded_urls: string[];

  // Drift detection — value at ingest
  nvd_published_captured_at_ingest: string;
  advisory_first_published_captured_at_ingest: string;

  // Audit
  ingested_at: string;
  ingested_by: string;
  last_verified_at: string;
  confidence: "high" | "medium" | "low";
  confidence_note: string | null;

  revisions: Revision[];
}

export interface VendorData {
  schema_version: "2.0";
  vendor: VendorId;
  vendor_display_name: string;
  in_scope_products: string[];
  in_scope_mqs: string[];
  last_ingest_run: string;
  last_verification_run: string;
  adapter_version: string | null;
  entries: CveEntry[];
}
