// ===== Realm of Embers — engine =====
const $ = s => document.querySelector(s);
const app = $('#app');
const rnd = (a, b) => Math.floor(a + Math.random() * (b - a + 1));
let P = null, logs = [], combat = null, selClass = 'warrior';
const SAVE = 'roe_save_v1';

function toast(t, cls = '') { const d = document.createElement('div'); d.className = 'toast ' + cls; d.textContent = t; $('#toast-wrap').appendChild(d); setTimeout(() => d.remove(), 3300); }
function log(t, c = '') { logs.unshift(`<p class="${c}">${t}</p>`); logs = logs.slice(0, 60); const l = $('#log'); if (l) l.innerHTML = logs.join(''); }
function save() { try { localStorage.setItem(SAVE, JSON.stringify(P)); } catch (e) {} }
function load() { try { return JSON.parse(localStorage.getItem(SAVE)); } catch (e) { return null; } }
let actx; function sfx(f = 220, d = .12, t = 'square') { try { actx = actx || new AudioContext(); const o = actx.createOscillator(), g = actx.createGain(); o.type = t; o.frequency.value = f; g.gain.setValueAtTime(.06, actx.currentTime); g.gain.exponentialRampToValueAtTime(.001, actx.currentTime + d); o.connect(g).connect(actx.destination); o.start(); o.stop(actx.currentTime + d); } catch (e) {} }

// ---------- Player ----------
function stats() {
  const C = CLASSES[P.cls], s = { ...P.stats };
  const w = GEAR_TIERS[P.weapon], a = GEAR_TIERS[P.armor];
  s.atk = Math.floor(s[C.main] * 1.6 + s.str * .4 + w.atk);
  s.defT = Math.floor(s.def + a.def);
  s.crit = Math.min(.5, .05 + s.dex * .008);
  return s;
}
function newPlayer(name, cls) {
  const C = CLASSES[cls];
  return { name, cls, lvl: 1, xp: 0, gold: 50, stats: { ...C.base }, maxHp: C.base.hp, hp: C.base.hp, maxMp: C.base.mp, mp: C.base.mp,
    weapon: 0, armor: 0, inv: { potion: 3, ether: 1 }, mainIdx: 0, mainProg: 0, side: {}, sideDone: [], loc: 'town', kills: 0, won: false };
}
function gainXp(n) {
  if (P.lvl >= MAX_LEVEL) return;
  P.xp += n; log(`+${n} XP`, 'xp');
  while (P.lvl < MAX_LEVEL && P.xp >= xpForLevel(P.lvl)) {
    P.xp -= xpForLevel(P.lvl); P.lvl++;
    const g = CLASSES[P.cls].grow;
    for (const k of ['str', 'dex', 'int', 'def']) P.stats[k] += g[k];
    P.maxHp += g.hp; P.maxMp += g.mp; P.hp = P.maxHp; P.mp = P.maxMp;
    toast(`⚜ LEVEL ${P.lvl} ⚜`, 'lvl'); sfx(660, .3, 'triangle'); setTimeout(() => sfx(880, .4, 'triangle'), 150);
    log(`You reached level ${P.lvl}! Next level needs ${xpForLevel(P.lvl)} XP.`, 'q');
    CLASSES[P.cls].skills.filter(s => s.lvl === P.lvl).forEach(s => toast(`New skill: ${s.name}`));
  }
}
function addItem(id, n = 1) { P.inv[id] = (P.inv[id] || 0) + n; log(`Obtained ${ITEMS[id].name}${n > 1 ? ' x' + n : ''}`, 'loot'); checkQuests(); }

