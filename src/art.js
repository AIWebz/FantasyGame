// ===== Procedural SVG art =====
const ART = (() => {
  const skin = '#d8a880';
  function defs(id, c) {
    return `<defs>
      <radialGradient id="bg${id}" cx="50%" cy="35%" r="75%"><stop offset="0" stop-color="${c}" stop-opacity=".55"/><stop offset="1" stop-color="#0a0604"/></radialGradient>
      <linearGradient id="metal${id}" x1="0" x2="1"><stop offset="0" stop-color="#eef"/><stop offset=".5" stop-color="#9aa"/><stop offset="1" stop-color="#556"/></linearGradient>
      <linearGradient id="shade${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".18"/><stop offset="1" stop-color="#000" stop-opacity=".45"/></linearGradient>
    </defs>`;
  }
  function face(x, y, s = 1, eye = '#2a1a0a') {
    return `<ellipse cx="${x}" cy="${y}" rx="${13 * s}" ry="${16 * s}" fill="${skin}"/>
      <ellipse cx="${x - 5 * s}" cy="${y - 1}" rx="1.8" ry="1.4" fill="${eye}"/><ellipse cx="${x + 5 * s}" cy="${y - 1}" rx="1.8" ry="1.4" fill="${eye}"/>
      <path d="M${x - 4} ${y + 8} q4 2 8 0" stroke="#7a4a30" stroke-width="1.2" fill="none"/>
      <path d="M${x - 8} ${y - 6} l5 -1 M${x + 8} ${y - 6} l-5 -1" stroke="#4a2a14" stroke-width="1.6"/>`;
  }
  function portrait(cls, uid = Math.random().toString(36).slice(2, 7)) {
    const C = CLASSES[cls], [a, b, c] = C.colors, id = cls + uid;
    let body = '', head = '', weapon = '', extra = '';
    switch (cls) {
      case 'warrior':
        weapon = `<rect x="94" y="22" width="5" height="88" fill="url(#metal${id})" transform="rotate(12 96 70)"/><rect x="86" y="96" width="22" height="5" fill="${c}" transform="rotate(12 96 70)"/>`;
        body = `<path d="M22 140 L28 92 Q60 74 92 92 L98 140Z" fill="${a}"/><path d="M28 92 Q60 74 92 92 L88 104 Q60 92 32 104Z" fill="${b}"/>
          <circle cx="30" cy="94" r="12" fill="url(#metal${id})"/><circle cx="90" cy="94" r="12" fill="url(#metal${id})"/>
          <ellipse cx="38" cy="120" rx="18" ry="22" fill="${b}" stroke="${c}" stroke-width="3"/><path d="M38 102 v36 M22 120 h32" stroke="${c}" stroke-width="3"/>`;
        head = face(60, 62) + `<path d="M44 58 Q44 36 60 34 Q76 36 76 58 L72 50 L48 50Z" fill="url(#metal${id})"/><rect x="58" y="44" width="4" height="22" fill="#889"/>
          <path d="M50 72 q10 12 20 0 q-2 10 -10 12 q-8 -2 -10 -12" fill="#6a3a1a"/>`;
        break;
      case 'mage':
        weapon = `<rect x="96" y="18" width="4" height="122" fill="#5a3a1a"/><circle cx="98" cy="18" r="9" fill="#ff8a30"/><circle cx="98" cy="18" r="14" fill="#ff6a10" opacity=".35"/>`;
        body = `<path d="M18 140 L34 88 Q60 78 86 88 L102 140Z" fill="${a}"/><path d="M60 82 L60 140" stroke="${c}" stroke-width="3"/>
          <path d="M34 88 Q60 100 86 88" stroke="${c}" stroke-width="2" fill="none"/><path d="M40 112 l6 -6 l6 6 l-6 6z M68 112 l6 -6 l6 6 l-6 6z" fill="${c}"/>`;
        head = face(60, 64) + `<path d="M60 82 q-8 18 0 28 q8 -10 0 -28" fill="#ddd"/><path d="M38 56 L60 4 L82 56 Q60 48 38 56Z" fill="${b}"/>
          <path d="M30 58 Q60 46 90 58 Q60 54 30 58" fill="${b}" stroke="${c}" stroke-width="1.5"/><circle cx="62" cy="30" r="3" fill="${c}"/>`;
        break;
      case 'ranger':
        weapon = `<path d="M100 16 Q122 70 100 124" stroke="#6a4a22" stroke-width="5" fill="none"/><line x1="100" y1="16" x2="100" y2="124" stroke="#ddd" stroke-width="1"/>`;
        body = `<path d="M20 140 L30 90 Q60 76 90 90 L100 140Z" fill="${b}"/><path d="M30 90 L20 140 L42 140 L48 96Z M90 90 L100 140 L78 140 L72 96Z" fill="${a}"/>
          <path d="M40 92 L80 130" stroke="#3a2a12" stroke-width="5"/><rect x="18" y="74" width="10" height="34" fill="#5a3a1a" transform="rotate(-18 23 90)"/>
          <path d="M16 70 l4 -10 M22 70 l2 -12 M28 72 l0 -12" stroke="${c}" stroke-width="2"/>`;
        head = face(60, 62) + `<path d="M36 70 Q34 34 60 30 Q86 34 84 70 L78 52 Q60 40 42 52Z" fill="${a}"/><path d="M48 50 q12 -6 24 0" stroke="#3a2a12" stroke-width="2" fill="none"/>`;
        break;
      case 'rogue':
        weapon = `<path d="M96 70 l14 -40 l3 2 l-12 40z" fill="url(#metal${id})"/><path d="M24 70 l-14 -40 l-3 2 l12 40z" fill="url(#metal${id})"/>
          <rect x="94" y="68" width="10" height="4" fill="${b}"/><rect x="16" y="68" width="10" height="4" fill="${b}"/>`;
        body = `<path d="M16 140 L30 86 Q60 74 90 86 L104 140Z" fill="${a}"/><path d="M30 86 L44 140 M90 86 L76 140" stroke="${b}" stroke-width="4"/>
          <path d="M34 110 h52" stroke="#111" stroke-width="6"/><rect x="56" y="106" width="8" height="8" fill="${c}"/>`;
        head = face(60, 62) + `<path d="M34 74 Q30 26 60 24 Q90 26 86 74 L80 56 Q60 40 40 56Z" fill="#1a1a20"/><path d="M46 68 h28 v12 q-14 6 -28 0z" fill="#1a1a20"/>`;
        extra = `<ellipse cx="55" cy="61" rx="2" ry="1.4" fill="#e0e060"/><ellipse cx="65" cy="61" rx="2" ry="1.4" fill="#e0e060"/>`;
        break;
      case 'cleric':
        weapon = `<rect x="96" y="40" width="5" height="90" fill="#7a5a2a"/><circle cx="98" cy="40" r="11" fill="url(#metal${id})"/><path d="M98 26 v28 M84 40 h28" stroke="${b}" stroke-width="2"/>`;
        body = `<path d="M20 140 L32 88 Q60 76 88 88 L100 140Z" fill="${a}"/><path d="M52 84 h16 v56 h-16z" fill="${b}"/>
          <path d="M60 96 v26 M50 104 h20" stroke="#fff" stroke-width="4"/><path d="M32 88 Q60 100 88 88" stroke="${b}" stroke-width="3" fill="none"/>`;
        head = `<circle cx="60" cy="58" r="30" fill="${c}" opacity=".25"/>` + face(60, 62) + `<path d="M40 66 Q38 38 60 36 Q82 38 80 66 L76 52 Q60 46 44 52Z" fill="${a}" stroke="${b}" stroke-width="1.5"/>`;
        break;
      case 'paladin':
        weapon = `<rect x="98" y="36" width="5" height="96" fill="#6a4a22"/><rect x="88" y="26" width="26" height="18" rx="2" fill="url(#metal${id})" stroke="${c}"/>`;
        body = `<path d="M22 140 L28 90 Q60 74 92 90 L98 140Z" fill="url(#metal${id})"/><path d="M40 92 h40 v48 h-40z" fill="${b}"/>
          <path d="M60 98 v30 M48 108 h24" stroke="${c}" stroke-width="4"/><circle cx="30" cy="92" r="12" fill="url(#metal${id})" stroke="${c}"/><circle cx="90" cy="92" r="12" fill="url(#metal${id})" stroke="${c}"/>`;
        head = face(60, 64) + `<path d="M42 64 Q40 34 60 32 Q80 34 78 64 L74 58 L74 48 L46 48 L46 58Z" fill="url(#metal${id})" stroke="${c}"/>
          <path d="M60 32 q2 -14 14 -16 q-6 8 -12 18" fill="${c}"/>`;
        break;
    }
    return `<svg viewBox="0 0 120 140" xmlns="http://www.w3.org/2000/svg">${defs(id, b)}<rect width="120" height="140" fill="url(#bg${id})"/>
      ${body}${weapon}${head}${extra}<rect width="120" height="140" fill="url(#shade${id})" opacity=".5"/></svg>`;
  }

  function enemy(key) {
    const E = ENEMIES[key], c = E.color, id = key + Math.random().toString(36).slice(2, 6);
    const glow = E.undead ? '#80ffb0' : E.boss ? '#ff4020' : '#ffcc40';
    let g = '';
    switch (E.kind) {
      case 'beast':
        g = `<path d="M30 120 Q24 80 50 72 L110 70 Q150 70 158 96 L164 122 L150 122 L146 100 L120 104 L118 124 L104 124 L100 102 L62 100 L56 124 L42 124Z" fill="${c}"/>
          <path d="M150 74 L176 60 L182 70 L196 78 L188 92 L164 96Z" fill="${c}"/><path d="M168 62 L172 46 L180 62Z" fill="${c}"/><circle cx="180" cy="72" r="2.5" fill="${glow}"/>
          <path d="M30 86 Q10 70 14 56 Q24 76 36 80" fill="${c}"/><path d="M186 88 l4 6 l3 -5" fill="#fff"/>`;
        break;
      case 'spider':
        g = [0, 1, 2, 3].map(i => `<path d="M100 90 Q${50 - i * 6} ${50 + i * 12} ${30 - i * 4} ${110 + i * 8}" stroke="${c}" stroke-width="5" fill="none"/><path d="M100 90 Q${150 + i * 6} ${50 + i * 12} ${170 + i * 4} ${110 + i * 8}" stroke="${c}" stroke-width="5" fill="none"/>`).join('') +
          `<ellipse cx="100" cy="76" rx="38" ry="30" fill="${c}"/><path d="M76 68 l48 0 M80 80 l40 0" stroke="#a02020" stroke-width="3"/>
          <circle cx="100" cy="104" r="18" fill="${c}"/>${[-8, -3, 3, 8].map(x => `<circle cx="${100 + x}" cy="102" r="2.2" fill="#ff3030"/>`).join('')}`;
        break;
      case 'humanoid': case 'skeleton': case 'troll': {
        const sk = E.kind === 'skeleton' ? '#e8e0c8' : c;
        const big = E.kind === 'troll';
        const w = { sword: `<rect x="138" y="30" width="6" height="80" fill="#ccd" transform="rotate(15 140 100)"/><rect x="128" y="104" width="26" height="5" fill="#a80" transform="rotate(15 140 100)"/>`,
          axe: `<rect x="140" y="30" width="6" height="96" fill="#5a3a1a"/><path d="M146 34 Q176 46 146 74Z" fill="#aab"/>`,
          dagger: `<path d="M140 90 l6 -30 l4 30z" fill="#ccd"/>`,
          bow: `<path d="M144 40 Q170 90 144 140" stroke="#5a3a1a" stroke-width="5" fill="none"/>`,
          staff: `<rect x="142" y="26" width="5" height="120" fill="#2a1a10"/><circle cx="144" cy="26" r="9" fill="#ff4020"/>` }[E.weapon] || `<path d="M140 100 l10 -20 l6 4 l-10 22z" fill="${sk}"/>`;
        const torso = E.kind === 'skeleton'
          ? `<rect x="96" y="66" width="8" height="60" fill="${sk}"/>${[0, 1, 2, 3].map(i => `<path d="M78 ${74 + i * 10} Q100 ${68 + i * 10} 122 ${74 + i * 10}" stroke="${sk}" stroke-width="4" fill="none"/>`).join('')}`
          : `<path d="M72 130 L74 72 Q100 ${big ? 54 : 62} 126 72 L128 130Z" fill="${E.hood ? '#3a2a1a' : c}"/><path d="M74 72 Q100 ${big ? 54 : 62} 126 72 L124 86 Q100 78 76 86Z" fill="#000" opacity=".25"/>`;
        g = `${torso}<path d="M76 74 L56 112 L64 116 L82 84" fill="${sk}"/><path d="M124 74 L144 104 L136 110 L120 84" fill="${sk}"/>
          <path d="M80 130 L78 176 L92 176 L98 130 M102 130 L108 176 L122 176 L120 130" fill="${E.kind === 'skeleton' ? sk : '#2a1a10'}"/>
          <ellipse cx="100" cy="${big ? 48 : 50}" rx="${big ? 22 : 16}" ry="${big ? 20 : 18}" fill="${sk}"/>
          ${E.hood ? `<path d="M80 60 Q78 26 100 24 Q122 26 120 60 L114 46 Q100 38 86 46Z" fill="#2a1a10"/>` : ''}
          ${key === 'goblin' || key === 'warchief' ? `<path d="M84 46 L64 36 L86 54Z M116 46 L136 36 L114 54Z" fill="${sk}"/>` : ''}
          ${E.kind === 'skeleton' ? `<circle cx="93" cy="48" r="5" fill="#000"/><circle cx="107" cy="48" r="5" fill="#000"/><path d="M92 60 h16" stroke="#000" stroke-width="2" stroke-dasharray="2 2"/>` : ''}
          <circle cx="93" cy="48" r="2.5" fill="${glow}"/><circle cx="107" cy="48" r="2.5" fill="${glow}"/>
          ${big ? `<path d="M90 62 l3 6 l3 -6 M104 62 l3 6 l3 -6" fill="#fff"/>` : ''}
          ${key === 'captain' ? `<path d="M78 36 Q100 18 122 36 L126 40 L74 40Z" fill="#2a1a10"/><path d="M100 22 q10 -10 20 -6" stroke="#a02020" stroke-width="3" fill="none"/>` : ''}
          ${key === 'warchief' ? `<path d="M84 34 l6 -16 l6 12 l4 -16 l4 16 l6 -12 l6 16z" fill="#aab"/>` : ''}${w}`;
        break;
      }
      case 'wraith':
        g = `<path d="M60 180 Q70 150 66 110 Q64 60 100 40 Q136 60 134 110 Q130 150 140 180 Q126 166 118 182 Q108 164 100 182 Q90 164 82 182 Q74 166 60 180Z" fill="${c}" opacity=".85"/>
          <path d="M66 100 L36 130 L44 136 L72 112 M134 100 L164 130 L156 136 L128 112" fill="${c}" opacity=".8"/>
          <ellipse cx="100" cy="64" rx="16" ry="20" fill="#0a0a1a"/><circle cx="93" cy="62" r="3.5" fill="${glow}"/><circle cx="107" cy="62" r="3.5" fill="${glow}"/>`;
        break;
      case 'lich':
        g = `<circle cx="100" cy="60" r="60" fill="#a040ff" opacity=".12"/><path d="M60 180 L74 76 Q100 62 126 76 L140 180Z" fill="${c}"/><path d="M74 76 Q100 92 126 76" stroke="#c0a040" stroke-width="3" fill="none"/>
          <path d="M100 80 v100" stroke="#c0a040" stroke-width="3"/><rect x="146" y="20" width="5" height="160" fill="#2a1a10"/><circle cx="148" cy="20" r="11" fill="#a040ff"/><circle cx="148" cy="20" r="18" fill="#a040ff" opacity=".3"/>
          <ellipse cx="100" cy="52" rx="16" ry="19" fill="#d8d0b8"/><circle cx="93" cy="50" r="5" fill="#000"/><circle cx="107" cy="50" r="5" fill="#000"/><circle cx="93" cy="50" r="2.5" fill="#c080ff"/><circle cx="107" cy="50" r="2.5" fill="#c080ff"/>
          <path d="M76 56 Q74 20 100 16 Q126 20 124 56 L116 40 Q100 30 84 40Z" fill="${c}"/><path d="M84 22 l4 -14 l6 10 l6 -14 l6 14 l6 -10 l4 14" fill="#c0a040"/>
          <path d="M74 90 L50 120 L56 124 L80 100" fill="${c}"/><path d="M126 90 L146 110 L140 116 L122 100" fill="${c}"/>`;
        break;
      case 'dragon':
        g = `<path d="M100 90 L20 30 L40 70 L10 64 L44 100 L24 108 L80 112Z" fill="${c}" opacity=".9"/><path d="M100 90 L180 30 L160 70 L190 64 L156 100 L176 108 L120 112Z" fill="${c}" opacity=".9"/>
          <path d="M20 30 L80 112 M180 30 L120 112 M40 70 L84 108 M160 70 L116 108" stroke="#000" stroke-opacity=".35" stroke-width="2"/>
          <ellipse cx="100" cy="124" rx="34" ry="40" fill="${c}"/><path d="M84 110 Q100 150 116 110 L112 156 Q100 162 88 156Z" fill="#e0a040" opacity=".6"/>
          <path d="M86 92 Q84 50 100 40 Q116 50 114 92Z" fill="${c}"/><path d="M84 46 Q100 22 116 46 L120 62 Q100 72 80 62Z" fill="${c}"/>
          <path d="M86 34 L78 12 L92 32 M114 34 L122 12 L108 32" fill="#e0c080"/><circle cx="92" cy="48" r="3" fill="#ffdd30"/><circle cx="108" cy="48" r="3" fill="#ffdd30"/>
          <path d="M90 64 Q100 74 110 64" fill="#ff6a10"/><path d="M80 160 L68 184 L84 180 M120 160 L132 184 L116 180" fill="${c}"/>`;
        break;
    }
    const s = E.size || 1;
    return `<svg viewBox="0 0 200 190" xmlns="http://www.w3.org/2000/svg"><g transform="translate(${100 - 100 * s} ${190 - 190 * s}) scale(${s})">
      <ellipse cx="100" cy="182" rx="60" ry="7" fill="#000" opacity=".5"/>${g}</g></svg>`;
  }

  function scene(type) {
    const S = {
      town: ['#f0a050', '#7a3a2a', '#2a1a2a'], woods: ['#3a5a3a', '#1a2a1a', '#0a120a'],
      crossing: ['#c08050', '#5a4a3a', '#1a1a20'], crypt: ['#3a2a5a', '#1a1428', '#050308'],
      peaks: ['#ff4010', '#5a1a0a', '#120404'], title: ['#ff7a30', '#4a1a10', '#0a0604']
    }[type] || ['#555', '#222', '#000'];
    const r = (n => () => (n = (n * 9301 + 49297) % 233280) / 233280)(type.length * 77);
    let layers = '';
    const mtn = (y, col, amp, op = 1) => { let d = `M0 600 L0 ${y}`; for (let x = 0; x <= 1200; x += 60) d += ` L${x} ${y - r() * amp}`; return `<path d="${d} L1200 600Z" fill="${col}" opacity="${op}"/>`; };
    if (type === 'woods') {
      layers += mtn(300, '#1a2a1a', 60, .7);
      for (let i = 0; i < 26; i++) { const x = r() * 1200, h = 180 + r() * 220, y = 600 - r() * 120; layers += `<rect x="${x - 6}" y="${y - h * .3}" width="12" height="${h * .3}" fill="#1a120a"/><path d="M${x} ${y - h} L${x - 50} ${y - h * .25} L${x + 50} ${y - h * .25}Z" fill="${i % 2 ? '#0e1a0e' : '#142414'}"/>`; }
      for (let i = 0; i < 30; i++) layers += `<circle cx="${r() * 1200}" cy="${200 + r() * 360}" r="${1 + r() * 2}" fill="#d0ff80" opacity=".7"/>`;
    } else if (type === 'peaks' || type === 'title') {
      layers += mtn(260, '#2a0a06', 140, .8) + mtn(380, '#180604', 120);
      layers += `<path d="M560 380 L600 200 L640 380Z" fill="#ff5010" opacity=".5"/><circle cx="900" cy="120" r="50" fill="#ffb060" opacity=".6"/>`;
      for (let i = 0; i < 40; i++) layers += `<circle cx="${r() * 1200}" cy="${r() * 600}" r="${1 + r() * 2}" fill="#ffa040" opacity="${.3 + r() * .6}"/>`;
    } else if (type === 'crypt') {
      for (let i = 0; i < 7; i++) { const x = 80 + i * 170; layers += `<rect x="${x}" y="120" width="44" height="480" fill="#120c1c"/><rect x="${x - 8}" y="110" width="60" height="18" fill="#1a1428"/>`; }
      layers += `<path d="M0 600 L0 120 Q600 -60 1200 120 L1200 600Z" fill="none" stroke="#1a1428" stroke-width="40"/><ellipse cx="600" cy="560" rx="700" ry="60" fill="#2a1a4a" opacity=".5"/>`;
      for (let i = 0; i < 6; i++) layers += `<circle cx="${100 + i * 200}" cy="${200 + r() * 100}" r="6" fill="#a080ff"/><circle cx="${100 + i * 200}" cy="${200 + r() * 100}" r="30" fill="#a080ff" opacity=".12"/>`;
    } else if (type === 'crossing') {
      layers += mtn(320, '#3a3040', 80, .7) + `<rect x="0" y="430" width="1200" height="170" fill="#1a2a3a"/>`;
      layers += `<path d="M200 430 Q600 300 1000 430 L1000 460 L940 460 Q600 350 260 460 L200 460Z" fill="#4a4a50"/>`;
      for (let i = 0; i < 20; i++) layers += `<path d="M${r() * 1200} ${450 + r() * 140} h${20 + r() * 50}" stroke="#5a7a9a" stroke-width="2" opacity=".6"/>`;
    } else if (type === 'town') {
      layers += mtn(320, '#3a2030', 70, .7);
      for (let i = 0; i < 9; i++) { const x = 40 + i * 135, w = 90 + r() * 30, h = 70 + r() * 50, y = 470; layers += `<rect x="${x}" y="${y - h}" width="${w}" height="${h}" fill="#2a1a14"/><path d="M${x - 10} ${y - h} L${x + w / 2} ${y - h - 50} L${x + w + 10} ${y - h}Z" fill="#3a2418"/><rect x="${x + w / 2 - 10}" y="${y - h + 20}" width="16" height="16" fill="#ffb050" opacity=".85"/>`; }
      layers += `<rect x="0" y="470" width="1200" height="130" fill="#1e140c"/>`;
    }
    return `<svg class="scene-bg" viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="sky${type}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${S[2]}"/><stop offset=".6" stop-color="${S[1]}"/><stop offset="1" stop-color="${S[0]}"/></linearGradient>
      <radialGradient id="vig${type}" cx="50%" cy="50%" r="70%"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".8"/></radialGradient></defs>
      <rect width="1200" height="600" fill="url(#sky${type})"/>${layers}<rect width="1200" height="600" fill="url(#vig${type})"/></svg>`;
  }
  return { portrait, enemy, scene };
})();
