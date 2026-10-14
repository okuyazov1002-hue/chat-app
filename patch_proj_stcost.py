p="public/upmo/upmo-win.js"
s=open(p,encoding="utf-8").read()
a="+n+'</div></div>';}).join('');})();"
if s.count(a)!=1:
    print("ANCHOR_COUNT",s.count(a));raise SystemExit
b='''+n+'</div><div data-st="'+n+'" style="font-size:12px;font-weight:700;color:#1f2937;margin-top:6px;white-space:nowrap;">—</div></div>';}).join('');
fetch("/api/reports/"+encodeURIComponent(k.slice(5))+"/summary").then(function(r){return r.json();}).then(function(d){
var fm=(typeof fmtMoney==='function')?fmtMoney:function(x){return String(x);};
ORD.forEach(function(n){var f=null;(d.stages||[]).forEach(function(x){if(x.name===n||(n==='Строительство'&&/строительств|смр/i.test(x.name))||(n==='ПНР'&&/пнр|пуско/i.test(x.name))){f=x;}});
var e=box.querySelector('[data-st="'+n+'"]');if(e){e.textContent=fm(Math.round(f?(f.cost||0):0));}});
}).catch(function(){});})();'''
open(p,"w",encoding="utf-8").write(s.replace(a,b));print("PATCHED")
