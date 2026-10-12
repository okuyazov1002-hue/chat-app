(function(){
if(window.innerWidth>768){return;}
var l=document.createElement('link');l.rel='stylesheet';l.href='https://fonts.googleapis.com/css2?family=Nunito:wght@900&display=swap';document.head.appendChild(l);
var bar=document.querySelector('.sidebar-top');if(bar==null){return;}
var mark='<svg width="28" height="28" viewBox="0 0 120 120"><defs><linearGradient id="upmoMark2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6A5BD6"/><stop offset="0.5" stop-color="#5B94D0"/><stop offset="1" stop-color="#5FD2B0"/></linearGradient></defs><rect width="120" height="120" rx="30" fill="url(#upmoMark2)"/><path d="M24 88 C48 88 44 60 60 60 S74 32 96 32" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round"/><circle cx="24" cy="88" r="5" fill="#fff" fill-opacity="0.55"/><circle cx="96" cy="32" r="8" fill="#fff"/></svg>';
var txt='<span style="font-size:26px;font-weight:900;letter-spacing:-1px;line-height:1;background:linear-gradient(90deg,#6A5BD6,#5B94D0);-webkit-background-clip:text;background-clip:text;color:transparent;">UPM</span>';
var ring='<svg width="24" height="24" viewBox="0 0 100 100" style="margin-left:-2px;"><defs><linearGradient id="upmoRing2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5B94D0"/><stop offset="1" stop-color="#5FD2B0"/></linearGradient></defs><circle cx="50" cy="50" r="38" fill="none" stroke="url(#upmoRing2)" stroke-opacity="0.25" stroke-width="16"/><circle cx="50" cy="50" r="38" fill="none" stroke="url(#upmoRing2)" stroke-width="16" stroke-linecap="round" pathLength="100" stroke-dasharray="70 100" transform="rotate(-90 50 50)"/></svg>';
var back=document.createElement('button');back.id='dsBack';back.type='button';back.setAttribute('aria-label','Назад');
back.style.cssText='order:1;width:40px;height:40px;flex:none;margin:0;display:flex;align-items:center;justify-content:center;color:#fff;visibility:hidden;';
back.innerHTML='<svg width="18" height="18" viewBox="0 0 24 24"><path d="M17 3L5 12L17 21Z" fill="currentColor"/></svg>';
var logo=document.createElement('div');logo.id='dsLogo';
logo.style.cssText='order:2;background:rgba(255,255,255,0.5);border-radius:14px;height:40px;padding:0 14px;display:flex;align-items:center;gap:6px;font-family:Nunito,Arial,sans-serif;box-shadow:0 2px 8px rgba(0,0,0,0.12);';
logo.innerHTML=mark+txt+ring;
bar.insertBefore(logo,bar.firstChild);bar.insertBefore(back,bar.firstChild);
function topClose(){var ob=document.getElementById('objPage');if(ob&&window.dsCloseObj){window.dsCloseObj();return;}
var p=document.getElementById('prepPanel');if(p){var bk=document.getElementById('prepPanelBack');if(bk){bk.click();return;}}
var s=document.getElementById('infoSheetOverlay');if(s&&window.dsCloseSheet){window.dsCloseSheet(s);return;}
var o=document.querySelector('.stage-modal-overlay');if(o){o.click();}
}
back.addEventListener('click',topClose);
function refresh(){var any=document.getElementById('prepPanel')||document.querySelector('.stage-modal-overlay');back.style.visibility=any?'visible':'hidden';}
new MutationObserver(refresh).observe(document.body,{childList:true});
refresh();
})();
