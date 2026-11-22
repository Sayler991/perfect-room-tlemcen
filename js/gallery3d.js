/* Galerie 3D immersive — inspirée de l'expérience « Websites in 2026 ».
   Les photos des produits sont affichées telles quelles (non retouchées). */
import * as THREE from 'three';

const REDUCE = matchMedia('(prefers-reduced-motion: reduce)').matches;
const R = 24;             // rayon du mur (courbe ample)
const COVE = 1.45;
const WALL_H = 8.5;
const CAM_DIST = 7.2;     // distance caméra → mur
const CAM_Y = 1.95;
const FRAME_Y = 3.15;
const FRAME_H = 2.25;
const THETA_START = -Math.PI * 0.55;
const THETA_LEN = Math.PI * 1.15;

const power3InOut = t => t < .5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3)/2;
const clamp = (v,a,b) => Math.max(a, Math.min(b, v));
const lerp = (a,b,t) => a + (b-a)*t;

function hexColor(h, fallback='#ffb45c'){
  const s = String(h||fallback).replace('#','');
  const n = parseInt(s.length===3 ? s.replace(/./g,c=>c+c) : s, 16);
  return new THREE.Color(((n>>16)&255)/255, ((n>>8)&255)/255, (n&255)/255);
}

function classify(p){
  const n = ((p.name||'')+' '+(p.description||'')).toLowerCase();
  const example = !!p.example;
  const kindEx = 'Exemple de réalisation';
  if(/tableau|r[eé]tro[eé]?clair|pop art/.test(n))
    return {kind: example?kindEx:'Tableau rétroéclairé', collection:'tableaux', title:'TABLEAUX LUMINEUX', kicker:'Créations murales', glow:'#ff7ad9', enter:'Découvrir la collection'};
  if(/n[eé]on/.test(n)){
    const glow = /commerce|enseigne|caf[eé]/.test(n) ? '#ffb45c' : '#ffb0d0';
    return {kind: example?kindEx:'Néon personnalisé', collection:'neons', title:'NÉONS PERSONNALISÉS', kicker:'Modèles personnalisables', glow, enter:'Découvrir les exemples'};
  }
  if(/voiture|course/.test(n))
    return {kind: example?kindEx:'Lampe LED gravée', collection:'lampes', title:'LAMPES GRAVÉES', kicker:'Créations Perfect Room', glow:'#ff4d5e', enter:'Découvrir la collection'};
  if(/dipl[oô]me/.test(n))
    return {kind: example?kindEx:'Lampe LED gravée', collection:'lampes', title:'LAMPES GRAVÉES', kicker:'Créations Perfect Room', glow:'#e8f0ff', enter:'Découvrir la collection'};
  if(/enfant|veilleuse/.test(n))
    return {kind: example?kindEx:'Lampe LED gravée', collection:'lampes', title:'LAMPES GRAVÉES', kicker:'Créations Perfect Room', glow:'#ffe18a', enter:'Découvrir la collection'};
  if(/couple/.test(n))
    return {kind: example?kindEx:'Lampe LED gravée', collection:'lampes', title:'LAMPES GRAVÉES', kicker:'Créations Perfect Room', glow:'#ffe8c8', enter:'Découvrir la collection'};
  return {kind: example?kindEx:'Lampe LED gravée', collection:'lampes', title:'LAMPES GRAVÉES', kicker:'Créations Perfect Room', glow:'#ffb45c', enter:'Découvrir la collection'};
}

function webglInfo(){
  try{
    const c = document.createElement('canvas');
    const gl = c.getContext('webgl',{failIfMajorPerformanceCaveat:false}) || c.getContext('experimental-webgl');
    if(!gl) return {ok:false, weak:true, renderer:''};
    const dbg = gl.getExtension('WEBGL_debug_renderer_info');
    const renderer = dbg ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL)||'') : '';
    const weak = /SwiftShader|llvmpipe|Software|softpipe/i.test(renderer);
    const lose = gl.getExtension('WEBGL_lose_context');
    if(lose) lose.loseContext();
    return {ok:true, weak, renderer};
  }catch(e){
    return {ok:false, weak:true, renderer:''};
  }
}

