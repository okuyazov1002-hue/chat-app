(function(){
var inp=document.getElementById('password');if(inp==null){return;}
var w=document.createElement('div');w.style.cssText='position:relative;';
inp.parentNode.insertBefore(w,inp);w.appendChild(inp);inp.style.paddingRight='44px';
var open='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>';
var shut='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.9 10.9 0 0 1 12 19C5 19 1 12 1 12a18.5 18.5 0 0 1 5.06-5.94M9.9 4.24A9.1 9.1 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19M14.12 14.12a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>';
var b=document.createElement('button');b.type='button';b.setAttribute('aria-label','Показать пароль');
b.style.cssText='position:absolute;right:20px;top:50%;transform:translateY(-50%);width:32px;height:32px;margin:0;padding:0;border:none;border-radius:0;box-shadow:none;background:transparent;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#6b7280;';
b.innerHTML=open;
b.addEventListener('click',function(){var show=inp.type=='password';inp.type=show?'text':'password';b.innerHTML=show?shut:open;b.setAttribute('aria-label',show?'Скрыть пароль':'Показать пароль');});
w.appendChild(b);
})();
