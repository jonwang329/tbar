/* Project Eddie V23 UI — configure a recurring Reserved Swap Pair once; student gets the private option automatically. */
(function(){
  const F=window.FlexSwapV23,M=window.StudentModule;if(!F||!M)return;

  function ensureFlexPanel(){
    let box=$('flexSwapPanel');if(box)return box;
    box=document.createElement('div');box.id='flexSwapPanel';box.className='flexSwapPanel';
    const explain=$('explain');if(explain)explain.insertAdjacentElement('afterend',box);
    return box;
  }
  function msgFor(reason){return reason==='reserved'?'同一天的晚餐彈性已經保留給另一位學生。':reason==='booked'?'18:00–19:00 已有其他課程，不能建立交換。':reason==='held'?'18:00–19:00 已保留給其他學生。':reason==='fixed'?'18:00–19:00 已被設定成其他固定課。':'請先把學生設成固定時段，並選 17–18 或 19–20。'}
  function renderFlexPanel(){
    const box=ensureFlexPanel(),s=st();if(!box||!s)return;
    F.prune();
    if(s.mode!=='fixed'){
      box.innerHTML='<div class="flexPanelHead"><b>🔁 Reserved Swap Pair</b><span>只適用固定時段</span></div><p>固定學生可預先授權「自己的固定課 ↔ 同一天 Eddie 18–19 晚餐」二選一。其他學生看不到這個彈性。</p>';
      return;
    }
    const bases=F.eligibleBases(s.id);
    if(!bases.length){
      box.innerHTML='<div class="flexPanelHead"><b>🔁 Reserved Swap Pair</b><span>Recurring rule</span></div><p>若固定課設在 17–18 或 19–20，可和同一天 18–19 Dinner 建立專屬交換。設定一次，不必每週改。</p>';
      return;
    }
    box.innerHTML='<div class="flexPanelHead"><div><b>🔁 Reserved Swap Pair</b><small>設定一次，每週沿用；不是 public availability。</small></div></div><div class="flexPairList">'+bases.map(base=>{
      const dinner=sid(+base.split('_')[0],18),p=F.pairs(s.id).find(x=>x.base===base),suspended=p&&F.suspendedThisWeek(p),active=p&&F.swappedThisWeek(p);
      return '<div class="flexPairRow"><div><b>'+fmt(base)+' ↔ '+fmt(dinner)+'</b><small>'+(p?(active?'本週已交換：Dinner 移到原固定時段':suspended?'本週已改到其他時段；下週規則仍保留':'只給 '+s.name+' 的專屬彈性'):'目前未開放')+'</small></div><button class="btn '+(p?'green':'')+' flexToggle" data-flex-base="'+base+'">'+(p?'✓ 已開放':'＋ 開放交換')+'</button></div>'
    }).join('')+'</div>';
    document.querySelectorAll('[data-flex-base]').forEach(btn=>btn.onclick=()=>{
      const base=btn.dataset.flexBase,p=F.pairs(s.id).find(x=>x.base===base);
      if(p){const r=F.disable(s.id,base);if(!r.ok){alert('這週學生目前正在使用 Dinner swap。請先讓他回到固定時段或改到其他時段，再關閉這個 recurring rule。');return}}
      else{const r=F.enable(s.id,base);if(!r.ok){alert(msgFor(r.reason));return}}
      save();render();
    });
  }

  const oldTop=renderTop;
  renderTop=function(){oldTop();renderFlexPanel()};

  const oldCoach=renderCoach;
  renderCoach=function(){
    oldCoach();F.prune();
    // Dinner is not directly assignable. Flex access is configured through Reserved Swap Pair only.
    document.querySelectorAll('#cal .slot[data-h="18"]').forEach(el=>{if(!book(el.dataset.id)){el.classList.add('lockedDinner');el.onclick=e=>{e.preventDefault();e.stopPropagation()}}});
    F.pairs().forEach(p=>{
      if(F.suspendedThisWeek(p))return;
      const s=byId(p.uid),baseEl=document.querySelector('#cal .slot[data-id="'+p.base+'"]'),dinnerEl=document.querySelector('#cal .slot[data-id="'+p.dinner+'"]');
      if(!s)return;
      const swapped=F.swappedThisWeek(p);
      if(baseEl){
        baseEl.classList.add(swapped?'flexDinnerMoved':'flexPairBase');
        const cell=baseEl.querySelector('.cell');if(cell){
          if(swapped)cell.innerHTML='<b>🍽 Eddie</b><small>Dinner moved here · '+s.name+' uses flex swap</small>';
          else{const sm=cell.querySelector('small');if(sm)sm.textContent='Fixed · 🔁 Dinner swap enabled'}
        }
      }
      if(dinnerEl){
        dinnerEl.classList.add('flexPairDinner');
        const cell=dinnerEl.querySelector('.cell');if(cell){
          if(swapped){const sm=cell.querySelector('small');if(sm)sm.textContent='🔁 Reserved swap · Dinner moved to '+fmt(p.base)}
          else cell.innerHTML='<b>🍽 Eddie / 🔁 '+s.name+'</b><small>Reserved swap only · not public</small>';
        }
      }
    });
  };

  const oldStudent=renderStudent;
  renderStudent=function(){
    oldStudent();const s=st();if(!s)return;F.prune();
    const ps=F.pairs(s.id).filter(p=>!F.suspendedThisWeek(p));if(!ps.length)return;
    ps.forEach(p=>{
      [p.base,p.dinner].forEach(id=>{const el=document.querySelector('#studentCal .sSlot[data-id="'+id+'"]');if(el)el.classList.add('studentFlexPair')});
      const fromPair=changeMode&&changeFrom&&F.pairForSlot(s.id,changeFrom);
      if(fromPair){const alt=F.alternate(s.id,changeFrom),el=alt&&document.querySelector('#studentCal .sSlot[data-id="'+alt+'"]');if(el&&el.classList.contains('changeTarget')){const b=el.querySelector('b'),sm=el.querySelector('small');if(b)b.textContent='🔁 專屬交換';if(sm)sm.textContent=fmt(alt)+' · 點一下立即完成'}}
    });
    const b=bookings(s.id),activePair=ps.find(p=>b.includes(p.base)||b.includes(p.dinner));
    if(status(s.id)==='waiting'&&!b.length){
      $('guideText').textContent+=' Eddie 已為你預先保留專屬交換時段；這個選項不會開放給其他學生。';
    }else if(status(s.id)==='confirmed'&&activePair&&!changeMode){
      const hint=document.createElement('span');hint.className='flexStudentHint';hint.textContent='🔁 專屬彈性：'+fmt(activePair.base)+' ↔ '+fmt(activePair.dinner);$('guideAction').appendChild(hint);
    }
  };

  render();
})();