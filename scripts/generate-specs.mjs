import fs from 'node:fs/promises';
import path from 'node:path';

const specsDir = path.resolve('specs');

const regionSort = [
  'Cape York region',
  'Wet Tropics region',
  'Burdekin region',
  'Mackay Whitsunday region',
  'Fitzroy region',
  'Burnett Mary region'
];

const monthSort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const gradeScale = {
  domain: [0, 1, 2, 3, 4, 5],
  range: ['#d7d6d2', '#a83f2f', '#d97736', '#e3bd61', '#5db39e', '#17756a']
};

const conditionScale = {
  domain: ['Very poor', 'Poor', 'Moderate', 'Good', 'Very good'],
  range: ['#a83f2f', '#d97736', '#e3bd61', '#5db39e', '#17756a']
};

const regionScale = {
  domain: regionSort,
  range: ['#7f4f24', '#219ebc', '#8a5a44', '#2a9d8f', '#355070', '#6c757d']
};

const baseConfig = {
  $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
  background: null,
  autosize: { type: 'fit', contains: 'padding' },
  config: {
    view: { stroke: null },
    axis: {
      domain: false,
      tickColor: '#9db3bb',
      gridColor: '#d7e0e3',
      labelColor: '#23404a',
      titleColor: '#23404a',
      labelFont: 'Public Sans',
      titleFont: 'Public Sans',
      labelFontSize: 12,
      titleFontSize: 13,
      titleFontWeight: 600
    },
    legend: {
      labelColor: '#23404a',
      titleColor: '#23404a',
      labelFont: 'Public Sans',
      titleFont: 'Public Sans',
      labelFontSize: 12,
      titleFontSize: 13
    },
    header: {
      labelColor: '#23404a',
      titleColor: '#23404a',
      labelFont: 'Public Sans',
      titleFont: 'Public Sans'
    },
    style: {
      'guide-label': { font: 'Public Sans' },
      'guide-title': { font: 'Public Sans' }
    }
  }
};

function withBase(spec) {
  return { ...baseConfig, ...spec };
}

