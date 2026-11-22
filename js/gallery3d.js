/* Galerie musée — couloir en première personne, murs de brique, cadres éclairés.
   Photos des créations affichées telles quelles (non retouchées). */
import * as THREE from 'three';

const REDUCE = matchMedia('(prefers-reduced-motion: reduce)').matches;
const IS_TOUCH = matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;

const WALL_X = 1.92;
const CEIL_Y = 3.28;
const EYE_Y = 1.62;
const FRAME_Y = 1.70;
const FRAME_MAX_H = 1.48;
const SPACING = 3.55;
const START_Z = 4.05;
const CAM_Z0 = -1.15;

const power3InOut = t => t < .5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3)/2;
const clamp = (v,a,b) => Math.max(a, Math.min(b, v));
const lerp = (a,b,t) => a + (b-a)*t;

function classify(p){
  const n = ((p.name||'')+' '+(p.description||'')).toLowerCase();
  if(/tableau|r[eé]tro[eé]?clair|pop art/.test(n))
    return {kind:'Tableau rétroéclairé', collection:'tableaux', title:'TABLEAUX LUMINEUX', kicker:'Créations murales', glow:'#ff7ad9'};
  if(/voiture|course/.test(n))
    return {kind:'Lampe LED gravée', collection:'lampes', title:'LAMPES GRAVÉES', kicker:'Créations Perfect Room', glow:'#ff4d5e'};
  if(/dipl[oô]me/.test(n))
    return {kind:'Lampe LED gravée', collection:'lampes', title:'LAMPES GRAVÉES', kicker:'Créations Perfect Room', glow:'#dfe8ff'};
  return {kind:'Lampe LED gravée', collection:'lampes', title:'LAMPES GRAVÉES', kicker:'Créations Perfect Room', glow:'#ffb45c'};
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

function makeRadialTex(inner, mid, outer){
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(128,128,4,128,128,128);
  grd.addColorStop(0, inner);
  grd.addColorStop(.4, mid);
  grd.addColorStop(1, outer);
  g.fillStyle = grd;
  g.fillRect(0,0,256,256);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function makePlacardTex(kind, name){
  const c = document.createElement('canvas');
  c.width = 768; c.height = 384;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#f3ead8';
  ctx.fillRect(0,0,768,384);
  ctx.strokeStyle = '#c4b392';
  ctx.lineWidth = 10;
  ctx.strokeRect(14,14,740,356);
  ctx.fillStyle = '#6a5a40';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.font = '500 36px Inter, Outfit, system-ui, sans-serif';
  ctx.fillText(String(kind||'').toUpperCase(), 48, 56);
  ctx.fillStyle = '#2a2116';
  ctx.font = '500 52px Inter, Outfit, system-ui, sans-serif';
  const title = String(name||'');
  // wrap if needed
  if(title.length > 28) ctx.font = '500 40px Inter, Outfit, system-ui, sans-serif';
  ctx.fillText(title, 48, 130);
  ctx.fillStyle = '#8a7a60';
  ctx.font = '400 28px Inter, Outfit, system-ui, sans-serif';
  ctx.fillText('Perfect Room  ·  Tlemcen  ·  Prix sur demande', 48, 280);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  t.needsUpdate = true;
  return t;
}

function makeFloorTitleTex(kicker, title){
  const c = document.createElement('canvas');
  c.width = 2048; c.height = 700;
  const ctx = c.getContext('2d');
  ctx.clearRect(0,0,2048,700);
  ctx.fillStyle = '#f0e6d2';
  ctx.globalAlpha = 0.88;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '500 52px Inter, Outfit, system-ui, sans-serif';
  ctx.fillText(String(kicker||'').toUpperCase(), 1024, 160);
  ctx.font = '300 150px Inter, Outfit, system-ui, sans-serif';
  const t = String(title||'').toUpperCase();
  if(t.length > 22) ctx.font = '300 118px Inter, Outfit, system-ui, sans-serif';
  ctx.fillText(t, 1024, 380);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

function makeCtaTex(){
  const c = document.createElement('canvas');
  c.width = 1024; c.height = 1280;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#0a0610';
  ctx.fillRect(0,0,1024,1280);
  const glow = ctx.createRadialGradient(512,620,30,512,620,560);
  glow.addColorStop(0, 'rgba(255,170,70,.55)');
  glow.addColorStop(.35, 'rgba(255,110,60,.18)');
  glow.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0,0,1024,1280);
  ctx.strokeStyle = 'rgba(255,200,110,.55)';
  ctx.lineWidth = 6;
  ctx.strokeRect(48,48,928,1184);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#ffc878';
  ctx.font = '600 34px Inter, Outfit, system-ui, sans-serif';
  ctx.shadowColor = 'rgba(255,180,70,1)';
  ctx.shadowBlur = 22;
  ctx.fillText('ATELIER NÉON  ·  TLEMCEN', 512, 360);
  ctx.font = '300 96px Inter, Outfit, system-ui, sans-serif';
  ctx.fillStyle = '#ffe9b8';
  ctx.shadowColor = 'rgba(255,190,80,1)';
  ctx.shadowBlur = 36;
  ctx.fillText('VOTRE NÉON', 512, 560);
  ctx.fillText('SUR MESURE', 512, 690);
  ctx.shadowBlur = 0;
  ctx.font = '400 32px Inter, Outfit, system-ui, sans-serif';
  ctx.fillStyle = '#e8d2a8';
  ctx.fillText('Touchez pour imaginer le vôtre', 512, 920);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.needsUpdate = true;
  return t;
}

function avgGlow(image, fallback){
  try{
    const c = document.createElement('canvas');
    c.width = c.height = 16;
    const g = c.getContext('2d');
    g.drawImage(image, 0, 0, 16, 16);
    const d = g.getImageData(0,0,16,16).data;
    let r=0,gv=0,b=0,n=0;
    for(let i=0;i<d.length;i+=4){
      const l = d[i]*0.25 + d[i+1]*0.45 + d[i+2]*0.3;
      const w = 0.35 + l/255;
      r+=d[i]*w; gv+=d[i+1]*w; b+=d[i+2]*w; n+=w;
    }
    return new THREE.Color(r/(n*255), gv/(n*255), b/(n*255));
  }catch(e){
    return new THREE.Color(fallback || '#ffb45c');
  }
}

function loadTexture(url, {srgb=false, repeat=null, wrap=true, aniso=8}={}){
  return new Promise((resolve, reject) => {
    const loader = new THREE.TextureLoader();
    loader.load(url, tex => {
      if(srgb) tex.colorSpace = THREE.SRGBColorSpace;
      if(wrap){
        tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
      }
      if(repeat) tex.repeat.set(repeat[0], repeat[1]);
      tex.anisotropy = aniso;
      tex.needsUpdate = true;
      resolve(tex);
    }, undefined, reject);
  });
}

function getEls(){
  return {
    section: document.getElementById('hall'),
    pin: document.getElementById('hallPin'),
    canvas: document.getElementById('hallCanvas'),
    loader: document.getElementById('hallLoader'),
    hint: document.getElementById('hallHint'),
    spacer: document.getElementById('hallSpacer'),
    fallback: document.getElementById('hallFallback')
  };
}

const state = {
  ready: false,
  mode: 'none',
  products: [],
  productKey: '',
  frames: [],
  currentP: 0,
  targetP: 0,
  vel: 0,
  z0: CAM_Z0,
  z1: 16,
  flying: false,
  fly: null,
  savedP: 0,
  dragging: false,
  pointers: new Map(),
  lastY: 0,
  moved: 0,
  renderer: null,
  scene: null,
  camera: null,
  envMap: null,
  clock: new THREE.Clock(),
  raycaster: new THREE.Raycaster(),
  pointer: new THREE.Vector2(),
  dpr: 1,
  quality: 'high',
  weak: false,
  fps: 60,
  fpsFrames: 0,
  fpsT: 0,
  frameMats: [],
  movingLight: null,
  lookTarget: new THREE.Vector3(),
  tmp: new THREE.Vector3(),
  tmp2: new THREE.Vector3()
};

function productKey(list){
  return (list||[]).map(p => p.id+':'+(p.photo||p.thumb||'')).join('|');
}

function setSpacer(){
  const {spacer} = getEls();
  if(!spacer) return;
  const n = Math.max(4, state.frames.length);
  const vh = Math.max(220, 90 + n * 70);
  spacer.style.height = vh + 'vh';
}

function scrollProgress(){
  const {section, pin, spacer} = getEls();
  if(!section || !pin || !spacer) return state.currentP;
  const pinH = pin.offsetHeight || innerHeight;
  const total = Math.max(1, spacer.offsetHeight - 1);
  const scrolled = clamp(-section.getBoundingClientRect().top, 0, total);
  return clamp(scrolled / total, 0, 1);
}

function syncScrollTo(p){
  const {section, spacer} = getEls();
  if(!section || !spacer) return;
  const total = Math.max(1, spacer.offsetHeight - 1);
  const y = section.offsetTop + p * total;
  window.scrollTo(0, y);
}

function hideLoader(){
  const {loader} = getEls();
  if(!loader) return;
  loader.classList.add('out');
  setTimeout(()=>{ loader.hidden = true; }, 520);
}

function buildFallback(products){
  const {fallback, canvas, loader, hint, pin} = getEls();
  state.mode = 'fallback';
  state.ready = true;
  if(canvas) canvas.style.display = 'none';
  if(hint) hint.hidden = true;
  if(pin) pin.style.height = 'auto';
  if(loader) { loader.classList.add('out'); loader.hidden = true; }
  if(!fallback) return;
  fallback.hidden = false;
  const cards = (products||[]).map(p => {
    const meta = classify(p);
    return `<button type="button" class="hall-fb-card" data-id="${p.id}">
      <img src="${p.thumb||p.photo}" alt="${p.name||''}">
      <span class="hall-fb-kind">${meta.kind}</span>
      <span class="hall-fb-name">${p.name||''}</span>
    </button>`;
  }).join('');
  fallback.innerHTML = `
    <p class="hall-fb-kicker">Galerie Perfect Room</p>
    <h2 class="hall-fb-title">Le musée des créations</h2>
    <div class="hall-fb-track">
      ${cards}
      <a class="hall-fb-card hall-fb-cta" href="#ia-neon">
        <span class="hall-fb-kind">Atelier néon</span>
        <span class="hall-fb-cta-txt">Votre néon sur mesure</span>
      </a>
    </div>`;
  fallback.querySelectorAll('[data-id]').forEach(btn => {
    btn.addEventListener('click', () => {
      const p = state.products.find(x => x.id === btn.getAttribute('data-id'));
      if(p) document.dispatchEvent(new CustomEvent('hall:open-product', {detail:{product:p, rect:null}}));
    });
  });
}

function makeEnv(renderer){
  const scn = new THREE.Scene();
  scn.background = new THREE.Color(0x2a1c14);
  scn.add(new THREE.AmbientLight(0xffd2a0, 0.55));
  scn.add(new THREE.HemisphereLight(0xffe6c8, 0x3a2214, 1.1));
  const bulb = (color, x, y, z, i) => {
    const l = new THREE.PointLight(color, i, 12, 2);
    l.position.set(x,y,z);
    scn.add(l);
  };
  bulb(0xfff0c8, 0, 3, 2, 4);
  bulb(0xffb070, -3, 2, -1, 2);
  bulb(0xffe0a0, 3, 2.5, 3, 2);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const rt = pmrem.fromScene(scn, 0.02);
  pmrem.dispose();
  return rt.texture;
}

async function loadMaterials(aniso){
  const wallRepeat = [8.5, 3.4]; // tuned after wall size
  const [brickC, brickN, brickR, woodC, woodN, woodR, ceilC, ceilN, ceilR] = await Promise.all([
    loadTexture('img/tex/brick-color.webp', {srgb:true, aniso}),
    loadTexture('img/tex/brick-normal.webp', {srgb:false, aniso}),
    loadTexture('img/tex/brick-rough.webp', {srgb:false, aniso}),
    loadTexture('img/tex/wood-color.webp', {srgb:true, aniso}),
    loadTexture('img/tex/wood-normal.webp', {srgb:false, aniso}),
    loadTexture('img/tex/wood-rough.webp', {srgb:false, aniso}),
    loadTexture('img/tex/ceil-color.webp', {srgb:true, aniso:4}),
    loadTexture('img/tex/ceil-normal.webp', {srgb:false, aniso:4}),
    loadTexture('img/tex/ceil-rough.webp', {srgb:false, aniso:4})
  ]);
  return {brickC, brickN, brickR, woodC, woodN, woodR, ceilC, ceilN, ceilR};
}

function applyRepeat(tex, u, v){
  tex.repeat.set(u, v);
  tex.needsUpdate = true;
}

function buildRoom(scene, mats, length, quality){
  const zMid = length * 0.5;
  const wallLen = length + 4;
  const wallH = CEIL_Y;

  applyRepeat(mats.brickC, wallLen/1.15, wallH/0.72);
  applyRepeat(mats.brickN, wallLen/1.15, wallH/0.72);
  applyRepeat(mats.brickR, wallLen/1.15, wallH/0.72);
  applyRepeat(mats.woodC, wallLen/2.0, (WALL_X*2)/2.0);
  applyRepeat(mats.woodN, wallLen/2.0, (WALL_X*2)/2.0);
  applyRepeat(mats.woodR, wallLen/2.0, (WALL_X*2)/2.0);
  applyRepeat(mats.ceilC, wallLen/2.4, (WALL_X*2)/2.4);
  applyRepeat(mats.ceilN, wallLen/2.4, (WALL_X*2)/2.4);
  applyRepeat(mats.ceilR, wallLen/2.4, (WALL_X*2)/2.4);

  const brickMat = new THREE.MeshStandardMaterial({
    map: mats.brickC,
    normalMap: mats.brickN,
    roughnessMap: mats.brickR,
    roughness: 0.92,
    metalness: 0.02,
    envMapIntensity: 0.25,
    color: 0xffffff
  });
  brickMat.normalScale.set(0.85, 0.85);

  const woodMat = new THREE.MeshStandardMaterial({
    map: mats.woodC,
    normalMap: mats.woodN,
    roughnessMap: mats.woodR,
    roughness: 0.28,
    metalness: 0.08,
    envMapIntensity: quality==='high' ? 0.85 : 0.45,
    color: 0xffffff
  });
  woodMat.normalScale.set(0.4, 0.4);

  const ceilMat = new THREE.MeshStandardMaterial({
    map: mats.ceilC,
    normalMap: mats.ceilN,
    roughnessMap: mats.ceilR,
    roughness: 0.86,
    metalness: 0.0,
    envMapIntensity: 0.15,
    color: 0xc8c2ba,
    emissive: 0x2a241c,
    emissiveIntensity: 0.35
  });

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(WALL_X*2-0.02, wallLen), woodMat);
  floor.rotation.x = -Math.PI/2;
  floor.position.set(0, 0, zMid);
  floor.receiveShadow = quality==='high';
  scene.add(floor);

  const left = new THREE.Mesh(new THREE.PlaneGeometry(wallLen, wallH), brickMat);
  left.rotation.y = Math.PI/2;
  left.position.set(-WALL_X, wallH/2, zMid);
  left.receiveShadow = quality==='high';
  scene.add(left);

  const right = new THREE.Mesh(new THREE.PlaneGeometry(wallLen, wallH), brickMat.clone());
  // clone shares maps, flip so bricks aren't mirrored oddly
  right.rotation.y = -Math.PI/2;
  right.position.set(WALL_X, wallH/2, zMid);
  right.receiveShadow = quality==='high';
  scene.add(right);

  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(WALL_X*2, wallLen), ceilMat);
  ceil.rotation.x = Math.PI/2;
  ceil.position.set(0, CEIL_Y, zMid);
  scene.add(ceil);

  // End wall
  const end = new THREE.Mesh(new THREE.PlaneGeometry(WALL_X*2, wallH), brickMat);
  end.position.set(0, wallH/2, length + 0.4);
  end.receiveShadow = quality==='high';
  scene.add(end);

  // Entrance wall with opening behind camera (dark)
  const start = new THREE.Mesh(new THREE.PlaneGeometry(WALL_X*2, wallH), new THREE.MeshStandardMaterial({
    color: 0x1a120e, roughness: 0.9, metalness: 0, envMapIntensity: 0.1
  }));
  start.rotation.y = Math.PI;
  start.position.set(0, wallH/2, -1.2);
  scene.add(start);

  // Baseboards
  const boardMat = new THREE.MeshStandardMaterial({color:0x3a2a1c, roughness:0.6, metalness:0.05});
  for(const x of [-WALL_X+0.02, WALL_X-0.02]){
    const b = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.12, wallLen), boardMat);
    b.position.set(x, 0.06, zMid);
    scene.add(b);
  }

  // Ceiling track rails
  const railMat = new THREE.MeshStandardMaterial({color:0x2a2a2a, roughness:0.4, metalness:0.7, envMapIntensity:0.5});
  for(const x of [-0.55, 0.55]){
    const rail = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.03, wallLen-1), railMat);
    rail.position.set(x, CEIL_Y-0.04, zMid);
    scene.add(rail);
  }

  return {floor, brickMat, woodMat};
}

