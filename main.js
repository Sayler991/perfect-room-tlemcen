(()=>{
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
document.getElementById('y').textContent=new Date().getFullYear();
// Nav + sticky call
const nav=document.getElementById('nav'),sc=document.querySelector('.sticky-call');
const onScroll=()=>{const y=scrollY;nav.classList.toggle('scrolled',y>30);sc.classList.toggle('show',y>innerHeight*.6)};
addEventListener('scroll',onScroll,{passive:true});onScroll();
// Reveal
const els=document.querySelectorAll('.reveal');
if(reduce||!('IntersectionObserver' in window)){els.forEach(e=>e.classList.add('in'))}else{
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){const el=e.target;const sib=[...el.parentElement.children].filter(c=>c.classList.contains('reveal'));el.style.transitionDelay=Math.min(sib.indexOf(el),5)*90+'ms';el.classList.add('in');io.unobserve(el)}}),{threshold:.12,rootMargin:'0px 0px -6% 0px'});
  els.forEach(e=>io.observe(e));
}
// Counters
const fmt=(v,d)=>d?v.toFixed(d).replace('.',','):Math.round(v);
const cio=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;const el=e.target,to=+el.dataset.to,d=+(el.dataset.dec||0);cio.unobserve(el);
  if(reduce){el.textContent=fmt(to,d);return}const t0=performance.now(),D=1600;
  const step=t=>{const p=Math.min((t-t0)/D,1),k=1-Math.pow(1-p,3);el.textContent=fmt(to*k,d);if(p<1)requestAnimationFrame(step)};requestAnimationFrame(step)}),{threshold:.5});
document.querySelectorAll('.count').forEach(c=>cio.observe(c));
// Horaires live (heure d'Algérie)
try{
  const parts=new Intl.DateTimeFormat('en-GB',{timeZone:'Africa/Algiers',weekday:'short',hour:'2-digit',minute:'2-digit',hour12:false}).formatToParts(new Date());
  const wd={Sun:0,Mon:1,Tue:2,Wed:3,Thu:4,Fri:5,Sat:6}[parts.find(p=>p.type==='weekday').value];
  const h=+parts.find(p=>p.type==='hour').value,m=+parts.find(p=>p.type==='minute').value,t=h*60+m;
  const li=document.querySelector(`#hours li[data-d="${wd}"]`);li&&li.classList.add('today');
  const open=wd!==5&&t>=540&&t<1200,live=document.getElementById('live'),txt=document.getElementById('liveTxt');
  live.classList.add(open?'open':'closed');
  if(open)txt.textContent='Ouvert maintenant · jusqu\'à 20:00';
  else{const next=(wd===4&&t>=1200)||wd===5?'samedi 09:00':(t<540?'aujourd\'hui 09:00':'demain 09:00');txt.textContent='Fermé · ouvre '+next}
}catch(e){}
// Lightbox
const lb=document.getElementById('lb'),lbi=lb.querySelector('img');
document.querySelectorAll('.g').forEach(g=>g.addEventListener('click',()=>{lbi.src=g.dataset.full;lbi.alt=g.querySelector('img').alt;lb.hidden=false}));
lb.addEventListener('click',()=>{lb.hidden=true;lbi.src=''});
addEventListener('keydown',e=>{if(e.key==='Escape')lb.hidden=true});
// Halo curseur + parallax doux (desktop uniquement)
if(!reduce&&matchMedia('(hover:hover) and (min-width:900px)').matches){
  const cg=document.querySelector('.cursor-glow'),art=document.querySelector('.hero-art');let x=0,y=0,raf=0;
  addEventListener('pointermove',e=>{x=e.clientX;y=e.clientY;if(!raf)raf=requestAnimationFrame(()=>{cg.style.transform=`translate3d(${x}px,${y}px,0)`;
    const dx=(x/innerWidth-.5),dy=(y/innerHeight-.5);art.style.transform=`perspective(1000px) rotateY(${dx*6}deg) rotateX(${-dy*6}deg)`;raf=0})},{passive:true});
  art.style.transition='transform .6s ease-out';
}
})();
