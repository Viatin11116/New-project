# Land Runoff and Reef Water Quality

Single-page Vega-Lite data story for `FIT2179 Data Visualisation 2`.

## Files

- `index.html`: final scrolling story page
- `app.js`: loads and embeds all Vega-Lite specs
- `styles.css`: layout, typography and visual styling
- `specs/*.json`: human-readable Vega-Lite specifications
- `data/*.csv`: compact local datasets used by the page
- `scripts/build-inline-specs.mjs`: rebuilds the inline chart bundle used by the published page
- `charts-inline.js`: inlined chart specs and data for static hosting
- `description-draft.md`: draft 500-word Moodle description

## Preview locally

Because the page fetches local `CSV` and `JSON` files, open it through a static server rather than double-clicking the file.

Example:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Publish on GitHub Pages

This project is already prepared for GitHub Pages as a static site.

1. Create a new **public** GitHub repository.
2. Push this folder to the repository on the `main` branch.
3. On GitHub, open `Settings -> Pages`.
4. Under `Build and deployment`, set `Source` to `Deploy from a branch`.
5. Select branch `main` and folder `/(root)`, then click `Save`.

Your public site URL will be:

```text
https://<your-github-username>.github.io/<repository-name>/
```

If you change any chart spec or local data, rebuild the static bundle before pushing:

```bash
node scripts/build-inline-specs.mjs
```

## Before submission

- Replace the footer author placeholder in `index.html`
- Replace or keep the AI acknowledgement line depending on your course submission policy
- Export your hand-drawn sketch separately to PDF, as required by the assignment brief

## Data windows used here

- Reef Report Card target and condition pages: latest publicly accessible `2021-2022` cycle
- AIMS nutrient and water-quality monitoring extract used for recent field evidence:
  `1 January 2024` to `31 December 2025`

## Notes

- The latest AIMS monitoring subset used here does not include Burnett Mary sites, so some recent water-quality charts focus on the monitored stretch from Cape York to Fitzroy.
- Approximate Reef-region labels for AIMS sites were derived from published site codes and location names so the monitoring data could be compared against Reef Report Card regions.