function makeSpotCookie(){
  return makeRadialTex('rgba(255,230,180,.95)', 'rgba(255,200,130,.35)', 'rgba(255,180,80,0)');
}

function addSpotlightRig(scene, group, side, z, color, quality){
  const xRail = side > 0 ? 0.55 : -0.55;
  const fixtureMat = new THREE.MeshStandardMaterial({
    color: 0x1a1a1a, roughness: 0.35, metalness: 0.75, envMapIntensity: 0.5
  });
  const bulbMat = new THREE.MeshStandardMaterial({
    color: 0xffe8c0, emissive: new THREE.Color(color).lerp(new THREE.Color(0xfff0c8), 0.5), emissiveIntensity: 2.2,
    roughness: 0.4, metalness: 0
  });
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.14, 10), fixtureMat);
  body.position.set(xRail, CEIL_Y-0.16, z);
  body.rotation.z = side > 0 ? 0.55 : -0.55;
  body.rotation.x = 0.55;
  scene.add(body);
  const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.028, 8, 8), bulbMat);
  bulb.position.copy(body.position);
  bulb.position.y -= 0.08;
  scene.add(bulb);

  // Light cone (fake, cheap)
  const coneH = 1.85;
  const cone = new THREE.Mesh(
    new THREE.ConeGeometry(0.62, coneH, 24, 1, true),
    new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: quality==='high' ? 0.085 : 0.055,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    })
  );
  // place cone from fixture toward the frame
  const frameX = side * (WALL_X - 0.08);
  const midX = (xRail + frameX) * 0.5;
  cone.position.set(midX, (CEIL_Y-0.22 + FRAME_Y+0.4)*0.5, z);
  const dir = new THREE.Vector3(frameX, FRAME_Y+0.15, z).sub(new THREE.Vector3(xRail, CEIL_Y-0.22, z)).normalize();
  cone.quaternion.setFromUnitVectors(new THREE.Vector3(0,-1,0), dir);
  scene.add(cone);

  // Wall wash behind the frame
  const wash = new THREE.Mesh(
    new THREE.PlaneGeometry(1.7, 2.15),
    new THREE.MeshBasicMaterial({
      map: makeSpotCookie(),
      color: color,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    })
  );
  wash.position.set(side * (WALL_X - 0.012), FRAME_Y, z);
  wash.rotation.y = side > 0 ? -Math.PI/2 : Math.PI/2;
  scene.add(wash);

  // Floor pool
  const pool = new THREE.Mesh(
    new THREE.PlaneGeometry(1.15, 1.6),
    new THREE.MeshBasicMaterial({
      map: makeSpotCookie(),
      color: color,
      transparent: true,
      opacity: 0.22,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })
  );
  pool.rotation.x = -Math.PI/2;
  pool.position.set(side * 0.7, 0.015, z);
  scene.add(pool);

  return {cone, wash};
}

