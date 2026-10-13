(function(){
var ov=null,A=null,B=null,busy=false;
var st=document.createElement('style');
st.textContent='.upm-win{position:fixed;z-index:2000;top:16px;bottom:16px;background:#fff;border-radius:0 20px 20px 0;box-sizing:border-box;border:1px solid rgba(0,0,0,0.06);transform:translateX(-100%);clip-path:inset(0 0 0 100%);transition:transform .45s cubic-bezier(.22,1,.36,1),clip-path .45s cubic-bezier(.22,1,.36,1);will-change:transform;overflow:auto;}.upm-win.on{transform:translateX(0);clip-path:inset(0 0 0 0);}#upmoA{left:104px;width:420px;padding:16px;z-index:2001;}#upmoB{left:104px;right:16px;}#upmoWin,#upmoWin *{-webkit-user-select:none;user-select:none;-webkit-tap-highlight-color:transparent;outline:none;}';
document.head.appendChild(st);
function row(l,k,t,hk){return '<div class="ml-row" data-k="'+k+'" style="display:flex;align-items:center;padding:9px 10px 9px 12px;cursor:pointer;text-align:left;font-size:11px;'+(l?'color:#374151;':'font-weight:700;color:#1f2937;')+'"><span class="ar" style="width:12px;min-width:12px;flex-shrink:0;color:#6b7280;">'+(hk?'&#9656;':'')+'</span><span>'+t+'</span></div>';}
function sec(k,t,items){var inn='';items.forEach(function(it){inn+=row(1,it[0],it[1],false);});return '<div class="ml-card0" style="margin:0 0 6px 0;">'+row(0,k,t,true)+'<div data-kids="'+k+'" data-o="0" style="max-height:0;overflow:hidden;transition:max-height .35s ease;">'+inn+'</div></div>';}
function listHtml(){
var pi=[['act:all','Общая информация'],['act:int','Внутренний'],['act:ext','Внешний']];
var mi=[],ai=[];
try{mi=PROJECTS.main.items.map(function(it){return ['proj:'+it.code,it.code+' '+it.name];});ai=PROJECTS.aux.items.map(function(it){return ['proj:'+it.code,it.code+' '+it.name];});}catch(err){}
return sec('prep','Подготовительные работы',pi)+sec('main','Основные проекты',mi)+sec('aux','Вспомогательные проекты',ai);
}
function openAll(){
if(ov){return;}
if(Date.now()-(window._upmoLastClose||0)<560){return;}
ov=document.createElement('div');ov.id='upmoWin';
A=document.createElement('div');A.id='upmoA';A.className='upm-win';A.innerHTML=listHtml();
B=document.createElement('div');B.id='upmoB';B.className='upm-win';
ov.appendChild(A);ov.appendChild(B);document.body.appendChild(ov);
var b=document.getElementById('upmoBtn');if(b){b.classList.add('nav-active');}
A.addEventListener('click',function(e){
var r=e.target.closest('.ml-row');if(r===null){return;}
var k=r.getAttribute('data-k');
var kids=A.querySelector('[data-kids="'+k+'"]');
if(kids){var op=kids.getAttribute('data-o')==='1';kids.style.maxHeight=op?'0px':kids.scrollHeight+'px';kids.setAttribute('data-o',op?'0':'1');r.querySelector('.ar').innerHTML=op?'&#9656;':'&#9662;';return;}
if(k.indexOf('act:')===0){pick(k);}
});
void A.offsetWidth;
setTimeout(function(){if(A){A.classList.add('on');}},20);
}
function closeAll(){
if(ov===null){return;}
window._upmoLastClose=Date.now();
var o=ov,a=A,b=B;ov=null;A=null;B=null;busy=false;
a.classList.remove('on');b.classList.remove('on');
var bt=document.getElementById('upmoBtn');if(bt){bt.classList.remove('nav-active');}
setTimeout(function(){o.remove();if(ov===null&&window.upmoMapRestore){window.upmoMapRestore();}},520);
}
function pick(k){
if(busy){return;}busy=true;
A.classList.remove('on');B.classList.remove('on');
setTimeout(function(){
if(B===null){busy=false;return;}
if(window.upmoFillPanel){window.upmoFillPanel(B,k);}
B.classList.add('on');busy=false;
},480);
}
document.addEventListener('click',function(e){
if(window.innerWidth<=768){return;}
var b=e.target.closest('#upmoBtn');
if(b){if(ov===null){openAll();}else if(A.classList.contains('on')){if(B.classList.contains('on')){A.classList.remove('on');}else{closeAll();}}else{A.classList.add('on');}return;}
if(ov&&!window._upmoMapInit&&e.target.closest('.buttons button')){closeAll();}
},true);
})();