function makeGlowTex(hex){
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(128,128,8,128,128,128);
  grd.addColorStop(0, hex+'99');
  grd.addColorStop(.35, hex+'55');
  grd.addColorStop(.7, hex+'18');
  grd.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = grd;
  g.fillRect(0,0,256,256);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function makeShadowTex(){
  const c = document.createElement('canvas');
  c.width = 256; c.height = 128;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(128,20,4,128,40,120);
  grd.addColorStop(0, 'rgba(40,32,28,.18)');
  grd.addColorStop(.5, 'rgba(40,32,28,.06)');
  grd.addColorStop(1, 'rgba(40,32,28,0)');
  g.fillStyle = grd;
  g.fillRect(0,0,256,128);
  const t = new THREE.CanvasTexture(c);
  return t;
}

function makeLabelTex(kind, name){
  const c = document.createElement('canvas');
  c.width = 1024; c.height = 256;
  const ctx = c.getContext('2d');
  ctx.clearRect(0,0,1024,256);
  ctx.fillStyle = '#5a5a5a';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.font = '500 36px Inter, Outfit, system-ui, sans-serif';
  ctx.letterSpacing = '8px';
  ctx.fillText(String(kind||'').toUpperCase(), 24, 40);
  ctx.font = '300 66px Inter, Outfit, system-ui, sans-serif';
  ctx.letterSpacing = '1px';
  ctx.fillStyle = '#111';
  ctx.fillText(String(name||''), 24, 108);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.needsUpdate = true;
  return t;
}

function makeFloorTitleTex(kicker, title, enter){
  const c = document.createElement('canvas');
  c.width = 2048; c.height = 700;
  const ctx = c.getContext('2d');
  ctx.clearRect(0,0,2048,700);
  ctx.fillStyle = '#161616';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '500 48px Inter, Outfit, system-ui, sans-serif';
  ctx.letterSpacing = '14px';
  ctx.fillText(String(kicker||'').toUpperCase(), 1024, 140);
  ctx.font = '300 168px Inter, Outfit, system-ui, sans-serif';
  ctx.letterSpacing = '10px';
  const t = String(title||'').toUpperCase();
  // Ajuster un peu si le titre est long
  if(t.length > 22) ctx.font = '300 128px Inter, Outfit, system-ui, sans-serif';
  ctx.fillText(t, 1024, 340);
  ctx.font = '500 42px Inter, Outfit, system-ui, sans-serif';
  ctx.letterSpacing = '12px';
  ctx.fillText(String(enter||'DÉCOUVRIR LA COLLECTION').toUpperCase(), 1024, 520);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

function makePaintedBrickTex(){
  const c = document.createElement('canvas');
  c.width = c.height = 512;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#f4f1ea';
  ctx.fillRect(0,0,512,512);
  const bw = 86, bh = 36, mort = 3;
  let row = 0;
  for(let y=0; y<512; y+=bh){
    const off = (row%2) ? bw/2 : 0;
    for(let x=-bw; x<512+bw; x+=bw){
      const n = ((x*13+y*7+row*3)%9);
      const v = 236 + n; // very light cream variation
      ctx.fillStyle = `rgb(${v},${v-2},${v-8})`;
      const xx = x+off+mort, yy = y+mort, ww = bw-mort, hh = bh-mort;
      ctx.fillRect(xx, yy, ww, hh);
      ctx.fillStyle = 'rgba(150,140,128,0.10)';
      ctx.fillRect(xx, yy+hh-2, ww, 2);
    }
    row++;
  }
  // very faint mortar lines
  ctx.strokeStyle = 'rgba(158,148,132,0.32)';
  ctx.lineWidth = 1.2;
  row = 0;
  for(let y=0; y<=512; y+=bh){
    ctx.beginPath(); ctx.moveTo(0,y+0.5); ctx.lineTo(512,y+0.5); ctx.stroke();
    const off = (row%2) ? bw/2 : 0;
    for(let x=-bw; x<512+bw; x+=bw){
      ctx.beginPath(); ctx.moveTo(x+off+0.5,y); ctx.lineTo(x+off+0.5,y+bh); ctx.stroke();
    }
    row++;
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = 4;
  t.needsUpdate = true;
  return t;
}

function addPaintedBrickSkin(scene){
  const tex = makePaintedBrickTex();
  tex.repeat.set(36, 6);
  const pts = [
    new THREE.Vector2(R - 0.012, COVE + 0.06),
    new THREE.Vector2(R - 0.012, COVE + WALL_H - 0.2)
  ];
  const geo = new THREE.LatheGeometry(pts, 96, 0, Math.PI * 2);
  const mat = new THREE.MeshBasicMaterial({
    map: tex,
    transparent: true,
    opacity: 0.2,
    depthWrite: false,
    side: THREE.DoubleSide
  });
  scene.add(new THREE.Mesh(geo, mat));
}

function makeHallGeometry(){
  const pts = [];
  const floorR = R - COVE;
  pts.push(new THREE.Vector2(0, 0));
  for(let i=1;i<=20;i++) pts.push(new THREE.Vector2(floorR*(i/20), 0));
  for(let i=1;i<=24;i++){
    const a = (i/24)*Math.PI/2;
    pts.push(new THREE.Vector2(floorR + COVE*Math.sin(a), COVE*(1-Math.cos(a))));
  }
  pts.push(new THREE.Vector2(R, COVE + WALL_H));
  // Salle circulaire complète : aucun bord ouvert n'apparaît à l'image
  const geo = new THREE.LatheGeometry(pts, 128, 0, Math.PI * 2);
  geo.computeVertexNormals();
  return geo;
}

function hallVertexColors(geo){
  // Léger dégradé : sol un peu plus sombre, mur très blanc
  const pos = geo.attributes.position;
  const colors = new Float32Array(pos.count*3);
  const cFloor = new THREE.Color('#d2d0cc');
  const cCove  = new THREE.Color('#ebe9e6');
  const cWall  = new THREE.Color('#f7f6f4');
  const tmp = new THREE.Color();
  for(let i=0;i<pos.count;i++){
    const y = pos.getY(i);
    const t = clamp(y / (COVE + 0.4), 0, 1);
    if(t < .01) tmp.copy(cFloor);
    else if(t < 1) tmp.copy(cFloor).lerp(cCove, t);
    else tmp.copy(cWall);
    // Légère assombrisure vers le bas du mur pour la plinthe
    colors[i*3]=tmp.r; colors[i*3+1]=tmp.g; colors[i*3+2]=tmp.b;
  }
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
}

function angleOf(t, a0, a1){ return a0 + t*(a1-a0); }

function posOn(angle, radius, y){
  // Lathe tourne autour de Y ; à theta=0 le profil est dans le plan X (x=radius, z=0)
  return new THREE.Vector3(Math.cos(angle)*radius, y, Math.sin(angle)*radius);
}

function inwardQuat(angle, y){
  // lookAt oriente le -Z vers la cible. On vise un point derrière le mur
  // pour que le +Z (face du plan de la photo) soit tourné vers le centre, donc vers la caméra.
  const p = posOn(angle, R, y);
  const outward = posOn(angle, R + 1, y);
  const q = new THREE.Quaternion();
  const m = new THREE.Matrix4().lookAt(p, outward, new THREE.Vector3(0,1,0));
  q.setFromRotationMatrix(m);
  return q;
}

const state = {
  ready:false,
  mode:'none', // '3d' | 'fallback'
  products:[],
  frames:[],
  titles:[],
  targetP:0,
  currentP:0,
  flying:false,
  productOpen:false,
  openId:null,
  savedP:0,
  raf:0,
  weak:false,
  hoverFrame:null,
  pressFrame:null,
  introT0:0
};

const _lift = new THREE.Vector3();
const _tiltQ = new THREE.Quaternion();
const _tiltE = new THREE.Euler();

function getEls(){
  return {
    section: document.getElementById('hall'),
    pin: document.getElementById('hallPin'),
    canvas: document.getElementById('hallCanvas'),
    spacer: document.getElementById('hallSpacer'),
    fallback: document.getElementById('hallFallback'),
    loader: document.getElementById('hallLoader'),
    hint: document.getElementById('hallHint')
  };
}

function setHallActive(on){
  document.body.classList.toggle('hall-active', !!on);
  document.body.classList.toggle('hall-3d', !!on && state.mode==='3d' && !state.productOpen);
}

function scrollBounds(){
  const {section, spacer} = getEls();
  if(!section||!spacer) return {start:0,end:1};
  const start = section.offsetTop;
  const end = start + Math.max(1, section.offsetHeight - innerHeight);
  return {start, end};
}

function progressFromScroll(){
  const {start,end} = scrollBounds();
  return clamp((scrollY - start)/(end-start), 0, 1);
}

function scrollToProgress(p, behavior){
  const {start,end} = scrollBounds();
  const y = start + clamp(p,0,1)*(end-start);
  if(behavior==='instant' || REDUCE) scrollTo(0, y);
  else scrollTo({top:y, behavior:'auto'});
}

function camPose(p){
  const a0 = state.camA0 != null ? state.camA0 : THETA_START + 0.28;
  const a1 = state.camA1 != null ? state.camA1 : THETA_START + THETA_LEN - 0.28;
  const a = angleOf(p, a0, a1);
  const camR = R - CAM_DIST;
  // Sur mobile (format portrait) on vise un peu plus haut pour garder les cadres au centre
  const portrait = (typeof camera !== 'undefined' && camera && camera.aspect < 0.85);
  const lookY = portrait ? 2.05 : 2.05;
  const pos = posOn(a, camR, portrait ? 2.05 : CAM_Y);
  // Regard le long du mur : les cadres reculent vers la gauche, le plus proche à droite
  const lookAhead = portrait ? -0.16 : -0.32;
  const look = posOn(a + lookAhead, R - 1.2, lookY);
  return {pos, look, angle:a, lookAhead};
}

function framePose(angle, w, h){
  const p = posOn(angle, R - 0.14, FRAME_Y);
  const q = inwardQuat(angle, FRAME_Y);
  return {pos:p, quat:q, w, h};
}

function projectRect(camera, object, renderer){
  const box = new THREE.Box3().setFromObject(object);
  const corners = [
    new THREE.Vector3(box.min.x,box.min.y,box.min.z),
    new THREE.Vector3(box.min.x,box.min.y,box.max.z),
    new THREE.Vector3(box.min.x,box.max.y,box.min.z),
    new THREE.Vector3(box.min.x,box.max.y,box.max.z),
    new THREE.Vector3(box.max.x,box.min.y,box.min.z),
    new THREE.Vector3(box.max.x,box.min.y,box.max.z),
    new THREE.Vector3(box.max.x,box.max.y,box.min.z),
    new THREE.Vector3(box.max.x,box.max.y,box.max.z)
  ];
  const r = renderer.domElement.getBoundingClientRect();
  let minX=Infinity,minY=Infinity,maxX=-Infinity,maxY=-Infinity;
  const v = new THREE.Vector3();
  for(const c of corners){
    v.copy(c).project(camera);
    const x = (v.x*.5+.5)*r.width + r.left;
    const y = (-v.y*.5+.5)*r.height + r.top;
    minX=Math.min(minX,x); maxX=Math.max(maxX,x);
    minY=Math.min(minY,y); maxY=Math.max(maxY,y);
  }
  return {x:minX,y:minY,w:maxX-minX,h:maxY-minY};
}

function buildFallback(products){
  const {fallback, canvas, loader, spacer, hint} = getEls();
  if(!fallback) return;
  state.mode = 'fallback';
  if(canvas) canvas.hidden = true;
  if(loader) loader.hidden = true;
  if(hint) hint.hidden = true;
  if(spacer) spacer.style.height = '0px';
  fallback.hidden = false;
  fallback.innerHTML = `
    <p class="hall-fb-kicker">Galerie Perfect Room</p>
    <h2 class="hall-fb-title">Créations lumineuses</h2>
    <div class="hall-fb-track" id="hallFbTrack">
      ${products.map(p=>{
        const meta = classify(p);
        return `<button type="button" class="hall-fb-card" data-hall-product="${p.id}">
          <img src="${p.thumb||p.photo}" alt="${(p.name||'').replace(/"/g,'')}">
          <span class="hall-fb-kind">${meta.kind}</span>
          <span class="hall-fb-name">${p.name||''}</span>
        </button>`;
      }).join('')}
      <a class="hall-fb-card hall-fb-cta" href="#ia-neon">
        <span class="hall-fb-cta-txt">Votre néon<br>sur mesure</span>
        <span class="hall-fb-kind">Atelier IA</span>
        <span class="hall-fb-name">Créer un néon</span>
      </a>
    </div>`;
  fallback.querySelectorAll('[data-hall-product]').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const id = btn.getAttribute('data-hall-product');
      const p = state.products.find(x=>x.id===id);
      if(p) document.dispatchEvent(new CustomEvent('hall:open-product',{detail:{product:p, rect:btn.getBoundingClientRect()}}));
    });
  });
}

