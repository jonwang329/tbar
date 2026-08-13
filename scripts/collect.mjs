import { SOURCE_REGISTRY } from '../src/data/sourceRegistry.js';
import { parseRss } from '../src/data/rss.js';
import { mkdir, writeFile } from 'node:fs/promises';

async function collectRss(url) {
  const response = await fetch(url, { headers: { 'user-agent': 'TBAR/0.1 (+source-monitor)' } });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  return parseRss(await response.text());
}

const collectedAt = new Date().toISOString();
const output = [];
for (const source of SOURCE_REGISTRY.filter(s => s.adapter === 'rss')) {
  try {
    const items = await collectRss(source.url);
    output.push({ sourceId: source.id, sourceName: source.name, collectedAt, status: 'ok', items });
    console.log(`✓ ${source.name}: ${items.length} items`);
  } catch (error) {
    output.push({ sourceId: source.id, sourceName: source.name, collectedAt, status: 'error', error: String(error), items: [] });
    console.error(`✗ ${source.name}: ${error}`);
  }
}
await mkdir(new URL('../public/data/', import.meta.url), { recursive: true });
await writeFile(new URL('../public/data/raw-rss.json', import.meta.url), JSON.stringify(output, null, 2));
