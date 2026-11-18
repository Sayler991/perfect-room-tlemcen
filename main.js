(()=>{
'use strict';
const SB='https://rvreusugrtiubqtafgbk.supabase.co',KEY='sb_publishable_rTrEZB4mivU7kr9IwabvBQ_Q31CFt_1';
const DEFAULT={"phone": "0561 12 29 11", "whatsapp": "213561122911", "kicker": "Fabricant de luminaires · Tlemcen", "lead": "Des créations lumineuses qui donnent à chaque pièce une ambiance douce, chaleureuse… parfaite.", "products_title": "Nos créations", "products_intro": "Photos réelles de nos créations. Prix et modèles sur demande : appelez ou écrivez-nous.", "about_intro": "À Tlemcen, Perfect Room fabrique des luminaires décoratifs : des lampes à plaque gravée posées sur un socle lumineux et des tableaux rétroéclairés. Une lumière douce pour une chambre, un salon, un bureau… ou pour faire plaisir.", "hours": [{"dow": 6, "closed": false, "open": "09:00", "close": "20:00"}, {"dow": 0, "closed": false, "open": "09:00", "close": "20:00"}, {"dow": 1, "closed": false, "open": "09:00", "close": "20:00"}, {"dow": 2, "closed": false, "open": "09:00", "close": "20:00"}, {"dow": 3, "closed": false, "open": "09:00", "close": "20:00"}, {"dow": 4, "closed": false, "open": "09:00", "close": "20:00"}, {"dow": 5, "closed": true, "open": "09:00", "close": "20:00"}], "products": [{"id": "p1", "name": "Lampe livre gravé", "photo": "img/lampe-livre-coran-1400.webp", "thumb": "img/lampe-livre-coran-700.webp", "price": "", "description": "Livre ouvert gravé de versets, lumière ambrée sur socle lumineux.", "visible": true}, {"id": "p2", "name": "Tableau lumineux pop art", "photo": "img/tableau-lumineux-liberte-1400.webp", "thumb": "img/tableau-lumineux-liberte-700.webp", "price": "", "description": "Tableau rétroéclairé aux couleurs pop art.", "visible": true}, {"id": "p3", "name": "Lampe diplôme personnalisée", "photo": "img/lampe-diplome-sara-1400.webp", "thumb": "img/lampe-diplome-sara-700.webp", "price": "", "description": "Toque et diplôme gravés avec un prénom : une idée cadeau.", "visible": true}, {"id": "p4", "name": "Lampe voiture de course", "photo": "img/lampe-voiture-rouge-1400.webp", "thumb": "img/lampe-voiture-rouge-700.webp", "price": "", "description": "Voiture de course gravée, lumière rouge.", "visible": true}], "gallery": [{"id": "g1", "photo": "img/lampe-livre-coran-1400.webp", "thumb": "img/lampe-livre-coran-700.webp", "caption": "Livre gravé · lumière ambrée"}, {"id": "g2", "photo": "img/tableau-lumineux-liberte-1400.webp", "thumb": "img/tableau-lumineux-liberte-700.webp", "caption": "Tableau lumineux pop art"}, {"id": "g3", "photo": "img/lampe-diplome-sara-1400.webp", "thumb": "img/lampe-diplome-sara-700.webp", "caption": "Diplôme personnalisé « Sara »"}, {"id": "g4", "photo": "img/lampe-voiture-rouge-1400.webp", "thumb": "img/lampe-voiture-rouge-700.webp", "caption": "Voiture de course · néon rouge"}]};
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const esc=t=>String(t==null?'':t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const DAYN=['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'];
let DATA=DEFAULT;
document.getElementById('y').textContent=new Date().getFullYear();

/* ---------- Reveal ---------- */
let io=null;
if(!reduce&&'IntersectionObserver' in window){
  io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){const el=e.target;const sib=[...el.parentElement.children].filter(c=>c.classList.contains('reveal'));el.style.transitionDelay=Math.min(sib.indexOf(el),5)*80+'ms';el.classList.add('in');io.unobserve(el)}}),{threshold:.1,rootMargin:'0px 0px -5% 0px'});
}
const observe=root=>(root||document).querySelectorAll('.reveal:not(.in)').forEach(e=>io?io.observe(e):e.classList.add('in'));