let renderer, scene, camera, hallMat, shadowTex;
let clock = {t:0};

function disposeGroup(g){
  if(!g) return;
  g.traverse(obj=>{
    if(obj.geometry) obj.geometry.dispose();
    const mats = obj.material ? (Array.isArray(obj.material)?obj.material:[obj.material]) : [];
    mats.forEach(m=>{
      if(!m) return;
      for(const k of Object.keys(m)){ if(m[k] && m[k].isTexture) m[k].dispose(); }
      m.dispose();
    });
  });
  if(g.parent) g.parent.remove(g);
}

async function waitFonts(){
  try{ if(document.fonts&&document.fonts.ready) await document.fonts.ready; }catch(e){}
}

function loadTexture(url){
  return new Promise((resolve,reject)=>{
    const loader = new THREE.TextureLoader();
    loader.load(url, tex=>{
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = 8;
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      tex.magFilter = THREE.LinearFilter;
      resolve(tex);
    }, undefined, ()=>reject(new Error('tex '+url)));
  });
}

function makeFrameGroup(product, tex, angle, weak){
  const meta = classify(product);
  const imgW = tex.image?.width || 1;
  const imgH = tex.image?.height || 1;
  const aspect = imgW/imgH;
  let h = FRAME_H;
  let w = h * aspect;
  // Les photos paysage un peu moins hautes, les portraits un peu plus étroits
  if(aspect > 1.15){ w = 2.7; h = w/aspect; }
  else { w = Math.min(w, 2.05); h = w/aspect; }

  const g = new THREE.Group();
  g.userData = {product, meta, angle, isFrame:true, w, h};

  // Cadre blanc mince (boîte)
  const border = 0.055;
  const depth = 0.045;
  const frame = new THREE.Mesh(
    new THREE.BoxGeometry(w+border*2, h+border*2, depth),
    new THREE.MeshStandardMaterial({color:0xfbfbfb, roughness:.35, metalness:.04})
  );
  frame.position.z = -depth/2;
  frame.castShadow = false;
  g.add(frame);

  // Photo (non retouchée)
  const art = new THREE.Mesh(
    new THREE.PlaneGeometry(w, h),
    new THREE.MeshBasicMaterial({map:tex, side:THREE.DoubleSide})
  );
  art.position.z = 0.002;
  art.userData.hit = true;
  g.add(art);
  g.userData.art = art;

  // Halo lumineux derrière, sur le mur
  let glow = null, bulb = null;
  if(!weak){
    glow = new THREE.Mesh(
      new THREE.PlaneGeometry(w*2.6, h*2.4),
      new THREE.MeshBasicMaterial({
        map: makeGlowTex(meta.glow),
        transparent:true,
        depthWrite:false,
        blending: THREE.AdditiveBlending,
        opacity: .85
      })
    );
    glow.position.z = -0.1;
    g.add(glow);
    bulb = new THREE.PointLight(hexColor(meta.glow), 1.35, 6.5, 2);
    bulb.position.set(0, 0, 0.55);
    g.add(bulb);
  }

  // Ombre portée douce sous le cadre, sur le mur
  const sh = new THREE.Mesh(
    new THREE.PlaneGeometry(w*1.35, h*.65),
    new THREE.MeshBasicMaterial({map:shadowTex, transparent:true, depthWrite:false, opacity:.55})
  );
  sh.position.set(0, -(h/2) - .18, -0.06);
  g.add(sh);

  // Étiquette sous le cadre
  const labTex = makeLabelTex(meta.kind, product.name);
  const lab = new THREE.Mesh(
    new THREE.PlaneGeometry(Math.max(w, 1.5)*1.05, .38),
    new THREE.MeshBasicMaterial({map:labTex, transparent:true, depthWrite:false})
  );
  lab.position.set(0, -(h/2) - .42, 0.01);
  g.add(lab);

  const pose = framePose(angle, w, h);
  g.position.copy(pose.pos);
  g.quaternion.copy(pose.quat);
  g.userData.restPos = pose.pos.clone();
  g.userData.restQuat = pose.quat.clone();
  g.userData.glow = glow;
  g.userData.bulb = bulb;
  g.userData.hover = 0;
  g.userData.press = 0;
  g.userData.intro = REDUCE ? 1 : 0;
  g.userData.tiltX = 0;
  g.userData.tiltY = 0;
  return g;
}

