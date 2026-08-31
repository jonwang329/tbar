import { rm, mkdir, cp, copyFile } from 'node:fs/promises';

const dist = new URL('../dist/', import.meta.url);

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
await mkdir(new URL('../dist/cisco-replacement/', import.meta.url), { recursive: true });

await copyFile(new URL('../index.html', import.meta.url), new URL('../dist/index.html', import.meta.url));
await copyFile(new URL('../sw.js', import.meta.url), new URL('../dist/sw.js', import.meta.url));
await cp(new URL('../src/', import.meta.url), new URL('../dist/src/', import.meta.url), { recursive: true });
await cp(new URL('../public/', import.meta.url), new URL('../dist/public/', import.meta.url), { recursive: true });
await copyFile(new URL('../tmp/cisco-replacement-v1.2-public.html', import.meta.url), new URL('../dist/cisco-replacement/index.html', import.meta.url));

console.log('✓ built dist/');