// ---------- Quests ----------
function curMain() { return MAIN_QUESTS[P.mainIdx]; }
function progress(q, prog) { return q.obj.type === 'collect' ? Math.min(P.inv[q.obj.item] || 0, q.obj.count) : Math.min(prog, q.obj.count); }
function onKill(key) {
  P.kills++;
  const m = curMain();
  if (m && (m.obj.target === key || (m.obj.targets || []).includes(key))) { P.mainProg++; }
  for (const id in P.side) { const q = SIDE_QUESTS.find(s => s.id === id); if (q.obj.target === key) P.side[id]++; }
  checkQuests();
}
function checkQuests() {
  const m = curMain();
  if (m && P.mainProg >= m.obj.count) {
    log(`Main Quest Complete: ${m.title}`, 'q'); toast(`Quest Complete: ${m.title}`);
    P.gold += m.gold; P.mainIdx++; P.mainProg = 0; gainXp(m.xp);
    if (P.mainIdx >= MAIN_QUESTS.length) { P.won = true; setTimeout(victory, 800); }
    else { toast(`New Quest: ${curMain().title}`); log(`New Main Quest: ${curMain().title}`, 'q'); }
  }
  for (const id in P.side) {
    const q = SIDE_QUESTS.find(s => s.id === id);
    if (progress(q, P.side[id]) >= q.obj.count) {
      if (q.obj.type === 'collect') P.inv[q.obj.item] -= q.obj.count;
      delete P.side[id]; P.sideDone.push(id); P.gold += q.gold;
      log(`Side Quest Complete: ${q.title} (+${q.gold} gold)`, 'q'); toast(`Side Quest Complete: ${q.title}`);
      if (q.reward) for (const k in q.reward) addItem(k, q.reward[k]);
      gainXp(q.xp);
    }
  }
  save();
}

// ---------- Screens ----------
function titleScreen() {
  const s = load();
  app.innerHTML = `<div class="title-screen">${ART.scene('title')}<div class="embers">${Array.from({ length: 40 }, () => `<i class="ember" style="left:${Math.random() * 100}%;animation-duration:${4 + Math.random() * 6}s;animation-delay:${-Math.random() * 8}s"></i>`).join('')}</div>
    <h1 class="logo">REALM OF EMBERS<small>A TALE OF ASH AND STEEL</small></h1>
    <div class="title-menu">${s ? `<button class="btn big" id="cont">Continue — ${s.name}, Lv ${s.lvl} ${CLASSES[s.cls].name}</button>` : ''}
    <button class="btn big" id="newg">New Adventure</button></div></div>`;
  if (s) $('#cont').onclick = () => { P = s; logs = []; log(`Welcome back, ${P.name}.`); renderGame(); };
  $('#newg').onclick = () => { if (!s || confirm('Start a new adventure? Your current save will be overwritten.')) createScreen(); };
}
function createScreen() {
  const C = CLASSES[selClass];
  app.innerHTML = `<div class="create"><h1 style="text-align:center;font-size:34px">Choose Your Path</h1>
    <div class="class-grid">${Object.keys(CLASSES).map(k => `<div class="frame class-card ${k === selClass ? 'sel' : ''}" data-c="${k}"><img src="${STAGE.portrait(k)}" style="width:100%;border-radius:4px;background:radial-gradient(circle at 50% 30%,#5a3a1a,#0a0604)"><div class="nm">${CLASSES[k].name}</div><div class="role">${CLASSES[k].role}</div></div>`).join('')}</div>
    <div class="frame class-detail"><div id="sel3d" style="position:relative;height:330px;border:1px solid #5a4020;border-radius:4px;overflow:hidden"></div>
      <div><h2>${C.name} <span class="muted" style="font-size:13px">— ${C.role}</span></h2><p>${C.lore}</p>
        <h3>Base Attributes</h3>${['hp', 'mp', 'str', 'dex', 'int', 'def'].map(k => `<div class="stat-row"><span>${{ hp: 'Health', mp: C.resource, str: 'Strength', dex: 'Dexterity', int: 'Intellect', def: 'Defense' }[k]}</span><span class="gold">${C.base[k]}</span></div>`).join('')}</div>
      <div><h2>Abilities</h2>${C.skills.map(s => `<div style="margin-bottom:8px"><b class="gold">${s.name}</b> <span class="tag">Lv ${s.lvl}</span> <span class="tag">${s.cost} ${C.resource}</span><div class="muted" style="font-size:13px">${s.desc}</div></div>`).join('')}
        <h3>Your Name</h3><input class="input" id="nm" maxlength="16" value="${['Aldric', 'Seren', 'Kael', 'Lyra', 'Tobin', 'Mirelle'][Object.keys(CLASSES).indexOf(selClass)]}">
        <div style="margin-top:14px;display:flex;gap:10px"><button class="btn" id="back">Back</button><button class="btn big" id="go">Begin Journey</button></div></div></div></div>`;
  STAGE.attach($('#sel3d'), { mode: 'select', env: 'title', cls: selClass });
  document.querySelectorAll('.class-card').forEach(e => e.onclick = () => { selClass = e.dataset.c; sfx(330, .08); createScreen(); });
  $('#back').onclick = titleScreen;
  $('#go').onclick = () => { const n = $('#nm').value.trim() || 'Hero'; P = newPlayer(n, selClass); logs = [];
    log(`${n} the ${CLASSES[selClass].name} arrives in Emberfall Village.`); log(`New Main Quest: ${curMain().title}`, 'q'); save(); renderGame(); };
}

