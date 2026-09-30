import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const store = { get: (k, d) => { try { return localStorage.getItem(k) || d } catch { return d } }, set: (k, v) => { try { localStorage.setItem(k, v) } catch {} } };
const THEMES = {
  void:   { accent: '#00E5FF', a2: '#7C3AED', glow: 'rgba(0,229,255,.35)' },
  ice:    { accent: '#8DEBFF', a2: '#4f8cff', glow: 'rgba(141,235,255,.35)' },
  violet: { accent: '#A855F7', a2: '#00E5FF', glow: 'rgba(168,85,247,.38)' },
  matrix: { accent: '#00FF88', a2: '#0a7d4a', glow: 'rgba(0,255,136,.3)' }
};
const MOTION = { cinematic: 0.05, smooth: 0.12, reduced: 1 };
const st = {
  theme: store.get('vx-theme', 'void'), font: store.get('vx-font', 'Space Grotesk'), motion: store.get('vx-motion', matchMedia('(prefers-reduced-motion:reduce)').matches ? 'reduced' : 'cinematic')
};
const hooks = []; // callbacks run when theme changes

/* ---------- Controls ---------- */
function applyTheme() {
  const t = THEMES[st.theme] || THEMES.void, r = document.documentElement.style;
  r.setProperty('--accent', t.accent); r.setProperty('--accent-2', t.a2); r.setProperty('--glow', t.glow);
  hooks.forEach(f => f(t));
}
function applyFont() {
  const mono = /Mono/.test(st.font);
  document.documentElement.style.setProperty('--font', `'${st.font}',${mono ? 'monospace' : 'system-ui,sans-serif'}`);
}
function applyMotion() { document.body.classList.toggle('reduce', st.motion === 'reduced'); }
function markOn() { $$('[data-group]').forEach(g => $$('button', g).forEach(b => b.classList.toggle('on', b.dataset.v === st[g.dataset.group]))); }
$$('[data-group]').forEach(g => g.addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  const k = g.dataset.group; st[k] = b.dataset.v; store.set('vx-' + k, st[k]);
  ({ theme: applyTheme, font: applyFont, motion: applyMotion })[k](); markOn();
}));
$('#hudBtn').addEventListener('click', e => { const o = $('#hud').classList.toggle('open'); e.currentTarget.setAttribute('aria-expanded', o); });
applyFont(); applyMotion(); markOn();

/* ---------- Side nav + section tracking ---------- */
const secs = $$('main section'), side = $('#side');
const secIds = secs.map((s, i) => (s.id || (s.id = 's' + i)));
secs.forEach((s, i) => { const a = document.createElement('a'); a.href = '#' + s.id; a.textContent = String(i + 1).padStart(2, '0') + ' ' + s.dataset.label; side.append(a); });
let cur = 0;
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { cur = secs.indexOf(e.target); $$('a', side).forEach((a, i) => a.classList.toggle('on', i === cur)); e.target.classList.add('in'); setTarget(cur); pulseFlow(e.target); }
}), { threshold: 0.45 });
secs.forEach(s => io.observe(s));
function pulseFlow(sec) { $$('.flow', sec).forEach(f => { const li = $$('li', f); li.forEach(x => x.classList.remove('act')); li.forEach((x, i) => setTimeout(() => x.classList.add('act'), 250 * i)); }); }

/* ---------- Contact chooser ---------- */
const dlg = $('#chooser'), WA = 'https://wa.me/918485800930', IG = 'https://instagram.com/sisirey.vox', TG = 'https://t.me/yor_forg3r';
$$('[data-open]').forEach(b => b.addEventListener('click', () => {
  const svc = b.dataset.svc, msg = svc ? `Hi VOXX NEXUS, I'm interested in the ${svc}.` : `Hi VOXX NEXUS, I'd like to start a project.`;
  $('#chSvc').textContent = svc ? svc.toUpperCase() : 'NEW PROJECT';
  $('#chIg').href = IG; $('#chTg').href = TG; $('#chWa').href = WA + '?text=' + encodeURIComponent(msg);
  dlg.showModal();
}));
$('#chClose').addEventListener('click', () => dlg.close());
dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });

