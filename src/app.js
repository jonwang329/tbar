import { DEMO_STORIES } from './data/demo.js';
import { buildDailyBrief } from './data/select.js';
import { buildReviewQueue } from './data/review.js';
import { AI_LEADERS, COUNTRY_DEEP_DIVE } from './data/sourceRegistry.js';

function esc(v=''){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#039;'}[c]));}
function fmtTime(value){try{return new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Taipei',month:'short',day:'numeric',hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date(value));}catch{return 'live';}}
function summary(s){return s.executiveSummary || s.description || s.reviewReason || 'Primary-source signal detected. Open the source for details.';}
function why(s){return s.whyItMatters || s.reviewReason || 'TBAR flagged this because of source quality, freshness, business impact, Taiwan relevance or AI-leader relevance.';}
function taiwan(s){if(s.taiwanImpact)return s.taiwanImpact; if((s.taiwanScore||0)>=80)return 'High Taiwan relevance detected.'; if((s.countries||[]).includes('Taiwan'))return 'Direct Taiwan signal.'; return 'Monitor for implications to Taiwan business, infrastructure and AI strategy.';}
function card(s,compact=false){const url=s.sourceUrl||s.url||'#'; return `<article class="story-card ${compact?'compact':''}"><div class="story-meta"><span class="score">TBAR ${s.tbarScore??'—'}</span><span>${esc(s.sourceName||'TBAR')}</span></div><h3><a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(s.title)}</a></h3><p>${esc(summary(s))}</p>${compact?'':`<div class="insight"><strong>Why it matters</strong><span>${esc(why(s))}</span></div><div class="insight taiwan"><strong>Taiwan lens</strong><span>${esc(taiwan(s))}</span></div>`}</article>`;}
function section(cls,n,title,limit,items,compact=false){return `<section class="${cls}"><div class="section-title"><h2>${n}. ${title}</h2><span>${limit}</span></div><div class="grid">${items.length?items.map(x=>card(x,compact)).join(''):'<div class="empty-state">No strong signal right now. TBAR stays quiet rather than filling space.</div>'}</div></section>`;}
function render(brief,{live=false,updatedAt=null}={}){
  const strongest=brief.mustKnow?.[0]||brief.importantSignals?.[0]||brief.deepDive?.[0]||brief.watchlist?.[0];
  document.querySelector('#root').innerHTML=`<main class="app-shell"><header class="topbar"><div><div class="brand">TBAR</div><div class="subtitle">Taiwan Business & AI Radar</div></div><div class="live-dot"><i></i>${live?'LIVE':'DEMO'}</div></header><section class="hero"><span class="eyebrow">${live?'LIVE · '+fmtTime(updatedAt):'TODAY'}</span><h1>What matters.<br>Nothing more.</h1><p>AI + business intelligence filtered through a Taiwan lens — designed for a fast executive read, not another news feed.</p><div class="daily-line">${esc(strongest?.title || 'No strong signal right now.')}</div></section>${section('must-know',1,'Must Know','≤ 3',brief.mustKnow)}${section('signals',2,'Important Signals','≤ 5',brief.importantSignals,true)}${section('deep-dive',3,'Deep Dive','0–2',brief.deepDive)}<div class="country-row">${COUNTRY_DEEP_DIVE.map(c=>`<span>${c}</span>`).join('')}</div>${section('watchlist',4,'Watchlist','living signals',brief.watchlist,true)}<section class="leaders"><div class="section-title"><h2>AI Leader Radar</h2><span>10 leaders</span></div><div class="chips">${AI_LEADERS.map(p=>`<span>${p}</span>`).join('')}</div></section><footer>TBAR V0.4 · ${live?'Live candidates + judgment':'Demo fallback'} · Human review remains the publishing boundary</footer></main>`;
}

async function loadLive(){
  try{
    const response=await fetch('/data/candidates.json',{cache:'no-store'});
    if(!response.ok)throw new Error(`${response.status} ${response.statusText}`);
    const data=await response.json();
    const queue=buildReviewQueue(data.candidates||[],data.updatedAt||new Date().toISOString());
    render(queue,{live:true,updatedAt:data.updatedAt});
  }catch(error){
    console.error('TBAR live data unavailable; using demo fallback.',error);
    render(buildDailyBrief(DEMO_STORIES),{live:false});
  }
}

loadLive();
if('serviceWorker' in navigator) window.addEventListener('load',()=>navigator.serviceWorker.register('/sw.js').catch(console.error));
