// ===== ADIP final — shared behaviour. Vanilla JS, no libraries. =====
// Menu (full-screen index)
var mb=document.getElementById('menubtn'),mn=document.getElementById('menu'),mc=document.getElementById('menuclose');
if(mb&&mn){mb.onclick=function(){mn.classList.add('open')};mc.onclick=function(){mn.classList.remove('open')};
document.addEventListener('keydown',function(e){if(e.key==='Escape')mn.classList.remove('open')});}
// Ink line page transition: a line draws across, then we navigate (degrades to normal nav without JS timing)
(function(){var line=document.getElementById('inkline');if(!line)return;
document.querySelectorAll('a[href]').forEach(function(a){
 var h=a.getAttribute('href');if(!h||h.charAt(0)==='#'||h.indexOf('http')===0||a.target==='_blank')return;
 a.addEventListener('click',function(e){e.preventDefault();
  line.style.transition='transform .38s cubic-bezier(.7,0,.3,1)';line.style.transform='scaleX(1)';
  setTimeout(function(){window.location.href=h;},400);});});
})();
// Reveal on scroll
(function(){var els=document.querySelectorAll('[data-rv]');if(!els.length||!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('on')});return;}
var io=new IntersectionObserver(function(en){en.forEach(function(x){if(x.isIntersecting){x.target.classList.add('on');io.unobserve(x.target);}})},{threshold:.1});
els.forEach(function(e){io.observe(e)});})();
// Chip groups: [data-chips] container; optional readout via data-chips="#id"
document.querySelectorAll('[data-chips]').forEach(function(g){
 g.addEventListener('click',function(e){var b=e.target.closest('.chip');if(!b)return;
  g.querySelectorAll('.chip').forEach(function(x){x.classList.remove('sel')});b.classList.add('sel');
  var t=document.querySelector(g.dataset.chips);if(t)t.textContent=b.dataset.v||b.textContent;});
});
// Before/after sliders
document.querySelectorAll('.ba').forEach(function(ba){
 var r=ba.querySelector('input[type=range]'),t=ba.querySelector('.topimg');if(!r||!t)return;
 function upd(){t.style.clipPath='inset(0 '+(100-r.value)+'% 0 0)';}
 r.addEventListener('input',upd);upd();
});
// Two-step capture popup: step 1 email, step 2 optional mobile. 14s or exit-intent, once per session, never on cart.
(function(){var c=document.getElementById('cap');if(!c)return;
 try{if(sessionStorage.getItem('adipcap2'))return;}catch(e){}
 var shown=false;function show(){if(shown)return;shown=true;c.classList.add('open');try{sessionStorage.setItem('adipcap2','1')}catch(e){}}
 setTimeout(show,14000);
 document.addEventListener('mouseout',function(e){if(!e.relatedTarget&&e.clientY<8)show();});
 document.getElementById('capx').onclick=function(){c.classList.remove('open')};
 c.addEventListener('click',function(e){if(e.target===c)c.classList.remove('open')});
 var s1=document.getElementById('capstep1'),s2=document.getElementById('capstep2');
 if(s1&&s2){s1.addEventListener('submit',function(e){e.preventDefault();s1.style.display='none';s2.style.display='block';});}
})();
// Scroll-drawn artwork: any .drawsvg svg paths draw in sync with scroll through its section
document.querySelectorAll('.drawsvg').forEach(function(box){
 var paths=box.querySelectorAll('path');paths.forEach(function(p){var L=p.getTotalLength();p.style.strokeDasharray=L;p.style.strokeDashoffset=L;});
 function upd(){var r=box.getBoundingClientRect();var vh=window.innerHeight;
  var prog=(vh-r.top)/(vh+r.height);prog=Math.max(0,Math.min(1,prog));
  paths.forEach(function(p,i){var L=p.getTotalLength();var seg=1/paths.length;
   var lp=Math.max(0,Math.min(1,(prog-i*seg)/seg));p.style.strokeDashoffset=L*(1-lp);});}
 window.addEventListener('scroll',upd,{passive:true});upd();
});
// Hold-to-draw (PDP provenance): hold the button (or click Play) to draw the motif over 3s
document.querySelectorAll('[data-hold]').forEach(function(btn){
 var target=document.querySelector(btn.dataset.hold);if(!target)return;
 var paths=[].filter.call(target.querySelectorAll('path'),function(p){return !p.closest('.ghost')});var total=0;
 paths.forEach(function(p){var L=p.getTotalLength();total=Math.max(total,L);p.style.strokeDasharray=L;p.style.strokeDashoffset=L;});
 var start=null,raf=null,prog=0;
 function frame(ts){if(!start)start=ts;var t=(ts-start)/3000;prog=Math.min(1,t);
  paths.forEach(function(p){var L=p.getTotalLength();p.style.strokeDashoffset=L*(1-prog);});
  if(btn.dataset.ring){var ring=document.querySelector(btn.dataset.ring);if(ring)ring.style.strokeDashoffset=283*(1-prog);}
  if(prog<1){raf=requestAnimationFrame(frame);}else if(btn.dataset.done){var done=document.querySelector(btn.dataset.done);if(done)done.style.display='block';}}
 function begin(e){e.preventDefault();start=null;raf=requestAnimationFrame(frame);}
 function end(){if(raf&&prog<1){cancelAnimationFrame(raf);raf=null;}}
 btn.addEventListener('pointerdown',begin);btn.addEventListener('pointerup',end);btn.addEventListener('pointerleave',end);
});
// Glass layer: light follows the pointer across cards and posters; cards tilt.
(function(){
 if(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 var fine=window.matchMedia&&window.matchMedia('(pointer: fine)').matches;
 function setv(el,x,y){var r=el.getBoundingClientRect();if(!r.width)return;
  el.style.setProperty('--mx',((x-r.left)/r.width*100)+'%');
  el.style.setProperty('--my',((y-r.top)/r.height*100)+'%');
  if(fine&&el.classList.contains('pcard')){
   el.style.setProperty('--rx',(((x-r.left)/r.width-.5)*7)+'deg');
   el.style.setProperty('--ry',(-((y-r.top)/r.height-.5)*7)+'deg');}}
 document.querySelectorAll('.pcard,.poster').forEach(function(el){
  el.addEventListener('pointermove',function(e){setv(el,e.clientX,e.clientY);});
  el.addEventListener('pointerleave',function(){el.style.setProperty('--rx','0deg');el.style.setProperty('--ry','0deg');});
 });
})();
