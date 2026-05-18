import fs from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve('.');
const specsDir = path.join(root, 'specs');
const outputFile = path.join(root, 'charts-inline.js');

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        cell += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === ',' && !inQuotes) {
      row.push(cell);
      cell = '';
      continue;
    }

    if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && next === '\n') i += 1;
      row.push(cell);
      cell = '';
      if (row.some((value) => value !== '')) rows.push(row);
      row = [];
      continue;
    }

    cell += char;
  }

  if (cell.length > 0 || row.length > 0) {
    row.push(cell);
    if (row.some((value) => value !== '')) rows.push(row);
  }

  if (!rows.length) return [];

  const headers = rows[0];
  return rows.slice(1).map((values) => {
    const record = {};
    headers.forEach((header, index) => {
      const raw = values[index] ?? '';
      if (raw === '') {
        record[header] = null;
      } else if (/^-?\d+(?:\.\d+)?$/.test(raw)) {
        record[header] = Number(raw);
      } else {
        record[header] = raw;
      }
    });
    return record;
  });
}

async function loadLocalData(relativeUrl) {
  const absolutePath = path.resolve(root, relativeUrl);
  const extension = path.extname(absolutePath).toLowerCase();
  const fileText = await fs.readFile(absolutePath, 'utf8');

  if (extension === '.csv') {
    return parseCsv(fileText);
  }

  if (extension === '.json') {
    return JSON.parse(fileText);
  }

  throw new Error(`Unsupported data file type: ${relativeUrl}`);
}

async function inlineData(specNode) {
  if (Array.isArray(specNode)) {
    return Promise.all(specNode.map((item) => inlineData(item)));
  }

  if (!specNode || typeof specNode !== 'object') {
    return specNode;
  }

  const cloned = {};

  for (const [key, value] of Object.entries(specNode)) {
    if (key === 'data' && value && typeof value === 'object' && typeof value.url === 'string') {
      const inlined = { ...value };
      const dataValues = await loadLocalData(value.url);
      delete inlined.url;
      inlined.values = dataValues;
      cloned[key] = inlined;
    } else {
      cloned[key] = await inlineData(value);
    }
  }

  return cloned;
}

const specFiles = (await fs.readdir(specsDir))
  .filter((file) => file.endsWith('.json'))
  .sort();

const payload = {};

for (const file of specFiles) {
  const rawSpec = JSON.parse(await fs.readFile(path.join(specsDir, file), 'utf8'));
  const key = path.basename(file, '.json');
  payload[key] = await inlineData(rawSpec);
}

const outputText = `window.CHART_SPECS = ${JSON.stringify(payload, null, 2)};\n`;
await fs.writeFile(outputFile, outputText, 'utf8');

console.log(`Built inline chart bundle: ${outputFile}`);
