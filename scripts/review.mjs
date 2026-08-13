import { readFile, writeFile } from 'node:fs/promises';
import { buildReviewQueue } from '../src/data/review.js';

const INPUT_URL = new URL('../public/data/candidates.json', import.meta.url);
const OUTPUT_URL = new URL('../public/data/review-queue.json', import.meta.url);

const input = JSON.parse(await readFile(INPUT_URL, 'utf8'));
const generatedAt = input.updatedAt || new Date().toISOString();
const queue = buildReviewQueue(input.candidates || [], generatedAt);

await writeFile(OUTPUT_URL, JSON.stringify(queue, null, 2));
console.log(`✓ TBAR review queue: ${queue.totalPending} pending items · human review required`);
