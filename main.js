(()=>{
'use strict';
const SB='https://rvreusugrtiubqtafgbk.supabase.co',KEY='sb_publishable_rTrEZB4mivU7kr9IwabvBQ_Q31CFt_1';
const DEFAULT={"phone": "0561 12 29 11", "whatsapp": "213561122911", "kicker": "Fabricant de luminaires · Tlemcen", "lead": "Des créations lumineuses qui donnent à chaque pièce une ambiance douce, chaleureuse… parfaite.", "products_title": "Nos créations", "products_intro": "Photos de créations Perfect Room, et des exemples de modèles personnalisables. Prix sur demande : appelez ou écrivez-nous.", "about_intro": "À Tlemcen, Perfect Room fabrique des luminaires décoratifs : des lampes à plaque gravée posées sur un socle lumineux et des tableaux rétroéclairés. Une lumière douce pour une chambre, un salon, un bureau… ou pour faire plaisir.", "hours": [{"dow": 6, "closed": false, "open": "09:00", "close": "20:00"}, {"dow": 0, "closed": false, "open": "09:00", "close": "20:00"}, {"dow": 1, "closed": false, "open": "09:00", "close": "20:00"}, {"dow": 2, "closed": false, "open": "09:00", "close": "20:00"}, {"dow": 3, "closed": false, "open": "09:00", "close": "20:00"}, {"dow": 4, "closed": false, "open": "09:00", "close": "20:00"}, {"dow": 5, "closed": true, "open": "09:00", "close": "20:00"}], "products": [{"id": "p1", "name": "Lampe livre gravé", "photo": "img/lampe-livre-coran-1400.webp", "thumb": "img/lampe-livre-coran-700.webp", "price": "", "description": "Livre ouvert gravé de versets, lumière ambrée sur socle lumineux.", "visible": true}, {"id": "p2", "name": "Tableau lumineux pop art", "photo": "img/tableau-lumineux-liberte-1400.webp", "thumb": "img/tableau-lumineux-liberte-700.webp", "price": "", "description": "Tableau rétroéclairé aux couleurs pop art.", "visible": true}, {"id": "p3", "name": "Lampe diplôme personnalisée", "photo": "img/lampe-diplome-sara-1400.webp", "thumb": "img/lampe-diplome-sara-700.webp", "price": "", "description": "Toque et diplôme gravés avec un prénom : une idée cadeau.", "visible": true}, {"id": "p4", "name": "Lampe voiture de course", "photo": "img/lampe-voiture-rouge-1400.webp", "thumb": "img/lampe-voiture-rouge-700.webp", "price": "", "description": "Voiture de course gravée, lumière rouge.", "visible": true}, {"id": "p5", "name": "Néon prénom personnalisé", "photo": "img/exemple-neon-prenom-1400.webp", "thumb": "img/exemple-neon-prenom-700.webp", "price": "", "description": "Modèle personnalisable avec le prénom de votre choix.", "visible": true, "example": true}, {"id": "p6", "name": "Lampe photo gravée couple", "photo": "img/exemple-lampe-couple-1400.webp", "thumb": "img/exemple-lampe-couple-700.webp", "price": "", "description": "Lampe LED gravée d'un motif couple, modèle personnalisable.", "visible": true, "example": true}, {"id": "p7", "name": "Néon enseigne pour commerce", "photo": "img/exemple-neon-commerce-1400.webp", "thumb": "img/exemple-neon-commerce-700.webp", "price": "", "description": "Enseigne néon pour commerce (exemple « Café Palmier »), texte et couleurs à personnaliser.", "visible": true, "example": true}, {"id": "p8", "name": "Lampe veilleuse enfant", "photo": "img/exemple-veilleuse-enfant-1400.webp", "thumb": "img/exemple-veilleuse-enfant-700.webp", "price": "", "description": "Veilleuse LED gravée avec un prénom d'enfant, modèle personnalisable.", "visible": true, "example": true}], "gallery": [{"id": "g1", "photo": "img/lampe-livre-coran-1400.webp", "thumb": "img/lampe-livre-coran-700.webp", "caption": "Livre gravé · lumière ambrée"}, {"id": "g2", "photo": "img/tableau-lumineux-liberte-1400.webp", "thumb": "img/tableau-lumineux-liberte-700.webp", "caption": "Tableau lumineux pop art"}, {"id": "g3", "photo": "img/lampe-diplome-sara-1400.webp", "thumb": "img/lampe-diplome-sara-700.webp", "caption": "Diplôme personnalisé « Sara »"}, {"id": "g4", "photo": "img/lampe-voiture-rouge-1400.webp", "thumb": "img/lampe-voiture-rouge-700.webp", "caption": "Voiture de course · néon rouge"}]};
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
  const galSec=document.getElementById('photos')||document.getElementById('galerie');
  if(galSec)galSec.hidden=!gal.length;
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
  const visible=(D.products||[]).filter(p=>p.visible!==false&&(p.photo||p.thumb));
  window.PR_PRODUCTS=visible;
  if(window.PerfectHall&&PerfectHall.setProducts)PerfectHall.setProducts(visible);
  if(typeof window.fillThumbs==='function')window.fillThumbs(visible);
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
function mergeContent(remote){
  const merged=Object.assign({},DEFAULT,remote||{});
  const byId=new Map();
  for(const p of (remote&&remote.products)||[]) if(p&&p.id) byId.set(p.id,p);
  for(const p of DEFAULT.products||[]) if(p&&p.id&&!byId.has(p.id)) byId.set(p.id,p);
  const ids=[];
  for(const p of DEFAULT.products||[]) if(byId.has(p.id)) ids.push(p.id);
  for(const p of (remote&&remote.products)||[]) if(p&&p.id&&!ids.includes(p.id)) ids.push(p.id);
  merged.products=ids.map(id=>byId.get(id));
  merged.products_intro=DEFAULT.products_intro;
  return merged;
}
fetch(SB+'/rest/v1/perfect_room_content?id=eq.1&select=data',{headers:{apikey:KEY}}).then(r=>r.ok?r.json():null).then(j=>{if(j&&j[0]&&j[0].data)render(mergeContent(j[0].data))}).catch(()=>{});

/* ---------- Nav + bouton fixe ---------- */
const nav=$('#nav'),sc=$('.sticky-call');
const onScroll=()=>{const y=scrollY;nav.classList.toggle('scrolled',y>30&&!document.body.classList.contains('hall-active'));sc.classList.add('show')};
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

/* ---------- Atelier Néon IA ---------- */
(()=>{
const form=$('#neonForm'),input=$('#neonPrompt'),btn=$('#neonSubmit'),errEl=$('#neonErr'),resEl=$('#neonResult');
if(!form||!input||!btn||!resEl)return;

const ICONS={
  heart:'<path d="M12 20.5s-7-4.5-9.2-8.4C1 8.9 2.7 5 6.4 5c2.1 0 3.6 1.2 4.6 2.7C12 6.2 13.5 5 15.6 5c3.7 0 5.4 3.9 3.6 7.1-2.2 3.9-9.2 8.4-9.2 8.4z"/>',
  star:'<path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.8 1-6.1L3.2 9.4l6.1-.9z"/>',
  crown:'<path d="m3 18 2-10 4.5 4L12 5l2.5 7L19 8l2 10H3zm1 2h16"/>',
  sparkle:'<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9zM19 3l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z"/>',
  coffee:'<path d="M4 9h11v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V9zm11 1h2.5a2.5 2.5 0 0 1 0 5H15M7 5c0-1.2 1-1.6 1-2.8M11 5c0-1.2 1-1.6 1-2.8"/>',
  car:'<path d="M3 14l2-5.2A2 2 0 0 1 6.9 7.5h10.2a2 2 0 0 1 1.9 1.3L21 14v4h-2v-1.5H5V18H3v-4zm2.5-.5h13M6.5 16a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm11 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>',
  gamepad:'<path d="M6.5 9h11a4.5 4.5 0 0 1 4.4 5.4l-.6 2.8a2.3 2.3 0 0 1-3.9 1.1L15 16H9l-2.4 2.3a2.3 2.3 0 0 1-3.9-1.1l-.6-2.8A4.5 4.5 0 0 1 6.5 9zM8 11.5v3m-1.5-1.5h3m5.8-.5h.2m1.8 1.5h.2"/>',
  moon:'<path d="M19.5 14.5A7.5 7.5 0 0 1 9.5 4.5a7.5 7.5 0 1 0 10 10z"/>',
  grad:'<path d="m2 9 10-5 10 5-10 5-10-5zm4 2.3V16c0 1.8 2.7 3.2 6 3.2s6-1.4 6-3.2v-4.7M21 9.5v6"/>',
  book:'<path d="M3 5.5A2.5 2.5 0 0 1 5.5 3H12v16H5.5A2.5 2.5 0 0 0 3 21V5.5zm18 0A2.5 2.5 0 0 0 18.5 3H12v16h6.5a2.5 2.5 0 0 1 2.5 2V5.5z"/>',
  bolt:'<path d="M13 2 4.5 13h6l-1 9L19.5 11h-6z"/>',
  flower:'<path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm0-4c0-3 2.5-5 4-4s1 4-2 5m-2-1c0-3-2.5-5-4-4s-1 4 2 5m2 3c0 3 2.5 5 4 4s1-4-2-5m-2 1c0 3-2.5 5-4 4s-1-4 2-5"/>',
  music:'<path d="M9 17.5V6l10-2v11.5M9 17.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0zm10-2a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/>'
};
const FONT_LABEL={cursive:'Cursif fluide',modern:'Moderne épuré',retro:'Rétro néon',bold:'Audacieux'};
const SWATCHES=[
  {hex:'#ffe94a',sec:'#ff9f00',name:'Jaune néon'},
  {hex:'#ff5fb8',sec:'#ffd6ec',name:'Rose néon'},
  {hex:'#5ce8ff',sec:'#6f8cff',name:'Bleu glacier'},
  {hex:'#b37bff',sec:'#ff5fb8',name:'Violet néon'},
  {hex:'#ff4d5e',sec:'#ffb45c',name:'Rouge vif'}
];

let lastDesign=null,busy=false,activeModel=null;
// Les 4 modèles : un style chacun. Une fois choisi, tout texte tapé s'affiche dans ce style.
const MODELS={
  sara:{name:'Sara · cursif rose',fontStyle:'cursive',icon:'heart',layout:'inline_icon',productType:'neon_mural',productTypeLabel:'Néon LED mural sur acrylique',dimensionsCm:'50 × 22 cm',backingShape:'Découpe contour acrylique transparent',primaryColor:'#ff5fb8',primaryColorName:'Rose néon',secondaryColor:'#ffd6ec',secondaryColorName:'Blanc rosé'},
  gaming:{name:'Gaming · bleu audacieux',fontStyle:'bold',icon:'gamepad',layout:'inline_icon',productType:'neon_mural',productTypeLabel:'Néon LED mural sur acrylique',dimensionsCm:'60 × 25 cm',backingShape:'Découpe contour acrylique transparent',primaryColor:'#5ce8ff',primaryColorName:'Bleu glacier',secondaryColor:'#b37bff',secondaryColorName:'Violet néon'},
  coffee:{name:'Coffee · rétro ambre',fontStyle:'retro',icon:'coffee',layout:'inline_icon',productType:'neon_mural',productTypeLabel:'Enseigne néon LED sur acrylique',dimensionsCm:'55 × 25 cm',backingShape:'Plaque acrylique rectangulaire transparente',primaryColor:'#ffb45c',primaryColorName:'Ambre chaud',secondaryColor:'#ff9f00',secondaryColorName:'Orange doux'},
  diplome:{name:'Lampe diplôme',fontStyle:'modern',icon:'grad',layout:'inline_icon',productType:'lampe_socle',productTypeLabel:'Lampe LED gravée sur socle',dimensionsCm:'22 × 18 cm',backingShape:'Plaque acrylique gravée sur socle lumineux',primaryColor:'#ffe94a',primaryColorName:'Doré chaud',secondaryColor:'#ff9f00',secondaryColorName:'Ambre doux'}
};
const COLOR_RX=/(?:^|[^a-zA-ZÀ-ÿ])(rose|pink|fushia|magenta|bleu|bleue|cyan|turquoise|azur|violet|lilas|mauve|purple|rouge|red|vert|verte|menthe|green|jaune|blanc|blanche|ambre|orange|dor[eé]e?)(?![a-zA-ZÀ-ÿ])/i;
function applyModel(d,q){
  const m=activeModel&&MODELS[activeModel];
  if(!m||!d)return d;
  const out=Object.assign({},d,{fontStyle:m.fontStyle,icon:m.icon,layout:m.layout,productType:m.productType,productTypeLabel:m.productTypeLabel,dimensionsCm:m.dimensionsCm,backingShape:m.backingShape});
  if(!COLOR_RX.test(q)){Object.assign(out,{primaryColor:m.primaryColor,primaryColorName:m.primaryColorName,secondaryColor:m.secondaryColor,secondaryColorName:m.secondaryColorName});}
  out.subtitle=`${out.productTypeLabel} · ${out.primaryColorName}`;
  out.designNotes=`Maquette personnalisée en ${String(out.primaryColorName).toLowerCase()} sur ${String(out.backingShape).toLowerCase()}, style ${m.name}.`;
  out.placementTip=out.productType==='lampe_socle'?'Parfait sur une table de chevet, une étagère ou un bureau':'Idéal fixé au mur pour créer une ambiance douce et chaleureuse';
  out.whatsappSummary=`Bonjour Perfect Room, je souhaite un devis pour ce design : ${out.productTypeLabel} « ${out.neonText} » (modèle ${m.name}, ${out.primaryColorName}, env. ${out.dimensionsCm}).`;
  return out;
}
const safeHex=(h,f)=>/^#[0-9a-fA-F]{6}$/.test(String(h||''))?String(h):f;
const hexRgba=(h,a)=>{const n=parseInt(h.slice(1),16);return `rgba(${n>>16&255},${n>>8&255},${n&255},${a})`};
const mixHex=(a,b,t)=>{const n=h=>{const x=parseInt(h.slice(1),16);return [x>>16&255,x>>8&255,x&255]};const A=n(a),B=n(b);return '#'+[0,1,2].map(i=>Math.round(A[i]+(B[i]-A[i])*t).toString(16).padStart(2,'0')).join('')};
function applyStageColors(el,p,s){
  if(!el)return;
  el.style.setProperty('--n-p',p);
  el.style.setProperty('--n-s',s);
  el.style.setProperty('--n-core',mixHex('#ffffff',p,.12));
  el.style.setProperty('--n-spill',hexRgba(p,.6));
  el.style.setProperty('--n-wash',hexRgba(mixHex(p,'#6d7cff',.34),.52));
}

function localFallback(raw){
  const q=String(raw||'').replace(/\s+/g,' ').trim().slice(0,240);
  const low=q.toLowerCase();
  let primaryColor='#ffe94a',primaryColorName='Jaune néon chaud',secondaryColor='#ff9f00',secondaryColorName='Ambre doux';
  if(/\b(rose|pink|fushia|magenta)\b/.test(low)){primaryColor='#ff5fb8';primaryColorName='Rose néon';secondaryColor='#ffd6ec';secondaryColorName='Blanc rosé'}
  else if(/\b(bleu|bleue|cyan|turquoise|azur)\b/.test(low)){primaryColor='#5ce8ff';primaryColorName='Bleu glacier';secondaryColor='#6f8cff';secondaryColorName='Bleu électrique'}
  else if(/\b(violet|lilas|mauve|purple)\b/.test(low)){primaryColor='#b37bff';primaryColorName='Violet néon';secondaryColor='#ff5fb8';secondaryColorName='Rose doux'}
  else if(/\b(rouge|red|sport|ferrari)\b/.test(low)){primaryColor='#ff4d5e';primaryColorName='Rouge vif';secondaryColor='#ffb45c';secondaryColorName='Ambre chaud'}
  else if(/\b(vert|verte|menthe|emerald|green)\b/.test(low)){primaryColor='#5cffb0';primaryColorName='Vert menthe';secondaryColor='#5ce8ff';secondaryColorName='Cyan doux'}

  let productType='neon_mural',productTypeLabel='Néon LED mural sur acrylique',dimensionsCm='50 × 22 cm',backingShape='Découpe contour acrylique transparent';
  if(/(?:^|[^a-zA-ZÀ-ÿ])(lampe|socle|bureau|chevet|dipl[oô]me|grav[eé]e?)(?![a-zA-ZÀ-ÿ])/.test(low)){
    productType='lampe_socle';productTypeLabel='Lampe LED gravée sur socle';dimensionsCm='22 × 18 cm';backingShape='Plaque acrylique gravée sur socle lumineux';
  }else if(/\b(tableau|cadre|poster|toile|affiche)\b/.test(low)){
    productType='tableau_lumineux';productTypeLabel='Tableau lumineux rétroéclairé';dimensionsCm='40 × 60 cm';backingShape='Cadre mural rétroéclairé';
  }

  // Écriture cursive (tube néon) par défaut ; autre style seulement si le client le demande explicitement
  let fontStyle='cursive';
  if(/(?:^|[^a-zA-ZÀ-ÿ])(r[eé]tro|vintage|disco|ann[eé]es 80)(?![a-zA-ZÀ-ÿ])/.test(low))fontStyle='retro';
  else if(/\b(gras|bold|majuscules?|b[aâ]ton|imprimerie)\b/.test(low))fontStyle='bold';
  else if(/(?:^|[^a-zA-ZÀ-ÿ])(moderne|[eé]pur[eé]|minimalistes?)(?![a-zA-ZÀ-ÿ])/.test(low))fontStyle='modern';

  let icon='none';
  if(/\b(c[oœ]ur|love|amour|mariage|couple)\b/.test(low))icon='heart';
  else if(/\b(reine|roi|queen|king|couronne)\b/.test(low))icon='crown';
  else if(/(?:^|[^a-zA-ZÀ-ÿ])(caf[eé]|coffee|th[eé]|tasse)(?![a-zA-ZÀ-ÿ])/.test(low))icon='coffee';
  else if(/\b(voiture|auto|sport|supra|bmw|moto)\b/.test(low))icon='car';
  else if(/\b(game|gaming|manette|gamer|setup)\b/.test(low))icon='gamepad';
  else if(/\b(lune|nuit|chambre|r[eê]ve)\b/.test(low))icon='moon';
  else if(/\b(dipl[oô]me|bac|master|licence)\b/.test(low))icon='grad';
  else if(/\b(coran|livre|verset)\b/.test(low))icon='book';
  else if(/\b([eé]clair|bolt|gym)\b/.test(low))icon='bolt';
  else if(/\b(fleur|tulipe)\b/.test(low))icon='flower';
  else if(/\b(musique|note|studio|dj)\b/.test(low))icon='music';
  else if(/\b([eé]toile|star)\b/.test(low))icon='star';

  const quoted=q.match(/[«"]([^»"]{1,26})[»"]/);
  const named=q.match(/(?:pr[eé]nom|texte|mot|nom|écrit|ecrit)\s+([A-Za-zÀ-ÿ0-9'& -]{2,22})/i);
  let neonText=quoted?quoted[1]:(named?named[1].replace(/\b(en|pour|avec|sur)\b.*$/i,'').trim():'');
  if(!neonText){
    neonText=q.replace(/\b(un|une|des|le|la|les|et|ou|pour|avec|en|sur|de|du|mon|ma|lampe|n[eé]on|tableau|lumineux|enseigne|grav[eé]e?|cursif|cursive|chambre|salon|bureau|rose|bleu|bleue|glacier|jaune|rouge|violet|vert|verte|dor[eé]e?|ambre|chaud|chaude|style)\b/gi,' ').replace(/\s+/g,' ').trim().split(' ').slice(0,3).join(' ');
  }
  if(!neonText||neonText.length<2)neonText='Perfect Room';
  neonText=neonText.charAt(0).toUpperCase()+neonText.slice(1);
  if(neonText.length>26)neonText=neonText.slice(0,26).trim();

  return {
    title:`Création « ${neonText} »`,
    neonText,
    subtitle:`${productTypeLabel} · ${primaryColorName}`,
    productType,productTypeLabel,fontStyle,
    primaryColor,primaryColorName,secondaryColor,secondaryColorName,
    glowIntensity:'doux',icon,layout:productType==='tableau_lumineux'?'framed':'inline_icon',
    dimensionsCm,backingShape,
    placementTip:productType==='lampe_socle'?'Parfait sur une table de chevet, une étagère ou un bureau':'Idéal fixé au mur pour créer une ambiance douce et chaleureuse',
    designNotes:`Maquette personnalisée en ${primaryColorName.toLowerCase()} sur ${backingShape.toLowerCase()}.`,
    whatsappSummary:`Bonjour Perfect Room, je souhaite un devis pour ce design : ${productTypeLabel} « ${neonText} » (${primaryColorName}, env. ${dimensionsCm}). Demande : ${q}`
  };
}

function renderDesign(d){
  lastDesign=d;
  const pCol=safeHex(d.primaryColor,'#ffe94a');
  const sCol=safeHex(d.secondaryColor,'#ff9f00');
  const fontCls='font-'+(FONT_LABEL[d.fontStyle]?d.fontStyle:'modern');
  const typeCls='type-'+(d.productType||'neon_mural');
  const layoutCls='layout-'+(d.layout||'inline_icon');
  const icoPath=ICONS[d.icon]||null;
  const wa=String((DATA&&DATA.whatsapp)||'213561122911').replace(/\D/g,'');
  const th=telHref((DATA&&DATA.phone)||'0561 12 29 11')||'tel:+213561122911';
  const phoneTxt=(DATA&&DATA.phone)||'0561 12 29 11';
  const waMsg=encodeURIComponent(d.whatsappSummary||`Bonjour Perfect Room, je souhaite un devis pour : ${d.neonText} (${d.primaryColorName})`);
  const waUrl=wa?`https://wa.me/${wa}?text=${waMsg}`:th;
  const txt=esc(d.neonText);
  const cable='<svg class="neon-cable" viewBox="0 0 28 26" width="28" height="26" aria-hidden="true"><path d="M8 0 C8 10 4 14 6 20 C7 24 12 24 11 26" fill="none" stroke="#161616" stroke-width="2.4" stroke-linecap="round"/><path d="M7.3 0 C7.3 10 3.3 14 5.3 20 C6.3 24 11.3 24 10.3 26" fill="none" stroke="rgba(255,255,255,.22)" stroke-width=".55" stroke-linecap="round"/></svg>';

  resEl.hidden=false;
  resEl.innerHTML=`
    <div class="neon-card">
      <div class="neon-stage ${d.glowIntensity==='intense'?'intense':''} ignite">
        <div class="neon-room" aria-hidden="true"><span class="neon-window"></span><span class="neon-fairy"></span></div>
        <span class="neon-stage-tag">${esc(d.productTypeLabel)}</span>
        <div class="neon-board ${typeCls} ${layoutCls}">
          ${d.productType!=='lampe_socle'?'<span class="neon-standoff st-tl" aria-hidden="true"></span><span class="neon-standoff st-tr" aria-hidden="true"></span><span class="neon-standoff st-bl" aria-hidden="true"></span><span class="neon-standoff st-br" aria-hidden="true"></span>':''}
          ${icoPath?`<svg class="neon-svg-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icoPath}</svg>`:''}
          <span class="neon-sign ${fontCls}">
            <span class="neon-sign-bloom" aria-hidden="true">${txt}</span>
            <span class="neon-sign-halo" aria-hidden="true">${txt}</span>
            <span class="neon-sign-tube" aria-hidden="true">${txt}</span>
            <span class="neon-sign-core">${txt}</span>
          </span>
          ${d.productType!=='lampe_socle'?cable:''}
        </div>
        ${d.productType==='lampe_socle'?'<div class="neon-pedestal" aria-hidden="true"></div>':''}
        <div class="neon-swatches" role="group" aria-label="Tester une autre couleur">
          <span>Tester une couleur :</span>
          ${SWATCHES.map(sw=>`<button type="button" class="sw-dot ${sw.hex.toLowerCase()===pCol.toLowerCase()?'on':''}" data-sw="${sw.hex}" data-sec="${sw.sec}" data-name="${esc(sw.name)}" style="background:${sw.hex};box-shadow:0 0 10px ${sw.hex}" aria-label="${esc(sw.name)}" title="${esc(sw.name)}"></button>`).join('')}
        </div>
      </div>

      <div class="neon-info">
        <div>
          <h3>${esc(d.title)}</h3>
          <p class="neon-sub-line" id="neonSubLine">${esc(d.subtitle)}</p>
        </div>
        <div class="neon-meta">
          <div class="neon-meta-item"><small>Couleur</small><strong><span class="clr-pill" id="neonClrPill" style="background:${pCol};box-shadow:0 0 8px ${pCol}"></span><span id="neonClrName">${esc(d.primaryColorName)}</span></strong></div>
          <div class="neon-meta-item"><small>Format estimé</small><strong>${esc(d.dimensionsCm)}</strong></div>
          <div class="neon-meta-item"><small>Style</small><strong>${esc(FONT_LABEL[d.fontStyle]||'Moderne')}</strong></div>
          <div class="neon-meta-item"><small>Support</small><strong>${esc(d.backingShape)}</strong></div>
        </div>
        <p class="neon-notes">${esc(d.designNotes)}</p>
        <p class="neon-tip">💡 ${esc(d.placementTip)}</p>
        <div class="neon-ctas">
          <a class="btn btn-glow" id="neonWaBtn" href="${waUrl}" ${wa?'target="_blank" rel="noopener"':''}>💬 Demander un devis</a>
          <a class="btn btn-ghost" href="${th}">📞 ${esc(phoneTxt)}</a>
        </div>
        <p class="neon-quote-note">Fabrication sur mesure à Tlemcen · Prix exact sur devis</p>
      </div>
    </div>`;

  applyStageColors(resEl.querySelector('.neon-stage'),pCol,sCol);
  if(!reduce&&resEl.getBoundingClientRect().top>innerHeight*0.72)resEl.scrollIntoView({behavior:'smooth',block:'nearest'});
  resEl.querySelectorAll('[data-sw]').forEach(dot=>{
    dot.addEventListener('click',()=>{
      if(!lastDesign)return;
      const p=dot.dataset.sw,sec=dot.dataset.sec,name=dot.dataset.name;
      lastDesign=Object.assign({},lastDesign,{
        primaryColor:p,secondaryColor:sec,primaryColorName:name,
        subtitle:`${lastDesign.productTypeLabel} · ${name}`,
        whatsappSummary:`Bonjour Perfect Room, je souhaite un devis pour ce design : ${lastDesign.productTypeLabel} « ${lastDesign.neonText} » (${name}, style ${FONT_LABEL[lastDesign.fontStyle]||lastDesign.fontStyle}, env. ${lastDesign.dimensionsCm}).`
      });
      const stage=resEl.querySelector('.neon-stage');
      if(stage){stage.classList.remove('ignite');applyStageColors(stage,p,sec)}
      resEl.querySelectorAll('.sw-dot').forEach(d=>d.classList.toggle('on',d===dot));
      const sub=$('#neonSubLine');if(sub)sub.textContent=lastDesign.subtitle;
      const nm=$('#neonClrName');if(nm)nm.textContent=name;
      const pill=$('#neonClrPill');if(pill){pill.style.background=p;pill.style.boxShadow='0 0 8px '+p}
      const waBtn=$('#neonWaBtn');
      if(waBtn){
        const w=String((DATA&&DATA.whatsapp)||'213561122911').replace(/\D/g,'');
        if(w)waBtn.href='https://wa.me/'+w+'?text='+encodeURIComponent(lastDesign.whatsappSummary);
      }
    });
  });
}

async function generateDesign(prompt){
  const q=String(prompt||'').replace(/\s+/g,' ').trim();
  errEl.hidden=true;errEl.textContent='';
  if(q.length<2){
    errEl.textContent='Écrivez quelques mots pour décrire votre néon (ex. : « Prénom Sara »).';
    errEl.hidden=false;input.focus();return;
  }
  if(busy)return;
  busy=true;btn.disabled=true;btn.classList.add('loading');
  btn.querySelector('.neon-submit-txt').textContent='Création…';
  resEl.hidden=false;
  resEl.innerHTML='<div class="neon-loading"><div class="neon-loading-bar"></div><p>L\'atelier IA prépare votre maquette lumineuse…</p></div>';

  const ctrl=new AbortController();
  const t=setTimeout(()=>ctrl.abort(),11000);
  try{
    const resp=await fetch('/api/neon-design',{
      method:'POST',
      signal:ctrl.signal,
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({prompt:q.slice(0,240)})
    });
    const data=await resp.json().catch(()=>null);
    if(!resp.ok&&resp.status===429){
      errEl.textContent=(data&&data.error)||'Patientez un instant avant une nouvelle demande.';
      errEl.hidden=false;
      renderDesign(applyModel(localFallback(q),q));
      return;
    }
    if(data&&data.ok&&data.design){
      renderDesign(applyModel(data.design,q));
    }else{
      renderDesign(applyModel(localFallback(q),q));
    }
  }catch(_){
    renderDesign(applyModel(localFallback(q),q));
  }finally{
    clearTimeout(t);
    busy=false;btn.disabled=false;btn.classList.remove('loading');
    btn.querySelector('.neon-submit-txt').textContent='Créer mon néon';
  }
}

form.addEventListener('submit',e=>{
  e.preventDefault();
  generateDesign(input.value);
});

const modelNote=$('#neonModelNote');
function setModel(key){
  activeModel=key&&MODELS[key]?key:null;
  $$('.neon-chip').forEach(c=>{const on=c.dataset.model===activeModel;c.classList.toggle('active',on);c.setAttribute('aria-pressed',on?'true':'false')});
  if(modelNote)modelNote.innerHTML=activeModel
    ?`Modèle choisi : <strong>${esc(MODELS[activeModel].name)}</strong>. Tapez votre texte, il s'affichera dans ce style. <button type="button" class="neon-model-reset">Revenir au cursif</button>`
    :'Écriture cursive par défaut. Choisissez un modèle pour changer de style.';
  const r=modelNote&&modelNote.querySelector('.neon-model-reset');
  if(r)r.addEventListener('click',()=>{setModel(null);input.focus()});
  input.placeholder=activeModel?'Tapez votre prénom ou votre texte…':input.dataset.ph||input.placeholder;
}
if(!input.dataset.ph)input.dataset.ph=input.placeholder;
$$('.neon-chip').forEach(chip=>{
  chip.addEventListener('click',()=>{
    if(activeModel===chip.dataset.model){setModel(null);return;}
    setModel(chip.dataset.model);
    const typed=input.value.trim();
    const isExample=$$('.neon-chip').some(c=>c.dataset.prompt===typed);
    if(!typed||isExample)input.value=chip.dataset.prompt||'';
    generateDesign(input.value);
  });
});
})();

/* ---------- Liens du menu : saut direct, sans traverser toute la galerie 3D au ralenti ---------- */
document.addEventListener('click',e=>{
  const a=e.target.closest('a[href^="#"]');
  if(!a)return;
  const id=a.getAttribute('href');
  if(!id||id==='#')return;
  const el=document.querySelector(id);
  if(!el)return;
  e.preventDefault();
  const top=el.getBoundingClientRect().top+window.scrollY-78;
  window.scrollTo(0, Math.max(0,top));
});

/* ---------- Fiche produit + panier (confirmation téléphone obligatoire) ---------- */
(()=>{
const page=$('#productPage'), img=$('#ppImg'), title=$('#ppTitle'), sub=$('#ppSub'), price=$('#ppPrice');
const details=$('#ppDetails'), thumbs=$('#ppThumbs'), qtyEl=$('#ppQty');
const drawer=$('#cartDrawer'), itemsUl=$('#cartItems'), emptyEl=$('#cartEmpty');
const badge=$('#cartBadge'), phoneIn=$('#cartPhone'), errEl=$('#cartErr'), okEl=$('#cartOk');
const form=$('#cartForm');
if(!page)return;

let current=null, qty=1, opts={format:'standard', fin:'atelier'};
const cart=JSON.parse(sessionStorage.getItem('pr_cart')||'[]');

function visibleProducts(){return (DATA.products||[]).filter(p=>p.visible!==false&&(p.photo||p.thumb))}
window.fillThumbs=function(list){
  if(!thumbs)return;
  const arr=list||visibleProducts();
  thumbs.innerHTML=arr.map(p=>`<button type="button" data-open="${esc(p.id)}" aria-label="${esc(p.name)}"><img src="${esc(p.thumb||p.photo)}" alt="${esc(p.name)}"></button>`).join('');
};

function kindOf(p){
  if(p&&p.example) return 'Exemple de réalisation';
  const n=((p.name||'')+' '+(p.description||'')).toLowerCase();
  if(/n[eé]on/.test(n)) return 'Néon personnalisé';
  if(/tableau|r[eé]tro/.test(n))return 'Tableau rétroéclairé';
  return 'Lampe LED gravée';
}
function formatNote(){
  if(!current)return;
  const perso=opts.format==='perso'||opts.fin==='idee';
  const base=current.price?esc(current.price):'Prix sur demande';
  $('#ppNote').textContent=perso
    ? 'Demande personnalisée — le prix et les dimensions se confirment par téléphone.'
    : 'Prix et personnalisation sur demande. Fabrication à Tlemcen.';
  price.textContent=base;
}

function openProduct(p, rect){
  if(!p)return;
  current=p; qty=1; opts={format:'standard', fin:'atelier'};
  qtyEl.textContent='1';
  title.textContent=(p.name||'').toUpperCase();
  sub.textContent=kindOf(p)+(p.description?' · '+p.description:'');
  price.textContent=p.price||'Prix sur demande';
  details.innerHTML=p.example
    ?`<p>${esc(p.description||'')}</p><p>Modèle personnalisable, fabriqué à l'atelier Perfect Room à Tlemcen. Le visuel est un exemple : prénom, texte, motif et couleur de lumière se précisent ensemble. Prix sur demande — rien n'est facturé sans confirmation par téléphone.</p>`
    :`<p>${esc(p.description||'')}</p><p>Création fabriquée à l'atelier Perfect Room, à Tlemcen. Dimensions, couleur de lumière et personnalisation (prénom, texte, motif) se précisent ensemble — rien n'est facturé sans confirmation par téléphone.</p>`;
  img.src=p.photo||p.thumb||'';
  img.alt=p.name||'';
  $$('#productPage .pp-opt').forEach(b=>{
    const on=b.dataset.val===(b.dataset.opt==='format'?'standard':'atelier');
    b.classList.toggle('on',on);b.setAttribute('aria-pressed',on?'true':'false');
  });
  formatNote();
  fillThumbs();
  page.hidden=false;
  document.documentElement.classList.add('pp-open');
  document.body.classList.add('pp-open');
  // Le fly-from-rect cassait la grille 2 colonnes (position:fixed sortait l'image du flux).
  // La caméra 3D a déjà volé vers le cadre ; la fiche apparaît en cascade.
  if(window.PerfectHall&&PerfectHall.canvasOpacity)PerfectHall.canvasOpacity(0);
  page.classList.remove('on');
  void page.offsetWidth;
  requestAnimationFrame(()=>page.classList.add('on'));
  $('#ppBack').focus();
}

function closeProduct(){
  page.classList.remove('on');
  document.documentElement.classList.remove('pp-open');
  document.body.classList.remove('pp-open');
  setTimeout(()=>{page.hidden=true;}, reduce?0:400);
  if(window.PerfectHall&&PerfectHall.closeProduct)PerfectHall.closeProduct();
  else if(window.PerfectHall&&PerfectHall.canvasOpacity)PerfectHall.canvasOpacity(1);
}

document.addEventListener('hall:open-product',e=>{
  const {product,rect}=e.detail||{};
  openProduct(product, rect);
});

$('#ppBack').onclick=closeProduct;
$('#ppSituation').onclick=closeProduct;
$('#ppMinus').onclick=()=>{qty=Math.max(1,qty-1);qtyEl.textContent=qty};
$('#ppPlus').onclick=()=>{qty=Math.min(9,qty+1);qtyEl.textContent=qty};
page.addEventListener('click',e=>{
  const opt=e.target.closest('.pp-opt');
  if(opt){
    const group=opt.dataset.opt;
    $$(`.pp-opt[data-opt="${group}"]`).forEach(b=>{b.classList.remove('on');b.setAttribute('aria-pressed','false')});
    opt.classList.add('on');opt.setAttribute('aria-pressed','true');
    opts[group]=opt.dataset.val;
    formatNote();
  }
  const th=e.target.closest('[data-open]');
  if(th){
    const p=visibleProducts().find(x=>x.id===th.dataset.open);
    if(p) openProduct(p,null);
  }
});
addEventListener('keydown',e=>{if(e.key==='Escape'&&!page.hidden){if(!drawer.hidden&&drawer.classList.contains('on'))closeCart();else closeProduct()}});

function saveCart(){sessionStorage.setItem('pr_cart',JSON.stringify(cart))}
function renderCart(){
  const n=cart.reduce((s,i)=>s+i.qty,0);
  if(badge){badge.dataset.n=n;badge.textContent=n?String(n):''}
  if(!cart.length){
    itemsUl.innerHTML='';emptyEl.hidden=false;form.hidden=true;
  }else{
    emptyEl.hidden=true;form.hidden=false;
    itemsUl.innerHTML=cart.map((i,idx)=>`<li>
      <img src="${esc(i.thumb||i.photo)}" alt="">
      <div><h3>${esc(i.name)}</h3><p>${esc(i.price||'Prix sur demande')} · qté ${i.qty}${i.format==='perso'?' · personnalisé':''}${i.fin==='idee'?' · devis':''}</p></div>
      <button type="button" class="cart-rm" data-rm="${idx}">Retirer</button>
    </li>`).join('');
  }
}
function openCart(){
  drawer.hidden=false;requestAnimationFrame(()=>drawer.classList.add('on'));
  renderCart();
  if(okEl)okEl.hidden=true;
}
function closeCart(){
  drawer.classList.remove('on');
  setTimeout(()=>{drawer.hidden=true},300);
}
$('#ppAdd').onclick=()=>{
  if(!current)return;
  const found=cart.find(i=>i.id===current.id&&i.format===opts.format&&i.fin===opts.fin);
  if(found) found.qty=Math.min(9,found.qty+qty);
  else cart.push({id:current.id,name:current.name,photo:current.photo,thumb:current.thumb||current.photo,price:current.price||'',qty,format:opts.format,fin:opts.fin});
  saveCart();renderCart();openCart();
};
$('#navCart')&&($('#navCart').onclick=openCart);
$('#cartClose').onclick=closeCart;
$('#cartBg').onclick=closeCart;
itemsUl.addEventListener('click',e=>{
  const b=e.target.closest('[data-rm]');
  if(!b)return;cart.splice(+b.dataset.rm,1);saveCart();renderCart();
});

function validPhone(v){
  const d=String(v||'').replace(/\D/g,'');
  return d.length>=9 && d.length<=13;
}
form.addEventListener('submit',e=>{
  e.preventDefault();
  errEl.hidden=true;
  if(!cart.length)return;
  const raw=phoneIn.value;
  if(!validPhone(raw)){errEl.hidden=false;phoneIn.focus();return;}
  const lines=cart.map(i=>`• ${i.name} ×${i.qty}${i.format==='perso'?' (personnalisé)':''}${i.fin==='idee'?' (devis)':''}`);
  const msg=encodeURIComponent(
    'Bonjour Perfect Room, je souhaite commander :\n'+lines.join('\n')+
    '\nTéléphone pour confirmation : '+raw.trim()+
    '\nMerci de me rappeler pour confirmer.'
  );
  const wa=String(DATA.whatsapp||'').replace(/\D/g,'')||'213561122911';
  // Confirmation faite : on ouvre WhatsApp avec le récapitulatif, le panier est vidé après
  okEl.hidden=false;
  okEl.textContent='Demande confirmée avec le numéro '+raw.trim()+' . Ouverture de WhatsApp…';
  cart.splice(0,cart.length);saveCart();renderCart();
  setTimeout(()=>{window.open('https://wa.me/'+wa+'?text='+msg,'_blank','noopener');},400);
});

renderCart();
  if(window.PerfectHall&&PerfectHall.setProducts)PerfectHall.setProducts((DATA.products||[]).filter(p=>p.visible!==false&&(p.photo||p.thumb)));
  fillThumbs();
})();

/* Si la galerie 3D arrive après le premier rendu, on lui renvoie les produits. */
function pushProductsToHall(){
  const visible=window.PR_PRODUCTS||(DATA.products||[]).filter(p=>p.visible!==false&&(p.photo||p.thumb));
  window.PR_PRODUCTS=visible;
  if(window.PerfectHall&&PerfectHall.setProducts)PerfectHall.setProducts(visible);
}
pushProductsToHall();
[100,400,1000,2000].forEach(ms=>setTimeout(pushProductsToHall,ms));
document.addEventListener('DOMContentLoaded',pushProductsToHall);
})();