function buildFrame({scene, product, isCta, side, z, tex, glowColor, quality}){
  const group = new THREE.Group();
  const img = tex.image;
  const aspect = (img && img.width && img.height) ? (img.width / img.height) : 0.75;
  let fw, fh;
  if(aspect >= 1){
    fw = Math.min(1.55, FRAME_MAX_H * 1.05);
    fh = fw / aspect;
  }else{
    fh = FRAME_MAX_H;
    fw = fh * aspect;
  }
  if(isCta){ fw = 1.05; fh = 1.32; }

  const artMat = new THREE.MeshStandardMaterial({
    map: tex,
    emissive: glowColor,
    emissiveMap: isCta ? null : tex,
    emissiveIntensity: isCta ? 0.45 : 0.55,
    roughness: 0.35,
    metalness: 0.0,
    envMapIntensity: 0.2
  });
  const art = new THREE.Mesh(new THREE.PlaneGeometry(fw, fh), artMat);
  art.position.x = -0.012; // slightly in front of backboard in local +X later
  group.add(art);

  // Wooden / dark frame
  const frameMat = new THREE.MeshStandardMaterial({
    color: 0x1c140e, roughness: 0.45, metalness: 0.15, envMapIntensity: 0.35
  });
  const t = 0.045, d = 0.06;
  const pieces = [
    new THREE.BoxGeometry(fw + t*2, t, d),
    new THREE.BoxGeometry(fw + t*2, t, d),
    new THREE.BoxGeometry(t, fh, d),
    new THREE.BoxGeometry(t, fh, d)
  ];
  const pos = [
    [0,  fh/2 + t/2, -0.005],
    [0, -fh/2 - t/2, -0.005],
    [-(fw/2 + t/2), 0, -0.005],
    [ (fw/2 + t/2), 0, -0.005]
  ];
  pieces.forEach((geo,i)=>{
    const m = new THREE.Mesh(geo, frameMat);
    m.position.set(...pos[i]);
    if(quality==='high') m.castShadow = true;
    group.add(m);
  });
  const back = new THREE.Mesh(new THREE.PlaneGeometry(fw+t*2, fh+t*2), new THREE.MeshStandardMaterial({
    color:0x0c0a08, roughness:0.8, metalness:0
  }));
  back.position.z = -0.028;
  group.add(back);

  // Bloom sprite behind the neon
  const bloom = new THREE.Mesh(
    new THREE.PlaneGeometry(fw*1.7, fh*1.7),
    new THREE.MeshBasicMaterial({
      map: makeRadialTex('rgba(255,255,255,.9)','rgba(255,255,255,.25)','rgba(255,255,255,0)'),
      color: glowColor,
      transparent: true,
      opacity: isCta ? 0.55 : 0.4,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    })
  );
  bloom.position.z = -0.04;
  group.add(bloom);

  // Place on wall: local +Z is the art facing into the corridor
  const x = side * (WALL_X - 0.07);
  group.position.set(x, FRAME_Y, z);
  group.rotation.y = side > 0 ? -Math.PI/2 : Math.PI/2;
  scene.add(group);

  // Placard
  let placard = null;
  if(!isCta && product){
    const meta = classify(product);
    const ptex = makePlacardTex(meta.kind, product.name||'');
    const pw = 0.38, ph = 0.19;
    placard = new THREE.Mesh(new THREE.PlaneGeometry(pw, ph), new THREE.MeshStandardMaterial({
      map: ptex, roughness: 0.55, metalness: 0.05, envMapIntensity: 0.2
    }));
    const plateSide = -side; // toward the entrance side of the frame, slightly toward corridor center
    // Placard on the wall, a little after the frame (further down the corridor) and lower
    const pz = z + 0.55;
    const px = side * (WALL_X - 0.03);
    placard.position.set(px, FRAME_Y - fh/2 - 0.18, pz);
    placard.rotation.y = side > 0 ? -Math.PI/2 : Math.PI/2;
    scene.add(placard);
  }

  addSpotlightRig(scene, group, side, z, glowColor, quality);

  const rec = {
    group, art, isCta, product: product||null, side, z, x, y: FRAME_Y,
    w: fw, h: fh, glowColor, placard
  };
  art.userData.frame = rec;
  group.userData.frame = rec;
  return rec;
}