function bar(cls, v, m, label) { return `<div class="bar ${cls}"><i style="width:${Math.max(0, Math.min(100, v / m * 100))}%"></i><span>${label || `${Math.max(0, Math.floor(v))} / ${m}`}</span></div>`; }

function renderGame() {
  if (combat) return renderCombat();
  const C = CLASSES[P.cls], s = stats(), R = REGIONS[P.loc], need = xpForLevel(P.lvl);
  app.innerHTML = `<div class="topbar"><span class="nm">${P.name}</span><span class="muted">Level ${P.lvl} ${C.name}</span>
      <div style="flex:1;max-width:380px">${bar('xp', P.xp, need, P.lvl >= MAX_LEVEL ? 'MAX LEVEL' : `XP ${P.xp} / ${need}`)}</div>
      <span class="gold">◉ ${P.gold} gold</span><span style="flex:1"></span>
      <button class="btn" id="b-inv">Inventory</button><button class="btn" id="b-menu">Save & Exit</button></div>
    <div class="main">
      <div class="frame panel"><div class="portrait"><img src="${STAGE.portrait(P.cls)}" style="width:100%;border-radius:4px;border:1px solid #5a4020;background:radial-gradient(circle at 50% 30%,#5a3a1a,#0a0604)"></div>
        <div style="margin:8px 0;display:flex;flex-direction:column;gap:4px">${bar('hp', P.hp, P.maxHp)}${bar('mp', P.mp, P.maxMp)}</div>
        <h3>Attributes</h3>${[['Attack', s.atk], ['Defense', s.defT], ['Strength', s.str], ['Dexterity', s.dex], ['Intellect', s.int], ['Crit Chance', Math.round(s.crit * 100) + '%']].map(([a, b]) => `<div class="stat-row"><span>${a}</span><span class="gold">${b}</span></div>`).join('')}
        <h3>Equipment</h3><div class="equip-slot"><span class="muted">Weapon</span><span class="rarity-${GEAR_TIERS[P.weapon].rarity}">${WEAPON_NAMES[P.cls][P.weapon]}</span></div>
        <div class="equip-slot"><span class="muted">Armor</span><span class="rarity-${GEAR_TIERS[P.armor].rarity}">${ARMOR_NAMES[P.cls][P.armor]}</span></div>
        <h3>Skills</h3>${C.skills.map(k => `<div style="font-size:12px;${P.lvl < k.lvl ? 'opacity:.4' : ''}"><b class="gold">${k.name}</b> ${P.lvl < k.lvl ? `(Lv ${k.lvl})` : ''}</div>`).join('')}</div>
      <div class="center"><div class="frame scene" id="scene"><div id="stage3d" class="scene-bg"></div><div class="scene-content" style="pointer-events:none">
        <h1 class="scene-title">${R.name}</h1>${R.lvl ? `<div class="muted">Recommended level ${R.lvl}</div>` : ''}<div class="scene-desc">${R.desc}</div>
        <div class="actions" id="acts" style="pointer-events:auto"></div></div></div>
        <div class="frame log" id="log">${logs.join('')}</div></div>
      <div class="frame panel"><h2>Quest Journal</h2>${questPanel()}</div></div>`;
  STAGE.attach($('#stage3d'), { mode: 'explore', env: R.scene, cls: P.cls });
  const acts = $('#acts');
  const add = (t, f, c = '', dis = false) => { const b = document.createElement('button'); b.className = 'btn ' + c; b.innerHTML = t; b.disabled = dis; b.onclick = f; acts.appendChild(b); };
  if (P.loc === 'town') {
    add('🗺 Travel', mapModal); add('🍺 Tavern & Quest Board', tavernModal); add('⚒ Blacksmith', smithModal); add('⚗ Apothecary', shopModal);
    add(`🛏 Rest at Inn (${10 + P.lvl * 3}g)`, () => { const c = 10 + P.lvl * 3; if (P.gold < c) return toast('Not enough gold'); P.gold -= c; P.hp = P.maxHp; P.mp = P.maxMp; log('You rest by the hearth and awaken refreshed.', 'heal'); save(); renderGame(); }, 'green', P.hp === P.maxHp && P.mp === P.maxMp);
  } else {
    add('⚔ Explore', explore, 'red');
    const m = curMain(); if (m && m.boss && m.region === P.loc) add(`☠ Confront ${ENEMIES[m.boss].name}`, () => startCombat(m.boss), 'red');
    add('🗺 Travel', mapModal); add('🏠 Return to Village', () => { P.loc = 'town'; save(); renderGame(); });
  }
  $('#b-inv').onclick = invModal; $('#b-menu').onclick = () => { save(); titleScreen(); };
}
function questPanel() {
  const m = curMain(); let h = '';
  if (m) h += `<div class="quest main-q"><div class="qt">${m.title}<span class="tag">MAIN</span></div><div class="qd">${m.desc}</div><div class="qp">${objText(m, P.mainProg)}</div><div class="qd">Location: ${REGIONS[m.region].name} • ${m.xp} XP</div></div>`;
  else h += `<div class="quest done"><div class="qt">The realm is saved!</div></div>`;
  for (const id in P.side) { const q = SIDE_QUESTS.find(s => s.id === id); h += `<div class="quest"><div class="qt">${q.title}<span class="tag">SIDE</span></div><div class="qd">${q.desc}</div><div class="qp">${objText(q, P.side[id])}</div><div class="qd">${REGIONS[q.region].name} • ${q.xp} XP</div></div>`; }
  if (!Object.keys(P.side).length) h += `<p class="muted" style="font-size:13px">Visit the Tavern quest board for side quests.</p>`;
  h += `<h3>Completed</h3><div class="muted" style="font-size:12px">${MAIN_QUESTS.slice(0, P.mainIdx).map(q => '✔ ' + q.title).concat(P.sideDone.map(i => '✔ ' + SIDE_QUESTS.find(s => s.id === i).title)).join('<br>') || 'None yet'}</div>`;
  return h;
}
function objText(q, prog) {
  const o = q.obj, p = progress(q, prog);
  const what = o.type === 'collect' ? ITEMS[o.item].name : o.type === 'killAny' ? 'enemies' : ENEMIES[o.target].name;
  return `${o.type === 'collect' ? 'Collect' : 'Defeat'} ${what}: <b class="gold">${p} / ${o.count}</b>`;
}