/* ---------- Rendu du contenu ---------- */
function telHref(p){const d=String(p||'').replace(/\D/g,'');if(!d)return null;return 'tel:'+(d.startsWith('0')?'+213'+d.slice(1):(d.startsWith('213')?'+'+d:d))}
function render(D){
  DATA=D;
  const set=(id,v)=>{const e=document.getElementById(id);if(e&&v)e.textContent=v};
  set('kicker',D.kicker);set('lead',D.lead);set('productsTitle',D.products_title);set('productsIntro',D.products_intro);set('aboutIntro',D.about_intro);
  const th=telHref(D.phone);
  if(th){$$('[data-tel]').forEach(a=>a.href=th);$$('[data-tel-text]').forEach(s=>s.textContent=D.phone)}
  const wa=String(D.whatsapp||'').replace(/\D/g,'');
  $$('[data-wa]').forEach(a=>{if(wa){a.href='https://wa.me/'+wa;a.hidden=false}else a.hidden=true});
  // Produits
  const prods=(D.products||[]).filter(p=>p.visible!==false&&p.photo);
  $('#products').innerHTML=prods.map((p,i)=>{
    const msg=encodeURIComponent('Bonjour Perfect Room, je suis intéressé(e) par : '+p.name);
    const order=wa?`https://wa.me/${wa}?text=${msg}`:(th||'#contact');
    return `<article class="prod reveal">
      <button class="prod-img" data-lb="products" data-i="${i}" aria-label="Voir en grand : ${esc(p.name)}"><img src="${esc(p.thumb||p.photo)}" alt="${esc(p.name)}" loading="${i<2?'eager':'lazy'}" decoding="async"></button>
      <div class="prod-body"><h3>${esc(p.name)}</h3>${p.description?`<p>${esc(p.description)}</p>`:''}
      <div class="prod-foot"><span class="price">${p.price?esc(p.price):'Prix sur demande'}</span><a class="btn btn-sm" href="${order}" ${wa?'target="_blank" rel="noopener"':''}>Commander</a></div></div>
    </article>`}).join('');
  // Galerie
  const gal=(D.gallery||[]).filter(g=>g.photo);
  $('#galerie').hidden=!gal.length;
  $('#gallery').innerHTML=gal.map((g,i)=>`<figure class="g reveal${i===0?' g-wide':''}"><button data-lb="gallery" data-i="${i}" aria-label="Agrandir la photo ${i+1}"><img loading="lazy" decoding="async" src="${esc(g.thumb||g.photo)}" alt="${esc(g.caption||'Création Perfect Room')}"></button>${g.caption?`<figcaption>${esc(g.caption)}</figcaption>`:''}</figure>`).join('');
  // Horaires
  const H=D.hours||[];
  $('#hours').innerHTML=H.map(h=>`<li data-d="${h.dow}" class="${h.closed?'off':''}"><span>${DAYN[h.dow]}</span><span>${h.closed?'Fermé':esc(h.open)+' – '+esc(h.close)}</span></li>`).join('');
  const openDays=H.filter(h=>!h.closed);
  const dEl=$('#daysOpen');if(dEl){dEl.dataset.to=openDays.length;if(dEl.dataset.done)dEl.textContent=openDays.length}
  const same=openDays.length&&openDays.every(h=>h.open===openDays[0].open&&h.close===openDays[0].close);
  const hr=$('#hoursRange');if(hr)hr.innerHTML=same?`${parseInt(openDays[0].open)}h<small>→</small>${parseInt(openDays[0].close)}h`:'Voir';
  liveStatus(H);
  observe();
}
function mins(s){const m=/^(\d{1,2}):(\d{2})$/.exec(s||'');return m?+m[1]*60+ +m[2]:null}
function liveStatus(H){
  try{
    const parts=new Intl.DateTimeFormat('en-GB',{timeZone:'Africa/Algiers',weekday:'short',hour:'2-digit',minute:'2-digit',hour12:false}).formatToParts(new Date());
    const wd={Sun:0,Mon:1,Tue:2,Wed:3,Thu:4,Fri:5,Sat:6}[parts.find(p=>p.type==='weekday').value];
    const t=+parts.find(p=>p.type==='hour').value%24*60+ +parts.find(p=>p.type==='minute').value;
    $$('#hours li').forEach(li=>li.classList.toggle('today',+li.dataset.d===wd));
    const by={};H.forEach(h=>by[h.dow]=h);
    const today=by[wd],live=$('#live'),txt=$('#liveTxt');live.classList.remove('open','closed');
    if(today&&!today.closed&&t>=mins(today.open)&&t<mins(today.close)){live.classList.add('open');txt.textContent='Ouvert maintenant · jusqu\'à '+today.close;return}
    live.classList.add('closed');
    if(today&&!today.closed&&t<mins(today.open)){txt.textContent='Fermé · ouvre aujourd\'hui à '+today.open;return}
    for(let k=1;k<=7;k++){const d=(wd+k)%7,h=by[d];if(h&&!h.closed){txt.textContent='Fermé · ouvre '+(k===1?'demain':DAYN[d].toLowerCase())+' à '+h.open;return}}
    txt.textContent='Fermé';
  }catch(e){}
}
render(DEFAULT);
fetch(SB+'/rest/v1/perfect_room_content?id=eq.1&select=data',{headers:{apikey:KEY}}).then(r=>r.ok?r.json():null).then(j=>{if(j&&j[0]&&j[0].data)render(Object.assign({},DEFAULT,j[0].data))}).catch(()=>{});

