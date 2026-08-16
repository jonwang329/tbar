/* Direct external test URLs for Project Eddie V21 */
(function(){
  const p=new URLSearchParams(location.search);
  const view=(p.get('view')||'').toLowerCase();
  const studentId=p.get('student');
  if(studentId && typeof byId==='function' && byId(studentId)) sel=studentId;
  if(view==='student'){
    preview=false;
    const pv=document.getElementById('preview');if(pv)pv.classList.remove('show');
    if(typeof switchTab==='function') switchTab('student');
    document.title='Project Eddie · Student';
  }else if(view==='coach'){
    preview=false;
    const pv=document.getElementById('preview');if(pv)pv.classList.remove('show');
    if(typeof switchTab==='function') switchTab('coach');
    document.title='Project Eddie · Coach';
  }
})();