(function(){
var old=window.dbPanel;
if(!old){return;}
var BT='flex:none;width:110px;height:22px;border:0;border-radius:14px;background:#fff;box-shadow:inset 0 0 0 1px #c9c0f5;color:#4b3fb5;font:700 9px/1 system-ui,sans-serif;cursor:pointer;padding:0 0 2px;outline:none;transition:background .3s ease,color .3s ease,box-shadow .3s ease;';
var GRAD='linear-gradient(135deg,#7a68e0,#5b49c8)';
var L=[['con','\u041a\u043e\u043d\u0442\u0440\u0430\u043a\u0442\u044b'],['reg','\u0420\u0435\u0435\u0441\u0442\u0440 \u043e\u043f\u043b\u0430\u0442\u044b']];
function render(w){
if(!w||w._prj){return;}
w._prj=1;
var root=document.createElement('div');root.style.cssText='height:100%;display:flex;flex-direction:column;box-sizing:border-box;background:#f7f7fd;font-family:inherit;position:relative;';
var bar=document.createElement('div');bar.style.cssText='position:relative;z-index:10;height:34px;flex:none;display:flex;gap:10px;padding:6px 12px;box-sizing:border-box;border-bottom:1px solid #e5e7eb;background:#fafaff;';
var cont=document.createElement('div');cont.style.cssText='flex:1;min-height:0;overflow:hidden;';
var bs=[];
L.forEach(function(q){
var b=document.createElement('button');b.textContent=q[1];b.style.cssText=BT;
b.addEventListener('click',function(){
bs.forEach(function(x){x.style.background='#fff';x.style.color='#4b3fb5';x.style.boxShadow='inset 0 0 0 1px #c9c0f5';});
b.style.background=GRAD;b.style.color='#fff';b.style.boxShadow='none';
cont.innerHTML='';var pg=document.createElement('div');pg.setAttribute('data-pg',q[0]);pg.style.cssText='height:100%;opacity:0;transition:opacity .4s ease;';cont.appendChild(pg);if(q[0]==='reg'&&window.upmoReg){window.upmoReg(pg);}else if(window.upmoCon4){window.upmoCon4(pg);}else if(window.upmoCon3){window.upmoCon3(pg);}else if(window.upmoCon2){window.upmoCon2(pg);}else if(window.upmoCon){window.upmoCon(pg);}setTimeout(function(){pg.style.opacity='1';},30);
});
bs.push(b);bar.appendChild(b);
});
root.appendChild(bar);root.appendChild(cont);w.appendChild(root);
}
window.dbPanel=function(i){
old.apply(this,arguments);
if(i===2){[0,90,250].forEach(function(d){setTimeout(function(){render(document.getElementById('dbPanel'));},d);});}
};
})();
