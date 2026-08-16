/* Project Eddie V21 — route every student action through StudentModule + runtime consistency audit. */
(function(){
  const M=window.StudentModule;if(!M)return;
  M.ensureAll();save();

  function ensureAuditChip(){
    let chip=document.getElementById('moduleAudit');
    if(chip)return chip;
    chip=document.createElement('button');chip.id='moduleAudit';chip.className='moduleAudit';
    const summary=document.querySelector('#coachPanel .summary');if(summary)summary.appendChild(chip);
    chip.onclick=()=>{const a=M.audit();alert('Student Module V'+a.version+'\n'+a.passed+'/'+a.total+' 位學生功能一致\n\n共用功能：\n• 選課\n• 確認\n• 即時改課\n• 即時空檔\n• Coach 異動通知\n• LINE 狀態\n\n新增學生會自動繼承同一套功能。')};
    return chip;
  }
  function renderAudit(){const a=M.audit(),chip=ensureAuditChip();if(!chip)return;chip.textContent=(a.failed.length?'⚠':'✓')+' Student Module '+a.passed+'/'+a.total;chip.classList.toggle('bad',!!a.failed.length)}

  function showModuleReplace(newId,arr,s){
    ensureReplaceModal();
    $('replaceTitle').textContent='要用 '+fmt(newId)+' 取代哪一堂？';
    $('replaceText').textContent='所有學生都使用相同的換課功能。直接點要被取代的那一堂。';
    $('replaceList').innerHTML=arr.map(oldId=>'<button class="replaceChoice" data-old="'+oldId+'">取代 '+fmt(oldId)+'</button>').join('');
    document.querySelectorAll('.replaceChoice').forEach(b=>b.onclick=()=>{M.replaceDraft(s.id,b.dataset.old,newId);closeReplace();renderStudent()});
    $('replaceBack').classList.add('show');
  }

  liveTargets=function(s,from){return M.liveAvailability(s.id,from)};
  autoChange=function(uid,from,to){
    const result=M.instantChange(uid,from,to);
    if(!result.ok){
      if(result.reason==='taken')alert('這個時段剛剛已被選走，請重新選擇。');
      else if(result.reason==='stale')alert('原本的課程狀態已改變，畫面會重新整理。');
      render();return false;
    }
    changeMode=false;changeFrom=null;render();return true;
  };

  const baseTop=renderTop;
  renderTop=function(){
    M.ensureAll();baseTop();
    document.querySelectorAll('[data-r]').forEach(b=>b.onclick=e=>{e.stopPropagation();const uid=b.dataset.r;if(S.students.length<=1)return;if(!confirm('Remove '+(byId(uid)?.name||'student')+'?'))return;if(M.remove(uid)){if(sel===uid)sel=S.students[0].id;render()}});
    const add=$('addStudent');if(add)add.onclick=()=>{const name=prompt('Student name');const student=M.create(name);if(!student)return;sel=student.id;render()};
    renderAudit();
  };

  const baseStudent=renderStudent;
  renderStudent=function(){
    M.ensureAll();baseStudent();const s=st();if(!s)return;
    if(!changeMode){
      document.querySelectorAll('#studentCal .allowed,#studentCal .selectedChoice').forEach(el=>el.onclick=()=>{
        const result=M.toggleDraft(s.id,el.dataset.id);
        if(result.action==='choose_replacement')showModuleReplace(result.newId,result.drafts,s);else renderStudent();
      });
      const confirmChoice=$('confirmChoice');if(confirmChoice)confirmChoice.onclick=()=>{if(M.confirmDraft(s.id))render();else alert('課程狀態剛剛有變化，請重新確認可選時間。')};
      const confirmWeek=$('confirmWeek');if(confirmWeek)confirmWeek.onclick=()=>{M.confirmWeek(s.id);render()};
    }else{
      document.querySelectorAll('#studentCal .changeTarget').forEach(el=>el.onclick=()=>{if(!changeFrom)return;autoChange(s.id,changeFrom,el.dataset.id)});
    }
  };

  document.querySelectorAll('.modeBtn').forEach(b=>b.onclick=()=>{const s=st();if(!s||s.mode===b.dataset.mode)return;M.setMode(s.id,b.dataset.mode);changeMode=false;changeFrom=null;render()});
  document.querySelectorAll('.countBtn').forEach(b=>b.onclick=()=>{const s=st();if(!s)return;M.setSessions(s.id,+b.dataset.count);changeMode=false;changeFrom=null;render()});

  const baseAlerts=renderCoachAlerts;
  renderCoachAlerts=function(){
    baseAlerts();
    document.querySelectorAll('[data-ack]').forEach(b=>b.onclick=()=>{M.acknowledge(b.dataset.ack);render()});
    const all=$('ackAll');if(all)all.onclick=()=>{M.acknowledgeAll();render()};
  };

  render();
})();