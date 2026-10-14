p="public/upmo/upmo-win.js"
s=open(p,encoding="utf-8").read()
a1="ov=document.createElement('div');ov.id='upmoWin';"
a2="document.addEventListener('click',function(e){\nif(window.innerWidth<=768){return;}"
c=[s.count(a1),s.count(a2),s.count("function closeTeam")]
if c!=[1,1,0]:
    print("ANCHOR_COUNT",c);raise SystemExit
team='''var tw=null;
function closeTeam(){
if(tw===null){return;}
var o=tw;tw=null;o.classList.remove('on');
var tb=document.getElementById('teamBtn');if(tb){tb.classList.remove('nav-active');}
if(window._teamPrev){window._teamPrev.classList.add('nav-active');window._teamPrev=null;}
window._teamLastClose=Date.now();
setTimeout(function(){o.remove();},520);
}
function openTeam(){
if(tw!==null){return;}
if(ov!==null){closeAll();}
var pv=document.querySelector('.buttons button.nav-active');
window._teamPrev=(pv&&pv.id!=='teamBtn')?pv:null;
document.querySelectorAll('.buttons button').forEach(function(x){x.classList.remove('nav-active');});
var tb=document.getElementById('teamBtn');if(tb){tb.classList.add('nav-active');}
tw=document.createElement('div');tw.id='teamWin';tw.className='upm-win';
tw.style.cssText='left:104px;width:420px;padding:16px;z-index:2001;';
document.body.appendChild(tw);void tw.offsetWidth;
setTimeout(function(){if(tw){tw.classList.add('on');}},20);
}
document.addEventListener('click',function(e){
if(window.innerWidth<=768){return;}
var t=e.target.closest('#teamBtn');
if(t){e.stopPropagation();e.preventDefault();if(tw===null){if(Date.now()-(window._teamLastClose||0)<560){return;}openTeam();}else{closeTeam();}return;}
if(tw!==null&&e.target.closest('.buttons button')&&!e.target.closest('#upmoBtn')){closeTeam();}
},true);
'''
s=s.replace(a1,"closeTeam();"+a1).replace(a2,team+a2)
open(p,"w",encoding="utf-8").write(s);print("PATCHED")
