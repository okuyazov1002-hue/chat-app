(function(){
var L={act:'\u0414\u0435\u0439\u0441\u0442\u0432\u0443\u0435\u0442',done:'\u0417\u0430\u0432\u0435\u0440\u0448\u0451\u043d',hold:'\u041f\u0440\u0438\u043e\u0441\u0442\u0430\u043d\u043e\u0432\u043b\u0435\u043d',kC:'\u041a\u043e\u043d\u0442\u0440\u0430\u043a\u0442',kA:'\u0414\u043e\u043f. \u0441\u043e\u0433\u043b\u0430\u0448\u0435\u043d\u0438\u0435',allp:'\u0412\u0441\u0435 \u043f\u0440\u043e\u0435\u043a\u0442\u044b',addSvc:'\u0414\u043e\u0431\u0430\u0432\u0438\u0442\u044c \u0443\u0441\u043b\u0443\u0433\u0443',addAdn:'\u0414\u043e\u0431\u0430\u0432\u0438\u0442\u044c \u0434\u043e\u043f. \u0441\u043e\u0433\u043b\u0430\u0448\u0435\u043d\u0438\u0435',addPay:'\u0414\u043e\u0431\u0430\u0432\u0438\u0442\u044c \u0432\u0438\u0434 \u043e\u043f\u043b\u0430\u0442\u044b',addCon:'\u0414\u043e\u0431\u0430\u0432\u0438\u0442\u044c \u043a\u043e\u043d\u0442\u0440\u0430\u043a\u0442',delCon:'\u0423\u0434\u0430\u043b\u0438\u0442\u044c \u043a\u043e\u043d\u0442\u0440\u0430\u043a\u0442',delSvc:'\u0423\u0434\u0430\u043b\u0438\u0442\u044c \u0443\u0441\u043b\u0443\u0433\u0443',delPay:'\u0423\u0434\u0430\u043b\u0438\u0442\u044c \u0432\u0438\u0434 \u043e\u043f\u043b\u0430\u0442\u044b',del:'\u0423\u0434\u0430\u043b\u0438\u0442\u044c?',delAll:'\u0423\u0434\u0430\u043b\u0438\u0442\u044c \u0432\u043c\u0435\u0441\u0442\u0435 \u0441\u043e \u0432\u0441\u0435\u043c \u0432\u043d\u0443\u0442\u0440\u0438?',svc:'\u0423\u0441\u043b\u0443\u0433\u0430',pay:'\u0412\u0438\u0434 \u043e\u043f\u043b\u0430\u0442\u044b',numPh:'\u2116 \u043a\u043e\u043d\u0442\u0440\u0430\u043a\u0442\u0430',contr:'\u041f\u043e\u0434\u0440\u044f\u0434\u0447\u0438\u043a',addNum:'\u2116 \u0434\u043e\u043f.',err:'\u041e\u0448\u0438\u0431\u043a\u0430'};
var HD=['','\u0421\u0442\u0430\u0442\u0443\u0441','\u041e\u0445\u0432\u0430\u0442','\u0412\u0430\u043b.','\u0421\u0443\u043c\u043c\u0430','\u041e\u043f\u043b\u0430\u0447\u0435\u043d\u043e','\u041e\u0441\u0442\u0430\u0442\u043e\u043a','\u041f\u043e\u0434\u043f\u0438\u0441\u0430\u043d'];
var ST=[L.act,L.done,L.hold],CU=['USD','EUR','UZS','RUB'],KD=[L.kC,L.kA];
var SUGS=['\u0422\u042d\u041e','ESHIA','\u0421\u0442\u0440\u043e\u0438\u0442\u0435\u043b\u044c\u0441\u0442\u0432\u043e','\u0411\u0430\u0437\u043e\u0432\u043e\u0435 \u043f\u0440\u043e\u0435\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435','\u0414\u0435\u0442\u0430\u043b\u044c\u043d\u043e\u0435 \u043f\u0440\u043e\u0435\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435'],SUGP=['\u0410\u0432\u0430\u043d\u0441 1 \u044d\u0442\u0430\u043f','\u0410\u0432\u0430\u043d\u0441 2 \u044d\u0442\u0430\u043f','\u041b\u041e\u0422 \u21161','\u041b\u041e\u0422 \u21162','\u041b\u041e\u0422 \u21163'];
var ROWS=[],OK=false,SC=null,MSG=null,POP=null,UP=[];
var FLD='width:100%;min-width:0;box-sizing:border-box;border:1px solid #d9d3f7;border-radius:8px;background:#fff;font:10px system-ui,sans-serif;color:#1f2547;padding:0 6px;height:20px;min-height:0;margin:0;display:block;outline:none;';
var GRID='display:grid;grid-template-columns:2.7fr 1fr 1.1fr .6fr 1.2fr 1.1fr 1.1fr 1fr;align-items:center;column-gap:8px;';
var BTN='flex:none;width:110px;height:22px;min-height:0;box-sizing:border-box;border:0;border-radius:14px;background:#fff;box-shadow:inset 0 0 0 1px #c9c0f5;color:#4b3fb5;font:700 9px/1 system-ui,sans-serif;cursor:pointer;padding:0 0 2px;margin:0;outline:none;transition:background .3s ease,color .3s ease,box-shadow .3s ease;';
function el(t,c,x){var e=document.createElement(t);if(c){e.style.cssText=c;}if(x!=null){e.textContent=x;}return e;}
function uid(){return 'k'+Date.now().toString(36)+Math.random().toString(36).slice(2,6);}
function num(v){var n=parseFloat(String(v==null?'':v).replace(/\s/g,'').replace(',','.'));return isNaN(n)?0:n;}
function fm(n){var s=(Math.round(n*100)/100).toFixed(2);if(/\.00$/.test(s)){s=s.slice(0,-3);}var p=s.split('.');p[0]=p[0].replace(/\B(?=(\d{3})+(?!\d))/g,' ');return p.join('.');}
function fmtS(v){v=String(v==null?'':v).replace(/[^0-9.,]/g,'').replace(',','.');var p=v.split('.');var a=p[0].replace(/\B(?=(\d{3})+(?!\d))/g,' ');return p.length>1?a+'.'+p.slice(1).join('').slice(0,2):a;}
function dmy(v){var m=/^(\d{4})-(\d{2})-(\d{2})$/.exec(v||'');return m?m[3]+'.'+m[2]+'.'+m[1]:'';}
function projs(){var a=[];try{PROJECTS.main.items.concat(PROJECTS.aux.items).forEach(function(it){a.push({c:it.code,n:it.name});});}catch(e){}return a;}
function save(){if(!OK){return;}clearTimeout(save.t);save.t=setTimeout(function(){fetch('/api/con3/save',{method:'POST',headers:{'Content-Type':'application/json'},credentials:'same-origin',body:JSON.stringify({rows:ROWS})}).catch(function(){if(MSG){MSG.textContent=L.err;}});},500);}
function sv(s,key){return s.pays.length?s.pays.reduce(function(t,p){return t+num(p[key]);},0):num(s[key]);}
function cs(c,key){return c.services.reduce(function(t,s){return t+sv(s,key);},0);}
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
function txt(o,key,ph,css,list){var i=el('input',FLD+(css||''));i.type='text';i.placeholder=ph||'';i.value=o[key]||'';if(list){i.setAttribute('list',list);}i.addEventListener('input',function(){o[key]=i.value;save();});return i;}
function sumInp(o,key){var i=el('input',FLD+'text-align:right;font-weight:500;');i.type='text';i.inputMode='decimal';i.value=fmtS(o[key]);i.addEventListener('input',function(){var pos=i.selectionStart,before=i.value.slice(0,pos).replace(/[^0-9.,]/g,'').length;var f=fmtS(i.value);i.value=f;var n=0,k=0;while(k<f.length&&n<before){if(/[0-9.]/.test(f[k])){n++;}k++;}i.setSelectionRange(k,k);o[key]=f.replace(/ /g,'');save();refresh();});return i;}
function calc(fn,b){var s=el('div','text-align:right;font:'+(b?'700':'500')+' 10px system-ui,sans-serif;color:#1f2547;padding:0 4px;white-space:nowrap;');function u(){s.textContent=fm(fn());}u();UP.push(u);return s;}
function pick(o,key,opts,cb){var c=el('div','display:flex;align-items:center;height:22px;padding:0 4px;font:10px system-ui,sans-serif;color:#1f2547;cursor:pointer;white-space:nowrap;',o[key]||opts[0]);c.addEventListener('click',function(){openPop(c,function(p){opts.forEach(function(x){item(p,x,function(){o[key]=x;c.textContent=x;save();closePop();if(cb){cb();}},x===(o[key]||opts[0]));});},130);});return c;}
function stCell(o){var w=el('div','');var b=el('span','display:inline-block;height:20px;line-height:20px;padding:0 12px;border-radius:10px;font:10px system-ui,sans-serif;cursor:pointer;border:.5px solid #c9c0f5;white-space:nowrap;','');function sy(){var v=o.status||ST[0];b.textContent=v;b.style.background=v===ST[1]?'#c9f0d6':(v===ST[0]?'#fde9a8':'#fff');b.style.color=v===ST[1]?'#1e7a43':(v===ST[0]?'#7a5a00':'#666');b.style.borderWidth='1px';b.style.display='inline-flex';b.style.alignItems='center';b.style.lineHeight='1';b.style.paddingTop='1px';b.style.borderColor=v===ST[1]?'#7fd09c':(v===ST[0]?'#f0cf6a':'#cfd3e0');b.style.fontWeight='700';b.style.fontSize='9px';}sy();b.addEventListener('click',function(e){e.stopPropagation();openPop(b,function(p){ST.forEach(function(x){item(p,x,function(){o.status=x;sy();save();closePop();},x===(o.status||ST[0]));});},150);});w.appendChild(b);return w;}
function dateCell(o,key){var c=el('div','display:flex;align-items:center;height:22px;padding:0 4px;font:10px system-ui,sans-serif;color:#1f2547;cursor:pointer;white-space:nowrap;',dmy(o[key]));c.addEventListener('click',function(){if(window.upmoPcal){window.upmoPcal(c,o[key]||'',function(v){o[key]=v;c.textContent=dmy(v);save();});}});return c;}
function scopeCell(s){var cell=el('div','display:flex;align-items:center;height:22px;padding:0 4px;font:10px system-ui,sans-serif;color:#4b3fb5;cursor:pointer;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;','');function t(){cell.textContent=s.scope==='all'?L.allp:((s.scope||[]).join(', ')||'\u2014');}t();
cell.addEventListener('click',function(){openPop(cell,function(p){
function row(lbl,on,fn){var lb=el('label','display:flex;gap:8px;align-items:center;padding:4px 6px;white-space:nowrap;font:10px system-ui,sans-serif;color:#1f2547;cursor:pointer;');var cb=document.createElement('input');cb.type='checkbox';cb.checked=on;cb.style.cssText='width:auto;height:auto;margin:0;';cb.addEventListener('change',function(){fn(cb.checked);});lb.appendChild(cb);lb.appendChild(el('span','',lbl));p.appendChild(lb);return cb;}
var allCb=row(L.allp,s.scope==='all',function(on){s.scope=on?'all':[];t();save();closePop();});
projs().forEach(function(pr){row(pr.c,s.scope!=='all'&&(s.scope||[]).indexOf(pr.c)>=0,function(on){if(s.scope==='all'){s.scope=[];}var i=s.scope.indexOf(pr.c);if(on&&i<0){s.scope.push(pr.c);}if(!on&&i>=0){s.scope.splice(i,1);}allCb.checked=false;t();save();});});
},200);});return cell;}
function chev(o){return document.createTextNode('');}function chevOld(o){var s=el('span','cursor:pointer;color:#5b49c8;font-size:11px;width:12px;flex:none;user-select:none;',o.open?'\u25be':'\u25b8');s.addEventListener('click',function(){o.open=!o.open;save();draw();});return s;}
function rw(bg,ml,h){return el('div',GRID+'height:'+(h||24)+'px;padding:0 10px;border-radius:8px;margin-bottom:2px;background:'+bg+';margin-left:'+(ml||0)+'px;');}
function closeCx(){var m=document.getElementById('conCtx3');if(m){m.remove();}document.removeEventListener('mousedown',outCx,true);}
function outCx(e){var m=document.getElementById('conCtx3');if(m&&!m.contains(e.target)){closeCx();}}
var ANIM=null;
function rowTog(e,r,o){var t=e.target;while(t&&t!==r){if(t.tagName==='INPUT'||t.style.cursor==='pointer'){return;}t=t.parentNode;}
if(o.open){var rs=r.parentNode.querySelectorAll('[data-anc~="'+o.id+'"]');if(!rs.length){o.open=false;save();draw();return;}
rs.forEach(function(x){x.style.overflow='hidden';x.style.transition='height .22s ease,opacity .22s ease,margin .22s ease';x.style.height='0px';x.style.opacity='0';x.style.marginBottom='0px';});
setTimeout(function(){o.open=false;save();draw();},230);}
else{o.open=true;ANIM={ci:Array.prototype.indexOf.call(SC.children,r.parentNode),id:o.id};save();draw();}}
function conDlgOld(){
if(document.getElementById('c3dlg')){return;}
var ov=el('div','position:fixed;left:0;top:0;right:0;bottom:0;z-index:99990;background:rgba(40,30,90,.28);display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .2s ease;');ov.id='c3dlg';
var bx=el('div','width:340px;max-width:92vw;box-sizing:border-box;background:#fff;border-radius:16px;box-shadow:0 12px 40px rgba(60,50,140,.3);padding:18px 20px 16px;transform:translateY(10px) scale(.97);transition:transform .2s ease;');
var d={num:'',contractor:'',signed:''};
bx.appendChild(el('div','font:700 12px system-ui,sans-serif;color:#4b3fb5;margin-bottom:12px;',L.addCon));
function fld(lbl,node){var w=el('div','margin-bottom:10px;');w.appendChild(el('div','font:700 9px system-ui,sans-serif;color:#6b6f95;margin-bottom:4px;',lbl));w.appendChild(node);bx.appendChild(w);}
var i1=txt(d,'num','','height:26px;');var i2=txt(d,'contractor','','height:26px;');
var dc=el('div','display:flex;align-items:center;height:26px;padding:0 8px;box-sizing:border-box;border:1px solid #d9d3f7;border-radius:8px;font:10px system-ui,sans-serif;cursor:pointer;color:#1f2547;','');
dc.addEventListener('click',function(){if(window.upmoPcal){window.upmoPcal(dc,d.signed||'',function(v){d.signed=v;dc.textContent=dmy(v);});}});
fld(L.numPh,i1);fld(L.contr,i2);fld('\u0414\u0430\u0442\u0430 \u043f\u043e\u0434\u043f\u0438\u0441\u0430\u043d\u0438\u044f',dc);
var br=el('div','display:flex;justify-content:flex-end;gap:8px;margin-top:6px;');
var bc=el('button',BTN+'width:90px;','\u041e\u0442\u043c\u0435\u043d\u0430');var bo=el('button',BTN+'width:90px;background:linear-gradient(135deg,#7a68e0,#5b49c8);color:#fff;box-shadow:none;','\u0421\u043e\u0437\u0434\u0430\u0442\u044c');
function close(){ov.style.opacity='0';bx.style.transform='translateY(10px) scale(.97)';setTimeout(function(){ov.remove();},200);document.removeEventListener('keydown',kd,true);}
function ok(){if(!d.num.trim()&&!d.contractor.trim()){i1.style.borderColor='#e57373';i2.style.borderColor='#e57373';return;}var c=newCon();c.num=d.num.trim();c.contractor=d.contractor.trim();c.signed=d.signed;ROWS.push(c);save();close();draw();}
function kd(e){if(document.getElementById('dpop')){return;}if(e.key==='Escape'){close();}else if(e.key==='Enter'){ok();}}
bc.addEventListener('click',close);bo.addEventListener('click',ok);
ov.addEventListener('mousedown',function(e){if(e.target===ov){close();}});
br.appendChild(bc);br.appendChild(bo);bx.appendChild(br);ov.appendChild(bx);document.body.appendChild(ov);
document.addEventListener('keydown',kd,true);
setTimeout(function(){ov.style.opacity='1';bx.style.transform='none';i1.focus();},20);
}
function roW(x){x.style.pointerEvents='none';return x;}
function conDlg(ec){
if(document.getElementById('c3dlg')){return;}
var ov=el('div','position:fixed;left:0;top:0;right:0;bottom:0;z-index:99990;background:rgba(40,30,90,.28);display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .2s ease;');ov.id='c3dlg';
var bx=el('div','width:340px;max-width:92vw;box-sizing:border-box;background:#fff;border-radius:16px;box-shadow:0 12px 40px rgba(60,50,140,.3);padding:18px 20px 16px;transform:translateY(10px) scale(.97);transition:transform .2s ease;');
var d=ec?{num:ec.num,contractor:ec.contractor,signed:ec.signed,status:ec.status||ST[0],cur:ec.cur||'USD'}:{num:'',contractor:'',signed:'',status:ST[0],cur:'USD'};
bx.appendChild(el('div','font:700 12px system-ui,sans-serif;color:#4b3fb5;margin-bottom:12px;',ec?'\u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u0442\u044c':L.addCon));
function fld(lbl,node){var w=el('div','margin-bottom:10px;');w.appendChild(el('div','font:700 9px system-ui,sans-serif;color:#6b6f95;margin-bottom:4px;',lbl));w.appendChild(node);bx.appendChild(w);}
function box(n){var b=el('div','border:1px solid #d9d3f7;border-radius:8px;height:26px;box-sizing:border-box;display:flex;align-items:center;padding:0 4px;');b.appendChild(n);return b;}
var i1=txt(d,'num','','height:26px;');var i2=txt(d,'contractor','','height:26px;');
i1.value=d.num||'';i2.value=d.contractor||'';
var dc=el('div','display:flex;align-items:center;height:26px;padding:0 8px;box-sizing:border-box;border:1px solid #d9d3f7;border-radius:8px;font:10px system-ui,sans-serif;cursor:pointer;color:#1f2547;caret-color:transparent;user-select:none;outline:none;',dmy(d.signed));
dc.addEventListener('click',function(){if(window.upmoPcal){window.upmoPcal(dc,d.signed||'',function(v){d.signed=v;dc.textContent=dmy(v);});}});
fld(L.numPh,i1);fld(L.contr,i2);fld('\u0414\u0430\u0442\u0430 \u043f\u043e\u0434\u043f\u0438\u0441\u0430\u043d\u0438\u044f',dc);fld('\u0412\u0430\u043b\u044e\u0442\u0430',box((function(){var s=el('select','width:100%;height:24px;border:0;background:transparent;font:10px system-ui,sans-serif;color:#1f2547;outline:none;cursor:pointer;');CU.forEach(function(x){var o=document.createElement('option');o.value=x;o.textContent=x;if(x===d.cur){o.selected=true;}s.appendChild(o);});s.addEventListener('change',function(){d.cur=s.value;});return s;})()));
var br=el('div','display:flex;justify-content:flex-end;gap:8px;margin-top:6px;');
var bc=el('button',BTN+'width:90px;','\u041e\u0442\u043c\u0435\u043d\u0430');var bo=el('button',BTN+'width:90px;background:linear-gradient(135deg,#7a68e0,#5b49c8);color:#fff;box-shadow:none;',ec?'\u0421\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c':'\u0421\u043e\u0437\u0434\u0430\u0442\u044c');
function close(){ov.style.opacity='0';bx.style.transform='translateY(10px) scale(.97)';setTimeout(function(){ov.remove();},200);document.removeEventListener('keydown',kd,true);}
function ok(){if(!d.num.trim()&&!d.contractor.trim()){i1.style.borderColor='#e57373';i2.style.borderColor='#e57373';return;}
if(ec){if(!confirm('\u0421\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c \u0438\u0437\u043c\u0435\u043d\u0435\u043d\u0438\u044f?')){return;}ec.num=d.num.trim();ec.contractor=d.contractor.trim();ec.signed=d.signed;ec.status=d.status;ec.cur=d.cur;save();close();draw();return;}
var c=newCon();c.num=d.num.trim();c.contractor=d.contractor.trim();c.signed=d.signed;c.status=d.status;c.cur=d.cur;ROWS.push(c);save();close();draw();}
function kd(e){if(document.getElementById('dpop')||POP){return;}if(e.key==='Escape'){close();}else if(e.key==='Enter'){ok();}}
bc.addEventListener('click',close);bo.addEventListener('click',ok);
ov.addEventListener('mousedown',function(e){if(e.target===ov){close();}});
br.appendChild(bc);br.appendChild(bo);bx.appendChild(br);ov.appendChild(bx);document.body.appendChild(ov);
document.addEventListener('keydown',kd,true);
setTimeout(function(){ov.style.opacity='1';bx.style.transform='none';i1.focus();},20);
}
function newCon(){return {id:uid(),num:'',contractor:'',status:ST[0],cur:'USD',signed:'',open:true,services:[]};}
function newSvc(kind){return {id:uid(),kind:kind||L.kC,name:'',num:'',signed:'',scope:'all',sum:'',paid:'',open:true,pays:[]};}
function newPay(){return {id:uid(),name:'',sum:'',paid:''};}
function ctx(e,type,c,s,p){
e.preventDefault();e.stopPropagation();closePop();closeCx();
var m=el('div','position:fixed;z-index:99999;left:'+e.clientX+'px;top:'+e.clientY+'px;background:#fff;border-radius:10px;box-shadow:0 8px 28px rgba(60,50,140,.25);padding:4px;opacity:0;transition:opacity .15s ease;');m.id='conCtx3';
function it(t,fn,red){var d=el('div','padding:5px 14px;white-space:nowrap;font:10px system-ui,sans-serif;border-radius:6px;cursor:pointer;color:'+(red?'#c0392b':'#1f2547')+';',t);d.addEventListener('mouseenter',function(){d.style.background='#f1efff';});d.addEventListener('mouseleave',function(){d.style.background='';});d.addEventListener('click',function(){closeCx();fn();});m.appendChild(d);}
function sep(){m.appendChild(el('div','border-top:1px solid #eeeefa;margin:3px 0;'));}
function after(){if(c){c.open=true;}if(s){s.open=true;}save();draw();}
function addCon(){if(!OK){return;}conDlg();}
if(type==='c'){
it('\u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u0442\u044c',function(){conDlg(c);});sep();it(L.addSvc,function(){c.services.push(newSvc(L.kC));after();});
it(L.addAdn,function(){c.services.push(newSvc(L.kA));after();});
sep();it(L.addCon,addCon);
it(L.delCon,function(){if(confirm(L.delAll)){ROWS.splice(ROWS.indexOf(c),1);save();draw();}},true);
}else if(type==='s'){
it('\u041f\u0435\u0440\u0435\u0438\u043c\u0435\u043d\u043e\u0432\u0430\u0442\u044c',function(){var v=prompt('\u0423\u0441\u043b\u0443\u0433\u0430',s.name||'');if(v!==null){s.name=v.trim();save();draw();}});it(L.addPay,function(){s.pays.push(newPay());after();});
it(L.addSvc,function(){c.services.splice(c.services.indexOf(s)+1,0,newSvc(L.kC));after();});
it(L.addAdn,function(){c.services.splice(c.services.indexOf(s)+1,0,newSvc(L.kA));after();});
sep();it(L.delSvc,function(){if(confirm(L.del)){c.services.splice(c.services.indexOf(s),1);save();draw();}},true);
}else if(type==='p'){
it(L.addPay,function(){s.pays.splice(s.pays.indexOf(p)+1,0,newPay());after();});
it(L.delPay,function(){if(confirm(L.del)){s.pays.splice(s.pays.indexOf(p),1);save();draw();}},true);
}else{it(L.addCon,addCon);}
document.body.appendChild(m);
var h=m.offsetHeight;if(e.clientY+h>window.innerHeight){m.style.top=Math.max(8,window.innerHeight-h-8)+'px';}
requestAnimationFrame(function(){m.style.opacity='1';});
setTimeout(function(){document.addEventListener('mousedown',outCx,true);},0);
}
var COLS='280px 190px 150px 130px 190px 50px 120px 110px 110px 90px';
var BAND='#e1e6f4',WH='#fff',SH='box-shadow:inset 0 -1px 0 #eeeefa;';
function cellD(ch,col,row,span,bg,css){
var d=el('div','grid-column:'+col+';grid-row:'+row+(span>1?' / span '+span:'')+';display:flex;align-items:center;min-width:0;min-height:26px;box-sizing:border-box;padding:0 6px;'+(bg?'background:'+bg+';':'')+(css||''));
if(ch){ch.style.flex='1';ch.style.minWidth='0';d.appendChild(ch);}
return d;
}
function rowTog2(e,cell,o){
var t=e.target;while(t&&t!==cell){if(t.tagName==='INPUT'||t.style.cursor==='pointer'){return;}t=t.parentNode;}
var cd=cell.parentNode;
if(o.open){var rs=cd.querySelectorAll('[data-anc~="'+o.id+'"]');if(!rs.length){o.open=false;save();draw();return;}
rs.forEach(function(x){x.style.transition='opacity .2s ease,transform .2s ease';x.style.opacity='0';x.style.transform='translateY(-6px)';});
setTimeout(function(){o.open=false;save();draw();},210);}
else{o.open=true;ANIM={ci:Array.prototype.indexOf.call(SC.children,cd),id:o.id};save();draw();}
}
function rowTog3(e,cell,o,c){
var t=e.target;while(t&&t!==cell){if(t.tagName==='INPUT'||t.style.cursor==='pointer'){return;}t=t.parentNode;}
var cd=cell.parentNode,ci=Array.prototype.indexOf.call(SC.children,cd),h0=cd.offsetHeight;
var old={};cd.querySelectorAll('[data-k]').forEach(function(x){old[x.getAttribute('data-k')]=x.offsetHeight;});
if(o.open){var rs=cd.querySelectorAll('[data-anc~="'+o.id+'"]');if(!rs.length){o.open=false;save();draw();return;}
o.open=false;var tmp=card(c);tmp.style.cssText+='position:absolute;visibility:hidden;left:0;top:0;width:'+cd.offsetWidth+'px;';SC.appendChild(tmp);var h2=tmp.offsetHeight;var nh={};tmp.querySelectorAll('[data-k]').forEach(function(x){nh[x.getAttribute('data-k')]=x.offsetHeight;});tmp.remove();o.open=true;
rs.forEach(function(x){x.style.transition='opacity .22s ease,transform .22s ease';x.style.opacity='0';x.style.transform='translateY(-6px)';});
cd.querySelectorAll('[data-k]').forEach(function(x){var k=x.getAttribute('data-k');if(nh[k]!=null&&x.firstChild){var dl=(nh[k]-old[k])/2;x.firstChild.style.transition='transform .26s ease';x.firstChild.style.transform='translateY('+dl+'px)';}});
cd.style.height=h0+'px';cd.offsetHeight;cd.style.transition='height .26s ease';cd.style.height=h2+'px';
setTimeout(function(){o.open=false;save();draw();},270);}
else{o.open=true;ANIM={ci:ci,id:o.id};save();draw();var nd=SC.children[ci];if(nd){var h3=nd.offsetHeight;
nd.querySelectorAll('[data-k]').forEach(function(x){var k=x.getAttribute('data-k');if(old[k]!=null&&x.firstChild){var dl=(old[k]-x.offsetHeight)/2;if(Math.abs(dl)>0.5){var ch=x.firstChild;ch.style.transform='translateY('+dl+'px)';ch.offsetHeight;ch.style.transition='transform .26s ease';ch.style.transform='none';}}});
nd.style.height=h0+'px';nd.offsetHeight;nd.style.transition='height .26s ease';nd.style.height=h3+'px';setTimeout(function(){nd.style.transition='';nd.style.height='';},270);}}
}
function hook(d,o,type,c,s,p,anc){
if(anc){d.setAttribute('data-anc',anc);}
var gc=d.style.gridColumn;if(gc==='1'&&type==='c'){d.setAttribute('data-k',c.id);}else if(gc==='2'&&type==='s'){d.setAttribute('data-k',s.id);}
if(o){d.addEventListener('click',function(e){rowTog3(e,d,o,c);});}
d.addEventListener('contextmenu',function(e){ctx(e,type,c,s,p);});
d.style.userSelect='none';
return d;
}
function fx2(w){w.style.display='flex';w.style.alignItems='center';return w;}
var PSL=['\u041e\u0436\u0438\u0434\u0430\u0435\u0442\u0441\u044f \u0441\u0447\u0451\u0442','\u041e\u0436\u0438\u0434\u0430\u0435\u0442\u0441\u044f \u0440\u0435\u0435\u0441\u0442\u0440','\u041e\u0436\u0438\u0434\u0430\u0435\u0442\u0441\u044f \u043e\u043f\u043b\u0430\u0442\u0430','\u041e\u043f\u043b\u0430\u0447\u0435\u043d\u043e \u0447\u0430\u0441\u0442\u0438\u0447\u043d\u043e','\u041e\u043f\u043b\u0430\u0447\u0435\u043d\u043e'];
var PSC=[['#e8ecf8','#4b5a8a','#c3cbe6'],['#ece6fb','#5b49c8','#cfc4f3'],['#fde9a8','#7a5a00','#f0cf6a'],['#ffe0c2','#8a4b00','#f3be8c'],['#c9f0d6','#1e7a43','#7fd09c']];
function stIdx(p){var g=REG[p.id];if(!g){return 0;}var pd=g.sum,sm=num(p.sum);if(sm>0&&pd>=sm-0.005){return 4;}if(pd>0){return 3;}if(g.reg){return 2;}if(g.inv){return 1;}return 0;}
function psCell(o){var w=el('div','display:flex;align-items:center;');var b=el('span','display:inline-flex;align-items:center;width:116px;justify-content:center;height:20px;box-sizing:border-box;line-height:1;padding:1px 0 0;border-radius:10px;font:700 9px system-ui,sans-serif;border:1px solid;white-space:nowrap;');var i=stIdx(o),c=PSC[i];b.textContent=PSL[i];b.style.background=c[0];b.style.color=c[1];b.style.borderColor=c[2];w.appendChild(b);return w;}
var REG={};
function syncReg(){var ch=false;ROWS.forEach(function(c){(c.services||[]).forEach(function(s){(s.pays||[]).forEach(function(p){var g=REG[p.id];if(g&&g.sum>0){var v=String(Math.round(g.sum*100)/100);if(p.paid!==v||p.paidDate!==g.last||!p.paidReg){p.paid=v;p.paidDate=g.last;p.paidReg=1;ch=true;}}else if(p.paidReg){p.paid='';p.paidDate='';delete p.paidReg;ch=true;}});});});if(ch){save();}}
function curOk(r){var q=ROWS.filter(function(c){return c.id===r.cid;})[0];return !q||!r.cur||r.cur===q.cur;}
function loadReg(){fetch('/api/reg',{credentials:'same-origin'}).then(function(r){return r.json();}).then(function(a){if(!Array.isArray(a)){return;}var m={};a.forEach(function(r){if(!r||!r.pid){return;}var g=m[r.pid]||(m[r.pid]={sum:0,last:'',inv:false,reg:false});if(r.inv||r.ref){g.inv=true;}if(r.regn){g.reg=true;}if(r.pdate&&num(r.sum)>0&&curOk(r)){g.sum+=num(r.sum);if(r.pdate>g.last){g.last=r.pdate;}}});REG=m;syncReg();draw();}).catch(function(){});}
function curT(c){return el('div','font:10px system-ui,sans-serif;color:#1f2547;',c.cur);}
function card(c){
var cd=el('div','display:grid;grid-template-columns:'+COLS+';grid-auto-rows:minmax(26px,auto);row-gap:0;margin-bottom:10px;width:max-content;background:#e1e6f4;border-radius:10px;overflow:hidden;');
var items=[],r=2;
if(c.open){c.services.forEach(function(s){var n=(s.open&&s.pays.length)?s.pays.length:0;items.push({s:s,row:r,n:n});r+=1+n;});}
var total=c.open?r-1:1;
var nw=el('div','font:700 10px/13px system-ui,sans-serif;color:#1f2547;text-align:left;display:flex;align-items:center;');
nw.appendChild(el('span','flex:none;margin-right:10px;display:inline-block;background:#fff;border-radius:8px;padding:3px 10px;',c.num||'\u2014'));nw.appendChild(el('span','flex:1;min-width:0;',c.contractor||'\u2014'));
cd.appendChild(hook(cellD(nw,1,1,total,BAND,'border-radius:10px 0 0 10px;padding:0 10px;'),c,'c',c));
cd.appendChild(hook(cellD(null,2,1,1,BAND),c,'c',c));
cd.appendChild(hook(cellD(null,3,1,1,BAND),c,'c',c));
cd.appendChild(hook(cellD(fx2(stCell(c)),4,1,1,BAND),c,'c',c));
cd.appendChild(hook(cellD(null,5,1,1,BAND),c,'c',c));
cd.appendChild(hook(cellD(roW(curT(c)),6,1,1,BAND),c,'c',c));
cd.appendChild(hook(cellD(calc(function(){return cs(c,'sum');},1),7,1,1,BAND),c,'c',c));
cd.appendChild(hook(cellD(calc(function(){return cs(c,'paid');},1),8,1,1,BAND),c,'c',c));
cd.appendChild(hook(cellD(calc(function(){return cs(c,'sum')-cs(c,'paid');},1),9,1,1,BAND),c,'c',c));
cd.appendChild(hook(cellD(roW(dateCell(c,'signed')),10,1,1,BAND,'border-radius:0 10px 10px 0;'),c,'c',c));
items.forEach(function(it){
var s=it.s,row=it.row,sp=1+it.n,anc=c.id;
var w=el('div','display:flex;gap:6px;align-items:center;');
if(s.kind===L.kA){w.appendChild(txt(s,'num',L.addNum,'width:60px;flex:none;font-weight:500;'));}
var ni;if(s.name){ni=el('div','font:700 10px system-ui,sans-serif;color:#1f2547;padding:0 6px;flex:1;min-width:0;',s.name);}else{ni=txt(s,'name',L.svc,'font-weight:700;border:0;background:transparent;');ni.style.flex='1';}w.appendChild(ni);
cd.appendChild(hook(cellD(w,2,row,sp,'#eef1fa',''),s,'s',c,s,null,anc));
cd.appendChild(hook(cellD(null,3,row,1,'#eef1fa',SH),s,'s',c,s,null,anc));
cd.appendChild(hook(cellD(pick(s,'kind',KD,draw),4,row,1,'#eef1fa',SH),s,'s',c,s,null,anc));
cd.appendChild(hook(cellD(scopeCell(s),5,row,1,'#eef1fa',SH),s,'s',c,s,null,anc));
cd.appendChild(hook(cellD(curT(c),6,row,1,'#eef1fa',SH),s,'s',c,s,null,anc));
if(s.pays.length){
cd.appendChild(hook(cellD(calc(function(){return sv(s,'sum');}),7,row,1,'#eef1fa',SH),s,'s',c,s,null,anc));
cd.appendChild(hook(cellD(calc(function(){return sv(s,'paid');}),8,row,1,'#eef1fa',SH),s,'s',c,s,null,anc));
}else{
cd.appendChild(hook(cellD(sumInp(s,'sum'),7,row,1,'#eef1fa',SH),s,'s',c,s,null,anc));
cd.appendChild(hook(cellD(sumInp(s,'paid'),8,row,1,'#eef1fa',SH),s,'s',c,s,null,anc));
}
cd.appendChild(hook(cellD(calc(function(){return sv(s,'sum')-sv(s,'paid');}),9,row,1,'#eef1fa',SH),s,'s',c,s,null,anc));
cd.appendChild(hook(cellD(dateCell(s,'signed'),10,row,1,'#eef1fa',SH),s,'s',c,s,null,anc));
if(it.n){s.pays.forEach(function(p,i){
var pr=row+1+i,pa=c.id+' '+s.id;
cd.appendChild(hook(cellD(txt(p,'name',L.pay,''),3,pr,1,WH,SH),null,'p',c,s,p,pa));
cd.appendChild(hook(cellD(psCell(p),4,pr,1,WH,SH),null,'p',c,s,p,pa));
cd.appendChild(hook(cellD(null,5,pr,1,WH,SH),null,'p',c,s,p,pa));
cd.appendChild(hook(cellD(curT(c),6,pr,1,WH,SH),null,'p',c,s,p,pa));
cd.appendChild(hook(cellD(sumInp(p,'sum'),7,pr,1,WH,SH),null,'p',c,s,p,pa));
cd.appendChild(hook(cellD(calc(function(){return num(p.paid);}),8,pr,1,WH,SH),null,'p',c,s,p,pa));
cd.appendChild(hook(cellD(calc(function(){return num(p.sum)-num(p.paid);}),9,pr,1,WH,SH),null,'p',c,s,p,pa));
cd.appendChild(hook(cellD(p.paidDate?el('div','display:flex;align-items:center;height:22px;padding:0 4px;font:10px system-ui,sans-serif;color:#1e7a43;white-space:nowrap;',dmy(p.paidDate)):null,10,pr,1,WH,SH),null,'p',c,s,p,pa));
});}
});
return cd;
}
function draw(){
closePop();closeCx();UP=[];SC.innerHTML='';
var h=el('div','display:grid;grid-template-columns:'+COLS+';width:max-content;padding:0 0 6px;');
['\u041a\u043e\u043d\u0442\u0440\u0430\u043a\u0442','\u0423\u0441\u043b\u0443\u0433\u0430','\u0412\u0438\u0434 \u043e\u043f\u043b\u0430\u0442\u044b'].concat(HD.slice(1)).forEach(function(t,i){h.appendChild(el('span','font:700 10px system-ui,sans-serif;color:#4b3fb5;padding:0 6px;'+(i>=6&&i<=8?'text-align:right;':''),t));});
SC.appendChild(h);
ROWS.forEach(function(c){SC.appendChild(card(c));});
var bar=el('div','display:flex;gap:10px;align-items:center;padding:2px 0 0;');
var ab=el('button',BTN,'+ '+L.addCon);
ab.addEventListener('mouseenter',function(){ab.style.background='linear-gradient(135deg,#7a68e0,#5b49c8)';ab.style.color='#fff';ab.style.boxShadow='none';});ab.addEventListener('mouseleave',function(){ab.style.background='#fff';ab.style.color='#4b3fb5';ab.style.boxShadow='inset 0 0 0 1px #c9c0f5';});
ab.addEventListener('click',function(){if(OK){conDlg();}});
MSG=el('span','font:10px system-ui,sans-serif;color:#c0392b;','');
bar.appendChild(ab);bar.appendChild(MSG);SC.appendChild(bar);
if(ANIM){var aid=ANIM.id,acd=SC.children[ANIM.ci];ANIM=null;(acd?acd.querySelectorAll('[data-anc~="'+aid+'"]'):[]).forEach(function(x){x.style.opacity='0';x.style.transform='translateY(-6px)';x.offsetHeight;x.style.transition='opacity .22s ease,transform .22s ease';x.style.opacity='1';x.style.transform='none';});}
}
function dl(id,arr){if(document.getElementById(id)){return;}var d=document.createElement('datalist');d.id=id;arr.forEach(function(x){var o=document.createElement('option');o.value=x;d.appendChild(o);});document.body.appendChild(d);}
window.upmoCon3=function(pg){
if(!document.getElementById('conCss3')){var st=document.createElement('style');st.id='conCss3';st.textContent='.conPop::-webkit-scrollbar,.c3s::-webkit-scrollbar{display:none;width:0;height:0}';document.head.appendChild(st);}
dl('c3svc',SUGS);dl('c3pay',SUGP);
pg.style.cssText+='display:flex;flex-direction:column;';
SC=el('div','flex:0 1 auto;min-height:0;overflow:auto;margin:10px;padding:12px 14px 10px;box-sizing:border-box;scrollbar-width:none;');SC.className='c3s';
SC.addEventListener('contextmenu',function(e){ctx(e,'bg');});
pg.appendChild(SC);draw();if(OK){loadReg();}
if(!OK){fetch('/api/con3',{credentials:'same-origin'}).then(function(r){return r.json();}).then(function(a){if(Array.isArray(a)){a.forEach(function(c){c.services=c.services||[];c.services.forEach(function(s){s.pays=s.pays||[];s.kind=s.kind||L.kC;if(s.scope!=='all'&&!Array.isArray(s.scope)){s.scope='all';}});});var sn={};function fx(o){if(!o.id||sn[o.id]){o.id=uid();}sn[o.id]=1;}a.forEach(function(c){fx(c);c.services.forEach(function(s){fx(s);s.pays.forEach(function(p){fx(p);});});});ROWS=a;OK=true;draw();loadReg();}else{MSG.textContent=L.err;}}).catch(function(){MSG.textContent=L.err;});}
};
})();