(function(){
var old=window.dbPanel;if(!old){return;}
var SEL=null,ANIM=0,PQ="";
var TX="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font:700 8px/11px system-ui,sans-serif;";
function el(t,c,x){var e=document.createElement(t);if(c){e.style.cssText=c;}if(x!=null){e.textContent=x;}return e;}
function items(){try{return (PROJECTS.prep.items||[]).filter(function(p){return p&&p.code;});}catch(e){return [];}}
function pnl(p){
if(!document.getElementById("smCss")){var sx=document.createElement("style");sx.id="smCss";sx.textContent="@keyframes smIn{from{opacity:0;transform:translateX(60px)}to{opacity:1;transform:none}}";document.head.appendChild(sx);}
var P=el("div",(ANIM?"animation:smIn .45s cubic-bezier(.22,1,.36,1) both;":"")+"flex:1 1 auto;min-width:0;margin:12px 16px 8px 8px;padding:0;background:#fff;border-radius:18px;box-shadow:0 2px 10px rgba(106,90,214,.08);overflow:hidden;display:flex;flex-direction:column;box-sizing:border-box;");
ANIM=0;P.id="smPnl";
if(!document.getElementById("payCss2")){var s2=document.createElement("style");s2.id="payCss2";s2.textContent=".pcost div:has(>[data-a=\"exp\"]){display:none!important}";document.head.appendChild(s2);}
if(!document.getElementById("payCss")){var s3=document.createElement("style");s3.id="payCss";s3.textContent=".pcost [data-a=\"tab\"]{display:none!important}";document.head.appendChild(s3);}
if(!document.getElementById("smCss2")){var s4=document.createElement("style");s4.id="smCss2";s4.textContent=".pcost *{scrollbar-width:none}.pcost *::-webkit-scrollbar{display:none;width:0;height:0}";document.head.appendChild(s4);}var c=el("div","flex:1 1 auto;min-height:0;position:relative;");c.className="pcost";var qh=el("div","flex:none;display:flex;gap:8px;align-items:baseline;justify-content:flex-start;padding:12px 16px 8px;");qh.appendChild(el("div","font:700 12px system-ui,sans-serif;color:#4b3fb5;white-space:nowrap;",p.code));qh.appendChild(el("div","font:700 12px system-ui,sans-serif;color:#1f2547;",p.name||""));P.appendChild(qh);P.appendChild(c);
setTimeout(function(){if(window._costFor&&c.isConnected){window._costFor(c,p.code);}},0);
return P;}
var SM=(function(){try{return JSON.parse(localStorage.getItem("upmoSmeta"))||{};}catch(e){return {};}})(),OKL=false,LUs=[],SVT=0,ST=["\u041d\u0435 \u043d\u0430\u0447\u0430\u0442\u043e","\u0412\u044b\u043f\u043e\u043b\u043d\u044f\u0435\u0442\u0441\u044f","\u0417\u0430\u0432\u0435\u0440\u0448\u0435\u043d\u043e"],SC=[["#eef1fa","#6b7280"],["#fde9a8","#7a5a00"],["#d7f3e3","#2f855a"]];
function canEdit(){var a=window.UPMO_ACL;return !!(a&&a.ready&&a.edit&&OKL);}
function nm(v){var n=parseFloat(String(v==null?"":v).replace(/[\s\u00a0]/g,"").replace(",","."));return isNaN(n)?0:n;}
function fm(n){return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g," ");}
function paidOf(code){try{var D=JSON.parse(localStorage.getItem("upmoPrepGrid")),T=D&&D.t&&D.t.Cost;if(!T){return 0;}var j=T.c.indexOf(code);if(j<1){return 0;}var s=0;T.r.forEach(function(r){s+=nm(r[j]);});return s;}catch(e){return 0;}}
function sv(){try{localStorage.setItem("upmoSmeta",JSON.stringify(SM));}catch(e){}clearTimeout(SVT);SVT=setTimeout(function(){var rows=[];for(var k in SM){rows.push({code:k,cost:SM[k].cost||"",status:SM[k].status||""});}fetch("/api/smeta/save",{method:"POST",headers:{"Content-Type":"application/json"},credentials:"same-origin",body:JSON.stringify({rows:rows})}).catch(function(){});},600);}
function ld(cb){fetch("/api/smeta",{credentials:"same-origin"}).then(function(r){if(!r.ok){throw 0;}return r.json();}).then(function(a){SM={};(Array.isArray(a)?a:[]).forEach(function(x){SM[x.code]={cost:x.cost||"",status:x.status||""};});OKL=true;try{localStorage.setItem("upmoSmeta",JSON.stringify(SM));}catch(e){}cb();}).catch(function(){cb();});}
function smenu(a,cb){var old=document.getElementById("smMenu");if(old){old.remove();}var r=a.getBoundingClientRect(),m=el("div","position:fixed;z-index:4000;left:"+Math.max(8,r.left-30)+"px;top:"+(r.bottom+4)+"px;background:#fff;border-radius:12px;padding:6px;box-shadow:0 10px 30px rgba(106,90,214,.28);border:1px solid rgba(0,0,0,.06);min-width:110px;");m.id="smMenu";function cl(){document.removeEventListener("mousedown",md,true);document.removeEventListener("keydown",kd,true);m.remove();}function md(e){if(!m.contains(e.target)){cl();}}function kd(e){if(e.key==="Escape"){cl();}}ST.forEach(function(s,i){var d=el("div","padding:6px 10px;border-radius:8px;cursor:pointer;font:700 9px system-ui,sans-serif;color:"+SC[i][1]+";",s);d.addEventListener("mouseenter",function(){d.style.background="#f0eeff";});d.addEventListener("mouseleave",function(){d.style.background="";});d.addEventListener("click",function(){cl();cb(i);});m.appendChild(d);});document.body.appendChild(m);document.addEventListener("mousedown",md,true);document.addEventListener("keydown",kd,true);}
function build(w){
if(!w){return;}var root=w.firstChild;if(!root||!root._pay){return;}var cont=root.children[1];if(!cont||cont._sm){return;}cont._sm=1;
var hold=el("div","height:100%;display:flex;flex-direction:row;");cont.appendChild(hold);root.children[0].style.display="none";ld(function(){draw();});var iv=setInterval(function(){if(!hold.isConnected){clearInterval(iv);return;}LUs.forEach(function(f){f();});},2000);
function rowEl(p){
function get(){return SM[p.code]||(SM[p.code]={cost:"",status:""});}
var e=el("div","display:flex;align-items:center;gap:8px;margin:0 8px 4px;padding:4px 4px 4px 12px;min-height:46px;cursor:pointer;background:"+(SEL===p.code?"#d6dcf6":"#e3e8f5")+";border-radius:12px;box-sizing:border-box;");
var t=el("div","display:flex;gap:6px;min-width:0;align-items:flex-start;");var qcd=el("div",TX+"flex:none;color:#4b3fb5;text-align:center;white-space:nowrap;",p.code);t.appendChild(el("div",TX+"flex:1 1 auto;min-width:0;color:#1f2547;font:700 10px/13px system-ui,sans-serif;white-space:normal;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;word-break:break-word;",p.name||"\u2014"));
var m=el("div","flex:1 1 auto;min-width:0;");m.appendChild(t);
var k=el("div","flex:none;width:128px;box-sizing:border-box;height:38px;padding:0 6px;background:#fff;border-radius:9px;display:grid;grid-template-columns:auto 1fr;column-gap:6px;align-content:center;");
var ci=document.createElement("input");ci.type="text";ci.value=(SM[p.code]&&SM[p.code].cost!=="")?fm(nm(SM[p.code].cost)):"";ci.readOnly=!canEdit();ci.style.cssText="width:100%;box-sizing:border-box;height:16px;margin:0;padding:0 6px;border:0;border-radius:8px;outline:none;background:#fff;text-align:right;font:700 8px system-ui,sans-serif;color:#1f2547;";
var pv=el("div",TX+"height:16px;line-height:16px;text-align:right;color:#1e7a43;"),rv=el("div",TX+"height:16px;line-height:16px;text-align:right;color:#1f2547;");
function upd(){var dn=si0()===2,pd=paidOf(p.code),has=!!(SM[p.code]&&SM[p.code].cost!==""),c0=has?nm(SM[p.code].cost):0;pv.textContent=pd?fm(pd):"0";if(dn){rv.textContent="0";rv.style.color="#1f2547";ci.readOnly=true;if(document.activeElement!==ci){ci.value=pd?fm(pd):"0";}}else{rv.textContent=has?fm(c0-pd):"";rv.style.color=(has&&c0-pd<0)?"#d9534f":"#1f2547";ci.readOnly=!canEdit();if(document.activeElement!==ci){ci.value=has?fm(c0):"";}}}
ci.addEventListener("keydown",function(ev){ev.stopPropagation();});ci.addEventListener("click",function(ev){ev.stopPropagation();});ci.addEventListener("dblclick",function(ev){ev.stopPropagation();});ci.addEventListener("mousedown",function(ev){ev.stopPropagation();});
ci.addEventListener("focus",function(){if(si0()===2){return;}ci.value=(SM[p.code]&&SM[p.code].cost)||"";});
ci.addEventListener("input",function(){if(!canEdit()||si0()===2){return;}get().cost=ci.value.replace(/[\s\u00a0]/g,"").replace(",",".");upd();sv();});
ci.addEventListener("blur",function(){upd();});
var ch=el("div","height:16px;border-radius:8px;text-align:center;font:700 8px/16px system-ui,sans-serif;cursor:pointer;");
function si0(){var i=(SM[p.code]&&SM[p.code].status)?ST.indexOf(SM[p.code].status):0;return i<0?0:i;}
function paint(){var i=si0();ch.textContent=ST[i];ch.style.background=SC[i][0];ch.style.color=SC[i][1];}
ch.addEventListener("click",function(ev){ev.stopPropagation();if(!canEdit()){return;}smenu(ch,function(i){get().status=ST[i];paint();upd();sv();});});
paint();upd();LUs.push(upd);
ci.style.cssText="width:100%;min-width:0;box-sizing:border-box;height:11px;margin:0;padding:0;border:0;border-radius:0;outline:none;background:transparent;text-align:right;font:700 8px/11px system-ui,sans-serif;color:#1f2547;";
pv.style.height="11px";pv.style.lineHeight="11px";rv.style.height="11px";rv.style.lineHeight="11px";ch.style.width="76px";ch.style.marginTop="4px";ch.style.marginLeft="auto";
function r2(lb,nd){k.appendChild(el("div",TX+"text-align:right;color:#6b7280;",lb));k.appendChild(nd);}
r2("\u0421\u0442\u043e\u0438\u043c\u043e\u0441\u0442\u044c",ci);r2("\u041e\u043f\u043b\u0430\u0447\u0435\u043d\u043e",pv);r2("\u041e\u0441\u0442\u0430\u0442\u043e\u043a",rv);
ch.style.marginLeft="0";ch.style.marginTop="0";ch.style.marginBottom="3px";ch.style.alignSelf="flex-end";ch.style.flex="none";var qcc=el("div","flex:none;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;");ch.style.marginBottom="0";ch.style.alignSelf="center";qcc.appendChild(qcd);qcc.appendChild(ch);e.appendChild(m);e.appendChild(qcc);e.appendChild(k);
e.addEventListener("click",function(){var pn=document.getElementById("smPnl");if(SEL===p.code&&pn){pn.style.animation="none";pn.style.transition="opacity .3s ease,transform .35s cubic-bezier(.22,1,.36,1)";void pn.offsetWidth;pn.style.opacity="0";pn.style.transform="translateX(60px)";setTimeout(function(){SEL=null;draw();},300);return;}SEL=p.code;ANIM=1;draw();});
return e;}
function draw(){
var olw=document.getElementById("smList"),sc0=olw?olw.scrollTop:0;hold.innerHTML="";
var L=el("div","flex:none;width:520px;height:100%;display:flex;flex-direction:column;min-height:0;");
var hl=el("div","flex:none;display:flex;align-items:center;padding:12px 8px 8px;margin:0 0 0 7px;width:504px;box-sizing:border-box;");
var si=document.createElement("input");si.type="text";si.id="smSearch";si.value=PQ;si.placeholder="\u041f\u043e\u0438\u0441\u043a: \u043a\u043e\u0434, \u043d\u0430\u0438\u043c\u0435\u043d\u043e\u0432\u0430\u043d\u0438\u0435";
si.style.cssText="box-sizing:border-box;flex:1 1 auto;min-width:0;height:26px;margin:0;padding:0 12px;border:0;border-radius:13px;outline:none;background:#fff;box-shadow:inset 0 0 0 1px #d9d3f7;font:700 9px system-ui,sans-serif;color:#1f2547;";
si.addEventListener("keydown",function(e){e.stopPropagation();});
si.addEventListener("input",function(){PQ=si.value;var ps=si.selectionStart;draw();var n=document.getElementById("smSearch");if(n){n.focus();n.setSelectionRange(ps,ps);}});
hl.appendChild(si);L.appendChild(hl);
var LW=el("div","flex:1 1 auto;min-height:0;box-sizing:border-box;width:504px;margin:0 0 8px 7px;padding:8px 0 4px;background:#fff;border-radius:18px;box-shadow:0 2px 10px rgba(106,90,214,.08);overflow-y:auto;scrollbar-width:none;");
var q=PQ.trim().toLowerCase();
LUs=[];var ls=items().filter(function(p){return !q||(p.code+" "+(p.name||"")).toLowerCase().indexOf(q)>=0;});
if(!ls.length){LW.appendChild(el("div","padding:10px 27px;font:700 10px system-ui,sans-serif;color:#9aa0bf;","\u041d\u0435\u0442 \u0437\u0430\u043f\u0438\u0441\u0435\u0439"));}
ls.forEach(function(p){LW.appendChild(rowEl(p));});
L.appendChild(LW);hold.appendChild(L);LW.id="smList";LW.scrollTop=sc0;
var sp=items().filter(function(p){return p.code===SEL;})[0];if(sp){hold.appendChild(pnl(sp));}
}
draw();
}
window.dbPanel=function(i){var r=old.apply(this,arguments);if(i===0){[300,600,900].forEach(function(d){setTimeout(function(){build(document.getElementById("dbPanel"));},d);});}return r;};
})();