function addCollectionTitles(scene, frames){
  const seen = new Set();
  frames.forEach(f => {
    if(f.isCta || !f.product) return;
    const meta = classify(f.product);
    if(seen.has(meta.collection)) return;
    seen.add(meta.collection);
    const tex = makeFloorTitleTex(meta.kicker, meta.title);
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2.3, 0.8), new THREE.MeshBasicMaterial({
      map: tex, transparent: true, opacity: 0.72, depthWrite: false, toneMapped: false
    }));
    mesh.rotation.x = -Math.PI/2;
    mesh.rotation.z = Math.PI;
    // on the floor, centered, a bit before the first work of that collection
    mesh.position.set(0, 0.02, Math.max(2.6, f.z - 0.95));
    scene.add(mesh);
    // also a small wall title opposite the first frame
    const wall = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.35), new THREE.MeshBasicMaterial({
      map: tex, transparent: true, opacity: 0.55, depthWrite: false, toneMapped: false
    }));
    const wside = -f.side;
    wall.position.set(wside * (WALL_X - 0.03), 2.55, f.z);
    wall.rotation.y = wside > 0 ? -Math.PI/2 : Math.PI/2;
    scene.add(wall);
  });
}

function worldToScreen(renderer, camera, pos){
  const v = pos.clone().project(camera);
  const r = renderer.domElement.getBoundingClientRect();
  return {
    x: (v.x * 0.5 + 0.5) * r.width + r.left,
    y: (-v.y * 0.5 + 0.5) * r.height + r.top
  };
}

