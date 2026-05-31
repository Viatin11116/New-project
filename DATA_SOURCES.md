# Data Sources Audit

Last verified: 30 May 2026

This project uses only traceable datasets from official Great Barrier Reef reporting or monitoring
sources, plus one non-analytical basemap. Every chart shown in `index.html` is documented below
with its underlying dataset and official source trail.

## Dataset audit

| File | Status | Official source | Notes |
| --- | --- | --- | --- |
| `data/reportcard_targets_2021_2022.csv` | Official raw | Reef Plan report card landing page: <https://www.reefplan.qld.gov.au/tracking-progress/reef-report-card> ; official 2021-22 page: <https://www.reefplan.qld.gov.au/tracking-progress/reef-report-card/2021-22> | Local table of official target results by region and pollutant category. Each row retains a direct `sourceUrl` pointing to the corresponding official interactive target page on `reportcard.reefplan.qld.gov.au`. As checked on 30 May 2026, the latest publicly listed Reef Plan report card remains the `2021 and 2022` release. |
| `data/reportcard_condition_2022.csv` | Official raw | Reef Plan report card landing page: <https://www.reefplan.qld.gov.au/tracking-progress/reef-report-card> ; official 2021-22 page: <https://www.reefplan.qld.gov.au/tracking-progress/reef-report-card/2021-22> | Local table of official 2022 inshore condition results by region. Each row retains a direct `sourceUrl` pointing to the corresponding official interactive condition page. |
| `data/aims_samples_2024_2025.csv` | Official raw extract | AIMS monitoring overview: <https://www.aims.gov.au/research-topics/monitoring-and-discovery/monitoring-water-quality> ; AIMS metadata record / DOI page: <https://apps.aims.gov.au/metadata/view/a5a02dc8-16b4-4b50-abad-af4a1c1e9c49> ; data.gov.au mirror summary: <https://data.gov.au/data/dataset/great-barrier-reef-marine-monitoring-program-for-inshore-water-quality-physico-chemical-and-nut> | Local extract from the official AIMS Marine Monitoring Program physico-chemical and nutrient database. It covers 779 samples from `3 Jan 2024` to `16 Jul 2025` across 79 unique site codes. The metadata record notes that the program includes both routine ambient monitoring and flood-event monitoring. |
| `data/mmp_hc_sc_a_by_site.csv` | Official raw copy | AIMS coral dataset DOI: <https://doi.org/10.25845/5cc64f29b35a1> ; data.gov.au dataset page: <https://www.data.gov.au/data/dataset/great-barrier-reef-marine-monitoring-program-coral-mmp> | Unchanged copy of the official AIMS Marine Monitoring Program inshore coral benthic-cover file downloaded from the dataset package. This chart uses only rows where `GROUP_CODE = Hard Coral`, then calculates mean cover by region and survey year inside Vega-Lite. |
| `data/world-110m.json` | External basemap | World Atlas package: <https://github.com/topojson/world-atlas> ; Natural Earth attribution: <https://www.naturalearthdata.com/> | Used only as a lightweight locator basemap under the analytical hotspot points. |
| `data/reportcard_ecosystem_components_2022.csv` | Unused legacy helper table | Same Reef Plan condition source as `reportcard_condition_2022.csv` | Retained in the folder from an earlier draft, but not used by any current chart, page section, or script in the final submission version. |

## Chart-to-data mapping

| Chart JSON | Purpose in story | Data file(s) used | Source link(s) shown on page |
| --- | --- | --- | --- |
| `01_condition_track.json` | Latest official water-quality condition by region | `reportcard_condition_2022.csv` | <https://www.reefplan.qld.gov.au/tracking-progress/reef-report-card/2021-22> |
| `02_hotspots_map.json` | Spatial variation in median suspended solids across inshore monitoring sites, shown as percentile bands of the site-median distribution to separate typical sites from extreme outliers | `aims_samples_2024_2025.csv`, `world-110m.json` | <https://apps.aims.gov.au/metadata/view/a5a02dc8-16b4-4b50-abad-af4a1c1e9c49> ; <https://github.com/topojson/world-atlas> |
| `03_region_pollution_profiles.json` | Regional medians for DIN, suspended solids and chlorophyll | `aims_samples_2024_2025.csv` | <https://apps.aims.gov.au/metadata/view/a5a02dc8-16b4-4b50-abad-af4a1c1e9c49> |
| `04_pollutant_grade_heatmap.json` | Pollutant types and regional target grades | `reportcard_targets_2021_2022.csv` | <https://www.reefplan.qld.gov.au/tracking-progress/reef-report-card/2021-22> |
| `05_wet_dry_connected.json` | Wet-season versus dry-season differences. Retained in the repository but not embedded in the current final page. | `aims_samples_2024_2025.csv` | <https://apps.aims.gov.au/metadata/view/a5a02dc8-16b4-4b50-abad-af4a1c1e9c49> |
| `06_monthly_din_salinity.json` | Monthly change in DIN and salinity | `aims_samples_2024_2025.csv` | <https://apps.aims.gov.au/metadata/view/a5a02dc8-16b4-4b50-abad-af4a1c1e9c49> |
| `07_year_matched_bars.json` | Matched Jan-Jul comparison: 2024 versus 2025. Retained in the repository but not embedded in the current final page. | `aims_samples_2024_2025.csv` | <https://apps.aims.gov.au/metadata/view/a5a02dc8-16b4-4b50-abad-af4a1c1e9c49> |
| `08_rainfall_context.json` | Official rainfall / discharge context for 2022 condition. Uses `rainfallMm` directly on x, derives y as `dischargeGl / (areaHectares / 1000)`, and colours points by `waterQualityRank`. | `reportcard_condition_2022.csv` | <https://www.reefplan.qld.gov.au/tracking-progress/reef-report-card/2021-22> |
| `09_ss_secchi_scatter.json` | Suspended solids versus water clarity | `aims_samples_2024_2025.csv` | <https://apps.aims.gov.au/metadata/view/a5a02dc8-16b4-4b50-abad-af4a1c1e9c49> |
| `10_din_chla_scatter.json` | DIN versus chlorophyll association | `aims_samples_2024_2025.csv` | <https://apps.aims.gov.au/metadata/view/a5a02dc8-16b4-4b50-abad-af4a1c1e9c49> |
| `11_coral_cover_trends.json` | Long-run inshore hard coral cover trends by region | `mmp_hc_sc_a_by_site.csv` | <https://doi.org/10.25845/5cc64f29b35a1> ; <https://www.data.gov.au/data/dataset/great-barrier-reef-marine-monitoring-program-coral-mmp> |
| `12_target_gap_bars.json` | Reef-wide target completion, calculated as `overallProgress / targetValue * 100` for each official Reef-wide indicator | `reportcard_targets_2021_2022.csv` | <https://www.reefplan.qld.gov.au/tracking-progress/reef-report-card/2021-22> |

## Data handling rules followed in this rebuild

- No fabricated or schematic data were introduced.
- Aggregations such as medians, monthly summaries, rainfall / discharge context and coral-cover
  means are calculated inside the Vega-Lite specs wherever possible.
- The map basemap is support data only; the analytical hotspot marks come from the official AIMS
  sample extract.
- For the Reef Plan CSVs, row-level `sourceUrl` fields preserve the original interactive report
  card pages alongside the summary page linked in the charts.
- `13_region_progress_stack.json` is retained on disk from an earlier draft, but it is not embedded
  in the current final page.
