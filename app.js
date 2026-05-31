(function () {
  const chartHeights = {
    '01_condition_track': 280,
    '02_hotspots_map': 560,
    '03_region_pollution_profiles': 280,
    '04_pollutant_grade_heatmap': 360,
    '05_wet_dry_connected': 230,
    '06_monthly_din_salinity': 280,
    '07_year_matched_bars': 250,
    '08_rainfall_context': 320,
    '09_ss_secchi_scatter': 330,
    '10_din_chla_scatter': 330,
    '11_coral_cover_trends': 360,
    '12_target_gap_bars': 320,
    '13_region_progress_stack': 280
  };

  const specCache = new Map();
  let renderTimer = null;
  let lastWindowWidth = 0;
  const isChinese = document.documentElement.lang.toLowerCase().startsWith('zh');
  const copy = {
    rendering: isChinese ? '正在渲染图表...' : 'Rendering chart...',
    fileNoticeTitle: isChinese
      ? '通过 file:// 打开时，图表不会正常显示'
      : 'Charts will not render from file://',
    fileNoticeBody: isChinese
      ? '这个页面会单独加载 JSON 图表规格和 CSV 数据文件，所以必须通过本地服务器或 GitHub Pages 打开。'
      : 'This page loads separate JSON chart specs and CSV data files, so it must be opened through a local server or GitHub Pages.',
    fileNoticeLink: isChinese
      ? '当前本地预览地址是'
      : 'Use',
    errorPrefix: isChinese ? '图表渲染失败：' : 'Chart failed to render: ',
    fileHint: isChinese
      ? ' 请通过本地服务器或 GitHub Pages 打开这个页面，这样才能加载 JSON 图表规格和 CSV 数据文件。'
      : ' Open this page through a local server or GitHub Pages so the JSON specs and CSV files can be fetched.'
  };

  function ensureFileProtocolNotice() {
    if (window.location.protocol !== 'file:') {
      return;
    }

    if (document.querySelector('[data-file-protocol-notice]')) {
      return;
    }

    const notice = document.createElement('section');
    notice.className = 'file-protocol-notice';
    notice.setAttribute('data-file-protocol-notice', 'true');
    notice.innerHTML =
      `<strong>${copy.fileNoticeTitle}</strong>` +
      `<p>${copy.fileNoticeBody}</p>` +
      `<p>${copy.fileNoticeLink} <a href="http://127.0.0.1:8000/">http://127.0.0.1:8000/</a></p>`;

    const shell = document.querySelector('.page-shell');
    if (shell) {
      shell.insertBefore(notice, shell.firstChild);
    } else {
      document.body.insertBefore(notice, document.body.firstChild);
    }
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function createStatus(message, isError) {
    const node = document.createElement('div');
    node.className = isError ? 'chart-status chart-status--error' : 'chart-status';
    node.textContent = message;
    return node;
  }

  async function loadSpec(key) {
    if (!specCache.has(key)) {
      specCache.set(
        key,
        fetch(`./specs/${key}.json`, { cache: 'no-store' }).then(async (response) => {
          if (!response.ok) {
            throw new Error(`HTTP ${response.status} while loading specs/${key}.json`);
          }
          return response.json();
        })
      );
    }
    return specCache.get(key);
  }

  async function prepareSpec(key, containerWidth = 0) {
    const source = await loadSpec(key);
    const spec = clone(source);
    const isCompound =
      Boolean(spec.facet) ||
      Boolean(spec.repeat) ||
      Boolean(spec.concat) ||
      Boolean(spec.hconcat) ||
      Boolean(spec.vconcat);

    if (!isCompound) {
      spec.width = 'container';
    } else if (spec.autosize && spec.autosize.type === 'fit') {
      spec.autosize = { type: 'pad', contains: 'padding' };
    }

    if (chartHeights[key] && !isCompound) {
      spec.height = chartHeights[key];
    }

    if (key === '03_region_pollution_profiles' && Array.isArray(spec.vconcat) && containerWidth > 0) {
      const childWidth = Math.max(340, Math.min(560, Math.floor(containerWidth - 28)));

      spec.vconcat = spec.vconcat.map((child) => ({
        ...child,
        width: childWidth,
        height: 165
      }));
    }

    if (key === '06_monthly_din_salinity' && spec.spec && containerWidth > 0) {
      spec.spec.width = Math.max(420, Math.min(920, Math.floor(containerWidth - 88)));
      spec.center = true;
    }

    spec.config = spec.config || {};
    spec.config.view = spec.config.view || {};
    spec.config.view.stroke = null;
    return spec;
  }

  async function renderCharts() {
    ensureFileProtocolNotice();
    lastWindowWidth = window.innerWidth;
    const slots = Array.from(document.querySelectorAll('[data-chart]'));

    for (const slot of slots) {
      const key = slot.dataset.chart;
      slot.classList.add('chart-host');
      slot.innerHTML = '';
      slot.appendChild(createStatus(copy.rendering, false));

      try {
        const spec = await prepareSpec(key, Math.floor(slot.clientWidth || 0));
        slot.innerHTML = '';
        await vegaEmbed(slot, spec, {
          actions: false,
          defaultStyle: false,
          renderer: 'svg'
        });
      } catch (error) {
        const isFileProtocol = window.location.protocol === 'file:';
        const detail = error instanceof Error ? error.message : 'Unknown error';
        const hint = isFileProtocol
          ? copy.fileHint
          : '';
        slot.innerHTML = '';
        slot.appendChild(
          createStatus(`${copy.errorPrefix}${detail}.${hint}`, true)
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