function poseAt(p){
  const z = lerp(state.z0, state.z1, p);
  // glance toward nearest frame
  let lookX = 0, lookY = EYE_Y, lookZ = z + 2.4, w = 0;
  let nearest = null, nd = 1e9;
  for(const f of state.frames){
    const d = Math.abs(f.z - z);
    if(d < nd){ nd = d; nearest = f; }
  }
  if(nearest){
    w = Math.exp(-(nd*nd)/(2.4*2.4)) * 0.45;
    lookX = lerp(0, nearest.x * 0.28, w);
    lookY = lerp(EYE_Y, nearest.y * 0.08 + EYE_Y * 0.92, w*0.4);
    lookZ = lerp(z + 2.6, nearest.z + (nearest.z > z ? 0.2 : -0.1), w);
  }
  return {x:0, y:EYE_Y, z, lookX, lookY, lookZ, glance:w, nearest};
}

function applyPose(pose, bob=0){
  const cam = state.camera;
  cam.position.set(pose.x, pose.y + bob, pose.z);
  state.lookTarget.set(pose.lookX, pose.lookY + bob, pose.lookZ);
  cam.lookAt(state.lookTarget);
}

function startFlyTo(frame){
  if(state.flying || REDUCE){
    finishOpen(frame);
    return;
  }
  const cam = state.camera;
  const fromPos = cam.position.clone();
  const fromQuat = cam.quaternion.clone();
  const standX = frame.x - frame.side * 1.28;
  const standY = EYE_Y;
  const standZ = frame.z;
  const toPos = new THREE.Vector3(standX, standY, standZ);
  const dummy = cam.clone();
  dummy.position.copy(toPos);
  dummy.lookAt(new THREE.Vector3(frame.x, frame.y, frame.z));
  const toQuat = dummy.quaternion.clone();
  state.savedP = state.currentP;
  state.flying = true;
  document.body.classList.add('hall-flying');
  state.fly = {
    frame, fromPos, toPos, fromQuat, toQuat,
    t0: performance.now(), dur: 1500
  };
}

