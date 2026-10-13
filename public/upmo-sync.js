window.upmoLink=function(){
var a=document.getElementById('upmoScS'),b=document.getElementById('upmoMS');
if(a===null||b===null){return;}
if(a.getAttribute('data-l')==='1'&&b.getAttribute('data-l')==='1'){return;}
a.setAttribute('data-l','1');b.setAttribute('data-l','1');
a.scrollLeft=b.scrollLeft;
a.addEventListener('scroll',function(){if(b.scrollLeft!==a.scrollLeft){b.scrollLeft=a.scrollLeft;}});
b.addEventListener('scroll',function(){if(a.scrollLeft!==b.scrollLeft){a.scrollLeft=b.scrollLeft;}});
[a,b].forEach(function(el){
var sx=0,sl=0,down=false,moved=false;
el.addEventListener('mousedown',function(e){down=true;moved=false;sx=e.clientX;sl=el.scrollLeft;el.style.cursor='grabbing';});
window.addEventListener('mousemove',function(e){if(down===false){return;}var dx=e.clientX-sx;if(Math.abs(dx)>4){moved=true;}el.scrollLeft=sl-dx;});
window.addEventListener('mouseup',function(){if(down){down=false;el.style.cursor='grab';}});
el.addEventListener('click',function(e){if(moved){e.stopPropagation();e.preventDefault();moved=false;}},true);
});
};
