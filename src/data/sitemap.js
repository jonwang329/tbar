const decodeXml = (s = '') => String(s)
  .replace(/&amp;/g, '&')
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"')
  .replace(/&#39;/g, "'")
  .trim();

const tag = (block, name) => {
  const m = block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)<\\/${name}>`, 'i'));
  return m ? decodeXml(m[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')) : '';
};

export function parseSitemap(xml) {
  const text = String(xml);
  const urls = [...text.matchAll(/<url\b[\s\S]*?<\/url>/gi)].map(m => ({
    url: tag(m[0], 'loc'),
    lastmod: tag(m[0], 'lastmod') || null
  })).filter(x => x.url);
  const sitemaps = [...text.matchAll(/<sitemap\b[\s\S]*?<\/sitemap>/gi)]
    .map(m => tag(m[0], 'loc')).filter(Boolean);
  return { urls, sitemaps };
}

export function filterSitemapEntries(entries, source) {
  const include = source.includePath ? new RegExp(source.includePath, 'i') : null;
  const exclude = source.excludePath ? new RegExp(source.excludePath, 'i') : null;
  return entries.filter(entry => (!include || include.test(entry.url)) && (!exclude || !exclude.test(entry.url)));
}
