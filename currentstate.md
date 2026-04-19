# PatchDelta — Current State

**Last updated:** 2026-04-19

## Status: LIVE

| | |
|---|---|
| Production | https://patchdelta.com |
| GitHub | https://github.com/mikepesh/patchdelta (public) |
| Cloudflare account | 8cd9a0b61c637d585faffbcf46f38940 |
| Zone ID | 0ad12fc015584168298bce08edb3bdf4 |

## Data

Schema 2.0 in effect. Real CVE data ingested for both vendors.

| File | CVEs | Status |
|------|------|--------|
| `src/data/fortinet.json` | 10 | Real data — schema 2.0 |
| `src/data/pan.json` | 10 | Real data — schema 2.0 |

## Open tasks

- [ ] Add `www` DNS A record in Cloudflare (proxied, `192.0.2.1`) — `www.patchdelta.com` not resolving yet
- [ ] Expand real CVE coverage beyond initial 10 per vendor (ongoing)
- [ ] Verify CVE-2023-44487 (Fortinet) `advisory_first_published`: Oct 2023 IPS threat signal vs Feb 2024 formal PSIRT advisory — see `confidence_note` on entry
- [ ] Wayback Machine verification for CVE-2024-55591 (FG-IR-24-535) first-public date
- [ ] Wayback Machine verification for CVE-2019-1579 (PAN) July 18 advisory date

## CI/CD

GitHub Actions workflow at `.github/workflows/deploy.yml`. Triggers on push to `main`. Requires two GitHub secrets:
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

Both are set on `mikepesh/patchdelta`.

## Architecture

```
src/
  data/fortinet.json        ← schema 2.0, edit to add/update Fortinet CVEs
  data/pan.json             ← schema 2.0, edit to add/update PAN-OS CVEs
  types.ts                  ← CveEntry, VendorData interfaces (schema 2.0)
  hooks/useVendorData.ts    ← synchronous stats; schema guard throws on version mismatch
  components/
    Leaderboard.tsx         ← two vendor cards, "Faster" badge, proactive count
    CveTable.tsx            ← sort, filter, confidence markers, Proactive badge
    Methodology.tsx         ← verbatim public methodology from data-spec.md §9
    Header.tsx
    Footer.tsx
  App.tsx
CONTRIBUTING.md             ← manual ingest runbook
data-spec.md                ← canonical data contract (authoritative)
architecture.md             ← vocabulary and component layout
```

## V2 note

A prior V2 attempt (Supabase + cron workers + NVD pipeline) was shelved. Archive at `PatchDelta_V2_Research_Archive.zip`.
