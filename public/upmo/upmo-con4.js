(function(){
var L={act:'\u0414\u0435\u0439\u0441\u0442\u0432\u0443\u0435\u0442',done:'\u0417\u0430\u0432\u0435\u0440\u0448\u0451\u043d',hold:'\u041f\u0440\u0438\u043e\u0441\u0442\u0430\u043d\u043e\u0432\u043b\u0435\u043d',kC:'\u041a\u043e\u043d\u0442\u0440\u0430\u043a\u0442',kA:'\u0414\u043e\u043f. \u0441\u043e\u0433\u043b\u0430\u0448\u0435\u043d\u0438\u0435',allp:'\u0412\u0441\u0435 \u043f\u0440\u043e\u0435\u043a\u0442\u044b',err:'\u041e\u0448\u0438\u0431\u043a\u0430',
addCon:'\u0414\u043e\u0431\u0430\u0432\u0438\u0442\u044c \u043a\u043e\u043d\u0442\u0440\u0430\u043a\u0442',addSvc:'\u0414\u043e\u0431\u0430\u0432\u0438\u0442\u044c \u0443\u0441\u043b\u0443\u0433\u0443',addAdn:'\u0414\u043e\u0431\u0430\u0432\u0438\u0442\u044c \u0434\u043e\u043f. \u0441\u043e\u0433\u043b\u0430\u0448\u0435\u043d\u0438\u0435',edit:'\u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u0442\u044c',editC:'\u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u0442\u044c \u043a\u043e\u043d\u0442\u0440\u0430\u043a\u0442',delCon:'\u0423\u0434\u0430\u043b\u0438\u0442\u044c \u043a\u043e\u043d\u0442\u0440\u0430\u043a\u0442',delSvc:'\u0423\u0434\u0430\u043b\u0438\u0442\u044c \u0443\u0441\u043b\u0443\u0433\u0443',delCtr:'\u0423\u0434\u0430\u043b\u0438\u0442\u044c \u043f\u043e\u0434\u0440\u044f\u0434\u0447\u0438\u043a\u0430',
del:'\u0423\u0434\u0430\u043b\u0438\u0442\u044c?',delAll:'\u0423\u0434\u0430\u043b\u0438\u0442\u044c \u0432\u043c\u0435\u0441\u0442\u0435 \u0441\u043e \u0432\u0441\u0435\u043c \u0432\u043d\u0443\u0442\u0440\u0438?',numPh:'\u2116 \u043a\u043e\u043d\u0442\u0440\u0430\u043a\u0442\u0430',contr:'\u041f\u043e\u0434\u0440\u044f\u0434\u0447\u0438\u043a',svc:'\u0423\u0441\u043b\u0443\u0433\u0430',addNum:'\u2116 \u0434\u043e\u043f. \u0441\u043e\u0433\u043b\u0430\u0448\u0435\u043d\u0438\u044f',sign:'\u0414\u0430\u0442\u0430 \u043f\u043e\u0434\u043f\u0438\u0441\u0430\u043d\u0438\u044f',cur:'\u0412\u0430\u043b\u044e\u0442\u0430',cancel:'\u041e\u0442\u043c\u0435\u043d\u0430',save:'\u0421\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c',create:'\u0421\u043e\u0437\u0434\u0430\u0442\u044c',csave:'\u0421\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c \u0438\u0437\u043c\u0435\u043d\u0435\u043d\u0438\u044f?'};
var HD=['\u041f\u043e\u0434\u0440\u044f\u0434\u0447\u0438\u043a','\u041a\u043e\u043d\u0442\u0440\u0430\u043a\u0442','\u0423\u0441\u043b\u0443\u0433\u0430','\u0412\u0438\u0434','\u0421\u0442\u0430\u0442\u0443\u0441','\u041e\u0445\u0432\u0430\u0442','\u0412\u0430\u043b.','\u0421\u0443\u043c\u043c\u0430','\u041e\u043f\u043b\u0430\u0447\u0435\u043d\u043e','\u041e\u0441\u0442\u0430\u0442\u043e\u043a','\u041f\u043e\u0434\u043f\u0438\u0441\u0430\u043d'];
var ST=[L.act,L.done,L.hold],CU=['USD','EUR','UZS','RUB'],KD=[L.kC,L.kA];
var ROWS=[],OK=false,SC=null,MSG=null,POP=null,UP=[],REGS={},DIRTY=false,ANIM=null,GR=[];
var FLD='width:100%;min-width:0;box-sizing:border-box;border:1px solid #d9d3f7;border-radius:8px;background:#fff;font:10px system-ui,sans-serif;color:#1f2547;padding:0 6px;height:20px;min-height:0;margin:0;display:block;outline:none;';
var BTN='flex:none;width:110px;height:22px;min-height:0;box-sizing:border-box;border:0;border-radius:14px;background:#fff;box-shadow:inset 0 0 0 1px #c9c0f5;color:#4b3fb5;font:700 9px/1 system-ui,sans-serif;cursor:pointer;padding:0 0 2px;margin:0;outline:none;transition:background .3s ease,color .3s ease,box-shadow .3s ease;';
var COLS='200px 150px 260px 120px 110px 170px 50px 130px 130px 120px 90px';
var BAND='#e1e6f4',MID='#eef1fa',WH='#fff',SH0='box-shadow:inset 0 -1px 0 #eeeefa;';
function el(t,c,x){var e=document.createElement(t);if(c){e.style.cssText=c;}if(x!=null){e.textContent=x;}return e;}
function uid(){return 'k'+Date.now().toString(36)+Math.random().toString(36).slice(2,6);}
function num(v){var n=parseFloat(String(v==null?'':v).replace(/\s/g,'').replace(',','.'));return isNaN(n)?0:n;}
function fm(n){var s=(Math.round(n*100)/100).toFixed(2);if(/\.00$/.test(s)){s=s.slice(0,-3);}var p=s.split('.');p[0]=p[0].replace(/\B(?=(\d{3})+(?!\d))/g,' ');return p.join('.');}
function fmtS(v){v=String(v==null?'':v).replace(/[^0-9.,]/g,'').replace(',','.');var p=v.split('.');var a=p[0].replace(/\B(?=(\d{3})+(?!\d))/g,' ');return p.length>1?a+'.'+p.slice(1).join('').slice(0,2):a;}
function dmy(v){var m=/^(\d{4})-(\d{2})-(\d{2})$/.exec(v||'');return m?m[3]+'.'+m[2]+'.'+m[1]:'';}
function projs(){var a=[];try{PROJECTS.main.items.concat(PROJECTS.aux.items).forEach(function(it){a.push({c:it.code,n:it.name});});}catch(e){}return a;}
function save(){if(!OK||RO()){return;}DIRTY=true;clearTimeout(save.t);save.t=setTimeout(function(){fetch('/api/con3/save',{method:'POST',headers:{'Content-Type':'application/json'},credentials:'same-origin',body:JSON.stringify({rows:ROWS})}).then(function(r){DIRTY=false;if(!r.ok&&MSG){MSG.textContent=L.err;}}).catch(function(){DIRTY=false;if(MSG){MSG.textContent=L.err;}});},500);}
function paidOf(s){var g=REGS[s.id];if(g){return g.sum;}var pp=(s.pays||[]).reduce(function(t,p){return t+num(p.paid);},0);return pp||num(s.paid);}
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
function txt(o,key,ph,css){var i=el('input',FLD+(css||''));i.type='text';i.placeholder=ph||'';i.value=o[key]||'';i.addEventListener('input',function(){o[key]=i.value;});return i;}
function sumInp(o,key){var i=el('input',FLD+'text-align:right;font-weight:500;');i.type='text';i.inputMode='decimal';i.value=fmtS(o[key]);i.addEventListener('input',function(){var pos=i.selectionStart,before=i.value.slice(0,pos).replace(/[^0-9.,]/g,'').length;var f=fmtS(i.value);i.value=f;var n=0,k=0;while(k<f.length&&n<before){if(/[0-9.]/.test(f[k])){n++;}k++;}i.setSelectionRange(k,k);o[key]=f.replace(/ /g,'');save();refresh();});return i;}
function calc(fn,b){var s=el('div','text-align:right;font:'+(b?'700':'500')+' 10px system-ui,sans-serif;color:#1f2547;padding:0 4px;white-space:nowrap;');function u(){s.textContent=fm(fn());}u();UP.push(u);return s;}
function pick(o,key,opts,cb){var c=el('div','display:flex;align-items:center;height:22px;padding:0 4px;font:10px system-ui,sans-serif;color:#1f2547;cursor:pointer;white-space:nowrap;',o[key]||opts[0]);c.addEventListener('click',function(){openPop(c,function(p){opts.forEach(function(x){item(p,x,function(){o[key]=x;c.textContent=x;save();closePop();if(cb){cb();}},x===(o[key]||opts[0]));});},130);});return c;}
function stCell(o){var w=el('div','');var b=el('span','display:inline-block;height:20px;line-height:20px;padding:0 12px;border-radius:10px;font:10px system-ui,sans-serif;cursor:pointer;border:.5px solid #c9c0f5;white-space:nowrap;','');function sy(){var v=o.status||ST[0];b.textContent=v;b.style.background=v===ST[1]?'#c9f0d6':(v===ST[0]?'#fde9a8':'#fff');b.style.color=v===ST[1]?'#1e7a43':(v===ST[0]?'#7a5a00':'#666');b.style.borderWidth='1px';b.style.display='inline-flex';b.style.alignItems='center';b.style.lineHeight='1';b.style.paddingTop='1px';b.style.borderColor=v===ST[1]?'#7fd09c':(v===ST[0]?'#f0cf6a':'#cfd3e0');b.style.fontWeight='700';b.style.fontSize='9px';}sy();b.addEventListener('click',function(e){e.stopPropagation();openPop(b,function(p){ST.forEach(function(x){item(p,x,function(){o.status=x;sy();save();closePop();},x===(o.status||ST[0]));});},150);});w.appendChild(b);w.style.display='flex';w.style.alignItems='center';return w;}
function dateCell(o,key){var c=el('div','display:flex;align-items:center;height:22px;padding:0 4px;font:10px system-ui,sans-serif;color:#1f2547;cursor:pointer;white-space:nowrap;',dmy(o[key]));c.addEventListener('click',function(){if(window.upmoPcal){window.upmoPcal(c,o[key]||'',function(v){o[key]=v;c.textContent=dmy(v);save();});}});return c;}
function scopeCell(s){var cell=el('div','display:flex;align-items:center;height:22px;padding:0 4px;font:10px system-ui,sans-serif;color:#4b3fb5;cursor:pointer;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;','');function t(){cell.textContent=s.scope==='all'?L.allp:((s.scope||[]).join(', ')||'\u2014');}t();
cell.addEventListener('click',function(){openPop(cell,function(p){
function row(lbl,on,fn){var lb=el('label','display:flex;gap:8px;align-items:center;padding:4px 6px;white-space:nowrap;font:10px system-ui,sans-serif;color:#1f2547;cursor:pointer;');var cb=document.createElement('input');cb.type='checkbox';cb.checked=on;cb.style.cssText='width:auto;height:auto;margin:0;';cb.addEventListener('change',function(){fn(cb.checked);});lb.appendChild(cb);lb.appendChild(el('span','',lbl));p.appendChild(lb);return cb;}
var allCb=row(L.allp,s.scope==='all',function(on){s.scope=on?'all':[];t();save();closePop();});
projs().forEach(function(pr){row(pr.c,s.scope!=='all'&&(s.scope||[]).indexOf(pr.c)>=0,function(on){if(s.scope==='all'){s.scope=[];}var i=s.scope.indexOf(pr.c);if(on&&i<0){s.scope.push(pr.c);}if(!on&&i>=0){s.scope.splice(i,1);}allCb.checked=false;t();save();});});
},200);});return cell;}
function closeCx(){var m=document.getElementById('conCtx4');if(m){m.remove();}document.removeEventListener('mousedown',outCx,true);}
function outCx(e){var m=document.getElementById('conCtx4');if(m&&!m.contains(e.target)){closeCx();}}
function newSvc(kind){return {id:uid(),kind:kind||L.kC,name:'',num:'',signed:'',scope:'all',sum:'',paid:'',open:true,pays:[]};}
function newCon(){return {id:uid(),num:'',contractor:'',status:ST[0],cur:'USD',signed:'',open:true,services:[newSvc(L.kC)]};}
function groups(){var m={},a=[];ROWS.forEach(function(c){var k=(c.contractor||'').trim().toLowerCase();if(!m[k]){m[k]={name:(c.contractor||'').trim(),docs:[]};a.push(m[k]);}m[k].docs.push(c);});a.forEach(function(g,i){g.id='g'+i;g.open=g.docs[0].open!==false;});return a;}
function setOpen(g,v){g.open=v;g.docs.forEach(function(d){d.open=v;});}
function names(){var o={},a=[];ROWS.forEach(function(c){var n=(c.contractor||'').trim();if(n&&!o[n.toLowerCase()]){o[n.toLowerCase()]=1;a.push(n);}});return a;}
function dlg(title,fields,okT,conf,onOk){
if(document.getElementById('c4dlg')){return;}
var ov=el('div','position:fixed;left:0;top:0;right:0;bottom:0;z-index:99990;background:rgba(40,30,90,.28);display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .2s ease;');ov.id='c4dlg';
var bx=el('div','width:340px;max-width:92vw;box-sizing:border-box;background:#fff;border-radius:16px;box-shadow:0 12px 40px rgba(60,50,140,.3);padding:18px 20px 16px;transform:translateY(10px) scale(.97);transition:transform .2s ease;');
bx.appendChild(el('div','font:700 12px system-ui,sans-serif;color:#4b3fb5;margin-bottom:12px;',title));
var d={},first=null;
function fld(lbl,node){var w=el('div','margin-bottom:10px;');w.appendChild(el('div','font:700 9px system-ui,sans-serif;color:#6b6f95;margin-bottom:4px;',lbl));w.appendChild(node);bx.appendChild(w);}
fields.forEach(function(f){d[f.k]=f.v==null?'':f.v;var n;
if(f.t==='date'){n=el('div','display:flex;align-items:center;height:26px;padding:0 8px;box-sizing:border-box;border:1px solid #d9d3f7;border-radius:8px;font:10px system-ui,sans-serif;cursor:pointer;color:#1f2547;',dmy(d[f.k]));n.addEventListener('click',function(){if(window.upmoPcal){window.upmoPcal(n,d[f.k]||'',function(v){d[f.k]=v;n.textContent=dmy(v);});}});}
else if(f.t==='cur'){n=el('div','border:1px solid #d9d3f7;border-radius:8px;height:26px;box-sizing:border-box;display:flex;align-items:center;padding:0 4px;');var s=el('select','width:100%;height:24px;border:0;background:transparent;font:10px system-ui,sans-serif;color:#1f2547;outline:none;cursor:pointer;');CU.forEach(function(x){var o=document.createElement('option');o.value=x;o.textContent=x;if(x===(d[f.k]||'USD')){o.selected=true;}s.appendChild(o);});d[f.k]=s.value;s.addEventListener('change',function(){d[f.k]=s.value;});n.appendChild(s);}
else{n=el('input',FLD+'height:26px;');n.type='text';n.value=d[f.k];n.addEventListener('input',function(){d[f.k]=n.value;if(f.t==='combo'){sug(n,f.k);}});if(f.t==='combo'){n.addEventListener('focus',function(){sug(n,f.k);});}if(!first){first=n;}f.node=n;}
fld(f.l,n);});
function sug(inp,k){var q=inp.value.trim().toLowerCase();var a=names().filter(function(x){return !q||x.toLowerCase().indexOf(q)>=0;});if(!a.length||(a.length===1&&a[0].toLowerCase()===q)){closePop();return;}
closePop();var r=inp.getBoundingClientRect();POP=el('div','position:fixed;z-index:99999;left:'+r.left+'px;top:'+(r.bottom+3)+'px;width:'+r.width+'px;max-height:180px;overflow:auto;scrollbar-width:none;background:#fff;border-radius:10px;box-shadow:0 8px 28px rgba(60,50,140,.25);padding:6px;box-sizing:border-box;');POP._a=inp;
a.forEach(function(x){var it=item(POP,x,function(){},false);it.addEventListener('mousedown',function(e){e.preventDefault();d[k]=x;inp.value=x;closePop();});});document.body.appendChild(POP);setTimeout(function(){document.addEventListener('mousedown',outPop,true);},0);}
var br=el('div','display:flex;justify-content:flex-end;gap:8px;margin-top:6px;');
var bc=el('button',BTN+'width:90px;',L.cancel);var bo=el('button',BTN+'width:90px;background:linear-gradient(135deg,#7a68e0,#5b49c8);color:#fff;box-shadow:none;',okT);
function close(){closePop();ov.style.opacity='0';bx.style.transform='translateY(10px) scale(.97)';setTimeout(function(){ov.remove();},200);document.removeEventListener('keydown',kd,true);}
function ok(){var bad=false;fields.forEach(function(f){if(f.req&&!String(d[f.k]).trim()){bad=true;if(f.node){f.node.style.borderColor='#e57373';}}});if(bad){return;}
if(conf&&!confirm(conf)){return;}onOk(d);save();close();draw();}
function kd(e){if(document.getElementById('dpop')||POP){return;}if(e.key==='Escape'){close();}else if(e.key==='Enter'){ok();}}
bc.addEventListener('click',close);bo.addEventListener('click',ok);
ov.addEventListener('mousedown',function(e){if(e.target===ov){close();}});
br.appendChild(bc);br.appendChild(bo);bx.appendChild(br);ov.appendChild(bx);document.body.appendChild(ov);
document.addEventListener('keydown',kd,true);
setTimeout(function(){ov.style.opacity='1';bx.style.transform='none';if(first){first.focus();}},20);
}
function dNewCon(ctr){dlg(L.addCon,[{k:'contractor',l:L.contr,v:ctr||'',t:'combo',req:1},{k:'num',l:L.numPh,v:'',req:1},{k:'name',l:L.svc,v:''},{k:'signed',l:L.sign,v:'',t:'date'},{k:'cur',l:L.cur,v:'USD',t:'cur'}],L.create,null,function(d){var c=newCon();c.contractor=d.contractor.trim();c.num=d.num.trim();c.cur=d.cur;c.services[0].name=d.name.trim();c.services[0].signed=d.signed;c.signed=d.signed;ROWS.push(c);var g=groups().filter(function(x){return x.name.toLowerCase()===c.contractor.toLowerCase();})[0];if(g){setOpen(g,true);}});}
function dEditCon(c){dlg(L.editC,[{k:'contractor',l:L.contr,v:c.contractor,t:'combo',req:1},{k:'num',l:L.numPh,v:c.num,req:1},{k:'cur',l:L.cur,v:c.cur,t:'cur'}],L.save,L.csave,function(d){c.contractor=d.contractor.trim();c.num=d.num.trim();c.cur=d.cur;});}
function dEditSvc(c,s){var f=[{k:'name',l:L.svc,v:s.name}];if(s.kind===L.kA){f.push({k:'num',l:L.addNum,v:s.num});}f.push({k:'signed',l:L.sign,v:s.signed,t:'date'});dlg(L.edit,f,L.save,L.csave,function(d){s.name=d.name.trim();if(s.kind===L.kA){s.num=d.num.trim();}s.signed=d.signed;});}
function dNewSvc(c,kind,at){var f=[{k:'name',l:L.svc,v:''}];if(kind===L.kA){f.push({k:'num',l:L.addNum,v:''});}f.push({k:'signed',l:L.sign,v:'',t:'date'});dlg(kind===L.kA?L.addAdn:L.addSvc,f,L.create,null,function(d){var s=newSvc(kind);s.name=d.name.trim();s.num=(d.num||'').trim();s.signed=d.signed;if(at==null){c.services.push(s);}else{c.services.splice(at+1,0,s);}c.open=true;});}
function RO(){var a=window.UPMO_ACL;return !(a&&a.ready&&a.edit);}
function lockRO(box,blockSel){['click','dblclick','contextmenu','keydown','beforeinput','paste','cut','drop'].forEach(function(t){box.addEventListener(t,function(e){if(!RO()){return;}var tg=e.target;if(t==='click'||t==='dblclick'){if(blockSel&&!(tg.closest&&tg.closest(blockSel))){return;}}else if(t==='keydown'){if(e.ctrlKey||e.metaKey||e.altKey){if(e.key!=='Enter'){return;}}else if(!(e.key.length===1||e.key==='Backspace'||e.key==='Delete'||e.key==='Enter')){return;}}e.stopPropagation();e.preventDefault();},true);});}
function ctx(e,type,g,c,s){if(RO()){return;}
e.preventDefault();e.stopPropagation();closePop();closeCx();
var m=el('div','position:fixed;z-index:99999;left:'+e.clientX+'px;top:'+e.clientY+'px;background:#fff;border-radius:10px;box-shadow:0 8px 28px rgba(60,50,140,.25);padding:4px;opacity:0;transition:opacity .15s ease;');m.id='conCtx4';
function it(t,fn,red){var d=el('div','padding:5px 14px;white-space:nowrap;font:10px system-ui,sans-serif;border-radius:6px;cursor:pointer;color:'+(red?'#c0392b':'#1f2547')+';',t);d.addEventListener('mouseenter',function(){d.style.background='#f1efff';});d.addEventListener('mouseleave',function(){d.style.background='';});d.addEventListener('click',function(){closeCx();fn();});m.appendChild(d);}
function sep(){m.appendChild(el('div','border-top:1px solid #eeeefa;margin:3px 0;'));}
function delDoc(){if(confirm(L.delAll)){ROWS.splice(ROWS.indexOf(c),1);save();draw();}}
if(!OK){return;}
if(type==='g'){it(L.addCon,function(){dNewCon(g.name);});sep();it(L.delCtr,function(){if(confirm(L.delAll)){ROWS=ROWS.filter(function(x){return g.docs.indexOf(x)<0;});save();draw();}},true);}
else if(type==='c'){it(L.editC,function(){dEditCon(c);});sep();it(L.addSvc,function(){dNewSvc(c,L.kC);});it(L.addAdn,function(){dNewSvc(c,L.kA);});sep();it(L.addCon,function(){dNewCon(c.contractor);});it(L.delCon,delDoc,true);}
else if(type==='s'){it(L.edit,function(){dEditSvc(c,s);});sep();it(L.addSvc,function(){dNewSvc(c,L.kC,c.services.indexOf(s));});it(L.addAdn,function(){dNewSvc(c,L.kA,c.services.indexOf(s));});sep();it(L.delSvc,function(){if(c.services.length<2){delDoc();}else if(confirm(L.del)){c.services.splice(c.services.indexOf(s),1);save();draw();}},true);}
else{it(L.addCon,function(){dNewCon('');});}
document.body.appendChild(m);
var h=m.offsetHeight;if(e.clientY+h>window.innerHeight){m.style.top=Math.max(8,window.innerHeight-h-8)+'px';}
requestAnimationFrame(function(){m.style.opacity='1';});
setTimeout(function(){document.addEventListener('mousedown',outCx,true);},0);
}
function cellD(ch,col,row,span,bg,css){
var d=el('div','grid-column:'+col+';grid-row:'+row+(span>1?' / span '+span:'')+';display:flex;align-items:center;min-width:0;min-height:26px;box-sizing:border-box;padding:0 6px;'+(bg?'background:'+bg+';':'')+(css||''));
if(ch){ch.style.flex='1';ch.style.minWidth='0';d.appendChild(ch);}
return d;
}
function idx(n){return Array.prototype.indexOf.call(SC.children,n);}
function togG(e,cell,g){
var t=e.target;while(t&&t!==cell){if(t.tagName==='INPUT'||t.style.cursor==='pointer'){return;}t=t.parentNode;}
var cd=cell.parentNode,ci=idx(cd),h0=cd.offsetHeight,old=cd.querySelector('[data-k]'),oh=old?old.offsetHeight:0;
if(g.open){var rs=cd.querySelectorAll('[data-anc~="'+g.id+'"]');if(!rs.length){setOpen(g,false);save();draw();return;}
g.open=false;var tmp=card(g);tmp.style.cssText+='position:absolute;visibility:hidden;left:0;top:0;width:'+cd.offsetWidth+'px;';SC.appendChild(tmp);var h2=tmp.offsetHeight,k2=tmp.querySelector('[data-k]'),nh=k2?k2.offsetHeight:0;tmp.remove();g.open=true;
rs.forEach(function(x){x.style.transition='opacity .22s ease,transform .22s ease';x.style.opacity='0';x.style.transform='translateY(-6px)';});
if(old&&old.firstChild){old.firstChild.style.transition='transform .26s ease';old.firstChild.style.transform='translateY('+((nh-oh)/2)+'px)';}
cd.style.height=h0+'px';cd.offsetHeight;cd.style.transition='height .26s ease';cd.style.height=h2+'px';
setTimeout(function(){setOpen(g,false);save();draw();},270);}
else{setOpen(g,true);ANIM={ci:ci,id:g.id};save();draw();var nd=SC.children[ci];if(nd){var h3=nd.offsetHeight,k=nd.querySelector('[data-k]');
if(k&&k.firstChild&&oh){var dl=(oh-k.offsetHeight)/2;if(Math.abs(dl)>.5){var chd=k.firstChild;chd.style.transform='translateY('+dl+'px)';chd.offsetHeight;chd.style.transition='transform .26s ease';chd.style.transform='none';}}
nd.style.height=h0+'px';nd.offsetHeight;nd.style.transition='height .26s ease';nd.style.height=h3+'px';setTimeout(function(){nd.style.transition='';nd.style.height='';},270);}}
}
function hk(d,type,g,c,s,anc,tog,key){
if(anc){d.setAttribute('data-anc',anc);}if(key){d.setAttribute('data-k',key);}
if(tog){d.addEventListener('click',function(e){togG(e,d,g);});}
d.addEventListener('contextmenu',function(e){ctx(e,type,g,c,s);});
d.style.userSelect='none';return d;
}
function totCell(g,kind){var d=el('div','font:700 10px/14px system-ui,sans-serif;color:#1f2547;'+(kind==='cur'?'':'text-align:right;padding:0 4px;'));
function u(){var m={},o=[];g.docs.forEach(function(c){var k=c.cur||'';if(!(k in m)){m[k]=0;o.push(k);}c.services.forEach(function(s){var v=kind==='sum'?num(s.sum):(kind==='paid'?paidOf(s):num(s.sum)-paidOf(s));m[k]+=v;});});
d.innerHTML='';o.forEach(function(k){d.appendChild(el('div','',kind==='cur'?k:fm(m[k])));});}
u();UP.push(u);return d;}
function card(g){
var cd=el('div','display:grid;grid-template-columns:'+COLS+';grid-auto-rows:minmax(26px,auto);align-content:start;row-gap:0;margin-bottom:10px;width:max-content;background:'+BAND+';border-radius:10px;overflow:hidden;');
var r=2,blocks=[];
if(g.open){g.docs.forEach(function(c){blocks.push({c:c,row:r});r+=c.services.length;});}
var total=1;
var nm=el('div','font:700 10px/13px system-ui,sans-serif;color:#1f2547;padding:0 10px;white-space:nowrap;',g.name||'\u2014');
cd.appendChild(hk(cellD(nm,'1 / 7',1,total,BAND,'cursor:pointer;'),'g',g,null,null,null,true,g.id));
var BF='cursor:pointer;padding:3px 6px;';
[['cur',7],['sum',8],['paid',9],['rem',10]].forEach(function(x){cd.appendChild(hk(cellD(totCell(g,x[0]),x[1],1,1,BAND,BF),'g',g,null,null,null,true));});
cd.appendChild(hk(cellD(null,11,1,1,BAND,BF),'g',g,null,null,null,true));
if(!g.open){return cd;}
blocks.forEach(function(b){var c=b.c,n=c.services.length,anc=g.id;
var cn=el('div','font:700 10px system-ui,sans-serif;color:#1f2547;padding:0 4px;',c.num||'\u2014');
var tp=b.row>2?'border-top:2px solid '+BAND+';':'';
cd.appendChild(hk(cellD(cn,2,b.row,n,MID,tp),'c',g,c,null,anc));
cd.appendChild(hk(cellD(fxS(stCell(c)),5,b.row,n,WH,tp),'c',g,c,null,anc));
c.services.forEach(function(s,i){var rr=b.row+i;var SH=SH0+(i===0?tp:'');
var nt=(s.kind===L.kA&&s.num?'\u2116'+s.num+'  ':'')+(s.name||'\u2014');
var nd=el('div','font:'+(s.kind===L.kA?'500':'700')+' 10px system-ui,sans-serif;color:#1f2547;padding:0 4px;',nt);
cd.appendChild(hk(cellD(nd,3,rr,1,WH,SH),'s',g,c,s,anc));
cd.appendChild(hk(cellD(pick(s,'kind',KD,draw),4,rr,1,WH,SH),'s',g,c,s,anc));
cd.appendChild(hk(cellD(scopeCell(s),6,rr,1,WH,SH),'s',g,c,s,anc));
cd.appendChild(hk(cellD(el('div','font:10px system-ui,sans-serif;color:#1f2547;',c.cur),7,rr,1,WH,SH),'s',g,c,s,anc));
cd.appendChild(hk(cellD(sumInp(s,'sum'),8,rr,1,WH,SH),'s',g,c,s,anc));
cd.appendChild(hk(cellD(calc(function(){return paidOf(s);}),9,rr,1,WH,SH),'s',g,c,s,anc));
cd.appendChild(hk(cellD(calc(function(){return num(s.sum)-paidOf(s);}),10,rr,1,WH,SH),'s',g,c,s,anc));
cd.appendChild(hk(cellD(dateCell(s,'signed'),11,rr,1,WH,SH),'s',g,c,s,anc));
});});
return cd;
}
function fxS(w){w.style.display='flex';w.style.alignItems='center';return w;}
function draw(){
closePop();closeCx();UP=[];SC.innerHTML='';
var h=el('div','display:grid;grid-template-columns:'+COLS+';width:max-content;padding:0 0 6px;');
HD.forEach(function(t,i){h.appendChild(el('span','font:700 10px system-ui,sans-serif;color:#4b3fb5;padding:0 6px;'+(i>=7&&i<=9?'text-align:right;':''),t));});
SC.appendChild(h);
GR=groups();GR.forEach(function(g){SC.appendChild(card(g));});
var bar=el('div','display:flex;gap:10px;align-items:center;padding:2px 0 0;');
var ab=el('button',BTN,'+ '+L.addCon);
ab.addEventListener('mouseenter',function(){ab.style.background='linear-gradient(135deg,#7a68e0,#5b49c8)';ab.style.color='#fff';ab.style.boxShadow='none';});ab.addEventListener('mouseleave',function(){ab.style.background='#fff';ab.style.color='#4b3fb5';ab.style.boxShadow='inset 0 0 0 1px #c9c0f5';});
ab.addEventListener('click',function(){if(OK&&!RO()){dNewCon('');}});
MSG=el('span','font:10px system-ui,sans-serif;color:#c0392b;','');
bar.appendChild(ab);bar.appendChild(MSG);SC.appendChild(bar);
if(ANIM){var aid=ANIM.id,acd=SC.children[ANIM.ci];ANIM=null;(acd?acd.querySelectorAll('[data-anc~="'+aid+'"]'):[]).forEach(function(x){x.style.opacity='0';x.style.transform='translateY(-6px)';x.offsetHeight;x.style.transition='opacity .22s ease,transform .22s ease';x.style.opacity='1';x.style.transform='none';});}
}
function norm(a){var mig=false,sn={};function fx(o){if(!o.id||sn[o.id]){o.id=uid();}sn[o.id]=1;}
a.forEach(function(c){c.services=c.services||[];fx(c);c.services.forEach(function(s){s.pays=s.pays||[];s.kind=s.kind||L.kC;if(s.scope!=='all'&&!Array.isArray(s.scope)){s.scope='all';}fx(s);s.pays.forEach(function(p){fx(p);});
if(s.pays.length&&!num(s.sum)){var t=s.pays.reduce(function(x,p){return x+num(p.sum);},0);if(t){s.sum=String(Math.round(t*100)/100);mig=true;}}});
if(!c.services.length){c.services.push(newSvc(L.kC));mig=true;}});
return mig;}
function curOk(r){var q=ROWS.filter(function(c){return c.id===r.cid;})[0];return !q||!r.cur||r.cur===q.cur;}
function loadReg(quiet){fetch('/api/reg',{credentials:'same-origin'}).then(function(r){return r.json();}).then(function(a){if(!Array.isArray(a)){return;}var m={};a.forEach(function(r){if(!r||!r.sid||!r.pdate||!(num(r.sum)>0)||!curOk(r)){return;}var g=m[r.sid]||(m[r.sid]={sum:0});g.sum+=num(r.sum);});var ns=JSON.stringify(m);if(ns===loadReg.last&&quiet){return;}loadReg.last=ns;REGS=m;draw();}).catch(function(){});}
function load(first){fetch('/api/con3',{credentials:'same-origin'}).then(function(r){return r.json();}).then(function(a){if(!Array.isArray(a)){if(MSG){MSG.textContent=L.err;}return;}if(DIRTY&&!first){return;}var mig=norm(a);ROWS=a;OK=true;draw();loadReg();if(mig){save();}}).catch(function(){if(MSG){MSG.textContent=L.err;}});}
window.upmoCon4=function(pg){
if(window.UPMO_ACL&&window.UPMO_ACL.ready&&!window.UPMO_ACL.view){var nb=document.createElement('div');nb.style.cssText='padding:20px;font:12px system-ui,sans-serif;color:#6b6f95;';nb.textContent='\u041d\u0435\u0442 \u0434\u043e\u0441\u0442\u0443\u043f\u0430';pg.appendChild(nb);return;}

if(!document.getElementById('conCss4')){var st=document.createElement('style');st.id='conCss4';st.textContent='.conPop::-webkit-scrollbar,.c4s::-webkit-scrollbar{display:none;width:0;height:0}';document.head.appendChild(st);}
pg.style.cssText+='display:flex;flex-direction:column;';
SC=el('div','flex:0 1 auto;min-height:0;overflow:auto;margin:10px;padding:12px 14px 10px;box-sizing:border-box;scrollbar-width:none;');SC.className='c4s';
SC.addEventListener('contextmenu',function(e){ctx(e,'bg');});lockRO(SC,'[data-anc]');
pg.appendChild(SC);draw();load(!OK);
clearInterval(window.__c4poll);window.__c4poll=setInterval(function(){if(!SC||!SC.isConnected){clearInterval(window.__c4poll);return;}var a=document.activeElement;if(a&&SC.contains(a)&&a.tagName==='INPUT'){return;}if(document.hidden||POP){return;}loadReg(true);},2000);
};
})();
