// ===== Realm of Embers — 3D stage (three.js + rigged, animated KayKit characters, CC0) =====
import * as THREE from 'three';
import { GLTFLoader } from './lib/addons/loaders/GLTFLoader.js';
import * as SkeletonUtils from './lib/addons/utils/SkeletonUtils.js';

const BODY = /Arm|Body|Head|Leg|Eyes|Jaw|Skull|Cape|Cloak|Hat|Helmet|Hood/;
// how each class / enemy is dressed, armed and animated
const RIGS = {
  warrior: { model: 'Barbarian', show: ['2H_Axe'], idle: '2H_Melee_Idle', atk: ['2H_Melee_Attack_Chop', '2H_Melee_Attack_Slice', '2H_Melee_Attack_Spin'], cast: 'Cheer' },
  paladin: { model: 'Knight', show: ['1H_Sword', 'Badge_Shield'], idle: 'Idle', atk: ['1H_Melee_Attack_Chop', '1H_Melee_Attack_Slice_Diagonal'], cast: 'Spellcast_Raise' },
  mage: { model: 'Mage', show: ['2H_Staff'], idle: 'Idle', atk: ['Spellcast_Shoot', 'Spellcast_Long'], cast: 'Spellcast_Raise' },
  cleric: { model: 'Knight', show: ['1H_Sword', 'Round_Shield'], hide: ['Knight_Helmet'], tint: 0xfff0c8, idle: 'Idle', atk: ['1H_Melee_Attack_Chop'], cast: 'Spellcast_Raise' },
  rogue: { model: 'Rogue', show: ['Knife', 'Knife_Offhand'], idle: 'Idle', atk: ['Dualwield_Melee_Attack_Stab', 'Dualwield_Melee_Attack_Slice', 'Dualwield_Melee_Attack_Chop'], cast: 'Throw' },
  ranger: { model: 'Rogue_Hooded', show: ['2H_Crossbow'], tint: 0xb8d8a0, idle: 'Idle', atk: ['2H_Ranged_Shoot'], cast: 'Use_Item' },
  // enemies
  wolf: { model: 'Rogue_Hooded', show: ['Knife'], tint: 0x8a7a5a, idle: 'Idle', atk: ['1H_Melee_Attack_Stab'] },
  spider: { model: 'Mage', show: ['1H_Wand'], tint: 0x7aa070, idle: 'Idle', atk: ['Spellcast_Shoot'] },
  goblin: { model: 'Rogue', show: ['Knife'], tint: 0x7ac060, scale: .82, idle: 'Idle', atk: ['1H_Melee_Attack_Stab'] },
  warchief: { model: 'Barbarian', show: ['2H_Axe'], tint: 0x8ad070, scale: 1.25, idle: '2H_Melee_Idle', atk: ['2H_Melee_Attack_Chop', '2H_Melee_Attack_Spin'] },
  bandit: { model: 'Rogue_Hooded', show: ['Knife', 'Knife_Offhand'], tint: 0xb08a6a, idle: 'Idle', atk: ['Dualwield_Melee_Attack_Slice'] },
  archer: { model: 'Rogue', show: ['1H_Crossbow'], tint: 0xa08060, idle: 'Idle', atk: ['1H_Ranged_Shoot'] },
  captain: { model: 'Knight', show: ['2H_Sword'], tint: 0xd07a6a, scale: 1.2, idle: '2H_Melee_Idle', atk: ['2H_Melee_Attack_Slice', '2H_Melee_Attack_Chop'] },
  skeleton: { model: 'Skeleton_Warrior', idle: 'Idle_Combat', atk: ['Unarmed_Melee_Attack_Punch_A', 'Unarmed_Melee_Attack_Kick'] },
  ghoul: { model: 'Skeleton_Minion', tint: 0xa0c0a0, idle: 'Idle_Combat', atk: ['Unarmed_Melee_Attack_Punch_B', '1H_Melee_Attack_Jump_Chop'] },
  wraith: { model: 'Skeleton_Rogue', tint: 0x9ab0ff, ghost: true, idle: 'Idle_B', atk: ['Spellcast_Shoot'] },
  lich: { model: 'Skeleton_Mage', tint: 0xc090ff, scale: 1.3, idle: 'Idle', atk: ['Spellcast_Shoot', 'Spellcast_Summon', 'Spellcast_Long'] },
  troll: { model: 'Barbarian', show: ['1H_Axe', 'Barbarian_Round_Shield'], hide: ['Barbarian_Hat'], tint: 0x8a9a80, scale: 1.55, idle: 'Idle', atk: ['1H_Melee_Attack_Chop'] },
  drake: { model: 'Knight', show: ['1H_Sword', 'Spike_Shield'], tint: 0xa04020, idle: 'Idle', atk: ['1H_Melee_Attack_Slice_Horizontal'] },
  cultist: { model: 'Mage', show: ['2H_Staff'], tint: 0x5a3030, idle: 'Idle', atk: ['Spellcast_Shoot'] },
  ashfang: { model: 'Skeleton_Warrior', tint: 0xff6040, scale: 1.9, emissive: 0x501000, idle: 'Idle_Combat', atk: ['1H_Melee_Attack_Jump_Chop', 'Unarmed_Melee_Attack_Punch_A', '2H_Melee_Attack_Spin'] }
};
const ENV = {
  town: { sky: 0x3a2030, fog: 0x6a3a2a, ground: 0x4a3622, sun: 0xffb070, amb: 0x6a5060, props: 'house' },
  woods: { sky: 0x0e1a12, fog: 0x1e3a24, ground: 0x24361e, sun: 0xc8e0a0, amb: 0x405a40, props: 'tree' },
  crossing: { sky: 0x2a2a38, fog: 0x5a4a48, ground: 0x4a4436, sun: 0xffc890, amb: 0x5a5060, props: 'rock' },
  crypt: { sky: 0x08060e, fog: 0x1a1230, ground: 0x221c2a, sun: 0x9a80ff, amb: 0x302848, props: 'pillar' },
  peaks: { sky: 0x1a0402, fog: 0x4a1006, ground: 0x2a1410, sun: 0xff6a30, amb: 0x5a2010, props: 'spire' },
  title: { sky: 0x1a0804, fog: 0x3a1a0a, ground: 0x2a1a10, sun: 0xff9a50, amb: 0x503020, props: 'tree' }
};

