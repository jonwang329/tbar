import { DEMO_STORIES } from './data/demo.js';
import { buildDailyBrief } from './data/select.js';
import { buildReviewQueue } from './data/review.js';
import { SOURCE_REGISTRY } from './data/sourceRegistry.js';

function esc(v=''){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#039;'}[c]));}
function fmtTime(value){try{return new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Taipei',month:'short',day:'numeric',hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date(value));}catch{return 'live';}}
function fmtDate(value){try{return new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Taipei',month:'short',day:'numeric'}).format(new Date(value));}catch{return 'live';}}
function summary(s){return s.executiveSummary || s.description || 'Primary-source signal detected. Open the source for details.';}
function why(s){return s.whyItMatters || s.reviewReason || 'Worth monitoring for business impact, strategic significance, Taiwan relevance, or a stronger follow-on signal.';}
function taiwan(s){if(s.taiwanImpact)return s.taiwanImpact;if((s.taiwanScore||0)>=80)return 'Direct Taiwan relevance or local policy/infrastructure implication.';if((s.countries||[]).includes('Taiwan'))return 'Direct Taiwan signal.';return 'Monitor implications for Taiwan business, infrastructure, enterprise AI, and regional competitiveness.';}
function shorten(v,max=175){const t=String(v||'').replace(/\s+/g,' ').trim();return t.length>max?`${t.slice(0,max-1).trim()}…`:t;}
function meta(s){return `<div class="story-meta"><span>${esc(s.sourceName||'TBAR')}</span><i></i><span>${esc(fmtDate(s.publishedAt||s.discoveredAt||Date.now()))}</span></div>`;}
function keyPoints(s){return [
  ['What happened',shorten(summary(s),190)],
  ['Why it matters',shorten(why(s),170)],
  ['Taiwan lens',shorten(taiwan(s),170)]
];}
function keyPointsHtml(s){return `<div class="key-box"><div class="key-title">Key Points</div><div class="key-list">${keyPoints(s).map(([label,text],i)=>`<div class="key-point"><b>${i+1}</b><div><strong>${esc(label)}</strong><span>${esc(text)}</span></div></div>`).join('')}</div></div>`;}
function storyCard(s,{lead=false,showKeys=false}={}){const url=s.sourceUrl||s.url||'#';return `<article class="story-card ${lead?'lead':''}">${meta(s)}<h3><a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(s.title)}</a></h3><p class="story-summary">${esc(shorten(summary(s),lead?330:205))}</p>${showKeys?keyPointsHtml(s):''}</article>`;}
function sectionHead(n,title,detail){return `<div class="section-head"><h2>${n}. ${title}</h2><span>${esc(detail)}</span></div>`;}

function classifyWatch(s){
  const text=`${s.title||''} ${s.description||''} ${(s.topics||[]).join(' ')} ${(s.countries||[]).join(' ')}`.toLowerCase();
  if((s.taiwanScore||0)>=75 || text.includes('taiwan'))return 'Taiwan';
  if(s.leaderMatch || /jensen|altman|amodei|hassabis|musk|pichai|nadella|lisa su|zuckerberg|jassy/.test(text))return 'AI Leaders';
  if(/korea|japan|singapore|gpu|data center|datacenter|cloud|network|infrastructure|sovereign ai|power|cooling/.test(text))return 'Asia Infrastructure';
  return 'Other';
}
function watchReason(category){
  if(category==='Taiwan')return 'Could affect Taiwan business, policy, infrastructure, enterprise AI adoption, or investment.';
  if(category==='AI Leaders')return 'May signal a shift in AI strategy, products, capital allocation, or industry direction.';
  return 'Could change the regional AI infrastructure gap versus Taiwan.';
}
function watchTrigger(category){
  if(category==='Taiwan')return 'Upgrade when investment, policy action, customer adoption, capacity, or business impact becomes concrete.';
  if(category==='AI Leaders')return 'Upgrade when a statement becomes a launch, major investment, strategic commitment, or market-moving action.';
  return 'Upgrade when GPU capacity, data-center buildout, cloud availability, power, networking, or government funding becomes concrete.';
}
function watchColumn(name,description,items){return `<div class="watch-card"><div class="watch-title"><h3>${esc(name)}</h3><p>${esc(description)}</p></div>${items.length?items.slice(0,2).map(s=>{const url=s.sourceUrl||s.url||'#';return `<div class="watch-item"><h4><a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(s.title)}</a></h4><div class="watch-note"><b>Why watch</b><span>${esc(watchReason(name))}</span></div><div class="watch-note"><b>Becomes important when</b><span>${esc(watchTrigger(name))}</span></div></div>`;}).join(''):'<div class="watch-empty">No meaningful signal right now.</div>'}</div>`;}

function render(brief,{live=false,updatedAt=null}={}){
  const strongest=brief.mustKnow?.[0]||brief.importantSignals?.[0]||brief.deepDive?.[0]||brief.watchlist?.[0];
  const watchGroups={Taiwan:[], 'AI Leaders':[], 'Asia Infrastructure':[]};
  for(const item of brief.watchlist||[]){const group=classifyWatch(item);if(watchGroups[group])watchGroups[group].push(item);}
  const automatedSources=SOURCE_REGISTRY.filter(s=>['rss','sitemap'].includes(s.adapter)).length;
  const must=(brief.mustKnow||[]).slice(0,3);
  const signals=(brief.importantSignals||[]).slice(0,5);
  const deep=(brief.deepDive||[]).slice(0,2);

  document.querySelector('#root').innerHTML=`<main class="app-shell">
    <header class="topbar"><div><div class="brand">TBAR</div><div class="subtitle">Taiwan Business & AI Radar</div></div><div class="live-dot"><i></i>${live?'LIVE':'DEMO'}</div></header>
    <section class="hero"><span class="eyebrow">${live?'LIVE · '+fmtTime(updatedAt):'TODAY'}</span><h1>What matters.<br>Nothing more.</h1><p>AI + business intelligence filtered through a Taiwan lens. Built for a 20-second executive scan, then deeper reading only when needed.</p><div class="brief-bar"><b>Today in 20 seconds</b><span>${esc(strongest?.title||'No strong signal right now.')}</span></div></section>

    <section class="content-section must-know">${sectionHead(1,'Must Know','≤ 3 · decision relevant')}<div class="must-grid">${must.length?must.map((s,i)=>storyCard(s,{lead:i===0,showKeys:true})).join(''):'<div class="empty-state">No Must Know signal right now.</div>'}</div></section>

    <section class="content-section signals">${sectionHead(2,'Important Signals','≤ 5 · useful context')}<div class="signal-grid">${signals.length?signals.map(s=>storyCard(s)).join(''):'<div class="empty-state">No important signal right now.</div>'}</div></section>

    <section class="content-section deep-dive">${sectionHead(3,'Deep Dive','0–2 · thesis building')}<div class="deep-grid">${deep.length?deep.map(s=>storyCard(s,{showKeys:true})).join(''):'<div class="empty-state">No Deep Dive today.</div>'}</div></section>

    <section class="content-section watch-next">${sectionHead(4,'Watch Next','3 themes · no scores')}<div class="watch-grid">${watchColumn('Taiwan','Local business, policy and infrastructure signals',watchGroups.Taiwan)}${watchColumn('AI Leaders','Signals from key AI decision-makers',watchGroups['AI Leaders'])}${watchColumn('Asia Infrastructure','Korea, Japan, Singapore and regional AI capacity',watchGroups['Asia Infrastructure'])}</div></section>

    <section class="content-section how-it-works">${sectionHead('','How TBAR works','purpose · reading logic · roadmap')}<div class="about-grid">
      <article><h3>Purpose</h3><p>Reduce information overload. Surface only the few business and AI signals that deserve attention today.</p></article>
      <article><h3>How to read</h3><p>Start with Must Know, scan Important Signals, use Deep Dive for thesis building, and Watch Next for early signals.</p></article>
      <article><h3>How it searches</h3><p>${SOURCE_REGISTRY.length} source groups are registered; ${automatedSources} primary sources are automatically collected today. TBAR normalizes, deduplicates and ranks before anything reaches this page.</p></article>
      <article><h3>Roadmap</h3><p>Expand source automation → improve semantic AI judgment → add person/company/country/theme search → deliver concise LINE briefings.</p></article>
    </div></section>
    <footer>TBAR V0.7 · Live candidates + judgment · Reader-facing scores hidden · Human review remains the publishing boundary</footer>
  </main>`;
}

async function loadLive(){
  try{
    const response=await fetch('./public/data/candidates.json',{cache:'no-store'});
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
if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(console.error));
