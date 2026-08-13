import test from 'node:test';
import assert from 'node:assert/strict';
import { parseSitemap, filterSitemapEntries } from '../src/data/sitemap.js';
import { parsePageMetadata } from '../src/data/html.js';

const xml = `<?xml version="1.0"?><urlset>
<url><loc>https://example.com/news/alpha</loc><lastmod>2026-08-13T01:02:03Z</lastmod></url>
<url><loc>https://example.com/about</loc></url>
</urlset>`;

test('parseSitemap extracts loc and lastmod', () => {
  const entries = parseSitemap(xml);
  assert.equal(entries.length, 2);
  assert.equal(entries[0].url, 'https://example.com/news/alpha');
  assert.equal(entries[0].lastmod, '2026-08-13T01:02:03Z');
});

test('filterSitemapEntries respects include path', () => {
  const entries = filterSitemapEntries(parseSitemap(xml), { includePath: '/news/' });
  assert.deepEqual(entries.map(x => x.url), ['https://example.com/news/alpha']);
});

test('parsePageMetadata prefers Open Graph metadata', () => {
  const html = `<html><head><title>Fallback</title><meta property="og:title" content="Primary title"><meta property="og:description" content="Summary"><meta property="article:published_time" content="2026-08-13T01:00:00Z"></head></html>`;
  assert.deepEqual(parsePageMetadata(html), { title:'Primary title', description:'Summary', publishedAt:'2026-08-13T01:00:00Z' });
});
