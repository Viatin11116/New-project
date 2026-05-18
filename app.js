(function () {
  const chartHeights = {
    '01_overview_attainment': 300,
    '02_region_grade_heatmap': 280,
    '03_region_latest_progress': 320,
    '04_condition_lollipop': 250,
    '05_discharge_din_bubble': 280,
    '06_sites_map': 540,
    '07_ss_boxplot': 260,
    '08_monthly_salinity_lines': 300,
    '09_ss_secchi_scatter': 280,
    '10_wet_dry_connected_dots': 260,
    '11_salinity_chla_scatter': 280,
    '12_region_ss_summary': 420
  };
  let renderTimer = null;
  let lastWindowWidth = 0;

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function createStatus(message, isError) {
    const node = document.createElement('div');
    node.className = isError ? 'chart-status chart-status--error' : 'chart-status';
    node.textContent = message;
    return node;
  }

  function prepareSpec(key) {
    const source = window.CHART_SPECS && window.CHART_SPECS[key];
    if (!source) {
      throw new Error(`Missing chart spec: ${key}`);
    }

    const spec = clone(source);
    spec.width = 'container';

    if (chartHeights[key]) {
      spec.height = chartHeights[key];
    }

    if (!spec.config) {
      spec.config = {};
    }

    if (!spec.config.view) {
      spec.config.view = {};
    }

    spec.config.view.stroke = null;
    return spec;
  }

  async function renderCharts() {
    lastWindowWidth = window.innerWidth;
    const slots = Array.from(document.querySelectorAll('[data-chart]'));

    for (const slot of slots) {
      const key = slot.dataset.chart;
      slot.classList.add('chart-host');
      slot.style.display = 'block';
      slot.style.width = '100%';
      slot.innerHTML = '';
      slot.appendChild(createStatus('Rendering chart...', false));

      try {
        const spec = prepareSpec(key);
        slot.innerHTML = '';
        await vegaEmbed(slot, spec, {
          actions: false,
          defaultStyle: false,
          renderer: 'svg'
        });
      } catch (error) {
        slot.innerHTML = '';
        slot.appendChild(
          createStatus(
            `Chart failed to render: ${error instanceof Error ? error.message : 'Unknown error'}`,
            true
          )
        );
      }
    }
  }

  function scheduleRender() {
    clearTimeout(renderTimer);
    renderTimer = window.setTimeout(() => {
      renderCharts().catch((error) => {
        console.error(error);
      });
    }, 120);
  }

  function handleResize() {
    if (Math.abs(window.innerWidth - lastWindowWidth) >= 8) {
      scheduleRender();
    }
  }

  window.addEventListener('resize', handleResize);

  if (document.readyState === 'complete') {
    scheduleRender();
  } else {
    window.addEventListener('load', scheduleRender, { once: true });
  }
})();
