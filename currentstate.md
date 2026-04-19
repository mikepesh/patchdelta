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

Both vendor files contain **sample/placeholder data only** — 5 CVEs each. Real data has not been populated yet.

| File | CVEs | Status |
|------|------|--------|
| `src/data/fortinet.json` | 5 | Sample only |
| `src/data/pan.json` | 5 | Sample only |

## Open tasks

- [ ] Populate `src/data/fortinet.json` with real CVE data
- [ ] Populate `src/data/pan.json` with real CVE data
- [ ] Add `www` DNS A record in Cloudflare (proxied, `192.0.2.1`) — `www.patchdelta.com` not resolving yet

## CI/CD

GitHub Actions workflow at `.github/workflows/deploy.yml`. Triggers on push to `main`. Requires two GitHub secrets:
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

Both are set on `mikepesh/patchdelta`.

## Architecture

```
src/
  data/fortinet.json        ← edit this to update Fortinet CVEs
  data/pan.json             ← edit this to update PAN-OS CVEs
  types.ts                  ← CveEntry, VendorData interfaces
  hooks/useVendorData.ts    ← synchronous stats (median, avg, KEV median)
  components/
    Leaderboard.tsx         ← two vendor cards, "Faster" badge
    CveTable.tsx            ← sort, filter, color-coded badges
    Methodology.tsx         ← static text section
    Header.tsx
    Footer.tsx
  App.tsx
```

## V2 note

A prior V2 attempt (Supabase + cron workers + NVD pipeline) was shelved. Archive at `PatchDelta_V2_Research_Archive.zip`.
