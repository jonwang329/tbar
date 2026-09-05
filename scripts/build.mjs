import { rm, mkdir, cp, copyFile, readFile, writeFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const dist = new URL('../dist/', import.meta.url);

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
await mkdir(new URL('../dist/cisco-replacement/', import.meta.url), { recursive: true });

// Preserve the approved Traditional Chinese V1.1 source as-is, then publish a
// dedicated zh alias and a separate English file. Language switching is plain
// HTML links (no JavaScript dependency) so it remains mobile-safe.
const zhSource = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const switcher = '<div class="langs" style="display:flex;gap:7px;align-items:center"><span class="pill">中文</span><a class="pill" style="text-decoration:none" href="./index-en.html">EN</a></div>';
const zhPublished = zhSource.replace(/<div class="pill">05 SEP 2026<\/div><\/header>/, `${switcher}</header>`);
await writeFile(new URL('../dist/index.html', import.meta.url), zhPublished);
await writeFile(new URL('../dist/index-zh.html', import.meta.url), zhPublished);
await copyFile(new URL('../index-en.html', import.meta.url), new URL('../dist/index-en.html', import.meta.url));

await copyFile(new URL('../sw.js', import.meta.url), new URL('../dist/sw.js', import.meta.url));
await cp(new URL('../src/', import.meta.url), new URL('../dist/src/', import.meta.url), { recursive: true });
await cp(new URL('../public/', import.meta.url), new URL('../dist/public/', import.meta.url), { recursive: true });
await copyFile(new URL('../tmp/cisco-replacement-v1.2-public.html', import.meta.url), new URL('../dist/cisco-replacement/index.html', import.meta.url));

console.log('✓ built dist/ with TBAR zh/en split');