function makeTitleGroup(meta, angle){
  const g = new THREE.Group();
  const tex = makeFloorTitleTex(meta.kicker, meta.title, meta.enter);
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(6.4, 2.2),
    new THREE.MeshBasicMaterial({map:tex, transparent:true, depthWrite:false, depthTest:true, side:THREE.DoubleSide})
  );
  mesh.rotation.x = -Math.PI/2;
  // Posé sur le sol, entre la caméra et le mur, assez loin pour un vrai effet de perspective
  const p = posOn(angle, R - 5.0, 0.04);
  g.position.copy(p);
  // Après rotation X -90°, le « haut » du texte pointe vers -Z local.
  // On oriente le groupe pour que le bas du texte soit vers le mur (plus loin de la caméra).
  g.rotation.y = -angle - Math.PI/2;
  g.add(mesh);
  g.userData = {angle, collection: meta.collection};
  return g;
}

function makeCtaGroup(angle, weak){
  const g = new THREE.Group();
  g.userData = {isCta:true, angle, isFrame:true, w:1.8, h:2.2};

  const c = document.createElement('canvas');
  c.width = 1024; c.height = 1280;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#111';
  ctx.fillRect(0,0,1024,1280);
  // léger halo
  const grd = ctx.createRadialGradient(512,560,40,512,560,600);
  grd.addColorStop(0, '#ffe18a');
  grd.addColorStop(.4, '#ffb45c');
  grd.addColorStop(1, '#111');
  ctx.fillStyle = grd;
  ctx.fillRect(0,0,1024,1280);
  ctx.fillStyle = '#111c';
  ctx.fillRect(0,0,1024,1280);
  ctx.fillStyle = '#fff8e8';
  ctx.textAlign = 'center';
  ctx.font = '300 92px Inter, sans-serif';
  ctx.letterSpacing = '8px';
  ctx.fillText('VOTRE NÉON', 512, 520);
  ctx.fillText('SUR MESURE', 512, 640);
  ctx.font = '500 40px Inter, sans-serif';
  ctx.letterSpacing = '10px';
  ctx.fillText('ATELIER IA  ·  CRÉER', 512, 820);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;

  const border = 0.055;
  const frame = new THREE.Mesh(
    new THREE.BoxGeometry(1.8+border*2, 2.2+border*2, 0.045),
    new THREE.MeshStandardMaterial({color:0xfbfbfb, roughness:.35, metalness:.04})
  );
  frame.position.z = -0.022;
  g.add(frame);
  const art = new THREE.Mesh(
    new THREE.PlaneGeometry(1.8, 2.2),
    new THREE.MeshBasicMaterial({map:tex, side:THREE.DoubleSide})
  );
  art.position.z = 0.002;
  art.userData.hit = true;
  g.add(art);
  g.userData.art = art;
  let glow = null, bulb = null;
  if(!weak){
    glow = new THREE.Mesh(
      new THREE.PlaneGeometry(4.2, 4.4),
      new THREE.MeshBasicMaterial({map:makeGlowTex('#ffb45c'), transparent:true, depthWrite:false, blending:THREE.AdditiveBlending, opacity:.9})
    );
    glow.position.z = -0.1;
    g.add(glow);
    bulb = new THREE.PointLight(0xffb45c, 1.6, 7, 2);
    bulb.position.set(0,0,.6);
    g.add(bulb);
  }
  const labTex = makeLabelTex('Atelier IA', 'Créer un néon');
  const lab = new THREE.Mesh(
    new THREE.PlaneGeometry(1.9, .38),
    new THREE.MeshBasicMaterial({map:labTex, transparent:true, depthWrite:false})
  );
  lab.position.set(0, -1.52, 0.01);
  g.add(lab);

  const pose = framePose(angle, 1.8, 2.2);
  g.position.copy(pose.pos);
  g.quaternion.copy(pose.quat);
  g.userData.restPos = pose.pos.clone();
  g.userData.restQuat = pose.quat.clone();
  g.userData.glow = glow;
  g.userData.bulb = bulb;
  g.userData.hover = 0;
  g.userData.press = 0;
  g.userData.intro = REDUCE ? 1 : 0;
  g.userData.tiltX = 0;
  g.userData.tiltY = 0;
  return g;
}

