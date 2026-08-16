/* Project Eddie V23 — recurring Reserved Swap Pair. A student may swap one fixed 17–18 or 19–20 slot with that day's 18–19 Eddie dinner block. */
(function(){
  const M=window.StudentModule;if(!M)return;
  S.flexPairs=Array.isArray(S.flexPairs)?S.flexPairs:[];

  const dayOf=id=>+String(id).split('_')[0];
  const hourOf=id=>+String(id).split('_')[1];
  const pairId=(uid,base)=>uid+'::'+base;
  const dinnerFor=base=>sid(dayOf(base),18);
  const isEligibleBase=base=>[17,19].includes(hourOf(base));

  function pairs(uid){return S.flexPairs.filter(p=>!uid||p.uid===uid)}
  function byBase(base){return S.flexPairs.find(p=>p.base===base)||null}
  function byDinner(dinner){return S.flexPairs.find(p=>p.dinner===dinner)||null}
  function pairForSlot(uid,slot){return S.flexPairs.find(p=>p.uid===uid&&(p.base===slot||p.dinner===slot))||null}
  function suspendedThisWeek(p){const ov=S.weeklyOverrides?.[p.uid];return !!(ov&&ov.from===p.base&&ov.to!==p.base&&ov.to!==p.dinner)}
  function swappedThisWeek(p){return book(p.dinner)?.studentId===p.uid}

  function prune(){
    const seenDinner=new Set();
    S.flexPairs=S.flexPairs.filter(p=>{
      const s=byId(p.uid);if(!s||s.mode!=='fixed')return false;
      if(!(S.fixed[p.uid]||[]).includes(p.base)||!isEligibleBase(p.base)||p.dinner!==dinnerFor(p.base))return false;
      if(seenDinner.has(p.dinner))return false;seenDinner.add(p.dinner);return true;
    });
  }

  function eligibleBases(uid){
    prune();const s=byId(uid);if(!s||s.mode!=='fixed')return[];
    return (S.fixed[uid]||[]).filter(isEligibleBase);
  }

  function canEnable(uid,base){
    prune();const s=byId(uid);if(!s||s.mode!=='fixed')return {ok:false,reason:'mode'};
    if(!(S.fixed[uid]||[]).includes(base)||!isEligibleBase(base))return {ok:false,reason:'base'};
    const dinner=dinnerFor(base),other=byDinner(dinner);
    if(other&&other.uid!==uid)return {ok:false,reason:'reserved',owner:other.uid};
    if(book(dinner)&&book(dinner).studentId!==uid)return {ok:false,reason:'booked'};
    if(hold(dinner)&&hold(dinner).studentId!==uid)return {ok:false,reason:'held'};
    const fo=fixedOwner(dinner);if(fo&&fo!==uid)return {ok:false,reason:'fixed'};
    return {ok:true,dinner};
  }

  function enable(uid,base){
    const c=canEnable(uid,base);if(!c.ok)return c;
    const id=pairId(uid,base);if(!S.flexPairs.some(p=>p.id===id))S.flexPairs.push({id,uid,base,dinner:c.dinner,createdAt:Date.now()});
    save();return {ok:true,pair:S.flexPairs.find(p=>p.id===id)};
  }

  function disable(uid,base){
    const p=S.flexPairs.find(x=>x.uid===uid&&x.base===base);if(!p)return {ok:true};
    if(swappedThisWeek(p))return {ok:false,reason:'active'};
    S.flexPairs=S.flexPairs.filter(x=>x!==p);save();return {ok:true};
  }

  function alternate(uid,slot){const p=pairForSlot(uid,slot);if(!p||suspendedThisWeek(p))return null;return p.base===slot?p.dinner:p.base}

  const baseChoices=choicesFor;
  choicesFor=function(s){
    let out=baseChoices(s);if(!s||s.mode!=='fixed')return out;
    prune();for(const p of pairs(s.id)){
      if(suspendedThisWeek(p))continue;
      const o=owner(p.dinner);if(!o||o===s.id)out.push(p.dinner);
    }
    return [...new Set(out)];
  };

  const baseOwner=owner;
  owner=function(id){
    prune();const p=byBase(id);
    if(p&&swappedThisWeek(p))return p.uid; // dinner moved to the original fixed slot; keep it blocked.
    return baseOwner(id);
  };

  const oldToggle=M.toggleDraft.bind(M);
  M.toggleDraft=function(uid,slotId){
    const p=pairForSlot(uid,slotId),alt=p?alternate(uid,slotId):null;
    if(p&&alt){
      const arr=M.studentDrafts(uid);
      if(arr.includes(alt)){
        S.drafts[uid]=arr.map(x=>x===alt?slotId:x);save();return {ok:true,action:'flex_replaced',drafts:[...S.drafts[uid]]};
      }
    }
    return oldToggle(uid,slotId);
  };

  const oldLive=M.liveAvailability.bind(M);
  M.liveAvailability=function(uid,from){
    let out=oldLive(uid,from),alt=alternate(uid,from);
    if(alt){const o=owner(alt);if(!o||o===uid)out.push(alt)}
    return [...new Set(out)];
  };
  liveTargets=function(s,from){return M.liveAvailability(s.id,from)};

  const oldRemove=M.remove.bind(M);
  M.remove=function(uid){S.flexPairs=S.flexPairs.filter(p=>p.uid!==uid);return oldRemove(uid)};
  const oldSetMode=M.setMode.bind(M);
  M.setMode=function(uid,mode){if(mode!=='fixed')S.flexPairs=S.flexPairs.filter(p=>p.uid!==uid);return oldSetMode(uid,mode)};

  window.FlexSwapV23={pairs,byBase,byDinner,pairForSlot,eligibleBases,canEnable,enable,disable,alternate,prune,suspendedThisWeek,swappedThisWeek};
  prune();save();
})();