# FitDoplnky performance experiments

These experiments are not connected to the production build. Do not deploy critical CSS until hydration/theme and visual comparison failures are resolved.

## Critical CSS

1. Build the site from the repository root: `npm run build:static`.
2. `cd experiments/critical-css && npm ci`
3. `npx playwright install chromium`
4. `npm run generate` (optionally `npm run generate -- /absolute/path/to/export`).
5. `npm run verify`. Results and generated copies are written to ignored `.artifacts/`.

Historical results live in `critical-css/results/`; see `report.md` for methodology and limitations. Timings are synthetic, not PageSpeed results.

## Logo candidates

`logos/` contains WebP and reduced-palette PNG candidates generated from `public/logo.png`. They are not used by the website. Smaller PNG variants reduce colors and need visual approval.