function placeCamera(p, override){
  if(!camera) return;
  const pose = override || camPose(p);
  camera.position.copy(pose.pos);
  camera.lookAt(pose.look);
  camera.userData.angle = pose.angle;
}

function flyTo(from, to, duration, onDone){
  state.flying = true;
  const t0 = performance.now();
  const fromPos = from.pos.clone();
  const fromLook = from.look.clone();
  const toPos = to.pos.clone();
  const toLook = to.look.clone();
  const fromFov = camera.fov;
  const toFov = to.fov != null ? to.fov : fromFov;
  function step(now){
    const t = clamp((now-t0)/duration, 0, 1);
    const k = REDUCE ? 1 : power3InOut(t);
    camera.position.lerpVectors(fromPos, toPos, k);
    const look = new THREE.Vector3().lerpVectors(fromLook, toLook, k);
    camera.lookAt(look);
    camera.fov = lerp(fromFov, toFov, k);
    camera.updateProjectionMatrix();
    if(t<1) requestAnimationFrame(step);
    else { state.flying = false; onDone && onDone(); }
  }
  requestAnimationFrame(step);
}

function closeupPose(frame){
  // Caméra face au cadre, assez près pour qu'il occupe la moitié gauche
  const angle = frame.userData.angle;
  const dist = 3.15;
  const pos = posOn(angle, R - dist, FRAME_Y);
  // Décaler un peu vers la droite de l'écran (= le long de la tangente) pour laisser le cadre à gauche
  const tangent = new THREE.Vector3(-Math.sin(angle), 0, Math.cos(angle)).multiplyScalar(0.85);
  pos.add(tangent);
  const look = frame.position.clone();
  return {pos, look, angle, fov: 38};
}