/* ---------- Cursor glow, card tilt, magnetic buttons ---------- */
const mouse = { x: 0, y: 0 }, glow = $('#glow');
addEventListener('pointermove', e => {
  mouse.x = e.clientX / innerWidth * 2 - 1; mouse.y = e.clientY / innerHeight * 2 - 1;
  glow.style.transform = `translate(${e.clientX - 180}px,${e.clientY - 180}px)`;
}, { passive: true });
$$('[data-tilt]').forEach(c => {
  c.addEventListener('pointermove', e => {
    if (st.motion === 'reduced') return;
    const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    c.style.transform = `perspective(800px) rotateY(${(x - .5) * 8}deg) rotateX(${(.5 - y) * 8}deg)`;
    c.style.setProperty('--mx', x * 100 + '%'); c.style.setProperty('--my', y * 100 + '%');
  });
  c.addEventListener('pointerleave', () => c.style.transform = '');
});
$$('.mag').forEach(b => {
  b.addEventListener('pointermove', e => { if (st.motion === 'reduced') return; const r = b.getBoundingClientRect(); b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .15}px,${(e.clientY - r.top - r.height / 2) * .25}px)`; });
  b.addEventListener('pointerleave', () => b.style.transform = '');
});

/* ---------- WebGL ---------- */
let setTarget = () => {};
let renderer;
try {
  const canvas = $('#gl'), weak = matchMedia('(max-width:768px)').matches || (navigator.hardwareConcurrency || 8) <= 4;
  renderer = new THREE.WebGLRenderer({ canvas, antialias: !weak, powerPreference: 'high-performance' });
  let dpr = Math.min(devicePixelRatio, weak ? 1.25 : 2);
  renderer.setPixelRatio(dpr); renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.1;
  const scene = new THREE.Scene(); scene.fog = new THREE.FogExp2(0x050609, 0.045);
  const cam = new THREE.PerspectiveCamera(50, 1, 0.1, 100); cam.position.set(0, 0.6, 8);
  const pm = new THREE.PMREMGenerator(renderer); scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;

  const cA = new THREE.Color(), cB = new THREE.Color();
  const L1 = new THREE.PointLight(0x00e5ff, 40, 20), L2 = new THREE.PointLight(0x7c3aed, 30, 20); L1.position.set(3, 2, 3); L2.position.set(-3, -1, 2); scene.add(L1, L2);

  // Chamber: reflective floor, pillars, grid
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), new THREE.MeshStandardMaterial({ color: 0x0b0f14, metalness: 0.9, roughness: 0.35 }));
  floor.rotation.x = -Math.PI / 2; floor.position.y = -3.2; scene.add(floor);
  const grid = new THREE.GridHelper(60, 60, 0x00e5ff, 0x00e5ff); grid.position.y = -3.19; grid.material.transparent = true; grid.material.opacity = 0.08; scene.add(grid);
  const pMat = new THREE.MeshStandardMaterial({ color: 0x0b0f14, metalness: 0.8, roughness: 0.4 });
  for (let i = 0; i < 14; i++) { const a = i / 14 * Math.PI * 2, h = 6 + (i % 4) * 3, p = new THREE.Mesh(new THREE.BoxGeometry(1 + (i % 3) * .5, h, 1), pMat); p.position.set(Math.cos(a) * 16, -3.2 + h / 2, Math.sin(a) * 16 - 4); scene.add(p); }

  // Nexus core (procedural; replaced/augmented by GLB if present)
  const core = new THREE.Group(); scene.add(core);
  const crystalM = new THREE.MeshPhysicalMaterial({ color: 0x00e5ff, emissive: 0x00e5ff, emissiveIntensity: 0.9, roughness: 0.1, metalness: 0.1, transparent: true, opacity: 0.85, clearcoat: 1 });
  const crystal = new THREE.Mesh(new THREE.OctahedronGeometry(0.9, 1), crystalM); core.add(crystal);
  const shellM = new THREE.MeshPhysicalMaterial({ color: 0x88ccff, roughness: 0.05, transparent: true, opacity: 0.18, side: THREE.DoubleSide });
  core.add(new THREE.Mesh(new THREE.IcosahedronGeometry(1.35, 1), shellM));
  const holo = new THREE.Mesh(new THREE.IcosahedronGeometry(1.6, 2), new THREE.MeshBasicMaterial({ color: 0x00e5ff, wireframe: true, transparent: true, opacity: 0.12 })); core.add(holo);
  const dark = new THREE.MeshStandardMaterial({ color: 0x111418, metalness: 0.9, roughness: 0.35 }), chrome = new THREE.MeshStandardMaterial({ color: 0xc8d0da, metalness: 1, roughness: 0.18 });
  const rings = [];
  [[2.0, .05, 0, chrome], [2.5, .08, 1.1, dark], [3.0, .03, .5, chrome], [1.75, .06, 2, dark]].forEach(([r, t, tilt, m], i) => {
    const g = new THREE.Mesh(new THREE.TorusGeometry(r, t, 12, 120), m); g.rotation.set(tilt, i * .7, 0); core.add(g); rings.push(g);
    const n = new THREE.Mesh(new THREE.SphereGeometry(.07, 8, 8), new THREE.MeshBasicMaterial({ color: 0x00e5ff })); n.position.x = r; g.add(n); n.userData.node = 1;
  });
  const frags = [];
  for (let i = 0; i < 26; i++) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(.12 + Math.random() * .2, .05, .2 + Math.random() * .2), i % 3 ? dark : chrome);
    m.userData = { a: Math.random() * 6.28, r: 2.2 + Math.random() * 1.6, y: (Math.random() - .5) * 2.5, s: .1 + Math.random() * .3 }; core.add(m); frags.push(m);
  }
  // Optional GLB: drop your file at ./assets/nexus-core.glb
  fetch('./assets/nexus-core.glb', { method: 'HEAD' }).then(r => {
    if (!r.ok) return;
    new GLTFLoader().load('./assets/nexus-core.glb', g => {
      core.clear(); const box = new THREE.Box3().setFromObject(g.scene), s = 3.6 / Math.max(...box.getSize(new THREE.Vector3()).toArray());
      g.scene.scale.setScalar(s); g.scene.position.sub(box.getCenter(new THREE.Vector3()).multiplyScalar(s)); core.add(g.scene); frags.length = 0; rings.length = 0;
    });
  }).catch(() => {});

  // Particles with morph targets
  const N = weak ? 2500 : 7000, pos = new Float32Array(N * 3), tgt = new Float32Array(N * 3), seeds = new Float32Array(N);
  const shape = (k, i) => {
    const u = Math.random(), v = Math.random(), a = u * 6.283, b = Math.acos(2 * v - 1);
    switch (k) {
      case 0: return [(Math.random() - .5) * 26, (Math.random() - .5) * 12, (Math.random() - .5) * 14 - 2];            // flow field
      case 1: { const r = 3 + Math.random() * .2; return [r * Math.sin(b) * Math.cos(a), r * Math.sin(b) * Math.sin(a), r * Math.cos(b)]; } // sphere
      case 2: { const c = i % 12, cx = Math.sin(c * 2.4) * 6, cy = Math.cos(c * 1.7) * 3, cz = Math.sin(c * 3.1) * 3; return [cx + (Math.random() - .5) * 1.4, cy + (Math.random() - .5) * 1.4, cz + (Math.random() - .5) * 1.4]; } // clusters / network
      case 3: { const r = 4 + (Math.random() - .5) * .4; return [r * Math.cos(a), (Math.random() - .5) * .3, r * Math.sin(a)]; } // ring
      case 4: { const r = 1 + Math.random() * 3; return [r * Math.cos(a * 3) * .9, r * Math.sin(a * 2) * .9, (Math.random() - .5) * 2]; } // knot cloud
      default: { const r = Math.pow(Math.random(), .6) * 3.2; return [r * Math.sin(b) * Math.cos(a), r * Math.sin(b) * Math.sin(a), r * Math.cos(b)]; } // dense core
    }
  };
  const order = [0, 5, 0, 2, 2, 1, 4, 3, 3, 4, 5]; // per-section shape
  for (let i = 0; i < N; i++) { const s = shape(0, i); pos.set(s, i * 3); seeds[i] = Math.random() * 6.28; }
  const pGeo = new THREE.BufferGeometry(); pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const pMatl = new THREE.PointsMaterial({ size: weak ? .05 : .035, color: 0x00e5ff, transparent: true, opacity: .85, depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true });
  const pts = new THREE.Points(pGeo, pMatl); scene.add(pts);
  setTarget = idx => { const k = order[Math.min(idx, order.length - 1)]; for (let i = 0; i < N; i++) tgt.set(shape(k, i), i * 3); };
  setTarget(0);

  // Post
  const comp = new EffectComposer(renderer); comp.addPass(new RenderPass(scene, cam));
  const bloom = new UnrealBloomPass(new THREE.Vector2(512, 512), weak ? .5 : .8, .6, .25); comp.addPass(bloom); comp.addPass(new OutputPass());

  hooks.push(t => { cA.set(t.accent); cB.set(t.a2); L1.color.copy(cA); L2.color.copy(cB); crystalM.color.copy(cA); crystalM.emissive.copy(cA); holo.material.color.copy(cA); pMatl.color.copy(cA); grid.material.color.copy(cA); });
  applyTheme();

  const resize = () => { const w = innerWidth, h = innerHeight; renderer.setSize(w, h, false); comp.setSize(w, h); bloom.resolution.set(w / (weak ? 2 : 1), h / (weak ? 2 : 1)); cam.aspect = w / h; cam.updateProjectionMatrix(); };
  addEventListener('resize', resize); resize();

  let visible = true; document.addEventListener('visibilitychange', () => visible = !document.hidden);
  const cs = { x: 0, y: 0, z: 8, cx: 0, rot: 0 }; let t0 = performance.now(), slow = 0;
  const loop = now => {
    requestAnimationFrame(loop); if (!visible) return;
    const dt = Math.min((now - t0) / 1000, .1); t0 = now; const k = MOTION[st.motion], red = st.motion === 'reduced', time = now / 1000;
    // adaptive DPR
    if (dt > .028) slow++; else slow = Math.max(0, slow - 1);
    if (slow > 40 && dpr > 1) { dpr = Math.max(1, dpr - .25); renderer.setPixelRatio(dpr); resize(); slow = 0; }
    const p = scrollY / Math.max(1, document.body.scrollHeight - innerHeight), desk = innerWidth > 900;
    const tz = 8 - Math.sin(p * Math.PI * 3) * 1.6 + (desk ? 0 : 3), tx = desk ? 2.2 * Math.cos(p * Math.PI * 4) : 0, ty = desk ? 0 : 1.6 - p * 1.5;
    core.position.x += (tx - core.position.x) * k; core.position.y += (ty - core.position.y) * k; cs.z += (tz - cs.z) * k;
    cam.position.set(mouse.x * (red ? 0 : .6), .6 - mouse.y * (red ? 0 : .4) - p * 1.5, cs.z); cam.lookAt(0, -p * .8, 0);
    core.rotation.y += (mouse.x * .5 + p * 6 - core.rotation.y) * k * .5 + (red ? 0 : dt * .1);
    core.rotation.x += (mouse.y * .25 - core.rotation.x) * k;
    const sc = (desk ? 1 : .6) * (1 + Math.sin(p * 9) * .12); core.scale.setScalar(sc);
    crystal.rotation.y = time * .4; crystal.rotation.x = time * .2; crystalM.emissiveIntensity = .8 + Math.sin(time * 2) * .25;
    rings.forEach((r, i) => { if (!red) r.rotation.z += dt * (.15 + i * .08) * (i % 2 ? -1 : 1); });
    frags.forEach(f => { const d = f.userData; if (!red) d.a += dt * d.s; f.position.set(Math.cos(d.a) * d.r, d.y + Math.sin(time + d.a) * .1, Math.sin(d.a) * d.r); f.rotation.y += dt; });
    // particles
    const arr = pGeo.attributes.position.array, sp = red ? .3 : 1;
    for (let i = 0; i < N; i++) {
      const j = i * 3, s = seeds[i], w = red ? 0 : .02;
      arr[j] += (tgt[j] + Math.sin(time * .5 + s) * .15 - arr[j]) * .03 * sp + Math.cos(time + s * 3) * w;
      arr[j + 1] += (tgt[j + 1] + Math.cos(time * .4 + s) * .15 - arr[j + 1]) * .03 * sp + Math.sin(time * .8 + s) * w;
      arr[j + 2] += (tgt[j + 2] - arr[j + 2]) * .03 * sp;
    }
    pGeo.attributes.position.needsUpdate = true; pts.rotation.y = time * (red ? 0 : .03) + mouse.x * .15; pts.rotation.x = mouse.y * .05;
    comp.render();
  };
  requestAnimationFrame(loop);
  canvas.addEventListener('webglcontextlost', e => { e.preventDefault(); document.body.classList.add('nogl'); });
} catch (err) {
  console.warn('WebGL unavailable, using fallback', err);
  document.body.classList.add('nogl'); applyTheme();
}
