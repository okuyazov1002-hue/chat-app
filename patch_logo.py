p="public/main.html"
s=open(p,encoding="utf-8").read()
a='<button id="logoutBtn"'
i=s.find(a)
if s.count(a)!=1 or i<0:
    print("ANCHOR_COUNT",s.count(a));raise SystemExit
j=s.find("</button>",i)+9
svg=('<div id="sideLogo" style="display:flex;justify-content:center;margin-top:10px;"><svg width="68" height="21" viewBox="0 0 130 40" aria-label="UPMO"><defs>'
'<linearGradient id="lgIc" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6A5BD6"/><stop offset="1" stop-color="#5FD2B0"/></linearGradient>'
'<linearGradient id="lgTx" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#6A5BD6"/><stop offset="1" stop-color="#5B94D0"/></linearGradient>'
'<linearGradient id="lgAr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5B94D0"/><stop offset="1" stop-color="#5FD2B0"/></linearGradient></defs>'
'<rect x="0.75" y="0.75" width="128.5" height="38.5" rx="19.25" fill="#fff" fill-opacity="0.45" stroke="#fff" stroke-opacity="0.6" stroke-width="1.5"/>'
'<rect x="6" y="6" width="28" height="28" rx="8" fill="url(#lgIc)"/>'
'<polyline points="12,27 19,20 23,24 29,14" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>'
'<polyline points="24,14 29,14 29,19" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>'
'<text x="42" y="28" font-family="Arial,Helvetica,sans-serif" font-size="21" font-weight="800" fill="url(#lgTx)">UPM</text>'
'<circle cx="113" cy="20" r="9" fill="none" stroke="#6A5BD6" stroke-width="3.5" stroke-linecap="round" stroke-dasharray="14 43" transform="rotate(180 113 20)"/>'
'<circle cx="113" cy="20" r="9" fill="none" stroke="url(#lgAr)" stroke-width="3.5" stroke-linecap="round" stroke-dasharray="36 21" transform="rotate(285 113 20)"/>'
'</svg></div>')
s=s[:j]+svg+s[j:]
open(p,"w",encoding="utf-8").write(s);print("PATCHED")
