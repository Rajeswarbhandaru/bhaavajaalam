# ─────────────────────────────────────────────────────────────────────────────
# bhava-patch-report.ps1  v2  (fixed -replace syntax)
# Run from E:\bhaavajaalam-main\docs\
#   PowerShell -ExecutionPolicy Bypass -File bhava-patch-report.ps1
# ─────────────────────────────────────────────────────────────────────────────

$reportFile = "E:\bhaavajaalam-main\docs\bhava-student-report.html"

if (-not (Test-Path $reportFile)) {
    Write-Host "ERROR: $reportFile not found." -ForegroundColor Red; exit 1
}

$html = Get-Content $reportFile -Raw -Encoding UTF8

# ── Guard: already patched? ───────────────────────────────────────────────────
if ($html -match "bhava-report-live-patch") {
    Write-Host "Already patched — nothing to do." -ForegroundColor Yellow; exit 0
}

# ── 1. Add bhava-session.js just before </head> ───────────────────────────────
if ($html -notmatch "bhava-session\.js") {
    $replacement1 = '  <script src="bhava-session.js"></script>' + "`r`n" + '</head>'
    $html = $html.Replace('</head>', $replacement1)
    Write-Host "  [+] Added bhava-session.js script tag" -ForegroundColor Cyan
}

# ── 2. Give <title> an id ─────────────────────────────────────────────────────
if ($html -notmatch 'id="pageTitle"') {
    $html = $html -replace '<title>(.*?)</title>', '<title id="pageTitle">$1</title>'
    Write-Host "  [+] Added id=pageTitle to <title>" -ForegroundColor Cyan
}