;(function(){try{
if(window.smfx){return;}window.smfx=1;
var MN=["\u042f\u043d\u0432\u0430\u0440\u044c","\u0424\u0435\u0432\u0440\u0430\u043b\u044c","\u041c\u0430\u0440\u0442","\u0410\u043f\u0440\u0435\u043b\u044c","\u041c\u0430\u0439","\u0418\u044e\u043d\u044c","\u0418\u044e\u043b\u044c","\u0410\u0432\u0433\u0443\u0441\u0442","\u0421\u0435\u043d\u0442\u044f\u0431\u0440\u044c","\u041e\u043a\u0442\u044f\u0431\u0440\u044c","\u041d\u043e\u044f\u0431\u0440\u044c","\u0414\u0435\u043a\u0430\u0431\u0440\u044c"];
var st=document.createElement("style");
st.textContent=".pcost .gs{background:#fff}.pcost table{border-collapse:collapse!important}.pcost thead th,.pcost thead td{background:#eef0fb!important;color:#4b3fb5!important;font-weight:700!important;font-size:11px!important;text-align:left!important;border:0!important;height:30px!important;padding:0 10px!important;position:sticky;top:0;z-index:2}.pcost thead tr>*:not(:first-child):not(:last-child){text-align:right!important}.pcost thead tr>*:first-child,.pcost thead tr>*:last-child{cursor:pointer}.pcost tbody td{border:0!important;border-bottom:1px solid #eceef6!important;color:#1f2547!important;font-size:10px!important;padding:0 10px!important;height:25px!important}.pcost tbody td:first-child,.pcost tbody td:last-child{text-align:left!important}";
document.head.appendChild(st);
var pop=null;
function tb(t){return t.tBodies[0];}
function val(td){var i=td&&td.querySelector("input");return String(i?i.value:(td?td.textContent:"")).trim();}
function dk(v){var m=/^(\d{2})\.(\d{2})\.(\d{4})$/.exec(v);return m?m[3]+m[2]+m[1]:v;}
function apply(t){var f=t._fx||{},ks=Object.keys(f),rows=tb(t).rows,i,j,h,td;
for(i=0;i<rows.length;i++){h=false;for(j=0;j<ks.length&&!h;j++){td=rows[i].cells[+ks[j]];if(f[ks[j]][val(td)]){h=true;}}rows[i].style.display=h?"none":"";}
var th=t.tHead.rows[0].cells;for(i=0;i<th.length;i++){th[i].style.boxShadow=(f[i]&&Object.keys(f[i]).length)?"inset 0 -2px 0 #4b3fb5":"";}}
function close(){if(pop){pop.remove();pop=null;}}
function open(t,th,ci){close();var f=t._fx=t._fx||{};var hid=f[ci]||(f[ci]={});var rows=tb(t).rows,seen={},vs=[],i;
for(i=0;i<rows.length;i++){var v=val(rows[i].cells[ci]);if(!seen[v]){seen[v]=1;vs.push(v);}}
var last=th.parentNode.children.length-1===ci;
vs.sort(function(a,b){if(last){return dk(a)<dk(b)?-1:dk(a)>dk(b)?1:0;}return a.localeCompare(b);});
pop=document.createElement("div");pop._th=th;
var r=th.getBoundingClientRect();
pop.style.cssText="position:fixed;z-index:99999;width:230px;background:#fff;border-radius:10px;box-shadow:0 6px 24px rgba(30,30,80,.25);padding:8px;font:12px sans-serif;color:#1f2547;left:"+Math.max(4,Math.min(r.left,window.innerWidth-240))+"px;top:"+(r.bottom+2)+"px;";
var q=document.createElement("input");q.placeholder="\u041f\u043e\u0438\u0441\u043a";q.style.cssText="width:100%;box-sizing:border-box;border:1px solid #d5d9ee;border-radius:6px;padding:4px 6px;font-size:12px;margin-bottom:6px;outline:none;";
var al=document.createElement("label");al.style.cssText="display:flex;gap:6px;align-items:center;padding:3px 2px;font-weight:700;cursor:pointer;";
var ac=document.createElement("input");ac.type="checkbox";al.appendChild(ac);al.appendChild(document.createTextNode("\u0412\u044b\u0431\u0440\u0430\u0442\u044c \u0432\u0441\u0435"));
var ls=document.createElement("div");ls.style.cssText="max-height:280px;overflow:auto;border-top:1px solid #eceef6;margin-top:4px;padding-top:4px;";
var items=[],groups=[];
function sync(){if(!Object.keys(hid).length){delete f[ci];}else{f[ci]=hid;}apply(t);var all=true;
items.forEach(function(x){if(x.d.style.display!=="none"&&!x.c.checked){all=false;}});ac.checked=all;
groups.forEach(function(g){var n=0,c=0,vis=0;g.leaves.forEach(function(x){n++;if(x.c.checked){c++;}if(x.d.style.display!=="none"){vis++;}});g.c.checked=n>0&&c===n;g.c.indeterminate=c>0&&c<n;g.d.style.display=vis?"":"none";});}
function mkLeaf(v,text,parent,pad){var d=document.createElement("label");d.style.cssText="display:flex;gap:6px;align-items:center;padding:2px 2px 2px "+pad+"px;cursor:pointer;white-space:nowrap;";
var c=document.createElement("input");c.type="checkbox";c.checked=!hid[v];c.onchange=function(){if(c.checked){delete hid[v];}else{hid[v]=true;}sync();};
d.appendChild(c);d.appendChild(document.createTextNode(text));parent.appendChild(d);var x={d:d,c:c,v:v};items.push(x);return x;}
function mkGroup(text,parent,pad){var w=document.createElement("div"),h=document.createElement("div"),tg=document.createElement("span"),c=document.createElement("input"),lb=document.createElement("span"),k=document.createElement("div");
h.style.cssText="display:flex;gap:6px;align-items:center;padding:2px 2px 2px "+pad+"px;";
tg.textContent="+";tg.style.cssText="width:12px;text-align:center;cursor:pointer;font-weight:700;color:#4b3fb5;";
c.type="checkbox";lb.textContent=text;k.style.display="none";
h.appendChild(tg);h.appendChild(c);h.appendChild(lb);w.appendChild(h);w.appendChild(k);parent.appendChild(w);
var g={d:w,c:c,k:k,tg:tg,leaves:[]};
tg.onclick=function(){var o=k.style.display==="none";k.style.display=o?"block":"none";tg.textContent=o?"\u2212":"+";};
lb.onclick=tg.onclick;lb.style.cursor="pointer";
c.onchange=function(){g.leaves.forEach(function(x){if(x.d.style.display!=="none"){x.c.checked=c.checked;if(c.checked){delete hid[x.v];}else{hid[x.v]=true;}}});sync();};
groups.push(g);return g;}
if(last){var cy=null,cm=null,gy=null,gm=null,rest=[];
vs.forEach(function(v){var m=/^(\d{2})\.(\d{2})\.(\d{4})$/.exec(v);if(!m){rest.push(v);return;}
if(cy!==m[3]){cy=m[3];gy=mkGroup(cy,ls,0);cm=null;}
if(cm!==m[2]){cm=m[2];gm=mkGroup(MN[+cm-1]||cm,gy.k,16);}
var x=mkLeaf(v,m[1],gm.k,40);gm.leaves.push(x);gy.leaves.push(x);});
rest.forEach(function(v){mkLeaf(v,v||"(\u043f\u0443\u0441\u0442\u043e)",ls,0);});}
else{vs.forEach(function(v){mkLeaf(v,v||"(\u043f\u0443\u0441\u0442\u043e)",ls,0);});}
ac.onchange=function(){items.forEach(function(x){if(x.d.style.display!=="none"){x.c.checked=ac.checked;if(ac.checked){delete hid[x.v];}else{hid[x.v]=true;}}});sync();};
q.oninput=function(){var kk=q.value.toLowerCase();items.forEach(function(x){x.d.style.display=x.v.toLowerCase().indexOf(kk)>=0?"flex":"none";});
if(kk){groups.forEach(function(g){g.k.style.display="block";g.tg.textContent="\u2212";});}sync();};
pop.appendChild(q);pop.appendChild(al);pop.appendChild(ls);document.body.appendChild(pop);sync();q.focus();}
document.addEventListener("click",function(e){var th=e.target.closest&&e.target.closest(".pcost thead th,.pcost thead td");if(!th){return;}
var t=th.closest("table"),ch=th.parentNode.children,ci=Array.prototype.indexOf.call(ch,th);
if(ci!==0&&ci!==ch.length-1){return;}if(e.ctrlKey||e.shiftKey){return;}
e.stopPropagation();e.preventDefault();if(pop&&pop._th===th){close();return;}open(t,th,ci);},true);
document.addEventListener("mousedown",function(e){if(pop&&!pop.contains(e.target)&&!(e.target.closest&&e.target.closest(".pcost thead"))){close();}},true);
var tm=0;new MutationObserver(function(){if(tm){return;}tm=setTimeout(function(){tm=0;var ts=document.querySelectorAll(".pcost .cl table"),i;for(i=0;i<ts.length;i++){if(ts[i]._fx&&ts[i].tBodies[0]&&ts[i].tHead){apply(ts[i]);}}},60);}).observe(document.body,{childList:true,subtree:true});
}catch(e){}})();

;(function(){try{
if(window.smhide){return;}window.smhide=1;
var A="\u0420\u0435\u0435\u0441\u0442\u0440 \u043e\u043f\u043b\u0430\u0442\u044b",B="\u0421\u0432\u043e\u0434";
new MutationObserver(function(){var p=document.getElementById("dbPanel");if(!p){return;}
var bs=p.querySelectorAll("button"),i,t,h;
for(i=0;i<bs.length;i++){t=bs[i].textContent.trim();
if(t===A||t===B){h=bs[i].parentElement;if(h&&h.children.length<=3&&h.style.display!=="none"){h.style.display="none";}}}
}).observe(document.body,{childList:true,subtree:true});
}catch(e){}})();
