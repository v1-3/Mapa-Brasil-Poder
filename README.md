# Mapa Brasil Poder

An illustrated, bilingual atlas of Brazilian parties and institutions, 1947–2026. Portuguese is the default; English is available throughout the interface and historical cards.

**Public website:** https://v1-3.github.io/Mapa-Brasil-Poder/

## Website files

- `docs/index.html`, `styles.css`, `app.js` — accessible static interface, chart, language and year controls.
- `docs/model.mjs` — deterministic model calculations and URL-state helpers.
- `docs/data.json` — annual inputs, 240 named national officeholders, party identities, sources and correction notes.
- `docs/content.json` — eight bilingual historical periods and their citations.
- `docs/images.json`, `docs/images/` — eight credited historical photographs, licences and provenance.
- `docs/history.html` — generated reading version in both languages, usable without JavaScript.
- `docs/.nojekyll` — serves the files directly through GitHub Pages.

GitHub Pages publishes the `docs` directory on the `main` branch. No build or package installation is required. The page uses Google Fonts and links to its historical sources.

## Rebuild and validate

Requires Node.js; no package installation is needed:

```sh
node scripts/build-data.cjs
node scripts/enrich-data.cjs
node scripts/build-static.cjs
node scripts/test.mjs
node --check docs/app.js
```

Run the scripts in order: the first recreates the data, the second adds names and further corrections. `scripts/legacy-input.json` preserves the imported numerical inputs and original file hash for reproducibility. Changes to narrative content go in `docs/content.json`; regenerate the static reading page afterward. Commit and push to `main`, then verify the public deployment.

The tests check arithmetic, missing-value semantics, all 80 years, officeholder names, source references, historical correction regressions, bilingual fields, image attribution and asset presence. They do not independently establish historical accuracy.

## Scope and data limitations

The weights total 100 but are editorial choices. Values are **model points**, not probabilities or percentages of all political power. Missing components remain unassigned; partial sums are never rescaled to look complete. The table exports percentages rather than misleading normalized seat counts.

Officeholders use a 1 July reference, with acting roles identified. Inherited parliamentary and governor shares are estimates, not a complete dated affiliation register. The early Senate proxy copied Chamber shares; those values and other contradicted inputs have been withdrawn. In 1969, closed congressional institutions receive no points. The 2026 profile is not a live feed or an election result.

See the website’s source list and correction log for evidence, and `docs/revision-notes.md` for the implementation review.

Publication does not constitute independent verification of every inherited historical value. Dated rosters are still needed to replace the remaining estimates.

Older drafts remain recoverable from Git history. Local research, draft archives and review artifacts are excluded from the deployed website and future repository additions by `.gitignore`.