const loader = new GLTFLoader(), cache = {};
const MODELS = ['Barbarian', 'Knight', 'Mage', 'Rogue', 'Rogue_Hooded', 'Skeleton_Warrior', 'Skeleton_Minion', 'Skeleton_Rogue', 'Skeleton_Mage'];
const ready = Promise.all(MODELS.map(m => new Promise((res, rej) => loader.load(`models/${m}.glb`, g => { cache[m] = g; res(); }, undefined, rej))));

function makeActor(key) {
  const R = RIGS[key], g = cache[R.model];
  const obj = SkeletonUtils.clone(g.scene);
  obj.traverse(o => {
    if (!o.isMesh) return;
    o.castShadow = true; o.receiveShadow = true;
    const isAcc = !BODY.test(o.name);
    if ((isAcc && !(R.show || []).includes(o.name)) || (R.hide || []).includes(o.name)) o.visible = false;
    o.material = o.material.clone();
    if (R.tint) o.material.color = new THREE.Color(R.tint);
    if (R.emissive) { o.material.emissive = new THREE.Color(R.emissive); }
    if (R.ghost) { o.material.transparent = true; o.material.opacity = .72; o.material.emissive = new THREE.Color(0x203060); }
  });
  obj.scale.setScalar(R.scale || 1);
  const mixer = new THREE.AnimationMixer(obj), clips = {};
  g.animations.forEach(c => clips[c.name] = c);
  const actor = { obj, mixer, R, clips, cur: null };
  actor.play = (name, once = false, fade = .2) => {
    const clip = clips[name] || clips.Idle; if (!clip) return 0;
    const a = mixer.clipAction(clip); a.reset(); a.setLoop(once ? THREE.LoopOnce : THREE.LoopRepeat); a.clampWhenFinished = once;
    if (actor.cur && actor.cur !== a) actor.cur.crossFadeTo(a, fade, false); a.play(); actor.cur = a;
    return clip.duration;
  };
  mixer.addEventListener('finished', e => { if (!actor.dead && e.action === actor.cur) actor.play(R.idle); });
  actor.play(R.idle);
  return actor;
}