const specs = {
  '01_overview_attainment.json': withBase({
    width: 'container',
    height: 260,
    data: { url: './data/reportcard_targets_2021_2022.csv' },
    transform: [
      { filter: "datum.regionCode === 'GBR'" },
      {
        calculate:
          "datum.targetMode === 'protect' ? (datum.latestValue / datum.targetValue) * 100 : (datum.overallProgress / datum.targetValue) * 100",
        as: 'attainmentPct'
      },
      {
        calculate:
          "datum.targetMode === 'protect' ? format(datum.latestValue, '.0f') + '% protected' : format(datum.overallProgress, '.1f') + '% reduced'",
        as: 'progressLabel'
      }
    ],
    layer: [
      {
        data: { values: [{ target: 100 }] },
        mark: { type: 'rule', strokeDash: [6, 4], color: '#35546a', opacity: 0.65 },
        encoding: { x: { field: 'target', type: 'quantitative' } }
      },
      {
        mark: { type: 'bar', cornerRadiusEnd: 12, height: 28 },
        encoding: {
          y: {
            field: 'shortLabel',
            type: 'ordinal',
            sort: { field: 'measureOrder', order: 'ascending' },
            title: null
          },
          x: {
            field: 'attainmentPct',
            type: 'quantitative',
            scale: { domain: [0, 110] },
            axis: { title: 'Share of the 2025 target already achieved (%)', tickCount: 6 }
          },
          color: {
            field: 'gradeRank',
            type: 'quantitative',
            scale: gradeScale,
            legend: null
          },
          tooltip: [
            { field: 'measure', title: 'Measure' },
            { field: 'gradeLabel', title: 'Grade' },
            { field: 'overallProgress', title: 'Progress to date', format: '.1f' },
            { field: 'targetValue', title: '2025 target', format: '.1f' },
            { field: 'attainmentPct', title: 'Target achieved (%)', format: '.1f' }
          ]
        }
      },
      {
        mark: { type: 'text', align: 'left', baseline: 'middle', dx: 8, fontSize: 12, color: '#23404a' },
        encoding: {
          y: {
            field: 'shortLabel',
            type: 'ordinal',
            sort: { field: 'measureOrder', order: 'ascending' }
          },
          x: { field: 'attainmentPct', type: 'quantitative' },
          text: { field: 'progressLabel' }
        }
      }
    ]
  }),

  '02_region_grade_heatmap.json': withBase({
    width: 'container',
    height: 280,
    data: { url: './data/reportcard_targets_2021_2022.csv' },
    transform: [{ filter: "datum.regionCode !== 'GBR'" }],
    layer: [
      {
        mark: { type: 'rect', cornerRadius: 8 },
        encoding: {
          x: {
            field: 'shortLabel',
            type: 'ordinal',
            sort: { field: 'measureOrder', order: 'ascending' },
            title: null
          },
          y: { field: 'region', type: 'ordinal', sort: regionSort, title: null },
          color: {
            field: 'gradeRank',
            type: 'quantitative',
            scale: gradeScale,
            legend: null
          },
          tooltip: [
            { field: 'region', title: 'Region' },
            { field: 'measure', title: 'Measure' },
            { field: 'gradeLabel', title: 'Grade' },
            { field: 'latestValue', title: 'Latest result', format: '.1f' },
            { field: 'overallProgress', title: 'Progress to date', format: '.1f' },
            { field: 'statusNote', title: 'Note' }
          ]
        }
      },
      {
        mark: { type: 'text', fontSize: 12, fontWeight: 700, color: '#16313a' },
        encoding: {
          x: {
            field: 'shortLabel',
            type: 'ordinal',
            sort: { field: 'measureOrder', order: 'ascending' }
          },
          y: { field: 'region', type: 'ordinal', sort: regionSort },
          text: { field: 'gradeLetter' }
        }
      }
    ]
  }),

  '03_region_latest_progress.json': withBase({
    data: { url: './data/reportcard_targets_2021_2022.csv' },
    transform: [
      { filter: "datum.regionCode !== 'GBR'" },
      { filter: "indexof(['DIN','FS','PN','PP'], datum.measureCode) >= 0" },
      { filter: 'isValid(datum.latestValue)' },
      { calculate: '0', as: 'baseline' }
    ],
    facet: {
      row: {
        field: 'shortLabel',
        sort: { field: 'measureOrder', order: 'ascending' },
        title: null,
        header: { labelFontWeight: 700, labelOrient: 'left', labelPadding: 8 }
      }
    },
    spec: {
      width: 'container',
      height: 78,
      layer: [
        {
          mark: { type: 'rule', strokeWidth: 3, color: '#bfd0d7' },
          encoding: {
            y: { field: 'region', type: 'ordinal', sort: regionSort, title: null },
            x: {
              field: 'baseline',
              type: 'quantitative',
              scale: { domain: [0, 2.4] },
              axis: { title: '2021-2022 reduction (%)', tickCount: 5 }
            },
            x2: { field: 'latestValue' }
          }
        },
        {
          mark: { type: 'point', filled: true, size: 110, color: '#0f6e79', stroke: '#ffffff', strokeWidth: 1.2 },
          encoding: {
            y: { field: 'region', type: 'ordinal', sort: regionSort },
            x: { field: 'latestValue', type: 'quantitative' },
            tooltip: [
              { field: 'region', title: 'Region' },
              { field: 'measure', title: 'Measure' },
              { field: 'latestValue', title: '2021-2022 reduction (%)', format: '.1f' }
            ]
          }
        },
        {
          mark: { type: 'text', align: 'left', baseline: 'middle', dx: 8, fontSize: 11, color: '#23404a' },
          encoding: {
            y: { field: 'region', type: 'ordinal', sort: regionSort },
            x: { field: 'latestValue', type: 'quantitative' },
            text: { field: 'latestValue', format: '.1f' }
          }
        }
      ]
    }
  }),

  '04_condition_lollipop.json': withBase({
    width: 'container',
    height: 250,
    data: { url: './data/reportcard_condition_2022.csv' },
    transform: [
      { filter: "datum.regionCode !== 'GBR'" },
      { filter: 'isValid(datum.waterQualityRank)' },
      { calculate: '1', as: 'baseline' }
    ],
    layer: [
      {
        mark: { type: 'rule', strokeWidth: 3, color: '#cfd8dc' },
        encoding: {
          y: { field: 'region', type: 'ordinal', sort: regionSort, title: null },
          x: {
            field: 'baseline',
            type: 'quantitative',
            scale: { domain: [1, 5] },
            axis: {
              title: '2022 inshore water-quality condition',
              values: [1, 2, 3, 4, 5],
              labelExpr:
                "datum.value == 1 ? 'Very poor' : datum.value == 2 ? 'Poor' : datum.value == 3 ? 'Moderate' : datum.value == 4 ? 'Good' : 'Very good'"
            }
          },
          x2: { field: 'waterQualityRank' }
        }
      },
      {
        mark: { type: 'point', filled: true, size: 140, stroke: '#ffffff', strokeWidth: 1.2 },
        encoding: {
          y: { field: 'region', type: 'ordinal', sort: regionSort },
          x: { field: 'waterQualityRank', type: 'quantitative' },
          color: {
            field: 'waterQualityCondition',
            type: 'nominal',
            scale: conditionScale,
            legend: null
          },
          tooltip: [
            { field: 'region', title: 'Region' },
            { field: 'waterQualityCondition', title: 'Water-quality condition' },
            { field: 'gradeLabel', title: 'Overall inshore marine grade' }
          ]
        }
      },
      {
        mark: { type: 'text', align: 'left', baseline: 'middle', dx: 8, fontSize: 11, color: '#23404a' },
        encoding: {
          y: { field: 'region', type: 'ordinal', sort: regionSort },
          x: { field: 'waterQualityRank', type: 'quantitative' },
          text: { field: 'waterQualityCondition' }
        }
      }
    ]
  }),

  '05_discharge_din_bubble.json': withBase({
    width: 'container',
    height: 310,
    data: { url: './data/region_linkage.csv' },
    transform: [{ filter: 'isValid(datum.dinOverallProgress)' }],
    layer: [
      {
        mark: { type: 'circle', opacity: 0.82, stroke: '#ffffff', strokeWidth: 1.5 },
        encoding: {
          x: {
            field: 'dischargeGl',
            type: 'quantitative',
            axis: { title: 'Annual discharge to coast (GL)' }
          },
          y: {
            field: 'dinOverallProgress',
            type: 'quantitative',
            axis: { title: 'DIN reduction achieved by June 2022 (%)' }
          },
          size: {
            field: 'rainfallMm',
            type: 'quantitative',
            legend: { title: 'Average annual rainfall (mm)' }
          },
          color: {
            field: 'waterQualityCondition',
            type: 'nominal',
            scale: conditionScale,
            legend: { title: '2022 inshore water-quality condition' }
          },
          tooltip: [
            { field: 'region', title: 'Region' },
            { field: 'dischargeGl', title: 'Discharge (GL)', format: ',' },
            { field: 'rainfallMm', title: 'Rainfall (mm)', format: ',' },
            { field: 'dinOverallProgress', title: 'DIN progress (%)', format: '.1f' },
            { field: 'waterQualityCondition', title: 'Water-quality condition' }
          ]
        }
      },
      {
        mark: { type: 'text', dy: -14, fontSize: 11, color: '#23404a', fontWeight: 700 },
        encoding: {
          x: { field: 'dischargeGl', type: 'quantitative' },
          y: { field: 'dinOverallProgress', type: 'quantitative' },
          text: { field: 'regionCode' }
        }
      }
    ]
  }),

  '06_sites_map.json': withBase({
    width: 'container',
    height: 430,
    projection: { type: 'mercator', center: [147.2, -18.3], scale: 3400 },
    layer: [
      {
        data: {
          url: './data/world-110m.json',
          format: { type: 'topojson', feature: 'countries' }
        },
        transform: [{ filter: 'datum.id == 36' }],
        mark: { type: 'geoshape', fill: '#dfe9ea', stroke: '#7b9196', strokeWidth: 1.2 }
      },
      {
        data: { url: './data/aims_site_summary.csv' },
        transform: [{ filter: "datum.period === '2024-2025'" }],
        mark: { type: 'circle', opacity: 0.9, stroke: '#fffef9', strokeWidth: 0.9 },
        encoding: {
          longitude: { field: 'longitude', type: 'quantitative' },
          latitude: { field: 'latitude', type: 'quantitative' },
          size: {
            field: 'sampleCount',
            type: 'quantitative',
            scale: { range: [40, 620] },
            legend: { title: 'Sample count' }
          },
          color: {
            field: 'wetSeasonMeanSS',
            type: 'quantitative',
            scale: { scheme: 'goldorangebrown' },
            legend: { title: 'Wet-season mean suspended solids (mg/L)' }
          },
          tooltip: [
            { field: 'shortName', title: 'Site' },
            { field: 'locationName', title: 'Location' },
            { field: 'region', title: 'Approx. region' },
            { field: 'sampleCount', title: 'Samples', format: ',' },
            { field: 'wetSeasonMeanSS', title: 'Wet-season SS', format: '.2f' },
            { field: 'meanSecchiDepthM', title: 'Mean Secchi depth (m)', format: '.2f' }
          ]
        }
      }
    ]
  }),

  '07_ss_boxplot.json': withBase({
    width: 'container',
    height: 270,
    data: { url: './data/aims_samples_2024_2025.csv' },
    transform: [{ filter: 'isValid(datum.suspendedSolids)' }],
    mark: { type: 'boxplot', extent: 'min-max', ticks: true, median: { color: '#16313a' } },
    encoding: {
      y: { field: 'region', type: 'ordinal', sort: regionSort, title: null },
      x: {
        field: 'suspendedSolids',
        type: 'quantitative',
        axis: { title: 'Suspended solids (mg/L)' }
      },
      color: { field: 'region', type: 'nominal', scale: regionScale, legend: null },
      tooltip: [
        { field: 'region', title: 'Region' },
        { field: 'locationName', title: 'Site' },
        { field: 'suspendedSolids', title: 'Suspended solids', format: '.2f' }
      ]
    }
  }),

  '08_monthly_salinity_lines.json': withBase({
    width: 'container',
    height: 310,
    data: { url: './data/aims_monthly_region.csv' },
    transform: [{ filter: "datum.period === '2024-2025'" }],
    mark: { type: 'line', point: { filled: true, size: 72 }, strokeWidth: 2.5 },
    encoding: {
      x: { field: 'monthLabel', type: 'ordinal', sort: monthSort, title: null },
      y: {
        field: 'medianSalinity',
        type: 'quantitative',
        axis: { title: 'Median salinity (PSU)' }
      },
      color: { field: 'region', type: 'nominal', scale: regionScale, legend: { title: 'Approx. region' } },
      tooltip: [
        { field: 'region', title: 'Region' },
        { field: 'monthLabel', title: 'Month' },
        { field: 'medianSalinity', title: 'Median salinity', format: '.2f' },
        { field: 'sampleCount', title: 'Samples', format: ',' }
      ]
    }
  }),

  '09_ss_secchi_scatter.json': withBase({
    width: 'container',
    height: 320,
    layer: [
      {
        data: { url: './data/aims_samples_2024_2025.csv' },
        transform: [{ filter: 'isValid(datum.suspendedSolids) && isValid(datum.secchiDepthM)' }],
        mark: { type: 'point', filled: true, opacity: 0.65, size: 82, stroke: '#ffffff', strokeWidth: 0.7 },
        encoding: {
          x: {
            field: 'suspendedSolids',
            type: 'quantitative',
            axis: { title: 'Suspended solids (mg/L)' }
          },
          y: {
            field: 'secchiDepthM',
            type: 'quantitative',
            axis: { title: 'Secchi depth (m)' }
          },
          color: { field: 'region', type: 'nominal', scale: regionScale, legend: { title: 'Approx. region' } },
          tooltip: [
            { field: 'locationName', title: 'Site' },
            { field: 'region', title: 'Region' },
            { field: 'suspendedSolids', title: 'Suspended solids', format: '.2f' },
            { field: 'secchiDepthM', title: 'Secchi depth', format: '.2f' }
          ]
        }
      },
      {
        data: { url: './data/aims_samples_2024_2025.csv' },
        transform: [
          { filter: 'isValid(datum.suspendedSolids) && isValid(datum.secchiDepthM)' },
          { regression: 'secchiDepthM', on: 'suspendedSolids' }
        ],
        mark: { type: 'line', stroke: '#16313a', strokeDash: [8, 4], strokeWidth: 2.4, opacity: 0.9 },
        encoding: {
          x: { field: 'suspendedSolids', type: 'quantitative' },
          y: { field: 'secchiDepthM', type: 'quantitative' }
        }
      }
    ]
  }),

  '10_wet_dry_connected_dots.json': withBase({
    width: 'container',
    height: 260,
    data: { url: './data/aims_region_metrics.csv' },
    transform: [
      { filter: "datum.period === '2024-2025'" },
      { fold: ['wetSeasonMedianSS', 'drySeasonMedianSS'], as: ['seasonKey', 'ssValue'] },
      {
        calculate:
          "datum.seasonKey === 'wetSeasonMedianSS' ? 'Wet season' : 'Dry season'",
        as: 'seasonLabel'
      }
    ],
    layer: [
      {
        mark: { type: 'line', strokeWidth: 2.6, color: '#a9bbc2' },
        encoding: {
          y: { field: 'region', type: 'ordinal', sort: regionSort, title: null },
          x: { field: 'ssValue', type: 'quantitative', axis: { title: 'Regional median suspended solids (mg/L)' } },
          detail: { field: 'region' }
        }
      },
      {
        mark: { type: 'point', filled: true, size: 120, stroke: '#ffffff', strokeWidth: 1.1 },
        encoding: {
          y: { field: 'region', type: 'ordinal', sort: regionSort },
          x: { field: 'ssValue', type: 'quantitative' },
          color: {
            field: 'seasonLabel',
            type: 'nominal',
            scale: { domain: ['Wet season', 'Dry season'], range: ['#b55c2d', '#0f6e79'] },
            legend: { title: null }
          },
          tooltip: [
            { field: 'region', title: 'Region' },
            { field: 'seasonLabel', title: 'Season' },
            { field: 'ssValue', title: 'Median SS', format: '.2f' }
          ]
        }
      }
    ]
  }),

  '11_salinity_chla_scatter.json': withBase({
    width: 'container',
    height: 320,
    data: { url: './data/aims_samples_2024_2025.csv' },
    transform: [{ filter: 'isValid(datum.salinity) && isValid(datum.chlorophyllA)' }],
    mark: { type: 'point', filled: true, opacity: 0.7, size: 88, stroke: '#ffffff', strokeWidth: 0.7 },
    encoding: {
      x: { field: 'salinity', type: 'quantitative', axis: { title: 'Salinity (PSU)' } },
      y: {
        field: 'chlorophyllA',
        type: 'quantitative',
        scale: { type: 'log' },
        axis: { title: 'Chlorophyll a (ug/L)' }
      },
      color: { field: 'region', type: 'nominal', scale: regionScale, legend: { title: 'Approx. region' } },
      shape: {
        field: 'season',
        type: 'nominal',
        scale: { domain: ['Wet season', 'Dry season'], range: ['circle', 'diamond'] },
        legend: { title: null }
      },
      tooltip: [
        { field: 'locationName', title: 'Site' },
        { field: 'region', title: 'Region' },
        { field: 'season', title: 'Season' },
        { field: 'salinity', title: 'Salinity', format: '.2f' },
        { field: 'chlorophyllA', title: 'Chlorophyll a', format: '.2f' }
      ]
    }
  })
};

await fs.mkdir(specsDir, { recursive: true });

for (const [filename, spec] of Object.entries(specs)) {
  await fs.writeFile(path.join(specsDir, filename), JSON.stringify(spec, null, 2), 'utf8');
}

console.log(`Generated ${Object.keys(specs).length} Vega-Lite specs in ${specsDir}`);
