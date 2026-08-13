import test from 'node:test';
import assert from 'node:assert/strict';
import { parseRss } from '../src/data/rss.js';

test('RSS parser extracts title, link, timestamp and description', () => {
  const xml = `<?xml version="1.0"?><rss><channel><item><title><![CDATA[NVIDIA launches AI factory]]></title><link>https://example.com/story</link><pubDate>Thu, 13 Aug 2026 08:00:00 GMT</pubDate><description><![CDATA[<p>New infrastructure.</p>]]></description></item></channel></rss>`;
  const items = parseRss(xml);
  assert.equal(items.length, 1);
  assert.equal(items[0].title, 'NVIDIA launches AI factory');
  assert.equal(items[0].link, 'https://example.com/story');
  assert.match(items[0].publishedAt, /13 Aug 2026/);
  assert.equal(items[0].description, 'New infrastructure.');
});