// ---------- main stage ----------
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(2, devicePixelRatio)); renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.15;
renderer.domElement.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block';
const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(38, 1, .1, 200), clock = new THREE.Clock();
const hemi = new THREE.HemisphereLight(0xffffff, 0x302010, 1.1); scene.add(hemi);
const sun = new THREE.DirectionalLight(0xffffff, 2.6); sun.position.set(-6, 10, 6); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048);
Object.assign(sun.shadow.camera, { left: -10, right: 10, top: 10, bottom: -10 }); scene.add(sun);
const rim = new THREE.DirectionalLight(0xffa060, 1.4); rim.position.set(5, 4, -6); scene.add(rim);
const ground = new THREE.Mesh(new THREE.CircleGeometry(60, 64), new THREE.MeshStandardMaterial({ roughness: 1 })); ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);
let props = new THREE.Group(); scene.add(props);
// drifting embers / motes
const N = 300, pg = new THREE.BufferGeometry(), pos = new Float32Array(N * 3);
for (let i = 0; i < N; i++) { pos[i * 3] = (Math.random() - .5) * 30; pos[i * 3 + 1] = Math.random() * 10; pos[i * 3 + 2] = (Math.random() - .5) * 20 - 3; }
pg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
const motes = new THREE.Points(pg, new THREE.PointsMaterial({ size: .07, color: 0xffa040, transparent: true, opacity: .85, blending: THREE.AdditiveBlending, depthWrite: false })); scene.add(motes);
const fx = []; // spell/impact flashes

let player = null, enemy = null, envName = '', mode = 'explore', host = null, orbit = 0;