/* ---------- Nav + bouton fixe ---------- */
const nav=$('#nav'),sc=$('.sticky-call');
const onScroll=()=>{const y=scrollY;nav.classList.toggle('scrolled',y>30);sc.classList.toggle('show',y>innerHeight*.5)};
addEventListener('scroll',onScroll,{passive:true});onScroll();

/* ---------- Compteurs ---------- */
const fmt=(v,d)=>d?v.toFixed(d).replace('.',','):Math.round(v);
const cio=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;const el=e.target,to=+el.dataset.to,d=+(el.dataset.dec||0);cio.unobserve(el);el.dataset.done=1;
  if(reduce){el.textContent=fmt(to,d);return}const t0=performance.now(),D=1500;
  const step=t=>{const p=Math.min((t-t0)/D,1),k=1-Math.pow(1-p,3);el.textContent=fmt(+el.dataset.to*k,d);if(p<1)requestAnimationFrame(step)};requestAnimationFrame(step)}),{threshold:.5});
$$('.count').forEach(c=>cio.observe(c));

/* ---------- Visionneuse plein écran (swipe, flèches, clavier) ---------- */
const lb=$('#lb'),track=$('#lbTrack'),cnt=$('#lbCount'),cap=$('#lbCap');
let items=[],idx=0,lastFocus=null;
function slides(){track.innerHTML=items.map((it,i)=>`<div class="lb-slide" style="transform:translate3d(${i*100}%,0,0)"><img data-src="${esc(it.src)}" alt="${esc(it.alt)}"></div>`).join('')}
function load(i){const s=track.children[i];if(!s)return;const im=s.querySelector('img');if(im&&!im.src)im.src=im.dataset.src}
function go(i,anim=true){
  idx=(i+items.length)%items.length;
  track.style.transition=anim&&!reduce?'transform .45s cubic-bezier(.2,.8,.2,1)':'none';
  track.style.transform=`translate3d(${-idx*100}%,0,0)`;
  [idx-1,idx,idx+1].forEach(k=>load((k+items.length)%items.length));
  cnt.textContent=(idx+1)+' / '+items.length;cap.textContent=items[idx].cap||'';
  $('#lbPrev').hidden=$('#lbNext').hidden=items.length<2;
}
function openLb(set,i){
  const D=DATA;
  items=set==='products'?(D.products||[]).filter(p=>p.visible!==false&&p.photo).map(p=>({src:p.photo,alt:p.name,cap:p.name+(p.price?' · '+p.price:'')}))
       :(D.gallery||[]).filter(g=>g.photo).map(g=>({src:g.photo,alt:g.caption||'Création Perfect Room',cap:g.caption||''}));
  if(!items.length)return;
  lastFocus=document.activeElement;slides();lb.hidden=false;document.documentElement.classList.add('lb-open');
  requestAnimationFrame(()=>lb.classList.add('on'));go(i,false);$('#lbClose').focus();
}
function closeLb(){lb.classList.remove('on');document.documentElement.classList.remove('lb-open');setTimeout(()=>{lb.hidden=true;track.innerHTML=''},reduce?0:300);lastFocus&&lastFocus.focus()}
document.addEventListener('click',e=>{const b=e.target.closest('[data-lb]');if(b){e.preventDefault();openLb(b.dataset.lb,+b.dataset.i)}});
$('#lbClose').onclick=closeLb;$('#lbPrev').onclick=()=>go(idx-1);$('#lbNext').onclick=()=>go(idx+1);
addEventListener('keydown',e=>{if(lb.hidden)return;if(e.key==='Escape')closeLb();else if(e.key==='ArrowLeft')go(idx-1);else if(e.key==='ArrowRight')go(idx+1)});
// Glisser au doigt
let x0=null,y0=0,dx=0,horiz=null,t0=0;
track.addEventListener('touchstart',e=>{const t=e.touches[0];x0=t.clientX;y0=t.clientY;dx=0;horiz=null;t0=Date.now();track.style.transition='none'},{passive:true});
track.addEventListener('touchmove',e=>{if(x0==null)return;const t=e.touches[0];dx=t.clientX-x0;const dy=t.clientY-y0;if(horiz==null&&(Math.abs(dx)>8||Math.abs(dy)>8))horiz=Math.abs(dx)>Math.abs(dy);
  if(horiz){track.style.transform=`translate3d(calc(${-idx*100}% + ${dx}px),0,0)`}},{passive:true});
