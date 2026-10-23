(function(){
var KEY='upmoPrepW',E=5;
function hs(t){return Array.prototype.slice.call(t.querySelectorAll('thead th')).filter(function(x){return x.style.display!=='none';});}
function hideCols(t){var th=t.querySelectorAll('thead th'),ix=[];for(var i=0;i<th.length;i++){var n=th[i].textContent.trim();if(/^(Actual Cost|Cost)(\s|[^A-Za-z]|$)/.test(n)){ix.push(i);}}if(!ix.length){return;}Array.prototype.forEach.call(t.querySelectorAll('tr'),function(r){ix.forEach(function(i){if(r.children[i]){r.children[i].style.display='none';}});});}
function sum(a){return a.reduce(function(s,v){return s+v;},0);}
function k(t){return KEY+hs(t).length;}
function ok(t){return t&&!t.closest('.cl')&&!t.closest('#prjTbl')&&t.closest('#dbPanel');}
function apply(t){if(!ok(t)||t._rz){return;}t._rz=1;hideCols(t);var s=null;try{s=JSON.parse(localStorage.getItem(k(t)));}catch(e){}var h=hs(t);if(s&&s.length===h.length){h.forEach(function(x,i){x.style.width=s[i]+'px';});t.style.width=sum(s)+'px';}}
function scan(){var l=document.querySelectorAll('#dbPanel .gs table');for(var i=0;i<l.length;i++){apply(l[i]);if(l[i]._hn!==l[i].rows.length){hideCols(l[i]);l[i]._hn=l[i].rows.length;}}}
var tm=null;new MutationObserver(function(){clearTimeout(tm);tm=setTimeout(scan,60);}).observe(document.body,{childList:true,subtree:true});
function edge(e){var th=e.target.closest&&e.target.closest('th');if(!th){return null;}var t=th.closest('table');if(!ok(t)){return null;}var h=hs(t),i=h.indexOf(th);if(i<0||th.getBoundingClientRect().width===0){return null;}var r=th.getBoundingClientRect();if(e.clientX-r.left<E&&i>0){return {t:t,h:h,a:i-1,b:i};}if(r.right-e.clientX<E){return {t:t,h:h,a:i,b:i<h.length-1?i+1:-1};}return null;}
document.addEventListener('mousemove',function(e){if(e.buttons){return;}var th=e.target.closest&&e.target.closest('th');if(!th){return;}th.style.cursor=edge(e)?'col-resize':'';},true);
document.addEventListener('mousedown',function(e){var g=edge(e);if(!g){return;}e.preventDefault();e.stopPropagation();var W=g.h.map(function(x){return x.getBoundingClientRect().width;});g.h.forEach(function(x,i){x.style.width=W[i]+'px';});g.t.style.width=sum(W)+'px';var x0=e.clientX,wa=W[g.a],wb=g.b>=0?W[g.b]:0;
var dxF=0,raf=0;g.t.style.willChange='width';
function paint(){raf=0;W[g.a]=wa+dxF;g.h[g.a].style.width=W[g.a]+'px';if(g.b>=0){W[g.b]=wb-dxF;g.h[g.b].style.width=W[g.b]+'px';}g.t.style.width=sum(W)+'px';}
function mv(ev){var dx=ev.clientX-x0;dxF=g.b>=0?Math.max(30-wa,Math.min(wb-30,dx)):Math.max(30-wa,dx);if(!raf){raf=requestAnimationFrame(paint);}}
function up(){document.removeEventListener('mousemove',mv,true);document.removeEventListener('mouseup',up,true);if(raf){cancelAnimationFrame(raf);}paint();g.t.style.willChange='';try{localStorage.setItem(k(g.t),JSON.stringify(W));}catch(er){}}
document.addEventListener('mousemove',mv,true);document.addEventListener('mouseup',up,true);},true);
document.addEventListener('dblclick',function(e){var g=edge(e);if(!g){return;}e.preventDefault();e.stopPropagation();var cv=document.createElement('canvas').getContext('2d'),mx=0;Array.prototype.forEach.call(g.t.querySelectorAll('tr'),function(r){var c=r.children[g.h[g.a].cellIndex];if(!c||c.getBoundingClientRect().width===0){return;}cv.font=getComputedStyle(c).font;var w=cv.measureText((c.textContent||'').trim()).width;if(w>mx){mx=w;}});var W=g.h.map(function(x){return x.getBoundingClientRect().width;});W[g.a]=Math.max(40,Math.min(700,Math.ceil(mx)+26));g.h.forEach(function(x,i){x.style.width=W[i]+'px';});g.t.style.width=sum(W)+'px';try{localStorage.setItem(k(g.t),JSON.stringify(W));}catch(er){}},true);
scan();
})();