function buildProps(kind, color) {
  scene.remove(props); props = new THREE.Group(); scene.add(props);
  const rand = (s => () => (s = (s * 16807) % 2147483647) / 2147483647)(kind.length * 991);
  const mat = c => new THREE.MeshStandardMaterial({ color: c, roughness: .9, flatShading: true });
  for (let i = 0; i < 46; i++) {
    const a = rand() * Math.PI * 2, r = 9 + rand() * 22, x = Math.cos(a) * r, z = Math.sin(a) * r - 6;
    if (z > 2 && Math.abs(x) < 8) continue;
    let m;
    if (kind === 'tree') { m = new THREE.Group(); const t = new THREE.Mesh(new THREE.CylinderGeometry(.15, .3, 2, 7), mat(0x3a2414)); t.position.y = 1; m.add(t);
      for (let k = 0; k < 3; k++) { const c = new THREE.Mesh(new THREE.ConeGeometry(1.5 - k * .35, 2, 8), mat(new THREE.Color(color).offsetHSL(0, 0, k * .03))); c.position.y = 2.2 + k * 1.1; m.add(c); } m.scale.setScalar(.8 + rand() * 1.2); }
    else if (kind === 'rock' || kind === 'spire') { m = new THREE.Mesh(new THREE.DodecahedronGeometry(.6 + rand() * 1.4, 0), mat(kind === 'spire' ? 0x2a1a16 : 0x5a5450)); m.scale.y = kind === 'spire' ? 2 + rand() * 3 : .6 + rand(); m.position.y = .4; }
    else if (kind === 'pillar') { m = new THREE.Mesh(new THREE.CylinderGeometry(.45, .55, 6, 10), mat(0x3a3448)); m.position.y = 3; }
    else { m = new THREE.Group(); const b = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.8, 2), mat(0x8a6a4a)); b.position.y = .9; const roof = new THREE.Mesh(new THREE.ConeGeometry(2.1, 1.4, 4), mat(0x5a2a1a)); roof.position.y = 2.5; roof.rotation.y = Math.PI / 4; m.add(b, roof);
      const w = new THREE.Mesh(new THREE.PlaneGeometry(.5, .5), new THREE.MeshBasicMaterial({ color: 0xffb050 })); w.position.set(0, 1, 1.01); m.add(w); m.rotation.y = rand() * 6; }
    m.position.x = x; m.position.z = z; m.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } }); props.add(m);
  }
  if (kind === 'pillar' || kind === 'spire' || kind === 'house') { const l = new THREE.PointLight(kind === 'pillar' ? 0x9a70ff : 0xff6020, 30, 18); l.position.set(0, 3, -4); props.add(l); }
}
function setEnv(name) {
  if (envName === name) return; envName = name; const E = ENV[name] || ENV.town;
  scene.background = new THREE.Color(E.sky); scene.fog = new THREE.Fog(E.fog, 10, 42);
  ground.material.color.set(E.ground); sun.color.set(E.sun); hemi.color.set(E.amb); hemi.groundColor.set(E.ground);
  motes.material.color.set(name === 'woods' ? 0xd0ff80 : name === 'crypt' ? 0xb090ff : 0xffa040);
  buildProps(E.props, name === 'woods' ? 0x1e4a24 : 0x2a5a2a);
}
function place() {
  if (player) { player.obj.position.set(mode === 'combat' ? -1.9 : mode === 'select' ? 0 : -.6, 0, 0); player.obj.rotation.y = mode === 'combat' ? Math.PI / 2.4 : mode === 'select' ? 0 : .35; }
  if (enemy) { enemy.obj.position.set(1.9, 0, 0); enemy.obj.rotation.y = -Math.PI / 2.4; }
}
function resize() { if (!host) return; const w = host.clientWidth || 1, h = host.clientHeight || 1; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); }
new ResizeObserver(resize).observe(document.body);

function loop() {
  requestAnimationFrame(loop);
  if (!host || !host.isConnected) return;
  const dt = Math.min(.05, clock.getDelta()), t = clock.elapsedTime;
  player && player.mixer.update(dt); enemy && enemy.mixer.update(dt);
  const p = pg.attributes.position.array; for (let i = 0; i < N; i++) { p[i * 3 + 1] += dt * .35; p[i * 3] += Math.sin(t + i) * dt * .1; if (p[i * 3 + 1] > 10) p[i * 3 + 1] = 0; } pg.attributes.position.needsUpdate = true;
  for (let i = fx.length - 1; i >= 0; i--) { const f = fx[i]; f.life -= dt; f.mesh.scale.multiplyScalar(1 + dt * 4); f.mesh.material.opacity = Math.max(0, f.life * 2); if (f.vel) f.mesh.position.addScaledVector(f.vel, dt); if (f.life <= 0) { scene.remove(f.mesh); fx.splice(i, 1); } }
  if (mode === 'select') { orbit += dt * .4; player && (player.obj.rotation.y = Math.sin(orbit) * .6); camera.position.set(0, 1.5, 4.6); camera.lookAt(0, 1.05, 0); }
  else if (mode === 'combat') { camera.position.set(Math.sin(t * .15) * .6, 2.3, 7.2); camera.lookAt(0, 1.1, 0); }
  else { camera.position.set(1.2 + Math.sin(t * .1) * .3, 1.9, 5.6); camera.lookAt(-.4, 1.1, 0); }
  renderer.render(scene, camera);
}
loop();

