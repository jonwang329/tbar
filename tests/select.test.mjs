import test from 'node:test'; import assert from 'node:assert/strict';
import {buildDailyBrief} from '../src/data/select.js'; import {DEMO_STORIES} from '../src/data/demo.js';
test('daily output respects frozen maximums',()=>{const brief=buildDailyBrief([...DEMO_STORIES,...DEMO_STORIES.map((s,i)=>({...s,storyId:`copy-${i}`}))]);assert.ok(brief.mustKnow.length<=3);assert.ok(brief.importantSignals.length<=5);assert.ok(brief.deepDive.length<=2);});
