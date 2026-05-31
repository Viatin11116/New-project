# Tracing Great Barrier Reef Pollution

Single-page Vega-Lite data story for `FIT2179 Data Visualisation 2`.

This rebuild ignores the previous page layout and reorganises the story around five questions:

1. Where is pollution concentrated?
2. Which pollutants matter?
3. When does the runoff signal strengthen?
4. What ecological consequences follow?
5. Is management progress catching up?

## Project structure

- `index.html`: final single-page story
- `styles.css`: layout, typography and figure-ground styling
- `app.js`: loads each Vega-Lite spec JSON and embeds it into the page
- `specs/*.json`: one human-readable Vega-Lite JSON file per chart
- `data/*`: source-traceable datasets only
- `DATA_SOURCES.md`: standalone source audit and chart-to-data mapping
- `.github/workflows/deploy-pages.yml`: GitHub Pages deployment workflow

## Visualisation inventory

This version includes 10 embedded Vega-Lite charts, including one geographic map:

- official regional condition track
- coastal hotspot map
- regional pollutant profiles
- pollutant-grade heatmap
- monthly DIN / salinity lines
- rainfall / discharge context scatter
- suspended solids versus Secchi scatter
- DIN versus chlorophyll scatter
- inshore hard coral cover trends
- Reef-wide target completion bars

## Run locally

Because the page fetches JSON specs and local CSV files, use a static server rather than opening
`index.html` directly.

Example using the bundled Python runtime or any local Python install:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Publish on GitHub Pages

This repository includes a GitHub Actions workflow that deploys the root static site to GitHub
Pages on every push to `main`.

Once pushed, the site is expected at:

```text
https://viatin11116.github.io/New-project/
```

## Source policy

- Use only real-world data from official or clearly citable sources.
- Record every used dataset and its source in `DATA_SOURCES.md`.
- Do not add unsourced helper CSVs.