// ---------- Modals ----------
function modal(html) { const d = document.createElement('div'); d.className = 'modal-bg'; d.innerHTML = `<div class="frame modal">${html}<div style="text-align:right;margin-top:14px"><button class="btn" id="mclose">Close</button></div></div>`; document.body.appendChild(d); d.querySelector('#mclose').onclick = () => { d.remove(); renderGame(); }; d.onclick = e => { if (e.target === d) { d.remove(); renderGame(); } }; return d; }
function closeModal() { const m = document.querySelector('.modal-bg'); if (m) m.remove(); }
function mapModal() {
  const d = modal(`<h2>Map of the Realm</h2><div class="map-grid">${Object.entries(REGIONS).map(([k, r]) => { const lock = r.unlock !== undefined && P.mainIdx < r.unlock; return `<div class="frame map-node ${lock ? 'locked' : ''}" data-r="${k}"><div class="mn">${r.name}${P.loc === k ? ' <span class="tag">HERE</span>' : ''}</div><div class="ml">${lock ? '🔒 Advance the main quest to unlock' : r.lvl ? 'Level ' + r.lvl : 'Safe haven'}</div></div>`; }).join('')}</div>`);
  d.querySelectorAll('.map-node:not(.locked)').forEach(n => n.onclick = () => { P.loc = n.dataset.r; log(`You travel to ${REGIONS[P.loc].name}.`); save(); closeModal(); renderGame(); });
}
function tavernModal() {
  const avail = SIDE_QUESTS.filter(q => !P.sideDone.includes(q.id) && !(q.id in P.side));
  const d = modal(`<h2>The Gilded Tankard — Quest Board</h2>${avail.map(q => { const lock = P.lvl < q.minLvl || (REGIONS[q.region].unlock > P.mainIdx); return `<div class="item-row"><div><div class="in">${q.title} <span class="tag">${q.giver}</span></div><div class="id">${q.desc}</div><div class="id">Reward: ${q.xp} XP, ${q.gold} gold${q.reward ? ', ' + Object.entries(q.reward).map(([k, v]) => ITEMS[k].name + ' x' + v).join(', ') : ''}</div></div><button class="btn" data-q="${q.id}" ${lock ? 'disabled' : ''}>${lock ? `Lv ${q.minLvl}+` : 'Accept'}</button></div>`; }).join('') || '<p class="muted">No more work posted. Well done, adventurer.</p>'}`);
  d.querySelectorAll('[data-q]').forEach(b => b.onclick = () => { const q = SIDE_QUESTS.find(s => s.id === b.dataset.q); P.side[q.id] = 0; log(`Side Quest Accepted: ${q.title}`, 'q'); toast(`Accepted: ${q.title}`); checkQuests(); closeModal(); tavernModal(); });
}
function smithModal() {
  const row = (slot, names) => { const cur = P[slot], nx = cur + 1; if (nx >= GEAR_TIERS.length) return `<div class="item-row"><div class="in">${names[cur]}</div><span class="muted">Masterwork</span></div>`; const t = GEAR_TIERS[nx];
    return `<div class="item-row"><div><div class="in rarity-${t.rarity}">${names[nx]}</div><div class="id">${slot === 'weapon' ? '+' + t.atk + ' Attack' : '+' + t.def + ' Defense'} • Requires Lv ${t.lvl}</div></div><button class="btn" data-s="${slot}" ${P.gold < t.price || P.lvl < t.lvl ? 'disabled' : ''}>Buy ${t.price}g</button></div>`; };
  const d = modal(`<h2>Dorrin's Forge</h2><p class="muted">"Good steel keeps you breathing."</p>${row('weapon', WEAPON_NAMES[P.cls])}${row('armor', ARMOR_NAMES[P.cls])}`);
  d.querySelectorAll('[data-s]').forEach(b => b.onclick = () => { const sl = b.dataset.s, t = GEAR_TIERS[P[sl] + 1]; P.gold -= t.price; P[sl]++; sfx(500, .15); log(`Purchased ${(sl === 'weapon' ? WEAPON_NAMES : ARMOR_NAMES)[P.cls][P[sl]]}.`, 'loot'); save(); closeModal(); smithModal(); });
}
function shopModal() {
  const d = modal(`<h2>Wenna's Apothecary</h2>${['potion', 'ether', 'bigpotion'].map(k => `<div class="item-row"><div><div class="in rarity-${ITEMS[k].rarity}">${ITEMS[k].name} <span class="muted">(owned ${P.inv[k] || 0})</span></div><div class="id">${ITEMS[k].desc}</div></div><button class="btn" data-i="${k}" ${P.gold < ITEMS[k].price ? 'disabled' : ''}>Buy ${ITEMS[k].price}g</button></div>`).join('')}`);
  d.querySelectorAll('[data-i]').forEach(b => b.onclick = () => { const k = b.dataset.i; P.gold -= ITEMS[k].price; P.inv[k] = (P.inv[k] || 0) + 1; sfx(700, .08); save(); closeModal(); shopModal(); });
}
function invModal() {
  const d = modal(`<h2>Inventory</h2>${Object.entries(P.inv).filter(([, n]) => n > 0).map(([k, n]) => `<div class="item-row"><div><div class="in rarity-${ITEMS[k].rarity}">${ITEMS[k].name} x${n}</div><div class="id">${ITEMS[k].desc}</div></div>${ITEMS[k].type === 'consumable' ? `<button class="btn" data-u="${k}">Use</button>` : '<span class="tag">Quest Item</span>'}</div>`).join('') || '<p class="muted">Empty.</p>'}`);
  d.querySelectorAll('[data-u]').forEach(b => b.onclick = () => { useItem(b.dataset.u); closeModal(); invModal(); });
}
function useItem(k) {
  const it = ITEMS[k]; if (!P.inv[k]) return false; P.inv[k]--;
  if (it.heal) { const h = Math.floor(P.maxHp * it.heal); P.hp = Math.min(P.maxHp, P.hp + h); log(`You drink ${it.name} and recover ${h} HP.`, 'heal'); }
  if (it.mana) { const m = Math.floor(P.maxMp * it.mana); P.mp = Math.min(P.maxMp, P.mp + m); log(`You drink ${it.name} and recover ${m} ${CLASSES[P.cls].resource}.`, 'heal'); }
  sfx(520, .2, 'sine'); save(); return true;
}

