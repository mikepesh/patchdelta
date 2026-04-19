# PatchDelta — Manual Ingest Runbook

This document is the step-by-step procedure for adding a real CVE entry to PatchDelta. Follow it exactly. If you hit a situation not covered here, stop and consult `data-spec.md` before making a judgment call.

**Who this is for:** Anyone adding or correcting entries in `src/data/fortinet.json` or `src/data/pan.json`.

---

## 1. Confirm the CVE is in scope

Before spending time on a CVE, verify all three inclusion criteria from `data-spec.md §3`:

1. **Published in NVD** — search `nvd.nist.gov/vuln/detail/{CVE-ID}`. If the page doesn't exist or shows "CVE Not Found", skip it.
2. **Affects an in-scope product** — V1 in-scope products: FortiOS / FortiGate (Fortinet), PAN-OS (Palo Alto Networks). Adjacent products (FortiMail, FortiAnalyzer, FortiManager, Prisma Cloud, etc.) are out of scope.
3. **Vendor has a traceable advisory** — a PSIRT advisory or pre-CVE bulletin describing the vulnerability.

If all three pass, proceed.

---

## 2. Get the NVD published date

1. Go to `https://nvd.nist.gov/vuln/detail/{CVE-ID}`.
2. Find the **Published** date (not *Modified*). Example: `Published: February 09, 2024`.
3. Convert to ISO 8601: `2024-02-09`.
4. Record as `nvd_published`.
5. Also record as `nvd_published_captured_at_ingest` — this is a snapshot; the weekly verification job will alert if NVD later revises it.

> **Do not use `lastModified`/Modified date.** It changes whenever NVD enriches the record and would make deltas non-deterministic.

---

## 3. Find and date the vendor advisory

### Fortinet

1. Search `https://www.fortiguard.com/psirt` for the CVE ID or the FG-IR number.
2. Open the advisory page (`fortiguard.com/psirt/FG-IR-YY-NNN`).
3. Find the **revision history** table at the bottom of the page. The earliest revision is the `advisory_first_published` date.
4. If no revision history is shown, use the date Fortinet explicitly states as the publication date.
5. Check whether the advisory supersedes an earlier bulletin for the same flaw. If so, click through to the earlier advisory and use its date.

### Palo Alto Networks

1. Go to `https://security.paloaltonetworks.com/{CVE-ID}`.
2. Find the **revision history** / "Updated" section.
3. The `Published` date shown is the `advisory_first_published`.
4. If the advisory was originally published under a `PAN-SA-YYYY-NNNN` identifier before the CVE was assigned:
   - Go to `https://security.paloaltonetworks.com/PAN-SA-YYYY-NNNN`.
   - Use that advisory's published date as `advisory_first_published`.
   - Record the CVE-ID advisory URL as `source_advisory_url`.
   - Record the PAN-SA URL in `source_advisory_superseded_urls`.
   - Set `advisory_cve_linked` to the date the CVE ID first appeared in the advisory.

---

## 4. Determine `advisory_first_published`

This is the most important and most error-prone field. The rule from `data-spec.md §4`:

> **The earliest date the vendor publicly warned about the specific vulnerability, in any form, under any identifier.**

Resolution procedure:

1. Locate the advisory's revision history. Look for the earliest revision that describes the underlying vulnerability — not just "initial publication" of a page that had no vulnerability content yet.
2. If the advisory supersedes a prior advisory covering the same flaw, walk the chain to the earliest.
3. If revision history is incomplete or absent:
   - Try the Wayback Machine: `https://web.archive.org/web/*/advisory_url` — find the earliest capture that contains vulnerability content.
   - If Wayback gives you a date, use it and set `confidence: "medium"` with a note.
   - If no history at all: use the vendor's posted date, set `confidence: "medium"` or `"low"` depending on certainty.

Record this date as both `advisory_first_published` and `advisory_first_published_captured_at_ingest`.

---

## 5. Determine `advisory_cve_linked`

- If the advisory was first published under a CVE ID (no pre-CVE bulletin): set `advisory_cve_linked: null`.
- If the advisory was first published under a vendor ID (pre-CVE), and the CVE ID was added later: set `advisory_cve_linked` to the date the CVE ID was first referenced in the advisory. This may be a different date shown in the revision history.

