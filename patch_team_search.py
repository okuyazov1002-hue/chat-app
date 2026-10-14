p="public/upmo/upmo-win.js"
s=open(p,encoding="utf-8").read()
a1=r'''return '<div style="flex:0 0 auto;"><div onclick='''
a2=r'''_tb.style.zIndex='5';}'''
c=[s.count(a1),s.count(a2)]
if c!=[1,1]:
    print("ANCHOR_COUNT",c);raise SystemExit
n1=r'''return '<div data-s="'+String([u.name,u.position,u.department].join(' ')).toLowerCase().replace(/"/g,'')+'" style="flex:0 0 auto;"><div onclick='''
js=r'''_tb.style.zIndex='5';
var _in=document.createElement('input');_in.type='text';_in.placeholder='Поиск...';
_in.style.cssText='position:absolute;top:9px;right:12px;width:150px;height:24px;border:0;border-radius:12px;padding:0 10px;font-size:11px;outline:none;background:rgba(255,255,255,0.92);color:#1f2937;z-index:3;box-sizing:border-box;';
_in.oninput=function(){var q=_in.value.toLowerCase().trim();var L=tw.lastElementChild;if(!L){return;}Array.prototype.forEach.call(L.children,function(w){var t=w.getAttribute('data-s')||'';w.style.display=(!q||t.indexOf(q)>=0)?'':'none';});};
_tb.appendChild(_in);}'''
s=s.replace(a1,n1).replace(a2,js)
open(p,"w",encoding="utf-8").write(s);print("PATCHED")