async function rebuildFrames(products){
  if(!scene) return;
  state.frames.forEach(f=>disposeGroup(f));
  state.titles.forEach(t=>disposeGroup(t));
  state.frames = [];
  state.titles = [];

  // Grouper : lampes puis tableaux (parcours muséal), sans inventer de produits
  const decorated = products.map(p=>({p, meta:classify(p)}));
  const groups = {lampes:[], neons:[], tableaux:[], autres:[]};
  decorated.forEach(d=>{
    if(d.meta.collection==='lampes') groups.lampes.push(d);
    else if(d.meta.collection==='neons') groups.neons.push(d);
    else if(d.meta.collection==='tableaux') groups.tableaux.push(d);
    else groups.autres.push(d);
  });
  const ordered = [...groups.lampes, ...groups.neons, ...groups.tableaux, ...groups.autres];
  const collections = [];
  const pushCol = (key, items)=>{
    if(!items.length) return;
    collections.push({key, items, meta:items[0].meta});
  };
  pushCol('lampes', groups.lampes);
  pushCol('neons', groups.neons);
  pushCol('tableaux', groups.tableaux);
  pushCol('autres', groups.autres);

  // Angles le long du mur
  const nFrames = ordered.length + 1; // + CTA
  // Espacement serré pour voir plusieurs cadres à la fois, comme dans la vidéo
  const gap = 0.125;
  const colGap = 0.10;
  const span = gap * (nFrames - 1) + colGap * Math.max(0, collections.length - 1);
  const mid = THETA_START + THETA_LEN * 0.42;
  const a0 = mid - span / 2;
  let a = a0;

  await waitFonts();

  for(const col of collections){
    const mid = a + gap * (col.items.length-1) / 2;
    const title = makeTitleGroup(col.meta, mid);
    scene.add(title);
    state.titles.push(title);
    for(const d of col.items){
      try{
        const tex = await loadTexture(d.p.thumb || d.p.photo);
        const fr = makeFrameGroup(d.p, tex, a, state.weak);
        scene.add(fr);
        state.frames.push(fr);
      }catch(e){
        console.warn('Galerie 3D : image non chargée', d.p.name);
      }
      a += gap;
    }
    a += colGap; // respiration entre collections
  }
  const cta = makeCtaGroup(a, state.weak);
  scene.add(cta);
  state.frames.push(cta);

  // La caméra commence juste avant le premier cadre et s'arrête juste après le dernier
  const productFrames = state.frames.filter(f => !f.userData.isCta);
  const firstA = (productFrames[0] && productFrames[0].userData.angle) || a0;
  const lastA = a;
  // On démarre déjà au cœur de la première collection (plusieurs cadres visibles)
  state.camA0 = firstA + 0.34;
  state.camA1 = lastA + 0.20;
  if(!state.flying && !state.productOpen) placeCamera(state.currentP||0);

  state.introT0 = performance.now();
  state.frames.forEach((f,i)=>{
    f.userData.introDelay = REDUCE ? 0 : 90 + i*120;
    f.userData.intro = REDUCE ? 1 : 0;
  });

  // Hauteur de défilement : assez pour une marche lente et ample
  const {spacer} = getEls();
  if(spacer) spacer.style.height = Math.max(200, 80 + nFrames*58) + 'vh';
}

function currentCollection(p){
  if(!state.titles.length) return;
  const pose = camPose(p);
  let best=state.titles[0], bd=Infinity;
  for(const t of state.titles){
    const d = Math.abs(Math.atan2(
      Math.sin(t.userData.angle - pose.angle),
      Math.cos(t.userData.angle - pose.angle)
    ));
    if(d<bd){bd=d;best=t;}
  }
  return best;
}

function easeOutCubic(t){ return 1 - Math.pow(1-t, 3); }

function animateFrames(now){
  if(!state.frames.length) return;
  const easeH = state.weak ? 0.22 : 0.14;
  for(let i=0;i<state.frames.length;i++){
    const f = state.frames[i];
    const ud = f.userData;
    if(!ud.restPos) continue;
    if(ud.intro < 1){
      const t = clamp((now - (state.introT0||0) - (ud.introDelay||0)) / 900, 0, 1);
      ud.intro = REDUCE ? 1 : easeOutCubic(t);
    }
    const wantH = (!REDUCE && state.hoverFrame===f && !state.flying && !state.productOpen) ? 1 : 0;
    const wantP = (!REDUCE && state.pressFrame===f && !state.flying && !state.productOpen) ? 1 : 0;
    ud.hover += (wantH - ud.hover) * easeH;
    ud.press += (wantP - ud.press) * 0.28;
    const intro = ud.intro;
    const hov = ud.hover;
    const prs = ud.press;
    const s = (0.9 + 0.1*intro) * (1 + 0.045*hov - 0.035*prs);
    f.scale.setScalar(s);
    _lift.set(0, (1-intro)*-0.32, (1-intro)*-0.22 + hov*0.11 - prs*0.04);
    _lift.applyQuaternion(ud.restQuat);
    f.position.copy(ud.restPos).add(_lift);
    _tiltE.set((ud.tiltX||0)*hov*0.1, (ud.tiltY||0)*hov*0.12, 0);
    _tiltQ.setFromEuler(_tiltE);
    f.quaternion.copy(ud.restQuat).multiply(_tiltQ);
    if(ud.glow && ud.glow.material){
      const pulse = 0.08 * Math.sin(now*0.0017 + i*0.9);
      ud.glow.material.opacity = Math.max(0, (0.72 + pulse + 0.28*hov) * intro);
    }
    if(ud.bulb){
      ud.bulb.intensity = (ud.bulb.userData.base || (ud.bulb.userData.base = ud.bulb.intensity)) * (0.85 + 0.15*intro + 0.35*hov);
    }
  }
}

function renderLoop(){
  state.raf = requestAnimationFrame(renderLoop);
  if(!renderer || !scene || !camera) return;
  if(!state.flying && !state.productOpen && state.mode==='3d'){
    const tgt = state.targetP;
    // Inertie élevée (marche muséale) — inchangée par rapport à v9
    const ease = state.weak ? 0.12 : 0.055;
    state.currentP += (tgt - state.currentP) * ease;
    if(Math.abs(tgt - state.currentP) < 0.00015) state.currentP = tgt;
    placeCamera(state.currentP);
  }
  animateFrames(performance.now());
  renderer.render(scene, camera);
}

function onResize(){
  if(!renderer||!camera) return;
  const {pin, canvas} = getEls();
  const w = (pin||canvas||document.body).clientWidth || innerWidth;
  const h = (pin||canvas||document.body).clientHeight || innerHeight;
  camera.aspect = w/Math.max(1,h);
  camera.updateProjectionMatrix();
  const pr = state.weak ? Math.min(1.15, devicePixelRatio||1) : Math.min(1.6, devicePixelRatio||1);
  renderer.setPixelRatio(pr);
  renderer.setSize(w, h, false);
}

