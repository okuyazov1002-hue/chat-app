(function(){
var L={add:'\u0414\u043e\u0431\u0430\u0432\u0438\u0442\u044c \u043f\u043b\u0430\u0442\u0451\u0436',del:'\u0423\u0434\u0430\u043b\u0438\u0442\u044c \u043f\u043b\u0430\u0442\u0451\u0436',err:'\u041e\u0448\u0438\u0431\u043a\u0430 \u0441\u043e\u0445\u0440\u0430\u043d\u0435\u043d\u0438\u044f',ld:'\u0417\u0430\u0433\u0440\u0443\u0437\u043a\u0430...',empty:'\u0412\u044b\u0431\u0435\u0440\u0438\u0442\u0435',
hd:['\u041f\u043e\u0434\u0440\u044f\u0434\u0447\u0438\u043a','\u2116 \u043a\u043e\u043d\u0442\u0440\u0430\u043a\u0442\u0430','\u041a\u043e\u0434 \u043f\u0440\u043e\u0435\u043a\u0442\u0430','\u0412\u0438\u0434 \u0443\u0441\u043b\u0443\u0433\u0438','\u0412\u0438\u0434 \u043e\u043f\u043b\u0430\u0442\u044b','\u2116 \u0441\u0447\u0451\u0442\u0430','\u0414\u0430\u0442\u0430 \u0441\u0447\u0451\u0442\u0430','\u0421\u0440\u043e\u043a \u043e\u043f\u043b\u0430\u0442\u044b','\u2116 \u0440\u0435\u0435\u0441\u0442\u0440\u0430','\u0414\u0430\u0442\u0430 \u0440\u0435\u0435\u0441\u0442\u0440\u0430','\u0414\u0430\u0442\u0430 \u043e\u043f\u043b\u0430\u0442\u044b','\u0421\u0443\u043c\u043c\u0430 \u043f\u043b\u0430\u0442\u0435\u0436\u0430','\u041a\u0443\u0440\u0441','\u0421\u0443\u043c\u043c\u0430 \u044d\u043a\u0432. \u0414\u043e\u043b\u043b\u0430\u0440 \u0421\u0428\u0410'],
dd:'\u0423\u0434\u0430\u043b\u0438\u0442\u044c \u043f\u043b\u0430\u0442\u0451\u0436?',tot:'\u0418\u0442\u043e\u0433\u043e \u044d\u043a\u0432. USD'};
var COLS='minmax(150px,2fr) minmax(100px,1fr) minmax(90px,.9fr) minmax(140px,1.6fr) minmax(120px,1.4fr) minmax(90px,1fr) minmax(100px,1fr) minmax(100px,1fr) minmax(90px,1fr) minmax(100px,1fr) minmax(100px,1fr) minmax(130px,1.3fr) minmax(70px,.7fr) minmax(140px,1.4fr)';
var BD='border-right:1px solid #e3e6f4;border-bottom:1px solid #e3e6f4;';
var ROWS=[],CON=[],OK=false,SC,MSG,POP=null;
function el(t,css,tx){var e=document.createElement(t);if(css){e.style.cssText=css;}if(tx!=null){e.textContent=tx;}return e;}
function uid(){return 'p'+Date.now().toString(36)+Math.random().toString(36).slice(2,6);}
function num(v){var n=parseFloat(String(v==null?'':v).replace(/\s/g,'').replace(',','.'));return isNaN(n)?0:n;}
function fm(n){var s=(Math.round(n*100)/100).toFixed(2);var p=s.split('.');p[0]=p[0].replace(/\B(?=(\d{3})+(?!\d))/g,' ');return p[1]==='00'?p[0]:p.join('.');}
function save(){if(!OK||RO()){return;}clearTimeout(save.t);save.t=setTimeout(function(){fetch('/api/reg/save',{method:'POST',headers:{'Content-Type':'application/json'},credentials:'same-origin',body:JSON.stringify({rows:ROWS})}).then(function(r){MSG.textContent=r.ok?'':L.err;}).catch(function(){MSG.textContent=L.err;});},500);}
function cOf(id){for(var i=0;i<CON.length;i++){if(CON[i].id===id){return CON[i];}}return null;}
function sOf(c,id){if(!c){return null;}var a=c.services||[];for(var i=0;i<a.length;i++){if(a[i].id===id){return a[i];}}return null;}
function pOf(s,id){if(!s){return null;}var a=s.pays||[];for(var i=0;i<a.length;i++){if(a[i].id===id){return a[i];}}return null;}
function sLab(s){return s.name||((s.kind||'')+(s.num?' '+s.num:''))||'-';}
function closePop(){if(POP){POP.remove();POP=null;}}
document.addEventListener('mousedown',function(e){if(POP&&!POP.contains(e.target)){closePop();}},true);
function openPop(a,items,onPick,w){closePop();var r=a.getBoundingClientRect();
var p=el('div','position:fixed;z-index:99999;background:#fff;border:1px solid #c9c0f5;border-radius:10px;box-shadow:0 6px 20px rgba(60,50,140,.18);padding:4px;max-height:260px;overflow:auto;scrollbar-width:none;left:'+r.left+'px;top:'+(r.bottom+3)+'px;min-width:'+Math.max(w||0,r.width)+'px;');
if(!items.length){p.appendChild(el('div','font:10px system-ui,sans-serif;color:#9aa0bf;padding:6px 10px;','-'));}
items.forEach(function(it){var d=el('div','font:10px system-ui,sans-serif;color:#1f2547;padding:6px 10px;border-radius:7px;cursor:pointer;white-space:nowrap;',it.t);
d.addEventListener('mouseenter',function(){d.style.background='#eef1fa';});d.addEventListener('mouseleave',function(){d.style.background='';});
d.addEventListener('click',function(){onPick(it.v);closePop();});p.appendChild(d);});
document.body.appendChild(p);POP=p;}
var CS='font:10px system-ui,sans-serif;color:#1f2547;padding:0 6px;min-height:22px;display:flex;align-items:center;box-sizing:border-box;min-width:0;'+BD;
var CI='font:10px system-ui,sans-serif;color:#1f2547;padding:0 6px;min-height:21px;box-sizing:border-box;border:0;background:transparent;outline:none;width:100%;min-width:0;';
function wrap(ch){var w=el('div','display:flex;align-items:center;min-width:0;'+BD);w.appendChild(ch);return w;}
function dmy(v){var m=/^(\d{4})-(\d\d)-(\d\d)$/.exec(v||'');return m?m[3]+'.'+m[2]+'.'+m[1]:'';}
function pickCell(label,getItems,onPick,disabled){var d=el('div',CS+'cursor:'+(disabled?'default':'pointer')+';white-space:nowrap;overflow:hidden;text-overflow:ellipsis;',label||L.empty);
if(!label){d.style.color='#9aa0bf';}
if(!disabled){d.addEventListener('click',function(){openPop(d,getItems(),onPick);});}return d;}
function inp(o,k,ph,right,isNum,cb){var i=el('input',CI+'font-weight:'+(isNum?'700':'400')+';'+(right?'text-align:right;':''));
i.placeholder=ph||'';i.value=isNum&&o[k]!==''&&o[k]!=null?fm(num(o[k])):(o[k]||'');
if(isNum){i.addEventListener('focus',function(){i.value=o[k]||'';});i.addEventListener('blur',function(){o[k]=String(o[k]||'').replace(/\s/g,'').replace(',','.');i.value=o[k]!==''?fm(num(o[k])):'';if(cb){cb();}tot();});}
i.addEventListener('input',function(){o[k]=i.value;if(cb){cb();}save();});return i;}
function tot(){}
function names(){var o={},a=[];CON.forEach(function(c){var n=c.contractor;if(n&&!o[n]){o[n]=1;a.push(n);}});return a;}
function consOf(n){return CON.filter(function(c){return c.contractor===n;});}
function curOf(r){return r.cur||((cOf(r.cid)||{}).cur)||'';}
function isUsd(c){return !!c&&/usd|\$|\u0434\u043e\u043b\u043b/i.test(c.cur||'');}
function eqv(r){var c={cur:curOf(r)};if(isUsd(c)){return num(r.sum);}var k=num(r.rate);if(k<=0){return 0;}return /eur|\u20ac|\u0435\u0432\u0440\u043e|gbp/i.test(c?(c.cur||''):'')?num(r.sum)*k:num(r.sum)/k;}
function dcell(r,k){var w=el('div',CS+'justify-content:flex-end;cursor:pointer;',dmy(r[k]));w.addEventListener('click',function(){if(window.upmoPcal){window.upmoPcal(w,r[k]||'',function(v){r[k]=v;w.textContent=dmy(v);prop(r,k);save();});}});return w;}
function paidFull(p,r){if(!p){return false;}if(p.status==='\u041e\u043f\u043b\u0430\u0447\u0435\u043d\u043e'){return true;}var sum=num(p.sum),got=0;ROWS.forEach(function(z){if(z!==r&&z.pid===p.id){got+=num(z.sum);}});return sum>0&&Math.max(num(p.paid),got)>=sum-0.005;}
function ask(title,text,okT,cb){var ov=el('div','position:fixed;left:0;top:0;right:0;bottom:0;z-index:100000;background:rgba(31,37,71,.35);display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .2s ease;');
var bx=el('div','width:380px;max-width:90vw;box-sizing:border-box;background:#fff;border:1.5px solid #c9c0f5;border-radius:16px;padding:20px 22px 16px;box-shadow:0 16px 48px rgba(60,50,140,.28);transform:translateY(12px) scale(.95);transition:transform .25s ease;font-family:system-ui,sans-serif;');
bx.appendChild(el('div','font:700 13px system-ui,sans-serif;color:#4b3fb5;',title));
bx.appendChild(el('div','font:11px/1.55 system-ui,sans-serif;color:#1f2547;white-space:pre-line;margin:10px 0 18px;',text));
var bar=el('div','display:flex;justify-content:flex-end;gap:8px;');
var bc=el('button','height:26px;padding:0 18px;border:0;border-radius:14px;background:#fff;box-shadow:inset 0 0 0 1px #c9c0f5;color:#4b3fb5;font:700 10px system-ui,sans-serif;cursor:pointer;outline:none;','\u041e\u0442\u043c\u0435\u043d\u0430');
var bo=el('button','height:26px;padding:0 18px;border:0;border-radius:14px;background:linear-gradient(135deg,#7a68e0,#5b49c8);color:#fff;font:700 10px system-ui,sans-serif;cursor:pointer;outline:none;',okT);
bar.appendChild(bc);bar.appendChild(bo);bx.appendChild(bar);ov.appendChild(bx);document.body.appendChild(ov);
function close(){document.removeEventListener('keydown',kd,true);ov.style.opacity='0';bx.style.transform='translateY(12px) scale(.95)';setTimeout(function(){ov.remove();},220);}
function go(){close();cb();}
function kd(e){if(e.key==='Escape'){e.preventDefault();e.stopPropagation();close();}else if(e.key==='Enter'){e.preventDefault();e.stopPropagation();go();}}
document.addEventListener('keydown',kd,true);bc.addEventListener('click',close);bo.addEventListener('click',go);ov.addEventListener('mousedown',function(e){if(e.target===ov){close();}});
requestAnimationFrame(function(){ov.style.opacity='1';bx.style.transform='none';});bo.focus();}
function payAsk(r,id,go){if(r.pid===id){return;}var c=cOf(r.cid),s=sOf(c,r.sid),p=pOf(s,id);if(p&&paidFull(p,r)){ask('\u041f\u043e\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043d\u0438\u0435','\u0414\u0430\u043d\u043d\u044b\u0439 \u0432\u0438\u0434 \u043e\u043f\u043b\u0430\u0442\u044b \u00ab'+(p.name||'-')+'\u00bb \u0443\u0436\u0435 \u043e\u043f\u043b\u0430\u0447\u0435\u043d \u043f\u043e\u043b\u043d\u043e\u0441\u0442\u044c\u044e.\n\u0412\u0441\u0451 \u0440\u0430\u0432\u043d\u043e \u0434\u043e\u0431\u0430\u0432\u0438\u0442\u044c \u043f\u043b\u0430\u0442\u0451\u0436?','\u0414\u043e\u0431\u0430\u0432\u0438\u0442\u044c',go);}else{go();}}
var GRP={date:'inv',due:'inv',regd:'regn'};
function same(a,b,key){return a!==b&&a[key]&&a[key]===b[key]&&a.contractor===b.contractor;}
function prop(r,k){var key=GRP[k];if(!key){return;}var ch=false;ROWS.forEach(function(z){if(same(r,z,key)&&z[k]!==r[k]){z[k]=r[k];ch=true;}});if(ch){draw();}}
function adopt(r,key){if(!r[key]){return;}var fs=key==='inv'?['date','due']:['regd'];var ch=false;ROWS.forEach(function(z){if(same(r,z,key)){fs.forEach(function(f){if(!r[f]&&z[f]){r[f]=z[f];ch=true;}});}});if(ch){save();draw();}}
function numIn(r,key){var i=inp(r,key,'',false,false);i.addEventListener('change',function(){adopt(r,key);});return i;}
function askText(title,label,cb){var ov=el('div','position:fixed;left:0;top:0;right:0;bottom:0;z-index:100000;background:rgba(31,37,71,.35);display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .2s ease;');
var bx=el('div','width:380px;max-width:90vw;box-sizing:border-box;background:#fff;border:1.5px solid #c9c0f5;border-radius:16px;padding:20px 22px 16px;box-shadow:0 16px 48px rgba(60,50,140,.28);transform:translateY(12px) scale(.95);transition:transform .25s ease;font-family:system-ui,sans-serif;');
bx.appendChild(el('div','font:700 13px system-ui,sans-serif;color:#4b3fb5;margin-bottom:12px;',title));
bx.appendChild(el('div','font:700 9px system-ui,sans-serif;color:#6b6f95;margin-bottom:4px;',label));
var inp=el('input','width:100%;box-sizing:border-box;height:28px;border:1px solid #d9d3f7;border-radius:8px;padding:0 8px;font:11px system-ui,sans-serif;color:#1f2547;outline:none;');inp.type='text';bx.appendChild(inp);
var bar=el('div','display:flex;justify-content:flex-end;gap:8px;margin-top:16px;');
var bc=el('button','height:26px;padding:0 18px;border:0;border-radius:14px;background:#fff;box-shadow:inset 0 0 0 1px #c9c0f5;color:#4b3fb5;font:700 10px system-ui,sans-serif;cursor:pointer;outline:none;','\u041e\u0442\u043c\u0435\u043d\u0430');
var bo=el('button','height:26px;padding:0 18px;border:0;border-radius:14px;background:linear-gradient(135deg,#7a68e0,#5b49c8);color:#fff;font:700 10px system-ui,sans-serif;cursor:pointer;outline:none;','\u0414\u043e\u0431\u0430\u0432\u0438\u0442\u044c');
bar.appendChild(bc);bar.appendChild(bo);bx.appendChild(bar);ov.appendChild(bx);document.body.appendChild(ov);
function close(){document.removeEventListener('keydown',kd,true);ov.style.opacity='0';bx.style.transform='translateY(12px) scale(.95)';setTimeout(function(){ov.remove();},220);}
function go(){var v=inp.value.trim();if(!v){inp.style.borderColor='#e57373';return;}close();cb(v);}
function kd(e){if(e.key==='Escape'){e.preventDefault();e.stopPropagation();close();}else if(e.key==='Enter'){e.preventDefault();e.stopPropagation();go();}}
document.addEventListener('keydown',kd,true);bc.addEventListener('click',close);bo.addEventListener('click',go);ov.addEventListener('mousedown',function(e){if(e.target===ov){close();}});
requestAnimationFrame(function(){ov.style.opacity='1';bx.style.transform='none';});inp.focus();}
function svcFull(s,r){var sm=num(s.sum);if(sm<=0){return false;}var got=0;ROWS.forEach(function(z){if(z!==r&&z.sid===s.id&&z.pdate&&num(z.sum)>0){got+=num(z.sum);}});return got>=sm-0.005;}
function pjCell(r,PJ,dis){var d=el('div',CS+'cursor:'+(dis?'default':'pointer')+';white-space:nowrap;overflow:hidden;text-overflow:ellipsis;',r.proj||L.empty);if(!r.proj){d.style.color='#9aa0bf';}
if(!dis){d.addEventListener('click',function(){closePop();var b=d.getBoundingClientRect();var p=el('div','position:fixed;z-index:99999;background:#fff;border:1px solid #c9c0f5;border-radius:10px;box-shadow:0 6px 20px rgba(60,50,140,.18);padding:4px;max-height:260px;overflow:auto;scrollbar-width:none;left:'+b.left+'px;top:'+(b.bottom+3)+'px;min-width:'+Math.max(120,b.width)+'px;');
function sel(){return r.proj?r.proj.split(', '):[];}
PJ.forEach(function(k){var lb=el('label','display:flex;gap:8px;align-items:center;padding:6px 10px;border-radius:7px;cursor:pointer;font:10px system-ui,sans-serif;color:#1f2547;white-space:nowrap;');var cb=document.createElement('input');cb.type='checkbox';cb.style.cssText='width:auto;height:auto;margin:0;';cb.checked=sel().indexOf(k)>=0;cb.addEventListener('change',function(){var s=sel();var i=s.indexOf(k);if(cb.checked&&i<0){s.push(k);}if(!cb.checked&&i>=0){s.splice(i,1);}r.proj=PJ.filter(function(x){return s.indexOf(x)>=0;}).join(', ');d.textContent=r.proj||L.empty;d.style.color=r.proj?'#1f2547':'#9aa0bf';save();});lb.appendChild(cb);lb.appendChild(el('span','',k));p.appendChild(lb);});
document.body.appendChild(p);POP=p;});}return d;}
function allPj(){var a=[];try{PROJECTS.main.items.concat(PROJECTS.aux.items).forEach(function(it){if(it.code){a.push(it.code);}});}catch(e){}return a;}
function projOf(c,s){if(!c){return [];}var sv=s?[s]:(c.services||[]),o=[];sv.forEach(function(x){if(x.scope==='all'){allPj().forEach(function(k){if(o.indexOf(k)<0){o.push(k);}});}else{(x.scope||[]).forEach(function(k){if(o.indexOf(k)<0){o.push(k);}});}});return o;}
function row(r){var g=el('div','display:grid;grid-template-columns:'+COLS+';align-items:stretch;');
var c=cOf(r.cid);if(c&&r.contractor!==c.contractor){r.contractor=c.contractor;}
var s=sOf(c,r.sid),p=pOf(s,r.pid),m=consOf(r.contractor);
g.appendChild(pickCell(r.contractor,function(){return names().map(function(n){return {t:n,v:n};});},function(v){if(r.contractor===v){return;}r.contractor=v;var q=consOf(v);r.cid=q.length===1?q[0].id:'';r.cur='';r.sid='';r.pid='';save();draw();}));
g.appendChild(pickCell(c?(c.num||'-'):'',function(){return m.map(function(x){return {t:x.num||'-',v:x.id};});},function(v){r.cid=v;r.cur='';r.sid='';r.pid='';save();draw();},!r.contractor));
var PJ=projOf(c,s);if(r.proj&&PJ.length){var kp=r.proj.split(', ').filter(function(x){return PJ.indexOf(x)>=0;}).join(', ');if(kp!==r.proj){r.proj=kp;}}if(!r.proj&&PJ.length===1){r.proj=PJ[0];save();}
g.appendChild(pjCell(r,PJ,!c||!PJ.length));
g.appendChild(pickCell(s?sLab(s):'',function(){return c?(c.services||[]).map(function(x){return {t:sLab(x),v:x.id};}):[];},function(v){var x=sOf(c,v);var go=function(){r.sid=v;r.pid='';r.pname='';save();draw();};if(r.sid!==v&&x&&svcFull(x,r)){ask('\u041f\u043e\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043d\u0438\u0435','\u0423\u0441\u043b\u0443\u0433\u0430 \u00ab'+sLab(x)+'\u00bb \u0443\u0436\u0435 \u043e\u043f\u043b\u0430\u0447\u0435\u043d\u0430 \u043f\u043e\u043b\u043d\u043e\u0441\u0442\u044c\u044e.\n\u0412\u0441\u0451 \u0440\u0430\u0432\u043d\u043e \u0434\u043e\u0431\u0430\u0432\u0438\u0442\u044c \u043f\u043b\u0430\u0442\u0451\u0436?','\u0414\u043e\u0431\u0430\u0432\u0438\u0442\u044c',go);}else{go();}},!c));
var epc=!!(c&&(c.services||[]).some(function(x){return /epc/i.test(x.name||'');}));
if(p&&!r.pname){r.pname=p.name||'';}
if(epc){var ST6=['\u0410\u0432\u0430\u043d\u0441','\u0411\u0430\u0437\u043e\u0432\u043e\u0435 \u043f\u0440\u043e\u0435\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435','\u0414\u0435\u0442\u0430\u043b\u044c\u043d\u043e\u0435 \u043f\u0440\u043e\u0435\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435','\u0418\u0437\u0433\u043e\u0442\u043e\u0432\u043b\u0435\u043d\u0438\u0435','\u041b\u043e\u0433\u0438\u0441\u0442\u0438\u043a\u0430','\u0421\u0442\u0440\u043e\u0438\u0442\u0435\u043b\u044c\u0441\u0442\u0432\u043e','\u041f\u041d\u0420'];g.appendChild(pickCell(r.pname,function(){return ST6.map(function(n){return {t:n,v:n};});},function(v){r.pid='';r.pname=v;save();draw();},!s));}
else{var pi=inp(r,'pname','',false,false);if(!s){pi.disabled=true;}pi.addEventListener('input',function(){r.pid='';});g.appendChild(wrap(pi));}
g.appendChild(wrap(numIn(r,'inv')));
g.appendChild(dcell(r,'date'));g.appendChild(dcell(r,'due'));
g.appendChild(wrap(numIn(r,'regn')));g.appendChild(dcell(r,'regd'));g.appendChild(dcell(r,'pdate'));
var eq=el('div',CS+'justify-content:flex-end;font-weight:700;color:#1e7a43;');
function upd(){var v=eqv(r);eq.textContent=v?fm(v)+' $':'';tot();}
var sw=el('div','display:flex;align-items:center;min-width:0;'+BD);sw.appendChild(inp(r,'sum','0',true,true,upd));var cl=el('span','font:700 9px system-ui,sans-serif;color:#4b3fb5;padding:0 6px;cursor:pointer;',curOf(r)||'\u2014');cl.addEventListener('click',function(){openPop(cl,['USD','EUR','UZS','RUB'].map(function(x){return {t:x,v:x};}),function(v){r.cur=v;save();draw();},70);});sw.appendChild(cl);g.appendChild(sw);
if(isUsd({cur:curOf(r)})){g.appendChild(el('div',CS+'justify-content:flex-end;color:#9aa0bf;','1'));}else{g.appendChild(wrap(inp(r,'rate','',true,true,upd)));}
g.appendChild(eq);upd();
g.addEventListener('contextmenu',function(e){menu(e,r);});
return g;}
function draw(){closePop();SC.innerHTML='';
var h=el('div','display:grid;grid-template-columns:'+COLS+';position:sticky;top:0;z-index:5;background:#eceefb;');
L.hd.forEach(function(t,i){h.appendChild(el('div','font:700 9px system-ui,sans-serif;color:#4b3fb5;padding:7px 6px;'+BD+'white-space:nowrap;overflow:hidden;text-overflow:ellipsis;'+(i===6||i===7||i===9||i===10||i===11||i===12||i===13?'text-align:right;':''),t));});
SC.appendChild(h);
var box=el('div','');
ROWS.forEach(function(r){box.appendChild(row(r));});SC.appendChild(box);
MSG=el('span','position:fixed;right:14px;bottom:8px;font:10px system-ui,sans-serif;color:#c0392b;','');SC.appendChild(MSG);}
function mk(){return {id:uid(),contractor:'',cid:'',sid:'',pid:'',inv:'',date:'',due:'',regn:'',regd:'',pdate:'',sum:'',rate:''};}
function RO(){var a=window.UPMO_ACL;return !(a&&a.ready&&a.edit);}
function lockRO(box,blockSel){['click','dblclick','contextmenu','keydown','beforeinput','paste','cut','drop'].forEach(function(t){box.addEventListener(t,function(e){if(!RO()){return;}var tg=e.target;if(t==='click'||t==='dblclick'){if(blockSel&&!(tg.closest&&tg.closest(blockSel))){return;}}else if(t==='keydown'){if(e.ctrlKey||e.metaKey||e.altKey){if(e.key!=='Enter'){return;}}else if(!(e.key.length===1||e.key==='Backspace'||e.key==='Delete'||e.key==='Enter')){return;}}e.stopPropagation();e.preventDefault();},true);});}
function addRow(at){if(!OK||RO()){return;}var n=mk();if(at==null){ROWS.push(n);}else{ROWS.splice(at+1,0,n);}save();draw();if(at==null){SC.scrollTop=SC.scrollHeight;}}
function dupRow(r){var i=ROWS.indexOf(r);var n=JSON.parse(JSON.stringify(r));n.id=uid();ROWS.splice(i+1,0,n);save();draw();}
function delRow(r){if(RO()){return;}ask('\u0423\u0434\u0430\u043b\u0435\u043d\u0438\u0435',L.dd,'\u0423\u0434\u0430\u043b\u0438\u0442\u044c',function(){ROWS=ROWS.filter(function(z){return z!==r;});save();draw();});}
function menu(e,r){e.preventDefault();e.stopPropagation();closePop();
var p=el('div','position:fixed;z-index:99999;background:#fff;border:1px solid #c9c0f5;border-radius:10px;box-shadow:0 6px 20px rgba(60,50,140,.18);padding:4px;left:'+e.clientX+'px;top:'+e.clientY+'px;min-width:190px;');
var items=r?[['\u0414\u043e\u0431\u0430\u0432\u0438\u0442\u044c \u0441\u0442\u0440\u043e\u043a\u0443 \u043d\u0438\u0436\u0435',function(){addRow(ROWS.indexOf(r));}],['\u0414\u0443\u0431\u043b\u0438\u0440\u043e\u0432\u0430\u0442\u044c \u0441\u0442\u0440\u043e\u043a\u0443',function(){dupRow(r);}],['\u0423\u0434\u0430\u043b\u0438\u0442\u044c \u0441\u0442\u0440\u043e\u043a\u0443',function(){delRow(r);},1]]:[['\u0414\u043e\u0431\u0430\u0432\u0438\u0442\u044c \u043f\u043b\u0430\u0442\u0451\u0436',function(){addRow();}]];
items.forEach(function(it){var d=el('div','font:10px system-ui,sans-serif;color:'+(it[2]?'#c0392b':'#1f2547')+';padding:6px 10px;border-radius:7px;cursor:pointer;white-space:nowrap;',it[0]);
d.addEventListener('mouseenter',function(){d.style.background='#eef1fa';});d.addEventListener('mouseleave',function(){d.style.background='';});
d.addEventListener('click',function(){closePop();it[1]();});p.appendChild(d);});
document.body.appendChild(p);POP=p;}
document.addEventListener('keydown',function(e){if((e.ctrlKey||e.metaKey)&&e.key==='Enter'&&SC&&SC.isConnected&&SC.offsetParent!==null&&OK){e.preventDefault();addRow();}});
window.upmoReg=function(pg){
if(window.UPMO_ACL&&window.UPMO_ACL.ready&&!window.UPMO_ACL.view){var nb=document.createElement('div');nb.style.cssText='padding:20px;font:12px system-ui,sans-serif;color:#6b6f95;';nb.textContent='\u041d\u0435\u0442 \u0434\u043e\u0441\u0442\u0443\u043f\u0430';pg.appendChild(nb);return;}

pg.style.cssText+='display:flex;flex-direction:column;';
SC=el('div','flex:1;min-height:0;overflow:auto;padding:0;box-sizing:border-box;background:#f7f7fd;');pg.appendChild(SC);SC.addEventListener('contextmenu',function(e){menu(e,null);});lockRO(SC,null);
SC.appendChild(el('div','font:11px system-ui,sans-serif;color:#9aa0bf;padding:10px;',L.ld));
var j=function(u){return fetch(u,{credentials:'same-origin'}).then(function(r){return r.json();});};
Promise.all([j('/api/con3'),j('/api/reg')]).then(function(a){
CON=Array.isArray(a[0])?a[0]:[];ROWS=Array.isArray(a[1])?a[1]:[];
ROWS.forEach(function(r){r.id=r.id||uid();if(!r.inv&&r.ref){r.inv=r.ref;}['contractor','cid','sid','pid','inv','date','due','regn','regd','pdate','sum','rate','proj'].forEach(function(k){if(r[k]==null){r[k]='';}});});
OK=true;draw();}).catch(function(){SC.innerHTML='';SC.appendChild(el('div','font:11px system-ui,sans-serif;color:#c0392b;padding:10px;',L.err));});
};
})();