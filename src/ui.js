(function () {
'use strict';
const F = window.FA;
const KEY = 'frontiera_arcana_v01';
const $ = sel => document.querySelector(sel);
const fmt = n => Math.round(n).toLocaleString('it-IT');
const cfmt = n => n >= 100000 ? new Intl.NumberFormat('it-IT', { notation: 'compact', maximumFractionDigits: 1 }).format(n) : fmt(n);
const esc = t => String(t).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// ---------- sprite pixel art ----------
const SPR = {
  hero_arc: [{ R: '#7ED36F', S: '#C9D3E6', B: '#3F8F4A', K: '#1B1F3B', C: '#F2C14E', W: '#C9935A', G: '#F2C14E' }, ['....RRR.....', '...SSSSS....', '..SSSSSSS...', '..SKKKKKS...', '..SKCCCKS...', '..SSSSSSS...', '.BBBBGBBBB.W', 'BBBSBBBSBBWW', 'BB.BBBBB.BW.', 'SS.BBGBB.S..', '...BBBBB....', '...BB.BB....', '..KKK.KKK...']],
  hero_mag: [{ R: '#B07CF0', S: '#C9D3E6', B: '#6A3FB8', K: '#1B1F3B', C: '#F49AC1', W: '#7FE3FF', G: '#F2C14E' }, ['....RRR.....', '...SSSSS....', '..SSSSSSS...', '..SKKKKKS...', '..SKCCCKS...', '..SSSSSSS...', '.BBBBGBBBB.W', 'BBBSBBBSBBWW', 'BB.BBBBB.BW.', 'SS.BBGBB.S..', '...BBBBB....', '...BB.BB....', '..KKK.KKK...']],
  hero: [{ R: '#E2504A', S: '#C9D3E6', B: '#3E6FD8', K: '#1B1F3B', C: '#5BD8E6', W: '#F4F7FF', G: '#F2C14E' }, ['....RRR.....', '...SSSSS....', '..SSSSSSS...', '..SKKKKKS...', '..SKCCCKS...', '..SSSSSSS...', '.BBBBGBBBB.W', 'BBBSBBBSBBWW', 'BB.BBBBB.BW.', 'SS.BBGBB.S..', '...BBBBB....', '...BB.BB....', '..KKK.KKK...']],
  glimmo: [{ Y: '#FFE27A', C: '#7FE3F0', D: '#3FB3C8', K: '#1B1F3B', W: '#FFFFFF', P: '#F49AC1' }, ['.....Y......', '....YCY.....', '...CCCCC....', '..CCCCCCCC..', '.CCWKCCWKCC.', '.CCKKCCKKCC.', 'CCCCCCCCCCCC', 'CCPCCPPCCPCC', 'CCCCCCCCCCCC', '.DDDDDDDDDD.']],
  cometuga: [{ O: '#F28B3C', Y: '#FFE27A', G: '#5A9E6F', H: '#3F7A52', L: '#A8D88F', K: '#1B1F3B' }, ['YO............', 'YYOO..........', '.YOOO.........', '...OOGGGGG....', '....GHGGHGG...', '...GGGGGGGGG..', '..GHGGHGGHGGLL', '..GGGGGGGGGLKL', '...LL....LLLL.', '...LL....LL...']],
  sporello: [{ R: '#6E7BE8', W: '#E8ECFF', S: '#F1E3C8', K: '#1B1F3B', P: '#F49AC1' }, ['...RRRRRR...', '..RRWRRRWR..', '.RRRRRRRRRR.', 'RRWRRRRRRWRR', 'RRRRRRRRRRRR', '....SSSS....', '...SKSSKS...', '...SSSSSS...', '...SSPPSS...', '....SSSS....', '...SS..SS...']],
  bzzt: [{ G: '#7BC86C', M: '#9AA3B5', T: '#8A5A3B', R: '#C2553A', P: '#3A1F2B', K: '#1B1F3B', Y: '#FFE27A' }, ['..........MMM', 'G........GMMM', 'GG.GGGGG.GG.T', '.GGGGGGGGG..T', '..GYKGGYKG..T', '..GGGGGGGG..T', '...GPPPPG..T.', '..RRRRRRRRT..', '.GRRRRRRRRG..', '.G.RRRRRR....', '...RR..RR....', '..KKK..KKK...']],
  astrillo: [{ B: '#2F8F8A', G: '#9FF2D6', Y: '#FFE27A', K: '#1B1F3B' }, ['..K......K..', '...K....K...', '...BBBBBB...', '..BBYBBYBB..', '.BBBBBBBBBB.', 'BBGBBBBBBGBB', 'BBBBGBBGBBBB', '.BBBBBBBBBB.', '.K.K....K.K.']],
  nebulina: [{ P: '#A06BE6', L: '#D8C2FF', W: '#FFFFFF', Y: '#FFE27A', K: '#1B1F3B', S: '#C9A4FF' }, ['.P........P...', '.PP......PP...', '.PLPPPPPPLP...', '.PPPPPPPPPP...', '.PPYKPPYKPP...', '.PPPPPKPPPP...', '..PPPPPPPP..S.', '..PPLPPLPP.S..', '..PPPPPPPPS...', '..PP.PP.PP....']],
  revuoto: [{ Y: '#F2C14E', V: '#5A3A8C', U: '#3B2463', R: '#FF5A6E', K: '#140F26' }, ['...Y.Y..Y.Y...', '...YYYYYYYY...', '...VVVVVVVV...', '..VVVVVVVVVV..', '..VRRVVVVRRV..', '..VVVVVVVVVV..', '...VVKKKKVV...', '..UVVVVVVVVU..', '.UUVVVVVVVVUU.', 'UU.VVVVVVVV.UU', '...VVVVVVVV...', '...VV....VV...', '..KKK....KKK..']],
  scheggia: [{ C: '#7FD6F0', W: '#E6FBFF', K: '#1B1F3B', P: '#F49AC1', T: '#C7F3FF' }, ['.C.........C.', '.CC.......CC.', '.CWCCCCCCCWC.', '.CCCCCCCCCCC.', '.CCKCCCCCKCC.', '..CCCCPCCCC..', '...CCCCCCC.TT', '..CCCCCCCCTT.', '..CC.CC.CC...', '..KK.KK.KK...']],
  geodino: [{ G: '#8A7A6A', P: '#C08CFF', W: '#FFFFFF', K: '#1B1F3B' }, ['....GGGGG.....', '...GPGPGPG....', '..GGGGGGGGG...', '.GGKGGGGGGGG..', '.GGGGGGGGGGGG.', '..GGWWGGGGGGGG', '...GGGGGGGGGG.', '...GG.GG.GGGG.', '...GG.GG..GG..', '..KKK.KKK.....']],
  lumispettro: [{ Y: '#9FF2D6', W: '#E9FFF7', K: '#1B1F3B', P: '#7FE3F0' }, ['....YYYY....', '..YYWWWWYY..', '.YWWWWWWWWY.', '.YWKWWWWKWY.', '.YWWWWWWWWY.', '.YWWWPPWWWY.', '.YWWWWWWWWY.', '.YWWWWWWWWY.', '.YWYWWYWWYW.', '..Y..Y..Y...']],
  gemmerla: [{ B: '#3A3F7A', W: '#FFFFFF', K: '#1B1F3B', O: '#F2C14E', G: '#5BD8E6' }, ['....BBBB....', '...BBBBBB...', '..BBWKBBBB..', '.OOBBBBBBBG.', '...BBBBBBGGG', '...GBBBBGG..', '....BBBB....', '....O..O....', '...OO..OO...']],
  quarzillo: [{ Q: '#D7C8F5', W: '#B07CF0', K: '#1B1F3B' }, ['...QQQQQQ...', '..QQQQQQQQ..', '..QKQQQQKQ..', '..QQQQQQQQ..', '.QQQQWWQQQQ.', 'QQ.QQQQQQ.QQ', 'QQ.QQQQQQ.QQ', '...QQQQQQ...', '...QQ..QQ...', '..QQQ..QQQ..']],
  prismella: [{ R: '#FF8A96', B: '#7FB8FF', Y: '#FFE9C9', K: '#1B1F3B', P: '#F49AC1', G: '#C9A4FF' }, ['.R........B.', '.RR..YY..BB.', '.RRRYYYYBBB.', '..RYKYYKYB..', '...YYYYYY...', '...YPYYPY...', '....YYYY....', '...GGGGGG...', '..GGGGGGGG..', '....G..G....']],
  reginaquarzo: [{ W: '#E6FBFF', Q: '#F1E3FF', K: '#1B1F3B', P: '#FF8A96', C: '#7FD6F0', A: '#F2C14E' }, ['..W.W.W.W.W...', '..WWWWWWWWW...', '...QQQQQQQ....', '..QQQQQQQQQ...', '..QKQQQQQKQ...', '..QQQQQQQQQ...', '...QQPPPQQ...A', '..CCCCCCCCC.A.', '.CCCCCCCCCCCA.', 'CC.CCCCCCC.AA.', '...CCCCCCC.A..', '...CC...CC....', '..KKK...KKK...']],
};
const sprCache = {};
function sprite(key, p, opts) {
  opts = opts || {};
  const ck = key + p;
  if (!sprCache[ck]) {
    const [pal, rows] = SPR[key]; const parts = [];
    rows.forEach((r, y) => { for (let x = 0; x < r.length; x++) if (r[x] !== '.') parts.push(`${(x + 1) * p}px ${(y + 1) * p}px 0 0 ${pal[r[x]]}`); });
    sprCache[ck] = { bs: parts.join(','), w: Math.max(...rows.map(r => r.length)) * p, h: rows.length * p };
  }
  const c = sprCache[ck];
  return `<div class="spr${opts.sil ? ' sil' : ''}" style="width:${c.w}px;height:${c.h}px${opts.flip ? ';transform:scaleX(-1)' : ''}" aria-hidden="true"><i style="width:${p}px;height:${p}px;left:-${p}px;top:-${p}px;box-shadow:${c.bs}"></i></div>`;
}

// ---------- icone ----------
const IC = {
  coin: '<circle cx="12" cy="12" r="8"/><path d="M12 8v8M9.5 10h4a1.5 1.5 0 0 1 0 3h-3a1.5 1.5 0 0 0 0 3h4"/>',
  dust: '<path d="M12 3l2.2 6.8L21 12l-6.8 2.2L12 21l-2.2-6.8L3 12l6.8-2.2z"/>',
  team: '<circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M15 14.5c3 0 6 2 6 5.5"/>',
  bag: '<path d="M6 8h12l1 12H5zM9 8V6a3 3 0 0 1 6 0v2"/>',
  book: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19V5M9 7h6"/>',
  stars: '<circle cx="5" cy="17" r="1.6"/><circle cx="12" cy="6" r="1.6"/><circle cx="19" cy="14" r="1.6"/><path d="M6.3 16l4.5-8.6M13.4 6.8l4.6 6.2"/>',
  more: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  up: '<path d="M6 15l6-6 6 6"/>', down: '<path d="M6 9l6 6 6-6"/>',
  lock: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  unlock: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 7.5-2"/>',
  check: '<path d="M5 12l5 5 9-10"/>',
  map: '<path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2zM9 4v14M15 6v14"/>',
  gem: '<path d="M6 4h12l3 5-9 11L3 9z"/><path d="M3 9h18M9 4l3 16M15 4l-3 16"/>',
  rune: '<rect x="6" y="3" width="12" height="18" rx="3"/><path d="M10 8l4 4-4 4"/>',
};
const icon = (n, c, s, label) => `<svg width="${s || 20}" height="${s || 20}" viewBox="0 0 24 24" fill="none" stroke="${c || 'currentColor'}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" ${label ? `role="img" aria-label="${label}"` : 'aria-hidden="true"'}>${IC[n]}</svg>`;

// ---------- icone degli oggetti ----------
const ITEM_IC = {
  spada: '<path d="M20 4L9 15l-1-1L19 3z" fill="currentColor"/><path d="M6 13l5 5M4 20l3-3"/>',
  mazza: '<circle cx="16" cy="8" r="4" fill="currentColor"/><path d="M13 11L4 20M16 2v2M22 8h-2M20 4l-1 1"/>',
  arco: '<path d="M6 3c8 3 12 7 15 15"/><path d="M6 3l15 15" stroke-dasharray="2 2"/><path d="M3 21l9-9"/>',
  bastone: '<path d="M6 21L17 8"/><circle cx="18" cy="6" r="3" fill="currentColor"/>',
  scudo: '<path d="M12 3l8 3v5c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6z" fill="currentColor" fill-opacity=".35"/><path d="M12 7v10"/>',
  pugnale: '<path d="M15 4l3 3-8 8-3-3z" fill="currentColor"/><path d="M5 13l6 6M4 20l2-2"/>',
  faretra: '<rect x="8" y="8" width="8" height="13" rx="2" fill="currentColor" fill-opacity=".35"/><path d="M10 8V3M14 8V3M12 8V2"/>',
  tomo: '<path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z" fill="currentColor" fill-opacity=".35"/><path d="M12 9l2 2-2 2-2-2z"/>',
  elmo: '<path d="M4 15a8 8 0 0 1 16 0v3H4z" fill="currentColor" fill-opacity=".35"/><path d="M4 15h16M12 7v8"/>',
  corazza: '<path d="M7 4l5 2 5-2 3 4-3 2v10H7V10L4 8z" fill="currentColor" fill-opacity=".35"/><path d="M12 6v14"/>',
  gambe: '<path d="M7 3h10l-1 18h-3l-1-11-1 11H8z" fill="currentColor" fill-opacity=".35"/>',
  stivali: '<path d="M8 3h5v11l6 3v4H7z" fill="currentColor" fill-opacity=".35"/><path d="M7 17h12"/>',
  guanti: '<path d="M8 21v-9L6 8V5h2v4V3h2v6V3h2v6V4h2v8l2-2 1 1-3 5v5z" fill="currentColor" fill-opacity=".35"/>',
  collana: '<path d="M5 4c0 7 3 10 7 10s7-3 7-10"/><path d="M12 14l3 3-3 4-3-4z" fill="currentColor"/>',
  orecchini: '<circle cx="8" cy="5" r="1.5"/><circle cx="16" cy="5" r="1.5"/><path d="M8 7v4M16 7v4"/><path d="M8 11l2 4-2 3-2-3zM16 11l2 4-2 3-2-3z" fill="currentColor"/>',
  anello: '<circle cx="12" cy="15" r="6"/><path d="M10 6l2-3 2 3-2 3z" fill="currentColor"/>',
};
const WEAP_IC = { Tank: 'mazza', Guerriero: 'spada', Arciere: 'arco', Mago: 'bastone', Curatore: 'bastone' };
const SEC_IC = { Tank: 'scudo', Guerriero: 'pugnale', Arciere: 'faretra', Mago: 'tomo', Curatore: 'tomo' };
function itemIconKey(kind, cls) { return kind === 'arma' ? WEAP_IC[cls] || 'spada' : kind === 'secondaria' ? SEC_IC[cls] || 'scudo' : kind; }
const itemIcon = (kind, cls, color, size) => `<svg width="${size || 22}" height="${size || 22}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="color:${color}">${ITEM_IC[itemIconKey(kind, cls)]}</svg>`;

// ---------- stato ----------
let S;
function load() {
  try { const raw = localStorage.getItem(KEY); if (raw) { S = F.migrate(JSON.parse(raw)); return true; } } catch (e) { /* storage non disponibile */ }
  S = F.newState(); return false;
}
function save() { S.lastSeen = Date.now(); try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* ignora */ } }

let B; // battaglia corrente (non salvata)
let tab = 'squadra', bagView = 'zaino', dirty = true, selItem = null, selSlot = null, equipOpen = null, eqSel = null, openMember = null, confirmReset = 0, confirmTree = 0;

// ---------- scena ----------
const scene = () => $('#scene');
let pEls = [], eEls = [];
function orderFront(list) {
  const rank = { Tank: 0, Guerriero: 1, Arciere: 2, Mago: 3, Curatore: 4 };
  return list.map((u, i) => ({ u, i })).sort((a, b) => rank[a.u.cls] - rank[b.u.cls] || a.i - b.i);
}
function buildScene() {
  const sc = $('#units'); sc.innerHTML = '';
  pEls = []; eEls = [];
  const isRanged = c => c === 'Arciere' || c === 'Mago' || c === 'Curatore';
  // squadra: mischia davanti, a distanza dietro con uno stacco
  const melee = orderFront(B.party).filter(o => !isRanged(o.u.cls)), ranged = orderFront(B.party).filter(o => isRanged(o.u.cls));
  const place = (list, x0) => list.forEach(({ u }, k) => {
    const x = x0 - k * 15, y = 26 + (k % 2) * 6;
    const el = document.createElement('div'); el.className = 'u'; el.style.left = x + 'px'; el.style.bottom = y + 'px'; el.style.zIndex = 20 - (k % 2) * 5;
    el.innerHTML = `<div class="hpb"><b style="background:#7ED36F"></b></div>${sprite(u.species, 2)}`;
    sc.appendChild(el); pEls[u.idx] = el;
  });
  place(melee, 168);
  place(ranged, (melee.length ? 168 - melee.length * 15 - 34 : 168));
  // nemici: quelli da mischia si ammassano sul primo bersaglio, quelli a distanza restano indietro
  let mk = 0, rk = 0;
  B.enemies.forEach(u => {
    const bp = u.boss ? 3 : 2, r = isRanged(u.cls);
    const x = r ? 248 + (rk++) * 12 : 190 + (mk++) * 7 - (u.boss ? 6 : 0), y = 26 + ((r ? rk : mk) % 2) * 5;
    const el = document.createElement('div'); el.className = 'u'; el.dataset.x = x; el.style.left = '420px'; el.style.bottom = y + 'px'; el.style.zIndex = 15 - (mk % 3);
    el.innerHTML = `<div class="hpb"><b style="background:#FF5A6E"></b></div><div class="mk">${icon('dust', '#7ED36F', 10)}</div>${sprite(u.species, bp, { flip: true })}`;
    sc.appendChild(el); eEls[u.idx] = el;
  });
  buildLog();
  logAt = -1e9;
  updateScene();
}
// Vita della squadra, stilizzata: barra sottile + danno medio al secondo (media mobile, non si azzera tra le battaglie)
let logRows = [];
const dps = {}, lastDealt = {}, acc = {};
let dpsAt = 0;
function buildLog() {
  const box = $('#log'); logRows = [];
  box.innerHTML = `<div class="lhead"><span id="alive"></span><span>danno medio / s</span></div><div class="pgrid">${B.party.map(u => `<div class="pc"><div class="pt"><i style="background:${F.CLASSES[u.cls].color}"></i><span class="pn">${esc(S.roster[u.id].name)}</span><b class="pd"></b></div><div class="hbar"><b></b></div></div>`).join('')}</div>`;
  const cells = box.querySelectorAll('.pc');
  B.party.forEach((u, i) => { logRows.push([u, cells[i]]); lastDealt[u.idx] = 0; });
}
let logAt = 0;
function updateLog() {
  const now = performance.now();
  for (const [u] of logRows) { const d = u.dealt - (lastDealt[u.idx] || 0); if (d > 0) acc[u.id] = (acc[u.id] || 0) + d; lastDealt[u.idx] = u.dealt; }
  if (now - dpsAt >= 1000) {
    const sec = (now - dpsAt) / 1000; dpsAt = now;
    for (const [u] of logRows) { const v = (acc[u.id] || 0) / Math.min(sec, 2) * (S.settings.test ? 0.2 : 1); dps[u.id] = dps[u.id] === undefined ? v : dps[u.id] * 0.85 + v * 0.15; acc[u.id] = 0; }
  }
  if (now - logAt < 250) return; logAt = now;
  let alive = 0; const top = Math.max(1, ...logRows.map(([u]) => dps[u.id] || 0));
  for (const [u, c] of logRows) {
    const pct = Math.max(0, u.hp / u.maxHp); if (u.hp > 0) alive++;
    const b = c.lastChild.firstChild; b.style.width = (100 * pct) + '%';
    b.style.background = pct > 0.6 ? '#7ED36F' : pct > 0.3 ? '#F2C14E' : '#FF5A6E';
    c.querySelector('.pd').textContent = u.hp > 0 ? cfmt(dps[u.id] || 0) : 'KO';
    c.classList.toggle('ko', u.hp <= 0);
    c.classList.toggle('mvp', u.hp > 0 && (dps[u.id] || 0) >= top && top > 1);
  }
  const a = $('#alive'); if (a) a.textContent = `Squadra ${alive}/${logRows.length}`;
}
let marching = null;
function updateScene() {
  const en = B.enemies.filter(u => u.hp > 0);
  const m = B.over === 'win' || (en.length > 0 && en.every(u => u.arrive > 0));
  if (m !== marching) { marching = m; scene().classList.toggle('march', m); }
  B.party.forEach(u => { const el = pEls[u.idx]; if (!el) return; el.firstChild.firstChild.style.width = (100 * u.hp / u.maxHp) + '%'; el.classList.toggle('dead', u.hp <= 0); });
  B.enemies.forEach(u => { const el = eEls[u.idx]; if (!el) return; const tx = +el.dataset.x; el.style.left = (u.arrive > 0 ? tx + (420 - tx) * (u.arrive / u.arriveMax) : tx) + 'px'; el.classList.toggle('walk', u.arrive > 0); el.firstChild.firstChild.style.width = (100 * u.hp / u.maxHp) + '%'; el.classList.toggle('dead', u.hp <= 0); el.classList.toggle('marked', u.mark > 0); });
  updateLog();
}
let floats = 0;
function floatText(el, text, cls) {
  if (!el || floats > 24) return;
  const sc = scene().getBoundingClientRect(), r = el.getBoundingClientRect();
  const f = document.createElement('div'); f.className = 'fl ' + (cls || ''); f.textContent = text;
  f.style.left = (r.left - sc.left + r.width / 2 + (Math.random() * 20 - 10)) + 'px'; f.style.top = (r.top - sc.top - 6) + 'px';
  $('#fx').appendChild(f); floats++;
  setTimeout(() => { f.remove(); floats--; }, 900);
}
function lunge(el, dir) { if (!el) return; el.style.setProperty('--dx', dir + 'px'); el.classList.remove('lg'); void el.offsetWidth; el.classList.add('lg'); }
function banner(text) { const b = $('#banner'); b.textContent = text; b.classList.remove('show'); void b.offsetWidth; b.classList.add('show'); }

function setScroll() { const g = document.querySelector('.ground'); if (g) g.style.animationDuration = (1.4 / F.moveSpeed(S)) + 's'; }
// ---------- notifiche ----------
function toast(html, color) {
  const box = $('#toasts'); while (box.children.length >= 3) box.firstChild.remove();
  const t = document.createElement('div'); t.className = 'toast'; if (color) t.style.borderLeftColor = color; t.innerHTML = html; box.appendChild(t);
  setTimeout(() => t.remove(), 2600);
}

// ---------- eventi della simulazione ----------
const capQueue = [];
let lvlToastAt = 0;
function handle(ev) {
  for (const e of ev) {
    if (e.type === 'dmg') { const el = (e.side === 'p' ? pEls : eEls)[e.idx]; floatText(el, (e.crit ? 'CRIT ' : '') + cfmt(e.dmg), e.crit ? 'crit' : (e.side === 'p' ? 'hurt' : '')); }
    else if (e.type === 'atk') { lunge((e.side === 'p' ? pEls : eEls)[e.idx], e.side === 'p' ? 8 : -8); }
    else if (e.type === 'skill') { floatText(pEls[e.idx], e.name, 'skill'); }
    else if (e.type === 'heal') { floatText(pEls[e.idx], '+' + cfmt(e.h), 'heal'); }
    else if (e.type === 'kill') { dirty = true; }
    else if (e.type === 'drop') { const r = F.ITEM_RARITY.find(x => x.key === e.item.rarity); if (e.item.rarity !== 'comune') toast(`Trovato: <b class="${r.rainbow ? 'rbw' : ''}" style="color:${r.color}">${esc(F.itemName(e.item))}</b> · ${r.label}`, r.color); dirty = true; }
    else if (e.type === 'level') { const now = Date.now(); if (now - lvlToastAt > 4000) { lvlToastAt = now; toast(`${esc(S.roster[e.id].name)} sale al livello ${e.lvl}`); } dirty = true; }
    else if (e.type === 'capture') { capQueue.push(e.species); dirty = true; }
    else if (e.type === 'rare') { setTimeout(shareDrops, 500); const r = F.ITEM_RARITY.find(x => x.key === e.item.rarity); banner('DROP ' + r.label.toUpperCase() + '!'); toast(`<b class="${r.rainbow ? 'rbw' : ''}" style="color:${r.color}">${r.label}!</b> ${esc(F.itemName(e.item))}`, r.color); dirty = true; }
    else if (e.type === 'rune') { const r = F.RUNE[e.rune]; toast(`${icon('rune', r.color, 14)} +${e.n} <b style="color:${r.color}">${r.label}</b>`, r.color); dirty = true; }
    else if (e.type === 'unlock') { toast(e.text, '#F2C14E'); dirty = true; }
    else if (e.type === 'battle') { buildScene(); banner(e.result === 'win' ? (S.battle === F.BOSS_BATTLE ? 'BOSS: ' + F.SPECIES[F.ZONES[S.zone].boss].name.toUpperCase() : (S.battle === 1 ? 'ZONA ' + S.zone + ' · ' : '') + 'BATTAGLIA ' + S.battle) : 'SCONFITTA · SI RIPARTE DALLA BATTAGLIA 1'); dirty = true; }
  }
}

// ---------- HUD ----------
function hud() {
  const mr = F.missionsReady(S), bt = document.querySelector('[data-tab=bestiario]'); if (bt) bt.classList.toggle('dot', mr > 0); const shb = document.querySelector('[data-tab=shop]'); if (shb) shb.classList.toggle('dot', F.dailyReady(S));
  $('#gold').textContent = cfmt(S.gold); $('#astri').textContent = cfmt(S.astri);
  const pl = F.planetOf(S.zone); $('#ptitle').textContent = pl.name; $('#where').textContent = `Zona ${S.zone} · Battaglia ${S.battle}/30`;
  scene().classList.toggle('p2', pl === F.PLANETS[1]);
  $('#prog').style.width = (100 * S.battle / 30) + '%';
  $('#testbadge').hidden = !S.settings.test;
}

// ---------- pannelli ----------
const CC = c => F.CLASSES[c].color;
function synergyHTML() {
  const cc = F.classCounts(S);
  const chips = Object.keys(cc).map(c => { const n = cc[c], lv = n >= 6 ? '+40%' : n >= 4 ? '+25%' : n >= 2 ? '+10%' : ''; return `<span class="chip"><i style="background:${CC(c)}"></i>${c} ${n}${lv ? ` <em>${lv}</em>` : ''}</span>`; }).join('');
  return `<div class="chips">${chips}</div><div class="note">Bonus di classe con 2, 4 e 6 membri della stessa classe.</div>`;
}
// Statistiche di un oggetto, in stile scheda
function statsHTML(it, lv) {
  const sm = 1 + 0.1 * (lv || 0), main = F.mainStats(it), r = F.ITEM_RARITY.find(x => x.key === it.rarity);
  const val = (k, v) => F.PCT_STATS.includes(k) ? (v * sm * 100).toFixed(2).replace('.', ',') + '%' : (v * sm).toLocaleString('it-IT', { maximumFractionDigits: 1 });
  const rows = Object.keys(main).map(k => `<div class="srow2"><span>${F.STAT_LABEL[k]}</span><b>${val(k, main[k])}</b></div>`).join('');
  const bon = (it.bonus || []).map(b => `<div class="srow2 bon"><span><i style="background:${r.color}"></i>${F.STAT_LABEL[b.k]}</span><b>${val(b.k, F.bonusValue(it, b))}</b></div>`).join('');
  return `<div class="stbox">${rows}${bon ? `<div class="sthead">Bonus</div>${bon}` : ''}<div class="srow2 val"><span>${icon('coin', '#F2C14E', 12)} Valore</span><b>${fmt(F.sellValue(it))}</b></div>${lv ? `<div class="sthead" style="color:#5BD8E6">Slot +${lv}: +${lv * 10}% agli attributi</div>` : ''}</div>`;
}
function memberRow(id, inTeam, i) {
  const m = S.roster[id], sp = F.SPECIES[m.species], cls = sp.cls, st = F.memberStats(S, id), open = openMember === id;
  const need = F.xpNeed(m.lvl);
  let html = `<div class="card mrow" style="border-left:3px solid ${CC(cls)}">
  <button class="mhead" data-act="openm" data-id="${id}" aria-expanded="${open}">
    <div class="mspr">${sprite(m.species, 2)}</div>
    <div class="minfo"><div class="mname">${esc(m.name)}${m.locked ? ' ' + icon('lock', '#A9B0D6', 13) : ''}</div><div class="msub"><span style="color:${CC(cls)}">${cls}</span> · Lv ${m.lvl} · Potere ${fmt(F.memberPower(S, id))}</div><div class="xp"><b style="width:${100 * m.xp / need}%"></b></div></div>
  </button>`;
  html += `<button class="eqb" data-act="equip" data-id="${id}" aria-label="Equipaggiamento di ${esc(m.name)}">${itemIcon('corazza', cls, '#F2C14E', 18)}</button>`;
  if (inTeam) html += `<div class="mbtns"><button class="ib" data-act="up" data-id="${id}" aria-label="Sposta su" ${i === 0 ? 'disabled' : ''}>${icon('up')}</button><button class="ib" data-act="down" data-id="${id}" aria-label="Sposta giù" ${i === S.team.length - 1 ? 'disabled' : ''}>${icon('down')}</button></div>`;
  else html += `<div class="mbtns"><button class="sb" data-act="add" data-id="${id}" ${F.teamFull(S) ? 'disabled' : ''}>Aggiungi</button></div>`;
  html += `</div>`;
  if (open) {
    html += `<div class="card detail">
    <div class="stats"><span>Vita <b>${fmt(st.hp)}</b></span><span>Attacco <b>${fmt(st.atk)}</b></span><span>Difesa <b>${st.def}</b></span><span>Critico <b>${Math.round(st.crit * 100)}%</b></span></div>
    <div class="abil"><b style="color:${CC(cls)}">${F.CLASSES[cls].ability}</b> · ${F.CLASSES[cls].desc}</div>
    <div class="row2"><label class="tg"><input type="checkbox" data-act="lockm" data-id="${id}" ${m.locked ? 'checked' : ''}> Blocca equipaggiamento</label>${inTeam && !F.isHero(id) ? `<button class="sb" data-act="bench" data-id="${id}">Metti in riserva</button>` : ''}</div>
    <form class="rename" data-id="${id}"><label for="rn-${id}">Nome</label><input id="rn-${id}" maxlength="16" value="${esc(m.name)}"><button class="sb" type="submit">Salva</button></form>
    </div>`;
  }
  return html;
}
function eqHTML(id) {
  const m = S.roster[id], cls = F.SPECIES[m.species].cls;
  return `<div class="eqgrid">${F.SLOTS.map(sl => { const it = m.eq[sl], lv = m.slv[sl] || 0, k = F.kindOf(sl), sel = selSlot === id + ':' + sl;
      const r = it ? F.ITEM_RARITY.find(x => x.key === it.rarity) : null, col = r ? r.color : '#4A5088';
      return `<button class="eqt${sel ? ' sel' : ''}${it ? '' : ' empty'}" style="border-color:${col}" data-act="selslot" data-id="${id}" data-slot="${sl}" aria-label="${F.SLOT_LABEL[sl]}${it ? ': ' + esc(F.itemName(it)) : ' vuoto'}">${itemIcon(k, it ? it.cls : cls, col, 22)}<span>${it ? cfmt(Math.round(F.itemPower(it) * (1 + 0.1 * lv))) : F.SLOT_LABEL[sl]}</span>${lv ? `<i>+${lv}</i>` : ''}</button>`; }).join('')}</div>
    ${(() => { if (!selSlot || selSlot.split(':')[0] !== id) return '<div class="note">Tocca un posto per vederlo, togliere l\'oggetto o potenziare lo slot.</div>';
      const sl = selSlot.split(':')[1], it = m.eq[sl], lv = m.slv[sl] || 0, c = F.slotCost(lv), rk = F.slotRune(lv), rr = F.RUNE[rk];
      const r = it ? F.ITEM_RARITY.find(x => x.key === it.rarity) : null;
      return `<div class="card eqdet" style="border-color:${r ? r.color : 'var(--line)'}"><div><b style="color:${r ? r.color : 'var(--muted)'}">${it ? esc(F.itemName(it)) : F.SLOT_LABEL[sl] + ' vuoto'}</b><div class="msub">${it ? r.label + ' · ' + F.SLOT_LABEL[F.kindOf(sl)] + ' · ' : ''}slot +${lv}</div>${it ? statsHTML(it, lv) : ''}</div>
      <div class="row2">${it ? `<button class="sb" data-act="uneq" data-id="${id}" data-slot="${sl}">Togli</button>` : ''}<button class="sb" data-act="slotup" data-id="${id}" data-slot="${sl}" ${lv >= 10 || S.runes[rk] < c ? 'disabled' : ''}>${lv >= 10 ? 'Slot al massimo' : `Potenzia slot · ${c} runa <span style="color:${rr.color}">${rr.label.replace('Runa ', '')}</span>`}</button></div></div>`; })()}
  <div class="note">Il livello dello slot resta anche se cambi oggetto: +10% al potere per livello.</div>`;
}
function showEquip(id) {
  equipOpen = id; const m = S.roster[id], sp = F.SPECIES[m.species], st = F.memberStats(S, id);
  $('#modal').innerHTML = `<div class="mod eqmod" role="dialog" aria-modal="true" aria-labelledby="eqt"><div class="eqhead"><div class="mspr">${sprite(m.species, 3)}</div><div><h2 id="eqt" style="text-align:left;font-size:20px;margin:0">${esc(m.name)}</h2><div class="msub"><span style="color:${CC(sp.cls)}">${sp.cls}</span> · Lv ${m.lvl} · Potere ${fmt(F.memberPower(S, id))}</div></div><button class="ib" data-act="close" aria-label="Chiudi" style="margin-left:auto">✕</button></div>
  <div class="stats"><span>Vita <b>${fmt(st.hp)}</b></span><span>Attacco <b>${fmt(st.atk)}</b></span><span>Difesa <b>${st.def}</b></span><span>Critico <b>${Math.round(st.crit * 100)}%</b></span></div>
  ${eqHTML(id)}
  ${bagForMember(id)}</div>`;
  $('#modal').hidden = false;
}
function bagForMember(id) {
  const m = S.roster[id], inv = S.inventory.filter(it => F.canUse(m, it)).sort((a, b) => F.itemPower(b) - F.itemPower(a));
  let det = '';
  const it = eqSel && inv.find(x => x.id === eqSel);
  if (it) {
    const r = F.ITEM_RARITY.find(x => x.key === it.rarity), sl = F.targetSlot(m, it), cur = m.eq[sl], lv = m.slv[sl] || 0;
    const diff = F.itemPower(it) - (cur ? F.itemPower(cur) : 0);
    det = `<div class="card idet" style="border-color:${r.color}"><div class="iname" style="color:${r.color};display:flex;align-items:center;gap:6px">${itemIcon(it.slot, it.cls, r.color, 24)}${esc(F.itemName(it))}</div>
      <div class="msub">${r.label} · ${F.SLOT_LABEL[it.slot]} · punteggio ${fmt(F.itemPower(it))} <b style="color:${diff >= 0 ? '#7ED36F' : '#FF8A96'}">(${diff >= 0 ? '+' : ''}${fmt(diff)} rispetto a ${cur ? 'quello indossato' : 'vuoto'})</b></div>
      ${statsHTML(it, lv)}
      <div class="row2"><button class="pb" data-act="eqto" data-item="${it.id}" data-id="${id}">Equipaggia</button><button class="sb" data-act="sell" data-item="${it.id}">Vendi · ${cfmt(F.sellValue(it))}</button></div></div>`;
  }
  return `<div class="ph"><h2 style="font-size:13px">Zaino</h2><span>${inv.length} oggetti adatti</span></div>${det}
  <div class="igrid">${inv.map(it => { const r = F.ITEM_RARITY.find(x => x.key === it.rarity), cur = m.eq[F.targetSlot(m, it)], up = !cur || F.itemPower(it) > F.itemPower(cur); return `<button class="it${eqSel === it.id ? ' sel' : ''}" style="border-color:${r.color}" data-act="eqpick" data-item="${it.id}">${itemIcon(it.slot, it.cls, r.color, 22)}<b>${cfmt(F.itemPower(it))}</b>${up ? '<i class="upar">▲</i>' : ''}</button>`; }).join('') || '<div class="note" style="grid-column:1/-1">Nessun oggetto adatto nello zaino.</div>'}</div>`;
}
function pSquadra() {
  const slots = F.slotCount(S), n = F.creaturesInTeam(S);
  const reserve = Object.keys(S.roster).filter(id => !S.team.includes(id));
  return `<div class="ph"><h2>Squadra</h2><span>creature ${n}/${slots} (max ${F.CREATURE_SLOTS}) · eroi esclusi</span></div>
  ${synergyHTML()}
  <div class="note">L'ordine conta: chi sta più in alto riceve per primo l'equipaggiamento.</div>
  ${S.team.map((id, i) => memberRow(id, true, i)).join('')}
  ${n < slots ? `<div class="card free">Posto libero: aggiungi una creatura dalla riserva o catturane una nuova.</div>` : ''}
  ${F.nextSlotZone(S) ? `<div class="lockgrid"><div class="lk">${icon('lock', '#7C84BC', 16)}<span>Nuovo posto: sconfiggi il boss della zona ${F.nextSlotZone(S)}</span></div></div>` : ''}
  ${reserve.length ? `<div class="ph"><h2>Riserva</h2><span>${reserve.length}</span></div>${reserve.map(id => memberRow(id, false)).join('')}` : ''}`;
}
function rcls(r) { return r.rainbow ? ' rbw' : ''; }
function pZaino() {
  const chest = bagView === 'forziere', src = chest ? S.chest : S.inventory;
  const inv = src.slice().sort((a, b) => F.itemPower(b) - F.itemPower(a));
  let det = '';
  const it = selItem && inv.find(x => x.id === selItem);
  if (it && chest) {
    const r = F.ITEM_RARITY.find(x => x.key === it.rarity);
    det = `<div class="card idet" style="border-color:${r.color}"><div class="iname${rcls(r)}" style="color:${r.color};display:flex;align-items:center;gap:6px">${itemIcon(it.slot, it.cls, r.color, 26)}${esc(F.itemName(it))}</div>
      <div class="msub">${r.label} · ${F.SLOT_LABEL[it.slot]} · Lv oggetto ${it.ilvl} · punteggio ${fmt(F.itemPower(it))}</div>${statsHTML(it, 0)}
      <div class="row2"><button class="pb" data-act="fromchest" data-item="${it.id}" ${S.inventory.length >= F.bagCap(S) ? 'disabled' : ''}>Sposta nello zaino</button></div></div>`;
  } else if (it) {
    const r = F.ITEM_RARITY.find(x => x.key === it.rarity), users = Object.keys(S.roster).filter(id => F.canUse(S.roster[id], it));
    det = `<div class="card idet" style="border-color:${r.color}">
      <div class="iname${rcls(r)}" style="color:${r.color};display:flex;align-items:center;gap:6px">${itemIcon(it.slot, it.cls, r.color, 26)}${esc(F.itemName(it))}${it.up ? ' +' + it.up : ''}</div>
      <div class="msub">${r.label} · ${F.SLOT_LABEL[it.slot]}${it.cls ? ' · solo ' + it.cls : ' · tutte le classi'} · Lv oggetto ${it.ilvl} · punteggio ${fmt(F.itemPower(it))}</div>
      ${statsHTML(it, 0)}
      ${users.length ? `<div class="row2"><label for="eqsel">Equipaggia a</label><select id="eqsel">${users.map(id => { const c = S.roster[id].eq[F.targetSlot(S.roster[id], it)]; return `<option value="${id}">${esc(S.roster[id].name)} (ora ${c ? fmt(F.itemPower(c)) : '—'})</option>`; }).join('')}</select><button class="sb" data-act="eqto" data-item="${it.id}">Equipaggia</button></div>` : `<div class="note">Nessuno nella tua collezione può usarlo.</div>`}
      <div class="row2">${(() => { const n = F.nextRarity(it); if (!n) return '<span class="msub">Rarità massima</span>'; const rr = F.RUNE[n], nr = F.ITEM_RARITY.find(x => x.key === n); return `<button class="sb" data-act="raise" data-item="${it.id}" ${S.runes[n] < 1 ? 'disabled' : ''}>Porta a <b style="color:${nr.color}">${nr.label}</b> · 1 ${rr.label.toLowerCase()} (${S.runes[n]})</button>`; })()}<button class="sb" data-act="sell" data-item="${it.id}">Vendi (${cfmt(F.sellValue(it))} oro)</button><button class="sb" data-act="tochest" data-item="${it.id}" ${S.chest.length >= F.chestCap(S) ? 'disabled' : ''}>Nel forziere</button></div>
    </div>`;
  }
  const grid = `<div class="igrid">${inv.map(it => { const r = F.ITEM_RARITY.find(x => x.key === it.rarity); return `<button class="it${selItem === it.id ? ' sel' : ''}${r.rainbow ? ' rbo' : ''}" style="border-color:${r.color}" data-act="selit" data-item="${it.id}" aria-label="${esc(F.itemName(it))}, ${r.label}, potere ${F.itemPower(it)}">${itemIcon(it.slot, it.cls, r.color, 22)}<b>${cfmt(F.itemPower(it))}</b><em>${it.cls ? it.cls : F.SLOT_LABEL[it.slot]}</em>${it.isNew ? '<i>nuovo</i>' : ''}</button>`; }).join('') || `<div class="note" style="grid-column:1/-1">${chest ? 'Forziere vuoto. Dallo zaino puoi mettere qui gli oggetti da conservare.' : 'Vuoto. Gli oggetti cadono dai nemici sconfitti.'}</div>`}</div>`;
  const tabs = `<div class="tabs2"><button class="sb${chest ? '' : ' on'}" data-act="bagview" data-v="zaino">Zaino ${S.inventory.length}/${F.bagCap(S)}</button><button class="sb${chest ? ' on' : ''}" data-act="bagview" data-v="forziere">Forziere ${S.chest.length}/${F.chestCap(S)}</button></div>`;
  const capNote = `<div class="note">${F.hasPass(S) ? 'Spazio raddoppiato dal Pass Astrale.' : `Col Pass Astrale zaino e forziere raddoppiano (${F.bagCap(S) * 2} posti).`} Le rune non occupano spazio.${S.inventory.length >= F.bagCap(S) ? ' <b style="color:#FF8A96">Zaino pieno: i nuovi oggetti più deboli si vendono da soli.</b>' : ''}</div>`;
  if (chest) return `${tabs}${runeBar()}${capNote}${det}${grid}`;
  return `${tabs}
  ${runeBar()}${capNote}
  <div class="row2"><button class="pb" data-act="equipall">Equipaggia tutto</button><button class="sb" data-act="sellrest">Vendi il resto</button></div>
  <div class="row2"><label for="minr">Vendita automatica</label><select id="minr" data-act="minr">${F.ITEM_RARITY.map((r, i) => { const lab = i === 0 ? 'Disattivata' : i === 1 ? 'Solo comuni' : 'Fino a ' + F.ITEM_RARITY[i - 1].label.toLowerCase(); return i > F.maxFilter(S) ? `<option disabled>${lab} · Pass</option>` : `<option value="${r.key}" ${F.minKeep(S) === i ? 'selected' : ''}>${lab}</option>`; }).join('')}</select><button class="sb" data-act="sellbelow">Vendi ora</button></div>
  <div class="note">Tutto viene raccolto in automatico. Con la vendita automatica gli oggetti scelti si vendono appena cadono, in oro; le rune si tengono sempre.${S.stats.autoSold ? ` Venduti finora: ${fmt(S.stats.autoSold)}.` : ''}${F.hasPass(S) ? '' : `<br><span style="color:var(--gold)">${icon('lock', '#F2C14E', 12)} Gratis puoi vendere in automatico solo i comuni; per le altre rarità serve il Pass Astrale (Shop).</span>`}</div>
  ${det}
  ${grid}`;
}
function runeBar() { return `<div class="runebar">${Object.keys(F.RUNE).map(k => { const r = F.RUNE[k]; return `<span title="${r.label}">${icon('rune', r.color, 16, r.label)}<b>${fmt(S.runes[k])}</b></span>`; }).join('')}</div>`; }
function pShop() {
  const left = Math.max(0, F.nextMidnight(Date.now()) - Date.now()), h = Math.floor(left / 3600000), mi = Math.floor(left % 3600000 / 60000), ready = F.dailyReady(S);
  return `<div class="ph"><h2>Shop</h2><span>${icon('gem', '#F49AC1', 14)} ${fmt(S.astri)} Astri</span></div>
  <div class="card daily"><div style="flex:1"><b>Regalo del giorno</b><div class="msub">${ready ? 'Gratis, una volta al giorno.' : `Già riscosso. Il prossimo tra ${h} h ${mi} min (a mezzanotte).`}</div></div><div class="big">${F.DAILY_ASTRI} ${icon('gem', '#F49AC1', 18)}</div><button class="pb" data-act="daily" ${ready ? '' : 'disabled'}>${ready ? 'Riscuoti' : 'Fatto'}</button></div>
  <div class="ph"><h2 style="font-size:13px">Abbonamento</h2></div>
  <div class="card passc"><div><b style="color:var(--gold)">Pass Astrale · ${F.PASS_PRICE}</b><div class="msub">Vendita automatica di tutte le rarità · zaino e forziere ×2 · guadagno offline fino a 16 ore (invece di 8).</div>${F.hasPass(S) ? `<div class="msub" style="color:#7ED36F">Attivo fino al ${new Date(S.pass).toLocaleDateString('it-IT')}</div>` : ''}</div><button class="pb" data-act="pass">${F.hasPass(S) ? 'Rinnova' : 'Attiva'}<br><small>prova gratis</small></button></div>
  <div class="ph"><h2 style="font-size:13px">Eroi</h2><span>non occupano posti in squadra</span></div>
  ${F.HERO_SHOP.map(h => { const sp = F.SPECIES[h.id], own = !!S.roster[h.id]; return `<div class="card herocard"><div class="mspr">${sprite(h.id, 3)}</div><div style="flex:1"><b>${sp.name}</b><div class="msub"><span style="color:${CC(sp.cls)}">${sp.cls}</span> · ${F.CLASSES[sp.cls].ability}</div><div class="msub"><i>“${sp.quote}”</i></div></div>${own ? '<span class="zdone">Nella squadra</span>' : `<button class="pb" data-act="buyhero" data-id="${h.id}">${h.price}<br><small>prova gratis</small></button>`}</div>`; }).join('')}
  <div class="note">Versione di prova: gli acquisti si sbloccano gratis, nessun pagamento reale.</div>`;
}
function pNegozio() {
  const left = Math.max(0, F.nextRefresh(Date.now()) - Date.now()), h = Math.floor(left / 3600000), mi = Math.floor(left % 3600000 / 60000);
  const inv = S.inventory.slice().sort((a, b) => F.itemPower(a) - F.itemPower(b));
  return `<div class="ph"><h2>Mercante</h2><span>merce nuova tra ${h} h ${mi} min</span></div>
  <div class="note">Il mercante cambia merce 3 volte al giorno (alle 0, alle 8 e alle 16). Le rarità hanno le stesse probabilità dei drop.</div>
  <div class="card wallet"><div>${icon('gem', '#F49AC1', 18)} <b>${fmt(S.astri)}</b> Astri</div></div>
  ${Object.keys(F.RUNE).map(k => { const r = F.RUNE[k]; return `<div class="card srow"><div style="display:flex;align-items:center;gap:8px">${icon('rune', r.color, 22)}<div><b style="color:${r.color}">${r.label}</b> × ${fmt(S.runes[k])}<div class="msub">Vale ${r.value} ${r.value === 1 ? 'Astro' : 'Astri'}</div></div></div><div class="mbtns"><button class="sb" data-act="sellrune1" data-k="${k}" ${S.runes[k] < 1 ? 'disabled' : ''}>Vendi 1</button><button class="sb" data-act="sellruneall" data-k="${k}" ${S.runes[k] < 1 ? 'disabled' : ''}>Tutte</button></div></div>`; }).join('')}
  <div class="note">Ogni runa porta un oggetto alla sua rarità partendo da quella precedente (verde: da comune a non comune, blu: a raro, viola: a epico, arancione: a leggendario). Astrale, Arcano e Segreto si trovano solo come drop. Basta 1 runa per potenziare uno slot: vendi solo quelle in più.</div>
  <button class="sb wide" data-act="reroll" ${S.astri < F.REROLL_COST ? 'disabled' : ''}>Rinnova ora la merce · ${F.REROLL_COST} Astri</button>
  <div class="sgrid shop">${S.shop.items.map((it, i) => { const r = F.ITEM_RARITY.find(x => x.key === it.rarity);
    return `<div class="card sitem" style="border-color:${it.sold ? 'var(--line)' : r.color}">${itemIcon(it.slot, it.cls, r.color, 28)}<b style="color:${r.color}">${esc(F.itemName(it))}</b><span>${r.label} · ${F.SLOT_LABEL[it.slot]}${it.cls ? ' · ' + it.cls : ''}</span><span>Potere ${fmt(F.itemPower(it))}</span><button class="${it.sold ? 'sb' : 'pb'}" data-act="buy" data-i="${i}" ${it.sold || S.astri < it.price ? 'disabled' : ''}>${it.sold ? 'Venduto' : `${it.price} Astri`}</button></div>`; }).join('')}</div>
  <div class="ph"><h2>Vendi oggetti</h2><span>${inv.length} nello zaino</span></div>
  <button class="sb wide" data-act="sellrest">Vendi il resto (ciò che non migliora nessuno)</button>
  ${inv.map(it => { const r = F.ITEM_RARITY.find(x => x.key === it.rarity); return `<div class="card srow"><div><b style="color:${r.color}">${esc(F.itemName(it))}${it.up ? ' +' + it.up : ''}</b><div class="msub">${r.label} · Potere ${fmt(F.itemPower(it))}</div></div><button class="sb" data-act="sell" data-item="${it.id}">Vendi · ${cfmt(F.sellValue(it))} oro</button></div>`; }).join('') || '<div class="note">Niente da vendere.</div>'}`;
}
function pBestiario() {
  const n = F.capturedCount(S), tot = F.ALL_SPECIES.length, ready = F.missionsReady(S);
  return `<div class="ph"><h2>Bestiario</h2><span>${n}/${tot}${ready ? ` · <b style="color:var(--gold)">${ready} missioni da riscuotere</b>` : ''}</span></div>
  <div class="bar"><b style="width:${100 * n / tot}%"></b></div>
  <div class="note">Ogni creatura si cattura una sola volta. Torna nella zona indicata per cercare quelle che mancano.</div>
  ${F.PLANETS.map(pl => `<div class="ph"><h2 style="font-size:13px">${pl.name}</h2><span>${pl.species.filter(k => S.roster[k]).length}/${pl.species.length} · zone ${pl.zones[0]}-${pl.zones[1]}</span></div>
  <div class="bgrid">${pl.species.map(k => { const sp = F.SPECIES[k], m = S.roster[k], rar = F.RARITY[sp.rarity].label, z = F.zoneOf(k);
    const mis = missionHTML(k);
    if (m) return `<div class="card best"><div class="bspr">${sprite(k, 3)}</div><b>${esc(m.name)}</b><span style="color:${CC(sp.cls)}">${sp.cls}</span><em>${rar}</em><small>Zona ${z} · dopo ${fmt(m.waitKills)} incontri</small>${mis}</div>`;
    return `<div class="card best"><div class="bspr">${sprite(k, 3, { sil: true })}</div><b>???</b><span>&nbsp;</span><em>${rar}</em><small>${z <= S.maxZone ? 'Zona ' + z + ' · incontri ' + fmt(S.hunt[k] || 0) : 'Zona ' + z + ' (bloccata)'}</small>${mis}</div>`; }).join('')}</div>`).join('')}`;
}
function missionHTML(k) {
  const t = F.missionTier(S, k), kills = (S.kills && S.kills[k]) || 0;
  const stars = [0, 1, 2].map(i => `<i class="${i < t ? 'on' : ''}"></i>`).join('');
  if (t >= 3) return `<div class="mis"><div class="mstars">${stars}</div><span class="mdone">Missioni completate</span></div>`;
  const goal = F.missionGoal(k, t), r = F.missionReward(k, t), rr = F.RUNE[r.rune[0]], ready = kills >= goal;
  return `<div class="mis"><div class="mstars">${stars}</div><span>Sconfiggi ${fmt(Math.min(kills, goal))}/${fmt(goal)}</span><div class="bar"><b style="width:${Math.min(100, 100 * kills / goal)}%"></b></div>
    <span class="mrew">${r.astri} ${icon('gem', '#F49AC1', 10)} 1 ${icon('rune', rr.color, 10)}</span>
    ${ready ? `<button class="pb mclaim" data-act="claim" data-id="${k}">Riscuoti</button>` : ''}</div>`;
}
function pMappa() {
  const isl = (z, i, pl) => {
    const Z = F.ZONES[z], locked = z > S.maxZone, here = z === S.zone, done = z <= S.cleared, left = i % 2 === 0;
    const mobs = Z.pool.filter((k, j, a) => a.indexOf(k) === j).slice(-3);
    const missing = Z.pool.concat(Z.boss).filter((k, j, a) => a.indexOf(k) === j && !S.roster[k] && F.zoneOf(k) === z).length;
    const slot = F.SLOT_UNLOCKS.includes(z) && !done;
    return `<div class="isl ${left ? 'l' : 'r'}${locked ? ' zlk' : ''}${here ? ' here' : ''}" style="--d:${i * 0.4}s">
      <div class="itop"><b>Zona ${z}</b>${done ? `<span class="ok">${icon('check', '#7ED36F', 12)}</span>` : ''}${missing && !locked ? `<span class="miss">${missing} da catturare</span>` : ''}${slot ? '<span class="miss slotm">+1 posto</span>' : ''}</div>
      <div class="rock pl${pl}">
        <div class="mobs">${mobs.map((k, j) => `<span class="mob" style="animation-delay:${j * 0.3 + i * 0.2}s">${sprite(k, 2, locked ? { sil: true } : undefined)}</span>`).join('')}</div>
        <div class="boss"><span class="crown">♛</span>${sprite(Z.boss, 3, locked ? { sil: true } : undefined)}</div>
        ${here ? `<div class="me">${sprite('hero', 2)}</div>` : ''}
      </div>
      ${locked ? `<div class="lockc">${icon('lock', '#7C84BC', 11)} Sconfiggi il boss precedente</div>` : here ? `<div class="herel">Sei qui · battaglia ${S.battle}/${F.BOSS_BATTLE}</div>` : `<button class="sb go" data-act="zone" data-z="${z}">Combatti qui</button>`}
    </div>`;
  };
  return `<div class="ph"><h2>Mappa</h2><span>zone completate ${S.cleared}/${F.MAX_ZONE}</span></div>
  <div class="note">La campagna avanza solo nella zona più lontana raggiunta; quelle precedenti servono per farmare e catturare le creature mancanti.</div>
  ${F.PLANETS.map((pl, pi) => `<div class="planetmap p${pi}"><div class="pmhead"><span class="pmglobe g${pi}"></span><b>${pl.name}</b></div>
   <svg class="path" viewBox="0 0 100 500" preserveAspectRatio="none" aria-hidden="true"><path d="M28 40 C 90 90, 90 110, 72 140 S 10 200, 28 240 S 90 300, 72 340 S 10 400, 28 440" fill="none" stroke="#6B7BD1" stroke-width="1.2" stroke-dasharray="3 3" vector-effect="non-scaling-stroke"/></svg>
   ${Array.from({ length: pl.zones[1] - pl.zones[0] + 1 }, (_, i) => isl(pl.zones[0] + i, i, pi)).join('')}</div>`).join('')}`;
}
function pStelle() {
  return `<div class="ph"><h2>Costellazioni</h2><span>${icon('coin', '#F2C14E', 14)} ${cfmt(S.gold)} oro</span></div>
  <div class="note">Le costellazioni si accendono con l'oro dei nemici sconfitti. Più alto il livello, più costa la stella successiva.</div>
  ${Object.keys(F.TREE).map(k => { const t = F.TREE[k], l = S.tree[k], max = l >= t.max, c = max ? 0 : t.cost(l);
    return `<div class="card trow"><div><b>${t.name}</b> <span class="lvl">${l}/${t.max}</span><div class="msub">${t.desc}</div><div class="bar" style="margin-top:4px;height:3px"><b style="width:${100 * l / t.max}%"></b></div></div><button class="sb" data-act="tree" data-k="${k}" ${max || S.gold < c ? 'disabled' : ''}>${max ? 'Max' : 'Accendi · ' + cfmt(c)}</button></div>`; }).join('')}
  <button class="sb wide" data-act="treereset">${confirmTree > Date.now() ? 'Tocca di nuovo per confermare' : 'Ridistribuisci tutti i punti'}</button>`;
}
function pAltro() {
  const st = S.stats, h = Math.floor(st.played / 3600), mi = Math.floor(st.played % 3600 / 60);
  const RL = S.rareLog || [], when = t => { const d = Date.now() - t; return d < 3600000 ? Math.max(1, Math.round(d / 60000)) + ' min fa' : d < 86400000 ? Math.round(d / 3600000) + ' h fa' : Math.round(d / 86400000) + ' g fa'; };
  const rare = `<div class="ph"><h2>Drop rari</h2><span>Astrale · Arcano · Segreto</span></div>
  <div class="note">Le tre rarità più alte possono cadere da qualsiasi nemico, in ogni zona, con la stessa probabilità. Qui trovi i tuoi; quando ci sarà la chat globale vedrai anche quelli degli altri giocatori.</div>
  <div class="chips">${F.RARE_FEED.map(k => { const r = F.ITEM_RARITY.find(x => x.key === k); return `<span class="chip"><i style="background:${r.color}"></i><span class="${r.rainbow ? 'rbw' : ''}" style="color:${r.color}">${r.label}</span> <em>${(st.rare && st.rare[k]) || 0}</em></span>`; }).join('')}</div>
  ${RL.slice(0, 10).map(e => { const r = F.ITEM_RARITY.find(x => x.key === e.rarity); return `<div class="card feed">${itemIcon(e.slot, null, r.color, 20)}<div style="flex:1"><b class="${r.rainbow ? 'rbw' : ''}" style="color:${r.color}">${r.label}</b> · ${F.SLOT_LABEL[e.slot]} · Lv ${e.ilvl}<div class="msub">Zona ${e.zone} · ${when(e.t)}</div></div></div>`; }).join('') || '<div class="note">Nessuno ancora. Buona fortuna!</div>'}`;
  return `<div class="ph"><h2>Statistiche</h2></div>
  <div class="sgrid">
   <div><span>Nemici sconfitti</span><b>${fmt(st.kills)}</b></div><div><span>Oro totale</span><b>${cfmt(st.gold)}</b></div>
   <div><span>Vittorie / sconfitte</span><b>${fmt(st.wins)} / ${fmt(st.losses)}</b></div><div><span>Oggetti trovati</span><b>${fmt(st.items)}</b></div>
   <div><span>Catture</span><b>${F.capturedCount(S)}/${F.ALL_SPECIES.length}</b></div><div><span>Tempo con il gioco aperto</span><b>${h} h ${mi} min</b></div>
  </div>
  ${rare}
  <div class="card"><div class="msub">Nemici sconfitti al minuto, ultimi 30 minuti</div><canvas id="chart" width="680" height="220" role="img" aria-label="Grafico dei nemici sconfitti al minuto"></canvas></div>
  <div class="ph"><h2>Achievement</h2><span>${Object.keys(S.ach).length}/${F.ACH.length}</span></div>
  ${F.ACH.map(a => `<div class="card arow${S.ach[a.id] ? ' done' : ''}">${S.ach[a.id] ? icon('check', '#7ED36F', 20) : icon('lock', '#7C84BC', 20)}<div><b>${a.name}</b><div class="msub">${a.desc} · +${a.astri} Astri</div></div></div>`).join('')}
  <div class="ph"><h2>Impostazioni</h2></div>
  <label class="tg"><input type="checkbox" data-act="test" ${S.settings.test ? 'checked' : ''}> Modalità test: velocità ×5 e catture ×200</label>
  <div class="ph"><h2>Strumenti di test</h2></div>
  <div class="note">Fa avanzare il gioco come se fosse passato questo tempo (senza il limite di ore offline).</div>
  <div class="skips">${[[1, '1 h'], [6, '6 h'], [12, '12 h'], [24, '1 g'], [168, '7 g']].map(([h, l]) => `<button class="sb" data-act="skip" data-h="${h}">+${l}</button>`).join('')}</div>
  <div class="note">Il salvataggio resta in questo browser.</div>
  <button class="sb wide danger" data-act="reset">${confirmReset > Date.now() ? 'Tocca di nuovo: cancella tutto' : 'Ricomincia da zero'}</button>`;
}
function drawChart() {
  const cv = $('#chart'); if (!cv) return; const g = cv.getContext('2d'), W = cv.width, H = cv.height;
  g.clearRect(0, 0, W, H);
  const now = Math.floor(Date.now() / 60000), vals = [];
  for (let m = now - 29; m <= now; m++) { const r = S.stats.perMin.find(x => x.m === m); vals.push(r ? r.kills : 0); }
  const max = Math.max(1, ...vals), bw = (W - 50) / 30;
  g.strokeStyle = '#2A3066'; g.fillStyle = '#A9B0D6'; g.font = '20px Inter, sans-serif';
  g.beginPath(); g.moveTo(44, H - 30); g.lineTo(W, H - 30); g.stroke();
  g.fillText(String(max), 4, 22); g.fillText('0', 18, H - 34); g.fillText('-30 min', 44, H - 6); g.fillText('ora', W - 40, H - 6);
  g.fillStyle = '#7FE3F0';
  vals.forEach((v, i) => { const h = (H - 50) * v / max; g.fillRect(48 + i * bw, H - 30 - h, bw - 4, h); });
}
function render() {
  const p = $('#panel');
  const y = p.scrollTop;
  p.innerHTML = tab === 'squadra' ? pSquadra() : tab === 'zaino' ? pZaino() : tab === 'negozio' ? pNegozio() : tab === 'shop' ? pShop() : tab === 'mappa' ? pMappa() : tab === 'bestiario' ? pBestiario() : tab === 'stelle' ? pStelle() : pAltro();
  p.scrollTop = y;
  if (tab === 'altro') drawChart();
  document.querySelectorAll('.tab').forEach(t => t.setAttribute('aria-current', t.dataset.tab === tab ? 'page' : 'false'));
  dirty = false;
}

// ---------- modali ----------
function showCapture(sp) {
  const m = S.roster[sp], d = F.SPECIES[sp], cls = d.cls, inTeam = S.team.includes(sp);
  const m$ = $('#modal');
  m$.innerHTML = `<div class="mod cap" role="dialog" aria-modal="true" aria-labelledby="capname">
   <div class="kick">NUOVA CREATURA</div>
   <div class="halo"><div class="bob">${sprite(sp, 9)}</div></div>
   <h2 id="capname">${esc(m.name)}</h2>
   <div class="badges"><span class="rb">${F.RARITY[d.rarity].label}</span><span class="cb" style="background:${CC(cls)}">${cls}</span></div>
   <p class="quote">«${esc(d.quote)}»</p>
   <div class="card"><div class="kv"><span>Pianeta</span><b>Prati Stellari</b></div><div class="kv"><span>Incontri prima della cattura</span><b>${fmt(m.waitKills)}</b></div><div class="kv"><span>Abilità</span><b style="color:${CC(cls)}">${F.CLASSES[cls].ability}</b></div></div>
   <form class="rename" data-id="${sp}"><label for="capn">Dai un nome</label><input id="capn" maxlength="16" value="${esc(m.name)}"><button class="sb" type="submit">Salva</button></form>
   ${inTeam ? '<div class="note">È già entrata in squadra.</div>' : `<button class="pb wide" data-act="capadd" data-id="${sp}" ${F.teamFull(S) ? 'disabled' : ''}>${F.teamFull(S) ? 'Squadra piena: resta in riserva' : 'Metti in squadra'}</button>`}
   <div class="row2"><button class="discord" data-act="share" data-id="${sp}">Copia per Discord</button><button class="sb" data-act="close">Continua</button></div>
  </div>`;
  m$.hidden = false;
}
function showOffline(r) {
  const h = Math.floor(r.seconds / 3600), mi = Math.floor(r.seconds % 3600 / 60);
  const caps = r.events.filter(e => e.type === 'capture').map(e => S.roster[e.species] ? S.roster[e.species].name : e.species);
  $('#modal').innerHTML = `<div class="mod" role="dialog" aria-modal="true" aria-labelledby="offt">
   <h2 id="offt">Bentornato!</h2>
   <p class="msub">Mentre eri via (${h >= 48 ? Math.round(h / 24) + ' giorni' : h + ' h ' + mi + ' min'}${r.seconds >= F.offlineCap(S) ? `, massimo ${F.offlineCap(S) / 3600} ore${F.hasPass(S) ? '' : ' (16 col Pass)'}` : ''}) la squadra ha combattuto da sola.</p>
   <div class="card"><div class="kv"><span>Nemici sconfitti</span><b>${fmt(r.kills)}</b></div><div class="kv"><span>Oro</span><b>+${cfmt(r.gold)}</b></div><div class="kv"><span>Oggetti trovati</span><b>${fmt(r.items)}</b></div>${Object.keys(r.runes).filter(k => r.runes[k] > 0).map(k => `<div class="kv"><span style="color:${F.RUNE[k].color}">${F.RUNE[k].label}</span><b>+${fmt(r.runes[k])}</b></div>`).join('')}
   ${r.levels.map(l => `<div class="kv"><span>${esc(S.roster[l.id].name)}</span><b>Lv ${l.from} → ${l.to}</b></div>`).join('')}</div>
   ${caps.length ? `<div class="card" style="border-color:#F2C14E"><b style="color:#F2C14E">Catture:</b> ${caps.map(esc).join(', ')}</div>` : ''}
   <button class="pb wide" data-act="close">Raccogli</button></div>`;
  $('#modal').hidden = false;
  r.events.filter(e => e.type === 'capture').forEach(e => capQueue.push(e.species));
}
function skipTime(hours) {
  const total = hours * 3600, chunk = 6 * 3600;
  let done = 0; const sum = { seconds: 0, gold: 0, kills: 0, items: 0, runes: { noncomune: 0, rara: 0, epica: 0, leggendaria: 0 }, levels: {}, events: [] };
  $('#modal').innerHTML = `<div class="mod" role="dialog" aria-modal="true"><h2>Avanti veloce</h2><p class="msub" id="skipst">Simulazione in corso…</p><div class="bar"><b id="skipbar" style="width:0%"></b></div></div>`;
  $('#modal').hidden = false;
  const run = () => {
    const sec = Math.min(chunk, total - done);
    const r = F.simulateOffline(S, sec, true);
    sum.seconds += r.seconds; sum.gold += r.gold; sum.kills += r.kills; sum.items += r.items;
    for (const k in r.runes) sum.runes[k] += r.runes[k];
    for (const l of r.levels) { if (!sum.levels[l.id]) sum.levels[l.id] = { id: l.id, from: l.from, to: l.to }; else sum.levels[l.id].to = l.to; }
    sum.events.push(...r.events);
    done += sec;
    $('#skipbar').style.width = (100 * done / total) + '%'; $('#skipst').textContent = `Simulazione in corso… ${Math.round(done / 3600)} h su ${hours} h`;
    if (done < total) setTimeout(run, 0);
    else {
      if (hours >= 8) F.ensureShop(S, Date.now(), true);
      F.checkAch(S); save(); B = F.startBattle(S); buildScene();
      sum.levels = Object.values(sum.levels); closeModal(); showOffline(sum); dirty = true;
    }
  };
  setTimeout(run, 30);
}
function closeModal() { equipOpen = null; $('#modal').hidden = true; $('#modal').innerHTML = ''; }

// ---------- chat globale e drop rari (Supabase) ----------
const NET = { url: 'https://nvfpiwrienohvavvceqi.supabase.co', key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im52ZnBpd3JpZW5vaHZhdnZjZXFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI4NTQ4MzYsImV4cCI6MjEwODQzMDgzNn0.M_fmOZlu6qbdXw5flxwQsdvJxCgeMTY-WOpxwcLRSpA' };
const BAD = ['cazz', 'stronz', 'vaffanc', 'puttan', 'merd', 'coglion', 'troia', 'fuck', 'shit', 'bitch', 'negr', 'fanculo'];
const clean = t => BAD.reduce((x, w) => x.replace(new RegExp(w + '\\w*', 'gi'), m => '*'.repeat(m.length)), t);
async function api(path, body) {
  const r = await fetch(NET.url + '/rest/v1/' + path, { method: body ? 'POST' : 'GET', headers: { apikey: NET.key, Authorization: 'Bearer ' + NET.key, 'Content-Type': 'application/json' }, body: body ? JSON.stringify(body) : undefined });
  if (!r.ok) { let m = 'errore'; try { m = (await r.json()).message || m; } catch (e) {} throw new Error(m); }
  const txt = await r.text(); return txt ? JSON.parse(txt) : null;
}
let chatOpen = false, chatTab = 'chat', chatMsgs = [], chatDrops = [], chatTimer = null, chatErr = '', lastSeenChat = 0;
const ago = t => { const d = (Date.now() - new Date(t).getTime()) / 1000; return d < 60 ? 'ora' : d < 3600 ? Math.floor(d / 60) + ' min' : d < 86400 ? Math.floor(d / 3600) + ' h' : Math.floor(d / 86400) + ' g'; };
async function chatLoad() {
  try {
    if (chatTab === 'chat') chatMsgs = (await api('it_chat?select=id,player_id,nickname,body,created_at&order=id.desc&limit=60')).reverse();
    else chatDrops = await api('it_drops?select=id,nickname,rarity,slot,zone,ilvl,created_at&order=id.desc&limit=40');
    chatErr = '';
    if (chatMsgs.length) { lastSeenChat = chatMsgs[chatMsgs.length - 1].id; try { localStorage.setItem('it_seen', lastSeenChat); } catch (e) {} }
  } catch (e) { chatErr = 'Connessione non riuscita. Riprovo tra poco.'; }
  if (chatOpen && document.querySelector('#modal .chatmod')) chatRender();
}
function chatRender() {
  const me = S.net && S.net.id, list = $('#chatlist'), atBottom = !list || list.scrollHeight - list.scrollTop - list.clientHeight < 40;
  let body;
  if (chatTab === 'chat') {
    body = `<div class="chatlist" id="chatlist">${chatMsgs.map(m => `<div class="cmsg${m.player_id === me ? ' me' : ''}"><time>${ago(m.created_at)}</time>${m.player_id !== me && me ? `<button class="rep" data-chat="report" data-id="${m.id}" aria-label="Segnala">segnala</button>` : ''}<span class="cn">${esc(m.nickname)}</span>${esc(clean(m.body))}</div>`).join('') || '<div class="note">Ancora nessun messaggio. Rompi il ghiaccio!</div>'}</div>
    ${S.net ? `<form class="chatform" id="chatform"><input id="chatin" maxlength="200" placeholder="Scrivi come ${esc(S.net.nick)}…" autocomplete="off" aria-label="Messaggio"><button class="pb" type="submit">Invia</button></form>`
      : `<form class="chatform" id="nickform"><input id="nickin" maxlength="16" minlength="3" placeholder="Scegli un nickname (3-16)" autocomplete="off" aria-label="Nickname"><button class="pb" type="submit">Entra</button></form><div class="note">Il nickname sarà visibile a tutti e non si può cambiare. Niente insulti: i messaggi segnalati da 3 giocatori spariscono.</div>`}`;
  } else {
    body = `<div class="note">Gli ultimi oggetti Astrale, Arcano e Segreto trovati da tutti i giocatori.</div><div class="chatlist">${chatDrops.map(d => { const r = F.ITEM_RARITY.find(x => x.key === d.rarity); return `<div class="cmsg dropg">${itemIcon(d.slot, null, r.color, 20)}<div style="flex:1"><span class="cn">${esc(d.nickname)}</span>ha trovato <b class="${r.rainbow ? 'rbw' : ''}" style="color:${r.color}">${r.label}</b> · ${F.SLOT_LABEL[d.slot] || esc(d.slot)} Lv ${d.ilvl}<div class="msub">Zona ${d.zone} · ${ago(d.created_at)}</div></div></div>`; }).join('') || '<div class="note">Nessun drop raro ancora: il primo potresti essere tu.</div>'}</div>`;
  }
  $('#modal').innerHTML = `<div class="mod chatmod" role="dialog" aria-modal="true" aria-label="Chat globale"><div class="eqhead"><h2 style="margin:0;font-size:18px">Community</h2><button class="ib" data-chat="close" aria-label="Chiudi" style="margin-left:auto">✕</button></div>
  <div class="tabs2"><button class="sb${chatTab === 'chat' ? ' on' : ''}" data-chat="tab" data-v="chat">Chat</button><button class="sb${chatTab === 'drops' ? ' on' : ''}" data-chat="tab" data-v="drops">Drop rari</button></div>
  ${chatErr ? `<div class="note" style="color:#FF8A96">${chatErr}</div>` : ''}${body}</div>`;
  $('#modal').hidden = false;
  const l = $('#chatlist'); if (l && atBottom) l.scrollTop = l.scrollHeight;
}
function chatShow() { chatOpen = true; $('#chatbtn').classList.remove('dot'); chatRender(); chatLoad(); clearInterval(chatTimer); chatTimer = setInterval(chatLoad, 6000); }
function chatClose() { chatOpen = false; clearInterval(chatTimer); closeModal(); }
// invia al server i drop rari non ancora condivisi (anche quelli trovati offline)
async function shareDrops() {
  if (!S.net || !S.rareLog) return;
  for (const e of S.rareLog.filter(x => !x.sent).reverse().slice(0, 5)) {
    try { await api('rpc/it_post_drop', { p_token: S.net.token, p_rarity: e.rarity, p_slot: e.slot, p_zone: e.zone, p_ilvl: e.ilvl }); e.sent = true; } catch (err) { e.sent = true; }
  }
}
// pallino sul pulsante se ci sono messaggi nuovi
async function chatPeek() { if (chatOpen) return; try { const r = await api('it_chat?select=id&order=id.desc&limit=1'); const seen = +(localStorage.getItem('it_seen') || 0); if (r && r[0] && r[0].id > seen) $('#chatbtn').classList.add('dot'); } catch (e) {} }
document.addEventListener('click', async e => {
  const t = e.target.closest('[data-chat]'); if (!t) return;
  const a = t.dataset.chat;
  if (a === 'open') chatShow();
  else if (a === 'close') chatClose();
  else if (a === 'tab') { chatTab = t.dataset.v; chatRender(); chatLoad(); }
  else if (a === 'report') { try { await api('rpc/it_report', { p_token: S.net.token, p_chat_id: +t.dataset.id }); toast('Segnalazione inviata, grazie'); } catch (err) { toast('Segnalazione non riuscita'); } }
});
document.addEventListener('submit', async e => {
  if (e.target.id === 'nickform') {
    e.preventDefault(); const v = $('#nickin').value.trim();
    if (v.length < 3) { toast('Il nickname deve avere almeno 3 caratteri'); return; }
    if (BAD.some(w => v.toLowerCase().includes(w))) { toast('Scegli un nickname senza parolacce'); return; }
    try { const r = await api('rpc/it_register', { p_nickname: v }); S.net = { id: r.id, token: r.token, nick: r.nickname }; save(); toast('Benvenuto in chat, ' + esc(r.nickname) + '!', '#7FE3FF'); shareDrops(); chatRender(); }
    catch (err) { toast(/taken/.test(err.message) ? 'Nickname già usato, scegline un altro' : /check/.test(err.message) ? 'Usa solo lettere, numeri, spazi, _ . -' : 'Registrazione non riuscita'); }
  } else if (e.target.id === 'chatform') {
    e.preventDefault(); const inp = $('#chatin'), v = inp.value.trim(); if (!v) return;
    try { await api('rpc/it_post_message', { p_token: S.net.token, p_body: v }); inp.value = ''; await chatLoad(); const l = $('#chatlist'); if (l) l.scrollTop = l.scrollHeight; }
    catch (err) { toast(/too_fast/.test(err.message) ? 'Piano! Aspetta qualche secondo' : 'Messaggio non inviato'); }
  }
});
setInterval(() => { shareDrops(); chatPeek(); }, 60000); setTimeout(() => { shareDrops(); chatPeek(); }, 3000);

// ---------- input ----------
document.addEventListener('click', e => {
  const t = e.target.closest('[data-act],[data-tab]'); if (!t) return;
  if (t.dataset.tab) { tab = t.dataset.tab; selItem = null; render(); $('#panel').scrollTop = 0; return; }
  const a = t.dataset.act, id = t.dataset.id, item = +t.dataset.item;
  const rebuild = () => { B = F.startBattle(S); buildScene(); };
  if (a === 'openm') openMember = openMember === id ? null : id;
  else if (a === 'up') F.moveMember(S, id, -1);
  else if (a === 'down') F.moveMember(S, id, 1);
  else if (a === 'add') { F.addToTeam(S, id); rebuild(); }
  else if (a === 'bench') { F.removeFromTeam(S, id); openMember = null; rebuild(); }
  else if (a === 'uneq') F.unequip(S, id, t.dataset.slot);
  else if (a === 'selit') selItem = selItem === item ? null : item;
  else if (a === 'equipall') { const n = F.autoEquip(S); toast(n ? `Equipaggiati ${n} oggetti` : 'Nessun miglioramento disponibile'); }
  else if (a === 'sellrest') { const r = F.sellRest(S); toast(r.n ? `Venduti ${r.n} oggetti per ${cfmt(r.gold)} oro` : 'Niente da vendere'); }
  else if (a === 'eqto') { F.equipTo(S, item, id || $('#eqsel').value); selItem = null; eqSel = null; }
  else if (a === 'eqpick') { eqSel = eqSel === item ? null : item; }
  else if (a === 'sell') { F.sellItem(S, item); selItem = null; }
  else if (a === 'equip') { selSlot = null; eqSel = null; showEquip(id); return; }
  else if (a === 'selslot') { const v = id + ':' + t.dataset.slot; selSlot = selSlot === v ? null : v; }
  else if (a === 'slotup') { if (F.upgradeSlot(S, id, t.dataset.slot)) rebuild(); }
  else if (a === 'sellrune1') { F.sellRunes(S, t.dataset.k, 1); }
  else if (a === 'sellruneall') { const g = F.sellRunes(S, t.dataset.k, S.runes[t.dataset.k]); toast(`+${g} Astri`); }
  else if (a === 'raise') { const it = S.inventory.find(x => x.id === item); if (it && F.raiseRarity(S, it)) { toast(`Rarità migliorata: ${esc(F.itemName(it))}`, F.ITEM_RARITY.find(x => x.key === it.rarity).color); if (S.settings.autoEquip) F.autoEquip(S); } }
  else if (a === 'buy') { if (F.buyShop(S, +t.dataset.i)) toast('Acquistato: lo trovi nello zaino'); }
  else if (a === 'reroll') { if (F.rerollShop(S)) toast('Il mercante ha cambiato la merce', '#F49AC1'); }
  else if (a === 'skip') { skipTime(+t.dataset.h); return; }
  else if (a === 'sellbelow') { const r = F.sellBelow(S); toast(r.n ? `Venduti ${r.n} oggetti per ${cfmt(r.gold)} oro` : 'Niente sotto la soglia'); }
  else if (a === 'claim') { const r = F.claimMission(S, id); if (r) toast(`Missione completata: +${r.astri} Astri, +1 ${F.RUNE[r.rune[0]].label.toLowerCase()}`, '#F2C14E'); }
  else if (a === 'buyhero') { if (F.buyHero(S, id)) { toast(F.SPECIES[id].name + ' si unisce alla squadra! (versione di prova)', '#F2C14E'); rebuild(); } }
  else if (a === 'bagview') { bagView = t.dataset.v; selItem = null; }
  else if (a === 'tochest') { F.toChest(S, +t.dataset.item); selItem = null; }
  else if (a === 'fromchest') { F.fromChest(S, +t.dataset.item); selItem = null; }
  else if (a === 'daily') { const g = F.claimDaily(S); if (g) toast(`+${g} ${icon('gem', '#F49AC1', 14)} Astri: regalo del giorno`, '#F49AC1'); }
  else if (a === 'pass') { F.activatePass(S); toast('Pass Astrale attivo per 30 giorni (versione di prova)', '#F2C14E'); }
  else if (a === 'zone') { if (F.setZone(S, +t.dataset.z)) { rebuild(); banner('ZONA ' + S.zone); } }
  else if (a === 'tree') { F.buyTree(S, t.dataset.k); }
  else if (a === 'treereset') { if (confirmTree > Date.now()) { const b = F.resetTree(S); confirmTree = 0; toast(`Recuperati ${cfmt(b)} oro`); rebuild(); } else confirmTree = Date.now() + 3000; }
  else if (a === 'reset') { if (confirmReset > Date.now()) { S = F.newState(); save(); rebuild(); confirmReset = 0; toast('Nuova partita'); } else confirmReset = Date.now() + 3000; }
  else if (a === 'capadd') { F.addToTeam(S, id); rebuild(); closeModal(); }
  else if (a === 'share') { const m = S.roster[id], d = F.SPECIES[m.species]; const txt = `Ho catturato ${m.name} (${F.RARITY[d.rarity].label}, ${d.cls}) in Frontiera Arcana dopo ${fmt(m.waitKills)} incontri!`; try { navigator.clipboard.writeText(txt).then(() => { t.textContent = 'Copiato!'; }, () => { t.textContent = 'Copia non riuscita'; }); } catch (err) { t.textContent = 'Copia non riuscita'; } return; }
  else if (a === 'close') { closeModal(); }
  else if (a === 'lockm' || a === 'autoeq' || a === 'test' || a === 'minr') return; // gestiti da change
  if (a === 'tree' || a === 'treereset') { /* stelle cambiano le statistiche */ B.party.forEach(() => {}); }
  save(); render(); if (equipOpen && !$('#modal').hidden) { const y = $('#modal .mod') ? $('#modal .mod').scrollTop : 0; showEquip(equipOpen); if ($('#modal .mod')) $('#modal .mod').scrollTop = y; }
});
document.addEventListener('change', e => {
  const t = e.target; const a = t.dataset && t.dataset.act; if (!a) return;
  if (a === 'lockm') S.roster[t.dataset.id].locked = t.checked;
  if (a === 'autoeq') { S.settings.autoEquip = t.checked; if (t.checked) F.autoEquip(S); }
  if (a === 'test') S.settings.test = t.checked;
  if (a === 'minr') S.settings.minRarity = t.value;
  save(); render(); hud();
});
document.addEventListener('submit', e => {
  const f = e.target.closest('form.rename'); if (!f) return; e.preventDefault();
  const v = f.querySelector('input').value.trim(); if (v) { S.roster[f.dataset.id].name = v.slice(0, 16); save(); toast('Nome salvato'); }
  if (!$('#modal').hidden && f.closest('#modal')) { const h = $('#capname'); if (h) h.textContent = v; } else render();
});

// ---------- ciclo ----------
let last = performance.now(), saveAt = 0, achAt = 0, renderAt = 0;
function frame(now) {
  let dt = Math.min(0.1, (now - last) / 1000); last = now;
  S.stats.played += dt;
  const speed = S.settings.test ? 5 : 1; let left = dt * speed;
  const ev = [];
  while (left > 0) { const d = Math.min(0.05, left); F.step(S, B, d, ev); left -= d; }
  handle(ev); updateScene(); hud();
  if (now - achAt > 1500) { achAt = now; for (const a of F.checkAch(S)) { toast(`Achievement: <b>${esc(a.name)}</b> · +${a.astri} Astri`, '#F2C14E'); dirty = true; } }
  if ($('#modal').hidden && capQueue.length) showCapture(capQueue.shift());
  if (dirty && now - renderAt > 700 && !document.activeElement.matches('input,select')) { renderAt = now; render(); }
  if (now - saveAt > 10000) { saveAt = now; if (F.ensureShop(S, Date.now())) toast('Il mercante ha nuovi oggetti', '#F49AC1'); save(); }
  requestAnimationFrame(frame);
}
function catchUp() {
  const away = (Date.now() - (S.lastSeen || Date.now())) / 1000;
  if (away > 30) { const r = F.simulateOffline(S, away); F.checkAch(S); save(); showOffline(r); }
  B = F.startBattle(S); buildScene();
}
document.addEventListener('visibilitychange', () => {
  if (document.hidden) save();
  else { catchUp(); last = performance.now(); dirty = true; }
});
window.addEventListener('pagehide', save);

const had = load();
F.ensureShop(S, Date.now());
if (!S.settings) S.settings = { autoEquip: true, test: false };
if (had) catchUp(); else { B = F.startBattle(S); buildScene(); toast('Benvenuto! La squadra combatte da sola: guarda, potenzia, cattura.', '#F2C14E'); }
banner('BATTAGLIA ' + S.battle);
setScroll(); render(); hud();
requestAnimationFrame(t => { last = t; frame(t); });
})();