function finishOpen(frame){
  state.flying = false;
  document.body.classList.remove('hall-flying');
  if(frame.isCta){
    const el = document.getElementById('ia-neon');
    if(el){
      const top = el.getBoundingClientRect().top + window.scrollY - 78;
      window.scrollTo(0, Math.max(0, top));
    }
    return;
  }
  if(!frame.product) return;
  let rect = null;
  try{
    const corners = [
      new THREE.Vector3(-frame.w/2,  frame.h/2, 0),
      new THREE.Vector3( frame.w/2, -frame.h/2, 0)
    ].map(v => {
      frame.art.localToWorld(v);
      return worldToScreen(state.renderer, state.camera, v);
    });
    const x = Math.min(corners[0].x, corners[1].x);
    const y = Math.min(corners[0].y, corners[1].y);
    rect = {x, y, w: Math.abs(corners[1].x-corners[0].x), h: Math.abs(corners[1].y-corners[0].y)};
  }catch(e){ rect = null; }
  document.dispatchEvent(new CustomEvent('hall:open-product', {detail:{product:frame.product, rect}}));
}

function tickFly(now){
  const f = state.fly;
  if(!f) return false;
  const t = clamp((now - f.t0)/f.dur, 0, 1);
  const k = power3InOut(t);
  state.camera.position.lerpVectors(f.fromPos, f.toPos, k);
  state.camera.quaternion.slerpQuaternions(f.fromQuat, f.toQuat, k);
  if(t >= 1){
    state.fly = null;
    finishOpen(f.frame);
    return false;
  }
  return true;
}

function pickFrame(clientX, clientY){
  const {canvas} = getEls();
  if(!canvas || !state.camera) return null;
  const r = canvas.getBoundingClientRect();
  state.pointer.set(((clientX-r.left)/r.width)*2-1, -((clientY-r.top)/r.height)*2+1);
  state.raycaster.setFromCamera(state.pointer, state.camera);
  const objs = state.frames.map(f => f.art);
  const hits = state.raycaster.intersectObjects(objs, false);
  if(hits.length) return hits[0].object.userData.frame || null;
  return null;
}

function onPointerDown(e){
  if(state.flying || document.body.classList.contains('pp-open')) return;
  if(e.pointerType === 'mouse' && e.button !== 0) return;
  state.pointers.set(e.pointerId, {y:e.clientY, x:e.clientX});
  state.dragging = true;
  state.moved = 0;
  state.lastY = e.clientY;
  try{ e.currentTarget.setPointerCapture(e.pointerId); }catch(err){}
}

function onPointerMove(e){
  if(!state.dragging || !state.pointers.has(e.pointerId)) return;
  const dy = e.clientY - state.lastY;
  state.lastY = e.clientY;
  state.moved += Math.abs(dy) + Math.abs(e.movementX||0);
  // drag up = walk forward
  const scale = 0.0015;
  state.vel += -dy * scale;
  state.targetP = clamp(state.targetP - dy * scale, 0, 1);
}

function onPointerUp(e){
  const start = state.pointers.get(e.pointerId);
  state.pointers.delete(e.pointerId);
  if(state.pointers.size===0) state.dragging = false;
  if(!start) return;
  if(state.moved < 14){
    const frame = pickFrame(e.clientX, e.clientY);
    if(frame) startFlyTo(frame);
  }
}

function onWheel(e){
  if(state.flying || document.body.classList.contains('pp-open')) return;
  const {pin, section} = getEls();
  if(!pin || !section) return;
  const r = pin.getBoundingClientRect();
  const inView = r.top <= 1 && r.bottom >= innerHeight*0.5;
  if(!inView) return;
  // If we're mid-corridor, take over the wheel so the walk feels tight
  const atStart = state.currentP <= 0.002 && e.deltaY < 0;
  const atEnd = state.currentP >= 0.998 && e.deltaY > 0;
  if(atStart || atEnd) return; // let the page scroll take over
  e.preventDefault();
  const step = (e.deltaY) * 0.00028;
  state.vel += step;
  state.targetP = clamp(state.targetP + step, 0, 1);
  syncScrollTo(state.targetP);
}

function onKey(e){
  if(state.flying || document.body.classList.contains('pp-open')) return;
  const tag = (e.target && e.target.tagName) || '';
  if(/INPUT|TEXTAREA|SELECT/.test(tag) || e.target.isContentEditable) return;
  const {section} = getEls();
  if(section){
    const r = section.getBoundingClientRect();
    if(r.bottom < 80 || r.top > innerHeight-80) return;
  }
  let dir = 0;
  if(e.key==='ArrowDown' || e.key==='ArrowRight' || e.key==='s' || e.key==='S') dir = 1;
  if(e.key==='ArrowUp' || e.key==='ArrowLeft' || e.key==='w' || e.key==='W') dir = -1;
  if(!dir) return;
  e.preventDefault();
  state.vel += dir * 0.008;
  state.targetP = clamp(state.targetP + dir * 0.008, 0, 1);
  syncScrollTo(state.targetP);
}

