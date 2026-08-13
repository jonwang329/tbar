const decode = (s = '') => String(s)
  .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, ' ').trim();

function meta(html, key, attr = 'property') {
  const a = new RegExp(`<meta[^>]+${attr}=["']${key}["'][^>]+content=["']([^"']+)["'][^>]*>`, 'i');
  const b = new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+${attr}=["']${key}["'][^>]*>`, 'i');
  return decode((html.match(a) || html.match(b) || [])[1] || '');
}

export function parsePageMetadata(html, fallbackUrl = '') {
  const titleTag = (String(html).match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1] || '';
  return {
    title: meta(html, 'og:title') || decode(titleTag.replace(/<[^>]+>/g, ' ')) || fallbackUrl,
    description: meta(html, 'og:description') || meta(html, 'description', 'name'),
    publishedAt: meta(html, 'article:published_time') || null
  };
}
