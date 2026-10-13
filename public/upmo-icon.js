(function(){
var st=document.createElement('style');
st.textContent='#settingsBtn.su-go .su-ring{stroke-dasharray:100;animation:suRing 1.1s ease-in-out;}@keyframes suRing{0%{stroke-dashoffset:100}100%{stroke-dashoffset:0}}#settingsBtn.su-go .su-arr{animation:suArr 2.2s ease both;}@keyframes suArr{0%,45%{opacity:0;transform:translate(0,0)}50%{opacity:1;transform:translate(0,0)}65%{transform:translate(-17px,-15px)}72%{transform:translate(-14px,-12px)}85%,100%{opacity:1;transform:translate(0,0)}}#settingsBtn.su-go .su-plus{animation:suPlus .8s ease 1.45s both;transform-box:view-box;transform-origin:17px 85px;}@keyframes suPlus{0%{transform:rotate(0)}15%{transform:rotate(-28deg)}35%{transform:rotate(28deg)}55%{transform:rotate(-20deg)}75%{transform:rotate(20deg)}100%{transform:rotate(0)}}';
document.head.appendChild(st);
var st2=document.createElement('style');
st2.textContent='#settingsBtn.nav-active .su-s{stroke:url(#suRing);}#settingsBtn.nav-active .su-f{fill:url(#suBody);}#settingsBtn.nav-active .su-b{fill:url(#suBadge);}#settingsBtn.nav-active .su-p{stroke:#fff;}';
document.head.appendChild(st2);
var b=document.getElementById('settingsBtn');
if(b===null){return;}
b.addEventListener('click',function(){
b.classList.remove('su-go');void b.offsetWidth;b.classList.add('su-go');
setTimeout(function(){b.classList.remove('su-go');},2500);
});
})();
