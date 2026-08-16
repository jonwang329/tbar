/* Project Eddie V22 — remove duplicate change wording; one clear coach acknowledgement action. */
(function(){
  const M=window.StudentModule;
  if(!M)return;
  const baseAggregation=renderAggregation;
  renderAggregation=function(){
    baseAggregation();
    const notes=(S.notifications||[]).filter(n=>!n.seen).slice().sort((a,b)=>b.createdAt-a.createdAt);
    const latestByStudent=new Map();
    notes.forEach(n=>{if(!latestByStudent.has(n.studentId))latestByStudent.set(n.studentId,n)});
    document.querySelectorAll('#aggBody tr').forEach((tr,i)=>{
      const s=S.students[i],n=s&&latestByStudent.get(s.id);
      if(!n)return;
      const statusCell=tr.children[2],actionCell=tr.children[4];
      if(statusCell)statusCell.innerHTML='<span class="status timeChanged">時間已改</span>';
      if(actionCell)actionCell.innerHTML='<button class="btn green changeAckBtn" data-row-ack="'+n.id+'">✓ 我知道了</button>';
    });
    document.querySelectorAll('[data-row-ack]').forEach(b=>b.onclick=()=>{M.acknowledge(b.dataset.rowAck);render()});
  };

  const baseAlerts=renderCoachAlerts;
  renderCoachAlerts=function(){
    baseAlerts();
    document.querySelectorAll('[data-ack]').forEach(b=>b.onclick=()=>{M.acknowledge(b.dataset.ack);render()});
    const all=$('ackAll');if(all)all.onclick=()=>{M.acknowledgeAll();render()};
  };
  render();
})();