track.addEventListener('touchend',()=>{if(x0==null)return;const w=innerWidth,fast=Date.now()-t0<300&&Math.abs(dx)>40;
  if(horiz&&(Math.abs(dx)>w*.18||fast)&&items.length>1)go(idx+(dx<0?1:-1));else if(horiz===false&&Math.abs(dx)<10&&Math.abs(y0)>0){go(idx)}else go(idx);x0=null});
// Glisser à la souris (ordinateur)
let mx=null;track.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse')return;mx=e.clientX;dx=0;track.style.transition='none'});
addEventListener('pointermove',e=>{if(mx==null)return;dx=e.clientX-mx;track.style.transform=`translate3d(calc(${-idx*100}% + ${dx}px),0,0)`});
addEventListener('pointerup',()=>{if(mx==null)return;mx=null;if(Math.abs(dx)>80&&items.length>1)go(idx+(dx<0?1:-1));else go(idx)});
track.addEventListener('click',e=>{if(e.target===track||e.target.classList.contains('lb-slide'))closeLb()});

/* ---------- Halo curseur (ordinateur) ---------- */
if(!reduce&&matchMedia('(hover:hover) and (min-width:900px)').matches){
  const cg=$('.cursor-glow');let x=0,y=0,raf=0;
  addEventListener('pointermove',e=>{x=e.clientX;y=e.clientY;if(!raf)raf=requestAnimationFrame(()=>{cg.style.transform=`translate3d(${x}px,${y}px,0)`;raf=0})},{passive:true});
}
})();
