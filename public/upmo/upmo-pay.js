(function(){
var L1='\u0412\u043d\u0443\u0442\u0440\u0435\u043d\u043d\u0438\u0439',L2='\u041a\u043e\u043d\u0442\u0440\u0430\u043a\u0442';
var S1='\u041e\u0441\u043d\u043e\u0432\u043d\u044b\u0435 \u043f\u0440\u043e\u0435\u043a\u0442\u044b',S2='\u0412\u0441\u043f\u043e\u043c\u043e\u0433\u0430\u0442\u0435\u043b\u044c\u043d\u044b\u0435 \u043f\u0440\u043e\u0435\u043a\u0442\u044b';
var EASE='cubic-bezier(.22,1,.36,1)',FS='10px',GRAD='linear-gradient(135deg,#7a68e0,#5b49c8)';
function items(k){var P=(typeof PROJECTS!=='undefined')?PROJECTS:{};return (P[k]&&P[k].items)||[];}
function el(t,css,txt){var e=document.createElement(t);if(css){e.style.cssText=css;}if(txt!==undefined){e.textContent=txt;}return e;}
function mkRow(it){var r=el('div','display:flex;align-items:center;gap:10px;padding:6px 10px;border-bottom:1px solid #ececf4;color:#1f2937;font-size:'+FS+';flex:none;');r.appendChild(el('b','white-space:nowrap;flex:none;',it.code));r.appendChild(el('span','white-space:nowrap;',it.name));return r;}
function mkSec(t){return el('div','font-size:'+FS+';font-weight:700;color:#4b3fb5;padding:8px 10px 4px;flex:none;',t);}
var HEAD='display:flex;align-items:center;justify-content:center;box-sizing:border-box;margin:0;width:100%;height:22px;min-height:22px;max-height:22px;border:0;border-radius:14px;background:transparent;color:#4b3fb5;font:700 9px/1 system-ui,sans-serif;cursor:pointer;padding:0 0 2px;outline:none;-webkit-appearance:none;appearance:none;transition:color .3s ease,background .3s ease;';
function slide(bd,open){bd._o=open;if(open){bd.style.maxHeight=bd.firstChild.scrollHeight+'px';setTimeout(function(){if(bd._o){bd.style.maxHeight='none';}},520);}else{bd.style.maxHeight=bd.scrollHeight+'px';void bd.offsetHeight;bd.style.maxHeight='0px';}}﻿﻿﻿var LSK='upmoSvod',ST={},SUMS=[],ROWS=[],DATA={},PCT={},STG={},TOT={},COLS='minmax(0,1fr) 80px 150px 66px 100px 100px 100px 100px 72px 72px',CURS=['\u0421\u0443\u043c','\u0414\u043e\u043b\u043b\u0430\u0440','\u0415\u0432\u0440\u043e','\u042e\u0430\u043d\u044c'];
var STL=['\u041d\u0435 \u043d\u0430\u0447\u0430\u0442\u043e','\u0412\u044b\u043f\u043e\u043b\u043d\u044f\u0435\u0442\u0441\u044f','\u0417\u0430\u0432\u0435\u0440\u0448\u0435\u043d\u043e'],STS=['background:#fff;color:#6b7280;border-color:#d1d5db;','background:#fdf0a6;color:#854d0e;border-color:#f0d65a;','background:#c9f0d8;color:#166534;border-color:#9ddbb5;'];
try{ST=JSON.parse(localStorage.getItem(LSK))||{};}catch(e){ST={};}
function stSave(){try{localStorage.setItem(LSK,JSON.stringify(ST));}catch(e){}}
function numv(x){var n=Number(x);return(x===null||x===undefined||x===''||isNaN(n))?null:n;}
function fmn(n){if(n===null||n===undefined||isNaN(n)){return '';}return Math.round(Number(n)).toString().replace(/\B(?=(\d{3})+(?!\d))/g,'\u00a0');}
function dateIso(s){var t=String(s||''),m=/^(\d{4})-(\d{2})-(\d{2})/.exec(t);if(m){return m[1]+'-'+m[2]+'-'+m[3];}m=/^(\d{2})\.(\d{2})\.(\d{4})/.exec(t);return m?m[3]+'-'+m[2]+'-'+m[1]:'';}
function fd(iso){var m=/^(\d{4})-(\d{2})-(\d{2})$/.exec(iso||'');return m?m[3]+'.'+m[2]+'.'+m[1]:'';}
function costOf(code){var s=ST[code],o=DATA[code]||{},ms=msOf(code);if(ms===2){var f=numv(o.done);if(f!==null&&f>0){return f;}}if(s&&s.cost!==undefined&&s.cost!==''){return numv(s.cost);}if(TOT[code]!==undefined){return TOT[code];}return numv(o.cost);}
function curOf(code){return (ST[code]&&ST[code].cur)||CURS[0];}
function stOf(c,d){var dd=d||0;if(dd<=0){return 0;}if(c!==null&&c>0&&dd>=c*0.999){return 2;}return 1;}
function pill(){return el('div','justify-self:stretch;');}
function setPill(p,s){if(s===null||s===undefined){p.textContent='';p.style.cssText='justify-self:stretch;';return;}p.textContent=STL[s];p.style.cssText='justify-self:stretch;box-sizing:border-box;text-align:center;padding:3px 2px;border-radius:6px;font-size:9px;font-weight:700;white-space:nowrap;border:1px solid transparent;'+(p._c?'cursor:pointer;':'')+STS[s];}
var MENU=null;function closeMenu(){var m=MENU;MENU=null;if(m&&m.parentNode){m.style.pointerEvents='none';m.style.opacity='0';m.style.transform='translateY(-6px) scaleY(.85)';setTimeout(function(){if(m.parentNode){m.parentNode.removeChild(m);}},180);}}if(!window._svMenuBound){window._svMenuBound=1;document.addEventListener('click',closeMenu);}
function openMenu(p,cb){if(MENU&&MENU._p===p){closeMenu();return;}closeMenu();var rc=p.getBoundingClientRect(),m=el('div','position:fixed;z-index:99999;box-sizing:border-box;left:'+rc.left+'px;top:'+(rc.bottom+4)+'px;width:'+rc.width+'px;background:#fff;border-radius:8px;box-shadow:0 4px 14px rgba(0,0,0,.16);padding:4px;display:flex;flex-direction:column;gap:4px;transform-origin:top;opacity:0;transform:translateY(-6px) scaleY(.85);transition:opacity .18s ease,transform .22s cubic-bezier(.22,1,.36,1);');[[0,STS[0]],[1,STS[1]],[2,STS[2]],[null,'background:#fff;color:#4b3fb5;border-color:#c9c0f5;']].forEach(function(q){var t=q[0]===null?'\u0410\u0432\u0442\u043e':STL[q[0]],it=el('div','box-sizing:border-box;text-align:center;padding:3px 2px;border-radius:6px;font-size:9px;font-weight:700;white-space:nowrap;cursor:pointer;border:1px solid transparent;'+q[1],t);it.addEventListener('click',function(e){e.stopPropagation();closeMenu();cb(q[0]);});m.appendChild(it);});document.body.appendChild(m);void m.offsetHeight;m.style.opacity='1';m.style.transform='none';m._p=p;MENU=m;}
function inp(){var i=el('input','width:100%;box-sizing:border-box;border:1px solid #d9d4f5;background:#fff;font:inherit;color:inherit;padding:3px 5px;border-radius:6px;outline:none;');i.type='text';i.addEventListener('focus',function(){i.style.borderColor='#6a5be0';});i.addEventListener('blur',function(){i.style.borderColor='#d9d4f5';});return i;}
function agg(rows){var a={c:null,d:null,p:null,r:null,s:'',e:'',cur:'',st:null},cu={},n=[0,0,0],nn=0;rows.forEach(function(x){var v=x._v();if(v.c!==null||v.d!==null){cu[v.cur]=1;}if(v.c!==null){a.c=(a.c||0)+v.c;}if(v.d!==null){a.d=(a.d||0)+v.d;}if(v.p!==null){a.p=(a.p||0)+v.p;}if(v.r!==null){a.r=(a.r||0)+v.r;}if(v.s&&(!a.s||v.s<a.s)){a.s=v.s;}if(v.e&&(!a.e||v.e>a.e)){a.e=v.e;}if(v.st!==null){n[v.st]++;nn++;}});var ks=Object.keys(cu);if(ks.length>1){a.c=null;a.d=null;a.p=null;a.r=null;a.cur='';}else if(ks.length===1){a.cur=ks[0];}if(nn){a.st=n[2]===nn?2:(n[0]===nn?0:1);}return a;}
function mkRowS(it,isP){
 var code=it.code,r=el('div','display:grid;grid-template-columns:'+COLS+';gap:8px;align-items:center;padding:5px 12px;border-bottom:1px solid #ececf4;font-size:'+FS+';color:#1f2937;background:#fff;');
 var nm=el('div','white-space:nowrap;overflow:hidden;text-overflow:ellipsis;');nm.appendChild(el('b','',code));nm.appendChild(document.createTextNode(' '+it.name));nm.title=code+' '+it.name;
 var sp=pill();if(isP){sp._c=true;sp.addEventListener('click',function(e){e.stopPropagation();openMenu(sp,function(v){var o=(ST[code]=ST[code]||{});if(v===null){delete o.st;}else{o.st=v;}stSave();r._upd();SUMS.forEach(function(f){f();});});});}
 var ex=inp();ex.value=(ST[code]&&ST[code].ex)||'';ex.addEventListener('input',function(){(ST[code]=ST[code]||{}).ex=ex.value;stSave();});
 var cu=el('select','width:100%;border:1px solid #d9d4f5;background:#fff;font:inherit;color:inherit;padding:3px 2px;border-radius:6px;outline:none;cursor:pointer;');
 CURS.forEach(function(c){var o=document.createElement('option');o.value=c;o.textContent=c;cu.appendChild(o);});cu.value=curOf(code);
 cu.addEventListener('change',function(){(ST[code]=ST[code]||{}).cur=cu.value;stSave();SUMS.forEach(function(f){f();});});
 var co=inp();co.style.textAlign='right';
 function setCo(){var v=costOf(code);co.value=v===null?'':fmn(v);}
 co.addEventListener('focus',function(){co.select();});
 co.addEventListener('input',function(){var v=co.value,pos=co.selectionStart,dg=v.slice(0,pos).replace(/\D/g,'').length,o=v.replace(/\D/g,'').replace(/\B(?=(\d{3})+(?!\d))/g,'\u00a0'),n=0,k=0;co.value=o;while(k<o.length&&n<dg){if(/\d/.test(o.charAt(k))){n++;}k++;}try{co.setSelectionRange(k,k);}catch(e){}});
 co.addEventListener('blur',function(){var t=co.value.replace(/\D/g,'');(ST[code]=ST[code]||{}).cost=t;stSave();r._upd();SUMS.forEach(function(f){f();});});
 co.addEventListener('keydown',function(e){if(e.key==='Enter'){co.blur();}});
 var dn=el('div','text-align:right;'),pd=el('div','text-align:right;'),rs=el('div','text-align:right;'),st=el('div','text-align:center;'),en=el('div','text-align:center;');
 r._v=function(){var o=DATA[code]||{},c=costOf(code),ms=msOf(code),d=isP?((c!==null&&PCT[code]!==undefined)?c*PCT[code]:null):numv(o.done);return {c:c,d:d,p:isP?numv(o.done):null,r:(isP&&c!==null)?c-(numv(o.done)||0):null,s:dateIso(o.start),e:dateIso(o.end),cur:curOf(code),st:isP?(ms!==undefined?ms:stOf(c,d)):null};};
 r._upd=function(){var v=r._v();setCo();dn.textContent=fmn(v.d);pd.textContent=fmn(v.p);rs.textContent=fmn(v.r);st.textContent=fd(v.s);en.textContent=fd(v.e);setPill(sp,v.st);};
 [nm,sp,ex,cu,co,dn,pd,rs,st,en].forEach(function(x){r.appendChild(x);});ROWS.push(r);r._upd();return r;
}
function acc3(parent,title,hcss,fill,cardCss,noSt){
 var card=el('div',cardCss),hd=el('div',hcss+'display:grid;grid-template-columns:'+COLS+';gap:8px;align-items:center;');
 hd.appendChild(el('div','white-space:nowrap;overflow:hidden;text-overflow:ellipsis;',title));
 var cs=[];[1,2,3,4,5,6,7,8,9].forEach(function(i){var x=i===1?pill():el('div','text-align:'+(i>=4&&i<=7?'right':(i>7?'center':'left'))+';white-space:nowrap;');hd.appendChild(x);cs[i]=x;});
 var bd=el('div','max-height:0;overflow:hidden;transition:max-height .5s '+EASE+';'),inn=el('div','padding:0 10px 10px;');
 var rows=fill(inn)||[];bd.appendChild(inn);card.appendChild(hd);card.appendChild(bd);parent.appendChild(card);card._rows=rows;
 function sum(){var a=agg(rows);if(!noSt){setPill(cs[1],a.st);}cs[3].textContent=a.cur;cs[4].textContent=fmn(a.c);cs[5].textContent=fmn(a.d);cs[6].textContent=fmn(a.p);cs[7].textContent=fmn(a.r);cs[8].textContent=fd(a.s);cs[9].textContent=fd(a.e);}
 SUMS.push(sum);sum();
 var op=false;hd.addEventListener('click',function(e){e.stopPropagation();op=!op;slide(bd,op);});
 return card;
}
﻿function msOf(code){if(ST[code]&&ST[code].st!==undefined){return ST[code].st;}return STG[code];}
function nz(v){var s=String(v==null?'':v).replace(/[\s\u00a0]/g,'').replace(',','.'),n=Number(s);return(s===''||isNaN(n))?null:n;}
function pctCalc(G){var B=G&&G.t&&G.t.Basic;if(!B||!B.c){return false;}var ic=B.c.indexOf('Code'),q=B.c.indexOf('Quantity'),a=B.c.indexOf('Actual Q'),m=B.c.indexOf('Man-Hours'),x=B.c.indexOf('Actual MH');if(ic<0||m<0){return false;}var SM={},SA={},SS=(G.t.Cost&&G.t.Cost.st)||{};Object.keys(SS).forEach(function(k){var v=SS[k];STG[k]=(v==='Completed')?2:(v==='In progress'?1:(v==='Not started'?0:undefined));});var TT=(G.t.Cost&&G.t.Cost.tot)||{};Object.keys(TT).forEach(function(k){var n=nz(TT[k]);if(n!==null){TOT[k]=n;}});(B.r||[]).forEach(function(r){var c=r[ic];if(!c){return;}var M=nz(r[m]),Q=q>=0?nz(r[q]):null,A=a>=0?nz(r[a]):null,X=x>=0?nz(r[x]):null,ah=(Q!==null&&Q>0&&A!==null&&M!==null)?M*A/Q:(X||0);SM[c]=(SM[c]||0)+(M||0);SA[c]=(SA[c]||0)+ah;});Object.keys(SM).forEach(function(c){PCT[c]=SM[c]>0?Math.min(1,SA[c]/SM[c]):0;});return true;}
function pctLoad(){function fin(){ROWS.forEach(function(x){x._upd();});SUMS.forEach(function(f){f();});}fetch('/api/prepgrid',{credentials:'same-origin'}).then(function(x){return x.text();}).then(function(t){var G=null;try{G=JSON.parse(t);}catch(e){}if(G&&typeof G.data==='string'){try{G=JSON.parse(G.data);}catch(e){}}else if(G&&G.data&&G.data.t){G=G.data;}if(!pctCalc(G)){throw 1;}fin();}).catch(function(){try{pctCalc(JSON.parse(localStorage.getItem('upmoPrepGrid')));fin();}catch(e){}});}
function svod(r){
 SUMS.length=0;ROWS.length=0;
 var PN={OPS01:'\u0412\u043d\u0435\u043f\u0440\u043e\u0435\u043a\u0442\u043d\u044b\u0435 \u043e\u0431\u044a\u0435\u043a\u0442\u044b'};items('main').concat(items('aux')).forEach(function(p){PN[p.code]=p.name;});
 var d=el('div','height:100%;overflow:auto;box-sizing:border-box;padding:12px 16px 24px;scrollbar-width:none;');
 var w=el('div','min-width:1000px;display:flex;flex-direction:column;gap:14px;');
 var th=el('div','display:grid;grid-template-columns:'+COLS+';gap:8px;padding:2px 22px;font-size:10px;font-weight:700;color:#4b3fb5;');
 ['','\u0421\u0442\u0430\u0442\u0443\u0441','\u0418\u0441\u043f\u043e\u043b\u043d\u0438\u0442\u0435\u043b\u044c','\u0412\u0430\u043b\u044e\u0442\u0430','\u0421\u0442\u043e\u0438\u043c\u043e\u0441\u0442\u044c','\u0412\u044b\u043f\u043e\u043b\u043d\u0435\u043d\u043e','\u041e\u043f\u043b\u0430\u0447\u0435\u043d\u043e','\u041e\u0441\u0442\u0430\u0442\u043e\u043a','\u041d\u0430\u0447\u0430\u043b\u043e','\u041e\u043a\u043e\u043d\u0447\u0430\u043d\u0438\u0435'].forEach(function(t,i){th.appendChild(el('div','text-align:'+(i>=4&&i<=7?'right':(i>7?'center':'left'))+';',t));});
 w.appendChild(th);
 var CARD='flex:none;border-radius:16px;background:#f7f8fc;box-shadow:-3px -3px 10px rgba(106,90,224,.35),3px 3px 10px rgba(29,211,176,.35),0 0 12px rgba(74,144,217,.3);overflow:hidden;opacity:0;transform:translateX(60px);transition:opacity .4s ease,transform .45s '+EASE+';';
 var H1='padding:11px 22px;font-size:11px;font-weight:700;color:#1f2937;cursor:pointer;user-select:none;',H2='padding:7px 12px;font-size:11px;font-weight:700;color:#1f2937;cursor:pointer;user-select:none;';
 [['\u041f\u043e\u0434\u0433\u043e\u0442\u043e\u0432\u0438\u0442\u0435\u043b\u044c\u043d\u044b\u0435 \u0440\u0430\u0431\u043e\u0442\u044b','prep'],[S1,'main'],[S2,'aux']].forEach(function(q,qi){
  var isP=q[1]==='prep';
  var card=acc3(w,q[0],H1,function(inn){
   if(!isP){var rs=[];items(q[1]).forEach(function(it){var x=mkRowS(it,false);inn.appendChild(x);rs.push(x);});return rs;}
   var G={},O=[],all=[];items('prep').forEach(function(it){var g=it.code.split('-')[0];if(!G[g]){G[g]=[];O.push(g);}G[g].push(it);});
   O.forEach(function(g){var c=acc3(inn,g+' '+(PN[g]||''),H2,function(k){k.style.cssText='padding:0;background:#fff;';var rs=[];G[g].forEach(function(it){var x=mkRowS(it,true);k.appendChild(x);rs.push(x);});return rs;},'margin-top:6px;border-radius:10px;background:#dfe7f5;overflow:hidden;');all=all.concat(c._rows);});
   return all;
  },CARD,true);
  setTimeout(function(){card.style.opacity='1';card.style.transform='none';},60+qi*120);
 });
 d.appendChild(w);r.appendChild(d);
 fetch('/api/prep/objects',{credentials:'same-origin'}).then(function(x){return x.json();}).then(function(list){(list||[]).forEach(function(o){DATA[o.code]=o;});ROWS.forEach(function(x){x._upd();});SUMS.forEach(function(f){f();});}).catch(function(){});pctLoad();
}
var CUR=null,CONT=null,IO=null,SV=null;function svodOn(v){if(!SV){return;}if(!v&&SV._on&&CONT&&!SV._fade){CONT.innerHTML='';}SV._on=v;SV.style.background=v?GRAD:'#fff';SV.style.color=v?'#fff':'#4b3fb5';SV.style.boxShadow=v?'0 2px 8px rgba(91,73,200,.35)':'inset 0 0 0 1px #c9c0f5';}function showIO(v){if(IO){IO.style.display=v?'flex':'none';}}function acc(label,fill){
 var cell=el('div','flex:none;width:110px;position:relative;height:22px;transition:width .55s '+EASE+';');
 var card=el('div','position:absolute;left:0;top:0;box-sizing:border-box;width:100%;min-height:22px;z-index:20;border-radius:14px;overflow:hidden;background:#fff;box-shadow:inset 0 0 0 1px #c9c0f5;transition:background .3s ease,box-shadow .3s ease;');
 var head=el('button',HEAD,label);
 var body=el('div','max-height:0;overflow:hidden;transition:max-height .55s '+EASE+';');
 var inn=el('div','padding:4px 8px 8px;display:flex;flex-direction:column;box-sizing:border-box;overflow-y:auto;scrollbar-width:none;');
 var rows=fill(inn);
 body.appendChild(inn);card.appendChild(head);card.appendChild(body);cell.appendChild(card);
 var open=false,api={close:function(){if(!open){return;}open=false;shut();}};function shut(){body.style.maxHeight='0px';cell.style.width='110px';card.style.boxShadow='inset 0 0 0 1px #c9c0f5';head.style.color='#4b3fb5';head.style.background='transparent';}
 head.addEventListener('click',function(){
  open=!open;
  if(open){
   svodOn(false);if(CUR&&CUR!==api){CUR.close();}CUR=api;card.style.boxShadow='0 4px 14px rgba(0,0,0,.18)';head.style.background=GRAD;head.style.color='#fff';cell.style.width='460px';
   var H=Math.min(rows.length*30+24,Math.round(window.innerHeight*0.85));inn.style.maxHeight=H+'px';
   rows.forEach(function(r,i){r.style.opacity='0';r.style.transform='translateY(-10px)';r.style.transition='opacity .35s ease,transform .4s '+EASE;setTimeout(function(){if(open){r.style.opacity='1';r.style.transform='none';}},200+i*35);});
   body.style.maxHeight=(H+16)+'px';
  }else{
   shut();if(CUR===api){CUR=null;}
  }
 });
 return cell;
}
function hideOP(c){var g=c.querySelector('[data-grp]'),t=c.querySelector('table');if(!g||!t){return;}var L=g;while(L&&!L.contains(t)){L=L.parentNode;}if(!L||L===g||L===t){return;}var a=g;while(a.parentNode&&a.parentNode!==L){a=a.parentNode;}if(a&&!a.contains(t)){a.style.display='none';}}
function fixTB(c){var g=c.firstChild,tb=g&&g.lastElementChild;if(!tb||tb.tagName==='STYLE'||tb.querySelector('.gs')||tb.style.position==='absolute'){return;}var pd=tb.querySelector('[data-a="pdate"]');if(pd&&pd.parentNode){pd.parentNode.removeChild(pd);}tb.style.cssText+=';position:absolute;top:0;right:12px;left:auto;width:auto;height:34px;padding:0;border:0;background:transparent;z-index:30;box-sizing:border-box;';}
function pick(code){if(!document.getElementById('payCss2')){var s2=document.createElement('style');s2.id='payCss2';s2.textContent='.pcost div:has(>[data-a="exp"]){display:none!important}';document.head.appendChild(s2);}showIO(true);if(CUR){CUR.close();}if(!CONT){return;}CONT.innerHTML='';var c=el('div','height:100%;opacity:0;transition:opacity .4s ease;');c.className='pcost';if(!document.getElementById('payCss')){var st=document.createElement('style');st.id='payCss';st.textContent='.pcost [data-a="tab"]{display:none!important}';document.head.appendChild(st);}CONT.appendChild(c);try{new MutationObserver(function(){hideOP(c);}).observe(c,{childList:true,subtree:true});}catch(e){}if(window._costFor){window._costFor(c,code);}setTimeout(function(){c.style.opacity='1';},30);}
function render(w){
 w.innerHTML='';CUR=null;
 var root=el('div','height:100%;display:flex;flex-direction:column;box-sizing:border-box;background:#f7f7fd;font-family:inherit;position:relative;');root._pay=1;
 var bar=el('div','position:relative;z-index:10;height:34px;flex:none;display:flex;gap:10px;padding:6px 12px;box-sizing:border-box;border-bottom:1px solid #e5e7eb;background:#fafaff;');
 bar.appendChild(acc(L1,function(inn){var rs=[];items('prep').forEach(function(it){var r=mkRow(it);r.style.cursor='pointer';r.addEventListener('mouseenter',function(){r.style.background='#f3f1ff';});r.addEventListener('mouseleave',function(){r.style.background='';});r.addEventListener('click',function(){pick(it.code);});inn.appendChild(r);rs.push(r);});return rs;}));
 bar.appendChild(acc(L2,function(inn){var rs=[];function sec(t,its){if(!its.length){return;}var h=mkSec(t);inn.appendChild(h);rs.push(h);its.forEach(function(it){var r=mkRow(it);inn.appendChild(r);rs.push(r);});}sec(S1,items('main'));sec(S2,items('aux'));return rs;}));SV=el('button','flex:none;width:110px;height:22px;border:0;border-radius:14px;background:#fff;box-shadow:inset 0 0 0 1px #c9c0f5;color:#4b3fb5;font:700 9px/1 system-ui,sans-serif;cursor:pointer;padding:0 0 2px;outline:none;transition:background .3s ease,color .3s ease,box-shadow .3s ease;','\u0421\u0432\u043e\u0434');SV.addEventListener('click',function(){if(SV._on){var k=CONT&&CONT.firstChild;SV._fade=true;svodOn(false);SV._fade=false;if(k){k.style.transition='opacity .3s ease';k.style.opacity='0';setTimeout(function(){if(k.parentNode){k.parentNode.removeChild(k);}},320);}return;}if(CUR){CUR.close();CUR=null;}svodOn(true);if(CONT){CONT.innerHTML='';svod(CONT);}showIO(false);});bar.appendChild(SV);
 CONT=el('div','flex:1;min-height:0;overflow:hidden;');var io=el('div','margin-left:auto;display:none;gap:8px;');[['exp','\u0412\u044b\u0433\u0440\u0443\u0437\u0438\u0442\u044c'],['imp','\u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044c']].forEach(function(q){var bt=el('button','flex:none;width:110px;height:22px;border:0;border-radius:14px;background:#fff;box-shadow:inset 0 0 0 1px #c9c0f5;color:#4b3fb5;font:700 9px/1 system-ui,sans-serif;cursor:pointer;padding:0 0 2px;outline:none;',q[1]);bt.addEventListener('click',function(){var t=CONT&&CONT.querySelector('[data-a="'+q[0]+'"]');if(t){t.click();}});io.appendChild(bt);});IO=io;bar.appendChild(io);root.appendChild(bar);root.appendChild(CONT);w.appendChild(root);
}
var old=window.dbPanel;
window.dbPanel=function(i){
 var r=old?old.apply(this,arguments):undefined;
 if(i===0){[0,90,250].forEach(function(d){setTimeout(function(){var w=document.getElementById('dbPanel');if(w&&!(w.firstChild&&w.firstChild._pay)){w._g=1;render(w);}},d);});}
 return r;
};
})();
