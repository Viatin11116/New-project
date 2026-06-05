// Australia's Gaming Nation — chart embedding
// All visualisations are embedded via vega-embed. A consistent dark theme is
// applied globally so each JSON spec stays focused on its own layout & encoding.

const DARK_THEME = {
  background: "transparent",
  font: "Inter, system-ui, sans-serif",
  view: { stroke: null },
  axis: {
    domain: false,
    grid: false,
    labelColor: "#8a91a3",
    labelFont: "Inter",
    labelFontSize: 11,
    tickColor: "#1a1f35",
    titleColor: "#c8cbd9",
    titleFont: "Inter",
    titleFontSize: 11,
    titleFontWeight: 500
  },
  legend: {
    labelColor: "#c8cbd9",
    labelFont: "Inter",
    labelFontSize: 12,
    titleColor: "#c8cbd9",
    titleFont: "Inter",
    titleFontSize: 12,
    titleFontWeight: 500
  },
  title: {
    color: "#f1f3fa",
    font: "Space Grotesk",
    fontSize: 16,
    fontWeight: 600
  },
  range: {
    category: ["#5DE2E7", "#F4287F", "#B14AED", "#F5B742", "#5DE2A1", "#FF8559", "#42C4D9", "#8A35BD"],
    diverging: ["#F4287F", "#1a1f35", "#5DE2E7"]
  }
};

const EMBED_OPTIONS = {
  theme: undefined,
  config: DARK_THEME,
  renderer: "svg",
  // Resolve data/*.csv paths from the page root, not from vega/*.json
  loader: vega.loader({ baseURL: new URL("./", window.location.href).href }),
  actions: {
    export: true,
    source: true,
    compiled: false,
    editor: false
  },
  tooltip: {
    theme: "dark"
  }
};

// All charts to embed: maps DOM id ? vega-lite spec URL
const CHARTS = [
  ["viz-hero-waffle",   "vega/01-hero-waffle.json"],
  ["viz-gender",        "vega/02-gender-split.json"],
  ["viz-households",    "vega/03-household-devices.json"],
  ["viz-age",           "vega/04-age-pyramid.json"],
  ["viz-devices",       "vega/05-devices.json"],
  ["viz-motivations",   "vega/06-motivations.json"],
  ["viz-revenue",       "vega/07-revenue-timeline.json"],
  ["viz-employment",    "vega/08-employment-growth.json"],
  ["viz-export",        "vega/09-export-flow.json"],
  ["viz-map",           "vega/10-studio-map.json"],
  ["viz-state-bars",    "vega/11-state-comparison.json"],
  ["viz-bubble",        "vega/12-studio-bubble.json"],
  ["viz-roles",         "vega/13-roles.json"],
  ["viz-projection",    "vega/14-projection.json"]
];

function embedAll() {
  CHARTS.forEach(([elId, url]) => {
    const el = document.getElementById(elId);
    if (!el) return;
    vegaEmbed("#" + elId, url, EMBED_OPTIONS)
      .then(() => el.classList.add("is-loaded"))
      .catch((err) => {
        console.error("Failed to embed", url, err);
        el.innerHTML = `<div class="viz-error">Chart failed to load (${url}).<br><small>${err.message || err}</small></div>`;
      });
  });
}

// Re-render on viewport changes so the responsive container width is respected.
let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(embedAll, 220);
});

document.addEventListener("DOMContentLoaded", embedAll);