function pickFrame(ev){
  if(!camera||!renderer||state.flying||state.productOpen) return null;
  const rec = renderer.domElement.getBoundingClientRect();
  const ndc = new THREE.Vector2(
    ((ev.clientX-rec.left)/rec.width)*2-1,
    -((ev.clientY-rec.top)/rec.height)*2+1
  );
  const ray = new THREE.Raycaster();
  ray.setFromCamera(ndc, camera);
  const hits = ray.intersectObjects(state.frames, true);
  for(const h of hits){
    let o = h.object;
    while(o && !o.userData.isFrame) o = o.parent;
    if(o && o.userData.isFrame) return o;
  }
  return null;
}

function openFrame(frame){
  if(!frame || state.flying) return;
  if(frame.userData.isCta){
    const ia = document.getElementById('ia-neon');
    if(ia) ia.scrollIntoView({behavior: REDUCE?'auto':'smooth'});
    return;
  }
  const product = frame.userData.product;
  if(!product) return;
  state.savedP = state.currentP;
  state.openId = product.id;
  const from = {pos: camera.position.clone(), look: camPose(state.currentP).look, fov: camera.fov};
  // look from current camera
  const dir = new THREE.Vector3();
  camera.getWorldDirection(dir);
  from.look = camera.position.clone().add(dir);
  const to = closeupPose(frame);
  document.body.classList.add('hall-flying');
  flyTo(from, to, 1500, ()=>{
    const rect = projectRect(camera, frame.userData.art || frame, renderer);
    document.dispatchEvent(new CustomEvent('hall:open-product',{detail:{product, rect, frame}}));
    state.productOpen = true;
    document.body.classList.remove('hall-flying');
  });
}

function closeProductFromHall(){
  if(!state.productOpen && !state.flying) return;
  state.productOpen = false;
  state.openId = null;
  document.body.classList.remove('pp-open');
  const {canvas} = getEls();
  if(canvas) canvas.style.opacity = '1';
  const from = {pos: camera.position.clone(), look: camera.position.clone().add(new THREE.Vector3(0,0,-1)), fov: camera.fov};
  const dir = new THREE.Vector3(); camera.getWorldDirection(dir);
  from.look = camera.position.clone().add(dir);
  const to = camPose(state.savedP);
  to.fov = 46;
  placeCamera(state.savedP); // will be overwritten by fly
  camera.position.copy(from.pos);
  camera.lookAt(from.look);
  flyTo(from, to, 1100, ()=>{
    camera.fov = 46;
    camera.updateProjectionMatrix();
    state.currentP = state.savedP;
    state.targetP = state.savedP;
    scrollToProgress(state.savedP, 'instant');
    setHallActive(progressFromScroll()<1 && scrollY < scrollBounds().end);
  });
}

function bindInput(){
  const {canvas, pin} = getEls();
  if(!canvas) return;
  let dragging=false, sx=0, sy=0, sp=0, moved=false, pointerId=null;

  function updateHover(e){
    const f = pickFrame(e);
    state.hoverFrame = f;
    canvas.style.cursor = f ? 'pointer' : 'grab';
    canvas.classList.toggle('over-frame', !!f);
    if(f && f.userData.restPos && camera){
      const rec = renderer.domElement.getBoundingClientRect();
      const ndc = new THREE.Vector3(
        ((e.clientX-rec.left)/rec.width)*2-1,
        -((e.clientY-rec.top)/rec.height)*2+1,
        0.5
      ).unproject(camera);
      const local = ndc.sub(f.userData.restPos);
      f.userData.tiltY = clamp(local.x * 0.35, -1, 1);
      f.userData.tiltX = clamp(-local.y * 0.35, -1, 1);
    }
  }
  canvas.addEventListener('pointerdown', e=>{
    if(state.productOpen||state.flying) return;
    dragging = true; moved=false; sx=e.clientX; sy=e.clientY; sp=state.targetP; pointerId=e.pointerId;
    state.pressFrame = pickFrame(e);
    try{ canvas.setPointerCapture(e.pointerId); }catch(_){}
  });
  canvas.addEventListener('pointermove', e=>{
    if(!dragging) {
      updateHover(e);
      return;
    }
    const dx = e.clientX-sx, dy = e.clientY-sy;
    if(Math.abs(dx)+Math.abs(dy)>14) moved = true;
    // Glisser horizontal (et vertical) fait avancer la caméra
    const delta = (dx - dy) / Math.max(innerWidth, 1) * -0.55;
    state.targetP = clamp(sp + delta, 0, 1);
    scrollToProgress(state.targetP, 'instant');
  });
  const end = e=>{
    if(!dragging) return;
    dragging=false;
    const pressed = state.pressFrame;
    state.pressFrame = null;
    try{ canvas.releasePointerCapture(pointerId); }catch(_){}
    if(!moved){
      const f = pickFrame(e) || pressed;
      if(f) openFrame(f);
    }
    updateHover(e);
  };
  canvas.addEventListener('pointerleave', ()=>{
    if(dragging) return;
    state.hoverFrame = null;
    canvas.style.cursor = 'grab';
    canvas.classList.remove('over-frame');
  });
  canvas.addEventListener('pointerup', end);
  canvas.addEventListener('pointercancel', end);

  addEventListener('scroll', ()=>{
    if(state.productOpen||state.flying) return;
    state.targetP = progressFromScroll();
    const {start,end} = scrollBounds();
    const on = scrollY < end - 8 && scrollY + innerHeight > start + 8;
    setHallActive(on && !state.productOpen);
  }, {passive:true});

  addEventListener('keydown', e=>{
    if(state.productOpen||state.mode!=='3d') return;
    const {section} = getEls();
    if(!section) return;
    const r = section.getBoundingClientRect();
    if(r.bottom<=0 || r.top>=innerHeight) return;
    if(e.key==='ArrowRight' || e.key==='ArrowDown'){
      e.preventDefault();
      state.targetP = clamp(state.targetP + 0.08, 0, 1);
      scrollToProgress(state.targetP);
    }else if(e.key==='ArrowLeft' || e.key==='ArrowUp'){
      e.preventDefault();
      state.targetP = clamp(state.targetP - 0.08, 0, 1);
      scrollToProgress(state.targetP);
    }
  });

  addEventListener('resize', onResize);
}