function attachInput(){
  const {canvas, pin} = getEls();
  const el = canvas || pin;
  if(!el) return;
  el.addEventListener('pointerdown', onPointerDown);
  el.addEventListener('pointermove', onPointerMove);
  el.addEventListener('pointerup', onPointerUp);
  el.addEventListener('pointercancel', onPointerUp);
  window.addEventListener('wheel', onWheel, {passive:false});
  window.addEventListener('keydown', onKey);
}

function adaptQuality(dt){
  state.fpsT += dt;
  state.fpsFrames++;
  if(state.fpsT < 1) return;
  state.fps = state.fpsFrames / state.fpsT;
  state.fpsFrames = 0;
  state.fpsT = 0;
  if(state.quality==='high' && state.fps < 26){
    state.quality = 'medium';
    state.dpr = 1;
    if(state.renderer){
      state.renderer.setPixelRatio(1);
      state.renderer.shadowMap.enabled = false;
    }
  }else if(state.quality==='medium' && state.fps < 22){
    state.quality = 'low';
    state.dpr = 0.85;
    if(state.renderer) state.renderer.setPixelRatio(0.85);
  }
}

function animate(){
  if(!state.renderer || !state.scene || !state.camera) return;
  requestAnimationFrame(animate);
  if(document.hidden) return;
  const dt = Math.min(0.05, state.clock.getDelta());
  const now = performance.now();

  if(tickFly(now)){
    state.renderer.render(state.scene, state.camera);
    return;
  }
  if(document.body.classList.contains('pp-open')){
    // keep last frame; no need to render every tick at full cost
    return;
  }

  // Blend scroll-driven target with inertia
  const sp = scrollProgress();
  if(!state.dragging && Math.abs(state.vel) < 0.0008){
    // gently follow the page scroll when the user is scrolling the spacer
    state.targetP = lerp(state.targetP, sp, 0.15);
  }
  state.vel *= REDUCE ? 0.6 : 0.92;
  state.targetP = clamp(state.targetP + state.vel, 0, 1);
  state.currentP = lerp(state.currentP, state.targetP, REDUCE ? 1 : 0.14);

  const pose = poseAt(state.currentP);
  const speed = Math.min(1, Math.abs(state.vel)*40 + Math.abs(state.targetP-state.currentP)*8);
  const bob = (REDUCE || speed < 0.04) ? 0 : Math.sin(pose.z * 5.2) * 0.012 * speed;
  applyPose(pose, bob);

  if(state.movingLight){
    state.movingLight.position.set(0, CEIL_Y-0.4, pose.z + 0.8);
  }

  adaptQuality(dt);
  state.renderer.render(state.scene, state.camera);
}

function onResize(){
  if(!state.renderer || !state.camera) return;
  const {canvas, pin} = getEls();
  const w = (pin||canvas).clientWidth || innerWidth;
  const h = (pin||canvas).clientHeight || innerHeight;
  state.camera.aspect = w / Math.max(1,h);
  state.camera.updateProjectionMatrix();
  state.renderer.setSize(w, h, false);
}

