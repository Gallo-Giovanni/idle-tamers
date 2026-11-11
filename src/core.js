// Frontiera Arcana — logica di gioco (nessun riferimento allo schermo)
(function (root) {
'use strict';

const CLASSES = {
  Tank:      { hp: 160, atk: 8,  def: 6, spd: 1.4, color: '#6E9BFF', ability: 'Provocazione', desc: 'Attira gli attacchi nemici e subisce il 30% di danni in meno.' },
  Guerriero: { hp: 110, atk: 14, def: 3, spd: 1.1, color: '#F08A5D', ability: 'Fendente', desc: 'Ogni 3 attacchi sferra un colpo pesante: 220% dei danni sul bersaglio.' },
  Arciere:   { hp: 80,  atk: 12, def: 1, spd: 1.0, color: '#7ED36F', ability: 'Marchio', desc: 'Ogni 3 attacchi marchia il bersaglio: +30% danni subiti per 4 s.' },
  Curatore:  { hp: 85,  atk: 7,  def: 2, spd: 1.3, color: '#F2E27A', ability: 'Luce curativa', desc: 'Ogni 3 s cura l\'alleato più ferito: 10% della sua vita più il 150% del proprio attacco.' },
  Mago:      { hp: 70,  atk: 10, def: 1, spd: 1.6, color: '#C08CFF', ability: 'Tempesta arcana', desc: 'Ogni 5 s scaglia un fulmine arcano: 250% dei danni, ignora l\'armatura.' },
};

const RARITY = {
  comune:      { label: 'Comune',      weight: 3,   p: 1 / 6000 },
  noncomune:   { label: 'Non comune',  weight: 1.5, p: 1 / 12000 },
  rara:        { label: 'Rara',        weight: 0.6, p: 1 / 15000 },
  boss:        { label: 'Boss',        weight: 0,   p: 1 / 14000 },
};

const SPECIES = {
  hero:     { name: 'Eroe',     cls: 'Guerriero', rarity: null, hero: true, quote: '' },
  hero_arc: { name: 'Eroina Arciera', cls: 'Arciere', rarity: null, hero: true, quote: 'Una freccia, un bersaglio. Mai sprecare un colpo.' },
  hero_mag: { name: 'Eroe Mago',  cls: 'Mago',      rarity: null, hero: true, quote: 'La magia è solo pazienza molto veloce.' },
  glimmo:   { name: 'Glimmo',   cls: 'Arciere',   rarity: 'comune',    quote: 'Blip! Brillo solo per te.' },
  cometuga: { name: 'Cometuga', cls: 'Tank',      rarity: 'comune',    quote: 'Piano piano... ma arrivo sempre.' },
  sporello: { name: 'Sporello', cls: 'Curatore',      rarity: 'comune',    quote: 'Le mie spore sanno di luna.' },
  bzzt:     { name: 'Bzzt',     cls: 'Guerriero', rarity: 'noncomune', quote: 'Rotto? Ci penso io. A martellate.' },
  astrillo: { name: 'Astrillo', cls: 'Tank',      rarity: 'noncomune', quote: 'Il mio guscio ha fermato una cometa.' },
  nebulina: { name: 'Nebulina', cls: 'Mago',      rarity: 'rara',      quote: 'Le stelle mi hanno guidata fino a te. Adesso non ti liberi più di me.' },
  revuoto:  { name: 'Re Vuoto', cls: 'Guerriero', rarity: 'boss',      quote: 'Chi osa sconfiggere un re... merita di servirlo.' },
  scheggia:  { name: 'Scheggia',  cls: 'Guerriero', rarity: 'comune',    quote: 'Tagliente come il ghiaccio, fedele come una volpe.' },
  geodino:   { name: 'Geodino',   cls: 'Tank',      rarity: 'comune',    quote: 'Dentro sono tutto ametista. Fuori, roccia dura.' },
  lumispettro: { name: 'Lumispettro', cls: 'Curatore', rarity: 'comune',    quote: 'Non sono un fantasma. Sono solo molto luminoso.' },
  gemmerla:  { name: 'Gemmerla',  cls: 'Arciere',   rarity: 'noncomune', quote: 'Ogni mia piuma è una freccia di cristallo.' },
  quarzillo: { name: 'Quarzillo', cls: 'Tank',      rarity: 'noncomune', quote: 'Piccolo golem, grande abbraccio.' },
  prismella: { name: 'Prismella', cls: 'Mago',      rarity: 'rara',      quote: 'Spezzo la luce in sette colori, e i nemici in sette pezzi.' },
  reginaquarzo: { name: 'Regina di Quarzo', cls: 'Arciere', rarity: 'boss', quote: 'Una regina non si arrende. Sceglie solo chi servire.' },
};
// Pianeti e zone: 10 zone da 30 battaglie, 5 per pianeta
const PLANETS = [
  { name: 'Prati Stellari', zones: [1, 5], species: ['glimmo', 'cometuga', 'sporello', 'bzzt', 'astrillo', 'nebulina', 'revuoto'] },
  { name: 'Luna di Cristallo', zones: [6, 10], species: ['scheggia', 'geodino', 'lumispettro', 'gemmerla', 'quarzillo', 'prismella', 'reginaquarzo'] },
];
const ZONES = [null,
  { pool: ['glimmo', 'cometuga'], boss: 'cometuga' },
  { pool: ['glimmo', 'cometuga', 'sporello'], boss: 'sporello' },
  { pool: ['glimmo', 'cometuga', 'sporello', 'bzzt'], boss: 'bzzt' },
  { pool: ['glimmo', 'cometuga', 'sporello', 'bzzt', 'astrillo'], boss: 'astrillo' },
  { pool: ['glimmo', 'cometuga', 'sporello', 'bzzt', 'astrillo', 'nebulina'], boss: 'revuoto' },
  { pool: ['scheggia', 'geodino'], boss: 'geodino' },
  { pool: ['scheggia', 'geodino', 'lumispettro'], boss: 'lumispettro' },
  { pool: ['scheggia', 'geodino', 'lumispettro', 'gemmerla'], boss: 'gemmerla' },
  { pool: ['scheggia', 'geodino', 'lumispettro', 'gemmerla', 'quarzillo'], boss: 'quarzillo' },
  { pool: ['scheggia', 'geodino', 'lumispettro', 'gemmerla', 'quarzillo', 'prismella'], boss: 'reginaquarzo' },
];
const MAX_ZONE = 10;
const ALL_SPECIES = PLANETS.flatMap(p => p.species);
function planetOf(z) { return PLANETS.find(p => z >= p.zones[0] && z <= p.zones[1]); }
function zoneOf(sp) { for (let z = 1; z <= MAX_ZONE; z++) if (ZONES[z].pool.includes(sp) || ZONES[z].boss === sp) return z; return 1; }
function gIndex(z, n) { return (z - 1) * 30 + n; }

const ITEM_RARITY = [ // chiavi interne invariate per compatibilità dei salvataggi
  { key: 'comune',      label: 'Comune',      mult: 1,   weight: 60,    color: '#AEB4CF' },
  { key: 'noncomune',   label: 'Non comune',  mult: 1.4, weight: 25,    color: '#6CCB5F' },
  { key: 'rara',        label: 'Raro',        mult: 2,   weight: 10,    color: '#5B9BFF' },
  { key: 'epica',       label: 'Epico',       mult: 3,   weight: 4,     color: '#B07CF0' },
  { key: 'leggendaria', label: 'Leggendario', mult: 5,   weight: 0.75,  color: '#F2994A' },
  { key: 'mitico',      label: 'Mitico',      mult: 6,   weight: 0.25,  color: '#FFD34D' },
  { key: 'astrale',     label: 'Astrale',     mult: 7,   weight: 0.1,   color: '#FF7AD9' },
  { key: 'arcano',      label: 'Arcano',      mult: 10,  weight: 0.01,  color: '#E8334F' },
  { key: 'eterno',      label: 'Eterno',      mult: 12,  weight: 0.004, color: '#1FE0D0' },
  { key: 'segreto',     label: 'Segreto',     mult: 15,  weight: 0.002, color: '#FFFFFF', rainbow: true },
];
const RARE_FEED = ['astrale', 'arcano', 'eterno', 'segreto']; // drop annunciati nella sezione dei drop rari
// 11 posti di equipaggiamento; gli oggetti hanno 10 tipi (l'anello va in due posti)
const SLOTS = ['arma', 'secondaria', 'elmo', 'corazza', 'gambe', 'stivali', 'guanti', 'collana', 'orecchini', 'anello1', 'anello2'];
const KINDS = ['arma', 'secondaria', 'elmo', 'corazza', 'gambe', 'stivali', 'guanti', 'collana', 'orecchini', 'anello'];
const kindOf = sl => sl === 'anello1' || sl === 'anello2' ? 'anello' : sl;
const SLOT_LABEL = { arma: 'Arma', secondaria: 'Secondaria', elmo: 'Elmo', corazza: 'Corazza', gambe: 'Gambe', stivali: 'Stivali', guanti: 'Guanti', collana: 'Collana', orecchini: 'Orecchini', anello: 'Anello', anello1: 'Anello', anello2: 'Anello' };
const WEAPON = { Tank: 'Mazza cometa', Guerriero: 'Spada stellare', Arciere: 'Arco di luce', Mago: 'Bastone nebulare', Curatore: 'Scettro di luce' };
const SECONDARY = { Tank: 'Scudo cometa', Guerriero: 'Pugnale lunare', Arciere: 'Faretra siderale', Mago: 'Tomo runico', Curatore: 'Libro delle preghiere' };
const ITEM_NAME = { elmo: 'Elmo siderale', corazza: 'Corazza siderale', gambe: 'Gambali siderali', stivali: 'Stivali cometa', guanti: 'Guanti stellari', collana: 'Collana del vuoto', orecchini: 'Orecchini di nebula', anello: 'Anello lunare' };
const emptyEq = () => Object.fromEntries(SLOTS.map(k => [k, null]));
const emptySlv = () => Object.fromEntries(SLOTS.map(k => [k, 0]));

// Costellazioni: si accendono con l'oro (è l'unico uso dell'oro oltre alla vendita)
const starCost = (base, g) => l => Math.round(base * Math.pow(g, l));
const G = 2.6;
const TREE = {
  forza:    { name: 'Forza',    desc: 'Attacco della squadra +5% per livello', max: 30, cost: starCost(200, G) },
  vita:     { name: 'Vita',     desc: 'Vita dell\'eroe +6% per livello', max: 30, cost: starCost(150, G) },
  branco:   { name: 'Branco',   desc: 'Vita delle creature +6% per livello', max: 30, cost: starCost(150, G) },
  scudo:    { name: 'Scudo',    desc: 'Difesa della squadra +5% per livello', max: 30, cost: starCost(150, G) },
  lama:     { name: 'Lama',     desc: 'Probabilità di critico +1% per livello', max: 20, cost: starCost(300, 2) },
  furia:    { name: 'Furia',    desc: 'Danni critici +5% per livello', max: 20, cost: starCost(400, 2) },
  tesoro:   { name: 'Tesoro',   desc: 'Oro +5% per livello', max: 10, cost: starCost(500, 3) },
  saggezza: { name: 'Saggezza', desc: 'Esperienza +5% per livello', max: 20, cost: starCost(800, 2.4) },
  commercio:{ name: 'Commercio', desc: 'Oro dalla vendita degli oggetti +10% per livello', max: 10, cost: starCost(600, 3) },
  cometa:   { name: 'Cometa',   desc: 'Velocità di movimento della squadra +5% per livello', max: 10, cost: starCost(1000, 3) },
  corona:   { name: 'Corona',   desc: '+1 posto in squadra per livello', max: 4, cost: l => [50000, 2000000, 80000000, 3000000000][l] },
  richiamo: { name: 'Richiamo', desc: 'Probabilità di cattura +5% per livello (max +50%)', max: 10, cost: starCost(2000, 3) },
};

// Mappa delle costellazioni: posizione sulla mappa (0-100) e stella che va prima fatta crescere
const STARMAP = {
  forza:    { x: 50, y: 50, req: null, ic: '⚔' },
  vita:     { x: 28, y: 34, req: ['forza', 3], ic: '♥' },
  scudo:    { x: 72, y: 34, req: ['forza', 3], ic: '⛨' },
  branco:   { x: 16, y: 58, req: ['vita', 5], ic: '❀' },
  lama:     { x: 84, y: 58, req: ['scudo', 5], ic: '✦' },
  tesoro:   { x: 50, y: 16, req: ['forza', 8], ic: '◈' },
  saggezza: { x: 17, y: 12, req: ['tesoro', 3], ic: '✎' },
  commercio:{ x: 83, y: 12, req: ['tesoro', 3], ic: '⚖' },
  corona:   { x: 50, y: 69, req: ['forza', 10], ic: '♛' },
  cometa:   { x: 15, y: 85, req: ['branco', 5], ic: '☄' },
  richiamo: { x: 50, y: 87, req: ['lama', 5], ic: '✧' },
  furia:    { x: 85, y: 85, req: ['lama', 5], ic: '✸' },
};
function starOpen(s, k) { const r = STARMAP[k] && STARMAP[k].req; return !r || s.tree[r[0]] >= r[1]; }
const ACH = [
  { id: 'k1',    name: 'Primo sangue stellare', desc: 'Sconfiggi il primo nemico', test: s => s.stats.kills >= 1, astri: 2 },
  { id: 'k100',  name: 'Cento stelle spente', desc: 'Sconfiggi 100 nemici', test: s => s.stats.kills >= 100, astri: 5 },
  { id: 'k1000', name: 'Mille battaglie', desc: 'Sconfiggi 1.000 nemici', test: s => s.stats.kills >= 1000, astri: 10 },
  { id: 'k10k',  name: 'Flagello del vuoto', desc: 'Sconfiggi 10.000 nemici', test: s => s.stats.kills >= 10000, astri: 25 },
  { id: 'b10',   name: 'In marcia', desc: 'Raggiungi la zona 3', test: s => s.maxZone >= 3, astri: 5 },
  { id: 'b20',   name: 'Oltre l\'orizzonte', desc: 'Raggiungi la Luna di Cristallo (zona 6)', test: s => s.maxZone >= 6, astri: 10 },
  { id: 'boss1', name: 'Regicida', desc: 'Sconfiggi il Re Vuoto (zona 5)', test: s => s.cleared >= 5, astri: 15 },
  { id: 'boss2', name: 'Spezzacristalli', desc: 'Sconfiggi la Regina di Quarzo (zona 10)', test: s => s.cleared >= 10, astri: 30 },
  { id: 'c1',    name: 'Primo amico', desc: 'Cattura la prima creatura', test: s => capturedCount(s) >= 1, astri: 5 },
  { id: 'c4',    name: 'Piccolo zoo', desc: 'Cattura 4 creature', test: s => capturedCount(s) >= 4, astri: 10 },
  { id: 'c7',    name: 'Bestiario dei Prati', desc: 'Cattura tutte le creature di Prati Stellari', test: s => PLANETS[0].species.every(k => s.roster[k]), astri: 40 },
  { id: 'c14',   name: 'Bestiario della Luna', desc: 'Cattura tutte le creature della Luna di Cristallo', test: s => PLANETS[1].species.every(k => s.roster[k]), astri: 60 },
  { id: 'leg',   name: 'Bagliore leggendario', desc: 'Trova un oggetto leggendario o superiore', test: s => s.stats.legendary >= 1, astri: 10 },
  { id: 'full',  name: 'Squadra al completo', desc: 'Sblocca e riempi tutti i posti della squadra', test: s => creaturesInTeam(s) >= CREATURE_SLOTS, astri: 20 },
];

const OFFLINE_CAP = 4 * 3600; // 8 ore col Pass
const BOSS_BATTLE = 30;

function rnd(st) { // mulberry32 sul seed dello stato, così la simulazione è riproducibile
  let t = (st.seed = (st.seed + 0x6D2B79F5) >>> 0);
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
function pickWeighted(st, list, w) { let tot = 0; for (const x of list) tot += w(x); let r = rnd(st) * tot; for (const x of list) { r -= w(x); if (r <= 0) return x; } return list[list.length - 1]; }

function newState() {
  return {
    v: 1, seed: (Date.now() % 2147483647) >>> 0,
    gold: 0, runes: { noncomune: 0, rara: 0, epica: 0, leggendaria: 0, mitico: 0, astrale: 0, arcano: 0 }, astri: 0, shop: null, zone: 1, maxZone: 1, cleared: 0, battle: 1, maxBattle: 1, maxGlobal: 1,
    team: ['hero'], roster: { hero: newMember('hero', 1) }, inventory: [], chest: [], rareLog: [], nextId: 1,
    tree: { forza: 0, vita: 0, branco: 0, scudo: 0, lama: 0, furia: 0, tesoro: 0, saggezza: 0, commercio: 0, cometa: 0, richiamo: 0, corona: 0 },
    hunt: {}, // uccisioni per specie non ancora catturata
    stats: { kills: 0, gold: 0, items: 0, legendary: 0, wins: 0, losses: 0, played: 0, perMin: [] },
    ach: {}, settings: { autoEquip: false, test: false }, lastSeen: Date.now(),
  };
}
function newMember(species, lvl) {
  return { species, name: SPECIES[species].name, lvl, xp: 0, eq: emptyEq(), slv: emptySlv(), locked: false, capturedAt: Date.now(), waitKills: 0 };
}
function capturedCount(s) { return ALL_SPECIES.filter(k => s.roster[k]).length; }
// Squadra: 4 posti per le creature; gli eroi (Guerriero gratis, gli altri dal negozio) non occupano posti
// Si parte con 4 posti (eroi esclusi); ogni boss indicato sblocca un posto in più
let SLOT_UNLOCKS = [5, 10, 15, 20]; // +1 posto ogni 5 zone (15 e 20 arriveranno con i nuovi pianeti)
if (typeof process !== 'undefined' && process.env && process.env.SLOTS) SLOT_UNLOCKS = JSON.parse(process.env.SLOTS);
const BASE_SLOTS = 4;
const CREATURE_SLOTS = 12; // massimo: 4 di base + 4 dalle zone + 4 dalla stella Corona
function isHero(id) { return !!(SPECIES[id] && SPECIES[id].hero); }
function slotCount(s) { return Math.min(CREATURE_SLOTS, BASE_SLOTS + SLOT_UNLOCKS.filter(z => s.cleared >= z).length + (s.tree.corona || 0)); }
function nextSlotZone(s) { return SLOT_UNLOCKS.find(z => s.cleared < z && z <= MAX_ZONE) || null; }
function creaturesInTeam(s) { return s.team.filter(id => !isHero(id)).length; }
function teamFull(s) { return creaturesInTeam(s) >= slotCount(s); }
// Eroi extra in vendita (prezzi in euro; nella versione di prova si sbloccano gratis)
const HERO_SHOP = [{ id: 'hero_arc', price: '1,99 €' }, { id: 'hero_mag', price: '4,99 €' }];
const PASS_PRICE = '9,99 € / mese';
// Astri gratuiti ogni giorno: si riscuotono una volta, si rinnovano a mezzanotte (ora locale)
const DAILY_ASTRI = 20;
function dayKey(now) { const d = new Date(now); return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate(); }
function dailyReady(s, now) { return s.daily !== dayKey(now || Date.now()); }
function claimDaily(s, now) { if (!dailyReady(s, now)) return 0; s.daily = dayKey(now || Date.now()); s.astri += DAILY_ASTRI; return DAILY_ASTRI; }
function nextMidnight(now) { const d = new Date(now); d.setHours(24, 0, 0, 0); return d.getTime(); }
function buyHero(s, id) { if (!isHero(id) || s.roster[id]) return false; s.roster[id] = newMember(id, 1); s.team.push(id); return true; }
let LEVEL_CAP = 50; if (typeof process !== 'undefined' && process.env && process.env.LCAP) LEVEL_CAP = +process.env.LCAP;
function xpNeed(l) { return Math.round(100 * Math.pow(1.5, Math.min(l, 30) - 1) * (l > 30 ? Math.pow(l - 29, +(typeof process !== 'undefined' && process.env && process.env.XPP) || 2) : 1)); } // oltre il 30 cresce più piano: si sale sempre un po' anche quando si è bloccati
// ---------- Statistiche degli oggetti ----------
// Statistiche principali dal tipo; statistiche bonus casuali: 0 comune, 1 non comune, 2 rara, 3 epica, 4 leggendaria
const STAT_LABEL = { atk: 'Danni', hp: 'PV massimi', def: 'Difesa', crit: 'Prob. critico', critDmg: 'Danni critici', aspd: "Vel. d'attacco", block: 'Blocco', dodge: 'Schivata' };
const PCT_STATS = ['crit', 'critDmg', 'aspd', 'block', 'dodge'];
const BONUS_KEYS = ['atk', 'hp', 'def', 'crit', 'critDmg', 'aspd', 'block', 'dodge'];
const BONUS_DEF = { atk: 0.12, hp: 0.8, def: 0.04, crit: 0.02, critDmg: 0.08, aspd: 0.04, block: 0.03, dodge: 0.03 };
const SUFFIX = { atk: 'della Furia', hp: 'del Gigante', def: 'della Roccia', crit: 'del Falco', critDmg: 'della Tempesta', aspd: 'del Vento', block: 'del Bastione', dodge: "dell'Ombra" };
const BONUS_COUNT = { comune: 0, noncomune: 1, rara: 2, epica: 3, leggendaria: 4, mitico: 4, astrale: 4, arcano: 5, eterno: 5, segreto: 5 };
const rarMult = k => ITEM_RARITY.find(r => r.key === k).mult;
function itemBase(it) { return 4 * Math.pow(1.04, it.ilvl) * rarMult(it.rarity) * (1 + 0.1 * (it.up || 0)); }
function pctScale(it) { return Math.sqrt(rarMult(it.rarity)) * (1 + it.ilvl / 300); }
function mainStats(it) {
  const P = itemBase(it), q = pctScale(it), c = it.cls, o = {};
  switch (it.slot) {
    case 'arma': if (c === 'Tank') { o.atk = P * 0.4; o.def = P * 0.15; } else if (c === 'Arciere') { o.atk = P * 0.6; o.crit = 0.02 * q; } else if (c === 'Curatore') o.atk = P * 0.5; else o.atk = P * 0.7; break;
    case 'secondaria': if (c === 'Tank') { o.def = P * 0.3; o.block = 0.03 * q; } else if (c === 'Arciere') { o.atk = P * 0.2; o.crit = 0.015 * q; } else if (c === 'Guerriero') { o.atk = P * 0.25; o.aspd = 0.03 * q; } else o.atk = P * 0.3; break;
    case 'elmo': o.hp = P * 1.5; o.def = P * 0.05; break;
    case 'corazza': o.hp = P * 3; o.def = P * 0.1; o.block = 0.01 * q; break;
    case 'gambe': o.hp = P * 2; o.def = P * 0.05; break;
    case 'stivali': o.hp = P * 1; o.dodge = 0.02 * q; break;
    case 'guanti': o.atk = P * 0.2; o.aspd = 0.03 * q; break;
    case 'collana': o.hp = P * 1.5; o.atk = P * 0.2; break;
    case 'orecchini': o.critDmg = 0.06 * q; o.crit = 0.01 * q; break;
    case 'anello': o.atk = P * 0.15; o.crit = 0.015 * q; break;
  }
  return o;
}
function bonusValue(it, b) { return PCT_STATS.includes(b.k) ? BONUS_DEF[b.k] * b.r * pctScale(it) : BONUS_DEF[b.k] * b.r * itemBase(it); }
function itemStats(it) { const o = mainStats(it); for (const b of it.bonus || []) o[b.k] = (o[b.k] || 0) + bonusValue(it, b); return o; }
function rollBonus(s, it) { const have = (it.bonus || []).map(b => b.k), pool = BONUS_KEYS.filter(k => !have.includes(k)); const k = pool[Math.floor(rnd(s) * pool.length)]; it.bonus = (it.bonus || []).concat([{ k, r: 0.5 + rnd(s) * 0.5 }]); }
function finishItem(s, it) { it.bonus = []; for (let i = 0; i < BONUS_COUNT[it.rarity]; i++) rollBonus(s, it); return it; }
// Punteggio dell'oggetto: serve per confrontare e vendere
function itemPower(it) { return Math.round(itemBase(it) * (1 + 0.12 * ((it.bonus || []).length))); }
function itemName(it) { const base = it.slot === 'arma' ? WEAPON[it.cls] : it.slot === 'secondaria' ? SECONDARY[it.cls] : ITEM_NAME[it.slot]; const b = it.bonus && it.bonus[0]; return b ? base + ' ' + SUFFIX[b.k] : base; }
function upgradeCost(it) { return Math.round(itemPower(it) * 6 * (1 + it.up)); }
let _sellBonus = 0; // impostato dallo stato attivo (stella Commercio)
function sellValue(it, s) { const c = s ? (s.tree.commercio || 0) : _sellBonus; return Math.round(itemPower(it) * 1.5 * (1 + 0.1 * c)); }
function canUse(m, it) { return (it.slot !== 'arma' && it.slot !== 'secondaria') || it.cls === SPECIES[m.species].cls; }
// posto in cui va l'oggetto: quello libero o il più debole tra quelli del suo tipo
function targetSlot(m, it) { let best = null, bp = Infinity; for (const sl of SLOTS) { if (kindOf(sl) !== it.slot) continue; const c = m.eq[sl], p = c ? itemPower(c) : -1; if (p < bp) { bp = p; best = sl; } } return best; }

function classCounts(s) { const c = { Tank: 0, Guerriero: 0, Arciere: 0, Mago: 0, Curatore: 0 }; for (const id of s.team) c[SPECIES[s.roster[id].species].cls]++; return c; }

function memberStats(s, id) {
  const m = s.roster[id], cls = SPECIES[m.species].cls, b = CLASSES[cls];
  const lm = 1 + 0.15 * (m.lvl - 1);
  let hp = b.hp * lm, atk = b.atk * lm, def = b.def * lm, crit = 0.05, critDmg = 1.5;
  let aspd = 0, block = 0, dodge = 0;
  for (const sl of SLOTS) {
    const it = m.eq[sl]; if (!it) continue; const sm = 1 + 0.1 * ((m.slv && m.slv[sl]) || 0), st = itemStats(it);
    atk += (st.atk || 0) * sm; hp += (st.hp || 0) * sm; def += (st.def || 0) * sm;
    crit += (st.crit || 0) * sm; critDmg += (st.critDmg || 0) * sm; aspd += (st.aspd || 0) * sm; block += (st.block || 0) * sm; dodge += (st.dodge || 0) * sm;
  }
  if (SPECIES[m.species].hero) hp *= 1 + 0.06 * s.tree.vita; else hp *= 1 + 0.06 * s.tree.branco;
  atk *= 1 + 0.05 * s.tree.forza;
  def *= 1 + 0.05 * s.tree.scudo;
  crit += 0.01 * s.tree.lama; critDmg += 0.05 * (s.tree.furia || 0);
  return { hp: Math.round(hp), atk: Math.round(atk), def: Math.round(def * 10) / 10, spd: b.spd / (1 + Math.min(aspd, 1)), crit: Math.min(crit, 0.75), critDmg, block: Math.min(block, 0.5), dodge: Math.min(dodge, 0.4), aspd: Math.min(aspd, 1), cls };
}
function memberPower(s, id) { const st = memberStats(s, id); return Math.round(st.hp / 6 + st.atk * 2 + st.def * 3 + st.crit * 100); }

// ---------------- Battaglia ----------------
// Curva a tre tratti: le prime battaglie volano, poi la difficoltà accelera (prima parte facile, muro verso il boss)
// Ogni zona: prime battaglie facili, poi accelera verso il boss. Ogni zona nuova parte un po' sotto il boss della precedente.
function withinZone(n) {
  const a = Math.min(n, 10) - 1, b = Math.max(0, Math.min(n, 20) - 10), c = Math.max(0, n - 20);
  return Math.pow(1.03, a) * Math.pow(1.07, b) * Math.pow(1.12, c);
}
// Passo tra le zone: sul primo pianeta più dolce, sul secondo più ripido (la squadra è già grande)
let ZONE_K = [0, 0, 0.55, 0.55, 0.55, 0.55, 0.45, 0.45, 0.45, 0.45, 0.45];
if (typeof process !== 'undefined' && process.env && process.env.ZK) ZONE_K = JSON.parse(process.env.ZK);
const ZONE_BASE = [0, 1]; for (let z = 2; z <= 10; z++) ZONE_BASE[z] = ZONE_BASE[z - 1] * withinZone(30) * ZONE_K[z];
function enemyScale(z, n) { return ZONE_BASE[z] * withinZone(n); }

function makeEnemies(s) {
  const n = s.battle, Z = ZONES[s.zone], f = enemyScale(s.zone, n), pool = Z.pool;
  const list = [];
  const count = n === BOSS_BATTLE ? 2 : 3;
  for (let i = 0; i < count; i++) list.push(pickWeighted(s, pool, k => RARITY[SPECIES[k].rarity].weight));
  if (n === BOSS_BATTLE) list.unshift(Z.boss);
  return list.map((sp, i) => {
    const cls = SPECIES[sp].cls, boss = n === BOSS_BATTLE && i === 0, b = CLASSES[cls];
    const big = s.zone % 5 === 0; // i boss di pianeta (zone 5 e 10) sono più duri
    const hp = Math.round(b.hp * 0.45 * f * (boss ? (big ? 8 : 4) : 1));
    return { side: 'e', idx: i, species: sp, cls, boss, hp, maxHp: hp, atk: b.atk * 0.46 * f * (boss ? (big ? 1.6 : 1.3) : 1), def: b.def * 0.5 * f, spd: b.spd * 1.15, crit: 0.05, critDmg: 1.5, t: rnd(s) * b.spd, mark: 0, hits: 0, ab: 0, dealt: 0, taken: 0, arrive: (0.6 + i * 1.1) / moveSpeed(s), arriveMax: (0.6 + i * 1.1) / moveSpeed(s) };
  });
}

// La vita NON si ricarica tra una battaglia e l'altra: solo i Curatori curano.
// Si torna a vita piena quando cambia la zona, quando la zona ricomincia dopo il boss o quando la squadra cade.
function startBattle(s) {
  s.runHp = s.runHp || {};
  const party = s.team.map((id, i) => { const st = memberStats(s, id), fr = s.runHp[id] === undefined ? 1 : s.runHp[id]; return { side: 'p', idx: i, id, species: s.roster[id].species, cls: st.cls, hp: Math.round(st.hp * fr), maxHp: st.hp, atk: st.atk, def: st.def, spd: st.spd, crit: st.crit, critDmg: st.critDmg, block: st.block, dodge: st.dodge, t: rnd(s) * st.spd, mark: 0, hits: 0, ab: 0, dealt: 0, taken: 0 }; });
  return { party, enemies: makeEnemies(s), time: 0, over: null, pause: 0 };
}

function alive(list) { return list.filter(u => u.hp > 0); }
function ready(list) { return list.filter(u => u.hp > 0 && !(u.arrive > 0)); }
function frontTarget(list) {
  const a = ready(list); if (!a.length) return null;
  const tank = a.find(u => u.cls === 'Tank'); return tank || a[0];
}

function dealDamage(s, b, src, dst, mult, ignoreDef, ev) {
  if (dst.dodge && rnd(s) < dst.dodge) { if (ev) ev.push({ type: 'dodge', side: dst.side, idx: dst.idx }); return; }
  let dmg = src.atk * mult;
  let crit = false;
  if (rnd(s) < src.crit) { dmg *= src.critDmg; crit = true; }
  if (!ignoreDef) dmg *= src.atk / (src.atk + 1.5 * dst.def); // difesa a rendimento decrescente: niente muri impossibili
  if (dst.mark > 0) dmg *= 1.3;
  if (dst.cls === 'Tank' && dst.side === 'p') dmg *= 0.7;
  if (dst.block && rnd(s) < dst.block) dmg *= 0.5;
  dmg = Math.max(1, Math.round(dmg));
  const real = Math.min(dmg, dst.hp); src.dealt += real; dst.taken += real;
  dst.hp -= dmg;
  if (ev) ev.push({ type: 'dmg', side: dst.side, idx: dst.idx, dmg, crit });
  if (dst.hp <= 0) { dst.hp = 0; if (dst.side === 'e') onKill(s, b, dst, ev); }
}

function attack(s, b, u, ev) {
  const foes = u.side === 'p' ? b.enemies : b.party;
  const tgt = u.side === 'e' ? frontTarget(foes) : ready(foes)[0];
  if (!tgt) return;
  u.hits++;
  if (ev) ev.push({ type: 'atk', side: u.side, idx: u.idx });
  if (u.side === 'p' && u.cls === 'Guerriero' && u.hits % 3 === 0) {
    if (ev) ev.push({ type: 'skill', side: 'p', idx: u.idx, name: 'Fendente!' });
    dealDamage(s, b, u, tgt, 2.2, false, ev);
    return;
  }
  if (u.side === 'p' && u.cls === 'Arciere' && u.hits % 3 === 0) {
    tgt.mark = 4; if (ev) ev.push({ type: 'skill', side: 'p', idx: u.idx, name: 'Marchio!' });
  }
  dealDamage(s, b, u, tgt, 1, false, ev);
}

function step(s, b, dt, ev) {
  if (b.over) { b.pause -= dt; if (b.pause <= 0) finishBattle(s, b, ev); return; }
  b.time += dt;
  for (const u of b.party.concat(b.enemies)) {
    if (u.hp <= 0) continue;
    if (u.arrive > 0) { u.arrive -= dt; continue; }
    if (u.mark > 0) u.mark -= dt;
    if (u.side === 'p' && u.cls === 'Curatore') {
      u.ab += dt;
      if (u.ab >= 3) {
        let w = null; for (const a of b.party) if (a.hp > 0 && a.hp < a.maxHp && (!w || a.hp / a.maxHp < w.hp / w.maxHp)) w = a;
        if (w) { u.ab = 0; const h = Math.round(Math.min(w.maxHp - w.hp, w.maxHp * 0.10 + u.atk * 1.5)); w.hp += h; u.healed = (u.healed || 0) + h; if (ev) ev.push({ type: 'heal', idx: w.idx, h }); }
      }
    }
    if (u.side === 'p' && u.cls === 'Mago') {
      u.ab += dt;
      const tg = ready(b.enemies)[0];
      if (u.ab >= 5 && tg) { u.ab = 0; if (ev) ev.push({ type: 'skill', side: 'p', idx: u.idx, name: 'Fulmine arcano!' }); dealDamage(s, b, u, tg, 2.5, true, ev); }
    }
    u.t -= dt;
    if (u.t <= 0) { u.t += u.spd; attack(s, b, u, ev); }
  }
  if (!alive(b.enemies).length) { b.over = 'win'; b.pause = 1.0 / moveSpeed(s); }
  else if (!alive(b.party).length) { b.over = 'lose'; b.pause = 1.5; }
  else if (b.time > 90) { b.over = 'lose'; b.pause = 1.5; } // stallo
}

function finishBattle(s, b, ev) {
  s.runHp = {}; for (const u of b.party) s.runHp[u.id] = Math.max(0, u.hp) / u.maxHp;
  if (b.over === 'win') {
    s.stats.wins++;
    if (s.battle === BOSS_BATTLE) {
      const first = s.zone > s.cleared;
      if (first) {
        s.cleared = s.zone;
        if (SLOT_UNLOCKS.includes(s.zone)) { // nuovo posto: entra la creatura più forte della riserva
          const res = Object.keys(s.roster).filter(id => !s.team.includes(id) && !isHero(id)).sort((a, c) => s.roster[c].lvl - s.roster[a].lvl);
          if (res.length && !teamFull(s)) s.team.push(res[0]);
          if (ev) ev.push({ type: 'unlock', text: 'Nuovo posto in squadra sbloccato!' });
        }
        if (s.zone < MAX_ZONE) { s.maxZone = Math.max(s.maxZone, s.zone + 1); s.zone++; s.maxBattle = 1; if (ev) ev.push({ type: 'unlock', text: `Zona ${s.zone} sbloccata!` }); }
      }
      s.battle = 1; s.runHp = {}; // la campagna avanza; le zone già finite ricominciano dalla battaglia 1
    } else s.battle++;
    if (s.zone === s.maxZone) s.maxBattle = Math.max(s.maxBattle, s.battle);
    s.maxGlobal = Math.max(s.maxGlobal || 1, gIndex(s.zone, s.battle));
  } else {
    s.stats.losses++;
    s.battle = 1; s.runHp = {}; // squadra sconfitta: la zona ricomincia dalla battaglia 1, a vita piena
  }
  if (ev) ev.push({ type: 'battle', result: b.over });
  const nb = startBattle(s); Object.assign(b, nb);
}

function onKill(s, b, e, ev) {
  const f = enemyScale(s.zone, s.battle);
  s.stats.kills++;
  s.kills = s.kills || {}; s.kills[e.species] = (s.kills[e.species] || 0) + 1;
  const pass = hasPass(s) ? 2 : 1; // Pass: oro ed esperienza doppi
  const gold = Math.round(1 * f * (e.boss ? 10 : 1) * (1 + 0.05 * s.tree.tesoro) * pass);
  s.gold += gold; s.stats.gold += gold; trackMinute(s, 1, gold);
  const xp = Math.round(3 * f * (e.boss ? 8 : 1) * pass * (1 + 0.05 * (s.tree.saggezza || 0)));
  for (const u of b.party) if (u.hp > 0) gainXp(s, u.id, xp, ev); // solo chi è vivo in campo prende PE
  if (ev) ev.push({ type: 'kill', idx: e.idx, gold });
  // drop
  const firstBoss = e.boss && s.zone > s.cleared;
  const dropP = e.boss ? (firstBoss ? 1 : 0.1) : 0.007;
  if (rnd(s) < dropP) dropItem(s, e.boss, ev);
  // rune
  if (firstBoss) { addRune(s, 'noncomune', 2, ev); addRune(s, 'rara', 1, ev); }
  else for (const k of RUNE_KEYS) { if (rnd(s) < RUNE_DROP[k] * (e.boss ? 20 : 1)) { addRune(s, k, 1, ev); break; } }
  // cattura
  tryCapture(s, e, ev);
}

function tryCapture(s, e, ev) {
  const sp = e.species; if (s.roster[sp]) return;
  s.hunt[sp] = (s.hunt[sp] || 0) + 1;
  let p = RARITY[SPECIES[sp].rarity].p * (1 + Math.min(0.5, 0.05 * s.tree.richiamo));
  if (s.settings.test) p *= 200;
  const tutorial = capturedCount(s) === 0 && sp === 'glimmo' && gIndex(s.zone, s.battle) >= 3;
  const pity = s.hunt[sp] >= 3 / RARITY[SPECIES[sp].rarity].p; // rete di sicurezza a 3 volte il tempo medio
  if (tutorial || pity || rnd(s) < p) {
    const m = newMember(sp, 1); m.waitKills = s.hunt[sp]; s.roster[sp] = m; // chi si unisce parte dal livello 1
    delete s.hunt[sp];
    if (!teamFull(s)) s.team.push(sp);
    if (ev) ev.push({ type: 'capture', species: sp });
  }
}
function avgLevel(s) { let t = 0; for (const id of s.team) t += s.roster[id].lvl; return t / s.team.length; }

function gainXp(s, id, xp, ev) {
  const m = s.roster[id]; if (m.lvl >= LEVEL_CAP) { m.xp = 0; return; } m.xp += xp;
  while (m.lvl < LEVEL_CAP && m.xp >= xpNeed(m.lvl)) { m.xp -= xpNeed(m.lvl); m.lvl++; if (ev) ev.push({ type: 'level', id, lvl: m.lvl }); }
}

function dropItem(s, boss, ev) {
  const r = pickWeighted(s, ITEM_RARITY, x => x.weight); // stesse probabilità in ogni zona e per ogni nemico
  const slot = KINDS[Math.floor(rnd(s) * KINDS.length)];
  const cls = slot === 'arma' || slot === 'secondaria' ? Object.keys(CLASSES)[Math.floor(rnd(s) * 4)] : null;
  const it = finishItem(s, { id: s.nextId++, slot, cls, rarity: r.key, ilvl: gIndex(s.zone, s.battle), up: 0, isNew: true });
  s.stats.items++; s.stats.byRar = s.stats.byRar || {}; s.stats.byRar[r.key] = (s.stats.byRar[r.key] || 0) + 1;
  if (rarityIndex(r.key) >= 4) s.stats.legendary++;
  if (RARE_FEED.includes(r.key)) { s.stats.rare = s.stats.rare || {}; s.stats.rare[r.key] = (s.stats.rare[r.key] || 0) + 1; (s.rareLog = s.rareLog || []).unshift({ t: Date.now(), rarity: r.key, slot, zone: s.zone, ilvl: it.ilvl }); s.rareLog.length = Math.min(s.rareLog.length, 50); if (ev) ev.push({ type: 'rare', item: it }); }
  // filtro del bottino: sotto la rarità minima scelta l'oggetto si vende subito (le rune non passano di qui)
  if (rarityIndex(r.key) < minKeep(s)) { s.gold += sellValue(it, s); s.stats.autoSold = (s.stats.autoSold || 0) + 1; return; }
  if (s.inventory.length >= bagCap(s)) { // zaino pieno: l'oggetto va perso (niente vendita automatica nascosta)
    s.stats.lost = (s.stats.lost || 0) + 1; if (ev) ev.push({ type: 'lost', item: it }); return;
  }
  s.inventory.push(it);
  if (ev) ev.push({ type: 'drop', item: it });
  if (s.settings.autoEquip) autoEquip(s);
}

// Equipaggia tutto: dal più forte, al primo membro (in ordine di squadra) che può usarlo e migliora
function autoEquip(s) {
  let changed = 0, guard = 0;
  let again = true;
  while (again && guard++ < 200) {
    again = false;
    const inv = s.inventory.slice().sort((a, b) => itemPower(b) - itemPower(a));
    for (const it of inv) {
      for (const id of s.team) {
        const m = s.roster[id]; if (m.locked || !canUse(m, it)) continue;
        const sl = targetSlot(m, it), cur = m.eq[sl];
        if (!cur || itemPower(it) > itemPower(cur)) {
          s.inventory = s.inventory.filter(x => x.id !== it.id);
          if (cur) s.inventory.push(cur);
          m.eq[sl] = it; it.isNew = false; changed++; again = true; break;
        }
      }
      if (again) break;
    }
  }
  return changed;
}
// Pass Astrale (abbonamento mensile). Nella versione di prova si attiva gratis per 30 giorni.
function hasPass(s) { return !!s.pass && s.pass > Date.now(); }
function activatePass(s) { s.pass = Math.max(Date.now(), s.pass || 0) + 30 * 86400000; }
function rarityIndex(k) { return ITEM_RARITY.findIndex(r => r.key === k); }
// Gratis si vendono da soli solo i comuni (al massimo "tieni da Non comune in su"); oltre serve il Pass
const FREE_MAX_FILTER = 1; // gratis: si vendono solo i comuni
// Zaino e forziere: 20 posti ciascuno, il doppio col Pass. Le rune non occupano posto.
const BAG_BASE = 20;
function bagCap(s) { return BAG_BASE * (hasPass(s) ? 2 : 1) + (s.extraBag || 0); }
function chestCap(s) { return BAG_BASE * (hasPass(s) ? 2 : 1) + (s.extraChest || 0); }
// Spazi extra nello Shop: per sempre, ma se ne possono comprare pochi ogni mese
const SPACE_PACK = { n: 2, cost: 500, perMonth: 2 };
function monthKey(now) { const d = new Date(now || Date.now()); return d.getFullYear() * 100 + d.getMonth() + 1; }
function spaceLeft(s, kind) { const m = monthKey(); if (!s.spaceBuys || s.spaceBuys.m !== m) return SPACE_PACK.perMonth; return SPACE_PACK.perMonth - (s.spaceBuys[kind] || 0); }
function buySpace(s, kind) { if (spaceLeft(s, kind) < 1 || s.astri < SPACE_PACK.cost) return false; const m = monthKey(); if (!s.spaceBuys || s.spaceBuys.m !== m) s.spaceBuys = { m, bag: 0, chest: 0 }; s.spaceBuys[kind]++; s.astri -= SPACE_PACK.cost; if (kind === 'bag') s.extraBag = (s.extraBag || 0) + SPACE_PACK.n; else s.extraChest = (s.extraChest || 0) + SPACE_PACK.n; return true; }
function toChest(s, id) { const i = s.inventory.findIndex(x => x.id === id); if (i < 0 || s.chest.length >= chestCap(s)) return false; s.chest.push(s.inventory.splice(i, 1)[0]); return true; }
function fromChest(s, id) { const i = s.chest.findIndex(x => x.id === id); if (i < 0 || s.inventory.length >= bagCap(s)) return false; s.inventory.push(s.chest.splice(i, 1)[0]); return true; }
function offlineCap(s) { return OFFLINE_CAP * (hasPass(s) ? 2 : 1); }
const PASS_MAX_FILTER = 2; // col Pass si vendono in automatico anche i non comuni, mai oltre
function maxFilter(s) { return hasPass(s) ? PASS_MAX_FILTER : FREE_MAX_FILTER; }
function minKeep(s) { return Math.min(rarityIndex(s.settings.minRarity || 'comune'), maxFilter(s), protectIdx(s)); }
// "Tieni sempre da ... in su": queste rarità non si vendono mai (né a mano né in automatico)
function protectIdx(s) { const k = s.settings.protect || 'segreto'; return k === 'none' ? ITEM_RARITY.length : rarityIndex(k); }
function isProtected(s, it) { return !!it.locked || rarityIndex(it.rarity) >= protectIdx(s); }
function toggleLock(s, id) { const it = s.inventory.find(x => x.id === id) || s.chest.find(x => x.id === id); if (!it) return false; it.locked = !it.locked; return it.locked; }
function sellBelow(s) { const min = minKeep(s); let gold = 0, n = 0; s.inventory = s.inventory.filter(it => { if (rarityIndex(it.rarity) < min && !isProtected(s, it)) { gold += sellValue(it, s); n++; return false; } return true; }); s.gold += gold; return { gold, n }; }
function sellRest(s) {
  // vende ciò che non migliora nessuno nella squadra né nella riserva
  let gold = 0, n = 0;
  const keep = [];
  for (const it of s.inventory) {
    const useful = Object.keys(s.roster).some(id => { const m = s.roster[id]; if (m.locked || !canUse(m, it)) return false; const c = m.eq[targetSlot(m, it)]; return !c || itemPower(it) > itemPower(c); });
    if (useful || isProtected(s, it)) keep.push(it); else { gold += sellValue(it, s); n++; }
  }
  s.inventory = keep; s.gold += gold; return { gold, n };
}
function equipTo(s, itemId, memberId) {
  const it = s.inventory.find(x => x.id === itemId), m = s.roster[memberId]; if (!it || !m || !canUse(m, it)) return false;
  const sl = targetSlot(m, it), cur = m.eq[sl]; s.inventory = s.inventory.filter(x => x.id !== itemId); if (cur) s.inventory.push(cur); m.eq[sl] = it; it.isNew = false; return true;
}
function unequip(s, memberId, slot) { const m = s.roster[memberId]; if (m && m.eq[slot]) { s.inventory.push(m.eq[slot]); m.eq[slot] = null; } }
function sellItem(s, itemId) { const i = s.inventory.findIndex(x => x.id === itemId); if (i < 0 || isProtected(s, s.inventory[i])) return 0; const [it] = s.inventory.splice(i, 1); const g = sellValue(it, s); s.gold += g; return g; }
// Rune: ognuna porta un oggetto alla sua rarità (dalla rarità precedente), si vendono per Astri e potenziano gli slot
const RUNE_KEYS = ['arcano', 'astrale', 'mitico', 'leggendaria', 'epica', 'rara', 'noncomune']; // dal più raro, per il tiro del drop
const RUNE = {
  noncomune:   { label: 'Runa verde',     color: '#6CCB5F', from: 'comune',    value: 2 },
  rara:        { label: 'Runa blu',       color: '#5B9BFF', from: 'noncomune', value: 5 },
  epica:       { label: 'Runa viola',     color: '#B07CF0', from: 'rara',      value: 10 },
  leggendaria: { label: 'Runa arancione', color: '#F2994A', from: 'epica',     value: 15 },
  mitico:      { label: 'Runa dorata',    color: '#FFD34D', from: 'leggendaria', value: 30 },
  astrale:     { label: 'Runa rosa',      color: '#FF7AD9', from: 'mitico',    value: 60 },
  arcano:      { label: 'Runa cremisi',   color: '#E8334F', from: 'astrale',   value: 120 },
};
// probabilità per nemico (provvisorie, da tarare sui dati reali)
const RUNE_DROP = { noncomune: 0.0004, rara: 0.00015, epica: 0.00005, leggendaria: 0.00001, mitico: 0.000003, astrale: 0.000001, arcano: 0.0000003 };
function addRune(s, k, n, ev) { s.runes[k] += n; s.stats.runes = (s.stats.runes || 0) + n; if (ev) ev.push({ type: 'rune', rune: k, n }); }
function totalRunes(s) { let t = 0; for (const k in s.runes) t += s.runes[k]; return t; }
function nextRarity(it) { const i = ITEM_RARITY.findIndex(r => r.key === it.rarity); return i >= 0 && i < 7 ? ITEM_RARITY[i + 1].key : null; } // le rune arrivano fino all'Arcano
function canRaise(s, it) { const n = nextRarity(it); return !!n && s.runes[n] > 0; }
function raiseRarity(s, it) { const n = nextRarity(it); if (!n || s.runes[n] < 1) return false; s.runes[n]--; it.rarity = n; rollBonus(s, it); if (n === 'leggendaria') s.stats.legendary++; return true; }
function slotRune(l) { return l < 4 ? 'noncomune' : l < 7 ? 'rara' : l < 9 ? 'epica' : 'leggendaria'; }
function slotCost(l) { return 1; }
function upgradeSlot(s, id, sl) { const m = s.roster[id]; if (!m) return false; const l = m.slv[sl] || 0, k = slotRune(l); if (l >= 10 || s.runes[k] < 1) return false; s.runes[k] -= 1; m.slv[sl] = l + 1; return true; }
// Rune in vendita nello Shop per Astri (provvisorio)
const RUNE_BUY = { epica: 100, leggendaria: 250, mitico: 500, astrale: 1000, arcano: 2000 }; // verde e blu non si vendono: si trovano spesso
function buyRune(s, k) { const c = RUNE_BUY[k]; if (!c || s.astri < c) return false; s.astri -= c; s.runes[k]++; return true; }
function sellRunes(s, k, n) { n = Math.min(n, s.runes[k]); s.runes[k] -= n; const g = n * RUNE[k].value; s.astri += g; return g; }
// Negozio: 6 oggetti, rinnovati alle 0, 8 e 16 (ora locale), rarità con le stesse probabilità dei drop
const SHOP_PRICE = { comune: 10, noncomune: 20, rara: 40, epica: 100, leggendaria: 250, mitico: 450, astrale: 800, arcano: 2500, eterno: 5000, segreto: 8000 };
const REROLL_COST = 20;
function shopPeriod(now) { const d = new Date(now); return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate() + '-' + Math.floor(d.getHours() / 8); }
function nextRefresh(now) { const d = new Date(now); d.setMinutes(0, 0, 0); d.setHours((Math.floor(d.getHours() / 8) + 1) * 8); return d.getTime(); }
function ensureShop(s, now, force) {
  const key = shopPeriod(now);
  if (!force && s.shop && s.shop.period === key) return false;
  const items = [];
  for (let i = 0; i < 6; i++) {
    const r = pickWeighted(s, ITEM_RARITY, x => x.weight), slot = KINDS[Math.floor(rnd(s) * KINDS.length)];
    const cls = slot === 'arma' || slot === 'secondaria' ? Object.keys(CLASSES)[Math.floor(rnd(s) * 4)] : null;
    items.push(finishItem(s, { id: s.nextId++, slot, cls, rarity: r.key, ilvl: s.maxGlobal || 1, up: 0, isNew: true, price: SHOP_PRICE[r.key], sold: false }));
  }
  s.shop = { period: key, items }; return true;
}
function rerollShop(s) { if (s.astri < REROLL_COST) return false; s.astri -= REROLL_COST; ensureShop(s, Date.now(), true); return true; }
function buyShop(s, idx) { const it = s.shop && s.shop.items[idx]; if (!it || it.sold || s.astri < it.price) return false; s.astri -= it.price; it.sold = true; const copy = Object.assign({}, it); delete copy.price; delete copy.sold; s.inventory.push(copy); if (s.settings.autoEquip) autoEquip(s); return true; }
// Allenamento della squadra: l'oro diventa forza, così non si resta mai bloccati per sempre
// Accensione automatica: compra sempre la costellazione più economica disponibile
function cheapestStar(s) { let best = null, c = Infinity; for (const k in TREE) { const l = s.tree[k] || 0; if (l < TREE[k].max && starOpen(s, k)) { const v = TREE[k].cost(l); if (v < c) { c = v; best = k; } } } return { key: best, cost: c }; }
function autoStars(s) { let n = 0; for (;;) { const b = cheapestStar(s); s._nextStar = b.cost; if (!b.key || s.gold < b.cost || n >= 50) break; s.gold -= b.cost; s.tree[b.key]++; n++; } return n; }
// Missioni del bestiario: sconfiggi una specie N volte, 3 livelli; soglie e premi scalano con la rarità
const MISSION_BASE = [500, 3000, 15000];
const MISSION_DIV = { comune: 1, noncomune: 2, rara: 5, boss: 20 };
const MISSION_MULT = { comune: 1, noncomune: 2, rara: 4, boss: 6 };
function missionGoal(sp, tier) { return Math.round(MISSION_BASE[tier] / MISSION_DIV[SPECIES[sp].rarity]); }
function missionReward(sp, tier) {
  const m = MISSION_MULT[SPECIES[sp].rarity], top = SPECIES[sp].rarity === 'rara' || SPECIES[sp].rarity === 'boss';
  return { astri: [3, 8, 20][tier] * m, rune: [['noncomune', 1], ['rara', 1], [top ? 'leggendaria' : 'epica', 1]][tier] };
}
function missionTier(s, sp) { return (s.missions && s.missions[sp]) || 0; } // livelli già riscossi
function missionReady(s, sp) { const t = missionTier(s, sp); return t < 3 && ((s.kills && s.kills[sp]) || 0) >= missionGoal(sp, t); }
function claimMission(s, sp) {
  if (!missionReady(s, sp)) return null;
  const t = missionTier(s, sp), r = missionReward(sp, t);
  s.astri += r.astri; s.runes[r.rune[0]] += r.rune[1];
  s.missions = s.missions || {}; s.missions[sp] = t + 1; return r;
}
function missionsReady(s) { return ALL_SPECIES.filter(sp => missionReady(s, sp)).length; }
function setZone(s, z) { if (z < 1 || z > s.maxZone) return false; s.zone = z; s.battle = 1; s.runHp = {}; return true; }
function moveSpeed(s) { return 1 + 0.05 * (s.tree.cometa || 0); }
function migrate(s) {
  if (s.zone === undefined) { s.zone = 1; s.maxZone = 1; s.cleared = 0; s.battle = 1; s.maxBattle = 1; s.maxGlobal = 1; delete s.bossCleared; }
  if (typeof s.runes !== 'object' || s.runes === null) s.runes = { noncomune: s.runes || 0, rara: 0, epica: 0, leggendaria: 0 };
  if (s.runes.mitico === undefined) s.runes.mitico = 0; if (s.runes.astrale === undefined) s.runes.astrale = 0; if (s.runes.arcano === undefined) s.runes.arcano = 0;
  for (const k in TREE) if (s.tree[k] === undefined) s.tree[k] = 0;
  if (!s.chest) s.chest = []; if (!s.rareLog) s.rareLog = [];
  delete s.settings.autoStars; delete s.settings.autoMode; delete s._nextStar;
  { const keep = []; let n = 0; for (const id of s.team) { if (isHero(id)) keep.push(id); else if (n < slotCount(s)) { keep.push(id); n++; } } s.team = keep; }
  delete s.dust; delete s.train; delete s.move;
  if (s.shop && s.shop.items.some(i => i.price !== SHOP_PRICE[i.rarity])) s.shop = null;
  if (s.runes === undefined) s.runes = 0; if (s.astri === undefined) s.astri = 0; if (s.shop === undefined) s.shop = null;
  const OLD = { armatura: 'corazza', accessorio: 'anello', amuleto: 'collana' }, OLDSL = { armatura: 'corazza', accessorio: 'anello1', amuleto: 'collana' };
  const fixItem = it => { if (it && OLD[it.slot]) it.slot = OLD[it.slot]; return it; };
  const addB = it => { if (it && !it.bonus) finishItem(s, it); };
  for (const it of s.inventory || []) { fixItem(it); addB(it); }
  if (s.shop) for (const it of s.shop.items) { fixItem(it); addB(it); }
  for (const id in s.roster) {
    const m = s.roster[id], eq = emptyEq(), slv = emptySlv();
    for (const k in (m.eq || {})) { const nk = OLDSL[k] || k; if (nk in eq) { eq[nk] = fixItem(m.eq[k]); addB(eq[nk]); } }
    for (const k in (m.slv || {})) { const nk = OLDSL[k] || k; if (nk in slv) slv[nk] = m.slv[k]; }
    m.eq = eq; m.slv = slv;
  }
  return s;
}

function buyTree(s, key) { const t = TREE[key], l = s.tree[key]; if (l >= t.max || !starOpen(s, key)) return false; const c = t.cost(l); if (s.gold < c) return false; s.gold -= c; s.tree[key]++; s._nextStar = 0; if (key === 'corona') fillTeam(s); return true; }
function resetTree(s) { let back = 0; for (const k in TREE) { for (let l = 0; l < s.tree[k]; l++) back += TREE[k].cost(l); s.tree[k] = 0; } s.gold += back; s._nextStar = 0; trimTeam(s); return back; }
function trimTeam(s) { const keep = []; let n = 0; for (const id of s.team) { if (isHero(id)) keep.push(id); else if (n < slotCount(s)) { keep.push(id); n++; } } s.team = keep; }
function fillTeam(s) { const res = Object.keys(s.roster).filter(id => !s.team.includes(id) && !isHero(id)).sort((a, c) => s.roster[c].lvl - s.roster[a].lvl); while (res.length && !teamFull(s)) s.team.push(res.shift()); }

function moveMember(s, id, dir) { const i = s.team.indexOf(id), j = i + dir; if (i < 0 || j < 0 || j >= s.team.length) return; [s.team[i], s.team[j]] = [s.team[j], s.team[i]]; }
function addToTeam(s, id) { if (s.team.includes(id) || (!isHero(id) && teamFull(s))) return false; s.team.push(id); return true; }
function removeFromTeam(s, id) { if (isHero(id) || s.team.length <= 1) return false; s.team = s.team.filter(x => x !== id); return true; }

function trackMinute(s, kills, gold) {
  const m = Math.floor(Date.now() / 60000), a = s.stats.perMin;
  if (!a.length || a[a.length - 1].m !== m) a.push({ m, kills: 0, gold: 0 });
  a[a.length - 1].kills += kills; a[a.length - 1].gold += gold;
  while (a.length > 60) a.shift();
}

function checkAch(s) {
  const got = [];
  for (const a of ACH) if (!s.ach[a.id] && a.test(s)) { s.ach[a.id] = Date.now(); s.astri += a.astri; got.push(a); }
  return got;
}

// Simulazione offline: stesso motore, senza grafica, a passi più ampi
function simulateOffline(s, seconds, noCap) {
  s.stats.offline = (s.stats.offline || 0) + seconds; // tempo reale passato fuori dal gioco, anche oltre il limite (conta anche l'avanti veloce)
  if (!noCap) seconds = Math.min(seconds, offlineCap(s));
  const before = { byRar: Object.assign({}, s.stats.byRar || {}), lost: s.stats.lost || 0, gold: s.gold, kills: s.stats.kills, items: s.stats.items, runes: Object.assign({}, s.runes), lv: {} };
  for (const id in s.roster) before.lv[id] = s.roster[id].lvl;
  const ev = [];
  const b = startBattle(s);
  const dt = 0.25; let t = 0;
  const caps = [];
  while (t < seconds) {
    const sub = [];
    step(s, b, dt, sub);
    for (const e of sub) if (e.type === 'capture' || e.type === 'unlock') caps.push(e);
    t += dt;
  }
  const lv = []; for (const id in s.roster) if (before.lv[id] !== undefined && s.roster[id].lvl > before.lv[id]) lv.push({ id, from: before.lv[id], to: s.roster[id].lvl });
  return { seconds, gold: s.gold - before.gold, kills: s.stats.kills - before.kills, items: s.stats.items - before.items, lost: (s.stats.lost || 0) - before.lost, byRar: Object.fromEntries(ITEM_RARITY.map(r => [r.key, ((s.stats.byRar || {})[r.key] || 0) - (before.byRar[r.key] || 0)])), runes: Object.fromEntries(Object.keys(s.runes).map(k => [k, s.runes[k] - before.runes[k]])), levels: lv, events: caps };
}

const api = { SPACE_PACK, spaceLeft, buySpace, PASS_MAX_FILTER, toggleLock, STARMAP, starOpen, RUNE_BUY, buyRune, protectIdx, isProtected, nextSlotZone, SLOT_UNLOCKS, BASE_SLOTS, DAILY_ASTRI, dailyReady, claimDaily, nextMidnight, hasPass, maxFilter, minKeep, bagCap, chestCap, toChest, fromChest, offlineCap, isHero, creaturesInTeam, teamFull, CREATURE_SLOTS, HERO_SHOP, PASS_PRICE, buyHero, RARE_FEED, activatePass, targetSlot, itemStats, mainStats, bonusValue, STAT_LABEL, PCT_STATS, missionGoal, missionReward, missionTier, missionReady, claimMission, missionsReady, CLASSES, RARITY, SPECIES, PLANETS, ZONES, MAX_ZONE, ALL_SPECIES, planetOf, zoneOf, gIndex, setZone, ITEM_RARITY, SLOTS, KINDS, kindOf, SLOT_LABEL, TREE, ACH, OFFLINE_CAP, BOSS_BATTLE,
  LEVEL_CAP, newState, startBattle, step, memberStats, memberPower, itemPower, itemName, upgradeCost, sellValue, canUse, classCounts, slotCount, capturedCount, xpNeed,
  autoEquip, sellRest, sellBelow, rarityIndex, RUNE, RUNE_DROP, totalRunes, nextRarity, canRaise, raiseRarity, slotRune, slotCost, upgradeSlot, sellRunes, ensureShop, buyShop, rerollShop, REROLL_COST, moveSpeed, cheapestStar, autoStars, nextRefresh, migrate, SHOP_PRICE, equipTo, unequip, sellItem, buyTree, resetTree, moveMember, addToTeam, removeFromTeam, checkAch, simulateOffline, avgLevel };
if (typeof module !== 'undefined') module.exports = api; else root.FA = api;
})(this);