async function init3D(){
  const {canvas, loader, fallback, hint} = getEls();
  const info = webglInfo();
  if(!info.ok || REDUCE){
    buildFallback(state.products);
    if(loader) loader.hidden = true;
    setHallActive(false);
    document.body.classList.add('hall-fallback');
    return;
  }
  state.weak = info.weak;
  scene = new THREE.Scene();
  scene.background = new THREE.Color('#f4f3f1');
  // Léger brouillard pour adoucir le lointain, très clair
  scene.fog = new THREE.Fog('#f4f3f1', 16, 40);

  camera = new THREE.PerspectiveCamera(46, 16/9, 0.1, 80);
  renderer = new THREE.WebGLRenderer({
    canvas, antialias: !state.weak, alpha:false, powerPreference:'high-performance'
  });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.setClearColor('#f4f3f1', 1);

  // Éclairage muséal doux et un peu plus chaleureux, toujours très clair
  scene.add(new THREE.AmbientLight(0xfffaf6, 0.78));
  scene.add(new THREE.HemisphereLight(0xfffdf8, 0xe4e0da, 1.12));
  const key = new THREE.DirectionalLight(0xfffaf4, 0.38);
  key.position.set(-4, 12, 6);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xfff4ea, 0.34);
  fill.position.set(8, 5, -2);
  scene.add(fill);

  const hallGeo = makeHallGeometry();
  hallVertexColors(hallGeo);
  // MeshBasic : éclairage constant, mur blanc et sol gris clair comme dans la vidéo
  hallMat = new THREE.MeshBasicMaterial({
    vertexColors: true,
    side: THREE.DoubleSide
  });
  const hall = new THREE.Mesh(hallGeo, hallMat);
  hall.receiveShadow = false;
  scene.add(hall);
  addPaintedBrickSkin(scene);

  // Caps aux extrémités (murs blancs discrets) pour éviter de voir le vide
  const capMat = new THREE.MeshStandardMaterial({color:0xf5f5f5, roughness:.95, metalness:0});
  const capGeo = new THREE.PlaneGeometry(R*1.05, COVE+WALL_H+1);
  // pas indispensable si les angles restent hors champ

  shadowTex = makeShadowTex();

  placeCamera(0);
  onResize();
  bindInput();
  await rebuildFrames(state.products);
  if(loader){
    loader.classList.add('out');
    setTimeout(()=>{loader.hidden=true;}, 500);
  }
  if(hint) hint.hidden = false;
  if(fallback) fallback.hidden = true;
  state.mode = '3d';
  state.ready = true;
  state.targetP = progressFromScroll();
  state.currentP = state.targetP;
  setHallActive(true);
  if(!state.raf) renderLoop();
}

function productsKey(list){
  return (list||[]).map(p=>[p.id,p.name,p.photo,p.thumb,p.price,p.description].join('|')).join('~');
}
function setProducts(products){
  const list = (products||[]).filter(p=>p && p.visible!==false && (p.photo||p.thumb)).map(p=>({
    id: p.id,
    name: p.name,
    description: p.description||'',
    photo: p.photo,
    thumb: p.thumb||p.photo,
    price: p.price||'',
    example: !!p.example
  }));
  if(productsKey(list)===productsKey(state.products) && (state.ready||state.mode==='fallback')) return;
  state.products = list;
  if(state.mode==='fallback'){
    buildFallback(list);
    return;
  }
  if(state.ready && scene){
    rebuildFrames(list);
  }
}

function openProductId(id){
  const f = state.frames.find(fr => fr.userData.product && fr.userData.product.id===id);
  if(f) openFrame(f);
  else {
    const p = state.products.find(x=>x.id===id);
    if(p) document.dispatchEvent(new CustomEvent('hall:open-product',{detail:{product:p, rect:null}}));
  }
}

window.PerfectHall = {
  setProducts,
  open: openProductId,
  closeProduct: closeProductFromHall,
  getProgress: ()=>state.currentP,
  isReady: ()=>state.ready,
  mode: ()=>state.mode,
  debug: ()=>({
    n: state.frames.length,
    names: state.frames.map(f=>f.userData.product?.name || (f.userData.isCta?'CTA':'?')),
    angles: state.frames.map(f=>+f.userData.angle.toFixed(3)),
    camA0: state.camA0, camA1: state.camA1,
    p: state.currentP, target: state.targetP
  }),
  canvasOpacity(v){ const {canvas}=getEls(); if(canvas) canvas.style.opacity = String(v); }
};

async function boot(){
  const {section} = getEls();
  if(!section) return;
  const t0 = performance.now();
  while(performance.now()-t0 < 2500){
    if(window.PR_PRODUCTS && window.PR_PRODUCTS.length){
      setProducts(window.PR_PRODUCTS);
      break;
    }
    await new Promise(r=>setTimeout(r, 40));
  }
  if(!state.products.length && window.PR_PRODUCTS) setProducts(window.PR_PRODUCTS);
  try{
    await init3D();
  }catch(err){
    console.warn('Galerie 3D indisponible, bascule vers la galerie simple.', err);
    buildFallback(state.products);
    const {loader} = getEls();
    if(loader) loader.hidden = true;
  }
}

if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', boot);
else boot();