async function init3D(products){
  const {canvas, pin} = getEls();
  const info = webglInfo();
  if(!info.ok) throw new Error('no webgl');
  state.weak = info.weak;
  state.quality = (state.weak || IS_TOUCH) ? 'medium' : 'high';
  state.dpr = state.weak ? 1 : Math.min(window.devicePixelRatio||1, IS_TOUCH ? 1.25 : 1.5);

  const renderer = new THREE.WebGLRenderer({
    canvas, antialias: state.quality==='high' && !state.weak, alpha:false, powerPreference:'high-performance'
  });
  renderer.setPixelRatio(state.dpr);
  renderer.setClearColor(0x140e0c, 1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = state.quality==='high' && !state.weak;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  state.renderer = renderer;

  const w = (pin||canvas).clientWidth || innerWidth;
  const h = (pin||canvas).clientHeight || innerHeight;
  renderer.setSize(w, h, false);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x140e0c);
  scene.fog = new THREE.FogExp2(0x1a120e, 0.036);
  state.scene = scene;

  const camera = new THREE.PerspectiveCamera(62, w/Math.max(1,h), 0.08, 60);
  camera.position.set(0, EYE_Y, CAM_Z0);
  state.camera = camera;

  const env = makeEnv(renderer);
  scene.environment = env;
  state.envMap = env;

  const aniso = Math.min(8, renderer.capabilities.getMaxAnisotropy?.() || 4);
  const mats = await loadMaterials(aniso);

  const list = products || state.products || [];
  const n = (products||state.products||[]).length + 1; // + CTA
  const lastZ = START_Z + (n-1)*SPACING;
  const length = lastZ + 3.2;
  state.z0 = CAM_Z0;
  state.z1 = lastZ + 1.15;

  buildRoom(scene, mats, length, state.quality);

  // Lights
  scene.add(new THREE.HemisphereLight(0xffe6c4, 0x3a2818, 0.55));
  scene.add(new THREE.AmbientLight(0x4a382c, 0.38));
  const fill = new THREE.PointLight(0xffd8a8, 0.55, 18, 1.4);
  fill.position.set(0, 1.8, length*0.45);
  scene.add(fill);
  const key = new THREE.DirectionalLight(0xffe2b8, 0.22);
  key.position.set(0.35, 2.8, 2);
  if(renderer.shadowMap.enabled){
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.near = 0.5;
    key.shadow.camera.far = 30;
    key.shadow.camera.left = -4;
    key.shadow.camera.right = 4;
    key.shadow.camera.top = 6;
    key.shadow.camera.bottom = -2;
    key.shadow.bias = -0.001;
  }
  scene.add(key);

  const moving = new THREE.PointLight(0xffe0b0, 0.7, 8, 2);
  moving.position.set(0, CEIL_Y-0.4, 2);
  scene.add(moving);
  state.movingLight = moving;

  // Frames
  state.frames = [];
  const loader = new THREE.TextureLoader();
  const loadArt = (url) => new Promise((res,rej)=>loader.load(url, t=>{
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = aniso;
    t.needsUpdate = true;
    res(t);
  }, undefined, rej));

  const sorted = [...list].sort((a,b)=>{
    const ca = classify(a).collection, cb = classify(b).collection;
    if(ca===cb) return 0;
    return ca==='lampes' ? -1 : 1;
  });
  for(let i=0;i<sorted.length;i++){
    const p = sorted[i];
    const side = (i % 2 === 0) ? 1 : -1; // start on the right wall
    const z = START_Z + i*SPACING;
    const url = p.photo || p.thumb;
    let tex;
    try{ tex = await loadArt(url); }
    catch(e){ continue; }
    const glow = avgGlow(tex.image, classify(p).glow);
    const rec = buildFrame({scene, product:p, isCta:false, side, z, tex, glowColor:glow, quality:state.quality});
    state.frames.push(rec);
  }
  // CTA at the end, slightly centered on the right then a bit inward? Keep on a wall.
  {
    const i = list.length;
    const side = (i % 2 === 0) ? 1 : -1;
    const z = START_Z + i*SPACING;
    const tex = makeCtaTex();
    const rec = buildFrame({scene, product:null, isCta:true, side, z, tex, glowColor:new THREE.Color('#ffb45c'), quality:state.quality});
    state.frames.push(rec);
  }

  addCollectionTitles(scene, state.frames);
  setSpacer();
  attachInput();
  addEventListener('resize', onResize, {passive:true});
  addEventListener('scroll', () => {
    if(state.flying || state.dragging || document.body.classList.contains('pp-open')) return;
    // When the user scrolls the page naturally, follow it
  }, {passive:true});

  state.mode = '3d';
  state.ready = true;
  applyPose(poseAt(0), 0);
  hideLoader();
  const {hint} = getEls();
  if(hint) hint.textContent = 'Défilez pour avancer dans le musée · touchez un cadre';
  animate();
  onResize();
}

function setProducts(list){
  const arr = (list||[]).filter(p => p && p.visible!==false && (p.photo||p.thumb));
  const key = productKey(arr);
  state.products = arr;
  if(state.mode==='fallback'){
    buildFallback(arr);
    return;
  }
  if(state.ready && state.mode==='3d' && key === state.productKey) return;
  state.productKey = key;
  // If the scene already exists we keep it (first call during boot may be empty then filled).
  // Rebuild only if 3D already booted with a different set.
  if(state.ready && state.mode==='3d' && state.scene && key){
    // Too late to cheaply rebuild mid-flight; boot already waited for products.
    return;
  }
}

function openProductId(id){
  const f = state.frames.find(fr => fr.product && fr.product.id===id);
  if(f) startFlyTo(f);
  else {
    const p = state.products.find(x=>x.id===id);
    if(p) document.dispatchEvent(new CustomEvent('hall:open-product',{detail:{product:p, rect:null}}));
  }
}

function closeProductFromHall(){
  const {canvas} = getEls();
  if(canvas) canvas.style.opacity = '1';
  document.body.classList.remove('hall-flying');
  state.flying = false;
  state.fly = null;
  // Stay at the same corridor spot (saved, or current).
  if(typeof state.savedP === 'number'){
    state.currentP = state.savedP;
    state.targetP = state.savedP;
    state.vel = 0;
    applyPose(poseAt(state.savedP), 0);
    if(state.renderer && state.scene && state.camera) state.renderer.render(state.scene, state.camera);
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
    names: state.frames.map(f=>f.isCta ? 'CTA' : (f.product?.name||'?')),
    sides: state.frames.map(f=>f.side),
    zs: state.frames.map(f=>+f.z.toFixed(2)),
    p: state.currentP, target: state.targetP, vel: state.vel,
    fps: +state.fps.toFixed(1), quality: state.quality, weak: state.weak
  }),
  canvasOpacity(v){ const {canvas}=getEls(); if(canvas) canvas.style.opacity = String(v); },
  setProgress(p){
    const v = clamp(+p||0, 0, 1);
    state.currentP = state.targetP = v;
    state.vel = 0;
    syncScrollTo(v);
    if(state.camera) applyPose(poseAt(v), 0);
    if(state.renderer && state.scene && state.camera) state.renderer.render(state.scene, state.camera);
  }
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
  const info = webglInfo();
  if(!info.ok){
    buildFallback(state.products);
    return;
  }
  try{
    await init3D(state.products);
  }catch(err){
    console.warn('Galerie musée indisponible, bascule vers la galerie simple.', err);
    buildFallback(state.products);
  }
}

if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', boot);
else boot();
