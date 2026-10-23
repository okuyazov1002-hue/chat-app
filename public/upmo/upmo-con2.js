(function(){
var L={act:'\u0414\u0435\u0439\u0441\u0442\u0432\u0443\u0435\u0442',done:'\u0417\u0430\u0432\u0435\u0440\u0448\u0451\u043d',hold:'\u041f\u0440\u0438\u043e\u0441\u0442\u0430\u043d\u043e\u0432\u043b\u0435\u043d',common:'\u041e\u0431\u0449\u0438\u0435 \u0443\u0441\u043b\u0443\u0433\u0438',addn:'\u0414\u043e\u043f. \u0441\u043e\u0433\u043b\u0430\u0448\u0435\u043d\u0438\u0435',allp:'\u0412\u0441\u0435 \u043f\u0440\u043e\u0435\u043a\u0442\u044b',addPrj:'\u0414\u043e\u0431\u0430\u0432\u0438\u0442\u044c \u043f\u0440\u043e\u0435\u043a\u0442',addCom:'\u0414\u043e\u0431\u0430\u0432\u0438\u0442\u044c \u043e\u0431\u0449\u0438\u0435 \u0443\u0441\u043b\u0443\u0433\u0438',addAdn:'\u0414\u043e\u0431\u0430\u0432\u0438\u0442\u044c \u0434\u043e\u043f. \u0441\u043e\u0433\u043b\u0430\u0448\u0435\u043d\u0438\u0435',addCon:'\u0414\u043e\u0431\u0430\u0432\u0438\u0442\u044c \u043a\u043e\u043d\u0442\u0440\u0430\u043a\u0442',delCon:'\u0423\u0434\u0430\u043b\u0438\u0442\u044c \u043a\u043e\u043d\u0442\u0440\u0430\u043a\u0442',delPrj:'\u0423\u0434\u0430\u043b\u0438\u0442\u044c \u043f\u0440\u043e\u0435\u043a\u0442',delGrp:'\u0423\u0434\u0430\u043b\u0438\u0442\u044c \u0433\u0440\u0443\u043f\u043f\u0443',delAdn:'\u0423\u0434\u0430\u043b\u0438\u0442\u044c \u0434\u043e\u043f. \u0441\u043e\u0433\u043b\u0430\u0448\u0435\u043d\u0438\u0435',addSvc:'\u0414\u043e\u0431\u0430\u0432\u0438\u0442\u044c \u0443\u0441\u043b\u0443\u0433\u0443',delSvc:'\u0423\u0434\u0430\u043b\u0438\u0442\u044c \u0443\u0441\u043b\u0443\u0433\u0443',del:'\u0423\u0434\u0430\u043b\u0438\u0442\u044c?',delAll:'\u0423\u0434\u0430\u043b\u0438\u0442\u044c \u0432\u043c\u0435\u0441\u0442\u0435 \u0441\u043e \u0432\u0441\u0435\u043c \u0432\u043d\u0443\u0442\u0440\u0438?',svc:'\u0423\u0441\u043b\u0443\u0433\u0430',numPh:'\u2116 \u043a\u043e\u043d\u0442\u0440\u0430\u043a\u0442\u0430',contr:'\u041f\u043e\u0434\u0440\u044f\u0434\u0447\u0438\u043a',addNum:'\u2116 \u0434\u043e\u043f.',noPrj:'\u041d\u0435\u0442 \u043f\u0440\u043e\u0435\u043a\u0442\u043e\u0432',err:'\u041e\u0448\u0438\u0431\u043a\u0430',teo:'\u0422\u042d\u041e',cons:'\u0421\u0442\u0440\u043e\u0438\u0442\u0435\u043b\u044c\u0441\u0442\u0432\u043e',base:'\u0411\u0430\u0437\u043e\u0432\u043e\u0435 \u043f\u0440\u043e\u0435\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435',det:'\u0414\u0435\u0442\u0430\u043b\u044c\u043d\u043e\u0435 \u043f\u0440\u043e\u0435\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435'};
var HD=['','\u0421\u0442\u0430\u0442\u0443\u0441','\u041e\u0445\u0432\u0430\u0442','\u0412\u0430\u043b.','\u0421\u0443\u043c\u043c\u0430','\u041e\u043f\u043b\u0430\u0447\u0435\u043d\u043e','\u041e\u0441\u0442\u0430\u0442\u043e\u043a','\u041f\u043e\u0434\u043f\u0438\u0441\u0430\u043d'];
var ST=[L.act,L.done,L.hold],CU=['USD','EUR','UZS','RUB'],SUG=[L.teo,'ESHIA',L.cons,L.base,L.det];
var ROWS=[],OK=false,SC=null,MSG=null,POP=null,UP=[];
var FLD='width:100%;min-width:0;box-sizing:border-box;border:0;background:transparent;font:10px system-ui,sans-serif;color:#1f2547;padding:0 4px;height:22px;min-height:0;margin:0;display:block;outline:none;';
var GRID='display:grid;grid-template-columns:2.7fr 1fr 1.1fr .6fr 1.2fr 1.1fr 1.1fr 1fr;align-items:center;column-gap:8px;';
var BTN='border:0;border-radius:12px;background:#5b49c8;color:#fff;font:700 10px system-ui,sans-serif;padding:0 14px;height:24px;width:auto;min-height:0;cursor:pointer;outline:none;';
function el(t,c,x){var e=document.createElement(t);if(c){e.style.cssText=c;}if(x!=null){e.textContent=x;}return e;}
function uid(){return 'k'+Date.now().toString(36)+Math.random().toString(36).slice(2,6);}
function num(v){var n=parseFloat(String(v==null?'':v).replace(/\s/g,'').replace(',','.'));return isNaN(n)?0:n;}
function fm(n){var s=(Math.round(n*100)/100).toFixed(2);if(/\.00$/.test(s)){s=s.slice(0,-3);}var p=s.split('.');p[0]=p[0].replace(/\B(?=(\d{3})+(?!\d))/g,' ');return p.join('.');}
function fmtS(v){v=String(v==null?'':v).replace(/[^0-9.,]/g,'').replace(',','.');var p=v.split('.');var a=p[0].replace(/\B(?=(\d{3})+(?!\d))/g,' ');return p.length>1?a+'.'+p.slice(1).join('').slice(0,2):a;}
function dmy(v){var m=/^(\d{4})-(\d{2})-(\d{2})$/.exec(v||'');return m?m[3]+'.'+m[2]+'.'+m[1]:'';}
function projs(){var a=[];try{PROJECTS.main.items.concat(PROJECTS.aux.items).forEach(function(it){a.push({c:it.code,n:it.name});});}catch(e){}return a;}
function save(){if(!OK){return;}clearTimeout(save.t);save.t=setTimeout(function(){fetch('/api/con2/save',{method:'POST',headers:{'Content-Type':'application/json'},credentials:'same-origin',body:JSON.stringify({rows:ROWS})}).catch(function(){if(MSG){MSG.textContent=L.err;}});},500);}
function svSum(k,key){return k.services.reduce(function(s,x){return s+num(x[key]);},0);}
function cSum(c,key){return c.children.reduce(function(s,k){return s+svSum(k,key);},0);}
function refresh(){UP.forEach(function(f){f();});}
function closePop(){if(POP){POP.remove();POP=null;document.removeEventListener('mousedown',outPop,true);}}
function outPop(e){if(POP&&!POP.contains(e.target)&&!(POP._a&&POP._a.contains(e.target))){closePop();}}
function openPop(anchor,build,w){
if(POP&&POP._a===anchor){closePop();return;}
closePop();w=w||180;var r=anchor.getBoundingClientRect();
POP=el('div','position:fixed;z-index:99999;left:'+Math.max(8,Math.min(r.left,window.innerWidth-w-8))+'px;top:'+(r.bottom+4)+'px;width:'+w+'px;max-height:280px;overflow:auto;scrollbar-width:none;background:#fff;border-radius:10px;box-shadow:0 8px 28px rgba(60,50,140,.25);padding:6px;box-sizing:border-box;opacity:0;transform:translateY(-8px);transition:opacity .22s ease,transform .22s ease;');
POP.className='conPop';POP._a=anchor;build(POP);document.body.appendChild(POP);
var h=POP.offsetHeight;if(r.bottom+4+h>window.innerHeight){POP.style.top=Math.max(8,r.top-h-4)+'px';}
requestAnimationFrame(function(){requestAnimationFrame(function(){if(POP){POP.style.opacity='1';POP.style.transform='none';}});});
setTimeout(function(){document.addEventListener('mousedown',outPop,true);},0);
}
function item(p,t,fn,on){var d=el('div','padding:5px 8px;white-space:nowrap;font:10px system-ui,sans-serif;color:#1f2547;cursor:pointer;border-radius:6px;'+(on?'background:#f1efff;font-weight:700;':''),t);d.addEventListener('mouseenter',function(){if(!on){d.style.background='#f7f6ff';}});d.addEventListener('mouseleave',function(){if(!on){d.style.background='';}});d.addEventListener('click',fn);p.appendChild(d);return d;}
function txt(o,key,ph,css){var i=el('input',FLD+(css||''));i.type='text';i.placeholder=ph||'';i.value=o[key]||'';i.addEventListener('input',function(){o[key]=i.value;save();});return i;}
function sumInp(o,key){var i=el('input',FLD+'text-align:right;font-weight:500;');i.type='text';i.inputMode='decimal';i.value=fmtS(o[key]);i.addEventListener('input',function(){var pos=i.selectionStart,before=i.value.slice(0,pos).replace(/[^0-9.,]/g,'').length;var f=fmtS(i.value);i.value=f;var n=0,k=0;while(k<f.length&&n<before){if(/[0-9.]/.test(f[k])){n++;}k++;}i.setSelectionRange(k,k);o[key]=f.replace(/ /g,'');save();refresh();});return i;}
function calc(fn){var s=el('div','text-align:right;font:500 10px system-ui,sans-serif;color:#1f2547;padding:0 4px;white-space:nowrap;');function u(){s.textContent=fm(fn());}u();UP.push(u);return s;}
function pick(o,key,opts,cb){var c=el('div','display:flex;align-items:center;height:22px;padding:0 4px;font:10px system-ui,sans-serif;color:#1f2547;cursor:pointer;white-space:nowrap;',o[key]||opts[0]);c.addEventListener('click',function(){openPop(c,function(p){opts.forEach(function(x){item(p,x,function(){o[key]=x;c.textContent=x;save();closePop();if(cb){cb();}},x===o[key]);});},110);});return c;}
function stCell(o){var w=el('div','');var b=el('span','display:inline-block;height:20px;line-height:20px;padding:0 12px;border-radius:10px;font:10px system-ui,sans-serif;cursor:pointer;border:.5px solid #c9c0f5;white-space:nowrap;','');function sy(){var v=o.status||ST[0];b.textContent=v;b.style.background=v===ST[1]?'#d3f3dd':(v===ST[0]?'#fff3c4':'#fff');b.style.color=v===ST[1]?'#1e7a43':(v===ST[0]?'#8a6100':'#666');}sy();b.addEventListener('click',function(){openPop(b,function(p){ST.forEach(function(x){item(p,x,function(){o.status=x;sy();save();closePop();},x===(o.status||ST[0]));});},150);});w.appendChild(b);return w;}
function dateCell(o,key){var c=el('div','display:flex;align-items:center;height:22px;padding:0 4px;font:10px system-ui,sans-serif;color:#1f2547;cursor:pointer;white-space:nowrap;',dmy(o[key]));c.addEventListener('click',function(){if(window.upmoPcal){window.upmoPcal(c,o[key]||'',function(v){o[key]=v;c.textContent=dmy(v);save();});}});return c;}
function scopeCell(c,s){var cell=el('div','display:flex;align-items:center;height:22px;padding:0 4px;font:10px system-ui,sans-serif;color:#4b3fb5;cursor:pointer;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;','');function t(){cell.textContent=s.scope==='all'?L.allp:((s.scope||[]).join(', ')||'\u2014');}t();
cell.addEventListener('click',function(){openPop(cell,function(p){
function row(lbl,on,fn){var lb=el('label','display:flex;gap:8px;align-items:center;padding:4px 6px;white-space:nowrap;font:10px system-ui,sans-serif;color:#1f2547;cursor:pointer;');var cb=document.createElement('input');cb.type='checkbox';cb.checked=on;cb.style.cssText='width:auto;height:auto;margin:0;';cb.addEventListener('change',function(){fn(cb.checked);});lb.appendChild(cb);lb.appendChild(el('span','',lbl));p.appendChild(lb);return cb;}
var allCb=row(L.allp,s.scope==='all',function(on){s.scope=on?'all':[];t();save();closePop();});
c.children.filter(function(k){return k.kind==='project';}).forEach(function(k){row(k.code,s.scope!=='all'&&(s.scope||[]).indexOf(k.code)>=0,function(on){if(s.scope==='all'){s.scope=[];}var i=s.scope.indexOf(k.code);if(on&&i<0){s.scope.push(k.code);}if(!on&&i>=0){s.scope.splice(i,1);}allCb.checked=false;t();save();});});
},200);});return cell;}
function chev(o){var s=el('span','cursor:pointer;color:#5b49c8;font-size:11px;width:12px;flex:none;user-select:none;',o.open?'\u25be':'\u25b8');s.addEventListener('click',function(){o.open=!o.open;save();draw();});return s;}
function rw(bg,ml){return el('div',GRID+'height:28px;padding:0 10px;border-radius:10px;margin-bottom:4px;background:'+bg+';margin-left:'+(ml||0)+'px;');}
function closeCx(){var m=document.getElementById('conCtx2');if(m){m.remove();}document.removeEventListener('mousedown',outCx,true);}
function outCx(e){var m=document.getElementById('conCtx2');if(m&&!m.contains(e.target)){closeCx();}}
function newCon(){return {id:uid(),num:'',contractor:'',status:ST[0],cur:'USD',signed:'',open:true,children:[]};}
function newSvc(k){return {id:uid(),name:'',sum:'',paid:'',scope:'all'};}
function ctx(e,type,c,k,s){
e.preventDefault();e.stopPropagation();closePop();closeCx();
var m=el('div','position:fixed;z-index:99999;left:'+e.clientX+'px;top:'+e.clientY+'px;background:#fff;border-radius:10px;box-shadow:0 8px 28px rgba(60,50,140,.25);padding:4px;opacity:0;transition:opacity .15s ease;');m.id='conCtx2';
function it(t,fn,red,keep){var d=el('div','padding:5px 14px;white-space:nowrap;font:10px system-ui,sans-serif;border-radius:6px;cursor:pointer;color:'+(red?'#c0392b':'#1f2547')+';',t);d.addEventListener('mouseenter',function(){d.style.background='#f1efff';});d.addEventListener('mouseleave',function(){d.style.background='';});d.addEventListener('click',function(){if(!keep){closeCx();}fn();});m.appendChild(d);}
function sep(){m.appendChild(el('div','border-top:1px solid #eeeefa;margin:3px 0;'));}
function after(){save();draw();}
function addCon(){if(!OK){return;}ROWS.push(newCon());after();}
function prjList(){m.innerHTML='';var have=c.children.filter(function(x){return x.kind==='project';}).map(function(x){return x.code;});var rest=projs().filter(function(p){return have.indexOf(p.c)<0;});if(!rest.length){it(L.noPrj,function(){},false);}rest.forEach(function(p){it(p.c+'  '+p.n,function(){c.children.push({id:uid(),kind:'project',code:p.c,name:p.n,num:'',signed:'',status:ST[0],open:true,services:[{id:uid(),name:L.cons,sum:'',paid:'',scope:'all'}]});var R={project:0,common:1,addendum:2};c.children.sort(function(a,b){return R[a.kind]-R[b.kind];});after();});});}
if(type==='c'){
it(L.addPrj,prjList,false,true);
if(!c.children.some(function(x){return x.kind==='common';})){it(L.addCom,function(){c.children.push({id:uid(),kind:'common',code:'',name:'',num:'',signed:'',status:ST[0],open:true,services:[]});var R={project:0,common:1,addendum:2};c.children.sort(function(a,b){return R[a.kind]-R[b.kind];});after();});}
it(L.addAdn,function(){c.children.push({id:uid(),kind:'addendum',code:'',name:'',num:'',signed:'',status:ST[0],open:true,services:[]});after();});
sep();it(L.addCon,addCon);
it(L.delCon,function(){if(confirm(L.delAll)){ROWS.splice(ROWS.indexOf(c),1);after();}},true);
}else if(type==='k'){
it(L.addSvc,function(){k.services.push(newSvc(k));k.open=true;after();});
it(k.kind==='project'?L.delPrj:(k.kind==='common'?L.delGrp:L.delAdn),function(){if(confirm(L.del)){c.children.splice(c.children.indexOf(k),1);after();}},true);
}else if(type==='s'){
it(L.addSvc,function(){k.services.splice(k.services.indexOf(s)+1,0,newSvc(k));after();});
it(L.delSvc,function(){if(confirm(L.del)){k.services.splice(k.services.indexOf(s),1);after();}},true);
}else{it(L.addCon,addCon);}
document.body.appendChild(m);
var h=m.offsetHeight;if(e.clientY+h>window.innerHeight){m.style.top=Math.max(8,window.innerHeight-h-8)+'px';}
requestAnimationFrame(function(){m.style.opacity='1';});
setTimeout(function(){document.addEventListener('mousedown',outCx,true);},0);
}
function lvl3(c,k,s){
var r=rw('#f3f4fb',26);
var i=txt(s,'name',L.svc,'');i.setAttribute('list','c2sug');r.appendChild(i);
r.appendChild(el('div'));
r.appendChild(k.kind==='project'?el('div'):scopeCell(c,s));
r.appendChild(el('div','font:10px system-ui,sans-serif;padding:0 4px;color:#5a5f85;',c.cur));
r.appendChild(sumInp(s,'sum'));r.appendChild(sumInp(s,'paid'));
r.appendChild(calc(function(){return num(s.sum)-num(s.paid);}));
r.appendChild(el('div'));
r.addEventListener('contextmenu',function(e){ctx(e,'s',c,k,s);});
return r;
}
function lvl2(c,k){
var r=rw(k.kind==='common'?'#fdf3d6':'#e1e6f4',0);
var nm=el('div','display:flex;align-items:center;gap:6px;min-width:0;');nm.appendChild(chev(k));
if(k.kind==='addendum'){nm.appendChild(el('span','font:500 10px system-ui,sans-serif;white-space:nowrap;color:#1f2547;',L.addn));nm.appendChild(txt(k,'num',L.addNum,'font-weight:500;'));}
else{nm.appendChild(el('span','font:500 10px system-ui,sans-serif;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:#1f2547;',k.kind==='common'?L.common:(k.code+'  '+k.name)));}
r.appendChild(nm);
r.appendChild(k.kind==='addendum'?stCell(k):el('div'));
r.appendChild(el('div'));
r.appendChild(el('div','font:10px system-ui,sans-serif;padding:0 4px;color:#1f2547;',c.cur));
r.appendChild(calc(function(){return svSum(k,'sum');}));
r.appendChild(calc(function(){return svSum(k,'paid');}));
r.appendChild(calc(function(){return svSum(k,'sum')-svSum(k,'paid');}));
r.appendChild(k.kind==='addendum'?dateCell(k,'signed'):el('div'));
r.addEventListener('contextmenu',function(e){ctx(e,'k',c,k);});
return r;
}
function card(c){
var cd=el('div','border:1.5px solid #c9c0f5;border-radius:16px;padding:8px 10px;margin-bottom:10px;background:#fff;');
var r=rw('#fff',0);
var nm=el('div','display:flex;align-items:center;gap:6px;min-width:0;');nm.appendChild(chev(c));
nm.appendChild(txt(c,'num',L.numPh,'font-weight:700;width:120px;flex:none;'));nm.appendChild(txt(c,'contractor',L.contr,'font-weight:700;'));
r.appendChild(nm);r.appendChild(stCell(c));r.appendChild(el('div'));
r.appendChild(pick(c,'cur',CU,draw));
r.appendChild(calc(function(){return cSum(c,'sum');}));
r.appendChild(calc(function(){return cSum(c,'paid');}));
r.appendChild(calc(function(){return cSum(c,'sum')-cSum(c,'paid');}));
r.appendChild(dateCell(c,'signed'));
r.addEventListener('contextmenu',function(e){ctx(e,'c',c);});
cd.appendChild(r);
if(c.open){c.children.forEach(function(k){cd.appendChild(lvl2(c,k));if(k.open){k.services.forEach(function(s){cd.appendChild(lvl3(c,k,s));});}});}
return cd;
}
function draw(){
closePop();closeCx();UP=[];SC.innerHTML='';
var h=el('div',GRID+'padding:0 22px 6px;');
HD.forEach(function(t,i){h.appendChild(el('span','font:700 10px system-ui,sans-serif;color:#4b3fb5;padding:0 4px;'+(i>=4&&i<=6?'text-align:right;':''),t));});
SC.appendChild(h);
ROWS.forEach(function(c){SC.appendChild(card(c));});
var bar=el('div','display:flex;gap:10px;align-items:center;padding:2px 0 14px;');
var ab=el('button',BTN,'+ '+L.addCon);ab.addEventListener('click',function(){if(!OK){return;}ROWS.push(newCon());save();draw();});
MSG=el('span','font:10px system-ui,sans-serif;color:#c0392b;','');
bar.appendChild(ab);bar.appendChild(MSG);SC.appendChild(bar);
}
window.upmoCon2=function(pg){
if(!document.getElementById('conCss2')){var st=document.createElement('style');st.id='conCss2';st.textContent='.conPop::-webkit-scrollbar,.c2s::-webkit-scrollbar{display:none;width:0;height:0}';document.head.appendChild(st);}
if(!document.getElementById('c2sug')){var dl=document.createElement('datalist');dl.id='c2sug';SUG.forEach(function(x){var o=document.createElement('option');o.value=x;dl.appendChild(o);});document.body.appendChild(dl);}
pg.style.cssText+='display:flex;flex-direction:column;';
SC=el('div','flex:1;min-height:0;overflow:auto;padding:8px 10px;box-sizing:border-box;scrollbar-width:none;');SC.className='c2s';
SC.addEventListener('contextmenu',function(e){ctx(e,'bg');});
pg.appendChild(SC);draw();
if(!OK){fetch('/api/con2',{credentials:'same-origin'}).then(function(r){return r.json();}).then(function(a){if(Array.isArray(a)){a.forEach(function(c){c.children=c.children||[];c.children.forEach(function(k){k.services=k.services||[];});});ROWS=a;OK=true;draw();}else{MSG.textContent=L.err;}}).catch(function(){MSG.textContent=L.err;});}
};
})();