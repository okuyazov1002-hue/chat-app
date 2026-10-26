(function(){
if(window.UPMO_ACL){return;}
var A=window.UPMO_ACL={ready:false,view:false,edit:false,login:'',role:''};
var HIDE=['\u041a\u043e\u043d\u0442\u0440\u0430\u043a\u0442\u044b','\u0420\u0435\u0435\u0441\u0442\u0440 \u043e\u043f\u043b\u0430\u0442\u044b'];
function hide(){if(A.view){return;}var all=document.querySelectorAll('button,a,div,span,li');for(var i=0;i<all.length;i++){var e=all[i];if(e.childElementCount===0&&HIDE.indexOf((e.textContent||'').trim())>=0&&!e.closest('.c4s')&&!e.closest('#dbPanel')){e.style.display='none';}}}
fetch('/api/me',{credentials:'same-origin'}).then(function(r){return r.json();}).then(function(m){
var lg=String((m&&m.login)||'').toLowerCase(),rl=(m&&m.role)||'';
A.login=lg;A.role=rl;A.edit=(lg==='sh.arslanov'||rl==='developer');A.view=(A.edit||rl==='admin'||((m&&m.features)||[]).indexOf('finance')>=0);A.ready=true;
hide();
}).catch(function(){A.ready=true;});
try{new MutationObserver(function(){if(A.ready&&!A.view){hide();}}).observe(document.documentElement,{childList:true,subtree:true});}catch(e){}
})();