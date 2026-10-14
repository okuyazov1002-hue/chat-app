p="public/main.html"
s=open(p,encoding="utf-8").read()
r=[(".m-pin{transform-origin:60px 88px;animation:mPin 3s infinite}",".m-pin{transform-origin:60px 88px}#mapBtn.mgo .m-pin{animation:mPin 3s 1}"),
(".m-sh{transform-origin:60px 93px;animation:mSh 3s infinite}",".m-sh{transform-origin:60px 93px}#mapBtn.mgo .m-sh{animation:mSh 3s 1}"),
(".m-rp{transform-origin:60px 91px;opacity:0;animation:mRp 3s infinite}",".m-rp{transform-origin:60px 91px;opacity:0}#mapBtn.mgo .m-rp{animation:mRp 3s 1}"),
(".m-sp{opacity:0;animation:mSp 3s infinite}",".m-sp{opacity:0}#mapBtn.mgo .m-sp{animation:mSp 3s 1}"),
("52%,88%{opacity:1;transform:translate(0,0) rotate(0deg) scale(1,1)}96%,100%{opacity:0;transform:translate(0,0) rotate(0deg) scale(1,1)}","52%,88%{opacity:1;transform:translate(0,0) rotate(0deg) scale(1,1)}96%,100%{opacity:1;transform:translate(0,0) rotate(0deg) scale(1,1)}"),
("52%,88%{opacity:1;transform:scale(1)}96%,100%{opacity:0;transform:scale(1)}","52%,88%{opacity:1;transform:scale(1)}96%,100%{opacity:1;transform:scale(1)}"),
("<button id='mapBtn' title='Карта' onclick=\"this.querySelectorAll(","<button id='mapBtn' title='Карта' onclick=\"var b=this;b.classList.remove('mgo');void b.offsetWidth;b.classList.add('mgo');this.querySelectorAll(")]
c=[s.count(a) for a,b in r]
if c!=[1]*7:
    print("ANCHOR_COUNT",c);raise SystemExit
for a,b in r: s=s.replace(a,b)
open(p,"w",encoding="utf-8").write(s);print("PATCHED")