// ---------- Exploration ----------
function explore() {
  const R = REGIONS[P.loc], r = Math.random();
  if (r < .68) return startCombat(R.enemies[rnd(0, R.enemies.length - 1)]);
  if (r < .83 && R.forage) { log('Among the roots you spot a glowing flower.'); addItem(R.forage); }
  else if (r < .93) { const g = rnd(8, 20) * (Object.keys(REGIONS).indexOf(P.loc)); P.gold += g; log(`You uncover a hidden cache: ${g} gold!`, 'loot'); if (Math.random() < .3) addItem('potion'); }
  else { P.hp = Math.min(P.maxHp, P.hp + Math.floor(P.maxHp * .3)); P.mp = Math.min(P.maxMp, P.mp + Math.floor(P.maxMp * .3)); log('You find a quiet glade and rest a while.', 'heal'); }
  save(); renderGame();
}

// ---------- Combat ----------
function startCombat(key) {
  const E = ENEMIES[key], sc = 1 + Math.max(0, P.lvl - E.lvl) * .06;
  combat = { key, e: { ...E, maxHp: Math.floor(E.hp * sc), hp: Math.floor(E.hp * sc), atk: Math.floor(E.atk * sc) }, buffs: {}, edot: null, stun: false, busy: false };
  log(`${E.boss ? '☠ ' : ''}A ${E.name} attacks!`, 'dmg'); sfx(140, .3, 'sawtooth'); renderCombat();
}
function renderCombat() {
  const c = combat, e = c.e, C = CLASSES[P.cls];
  const buffs = Object.entries(c.buffs).map(([k, v]) => `${{ def: '🛡', atk: '⚔', evade: '💨', regen: '✚' }[k]} ${v.turns}`).join(' ');
  if (!$('#scene')) { renderGame(); return; }
  $('#scene').innerHTML = `<div id="stage3d" class="scene-bg"></div><div class="combat"><div class="arena" style="align-items:start">
    <div class="fighter" id="pf" style="padding-top:4px"><div class="fn">${P.name}</div><div class="bars">${bar('hp', P.hp, P.maxHp)}${bar('mp', P.mp, P.maxMp)}</div><div class="status-icons">${buffs}</div></div>
    <div class="vs">VS</div>
    <div class="fighter" id="ef" style="padding-top:4px"><div class="fn">${e.name}${e.boss ? ' <span class="tag">BOSS</span>' : ''}</div><div class="bars">${bar('hp', e.hp, e.maxHp)}</div><div class="status-icons">${c.edot ? `☣ ${c.edot.name} ${c.edot.turns}` : ''}${c.stun ? ' ❄ Stunned' : ''}</div></div></div>
    <div class="skills" id="sk"></div></div>`;
  STAGE.attach($('#stage3d'), { mode: 'combat', env: REGIONS[P.loc].scene, cls: P.cls, enemy: c.key });
  const sk = $('#sk'), add = (h, f, cl = '', dis = false) => { const b = document.createElement('button'); b.className = 'btn ' + cl; b.innerHTML = h; b.disabled = dis || c.busy; b.onclick = f; sk.appendChild(b); };
  add('Attack<small>Basic strike</small>', () => act({ type: 'dmg', mult: 1, name: 'Attack', cost: 0 }));
  C.skills.filter(s => s.lvl <= P.lvl).forEach(s => add(`${s.name}<small>${s.cost} ${C.resource}</small>`, () => act(s), 'blue', P.mp < s.cost));
  add(`Potion (${P.inv.potion || 0})<small>Heal 40%</small>`, () => { useItem('potion'); enemyTurn(); }, 'green', !P.inv.potion);
  add(`Ether (${P.inv.ether || 0})<small>+50% ${C.resource}</small>`, () => { useItem('ether'); enemyTurn(); }, 'green', !P.inv.ether);
  if (!e.boss) add('Flee<small>60% chance</small>', () => { if (Math.random() < .6) { log('You escape!'); combat = null; save(); renderGame(); } else { log('You fail to escape!', 'dmg'); enemyTurn(); } }, 'red');
}
function floatText(el, t, col) { const f = document.createElement('div'); f.className = 'floating'; f.style.color = col; f.textContent = t; const r = el.getBoundingClientRect(), s = $('#scene').getBoundingClientRect(); f.style.left = (r.left - s.left + r.width / 2 - 20) + 'px'; f.style.top = (r.top - s.top + 40) + 'px'; $('#scene').appendChild(f); setTimeout(() => f.remove(), 1000); }
function act(s) {
  const c = combat, e = c.e, st = stats(); if (c.busy) return;
  P.mp -= s.cost || 0;
  if (s.type === 'heal' || s.type === 'buff') STAGE.anim('player', 'cast', s.type === 'heal' ? 0x80ff90 : 0x80b0ff);
  if (s.type === 'heal') { const h = Math.floor(P.maxHp * s.mult); P.hp = Math.min(P.maxHp, P.hp + h); log(`${s.name} restores ${h} HP.`, 'heal'); sfx(600, .25, 'sine'); }
  else if (s.type === 'buff') { c.buffs[s.stat] = { amt: s.amt, turns: s.turns }; log(`You use ${s.name}.`, 'heal'); sfx(400, .2, 'triangle'); }
  else {
    let total = 0;
    for (let i = 0; i < (s.hits || 1); i++) {
      let atk = st.atk * (1 + (c.buffs.atk ? c.buffs.atk.amt : 0));
      let d = atk * s.mult * (.88 + Math.random() * .24) - e.def * .6;
      if (s.holy && e.undead) d *= 2;
      if (s.execute && e.hp / e.maxHp < .3) d *= 3;
      const crit = Math.random() < st.crit + (s.critBonus || 0); if (crit) d *= 1.8;
      d = Math.max(1, Math.floor(d)); total += d; e.hp -= d;
      log(`${s.name === 'Attack' ? 'You strike' : s.name + ' hits'} for ${d}${crit ? ' — CRITICAL!' : ''}`, 'dmg');
    }
    if (s.dot) c.edot = { dmg: Math.floor(st.atk * s.dot.dmg), turns: s.dot.turns, name: s.dot.name };
    if (s.stun && Math.random() < s.stun && !e.boss) { c.stun = true; log(`${e.name} is stunned!`); }
    if (s.stun && e.boss && Math.random() < s.stun / 2) { c.stun = true; log(`${e.name} staggers!`); }
    if (s.lifesteal) { const h = Math.floor(total * s.lifesteal); P.hp = Math.min(P.maxHp, P.hp + h); log(`You are healed for ${h}.`, 'heal'); }
    STAGE.anim('player', 'attack', s.holy ? 0xfff0a0 : s.dot ? 0x90ff40 : P.cls === 'mage' ? 0xff6020 : 0xffd060); setTimeout(() => STAGE.anim('enemy', e.hp <= 0 ? 'die' : 'hit'), 380);
    sfx(180 + Math.random() * 60, .1); const ef = $('#ef'); ef.classList.add('flash'); floatText(ef, '-' + total, '#ffdd60');
  }
  c.busy = true; renderCombatBars();
  setTimeout(() => { if (e.hp <= 0) return win(); enemyTurn(); }, e.hp <= 0 ? 1800 : 1100);
}
function renderCombatBars() { const b = document.querySelectorAll('#sk .btn'); b.forEach(x => x.disabled = true); }
function enemyTurn() {
  const c = combat, e = c.e, st = stats(); c.busy = true;
  if (c.edot) { e.hp -= c.edot.dmg; log(`${e.name} suffers ${c.edot.dmg} from ${c.edot.name}.`, 'dmg'); if (--c.edot.turns <= 0) c.edot = null; if (e.hp <= 0) return setTimeout(win, 400); }
  if (c.stun) { c.stun = false; log(`${e.name} cannot act!`); }
  else if (c.buffs.evade && Math.random() < c.buffs.evade.amt && (STAGE.anim('enemy', 'attack'), true)) log(`You evade ${e.name}'s attack!`, 'heal');
  else {
    const special = e.boss && Math.random() < .25;
    const def = st.defT * (1 + (c.buffs.def ? c.buffs.def.amt : 0));
    let d = Math.max(1, Math.floor(e.atk * (special ? 1.7 : 1) * (.85 + Math.random() * .3) - def * .55));
    STAGE.anim('enemy', 'attack', e.undead ? 0xa080ff : 0xff5030); setTimeout(() => STAGE.anim('player', P.hp <= 0 ? 'die' : c.buffs.def ? 'block' : 'hit'), 380);
    P.hp -= d; log(`${e.name} ${special ? 'unleashes a devastating attack' : 'hits you'} for ${d}!`, 'dmg'); sfx(90, .2, 'sawtooth');
    const pf = $('#pf'); if (pf) { pf.classList.add('shake'); floatText(pf, '-' + d, '#ff5040'); }
  }
  if (c.buffs.regen) { const h = Math.floor(P.maxHp * c.buffs.regen.amt); P.hp = Math.min(P.maxHp, P.hp + h); log(`Sanctuary heals ${h}.`, 'heal'); }
  for (const k in c.buffs) if (--c.buffs[k].turns <= 0) delete c.buffs[k];
  P.mp = Math.min(P.maxMp, P.mp + Math.ceil(P.maxMp * .04));
  setTimeout(() => { if (P.hp <= 0) return lose(); c.busy = false; renderCombat(); }, P.hp <= 0 ? 2200 : 1100);
}
function win() {
  const c = combat, E = ENEMIES[c.key], g = rnd(...E.gold);
  log(`${E.name} is defeated! +${g} gold`, 'loot'); P.gold += g; sfx(520, .15, 'triangle');
  combat = null;
  (E.drops || []).forEach(([it, ch]) => { if (Math.random() < ch && (it !== 'ring' || !P.inv.ring)) addItem(it); });
  if (Math.random() < .12) addItem('potion');
  gainXp(E.xp); onKill(c.key); save(); if (!P.won) renderGame();
}
function lose() {
  combat = null; const lost = Math.floor(P.gold * .25); P.gold -= lost; P.hp = Math.floor(P.maxHp * .5); P.mp = Math.floor(P.maxMp * .5); P.loc = 'town';
  log(`You fall in battle... The villagers carry you home. Lost ${lost} gold.`, 'dmg'); toast('You have been defeated'); save(); renderGame();
}
function victory() {
  app.innerHTML = `<div class="title-screen">${ART.scene('title')}<h1 class="logo">VICTORY<small>ASHFANG IS SLAIN</small></h1>
    <div class="frame" style="padding:20px;max-width:560px;text-align:center;line-height:1.6">${P.name} the ${CLASSES[P.cls].name} has saved the realm. Bards will sing of this day for a thousand years.<br><br>
    Level ${P.lvl} • ${P.kills} foes vanquished • ${P.sideDone.length} side quests completed</div>
    <div class="title-menu"><button class="btn big" id="cont2">Continue Exploring</button><button class="btn big" id="tm">Title Screen</button></div></div>`;
  $('#cont2').onclick = renderGame; $('#tm').onclick = titleScreen;
}
document.addEventListener('keydown', e => { if (combat && !combat.busy && /^[1-9]$/.test(e.key)) { const b = document.querySelectorAll('#sk .btn')[+e.key - 1]; if (b && !b.disabled) b.click(); } });
app.innerHTML = '<div class="title-screen"><h1 class="logo">REALM OF EMBERS<small>FORGING THE REALM…</small></h1></div>';
function boot() { STAGE.ready.then(titleScreen).catch(e => { app.innerHTML = '<p style="padding:40px">Failed to load 3D assets: ' + e + '</p>'; }); }
if (window.STAGE) boot(); else window.addEventListener('stage-ready', boot);
