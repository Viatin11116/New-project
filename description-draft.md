# Draft Moodle Description

This visualisation examines **how land runoff still shapes pollution pressure in the Great Barrier
Reef's inshore waters**. The goal is to help a general Australian reader understand a problem that
is often discussed only in broad environmental terms. Instead of talking about "runoff" as an
abstract upstream issue, the page shows where pollution pressure clusters, which pollutants matter,
when the signal intensifies, what ecological consequences appear, and whether management progress is
keeping up. I chose this topic because the Reef is widely recognised, but the land-to-sea pollution
pathway is much harder for a general audience to grasp quickly. The language is intentionally plain:
"wet-season water", "target completion", "poorer clarity" and "moderate condition" are easier to read
than specialist scientific terminology.

The visualisation combines **three official data sources** plus a sourced basemap. The first source
is the **Reef Plan report card** on `reefplan.qld.gov.au` / `reportcard.reefplan.qld.gov.au`. As
checked on **30 May 2026**, the latest publicly accessible official report card is still the
**2021 and 2022** release, so I used its regional target results and 2022 inshore condition
results. These pages provide pollutant target grades, cumulative progress toward targets, and
rainfall / discharge context. The second source is the **Australian Institute of Marine Science
Marine Monitoring Program for Inshore Water Quality**, using a local extract from the official
physico-chemical and nutrient database. The extract covers **779 samples from 3 January 2024 to
16 July 2025** across 79 site codes. The third source is the **AIMS Great Barrier Reef Marine
Monitoring Program coral dataset**, used for long-run inshore hard coral cover trends from **2005
to 2022**. Most summaries such as medians, monthly lines, rainfall / discharge context and
coral-cover means are calculated directly inside the Vega-Lite specifications. Each chart on the
page includes a visible source link, and all datasets are documented separately in
`DATA_SOURCES.md`.

I used 10 different Vega-Lite views because the story needs both overview and evidence. The page
opens with a coastal map comparing median suspended solids across recent inshore monitoring sites,
then moves into regional profiles for dissolved inorganic nitrogen, suspended
solids and chlorophyll. A heatmap introduces the pollutant families tracked by the Reef Plan.
Time-based charts now focus on monthly DIN and salinity variation plus rainfall / discharge context
from the report card. Two scatter plots show consequences in the water column: more suspended
solids are associated with lower Secchi depth, while higher nitrogen is associated with higher
chlorophyll. A long-run coral chart then extends the ecological story by showing that inshore hard
coral cover has not recovered evenly across regions. Finally, a Reef-wide target-completion chart and a
repeated problem-framing condition view close the story by reinforcing that management progress is
still incomplete.

The main design decision was to make the page feel like an editorial field report rather than an
exploration dashboard. The layout follows a five-part sequence that mirrors the story logic:
spatial pattern, pollutant type, time signal, ecological consequences, and management progress.
Colour is used consistently: rust and sand colours imply pressure or lagging grades, while teal
and green imply stronger condition or recovery. The typography uses a strong serif headline style
to create a distinct visual voice, while body text stays readable and compact. Interactivity is
light and purposeful, mainly hover tooltips, because the assignment brief prioritises communication
and storytelling over expert analytical controls.
