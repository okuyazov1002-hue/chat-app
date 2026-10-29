(function(){
var RG=[],CN=[],ANIM=0,W=null,BODY=null,SEL=null,LC=0,PQ="",PAR=false,TD=[],PL=[],LD=false;
function el(t,c,x){var e=document.createElement(t);if(c){e.style.cssText=c;}if(x!=null){e.textContent=x;}return e;}
var BTN="border:0;border-radius:13px;height:26px;width:auto;flex:none;padding:0 14px 2px;margin:0;cursor:pointer;box-shadow:inset 0 0 0 1px #c9c0f5;font:700 9px/1 system-ui,sans-serif;";
var TX="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font:700 8px/11px system-ui,sans-serif;";
function arr(v){return Array.isArray(v)?v:((v&&v.rows)||[]);}
function fd(s){var m=/^(\d{4})-(\d{2})-(\d{2})$/.exec(s||"");return m?m[3]+"."+m[2]+"."+m[1]:(s||"");}
function fs(s,c){var n=parseFloat(String(s||"").replace(/\s/g,"").replace(",","."));return (isNaN(n)?String(s||""):n.toLocaleString("ru-RU",{maximumFractionDigits:2}))+(c?" "+c:"");}
function rows(){
var pm={},out=[];
PL.forEach(function(p){pm[p.id]=p;});
TD.forEach(function(t){
var d=t.docs&&t.docs.ct&&t.docs.ct.date;
if(!d){return;}
var p=pm[t.planId]||{};if(!String(p.cnum||t.docs.ct.num||"").trim()){return;}
out.push({p:p,ctype:p.ctype||t.ctype||"",method:(p.method||t.method)==="direct"?"\u041f\u0440\u044f\u043c\u043e\u0439 \u043a\u043e\u043d\u0442\u0440\u0430\u043a\u0442":"\u041a\u043e\u043d\u043a\u0443\u0440\u0441",who:p.winner||t.winner||"",sum:t.docs.ct.sum||p.sum||t.sum||"",cur:p.cur||t.cur||"",date:d,cnum:p.cnum||t.docs.ct.num||"",id:t.id||t.planId});
});
out.sort(function(a,b){return PL.indexOf(a.p)-PL.indexOf(b.p);});
return out;
}
function rowEl(r,i){
var e=el("div","display:flex;align-items:center;gap:8px;margin:0 8px 4px;padding:0 10px;height:44px;cursor:pointer;background:"+(SEL===r.id?"#d6dcf6":"#e3e8f5")+";border-radius:12px;box-sizing:border-box;");
e.appendChild(el("div","flex:none;width:14px;font:700 9px system-ui,sans-serif;color:#1f2547;",String(i+1)));
var m=el("div","flex:1 1 auto;min-width:0;");
m.appendChild(el("div",TX+"color:#1f2547;",r.ctype||"\u2014"));

m.appendChild(el("div",TX+"color:#4b3fb5;",r.who||"\u2014"));
m.appendChild(el("div",TX+"color:#6b7280;",r.cnum));
e.appendChild(m);
var tot=nm(r.sum),pv=el("div",TX+"text-align:right;color:#1e7a43;"),rv=el("div",TX+"text-align:right;color:#1f2547;"),k=el("div","flex:none;width:116px;margin-right:-6px;box-sizing:border-box;height:36px;padding:0 6px;background:#fff;border-radius:9px;display:grid;grid-template-columns:auto 1fr;column-gap:6px;align-content:center;min-width:0;");
function cal(){var pd=0;pays(r).forEach(function(x){pd+=nm(x.sum);});pv.textContent=pd?fs(pd):"0";rv.textContent=(tot-pd)?fs(tot-pd):"0";}
k.appendChild(el("div",TX+"text-align:right;color:#6b7280;","\u0421\u0442\u043e\u0438\u043c\u043e\u0441\u0442\u044c"));k.appendChild(el("div",TX+"text-align:right;color:#1f2547;",tot?fs(tot):"0"));k.appendChild(el("div",TX+"text-align:right;color:#6b7280;","\u041e\u043f\u043b\u0430\u0447\u0435\u043d\u043e"));k.appendChild(pv);k.appendChild(el("div",TX+"text-align:right;color:#6b7280;","\u041e\u0441\u0442\u0430\u0442\u043e\u043a"));k.appendChild(rv);cal();LU.push(cal);
e.appendChild(el("div","flex:none;font:700 9px system-ui,sans-serif;color:#4b3fb5;",r.cur||""));e.appendChild(k);e.addEventListener("click",function(){var pn=document.getElementById("fnPnl");if(SEL===r.id&&pn){pn.style.animation="none";pn.style.transition="opacity .3s ease,transform .35s cubic-bezier(.22,1,.36,1)";void pn.offsetWidth;pn.style.opacity="0";pn.style.transform="translateX(60px)";setTimeout(function(){SEL=null;draw();},300);return;}SEL=r.id;ANIM=1;draw();});

return e;
}
var EK=["pname","proj","inv","date","due","regn","regd","pdate","sum","rate"],PJ=[],FS=[],FP=null,FL=[],NR=null,NRK=null,PR=null,SVT=0,CUR=["EUR","USD","UZS","RUB"],GR="display:grid;grid-template-columns:1.3fr 1.3fr 1fr 1fr 1fr 1fr 1fr 1.2fr .6fr 1.5fr;gap:8px;align-items:center;padding:3px 14px;min-width:880px;box-sizing:border-box;";
function uid(){return "p"+Date.now().toString(36)+Math.random().toString(36).slice(2,6);}
function nk(s){return String(s||"").toLowerCase().replace(/[^0-9a-z\u0430-\u044f\u0451]/g,"");}
function canEdit(){var a=window.UPMO_ACL;return !!(a&&a.ready&&a.edit);}
function nm(v){var n=parseFloat(String(v==null?"":v).replace(/\s/g,"").replace(",","."));return isNaN(n)?0:n;}
function fm(n){var s=(Math.round(n*100)/100).toFixed(2),p=s.split(".");p[0]=p[0].replace(/\B(?=(\d{3})+(?!\d))/g," ");return p[1]==="00"?p[0]:p.join(".");}
function dm(v){var m=/^(\d{4})-(\d\d)-(\d\d)$/.exec(v||"");return m?m[3]+"."+m[2]+"."+m[1]:"";}
function isU(c){return /usd|\$|\u0434\u043e\u043b\u043b/i.test(c||"");}
function curOf(x){for(var i=0;i<CN.length;i++){if(CN[i].id===x.cid){return x.cur||CN[i].cur||"";}}return x.cur||"";}
function eqOf(x){var c=curOf(x),sm=nm(x.sum),k=nm(x.rate);if(isU(c)){return sm;}if(k<=0){return 0;}return /eur|\u20ac|\u0435\u0432\u0440\u043e|gbp/i.test(c)?sm*k:sm/k;}
function sv(){clearTimeout(SVT);SVT=setTimeout(function(){fetch("/api/reg/save",{method:"POST",headers:{"Content-Type":"application/json"},credentials:"same-origin",body:JSON.stringify({rows:RG})}).then(function(r){if(!r.ok){throw 0;}}).catch(function(){var t=el("div","position:fixed;right:24px;bottom:20px;z-index:4000;background:#c0392b;color:#fff;border-radius:12px;padding:8px 16px;font:700 11px system-ui,sans-serif;","\u041e\u0448\u0438\u0431\u043a\u0430 \u0441\u043e\u0445\u0440\u0430\u043d\u0435\u043d\u0438\u044f");document.body.appendChild(t);setTimeout(function(){t.remove();},3000);});},500);}
function pays(r){var cm={};CN.forEach(function(c){cm[c.id]=c;});var kn=nk(r.cnum),kw=nk(r.who);return RG.filter(function(x){var c=cm[x.cid];return c?nk(c.num)===kn:nk(x.contractor)===kw;});}
function mkr(r){var kn=nk(r.cnum),c=null;CN.forEach(function(x){if(!c&&nk(x.num)===kn){c=x;}});return {id:uid(),contractor:(c&&c.contractor)||r.who||"",cid:c?c.id:"",sid:(c&&(c.services||[]).length===1)?c.services[0].id:"",pid:"",pname:"",inv:"",date:"",due:"",regn:"",regd:"",pdate:"",sum:"",rate:"",cur:(c&&c.cur)||"",proj:""};}
function cellIn(x,k,right,isNum,cb){var i=document.createElement("input");i.type="text";i.style.cssText="width:100%;min-width:0;box-sizing:border-box;border:0;background:transparent;outline:none;padding:1px 0;margin:0;font:"+(isNum?"700 ":"")+"9px system-ui,sans-serif;color:#1f2547;"+(right?"text-align:right;":"");i.value=isNum&&x[k]!==""&&x[k]!=null?fm(nm(x[k])):(x[k]||"");i.readOnly=!canEdit();if(isNum){i.addEventListener("focus",function(){i.value=x[k]||"";});i.addEventListener("blur",function(){x[k]=String(x[k]||"").replace(/\s/g,"").replace(",",".");i.value=x[k]!==""?fm(nm(x[k])):"";cb();});}i.addEventListener("input",function(){snp();x[k]=i.value;cb();lu();});i.addEventListener("keydown",function(e){e.stopPropagation();});return i;}
function cellD(x,k,cb){var d=el("div","min-height:14px;font:9px/14px system-ui,sans-serif;color:#1f2547;cursor:"+(canEdit()?"pointer":"default")+";",dm(x[k]));if(canEdit()){d.addEventListener("click",function(){if(window.upmoPcal){window.upmoPcal(d,x[k]||"",function(v){snp(true);x[k]=v;d.textContent=dm(v);cb();});}});}return d;}
function cpop(){if(FP){document.removeEventListener("mousedown",FP._m,true);document.removeEventListener("keydown",FP._k,true);FP.remove();FP=null;}}
function cellP(x,cb){var d=el("div","min-height:14px;font:9px/14px system-ui,sans-serif;color:#1f2547;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;cursor:"+(canEdit()?"pointer":"default")+";",x.proj||"");if(canEdit()){d.addEventListener("click",function(e){e.stopPropagation();ppop(d,x,cb);});}return d;}
function ppop(d,x,cb){cpop();var seen={},L=[];PJ.forEach(function(p){var c=String(p.code||"").trim();if(c&&!seen[c]){seen[c]=1;L.push({c:c,n:p.name||c});}});var sel=(x.proj||"").split(", ").filter(function(t){return t;}),b=d.getBoundingClientRect(),p=el("div","position:fixed;z-index:3000;left:"+Math.max(8,Math.min(b.left,window.innerWidth-360))+"px;top:"+Math.max(8,Math.min(b.bottom+4,window.innerHeight-340))+"px;width:340px;max-height:320px;overflow:auto;background:#fff;border-radius:12px;box-shadow:0 10px 30px rgba(106,90,214,.28);border:1px solid rgba(0,0,0,.06);padding:8px;box-sizing:border-box;");
if(!L.length){p.appendChild(el("div","padding:6px;font:700 9px system-ui,sans-serif;color:#9aa0bf;","\u041d\u0435\u0442 \u043f\u0440\u043e\u0435\u043a\u0442\u043e\u0432"));}
L.forEach(function(o){var l=el("label","display:flex;align-items:center;gap:8px;padding:5px 6px;border-radius:7px;cursor:pointer;font:9px system-ui,sans-serif;color:#1f2547;");var c=document.createElement("input");c.type="checkbox";c.checked=sel.indexOf(o.c)>=0;c.style.cssText="width:auto;height:auto;margin:0;flex:none;";c.addEventListener("change",function(){snp(true);var k=sel.indexOf(o.c);if(c.checked&&k<0){sel.push(o.c);}if(!c.checked&&k>=0){sel.splice(k,1);}var od=L.map(function(z){return z.c;});sel.sort(function(a,b){return od.indexOf(a)-od.indexOf(b);});x.proj=sel.join(", ");d.textContent=x.proj;cb();});l.addEventListener("mouseenter",function(){l.style.background="#f3f1fd";});l.addEventListener("mouseleave",function(){l.style.background="";});l.appendChild(c);l.appendChild(el("span","min-width:0;",o.n));p.appendChild(l);});
document.body.appendChild(p);FP=p;p._i=-1;p._m=function(e){if(!p.contains(e.target)&&!d.contains(e.target)){cpop();}};p._k=function(e){if(e.key==="Escape"){e.stopPropagation();cpop();}};document.addEventListener("mousedown",p._m,true);document.addEventListener("keydown",p._k,true);}
var LU=[],SA=null,SE=null,SB=null,SF=null,DG=false,KEYS=["pname","proj","inv","date","regn","regd","pdate","sum","rate",""];
function lu(){LU.forEach(function(f){f();});}
function rng(){if(!SA||!SE){return null;}return {r1:Math.min(SA.r,SE.r),r2:Math.max(SA.r,SE.r),c1:Math.min(SA.c,SE.c),c2:Math.max(SA.c,SE.c)};}
function paintS(){if(!SB){return;}var g=rng(),m=g&&(g.r1!==g.r2||g.c1!==g.c2);Array.prototype.forEach.call(SB.children,function(q,ri){Array.prototype.forEach.call(q.children,function(c,ci){if(c._o===undefined){c._o=c.style.background;}c.style.background=(m&&ri>=g.r1&&ri<=g.r2&&ci>=g.c1&&ci<=g.c2)?"#e2dcfb":c._o;});});}
function locS(t){if(!SB){return null;}var q=t;while(q&&q.parentNode!==SB){q=q.parentNode;}if(!q||!q._x){return null;}var ri=Array.prototype.indexOf.call(SB.children,q);if(q===t){return {r:ri,c:-1};}var c=t;while(c.parentNode!==q){c=c.parentNode;}return {r:ri,c:Array.prototype.indexOf.call(q.children,c)};}
function cellTx(x,c){var k=KEYS[c];if(c===9){return eqOf(x)?fm(eqOf(x)):"";}if(k==="date"||k==="regd"||k==="pdate"){return dm(x[k]);}if(k==="sum"||k==="rate"){return String(x[k]==null?"":x[k]).replace(/\s/g,"").replace(".",",");}return x[k]||"";}
function copyS(){var g=rng();if(!g||!SB){return null;}var o=[];for(var i=g.r1;i<=g.r2;i++){var q=SB.children[i];if(!q||!q._x){continue;}var a=[];for(var j=g.c1;j<=g.c2;j++){a.push(cellTx(q._x,j));}o.push(a.join("\t"));}while(o.length&&!o[o.length-1].replace(/\t/g,"")){o.pop();}return o.join("\n");}
function pv2(k,v){v=String(v==null?"":v).trim();if(k==="date"||k==="regd"||k==="pdate"){var m=/^(\d{1,2})[.\/-](\d{1,2})[.\/-](\d{4})$/.exec(v);if(m){return m[3]+"-"+("0"+m[2]).slice(-2)+"-"+("0"+m[1]).slice(-2);}return /^\d{4}-\d\d-\d\d$/.test(v)?v:"";}if(k==="sum"||k==="rate"){return v.replace(/\s/g,"").replace(",",".");}return v;}
function pasteS(tx){var g=rng();if(!g||!SB||!SF){return false;}snp(true);var ln=tx.replace(/\r/g,"").split("\n");if(ln.length>1&&ln[ln.length-1]===""){ln.pop();}var xs=[];Array.prototype.forEach.call(SB.children,function(q){if(q._x){xs.push(q._x);}});for(var i=0;i<ln.length;i++){var x=xs[g.r1+i];if(!x){break;}var cs=ln[i].split("\t");for(var j=0;j<cs.length;j++){var k=KEYS[g.c1+j];if(!k){continue;}x[k]=pv2(k,cs[j]);}if(x===NR&&EK.some(function(z){return x[z];})){RG.push(x);NR=mkr(PR);xs.push(NR);}}SF();lu();sv();return true;}
if(!window._fnCP){window._fnCP=1;
document.addEventListener("mouseup",function(){DG=false;},true);
document.addEventListener("keydown",function(e){if(!SB||!SB.isConnected||!(e.ctrlKey||e.metaKey)||e.altKey){return;}var k=({KeyA:"a",KeyC:"c",KeyZ:"z",KeyY:"y"})[e.code]||(e.key||"").toLowerCase(),ae=document.activeElement,inI=!!ae&&(ae.tagName==="INPUT"||ae.tagName==="TEXTAREA");if(k==="a"&&!inI){SA={r:0,c:0};SE={r:SB.children.length-1,c:9};paintS();e.preventDefault();return;}if((k==="z"||k==="y")&&!inI){e.preventDefault();undoS(k==="z"&&!e.shiftKey);return;}if(k!=="c"||!SA){return;}var g=rng(),mu=g.r1!==g.r2||g.c1!==g.c2;if(!mu&&inI){return;}var t=copyS();if(t==null){return;}e.preventDefault();try{navigator.clipboard.writeText(t);}catch(z){}},true);
document.addEventListener("paste",function(e){if(!SB||!SB.isConnected||!SA||!canEdit()){return;}var ae=document.activeElement,inI=!!ae&&(ae.tagName==="INPUT"||ae.tagName==="TEXTAREA");var tx=(e.clipboardData&&e.clipboardData.getData("text/plain"))||"";if(!tx){return;}var g=rng(),mu=g.r1!==g.r2||g.c1!==g.c2,many=tx.indexOf("\t")>=0||tx.replace(/\r?\n$/,"").indexOf("\n")>=0;if(inI&&!mu&&!many){return;}e.preventDefault();pasteS(tx);},true);}
var UH=[],RH=[],UT=0;
function snp(f){var now=Date.now();if(!f&&now-UT<1500){UT=now;return;}UT=now;var j=JSON.stringify(RG);if(UH.length&&UH[UH.length-1]===j){return;}UH.push(j);if(UH.length>60){UH.shift();}RH=[];}
function undoS(back){var A=back?UH:RH,B=back?RH:UH;if(!A.length){return;}B.push(JSON.stringify(RG));RG=JSON.parse(A.pop());if(SF){SF();}lu();sv();}
function rowX(x,body){var q=el("div",GR+"border-bottom:1px solid #eef0f8;"),eq=el("div","text-align:right;font:700 9px system-ui,sans-serif;color:#1e7a43;white-space:nowrap;"),rc=el("div","min-width:0;");
function upd(){var e=eqOf(x);eq.textContent=e?fm(e)+" $":"";}
function rr(){rc.innerHTML="";if(isU(curOf(x))){rc.appendChild(el("div","text-align:right;font:700 9px system-ui,sans-serif;color:#1f2547;","1"));}else{rc.appendChild(cellIn(x,"rate",1,0,done));}}
function done(){var f=EK.some(function(k){return x[k];});if(NR===x){if(!f){return;}RG.push(x);NR=mkr(PR);body.appendChild(rowX(NR,body));}else if(!f){if(q._g){return;}q._g=1;var ix=RG.indexOf(x);if(ix>=0){RG.splice(ix,1);}if(q.parentNode){q.parentNode.removeChild(q);}lu();sv();return;}upd();lu();sv();}
q.appendChild(cellIn(x,"pname",0,0,done));q.appendChild(cellP(x,done));q.appendChild(cellIn(x,"inv",0,0,done));q.appendChild(cellD(x,"date",done));q.appendChild(cellIn(x,"regn",0,0,done));q.appendChild(cellD(x,"regd",done));q.appendChild(cellD(x,"pdate",done));
var sw=el("div","display:flex;align-items:center;justify-content:flex-end;gap:4px;min-width:0;");sw.appendChild(cellIn(x,"sum",1,1,done));var cu=el("span","flex:none;font:700 9px system-ui,sans-serif;color:#4b3fb5;cursor:pointer;",curOf(x)||"\u2014");cu.addEventListener("click",function(){if(!canEdit()){return;}snp(true);var i=CUR.indexOf(curOf(x));x.cur=CUR[(i+1)%CUR.length];cu.textContent=x.cur;rr();done();});sw.appendChild(cu);q.appendChild(sw);
rr();q.appendChild(rc);upd();q.appendChild(eq);q._x=x;return q;}
function pnl(r){PR=r;if(NRK!==r.id){FS=[];UH=[];RH=[];}RG.forEach(function(x){if(!x.id){x.id=uid();}});if(!document.getElementById("fnInCss")){var sx=document.createElement("style");sx.id="fnInCss";sx.textContent="@keyframes fnIn{from{opacity:0;transform:translateX(60px)}to{opacity:1;transform:none}}";document.head.appendChild(sx);}
var P=el("div",(ANIM?"animation:fnIn .45s cubic-bezier(.22,1,.36,1) both;":"")+"flex:1 1 auto;min-width:0;margin:12px 16px 8px 8px;padding:0;background:#fff;border-radius:18px;box-shadow:0 2px 10px rgba(106,90,214,.08);overflow:auto;box-sizing:border-box;");ANIM=0;P.id="fnPnl";
var H=["\u0412\u0438\u0434 \u043e\u043f\u043b\u0430\u0442\u044b","\u041f\u0440\u043e\u0435\u043a\u0442","\u2116 \u0441\u0447\u0451\u0442\u0430","\u0414\u0430\u0442\u0430 \u0441\u0447\u0451\u0442\u0430","\u2116 \u0440\u0435\u0435\u0441\u0442\u0440\u0430","\u0414\u0430\u0442\u0430 \u0440\u0435\u0435\u0441\u0442\u0440\u0430","\u0414\u0430\u0442\u0430 \u043e\u043f\u043b\u0430\u0442\u044b","\u0421\u0443\u043c\u043c\u0430 \u043f\u043b\u0430\u0442\u0435\u0436\u0430","\u041a\u0443\u0440\u0441","\u0421\u0443\u043c\u043c\u0430 \u044d\u043a\u0432. \u0414\u043e\u043b\u043b\u0430\u0440 \u0421\u0428\u0410"];
var HD=el("div","position:sticky;top:0;z-index:3;background:#eceffa;min-width:880px;"),g=el("div",GR+"padding:10px 14px;");var HC=[];H.forEach(function(t,i){var c=el("div","font:700 9px system-ui,sans-serif;color:#4b3fb5;text-align:"+(i>6?"right":"left")+";cursor:pointer;user-select:none;padding:3px 6px;margin:-3px -6px;border-radius:8px;",t);c.style.background=FS[i]?"#d9d3f7":"";c.addEventListener("click",function(e){e.stopPropagation();if(e.ctrlKey||e.metaKey){SA={r:0,c:i};SE={r:body.children.length-1,c:i};paintS();return;}pop(i,c);});HC.push(c);g.appendChild(c);});HD.appendChild(g);
P.appendChild(HD);var body=el("div","min-width:880px;");P.appendChild(body);
if(!NR||NRK!==r.id){NR=mkr(r);NRK=r.id;}
function vl(x){return [x.pname||"",x.proj||"",x.inv||"",dm(x.date),x.regn||"",dm(x.regd),dm(x.pdate),x.sum?fm(nm(x.sum))+" "+curOf(x):"",isU(curOf(x))?"1":String(x.rate||""),eqOf(x)?fm(eqOf(x)):""];}
function flt(x){var v=vl(x);for(var j=0;j<10;j++){var z=FS[j];if(z){var vv=j===1?(v[j]?v[j].split(", "):[""]):[v[j]];if(!vv.some(function(t){return z.indexOf(t)>=0;})){return false;}}}return true;}
function cpop(){if(FP){document.removeEventListener("mousedown",FP._m,true);document.removeEventListener("keydown",FP._k,true);FP.remove();FP=null;}}
function pop(i,hc){if(FP&&FP._i===i){cpop();return;}cpop();var vs=[],seen={};pays(r).forEach(function(x){var t=vl(x)[i];(i===1?(t?t.split(", "):[""]):[t]).forEach(function(u){if(!seen[u]){seen[u]=1;vs.push(u);}});});
vs.sort(function(a,b){if(a===""){return -1;}if(b===""){return 1;}if(i===3||i===5||i===6){return a.split(".").reverse().join("").localeCompare(b.split(".").reverse().join(""));}if(i>6){return nm(a)-nm(b);}return a.localeCompare(b,"ru",{numeric:true});});
var sel=FS[i]?FS[i].slice():vs.slice(),q="",b=hc.getBoundingClientRect(),p=el("div","position:fixed;z-index:3000;left:"+Math.max(8,Math.min(b.left,window.innerWidth-250))+"px;top:"+(b.bottom+6)+"px;width:230px;max-height:340px;display:flex;flex-direction:column;background:#fff;border-radius:12px;box-shadow:0 10px 30px rgba(106,90,214,.28);border:1px solid rgba(0,0,0,.06);padding:8px;box-sizing:border-box;");
var si=document.createElement("input");si.type="text";si.placeholder="\u041f\u043e\u0438\u0441\u043a";si.style.cssText="flex:none;width:100%;box-sizing:border-box;height:24px;margin:0 0 6px;border:0;border-radius:12px;outline:none;background:#f3f1fd;padding:0 10px;font:9px system-ui,sans-serif;color:#1f2547;";
var ls=el("div","flex:1 1 auto;min-height:0;overflow:auto;");
function vis(){return vs.filter(function(t){return !q||(t||"(\u043f\u0443\u0441\u0442\u043e)").toLowerCase().indexOf(q)>=0;});}
function ap(){FS[i]=sel.length===vs.length?null:sel.slice();HC[i].style.background=FS[i]?"#d9d3f7":"";fill();}
function item(lab,on,fn){var l=el("label","display:flex;align-items:center;gap:8px;padding:4px 6px;border-radius:7px;cursor:pointer;font:9px system-ui,sans-serif;color:#1f2547;white-space:nowrap;");var c=document.createElement("input");c.type="checkbox";c.checked=on;c.style.cssText="width:auto;height:auto;margin:0;flex:none;";c.addEventListener("change",function(){fn(c.checked);});l.appendChild(c);l.appendChild(el("span","overflow:hidden;text-overflow:ellipsis;",lab));l.addEventListener("mouseenter",function(){l.style.background="#f3f1fd";});l.addEventListener("mouseleave",function(){l.style.background="";});return l;}
function rd(){ls.innerHTML="";var v=vis();ls.appendChild(item("(\u0412\u044b\u0434\u0435\u043b\u0438\u0442\u044c \u0432\u0441\u0451)",v.length>0&&v.every(function(t){return sel.indexOf(t)>=0;}),function(on){v.forEach(function(t){var k=sel.indexOf(t);if(on&&k<0){sel.push(t);}if(!on&&k>=0){sel.splice(k,1);}});ap();rd();}));v.forEach(function(t){ls.appendChild(item(t||"(\u043f\u0443\u0441\u0442\u043e)",sel.indexOf(t)>=0,function(on){var k=sel.indexOf(t);if(on&&k<0){sel.push(t);}if(!on&&k>=0){sel.splice(k,1);}ap();rd();}));});}
si.addEventListener("input",function(){q=si.value.trim().toLowerCase();rd();});si.addEventListener("keydown",function(e){e.stopPropagation();});
p.appendChild(si);p.appendChild(ls);rd();document.body.appendChild(p);FP=p;p._i=i;p._m=function(e){if(!p.contains(e.target)&&!hc.contains(e.target)){cpop();}};p._k=function(e){if(e.key==="Escape"){e.stopPropagation();cpop();}};document.addEventListener("mousedown",p._m,true);document.addEventListener("keydown",p._k,true);si.focus();}
function fill(){SA=null;SE=null;body.innerHTML="";pays(r).filter(flt).forEach(function(x){body.appendChild(rowX(x,body));});if(canEdit()){body.appendChild(rowX(NR,body));}}
var ec=pays(r).filter(function(x){return !EK.some(function(k){return x[k];});});if(ec.length){RG=RG.filter(function(x){return ec.indexOf(x)<0;});sv();}SB=body;SF=fill;body.addEventListener("contextmenu",function(e){if(!canEdit()){return;}var L=locS(e.target);if(!L){return;}e.preventDefault();var g=rng(),r1=L.r,r2=L.r;if(g&&L.r>=g.r1&&L.r<=g.r2&&(g.r1!==g.r2||L.c<0)){r1=g.r1;r2=g.r2;}var old=document.getElementById("fnCtx");if(old){old.remove();}var m=el("div","position:fixed;z-index:4000;min-width:170px;background:#fff;border-radius:12px;padding:6px;box-shadow:0 10px 30px rgba(106,90,214,.28);border:1px solid rgba(0,0,0,.06);left:"+Math.min(e.clientX,window.innerWidth-190)+"px;top:"+Math.min(e.clientY,window.innerHeight-60)+"px;");m.id="fnCtx";function cl(){document.removeEventListener("mousedown",md,true);document.removeEventListener("keydown",kd,true);m.remove();}function md(ev){if(!m.contains(ev.target)){cl();}}function kd(ev){if(ev.key==="Escape"){cl();}}var dl=[];for(var i=r1;i<=r2;i++){var q=body.children[i];if(q&&q._x&&q._x!==NR){dl.push(q._x);}}if(!dl.length){return;}var d=el("div","padding:7px 12px;border-radius:8px;cursor:pointer;font:700 10px system-ui,sans-serif;color:#d9534f;",dl.length>1?"\u0423\u0434\u0430\u043b\u0438\u0442\u044c \u0441\u0442\u0440\u043e\u043a\u0438 ("+dl.length+")":"\u0423\u0434\u0430\u043b\u0438\u0442\u044c \u0441\u0442\u0440\u043e\u043a\u0443");d.addEventListener("mouseenter",function(){d.style.background="#fdeeee";});d.addEventListener("mouseleave",function(){d.style.background="";});d.addEventListener("click",function(){cl();snp(true);RG=RG.filter(function(z){return dl.indexOf(z)<0;});fill();lu();sv();});m.appendChild(d);document.body.appendChild(m);document.addEventListener("mousedown",md,true);document.addEventListener("keydown",kd,true);});body.addEventListener("mousedown",function(e){var L=locS(e.target);if(!L){return;}if(L.c<0){SA={r:L.r,c:0};SE={r:L.r,c:9};DG=false;paintS();e.preventDefault();return;}if(e.shiftKey&&SA){SE=L;paintS();e.preventDefault();return;}SA=L;SE=L;DG=true;paintS();});body.addEventListener("mouseover",function(e){if(!DG||!SA||!(e.buttons&1)){return;}var L=locS(e.target);if(!L||L.c<0||(L.r===SE.r&&L.c===SE.c)){return;}SE=L;if(L.r!==SA.r||L.c!==SA.c){var ae=document.activeElement;if(ae&&ae.tagName==="INPUT"){ae.blur();}var gs=window.getSelection&&window.getSelection();if(gs){gs.removeAllRanges();}}paintS();});fill();return P;}
function draw(){
if(!BODY){return;}
BODY.innerHTML="";LU=[];var LEFT=el("div","flex:none;width:405px;display:flex;flex-direction:column;min-height:0;");
var hl=el("div","flex:none;display:flex;gap:8px;align-items:center;padding:12px 8px 8px;margin:0 0 0 7px;width:389px;box-sizing:border-box;");
var si=document.createElement("input");si.type="text";si.id="fnSearch";si.value=PQ;si.placeholder="\u041f\u043e\u0438\u0441\u043a: \u043f\u043e\u0434\u0440\u044f\u0434\u0447\u0438\u043a, \u043f\u0440\u043e\u0435\u043a\u0442, \u2116 \u043a\u043e\u043d\u0442\u0440\u0430\u043a\u0442\u0430";
si.style.cssText="box-sizing:border-box;flex:1 1 auto;min-width:0;height:26px;margin:0;padding:0 12px;border:0;border-radius:13px;outline:none;background:#fff;box-shadow:inset 0 0 0 1px #d9d3f7;font:700 9px system-ui,sans-serif;color:#1f2547;";
si.addEventListener("keydown",function(e){e.stopPropagation();});
si.addEventListener("input",function(){PQ=si.value;var p=si.selectionStart;draw();var n=document.getElementById("fnSearch");if(n){n.focus();n.setSelectionRange(p,p);}});
hl.appendChild(si);

LEFT.appendChild(hl);
var LW=el("div","flex:1 1 auto;min-height:0;box-sizing:border-box;width:389px;margin:0 0 8px 7px;padding:8px 0 4px;background:#fff;border-radius:18px;box-shadow:0 2px 10px rgba(106,90,214,.08);overflow-y:auto;");
var q=PQ.trim().toLowerCase();
var list=rows().filter(function(r){
if(!!r.p.arch!==PAR){return false;}
if(!q){return true;}
return [r.ctype,r.who,r.cnum,r.sum,r.cur].join(" ").toLowerCase().indexOf(q)>=0;
});
if(LD){if(!document.getElementById("fnSpinCss")){var sp=document.createElement("style");sp.id="fnSpinCss";sp.textContent="@keyframes fnSpin{to{transform:rotate(360deg)}}";document.head.appendChild(sp);}LW.appendChild(el("div","width:34px;height:34px;margin:60px auto 0;border-radius:50%;box-sizing:border-box;border:3px solid;border-color:#6A5BD6 #5B94D0 #5FD2B0 #e3e6f2;animation:fnSpin .9s linear infinite;"));}
else if(!list.length){LW.appendChild(el("div","padding:10px 27px;font:700 10px system-ui,sans-serif;color:#9aa0bf;","\u041d\u0435\u0442 \u0437\u0430\u043f\u0438\u0441\u0435\u0439"));}
else{list.forEach(function(r,i){LW.appendChild(rowEl(r,i));});}
LEFT.appendChild(LW);BODY.appendChild(LEFT);var sr=rows().filter(function(x){return x.id===SEL;})[0];if(sr){BODY.appendChild(pnl(sr));}
}
function load(){
LD=true;draw();
var j=function(r){return r.ok?r.json():[];};
Promise.all([fetch("/api/tend",{credentials:"same-origin"}).then(j),fetch("/api/plans",{credentials:"same-origin"}).then(j),fetch("/api/reg",{credentials:"same-origin"}).then(j).catch(function(){return [];}),fetch("/api/con3",{credentials:"same-origin"}).then(j).catch(function(){return [];}),fetch("/api/tenders",{credentials:"same-origin"}).then(j).catch(function(){return [];})]).then(function(a){TD=arr(a[0]);PL=arr(a[1]);RG=arr(a[2]);CN=arr(a[3]);PJ=arr(a[4]);LD=false;draw();}).catch(function(){LD=false;draw();});
}
function closeF(){if(!W){return;}var w=W;W=null;LC=Date.now();w.style.clipPath="inset(0 100% 0 0)";setTimeout(function(){w.remove();},470);}
window.upmoFinClose=closeF;
window.upmoFin=function(){
if(W){closeF();return;}
if(Date.now()-LC<560){return;}
W=el("div","position:fixed;z-index:2000;top:16px;bottom:16px;left:104px;right:16px;background:#f7f7fd;border-radius:0 20px 20px 0;box-sizing:border-box;border:1px solid rgba(0,0,0,.06);box-shadow:0 8px 32px rgba(106,90,214,.18);overflow:hidden;display:flex;flex-direction:column;clip-path:inset(0 100% 0 0);transition:clip-path .45s cubic-bezier(.22,1,.36,1);");
W.id="fnWin";
BODY=el("div","flex:1;min-height:0;display:flex;flex-direction:row;overflow:hidden;background:#f7f7fd;");
W.appendChild(BODY);
document.body.appendChild(W);
draw();
void W.offsetWidth;
W.style.clipPath="inset(0 0 0 0)";
load();
};
document.addEventListener("keydown",function(e){if(e.key==="Escape"&&W){closeF();}});
document.addEventListener("click",function(e){if(!W){return;}var t=e.target;if(!t||!t.closest){return;}if(t.closest("#fnWin")){return;}var b=t.closest(".buttons button");if((b&&b.id!=="ewBtn"&&b.id!=="sideBtn_finance")||t.closest("#sideLogo")){closeF();}},true);
})();
