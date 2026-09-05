import { DEMO_STORIES } from './data/demo.js';
import { buildDailyBrief } from './data/select.js';
import { buildReviewQueue } from './data/review.js';
import { COUNTRY_DEEP_DIVE } from './data/sourceRegistry.js';
import { INTERVIEW_LEADERS } from './data/interviewRegistry.js';

function esc(v=''){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#039;'}[c]));}
function fmtTime(value){try{return new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Taipei',month:'short',day:'numeric',hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date(value));}catch{return 'live';}}
function summary(s){return s.executiveSummary || s.description || s.reviewReason || 'Primary-source signal detected. Open the source for details.';}
function why(s){return s.whyItMatters || s.reviewReason || 'TBAR flagged this because of source quality, freshness, business impact, Taiwan relevance or AI-leader relevance.';}
function taiwan(s){if(s.taiwanImpact)return s.taiwanImpact; if((s.taiwanScore||0)>=80)return 'High Taiwan relevance detected.'; if((s.countries||[]).includes('Taiwan'))return 'Direct Taiwan signal.'; return 'Monitor for implications to Taiwan business, infrastructure and AI strategy.';}
function card(s,compact=false){const url=s.sourceUrl||s.url||'#'; return `<article class="story-card ${compact?'compact':''}"><div class="story-meta"><span class="score">TBAR ${s.tbarScore??'—'}</span><span>${esc(s.sourceName||'TBAR')}</span></div><h3><a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(s.title)}</a></h3><p>${esc(summary(s))}</p>${compact?'':`<div class="insight"><strong>Why it matters</strong><span>${esc(why(s))}</span></div><div class="insight taiwan"><strong>Taiwan lens</strong><span>${esc(taiwan(s))}</span></div>`}</article>`;}
function section(cls,n,title,limit,items,compact=false){return `<section class="${cls}"><div class="section-title"><h2>${n}. ${title}</h2><span>${limit}</span></div><div class="grid">${items.length?items.map(x=>card(x,compact)).join(''):'<div class="empty-state">No strong signal right now. TBAR stays quiet rather than filling space.</div>'}</div></section>`;}
function isLeaderInterview(s){
  const people=(s.people||[]).map(x=>String(x).toLowerCase());
  const leaderNames=INTERVIEW_LEADERS.map(x=>x.name.toLowerCase());
  const content=String(s.contentType||'').toLowerCase();
  return ['interview','podcast','speech','keynote','fireside chat','q&a'].includes(content) && people.some(p=>leaderNames.includes(p));
}
function collectLeaderInterviews(brief){
  const all=[...(brief.mustKnow||[]),...(brief.importantSignals||[]),...(brief.deepDive||[]),...(brief.watchlist||[])];
  const seen=new Set();
  return all.filter(isLeaderInterview).filter(s=>{const k=s.storyId||s.sourceUrl||s.title;if(seen.has(k))return false;seen.add(k);return true;}).slice(0,3);
}
function leaderSection(items){
  return `<section class="leaders"><div class="section-title"><h2>AI Leader Interview Intelligence</h2><span>high-value only</span></div><div class="grid">${items.length?items.map(x=>card(x,false)).join(''):'<div class="empty-state">No meaningful new leader interview detected. Names alone are not intelligence.</div>'}</div></section>`;
}
function render(brief,{live=false,updatedAt=null}={}){
  const strongest=brief.mustKnow?.[0]||brief.importantSignals?.[0]||brief.deepDive?.[0]||brief.watchlist?.[0];
  const leaderInterviews=collectLeaderInterviews(brief);
  document.querySelector('#root').innerHTML=`<main class="app-shell"><header class="topbar"><div><div class="brand">TBAR</div><div class="subtitle">Taiwan Business & AI Radar</div></div><div class="live-dot"><i></i>${live?'LIVE':'DEMO'}</div></header><section class="hero"><span class="eyebrow">${live?'LIVE · '+fmtTime(updatedAt):'TODAY'}</span><h1>What matters.<br>Nothing more.</h1><p>AI + business intelligence filtered through a Taiwan lens — designed for a fast executive read, not another news feed.</p><div class="daily-line">${esc(strongest?.title || 'No strong signal right now.')}</div></section>${section('must-know',1,'Must Know','≤ 3',brief.mustKnow)}${section('signals',2,'Important Signals','≤ 5',brief.importantSignals,true)}${leaderSection(leaderInterviews)}${section('deep-dive',3,'Deep Dive','0–2',brief.deepDive)}<div class="country-row">${COUNTRY_DEEP_DIVE.map(c=>`<span>${c}</span>`).join('')}</div>${section('watchlist',4,'Watchlist','living signals',brief.watchlist,true)}<footer>TBAR V0.5 · ${live?'Live + curated intelligence':'Demo fallback'} · Content quality before feed volume</footer></main>`;
}

async function loadJson(path){
  try {
    const response=await fetch(path,{cache:'no-store'});
    if(!response.ok) return null;
    return await response.json();
  } catch { return null; }
}

async function loadLive(){
  try{
    const [liveData,curatedData]=await Promise.all([
      loadJson('./public/data/candidates.json'),
      loadJson('./public/data/curated-intelligence.json')
    ]);
    if(!liveData) throw new Error('live candidates unavailable');
    const combined=[...(curatedData?.items||[]),...(liveData.candidates||[])];
    const updatedAt=curatedData?.updatedAt || liveData.updatedAt || new Date().toISOString();
    const queue=buildReviewQueue(combined,updatedAt);
    render(queue,{live:true,updatedAt});
  }catch(error){
    console.error('TBAR live data unavailable; using demo fallback.',error);
    render(buildDailyBrief(DEMO_STORIES),{live:false});
  }
}

loadLive();
if('serviceWorker' in navigator) window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(console.error));
