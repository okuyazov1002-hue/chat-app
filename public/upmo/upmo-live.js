(function(){
var A=null,last=null,busy=false;
function wrap(){var f=window.upmoFillPanel;if(!f||f.__live){return;}var w=function(p,k){A=[p,k];return f.apply(this,arguments);};w.__live=1;window.upmoFillPanel=w;}
wrap();
setInterval(function(){
wrap();
if(document.hidden||busy){return;}
busy=true;
fetch('/api/prep/rev').then(function(r){return r.json();}).then(function(d){
busy=false;
if(!d||d.rev===undefined){return;}
if(last===null){last=d.rev;return;}
if(d.rev===last){return;}
last=d.rev;
if(window.upmoRecolor){window.upmoRecolor();}
if(A&&A[0]&&document.body.contains(A[0])&&document.getElementById('upmoSc')){window.upmoFillPanel(A[0],A[1]);}
}).catch(function(){busy=false;});
},6000);
})();