function burst(at, color, size = .5, vel) {
  const m = new THREE.Mesh(new THREE.SphereGeometry(size, 16, 12), new THREE.MeshBasicMaterial({ color, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
  m.position.copy(at); scene.add(m); fx.push({ mesh: m, life: .5, vel });
  const l = new THREE.PointLight(color, 40, 6); m.add(l);
}

// ---------- portraits (separate small renderer, cached data URLs) ----------
const pr = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true }); pr.setSize(240, 280); pr.outputColorSpace = THREE.SRGBColorSpace; pr.toneMapping = THREE.ACESFilmicToneMapping;
const ps = new THREE.Scene(), pc = new THREE.PerspectiveCamera(30, 240 / 280, .1, 50);
ps.add(new THREE.HemisphereLight(0xfff0e0, 0x302010, 1.4)); const pl = new THREE.DirectionalLight(0xffffff, 2.4); pl.position.set(-2, 3, 4); ps.add(pl); const pr2 = new THREE.DirectionalLight(0xffa050, 2); pr2.position.set(3, 2, -3); ps.add(pr2);
const pcache = {};
function portrait(key, full = false) {
  const id = key + full; if (pcache[id]) return pcache[id];
  const a = makeActor(key); a.mixer.update(.4); a.obj.rotation.y = .35; ps.add(a.obj);
  const s = RIGS[key].scale || 1;
  if (full) { pc.position.set(0, 1.25 * s, 5 * s); pc.lookAt(0, 1 * s, 0); } else { pc.position.set(0, 1.6 * s, 3.4 * s); pc.lookAt(0, 1.35 * s, 0); }
  pr.render(ps, pc); ps.remove(a.obj); return (pcache[id] = pr.domElement.toDataURL());
}

window.STAGE = {
  ready, portrait,
  attach(el, opts = {}) {
    host = el; el.appendChild(renderer.domElement); resize();
    mode = opts.mode || 'explore'; setEnv(opts.env || 'town');
    if (opts.cls && (!player || player.key !== opts.cls)) { if (player) scene.remove(player.obj); player = makeActor(opts.cls); player.key = opts.cls; scene.add(player.obj); }
    const ek = opts.enemy || null;
    if (!ek && enemy) { scene.remove(enemy.obj); enemy = null; }
    if (ek && (!enemy || enemy.key !== ek || enemy.dead)) { if (enemy) scene.remove(enemy.obj); enemy = makeActor(ek); enemy.key = ek; scene.add(enemy.obj); }
    if (player && player.dead) { player.dead = false; player.play(player.R.idle); }
    if (player && mode !== 'combat' && player.cur && player.cur.getClip().name !== player.R.idle && !player.cur.isRunning()) player.play(player.R.idle);
    place();
  },
  // who: 'player' | 'enemy'; what: 'attack' | 'cast' | 'hit' | 'die' | 'cheer' | 'block'
  anim(who, what, color) {
    const a = who === 'player' ? player : enemy, o = who === 'player' ? enemy : player; if (!a) return;
    if (what === 'attack') { const l = a.R.atk; a.play(l[Math.floor(Math.random() * l.length)], true, .1);
      if (o) setTimeout(() => burst(o.obj.position.clone().add(new THREE.Vector3(0, 1.1, 0)), color || 0xffd060, .35), 350); }
    else if (what === 'cast') { a.play(a.R.cast || 'Spellcast_Raise', true, .1); burst(a.obj.position.clone().add(new THREE.Vector3(0, 1.2, 0)), color || 0x80ffa0, .6); }
    else if (what === 'hit') a.play(Math.random() < .5 ? 'Hit_A' : 'Hit_B', true, .08);
    else if (what === 'block') a.play('Block_Hit', true, .08);
    else if (what === 'die') { a.dead = true; a.play(a.clips.Death_C_Skeletons ? 'Death_C_Skeletons' : 'Death_A', true, .1); }
    else if (what === 'cheer') a.play('Cheer', true);
  }
};
window.dispatchEvent(new Event('stage-ready'));