# ── 3. Build the live-patch block as a single string ─────────────────────────
$liveBlock = @'
<!-- bhava-report-live-patch: auto-fills name/roll/class from BhavaSession + IPC -->
<script>
(function(){
  'use strict';

  function resolveId(){
    try{var p=new URLSearchParams(window.location.search);var v=p.get('sid')||p.get('studentId');if(v)return v;}catch(e){}
    try{if(window.BhavaSession){var s=window.BhavaSession.getStudent();if(s&&s.id!=null)return String(s.id);}}catch(e){}
    var keys=['bhava_student','bhavaStudentId','bhava_student_id','studentId'];
    for(var i=0;i<keys.length;i++){
      try{var v=sessionStorage.getItem(keys[i]);if(!v)continue;
        if(keys[i]==='bhava_student'){var o=JSON.parse(v);if(o&&o.id)return String(o.id);}
        else return v;
      }catch(e){}
    }
    if(window._bhavaStudentId)return String(window._bhavaStudentId);
    return null;
  }

  function resolveObj(){
    try{if(window.BhavaSession){var s=window.BhavaSession.getStudent();if(s&&s.id)return s;}}catch(e){}
    try{var r=sessionStorage.getItem('bhava_student');if(r){var o=JSON.parse(r);if(o&&o.id)return o;}}catch(e){}
    return null;
  }

  function pickNum(v){
    if(v==null)return null;
    if(typeof v==='number')return Math.round(v);
    var keys=['iq_score','eq_score','sq_score','total','score','composite'];
    for(var i=0;i<keys.length;i++){if(typeof v[keys[i]]==='number')return Math.round(v[keys[i]]);}
    return null;
  }

  function setText(id,val){var el=document.getElementById(id);if(el)el.textContent=val;}

  function applyIdentity(s,sid){
    var name    = s.name       || 'Student';
    var rollNo  = s.roll_no    || s.rollNo || sid || '\u2014';
    var cls     = s['class']   || s.grade  || '\u2014';
    var section = s.section    || '';
    var school  = s.school_name|| s.school || 'Bh\u0101va Tech';
    var initials= name.split(' ').map(function(w){return w[0]||'';}).join('').toUpperCase().slice(0,2);

    setText('studentAvatarInitials', initials);
    setText('studentName',   name);
    setText('studentAge',    'Roll No. ' + rollNo);
    setText('studentGrade',  'Class ' + cls + (section ? ' \u2013 ' + section : ''));
    setText('studentSchool', school);

    var now=new Date();
    setText('reportPeriod','Report '+now.toLocaleString('en-IN',{month:'long',year:'numeric'}));

    var sumEl=document.getElementById('studentSummary');
    if(sumEl)sumEl.textContent=name.split(' ')[0]+
      ' is enrolled at Bh\u0101va Tech. Scores reflect in-platform game performance across all cognitive domains.';

    document.title='Bh\u0101va Tech \u2014 '+name+' \u00B7 Class '+cls+' Report';

    var pdEl=document.getElementById('print-date');
    if(pdEl)pdEl.textContent=now.toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'});
  }

  function applyOverall(score){
    setText('overallScoreNum',score);
    var ch=window._reportCharts||[];
    if(ch[0]){try{ch[0].data.datasets[0].data=[score,100-score];ch[0].update();}catch(e){}}
  }

  function guessCAT(n){
    n=n||'';
    if(/memory|match|zoo|neuro.?flash/i.test(n))       return 'Memory';
    if(/logic|grid|visual|rotation|mental/i.test(n))   return 'Logic';
    if(/grammar|language|imaginia/i.test(n))           return 'Language';
    if(/math|blitz|number|percent/i.test(n))           return 'Math';
    if(/empathy|heart|social|planet|convers/i.test(n)) return 'Social';
    if(/focus|calm|distract|hero|brain.?garden/i.test(n))return 'Focus';
    if(/telugu|script/i.test(n))                       return 'Telugu';
    if(/habit|good/i.test(n))                          return 'Habit';
    return 'IQ';
  }

  var CAT_COLORS={
    Memory:'var(--cat-memory)',Logic:'var(--cat-logic)',Language:'var(--cat-language)',
    Math:'var(--cat-math)',Social:'var(--cat-social)',Focus:'var(--cat-focus)',
    IQ:'var(--cat-iq)',Habit:'var(--cat-habit)',Telugu:'var(--cat-telugu)'
  };

  function applyTimeline(sessions){
    var list=document.getElementById('timelineList');if(!list)return;
    var sorted=sessions.filter(function(s){return s.started_at;})
      .sort(function(a,b){return new Date(b.started_at)-new Date(a.started_at);}).slice(0,8);
    if(!sorted.length)return;
    list.innerHTML=sorted.map(function(s,i){
      var cat=guessCAT(s.game_name);var col=CAT_COLORS[cat]||'var(--color-primary)';
      var when=new Date(s.started_at).toLocaleDateString('en-IN',{day:'numeric',month:'short'});
      return '<div class="timeline-item">'
        +'<div class="tl-dot-col"><div class="tl-dot" style="background:'+col+'"></div>'
        +(i<sorted.length-1?'<div class="tl-line"></div>':'')+'</div>'
        +'<div><div class="tl-game">'+(s.game_name||'Game')+'</div>'
        +'<div class="tl-when">'+cat+' \u00B7 '+when+'</div></div>'
        +'<div class="tl-score" style="color:'+col+'">'+(s.raw_score!=null?s.raw_score:'\u2014')+'</div>'
        +'</div>';
    }).join('');
  }

  function applyKPIs(sessions){
    setText('kpiGamesPlayed',sessions.length);
    var done=sessions.filter(function(s){return s.raw_score!=null;});
    if(done.length){
      var avg=Math.round(done.reduce(function(a,b){return a+(b.raw_score||0);},0)/done.length);
      setText('kpiAvgScore',avg);
    }
    setText('kpiGamesDelta',sessions.length+' total sessions');
    setText('kpiScoreDelta','live from Bh\u0101va DB');
  }

  async function main(){
    var sid=resolveId();var obj=resolveObj();
    if(!sid&&!obj){setText('reportPeriod','Demo Mode');return;}
    if(obj)applyIdentity(obj,sid);
    if(!window.bhava)return;
    var eid=sid||(obj&&String(obj.id));if(!eid)return;
    try{
      var res=await Promise.allSettled([
        window.bhava.getIQScores(eid),
        window.bhava.getEQScores(eid),
        window.bhava.getSQScores(eid),
        window.bhava.getGameSessions(eid)
      ]);
      var iq=pickNum(res[0].status==='fulfilled'?res[0].value:null);
      var eq=pickNum(res[1].status==='fulfilled'?res[1].value:null);
      var sq=pickNum(res[2].status==='fulfilled'?res[2].value:null);
      var nums=[iq,eq,sq].filter(function(x){return x!=null;});
      var overall=nums.length?Math.round(nums.reduce(function(a,b){return a+b;},0)/nums.length):0;
      if(overall>0)applyOverall(overall);
      var sess=(res[3].status==='fulfilled'&&Array.isArray(res[3].value))?res[3].value:[];
      if(sess.length){applyTimeline(sess);applyKPIs(sess);}
      if(!obj&&typeof window.bhava.getStudent==='function'){
        try{var st=await window.bhava.getStudent(eid);if(st&&st.id)applyIdentity(st,eid);}catch(e){}
      }
    }catch(err){console.warn('[BhavaReport] live fetch error:',err.message||err);}
  }

  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',main);}
  else{setTimeout(main,50);}
})();
</script>
'@

# ── FIX: use .Replace() string method, NOT -replace regex operator ───────────
# This avoids the "three elements" PowerShell error from v1 of this script.
$replacement3 = $liveBlock + '</body>'
$html = $html.Replace('</body>', $replacement3)

if ($html -match "bhava-report-live-patch") {
    Write-Host "  [+] Appended live-data integration block" -ForegroundColor Cyan
} else {
    Write-Host "  [!] WARNING: </body> tag not found — block may not have been inserted." -ForegroundColor Yellow
    Write-Host "      Manually paste the <script> block just before </body>." -ForegroundColor Yellow
}

# ── 4. Save ────────────────────────────────────────────────────────────────────
Set-Content -Path $reportFile -Value $html -Encoding UTF8

Write-Host ""
Write-Host "Done. bhava-student-report.html is fully patched." -ForegroundColor Green
Write-Host ""
Write-Host "Verify by opening DevTools in Electron and running:" -ForegroundColor White
Write-Host '  sessionStorage.setItem("bhava_student", JSON.stringify({id:1,name:"Aarav Kumar","class":"10",roll_no:"1001",section:"A",school:"Vijayawada Public School"}))'
Write-Host '  location.reload()'
Write-Host ""
Write-Host "Or navigate from a game:" -ForegroundColor White
Write-Host '  window.location.href = "../bhava-student-report.html?sid=1001"'
