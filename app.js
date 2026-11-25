// ===== ADIP — shared behaviour. Vanilla JS, no libraries. =====
// Menu (full-screen index)
var mb=document.getElementById('menubtn'),mn=document.getElementById('menu'),mc=document.getElementById('menuclose');
if(mb&&mn){mb.onclick=function(){mn.classList.add('open')};mc.onclick=function(){mn.classList.remove('open')};
document.addEventListener('keydown',function(e){if(e.key==='Escape')mn.classList.remove('open')});}
// Iridescent scroll progress
(function(){var bar=document.getElementById('scrollprog');if(!bar)return;
function upd(){var h=document.documentElement;var max=h.scrollHeight-h.clientHeight;
 bar.style.width=(max>0?(h.scrollTop/max*100):0)+'%';}
window.addEventListener('scroll',upd,{passive:true});upd();})();
// Reveal on scroll
(function(){var els=document.querySelectorAll('[data-rv]');if(!els.length||!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('on')});return;}
var io=new IntersectionObserver(function(en){en.forEach(function(x){if(x.isIntersecting){x.target.classList.add('on');io.unobserve(x.target);}})},{threshold:.08});
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
// Rail progress bars: .rail followed by .railprog > i
document.querySelectorAll('.rail').forEach(function(rail){
 var wrap=rail.parentElement;var fill=wrap?wrap.querySelector('.railprog i'):null;if(!fill)return;
 function upd(){var max=rail.scrollWidth-rail.clientWidth;
  fill.style.width=(max>0?12+(rail.scrollLeft/max*88):100)+'%';}
 rail.addEventListener('scroll',upd,{passive:true});upd();
});
// Scroll-drawn artwork: .drawsvg paths draw in sync with scroll through the section
document.querySelectorAll('.drawsvg').forEach(function(box){
 var paths=box.querySelectorAll('path');paths.forEach(function(p){var L=p.getTotalLength();p.style.strokeDasharray=L;p.style.strokeDashoffset=L;});
 function upd(){var r=box.getBoundingClientRect();var vh=window.innerHeight;
  var prog=(vh-r.top)/(vh+r.height);prog=Math.max(0,Math.min(1,prog));
  paths.forEach(function(p,i){var L=p.getTotalLength();var seg=1/paths.length;
   var lp=Math.max(0,Math.min(1,(prog-i*seg)/seg));p.style.strokeDashoffset=L*(1-lp);});}
 window.addEventListener('scroll',upd,{passive:true});upd();
});
// Hold-to-draw: hold the button to draw the motif over 3s
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
// Light follows the pointer across tiles and panels
(function(){
 if(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 document.querySelectorAll('.tile,.panel').forEach(function(el){
  el.addEventListener('pointermove',function(e){var r=el.getBoundingClientRect();if(!r.width)return;
   el.style.setProperty('--mx',((e.clientX-r.left)/r.width*100)+'%');
   el.style.setProperty('--my',((e.clientY-r.top)/r.height*100)+'%');});
 });
})();
