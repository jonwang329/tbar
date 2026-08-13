import test from 'node:test'; import assert from 'node:assert/strict';
import {calculateTbarScore,freshnessScore,selectLane} from '../src/data/scoring.js';
test('TBAR weighted score follows frozen weights',()=>assert.equal(calculateTbarScore({importanceScore:100,businessScore:100,taiwanScore:100,freshnessScore:100,sourceQualityScore:100,noveltyScore:100}),100));
test('freshness decays with age',()=>{const now=new Date('2026-08-13T10:00:00Z');assert.ok(freshnessScore('2026-08-13T09:30:00Z',now)>freshnessScore('2026-08-11T09:30:00Z',now));});
test('strong story becomes Must Know',()=>assert.equal(selectLane({tbarScore:90,importanceScore:90,confidenceScore:90}),'must_know'));