---

## 6. Compute `delta_days`

```
delta_days = advisory_first_published − nvd_published
```

In calendar days (UTC). Count forward from NVD date to advisory date. Negative means advisory was published before NVD. Zero means same calendar day.

Example: advisory `2024-02-08`, NVD `2024-02-09` → `delta_days = -1`.

---

## 7. Fill severity and CVSS

1. Use the **NVD CVSS v3.1 base score** from the NVD page. If NVD has not yet scored it, use the vendor's CVSS score and note the discrepancy.
2. If NVD and vendor disagree on the score, use NVD's and record the discrepancy in `confidence_note`.
3. Severity values must be title-case: `"Critical"`, `"High"`, `"Medium"`, `"Low"`, `"None"`.

---

## 8. Check CISA KEV

1. Download the current KEV CSV: `https://www.cisa.gov/sites/default/files/csv/known_exploited_vulnerabilities.csv`
2. Search for the CVE ID.
3. If found: `in_kev: true`, `kev_added: "{dateAdded from CSV}"`.
4. If not found: `in_kev: false`, `kev_added: null`.

---

## 9. Set `disclosure_type`

| Value | When to use |
|---|---|
| `"zeroday"` | Vulnerability was being actively exploited before or at the time of public disclosure, OR the vendor disclosed because exploitation was already occurring. |
| `"coordinated"` | Vulnerability was reported privately to the vendor; vendor and reporter coordinated a public release. No known exploitation at time of disclosure. |
| `"unclear"` | Cannot determine from available sources. Use sparingly and explain in `confidence_note`. |

---

## 10. Set provenance fields

- `source_nvd_url`: `https://nvd.nist.gov/vuln/detail/{CVE-ID}`
- `source_advisory_url`: canonical advisory URL (the CVE-ID-specific page if one exists)
- `source_advisory_superseded_urls`: list of prior advisory URLs in the chain (e.g., PAN-SA pre-CVE URL), or `[]` if none

---

## 11. Set confidence

| Rating | Use when |
|---|---|
| `"high"` | Both dates sourced directly from primary sources (NVD page, vendor revision history). No inference. |
| `"medium"` | One date required minor inference — revision history truncated, used earliest available; Wayback Machine used to confirm. |
| `"low"` | Significant inference — no revision history, Wayback gave unclear result, dates estimated. |

Any rating below `"high"` **requires** a `confidence_note` explaining specifically what was inferred and why. The note should be detailed enough that a future human can evaluate it.

---

## 12. Required checklist before adding the entry

- [ ] CVE is in NVD
- [ ] CVE affects an in-scope product
- [ ] `nvd_published` sourced from NVD `Published` field (not Modified)
- [ ] `advisory_first_published` traced to earliest public vendor warning, revision history checked
- [ ] `delta_days` computed correctly: `advisory_first_published − nvd_published`
- [ ] `advisory_cve_linked` set correctly (null if no pre-CVE advisory)
- [ ] CVSS from NVD; discrepancy noted in `confidence_note` if present
- [ ] KEV status verified against current CISA CSV
- [ ] `confidence` set honestly; `confidence_note` present if not `"high"`
- [ ] `ingested_by: "mikepesh"`, `ingested_at: "{today}"`, `last_verified_at: "{today}"`
- [ ] `revisions: []` (empty on first ingest)
- [ ] `withdrawn: false`

---

## 13. Commit format

Each CVE can go in its own commit or be batched by vendor:

```
data(fortinet): ingest CVE-2024-21762 (FG-IR-24-015, delta -1)
data(panw): ingest CVE-2024-0012 and CVE-2024-9474
```

Run `npm run build` before committing. The build-time schema guard will catch any structural mistakes.

---

## Edge cases

See `data-spec.md §10` for the full edge case catalog. Common ones:

- **Multi-CVE bundled advisory**: each CVE gets its own row. Same `source_advisory_url` and same `advisory_first_published`.
- **CVE affects in-scope and out-of-scope products**: include if any affected product is in scope. List only in-scope products in `affected_products`.
- **Vendor advisory exists but no NVD record**: out of scope — skip until NVD publishes.
- **CVE later withdrawn/rejected**: set `withdrawn: true`. Do not delete the row.
