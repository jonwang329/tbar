/* Project Eddie V21 — one reusable StudentModule for every student, current and future. */
window.StudentModule=(function(){
  const VERSION='21.0';
  const CAPABILITIES=['schedule','select','confirm','change','liveAvailability','coachNotification','lineState'];

  function ensureMaps(){
    S.holds=S.holds||{};S.fixed=S.fixed||{};S.bookings=S.bookings||{};S.confirm=S.confirm||{};
    S.line=S.line||{};S.changes=S.changes||{};S.drafts=S.drafts||{};S.notifications=S.notifications||[];
    S.weeklyOverrides=S.weeklyOverrides||{};S.lastChange=S.lastChange||{};
  }
  function normalize(student){
    ensureMaps();
    if(!student||!student.id)return null;
    student.mode=['fixed','choices','free'].includes(student.mode)?student.mode:'choices';
    student.sessions=Math.min(3,Math.max(1,+student.sessions||1));
    S.confirm[student.id]=S.confirm[student.id]||'waiting';
    S.line[student.id]=S.line[student.id]||{sent:false,reminded:false};
    S.drafts[student.id]=S.drafts[student.id]||[];
    return student;
  }
  function ensureAll(){ensureMaps();(S.students||[]).forEach(normalize)}
  function get(uid){return normalize(byId(uid))}
  function studentBookings(uid){return Object.entries(S.bookings).filter(([id,b])=>b.studentId===uid).map(([id])=>id)}
  function studentDrafts(uid){ensureMaps();return [...(S.drafts[uid]||[])]}
  function allowedInitial(uid){const s=get(uid);return s?choicesFor(s):[]}
  function resetPending(uid){
    delete S.drafts[uid];delete S.lastChange[uid];delete S.changes[uid];
    S.confirm[uid]='waiting';S.line[uid]={sent:false,reminded:false};
  }
  function create(name){
    const trimmed=(name||'').trim();if(!trimmed)return null;
    const id=makeId(trimmed),student={id,name:trimmed,mode:'choices',sessions:1};
    S.students.push(student);normalize(student);save();return student;
  }
  function remove(uid){
    if(!get(uid)||S.students.length<=1)return false;
    S.students=S.students.filter(s=>s.id!==uid);
    Object.keys(S.holds).forEach(id=>{if(S.holds[id]?.studentId===uid)delete S.holds[id]});
    Object.keys(S.bookings).forEach(id=>{if(S.bookings[id]?.studentId===uid)delete S.bookings[id]});
    delete S.fixed[uid];delete S.confirm[uid];delete S.line[uid];delete S.changes[uid];delete S.drafts[uid];
    delete S.weeklyOverrides[uid];delete S.lastChange[uid];
    S.notifications=S.notifications.filter(n=>n.studentId!==uid);save();return true;
  }
  function setMode(uid,mode){
    const s=get(uid);if(!s||!['fixed','choices','free'].includes(mode))return false;
    s.mode=mode;Object.keys(S.holds).forEach(k=>{if(S.holds[k]?.studentId===uid)delete S.holds[k]});
    delete S.fixed[uid];resetPending(uid);save();return true;
  }
  function setSessions(uid,count){
    const s=get(uid);if(!s)return false;s.sessions=Math.min(3,Math.max(1,+count||1));
    if((S.fixed[uid]||[]).length>s.sessions)S.fixed[uid]=S.fixed[uid].slice(0,s.sessions);
    resetPending(uid);save();return true;
  }
  function toggleDraft(uid,slotId){
    const s=get(uid);if(!s)return {ok:false};
    const allowed=new Set(allowedInitial(uid));if(!allowed.has(slotId))return {ok:false,reason:'not_allowed'};
    const confirmed=studentBookings(uid),need=Math.max(0,s.sessions-confirmed.length);let arr=studentDrafts(uid).filter(id=>allowed.has(id));
    if(arr.includes(slotId)){arr=arr.filter(x=>x!==slotId);S.drafts[uid]=arr;save();return {ok:true,action:'removed',drafts:arr}}
    if(arr.length<need){arr.push(slotId);S.drafts[uid]=arr;save();return {ok:true,action:'added',drafts:arr}}
    if(need===1){S.drafts[uid]=[slotId];save();return {ok:true,action:'replaced',drafts:[slotId]}}
    return {ok:false,action:'choose_replacement',newId:slotId,drafts:arr};
  }
  function replaceDraft(uid,oldId,newId){
    const arr=studentDrafts(uid);if(!arr.includes(oldId))return false;
    S.drafts[uid]=arr.map(x=>x===oldId?newId:x);save();return true;
  }
  function confirmDraft(uid){
    const s=get(uid);if(!s)return false;const confirmed=studentBookings(uid),need=Math.max(0,s.sessions-confirmed.length);
    const allowed=new Set(allowedInitial(uid)),arr=studentDrafts(uid).filter(id=>allowed.has(id));if(arr.length!==need)return false;
    for(const id of arr){if(owner(id)&&owner(id)!==uid)return false;S.bookings[id]={studentId:uid}}
    if(s.mode==='choices')Object.keys(S.holds).forEach(k=>{if(S.holds[k]?.studentId===uid)delete S.holds[k]});
    delete S.drafts[uid];delete S.lastChange[uid];S.confirm[uid]='confirmed';save();return true;
  }
  function confirmWeek(uid){const s=get(uid);if(!s)return false;delete S.lastChange[uid];S.confirm[uid]='confirmed';save();return true}
  function liveAvailability(uid,from){
    const s=get(uid);if(!s)return[];const ids=[];
    for(let d=0;d<5;d++)for(const h of H){const id=sid(d,h);if(id===from||coachTime(h))continue;if(!owner(id))ids.push(id)}
    return ids;
  }
  function notifyCoach(uid,from,to){
    const s=get(uid);if(!s)return;
    S.notifications.push({id:'chg-'+Date.now()+'-'+Math.random().toString(36).slice(2,7),studentId:uid,type:'change',from,to,seen:false,createdAt:Date.now(),coachLine:true});
    S.lastChange[uid]={from,to,createdAt:Date.now()};
  }
  function instantChange(uid,from,to){
    const s=get(uid);if(!s)return {ok:false,reason:'student'};
    const currentOwner=owner(to);if(currentOwner&&currentOwner!==uid)return {ok:false,reason:'taken'};
    if(!book(from)||book(from).studentId!==uid)return {ok:false,reason:'stale'};
    delete S.bookings[from];S.bookings[to]={studentId:uid};
    if(s.mode==='fixed'){
      const regular=S.fixed[uid]||[],existing=S.weeklyOverrides[uid],original=existing?.from||regular.find(id=>id===from)||regular[0]||null;
      if(regular.includes(to))delete S.weeklyOverrides[uid];else if(original)S.weeklyOverrides[uid]={from:original,to};
    }
    delete S.changes[uid];S.confirm[uid]='confirmed';notifyCoach(uid,from,to);save();return {ok:true};
  }
  function acknowledge(noteId){const n=S.notifications.find(x=>x.id===noteId);if(!n)return false;n.seen=true;save();return true}
  function acknowledgeAll(){S.notifications.forEach(n=>n.seen=true);save()}
  function audit(){
    ensureAll();const methods=['create','remove','setMode','setSessions','toggleDraft','replaceDraft','confirmDraft','confirmWeek','liveAvailability','instantChange','acknowledge'];
    const missingMethods=methods.filter(m=>typeof api[m]!=='function');
    const rows=(S.students||[]).map(s=>({id:s.id,name:s.name,ok:!!s.id&&!!s.name&&['fixed','choices','free'].includes(s.mode)&&[1,2,3].includes(s.sessions)&&!missingMethods.length,capabilities:[...CAPABILITIES]}));
    return {version:VERSION,total:rows.length,passed:rows.filter(r=>r.ok).length,failed:rows.filter(r=>!r.ok),missingMethods};
  }
  const api={VERSION,CAPABILITIES,normalize,ensureAll,get,create,remove,setMode,setSessions,studentBookings,studentDrafts,allowedInitial,toggleDraft,replaceDraft,confirmDraft,confirmWeek,liveAvailability,instantChange,acknowledge,acknowledgeAll,audit};
  ensureAll();return api;
})();