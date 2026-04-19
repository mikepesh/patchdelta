# PatchDelta

Static single-page site comparing cybersecurity vendor patch response times (delta days: NVD CVE publish → vendor advisory publish). V1 covers Fortinet (FortiOS) and Palo Alto Networks (PAN-OS).

## Stack

- React + TypeScript + Vite + Tailwind CSS
- Fully static — no backend, no API, no database
- Data bundled at build time from `src/data/fortinet.json` and `src/data/pan.json`
- Cloudflare Workers Assets for hosting (Wrangler 4.x)
- CI/CD: GitHub Actions → build → `wrangler deploy` on push to main

## Key conventions

- JSON data files live in `src/data/` — imported directly, never fetched at runtime
- Stats computed synchronously in `src/hooks/useVendorData.ts` — no loading state
- All components use named exports
- Dark mode default via `class="dark"` on `<html>`, Tailwind `darkMode: 'class'`
- No routing — single page only

## Commands

```bash
npm run dev       # local dev server
npm run build     # production build → dist/
npx wrangler deploy  # manual deploy to Cloudflare
```

## Current state

See [currentstate.md](./currentstate.md) for live URLs, open tasks, and data status.
