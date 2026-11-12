// Frontiera Arcana — logica di gioco (nessun riferimento allo schermo)
(function (root) {
'use strict';

const CLASSES = {
  Guerriero: { range: 1, hp: 135, atk: 14, def: 5, spd: 1.1, block: 0.08, color: '#F08A5D', ability: 'Fendente', desc: 'Sta in prima linea (gittata 1): i nemici colpiscono sempre chi è più vicino. Para l\'8% dei colpi e ogni 3 attacchi sferra un colpo pesante: 220% dei danni sul bersaglio.' },
  Arciere:   { range: 3, hp: 80,  atk: 12, def: 1, spd: 1.0, color: '#7ED36F', ability: 'Marchio', desc: 'Ogni 3 attacchi marchia il bersaglio: +30% danni subiti per 4 s.' },
  Curatore:  { range: 6, hp: 85,  atk: 7,  def: 2, spd: 1.3, color: '#F2E27A', ability: 'Luce curativa', desc: 'Ogni 3 s cura l\'alleato più ferito: 6% della sua vita più il 100% del proprio attacco. Chi è appena stato curato riceve metà cure per 2 s.' },
  Mago:      { range: 4, hp: 70,  atk: 10, def: 1, spd: 1.6, color: '#C08CFF', ability: 'Tempesta arcana', desc: 'Ogni 5 s scaglia un fulmine arcano: 250% dei danni, ignora l\'armatura.' },
};

const RARITY = {
  comune:      { label: 'Comune',      weight: 3,   p: 1 / 2500 },
  noncomune:   { label: 'Non comune',  weight: 1.5, p: 1 / 6000 },
  rara:        { label: 'Rara',        weight: 0.6, p: 1 / 12000 },
  boss:        { label: 'Boss',        weight: 0,   p: 1 / 8000 },
  segreto:     { label: 'Segreto',     weight: 0,   p: 0 },
};

const SPECIES = {
  hero:     { name: 'Eroe',     cls: 'Guerriero', rarity: null, hero: true, quote: '' },
  hero_arc: { name: 'Eroina Arciera', cls: 'Arciere', rarity: null, hero: true, quote: 'Una freccia, un bersaglio. Mai sprecare un colpo.' },
  hero_mag: { name: 'Eroe Mago',  cls: 'Mago',      rarity: null, hero: true, quote: 'La magia è solo pazienza molto veloce.' },
  glimmo:   { name: 'Glimmo',   cls: 'Arciere',   rarity: 'comune',    quote: 'Blip! Brillo solo per te.' },
  cometuga: { name: 'Cometuga', cls: 'Guerriero', tough: true,      rarity: 'comune',    quote: 'Piano piano... ma arrivo sempre.' },
  sporello: { name: 'Sporello', cls: 'Curatore',      rarity: 'comune',    quote: 'Le mie spore sanno di luna.' },
  bzzt:     { name: 'Bzzt',     cls: 'Guerriero', rarity: 'noncomune', quote: 'Rotto? Ci penso io. A martellate.' },
  astrillo: { name: 'Astrillo', cls: 'Guerriero', tough: true,      rarity: 'noncomune', quote: 'Il mio guscio ha fermato una cometa.' },
  nebulina: { name: 'Nebulina', cls: 'Mago',      rarity: 'rara',      quote: 'Le stelle mi hanno guidata fino a te. Adesso non ti liberi più di me.' },
  revuoto:  { name: 'Re Vuoto', cls: 'Guerriero', rarity: 'boss',      quote: 'Chi osa sconfiggere un re... merita di servirlo.' },
  scheggia:  { name: 'Scheggia',  cls: 'Guerriero', rarity: 'comune',    quote: 'Tagliente come il ghiaccio, fedele come una volpe.' },
  geodino:   { name: 'Geodino',   cls: 'Guerriero', tough: true,      rarity: 'comune',    quote: 'Dentro sono tutto ametista. Fuori, roccia dura.' },
  lumispettro: { name: 'Lumispettro', cls: 'Curatore', rarity: 'comune',    quote: 'Non sono un fantasma. Sono solo molto luminoso.' },
  gemmerla:  { name: 'Gemmerla',  cls: 'Arciere',   rarity: 'noncomune', quote: 'Ogni mia piuma è una freccia di cristallo.' },
  quarzillo: { name: 'Quarzillo', cls: 'Guerriero', tough: true,      rarity: 'noncomune', quote: 'Piccolo golem, grande abbraccio.' },
  prismella: { name: 'Prismella', cls: 'Mago',      rarity: 'rara',      quote: 'Spezzo la luce in sette colori, e i nemici in sette pezzi.' },
  fiorastro: { name: 'Fiorastro', cls: 'Curatore', rarity: 'comune', quote: "Ogni petalo è una piccola stella. Ne regalo uno a te." },
  polvino: { name: 'Polvino', cls: 'Arciere', rarity: 'comune', quote: "Sono fatto di polvere di cometa. Non soffiare!" },
  meteorino: { name: 'Meteorino', cls: 'Guerriero', rarity: 'comune', quote: "Sono caduto dal cielo e mi è piaciuto." },
  radichino: { name: 'Radichino', cls: 'Guerriero', tough: true, rarity: 'noncomune', quote: "Metto radici dove serve: davanti a te." },
  lucciolo: { name: 'Lucciolo', cls: 'Mago', rarity: 'noncomune', quote: "Faccio luce anche nelle notti più buie." },
  pipistrella: { name: 'Pipistrella', cls: 'Arciere', rarity: 'noncomune', quote: "Volo al contrario, così vedo il mondo dritto." },
  orbo: { name: 'Orbo', cls: 'Mago', rarity: 'rara', quote: "Ti osservo da sempre. Con affetto." },
  brinello: { name: 'Brinello', cls: 'Mago', rarity: 'comune', quote: "Un fiocco di neve con un carattere frizzante." },
  stalagmo: { name: 'Stalagmo', cls: 'Guerriero', tough: true, rarity: 'comune', quote: "Cresco di un millimetro all'anno. Ma che millimetro!" },
  cristallux: { name: 'Cristallux', cls: 'Guerriero', rarity: 'comune', quote: "Otto zampe, otto cristalli, un solo amico." },
  gufolunare: { name: 'Gufolunare', cls: 'Arciere', rarity: 'noncomune', quote: "Di notte vedo tutto. Di giorno pure." },
  ghiacciolo: { name: 'Ghiacciolo', cls: 'Curatore', rarity: 'noncomune', quote: "Le mie cure sono fresche come la luna." },
  lunella: { name: 'Lunella', cls: 'Arciere', rarity: 'comune', quote: "Danzo intorno alla luce della luna." },
  riflessa: { name: 'Riflessa', cls: 'Mago', rarity: 'rara', quote: "Guardami bene: dentro di me ci sei tu." },
  braciolo: { name: "Braciolo", cls: 'Guerriero', rarity: 'comune', quote: "Scotto un po', ma ti voglio bene." },
  lavarospo: { name: "Lavarospo", cls: 'Guerriero', tough: true, rarity: 'comune', quote: "Salto poco, resisto tanto." },
  fiammella: { name: "Fiammella", cls: 'Mago', rarity: 'noncomune', quote: "Sono piccola, ma brucio di entusiasmo." },
  cenerino: { name: "Cenerino", cls: 'Arciere', rarity: 'comune', quote: "Sono fatto di cenere, ma ho la mira di fuoco." },
  magmolo: { name: "Magmolo", cls: 'Curatore', rarity: 'comune', quote: "Il mio calore guarisce. Ma non toccarmi." },
  salamandro: { name: "Salamandro", cls: 'Guerriero', rarity: 'noncomune', quote: "Coda di fuoco, cuore d'oro." },
  vulcanello: { name: "Vulcanello", cls: 'Guerriero', tough: true, rarity: 'noncomune', quote: "Se mi arrabbio, erutto. Di solito no." },
  fenicino: { name: "Fenicino", cls: 'Curatore', rarity: 'noncomune', quote: "Rinasco dalle mie ceneri. E dalle tue." },
  scoriatto: { name: "Scoriatto", cls: 'Arciere', rarity: 'comune', quote: "Miao. Ma con le scintille." },
  draghetto: { name: "Draghetto", cls: 'Mago', rarity: 'rara', quote: "Un giorno sarò enorme. Per ora ti proteggo lo stesso." },
  ossidiana: { name: "Ossidiana", cls: 'Guerriero', tough: true, rarity: 'noncomune', quote: "Lucido, duro, affidabile." },
  lapillo: { name: "Lapillo", cls: 'Arciere', rarity: 'noncomune', quote: "Volo tra i fumi e non sbaglio un colpo." },
  solforo: { name: "Solforo", cls: 'Mago', rarity: 'rara', quote: "Puzzo un po', ma i miei incantesimi profumano di vittoria." },
  imperatore: { name: "Imperatore Magma", cls: 'Guerriero', tough: true, rarity: 'boss', quote: "Il fuoco obbedisce a me. E io, da oggi, a te." },
  ombretto: { name: "Ombretto", cls: 'Guerriero', rarity: 'comune', quote: "Vivo nel buio, ma mi piace la tua luce." },
  abissale: { name: "Abissale", cls: 'Curatore', rarity: 'comune', quote: "Le mie cure arrivano dal profondo." },
  lanternino: { name: "Lanternino", cls: 'Arciere', rarity: 'comune', quote: "Seguimi: conosco la strada nel buio." },
  nullo: { name: "Nullo", cls: 'Guerriero', tough: true, rarity: 'comune', quote: "Sono un cubo. Niente mi attraversa." },
  sussurro: { name: "Sussurro", cls: 'Mago', rarity: 'comune', quote: "Shhh. Sto lanciando un incantesimo." },
  tentacula: { name: "Tentacula", cls: 'Guerriero', rarity: 'noncomune', quote: "Otto braccia per abbracciarti. O per difenderti." },
  corvonero: { name: "Corvonero", cls: 'Arciere', rarity: 'noncomune', quote: "Gracchio poco, colpisco molto." },
  guscionero: { name: "Guscionero", cls: 'Guerriero', tough: true, rarity: 'noncomune', quote: "Chele forti, guscio più forte." },
  eclissa: { name: "Eclissa", cls: 'Curatore', rarity: 'noncomune', quote: "Quando il sole si spegne, io curo." },
  milleocchi: { name: "Milleocchi", cls: 'Mago', rarity: 'rara', quote: "Ti vedo. Ti ho sempre visto." },
  colosso: { name: "Colosso", cls: 'Guerriero', tough: true, rarity: 'noncomune', quote: "Grande come una luna. Gentile come un gatto." },
  spettrina: { name: "Spettrina", cls: 'Arciere', rarity: 'comune', quote: "Una freccia d'ombra, un sorriso di luce." },
  stellanera: { name: "Stellanera", cls: 'Mago', rarity: 'rara', quote: "Sono una stella che ha scelto il buio. E te." },
  divoratore: { name: "Divoratore di Stelle", cls: 'Mago', rarity: 'boss', quote: "Ho mangiato mille stelle. La mille-e-una sarai tu... da proteggere." },
  reginaquarzo: { name: 'Regina di Quarzo', cls: 'Arciere', rarity: 'boss', quote: 'Una regina non si arrende. Sceglie solo chi servire.' },
};
// Pianeti e zone: 10 zone da 30 battaglie, 5 per pianeta
const PLANETS = [
  { name: 'Prati Stellari', zones: [1, 5], species: ['glimmo', 'cometuga', 'sporello', 'bzzt', 'astrillo', 'nebulina', 'revuoto'] },
  { name: 'Luna di Cristallo', zones: [6, 10], species: ['scheggia', 'geodino', 'lumispettro', 'gemmerla', 'quarzillo', 'prismella', 'reginaquarzo'] },
  { name: 'Nebulosa di Fuoco', zones: [11, 15], species: ['braciolo', 'lavarospo', 'magmolo', 'lapillo', 'fiammella', 'draghetto', 'imperatore'] },
  { name: 'Abisso Stellare', zones: [16, 20], species: ['ombretto', 'nullo', 'abissale', 'corvonero', 'tentacula', 'stellanera', 'divoratore'] },
];
// 7 creature per pianeta (28 in tutto): 2 nella prima zona, 2 nella seconda, poi 1 per zona e il boss alla quinta
const ZONE_NEW = [null,
  ['glimmo', 'cometuga'], ['sporello', 'bzzt'], ['astrillo'], ['nebulina'], [],
  ['scheggia', 'geodino'], ['lumispettro', 'gemmerla'], ['quarzillo'], ['prismella'], [],
  ['braciolo', 'lavarospo'], ['magmolo', 'lapillo'], ['fiammella'], ['draghetto'], [],
  ['ombretto', 'nullo'], ['abissale', 'corvonero'], ['tentacula'], ['stellanera'], [],
];
const ZONE_BOSS = [null, 'cometuga', 'sporello', 'astrillo', 'nebulina', 'revuoto', 'geodino', 'lumispettro', 'quarzillo', 'prismella', 'reginaquarzo', 'lavarospo', 'magmolo', 'fiammella', 'draghetto', 'imperatore', 'nullo', 'corvonero', 'tentacula', 'stellanera', 'divoratore'];
const ZONES = [null]; for (let z = 1; z <= 20; z++) { const first = Math.floor((z - 1) / 5) * 5 + 1, pool = []; for (let k = first; k <= z; k++) pool.push(...ZONE_NEW[k]); ZONES.push({ pool, boss: ZONE_BOSS[z] }); }
const MAX_ZONE = 20;
// Boss segreti: versione gigante del boss di zona. Compare di rado al posto del boss e, se lo sconfiggi, si unisce subito.
let SECRET_P = 0.001; if (typeof process !== 'undefined' && process.env && process.env.SECP) SECRET_P = +process.env.SECP;
const SECRET_MULT = 1.3; // un boss segreto in squadra è più forte del 30% rispetto alla sua versione normale
const SECRET_SPECIES = [];
const TOUGH = { hp: 1.5, def: 1.5, atk: 0.65 }; // Guerrieri robusti (gli ex Tank): più vita e difesa, meno attacco
for (let z = 1; z <= MAX_ZONE; z++) { const k = ZONE_BOSS[z], sk = k + '_s'; if (SPECIES[sk]) continue; SPECIES[sk] = { name: SPECIES[k].name + ' Gigante', cls: SPECIES[k].cls, tough: SPECIES[k].tough, rarity: 'segreto', secret: true, base: k, quote: 'Pochi mi hanno visto. Nessuno mi aveva mai battuto.' }; SECRET_SPECIES.push(sk); }
const ALL_SPECIES = PLANETS.flatMap(p => p.species);
function planetOf(z) { return PLANETS.find(p => z >= p.zones[0] && z <= p.zones[1]); }
function zoneOf(sp) { if (SPECIES[sp] && SPECIES[sp].base) sp = SPECIES[sp].base; for (let z = 1; z <= MAX_ZONE; z++) if (ZONES[z].pool.includes(sp) || ZONES[z].boss === sp) return z; return 1; }
function gIndex(z, n) { return (z - 1) * 30 + n; }

const ITEM_RARITY = [ // chiavi interne invariate per compatibilità dei salvataggi
  { key: 'comune',      label: 'Comune',      mult: 1,   weight: 60,    color: '#AEB4CF' },
  { key: 'noncomune',   label: 'Non comune',  mult: 1.4, weight: 25,    color: '#6CCB5F' },
  { key: 'rara',        label: 'Raro',        mult: 2,   weight: 10,    color: '#5B9BFF' },
  { key: 'epica',       label: 'Epico',       mult: 3,   weight: 5,     color: '#B07CF0' },
  { key: 'leggendaria', label: 'Leggendario', mult: 5,   weight: 1.2,   color: '#F2994A' },
  { key: 'mitico',      label: 'Mitico',      mult: 6,   weight: 0.45,  color: '#FFD34D' },
  { key: 'astrale',     label: 'Astrale',     mult: 7,   weight: 0.18,  color: '#FF7AD9' },
  { key: 'arcano',      label: 'Arcano',      mult: 10,  weight: 0.02,  color: '#E8334F' },
  { key: 'eterno',      label: 'Eterno',      mult: 12,  weight: 0.007, color: '#1FE0D0' },
  { key: 'segreto',     label: 'Segreto',     mult: 15,  weight: 0.0035, color: '#FFFFFF', rainbow: true },
];
const RARE_FEED = ['astrale', 'arcano', 'eterno', 'segreto']; // drop annunciati nella sezione dei drop rari
// 11 posti di equipaggiamento; gli oggetti hanno 10 tipi (l'anello va in due posti)
const SLOTS = ['arma', 'secondaria', 'elmo', 'corazza', 'gambe', 'stivali', 'guanti', 'collana', 'orecchini', 'anello1', 'anello2'];
const KINDS = ['arma', 'secondaria', 'elmo', 'corazza', 'gambe', 'stivali', 'guanti', 'collana', 'orecchini', 'anello'];
const kindOf = sl => sl === 'anello1' || sl === 'anello2' ? 'anello' : sl;
const SLOT_LABEL = { arma: 'Arma', secondaria: 'Secondaria', elmo: 'Elmo', corazza: 'Corazza', gambe: 'Gambe', stivali: 'Stivali', guanti: 'Guanti', collana: 'Collana', orecchini: 'Orecchini', anello: 'Anello', anello1: 'Anello', anello2: 'Anello' };
const WEAPON = { Guerriero: 'Spada stellare', Arciere: 'Arco di luce', Mago: 'Bastone nebulare', Curatore: 'Scettro di luce' };
const SECONDARY = { Guerriero: 'Pugnale lunare', Arciere: 'Faretra siderale', Mago: 'Tomo runico', Curatore: 'Libro delle preghiere' };
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
  cometa:   { x: 15, y: 85, req: ['branco', 5], ic: '☄' },
  richiamo: { x: 50, y: 87, req: ['lama', 5], ic: '✧' },
  furia:    { x: 85, y: 85, req: ['lama', 5], ic: '✸' },
};

// ===== Albero delle costellazioni (grande): anelli di stelle intorno al centro =====
// Si accende una stella collegata a una già accesa. Gli anelli esterni si aprono con i boss.
let SKY_VMULT = 2.6; if (typeof process !== 'undefined' && process.env && process.env.SKYV) SKY_VMULT = +process.env.SKYV; // stelle più forti: se ne accendono circa metà
let SKY_RINGS = 15, SKY_COST0 = 20, SKY_COSTG = 3.0;
if (typeof process !== 'undefined' && process.env && process.env.SKYG) { SKY_COSTG = +process.env.SKYG; SKY_COST0 = +(process.env.SKY0 || SKY_COST0); }
const SKY_GATES = [0, 0, 0, 0, 2, 2, 4, 4, 6, 6, 8, 10, 12, 14, 16, 18]; // anello -> zona da completare (indice = anello)
const SKY_SECTORS = [
  { name: 'Attacco', color: '#E2504A', ic: '⚔', kinds: [['atk', 0.04, 'Danni'], ['atk', 0.04, 'Danni'], ['aspd', 0.01, "Vel. d'attacco"]] },
  { name: 'Vita', color: '#7ED36F', ic: '♥', kinds: [['hp', 0.05, 'Vita'], ['hp', 0.05, 'Vita'], ['heal', 0.04, 'Cure']] },
  { name: 'Difesa', color: '#5B9BFF', ic: '⛨', kinds: [['def', 0.05, 'Difesa'], ['block', 0.004, 'Blocco'], ['dodge', 0.004, 'Schivata']] },
  { name: 'Critico', color: '#FFD34D', ic: '✦', kinds: [['crit', 0.004, 'Prob. critico'], ['critDmg', 0.04, 'Danni critici'], ['critDmg', 0.04, 'Danni critici']] },
  { name: 'Oro e vendita', color: '#F2994A', ic: '◈', kinds: [['gold', 0.05, 'Oro'], ['gold', 0.05, 'Oro'], ['sell', 0.1, 'Vendita oggetti']] },
  { name: 'Esperienza e drop', color: '#B07CF0', ic: '✎', kinds: [['xp', 0.05, 'Esperienza'], ['drop', 0.03, 'Prob. di drop'], ['capture', 0.02, 'Prob. di cattura']] },
];
const SKY_SPECIAL = [['bag', 2, 'Posti zaino', '🎒'], ['chest', 2, 'Posti forziere', '📦'], ['offline', 1800, 'Tempo offline', '⏳'], ['move', 0.05, 'Velocità di marcia', '☄']];
const SKY = (() => {
  const nodes = [{ id: 0, r: 0, i: 0, x: 0, y: 0, sec: -1, kind: null, v: 0, cost: 0, adj: [] }];
  for (let r = 1; r <= SKY_RINGS; r++) {
    const n = r === 1 ? 6 : 6 * r + 6;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 - Math.PI / 2 + (r % 2) * 0.05, sec = Math.floor(i / n * 6), per = n / 6, j = i - Math.round(sec * per);
      const special = r % 3 === 0 && j === Math.floor(per / 2);
      let kind, v, label, ic;
      if (special) { const sp = SKY_SPECIAL[(r / 3 - 1 + sec) % SKY_SPECIAL.length]; kind = sp[0]; v = sp[1]; label = sp[2]; ic = sp[3]; }
      else { const kd = SKY_SECTORS[sec].kinds[(i + r) % 3]; kind = kd[0]; v = +(kd[1] * SKY_VMULT * (1 + 0.15 * (r - 1))).toFixed(4); label = kd[2]; ic = SKY_SECTORS[sec].ic; }
      nodes.push({ id: nodes.length, r, i, n, x: Math.cos(a) * r, y: Math.sin(a) * r, sec, kind, v, label, ic, special, cost: Math.round(SKY_COST0 * Math.pow(SKY_COSTG, r - 1) * (special ? 3 : 1)), adj: [] });
    }
  }
  const ring = r => nodes.filter(o => o.r === r);
  for (const o of nodes) { if (!o.r) continue;
    const rg = ring(o.r), nx = rg[(o.i + 1) % rg.length]; o.adj.push(nx.id); nx.adj.push(o.id);
    let best = null, bd = 1e9; for (const q of (o.r === 1 ? [nodes[0]] : ring(o.r - 1))) { const d = (q.x - o.x) ** 2 + (q.y - o.y) ** 2; if (d < bd) { bd = d; best = q; } }
    o.adj.push(best.id); best.adj.push(o.id);
  }
  return nodes;
})();
function skyOwned(s) { if (!s.sky) s.sky = [0]; return s.sky; }
function skyRingOpen(s, r) { return s.cleared >= (SKY_GATES[r] || 0); }
function skyCanBuy(s, id) { const o = SKY[id], own = skyOwned(s); if (!o || own.includes(id) || !skyRingOpen(s, o.r)) return false; return o.adj.some(a => own.includes(a)); }
// Il prezzo cresce con le stelle già accese (non con l'anello): a fine gioco resta circa metà cielo da accendere
let SKY_G = 1.085; if (typeof process !== 'undefined' && process.env && process.env.SKYG2) SKY_G = +process.env.SKYG2;
function skyCost(s, id) { const n = Math.max(0, skyOwned(s).length - 1); return Math.round(SKY_COST0 * Math.pow(SKY_G, n) * (SKY[id].special ? 3 : 1)); }
function skyBuy(s, id) { const c = skyCost(s, id); if (!skyCanBuy(s, id) || s.gold < c) return false; s.gold -= c; s.skySpent = (s.skySpent || 0) + c; s.sky.push(id); s._tb = null; return true; }
function skyReset(s) { let back = s.skySpent; if (back === undefined) { back = 0; for (const id of skyOwned(s)) back += SKY[id].cost; } s.sky = [0]; s.skySpent = 0; s.gold += back; s._tb = null; return back; }
// somma dei bonus delle stelle accese (in cache)
function tb(s) { if (s._tb && s._tbn === skyOwned(s).length) return s._tb; const t = {}; for (const id of skyOwned(s)) { const o = SKY[id]; if (o.kind) t[o.kind] = (t[o.kind] || 0) + o.v; } s._tb = t; s._tbn = s.sky.length; return t; }
const B = (s, k) => tb(s)[k] || 0;
// per la simulazione: compra sempre la stella raggiungibile più economica
function autoSky(s) { let n = 0; for (;;) { let best = null; for (const o of SKY) if (skyCanBuy(s, o.id) && (!best || (o.special ? 0 : 1) > (best.special ? 0 : 1))) best = o; if (!best || s.gold < skyCost(s, best.id) || n > 300) break; skyBuy(s, best.id); n++; } return n; }

// Costellazioni a cieli (vecchio sistema, non più usato): ogni boss apre un cielo e alza il limite delle stelle già aperte
const TIERS = [
  { zone: 0, name: 'Primo cielo', stars: ['forza', 'vita', 'scudo'] },
  { zone: 2, name: 'Secondo cielo', stars: ['branco', 'tesoro', 'lama'] },
  { zone: 4, name: 'Terzo cielo', stars: ['saggezza', 'furia', 'commercio'] },
  { zone: 6, name: 'Quarto cielo', stars: ['cometa', 'richiamo'] },
];
function openTiers(s) { return TIERS.filter(t => s.cleared >= t.zone).length; }
function tierOf(k) { return TIERS.findIndex(t => t.stars.includes(k)); }
function starCap(s, k) { const t = TREE[k], ti = tierOf(k), o = openTiers(s); if (ti < 0 || o <= ti) return 0; return Math.ceil(t.max * (o - ti) / (TIERS.length - ti)); }
function starOpen(s, k) { return (s.tree[k] || 0) < starCap(s, k); }
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
  { id: 'boss3', name: 'Domatore di fiamme', desc: "Sconfiggi l'Imperatore Magma (zona 15)", test: s => s.cleared >= 15, astri: 45 },
  { id: 'boss4', name: "Oltre l'Abisso", desc: 'Sconfiggi il Divoratore di Stelle (zona 20)', test: s => s.cleared >= 20, astri: 80 },
  { id: 'c21', name: 'Bestiario del Fuoco', desc: 'Cattura tutte le creature della Nebulosa di Fuoco', test: s => PLANETS[2].species.every(k => s.roster[k]), astri: 80 },
  { id: 'c28', name: "Bestiario dell'Abisso", desc: "Cattura tutte le creature dell'Abisso Stellare", test: s => PLANETS[3].species.every(k => s.roster[k]), astri: 100 },
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
    sky: [0], team: ['hero'], roster: { hero: newMember('hero', 1) }, inventory: [], chest: [], rareLog: [], nextId: 1,
    tree: { forza: 0, vita: 0, branco: 0, scudo: 0, lama: 0, furia: 0, tesoro: 0, saggezza: 0, commercio: 0, cometa: 0, richiamo: 0 },
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
// Si parte con 8 posti (eroi esclusi); ogni boss indicato sblocca un posto in più
let SLOT_UNLOCKS = [5, 10, 15, 20]; // +1 posto ogni 5 zone completate, in automatico (15 e 20 arriveranno con i nuovi pianeti)
if (typeof process !== 'undefined' && process.env && process.env.SLOTS) SLOT_UNLOCKS = JSON.parse(process.env.SLOTS);
const BASE_SLOTS = 8;
const CREATURE_SLOTS = 12; // massimo: 8 di base + 4 dalle zone (5 e 15 da comprare, 10 e 20 gratis); niente di più, per lasciare spazio alle scelte di squadra
// Ogni zona completata permette di comprare un posto in più con l'oro
const SLOT_BUY_ZONES = []; // niente più posti a pagamento
const SLOT_PRICES = [2000000, 2000000000];
function slotsBuyable(s) { return SLOT_BUY_ZONES.filter(z => s.cleared >= z).length - (s.boughtSlots || 0); }
function nextSlotPrice(s) { return SLOT_PRICES[s.boughtSlots || 0]; }
function buySlot(s) { const c = nextSlotPrice(s); if (slotsBuyable(s) < 1 || !c || s.gold < c || slotCount(s) >= CREATURE_SLOTS) return false; s.gold -= c; s.boughtSlots = (s.boughtSlots || 0) + 1; fillTeam(s); return true; }
function isHero(id) { return !!(SPECIES[id] && SPECIES[id].hero); }
function slotCount(s) { return Math.min(CREATURE_SLOTS, BASE_SLOTS + SLOT_UNLOCKS.filter(z => s.cleared >= z).length + (s.boughtSlots || 0)); }
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
let LEVEL_CAP = 25; if (typeof process !== 'undefined' && process.env && process.env.LCAP) LEVEL_CAP = +process.env.LCAP; // alla fine della zona 20 si è intorno al 20-21: il resto si farma
let XP_R = 4.4, XP_0 = 30000; if (typeof process !== 'undefined' && process.env && process.env.XPR) { XP_R = +process.env.XPR; XP_0 = +(process.env.XP0 || XP_0); }
function xpNeed(l) { return Math.round(XP_0 * Math.pow(XP_R, l - 1)); } // circa un livello per zona
// ---------- Statistiche degli oggetti ----------
// Statistiche principali dal tipo; statistiche bonus casuali: 0 comune, 1 non comune, 2 rara, 3 epica, 4 leggendaria
const STAT_LABEL = { atk: 'Danni', hp: 'PV massimi', def: 'Difesa', crit: 'Prob. critico', critDmg: 'Danni critici', aspd: "Vel. d'attacco", block: 'Blocco', dodge: 'Schivata' };
const PCT_STATS = ['crit', 'critDmg', 'aspd', 'block', 'dodge'];
const BONUS_KEYS = ['atk', 'hp', 'def', 'crit', 'critDmg', 'aspd', 'block', 'dodge'];
const BONUS_DEF = { atk: 0.12, hp: 0.8, def: 0.04, crit: 0.02, critDmg: 0.08, aspd: 0.04, block: 0.03, dodge: 0.03 };
const SUFFIX = { atk: 'della Furia', hp: 'del Gigante', def: 'della Roccia', crit: 'del Falco', critDmg: 'della Tempesta', aspd: 'del Vento', block: 'del Bastione', dodge: "dell'Ombra" };
const BONUS_COUNT = { comune: 0, noncomune: 1, rara: 2, epica: 3, leggendaria: 4, mitico: 4, astrale: 4, arcano: 5, eterno: 5, segreto: 5 };
const rarMult = k => ITEM_RARITY.find(r => r.key === k).mult;
// Livello oggetto = livello di zona (1-20): nella zona N cadono oggetti di livello da 1 a N
const MAX_ITEM_LEVEL = 20;
let ITEM_G = 3.2; if (typeof process !== 'undefined' && process.env && process.env.IG) ITEM_G = +process.env.IG; // crescita del potere per livello di oggetto
function itemLevel(it) { return it.lvl || 1; }
function rollItemLevel(s, zone) { return 1 + Math.floor(rnd(s) * Math.min(zone, MAX_ITEM_LEVEL)); }
function itemBase(it) { return 4 * Math.pow(ITEM_G, itemLevel(it) - 1) * rarMult(it.rarity) * (1 + 0.1 * (it.up || 0)); }
function pctScale(it) { return Math.sqrt(rarMult(it.rarity)) * (1 + itemLevel(it) / 20); }
function mainStats(it) {
  const P = itemBase(it), q = pctScale(it), c = it.cls, o = {};
  switch (it.slot) {
    case 'arma': if (c === 'Arciere') { o.atk = P * 0.6; o.crit = 0.02 * q; } else if (c === 'Curatore') o.atk = P * 0.5; else o.atk = P * 0.7; break;
    case 'secondaria': if (c === 'Arciere') { o.atk = P * 0.2; o.crit = 0.015 * q; } else if (c === 'Guerriero') { o.atk = P * 0.25; o.aspd = 0.03 * q; } else o.atk = P * 0.3; break;
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
// Rimescola i bonus di un oggetto (Astri); i bonus bloccati restano, ma ognuno raddoppia il costo
// costo in Pietre del rimescolo (si trovano dai nemici, rarità media): 1 + 1 per ogni bonus bloccato, raddoppiando
function rerollCost(it, locks) { return Math.pow(2, locks.length); }
const STONE_DROP = 0.000011; // circa una ogni 3 giorni
function rerollBonus(s, id, locks) {
  const it = s.inventory.find(x => x.id === id) || s.chest.find(x => x.id === id); if (!it || !(it.bonus || []).length) return false;
  locks = locks.filter(i => i < it.bonus.length); if (locks.length >= it.bonus.length) return false;
  const c = rerollCost(it, locks); if ((s.stones || 0) < c) return false; s.stones -= c;
  const keep = locks.map(i => it.bonus[i]), n = it.bonus.length; it.bonus = keep.slice(); while (it.bonus.length < n) rollBonus(s, it);
  const out = []; let ki = 0, ni = keep.length; for (let i = 0; i < n; i++) out.push(locks.includes(i) ? it.bonus[ki++] : it.bonus[ni++]); it.bonus = out; return true;
}
// Fusione: 20 oggetti della stessa rarità (fino all'Epico) diventano 1 oggetto della rarità successiva
const FUSE_N = 10, FUSE_MAX = 6; // fino ad Astrale → Arcano (come la runa cremisi)
function fusable(s, rk) { return s.inventory.filter(it => it.rarity === rk && !isProtected(s, it) && !it.locked); }
function fuse(s, rk) {
  const ri = rarityIndex(rk); if (ri < 0 || ri > FUSE_MAX) return null; const list = fusable(s, rk).sort((a, b) => itemPower(a) - itemPower(b)); if (list.length < FUSE_N) return null;
  const used = list.slice(0, FUSE_N), lvl = Math.max(...used.map(itemLevel)), ids = new Set(used.map(x => x.id)); s.inventory = s.inventory.filter(x => !ids.has(x.id));
  const slot = KINDS[Math.floor(rnd(s) * KINDS.length)], cls = slot === 'arma' || slot === 'secondaria' ? Object.keys(CLASSES)[Math.floor(rnd(s) * 5)] : null;
  const it = finishItem(s, { id: s.nextId++, slot, cls, rarity: ITEM_RARITY[ri + 1].key, lvl, up: 0, isNew: true }); s.inventory.push(it); return it;
}
function finishItem(s, it) { it.bonus = []; for (let i = 0; i < BONUS_COUNT[it.rarity]; i++) rollBonus(s, it); return it; }
// Punteggio dell'oggetto: serve per confrontare e vendere
function itemPower(it) { return Math.round(itemBase(it) * (1 + 0.12 * ((it.bonus || []).length))); }
function itemName(it) { const base = it.slot === 'arma' ? WEAPON[it.cls] : it.slot === 'secondaria' ? SECONDARY[it.cls] : ITEM_NAME[it.slot]; const b = it.bonus && it.bonus[0]; return b ? base + ' ' + SUFFIX[b.k] : base; }
function upgradeCost(it) { return Math.round(itemPower(it) * 6 * (1 + it.up)); }
let _sellBonus = 0; // impostato dallo stato attivo (stella Commercio)
function sellValue(it, s) { const c = s ? B(s, 'sell') : 0; return Math.round(itemPower(it) * 1.5 * (1 + c)); }
function canUse(m, it) { return (it.slot !== 'arma' && it.slot !== 'secondaria') || it.cls === SPECIES[m.species].cls; }
// posto in cui va l'oggetto: quello libero o il più debole tra quelli del suo tipo
function targetSlot(m, it) { let best = null, bp = Infinity; for (const sl of SLOTS) { if (kindOf(sl) !== it.slot) continue; const c = m.eq[sl], p = c ? itemPower(c) : -1; if (p < bp) { bp = p; best = sl; } } return best; }

// Punti statistica: 5 per livello per ogni personaggio, da distribuire
const PTS_PER_LEVEL = 5;
const ATTRS = {
  atk:  { name: 'Forza',      desc: '+2% danni',                      ic: '⚔', color: '#E2504A' },
  hp:   { name: 'Vitalità',   desc: '+3% vita',                       ic: '♥', color: '#7ED36F' },
  def:  { name: 'Tempra',     desc: '+3% difesa e +0,2% blocco',      ic: '⛨', color: '#5B9BFF' },
  crit: { name: 'Precisione', desc: '+0,3% critico e +1,5% danni critici', ic: '✦', color: '#FFD34D' },
};
function ptsOf(m) { return m.pts || (m.pts = { atk: 0, hp: 0, def: 0, crit: 0 }); }
function ptsFree(m) { const p = ptsOf(m); return PTS_PER_LEVEL * (m.lvl - 1) - (p.atk + p.hp + p.def + p.crit); }
function addPts(s, id, k, n) { const m = s.roster[id]; if (!m || !ATTRS[k]) return 0; const p = ptsOf(m); n = n > 0 ? Math.min(n, ptsFree(m)) : Math.max(n, -p[k]); p[k] += n; return n; }
function resetPts(s, id) { const m = s.roster[id]; if (m) m.pts = { atk: 0, hp: 0, def: 0, crit: 0 }; }
// distribuzione consigliata in base alla classe (usata dal pulsante "Auto" e dalla simulazione)
const AUTO_PTS = { Guerriero: { atk: 0.6, crit: 0.2, hp: 0.2 }, Arciere: { atk: 0.5, crit: 0.4, hp: 0.1 }, Mago: { atk: 0.7, crit: 0.2, hp: 0.1 }, Curatore: { atk: 0.5, hp: 0.5 } };
function autoPts(s, id) { const m = s.roster[id], w = AUTO_PTS[SPECIES[m.species].cls]; let f = ptsFree(m); const keys = Object.keys(w); while (f > 0) { const p = ptsOf(m), tot = p.atk + p.hp + p.def + p.crit + 1; let best = keys[0], gap = -1e9; for (const k of keys) { const g = w[k] - p[k] / tot; if (g > gap) { gap = g; best = k; } } p[best]++; f--; } }
// Sinergie: bonus per classi uguali (2/4/6) e per la squadra con tutte e 5 le classi
const SYN_SAME = [[6, 0.20], [4, 0.12], [2, 0.05]], SYN_ALL = 0.08;
function synergy(s, cls) { const cc = classCounts(s), n = cc[cls] || 0; let v = 0; for (const [k, b] of SYN_SAME) if (n >= k) { v = b; break; } if (Object.values(cc).every(x => x > 0)) v += SYN_ALL; return v; }
function classCounts(s) { const c = { Guerriero: 0, Arciere: 0, Mago: 0, Curatore: 0 }; for (const id of s.team) c[SPECIES[s.roster[id].species].cls]++; return c; }

function memberStats(s, id) {
  const m = s.roster[id], cls = SPECIES[m.species].cls, b = CLASSES[cls];
  const lm = (1 + 0.35 * (m.lvl - 1)) * (SPECIES[m.species].secret ? SECRET_MULT : 1), tg = SPECIES[m.species].tough ? TOUGH : null;
  let hp = b.hp * lm * (tg ? tg.hp : 1), atk = b.atk * lm * (tg ? tg.atk : 1), def = b.def * lm * (tg ? tg.def : 1), crit = 0.05, critDmg = 1.5;
  let aspd = 0, block = b.block || 0, dodge = 0;
  for (const sl of SLOTS) {
    const it = m.eq[sl]; if (!it) continue; const sm = 1 + 0.1 * ((m.slv && m.slv[sl]) || 0), st = itemStats(it);
    atk += (st.atk || 0) * sm; hp += (st.hp || 0) * sm; def += (st.def || 0) * sm;
    crit += (st.crit || 0) * sm; critDmg += (st.critDmg || 0) * sm; aspd += (st.aspd || 0) * sm; block += (st.block || 0) * sm; dodge += (st.dodge || 0) * sm;
  }
  const syn = synergy(s, cls); hp *= 1 + syn; atk *= 1 + syn;
  const pt = ptsOf(m); atk *= 1 + 0.02 * pt.atk; hp *= 1 + 0.03 * pt.hp; def *= 1 + 0.03 * pt.def; block += 0.002 * pt.def; crit += 0.003 * pt.crit; critDmg += 0.015 * pt.crit;
  hp *= 1 + B(s, 'hp');
  atk *= 1 + B(s, 'atk');
  def *= 1 + B(s, 'def');
  crit += B(s, 'crit'); critDmg += B(s, 'critDmg'); aspd += B(s, 'aspd'); block += B(s, 'block'); dodge += B(s, 'dodge');
  return { hp: Math.round(hp), atk: Math.round(atk), def: Math.round(def * 10) / 10, spd: b.spd / (1 + Math.min(aspd, 1)), crit: Math.min(crit, 0.75), critDmg, block: Math.min(block, 0.5), dodge: Math.min(dodge, 0.4), aspd: Math.min(aspd, 1), cls };
}
function memberPower(s, id) { const st = memberStats(s, id); return Math.round(st.hp / 6 + st.atk * 2 + st.def * 3 + st.crit * 100); }

// ---------------- Battaglia ----------------
// Curva a tre tratti: le prime battaglie volano, poi la difficoltà accelera (prima parte facile, muro verso il boss)
// Ogni zona: prime battaglie facili, poi accelera verso il boss. Ogni zona nuova parte un po' sotto il boss della precedente.
// Dentro una zona i nemici crescono poco (gli oggetti hanno il livello della zona): il salto vero è tra una zona e l'altra
let WZ = 1.03; if (typeof process !== 'undefined' && process.env && process.env.WZ) WZ = +process.env.WZ;
let WZ1 = 1.015; if (typeof process !== 'undefined' && process.env && process.env.WZ1) WZ1 = +process.env.WZ1;
function withinZone(n, z) { return Math.pow(z && z <= 5 ? WZ1 : WZ, n - 1); } // sul primo pianeta la zona cresce più piano: le prime 5 zone si fanno nel primo giorno
// Passo tra le zone: sul primo pianeta più dolce, sul secondo più ripido (la squadra è già grande)
let ZONE_K = [0, 0, 1.3, 1.3, 1.3, 1.3, 3.8, 2.8, 2.8, 2.8, 2.3, 1.85, 1.85, 1.85, 1.85, 1.85, 1.65, 1.65, 1.65, 1.65, 1.65]; // tarato: zone 1-5 nel primo giorno, zona 10 in circa 3 giorni, zona 20 in circa 34 giorni (giocatore che controlla ogni 4 ore)
if (typeof process !== 'undefined' && process.env && process.env.ZK) ZONE_K = JSON.parse(process.env.ZK);
const ZONE_BASE = [0, 1]; for (let z = 2; z <= MAX_ZONE; z++) ZONE_BASE[z] = ZONE_BASE[z - 1] * withinZone(30, z - 1) * ZONE_K[z]; // passo base tra zone (fisso), indipendente dalla crescita dentro la zona
function enemyScale(z, n) { return ZONE_BASE[z] * withinZone(n, z); }

const MELEE_STEP = 2; // velocità con cui la mischia raggiunge chi sta dietro (unità di gittata al secondo)
// Nemici per battaglia: si parte da 3 e si sale verso l'ultima battaglia della zona (5 nella zona 1, 15 nella zona 20)
function enemyCount(z, n) { const top = 5 + (z - 1) * 10 / (MAX_ZONE - 1); return Math.round(3 + (top - 3) * (n - 1) / (BOSS_BATTLE - 1)); }
function enemiesLeft(z, n) { let t = 0; for (let k = n + 1; k <= BOSS_BATTLE; k++) t += enemyCount(z, k); return t; }
// I nemici entrano uno alla volta da fuori schermo, ognuno con il suo passo: i Guerrieri corrono, arcieri e maghi arrivano dopo
const ENEMY_START = 14, ENEMY_GAP = 0.5, ENEMY_V = { Guerriero: 6, Arciere: 4.5, Mago: 4.5, Curatore: 4 };
function arriveTime(i, cls) { return i * ENEMY_GAP + (ENEMY_START - CLASSES[cls].range) / ENEMY_V[cls]; } // secondi per entrare in scena: i nemici arrivano insieme, in gruppo, alla stessa velocità
function makeEnemies(s) {
  const n = s.battle, Z = ZONES[s.zone], f = enemyScale(s.zone, n), pool = Z.pool;
  const list = [];
  const count = enemyCount(s.zone, n) - (n === BOSS_BATTLE ? 1 : 0);
  for (let i = 0; i < count; i++) list.push(pickWeighted(s, pool, k => RARITY[SPECIES[k].rarity].weight));
  let secret = false; s.seen = s.seen || {}; for (const sp of list) s.seen[sp] = 1;
  if (n === BOSS_BATTLE) { const sk = Z.boss + '_s'; secret = !s.roster[sk] && rnd(s) < SECRET_P * (s.settings && s.settings.test ? 50 : 1); list.unshift(secret ? sk : Z.boss); s.seen[list[0]] = 1; }
  return list.map((sp, i) => {
    const cls = SPECIES[sp].cls, boss = n === BOSS_BATTLE && i === 0, b = CLASSES[cls], sec = boss && secret;
    const big = s.zone % 5 === 0; // i boss di pianeta (zone 5 e 10) sono più duri
    const hp = Math.round(b.hp * 0.45 * f * (boss ? (big ? 8 : 4) : 1) * (sec ? 1.5 : 1));
    return { side: 'e', idx: i, species: sp, cls, boss, secret: sec, hp, maxHp: hp, atk: b.atk * 0.46 * f * (boss ? (big ? 1.6 : 1.3) : 1) * (sec ? 1.15 : 1), def: b.def * 0.5 * f, spd: b.spd * 1.15, crit: 0.05, critDmg: 1.5, t: rnd(s) * b.spd, mark: 0, hits: 0, ab: 0, dealt: 0, taken: 0, arrive: arriveTime(i, cls) / moveSpeed(s), pos: ENEMY_START };
  });
}

// La vita NON si ricarica tra una battaglia e l'altra: solo i Curatori curano.
// Si torna a vita piena quando cambia la zona, quando la zona ricomincia dopo il boss o quando la squadra cade.
function startBattle(s) {
  s.runHp = s.runHp || {};
  const party = s.team.map((id, i) => { const st = memberStats(s, id), fr = s.runHp[id] === undefined ? 1 : s.runHp[id]; return { side: 'p', pos: -CLASSES[st.cls].range, idx: i, id, species: s.roster[id].species, cls: st.cls, hp: Math.round(st.hp * fr), maxHp: st.hp, atk: st.atk, def: st.def, spd: st.spd, crit: st.crit, critDmg: st.critDmg, block: st.block, dodge: st.dodge, t: rnd(s) * st.spd, mark: 0, hits: 0, ab: 0, dealt: 0, taken: 0 }; });
  return { party, enemies: makeEnemies(s), time: 0, over: null, pause: 0 };
}

function alive(list) { return list.filter(u => u.hp > 0); }
function ready(list) { return list.filter(u => u.hp > 0 && !(u.arrive > 0)); }
function frontTarget(s, list) {
  const a = ready(list); if (!a.length) return null;
  // si colpisce solo il personaggio più vicino: gittata più bassa, poi chi sta più avanti nella fila
  let best = a[0]; for (const u of a) { const g = CLASSES[u.cls].range, gb = CLASSES[best.cls].range; if (g < gb || (g === gb && u.idx < best.idx)) best = u; } return best;
}

function dealDamage(s, b, src, dst, mult, ignoreDef, ev) {
  if (dst.dodge && rnd(s) < dst.dodge) { if (ev) ev.push({ type: 'dodge', side: dst.side, idx: dst.idx }); return; }
  let dmg = src.atk * mult;
  let crit = false;
  if (rnd(s) < src.crit) { dmg *= src.critDmg; crit = true; }
  if (!ignoreDef) dmg *= src.atk / (src.atk + 1.5 * dst.def); // difesa a rendimento decrescente: niente muri impossibili
  if (dst.mark > 0) dmg *= 1.3;
  if (dst.block && rnd(s) < dst.block) dmg *= 0.5;
  dmg = Math.max(1, Math.round(dmg));
  const real = Math.min(dmg, dst.hp); src.dealt += real; dst.taken += real;
  if (src.side === 'p') { const d = s.dmgLog || (s.dmgLog = { since: s.clock || 0, by: {} }); d.by[src.id] = (d.by[src.id] || 0) + real; }
  dst.hp -= dmg;
  if (ev) ev.push({ type: 'dmg', side: dst.side, idx: dst.idx, dmg, crit });
  if (dst.hp <= 0) { dst.hp = 0; if (dst.side === 'e') onKill(s, b, dst, ev); }
}

function attack(s, b, u, ev) {
  const foes = u.side === 'p' ? b.enemies : b.party;
  const tgt = frontTarget(s, foes); // entrambe le parti colpiscono chi è più vicino
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

// Chi cade in battaglia torna a vita piena dopo 2 minuti di gioco
const RESPAWN_TIME = 120;
function step(s, b, dt, ev) {
  s.clock = (s.clock || 0) + dt;
  if (b.over) { b.pause -= dt; if (b.pause <= 0) finishBattle(s, b, ev); return; }
  b.time += dt;
  for (const u of b.party.concat(b.enemies)) {
    if (u.hp <= 0) continue;
    if (u.arrive > 0) { u.arrive -= dt; if (u.side === 'e') { const g = CLASSES[u.cls].range; u.pos = g + Math.min(ENEMY_START - g, Math.max(0, u.arrive) * ENEMY_V[u.cls] * moveSpeed(s)); } continue; }
    if (u.mark > 0) u.mark -= dt;
    if (u.side === 'p' && u.cls === 'Curatore') {
      u.ab += dt;
      if (u.ab >= 3) {
        let w = null; for (const a of b.party) if (a.hp > 0 && a.hp < a.maxHp && (!w || a.hp / a.maxHp < w.hp / w.maxHp)) w = a;
        if (w) { u.ab = 0; const fat = w.healT && b.time - w.healT < 2 ? 0.5 : 1; w.healT = b.time; // cure ravvicinate dimezzate: niente tank immortale
          const h = Math.round(Math.min(w.maxHp - w.hp, (w.maxHp * 0.06 + u.atk * 1.0) * (u.side === 'p' ? 1 + B(s, 'heal') : 1) * fat)); w.hp += h; u.healed = (u.healed || 0) + h; if (ev) ev.push({ type: 'heal', idx: w.idx, h }); }
      }
    }
    if (u.side === 'p' && u.cls === 'Mago') {
      u.ab += dt;
      const tg = frontTarget(s, b.enemies);
      if (u.ab >= 5 && tg) { u.ab = 0; if (ev) ev.push({ type: 'skill', side: 'p', idx: u.idx, name: 'Fulmine arcano!' }); dealDamage(s, b, u, tg, 2.5, true, ev); }
    }
    u.t -= dt;
    if (CLASSES[u.cls].range === 1) { // chi combatte in mischia deve prima raggiungere il bersaglio
      const tg = frontTarget(s, u.side === 'p' ? b.enemies : b.party);
      if (tg) { const gap = Math.abs(u.pos - tg.pos); if (gap > 2.01) { u.pos += (tg.pos > u.pos ? 1 : -1) * Math.min(MELEE_STEP * dt, gap - 2); continue; } }
    }
    if (u.t <= 0) { u.t += u.spd; attack(s, b, u, ev); }
  }
  if (!alive(b.enemies).length) { b.over = 'win'; b.pause = 1.0 / moveSpeed(s); }
  else if (!alive(b.party).length) { b.over = 'lose'; b.pause = 1.5; }
  else if (b.time > 90) { b.over = 'lose'; b.pause = 1.5; } // stallo
}

function finishBattle(s, b, ev) {
  s.runHp = {}; s.deadAt = s.deadAt || {};
  for (const u of b.party) {
    if (u.hp > 0) { s.runHp[u.id] = u.hp / u.maxHp; delete s.deadAt[u.id]; continue; }
    if (s.deadAt[u.id] === undefined) s.deadAt[u.id] = s.clock;
    if (s.clock - s.deadAt[u.id] >= RESPAWN_TIME) { s.runHp[u.id] = 1; delete s.deadAt[u.id]; if (ev) ev.push({ type: 'respawn', id: u.id }); } else s.runHp[u.id] = 0;
  }
  if (b.over === 'win') {
    s.stats.wins++;
    if (s.battle === BOSS_BATTLE) {
      const zt = s.clock - (s.zoneStart || 0); s.bestZone = s.bestZone || {}; if (!s.bestZone[s.zone] || zt < s.bestZone[s.zone]) s.bestZone[s.zone] = zt; if (ev) ev.push({ type: 'zonetime', zone: s.zone, t: zt, best: s.bestZone[s.zone] === zt });
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
      s.battle = 1; s.runHp = {}; s.deadAt = {}; s.zoneStart = s.clock; // la campagna avanza; le zone già finite ricominciano dalla battaglia 1
    } else s.battle++;
    if (s.zone === s.maxZone) s.maxBattle = Math.max(s.maxBattle, s.battle);
    s.maxGlobal = Math.max(s.maxGlobal || 1, gIndex(s.zone, s.battle));
  } else {
    s.stats.losses++;
    s.battle = 1; s.runHp = {}; s.deadAt = {}; s.zoneStart = s.clock; // squadra sconfitta: la zona ricomincia dalla battaglia 1, a vita piena
  }
  if (ev) ev.push({ type: 'battle', result: b.over });
  const nb = startBattle(s); Object.assign(b, nb);
}

function onKill(s, b, e, ev) {
  const f = enemyScale(s.zone, s.battle);
  s.stats.kills++;
  s.kills = s.kills || {}; s.kills[e.species] = (s.kills[e.species] || 0) + 1;
  const pass = hasPass(s) ? 2 : 1; // Pass: oro ed esperienza doppi
  const gold = Math.round(1 * f * (e.boss ? 10 : 1) * (1 + B(s, 'gold')) * pass);
  s.gold += gold; s.stats.gold += gold; trackMinute(s, 1, gold);
  const xp = Math.round(3 * f * (e.boss ? 8 : 1) * pass * (1 + B(s, 'xp')));
  for (const u of b.party) if (u.hp > 0) gainXp(s, u.id, xp, ev); // solo chi è vivo in campo prende PE
  if (ev) ev.push({ type: 'kill', idx: e.idx, gold });
  // drop
  const firstBoss = e.boss && s.zone > s.cleared;
  const dropP = (e.boss ? (firstBoss ? 1 : 0.1) : 0.007) * (1 + B(s, 'drop'));
  if (rnd(s) < dropP) dropItem(s, e.boss, ev);
  // rune
  if (firstBoss) { addRune(s, 'noncomune', 2, ev); addRune(s, 'rara', 1, ev); }
  if (rnd(s) < STONE_DROP * (e.boss ? 20 : 1)) { s.stones = (s.stones || 0) + 1; if (ev) ev.push({ type: 'stone' }); }
  else for (const k of RUNE_KEYS) { if (rnd(s) < RUNE_DROP[k] * (e.boss ? 20 : 1)) { addRune(s, k, 1, ev); break; } }
  // cattura
  tryCapture(s, e, ev);
}

function tryCapture(s, e, ev) {
  const sp = e.species; if (s.roster[sp]) return;
  if (SPECIES[sp].secret) { // boss segreto: si unisce sempre
    const m = newMember(sp, 1); m.waitKills = 1; s.roster[sp] = m; if (!teamFull(s)) s.team.push(sp);
    s.stats.secrets = (s.stats.secrets || 0) + 1;
    if (ev) ev.push({ type: 'capture', species: sp, secret: true }); return;
  }
  s.hunt[sp] = (s.hunt[sp] || 0) + 1;
  let p = RARITY[SPECIES[sp].rarity].p * (1 + Math.min(0.5, B(s, 'capture')));
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
  const it = finishItem(s, { id: s.nextId++, slot, cls, rarity: r.key, lvl: rollItemLevel(s, s.zone), up: 0, isNew: true });
  s.stats.items++; s.stats.byRar = s.stats.byRar || {}; s.stats.byRar[r.key] = (s.stats.byRar[r.key] || 0) + 1;
  if (rarityIndex(r.key) >= 4) s.stats.legendary++;
  if (RARE_FEED.includes(r.key)) { s.stats.rare = s.stats.rare || {}; s.stats.rare[r.key] = (s.stats.rare[r.key] || 0) + 1; (s.rareLog = s.rareLog || []).unshift({ t: Date.now(), rarity: r.key, slot, zone: s.zone, lvl: it.lvl }); s.rareLog.length = Math.min(s.rareLog.length, 50); if (ev) ev.push({ type: 'rare', item: it }); }
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
function deactivatePass(s) { s.pass = 0; } // solo per le prove: toglie il Pass
function rarityIndex(k) { return ITEM_RARITY.findIndex(r => r.key === k); }
// Gratis si vendono da soli solo i comuni (al massimo "tieni da Non comune in su"); oltre serve il Pass
const FREE_MAX_FILTER = 1; // gratis: si vendono solo i comuni
// Zaino e forziere: 20 posti ciascuno, il doppio col Pass. Le rune non occupano posto.
const BAG_BASE = 20;
function bagCap(s) { return BAG_BASE * (hasPass(s) ? 2 : 1) + (s.extraBag || 0) + B(s, 'bag'); }
function chestCap(s) { return BAG_BASE * (hasPass(s) ? 2 : 1) + (s.extraChest || 0) + B(s, 'chest'); }
// Spazi extra nello Shop: per sempre, ma se ne possono comprare pochi ogni mese
const SPACE_PACK = { n: 2, cost: 500, perMonth: 2 };
function monthKey(now) { const d = new Date(now || Date.now()); return d.getFullYear() * 100 + d.getMonth() + 1; }
function spaceLeft(s, kind) { const m = monthKey(); if (!s.spaceBuys || s.spaceBuys.m !== m) return SPACE_PACK.perMonth; return SPACE_PACK.perMonth - (s.spaceBuys[kind] || 0); }
function buySpace(s, kind) { if (spaceLeft(s, kind) < 1 || s.astri < SPACE_PACK.cost) return false; const m = monthKey(); if (!s.spaceBuys || s.spaceBuys.m !== m) s.spaceBuys = { m, bag: 0, chest: 0 }; s.spaceBuys[kind]++; s.astri -= SPACE_PACK.cost; if (kind === 'bag') s.extraBag = (s.extraBag || 0) + SPACE_PACK.n; else s.extraChest = (s.extraChest || 0) + SPACE_PACK.n; return true; }
function toChest(s, id) { const i = s.inventory.findIndex(x => x.id === id); if (i < 0 || s.chest.length >= chestCap(s)) return false; s.chest.push(s.inventory.splice(i, 1)[0]); return true; }
function fromChest(s, id) { const i = s.chest.findIndex(x => x.id === id); if (i < 0 || s.inventory.length >= bagCap(s)) return false; s.inventory.push(s.chest.splice(i, 1)[0]); return true; }
function offlineCap(s) { return OFFLINE_CAP * (hasPass(s) ? 2 : 1) + B(s, 'offline'); }
const PASS_MAX_FILTER = 2; // col Pass si vendono in automatico anche i non comuni, mai oltre
function maxFilter(s) { return hasPass(s) ? PASS_MAX_FILTER : FREE_MAX_FILTER; }
function minKeep(s) { return Math.min(rarityIndex(s.settings.minRarity || 'comune'), maxFilter(s), protectIdx(s)); }
// "Tieni sempre da ... in su": queste rarità non si vendono mai (né a mano né in automatico)
function protectIdx(s) { const k = s.settings.protect || 'segreto'; return k === 'none' ? ITEM_RARITY.length : rarityIndex(k); }
function isProtected(s, it) { return !!it.locked || rarityIndex(it.rarity) >= protectIdx(s); }
function toggleLock(s, id) { const it = s.inventory.find(x => x.id === id) || s.chest.find(x => x.id === id); if (!it) return false; it.locked = !it.locked; return it.locked; }
function sellBelow(s) { const min = minKeep(s); let gold = 0, n = 0; s.inventory = s.inventory.filter(it => { if (rarityIndex(it.rarity) < min && !isProtected(s, it)) { const g = sellValue(it, s); gold += g; n++; logSold(s, it, g); return false; } return true; }); s.gold += gold; return { gold, n }; }
function sellRest(s) {
  // vende ciò che non migliora nessuno della squadra (la riserva non conta)
  let gold = 0, n = 0;
  const keep = [];
  for (const it of s.inventory) {
    const useful = s.team.some(id => { const m = s.roster[id]; if (m.locked || !canUse(m, it)) return false; const c = m.eq[targetSlot(m, it)]; return !c || itemPower(it) > itemPower(c); });
    if (useful || isProtected(s, it)) keep.push(it); else { const g = sellValue(it, s); gold += g; n++; logSold(s, it, g); }
  }
  s.inventory = keep; s.gold += gold; return { gold, n };
}
function equipTo(s, itemId, memberId) {
  const it = s.inventory.find(x => x.id === itemId), m = s.roster[memberId]; if (!it || !m || !canUse(m, it)) return false;
  const sl = targetSlot(m, it), cur = m.eq[sl]; s.inventory = s.inventory.filter(x => x.id !== itemId); if (cur) s.inventory.push(cur); m.eq[sl] = it; it.isNew = false; return true;
}
function unequip(s, memberId, slot) { const m = s.roster[memberId]; if (m && m.eq[slot]) { s.inventory.push(m.eq[slot]); m.eq[slot] = null; } }
function logSold(s, it, g) { (s.sold = s.sold || []).unshift({ it, g }); s.sold.length = Math.min(s.sold.length, 10); }
function buyBack(s, idx) { const e = (s.sold || [])[idx]; if (!e || s.gold < e.g || s.inventory.length >= bagCap(s)) return false; s.gold -= e.g; s.inventory.push(e.it); s.sold.splice(idx, 1); return true; }
function sellItem(s, itemId) { const i = s.inventory.findIndex(x => x.id === itemId); if (i < 0 || isProtected(s, s.inventory[i])) return 0; const [it] = s.inventory.splice(i, 1); const g = sellValue(it, s); s.gold += g; logSold(s, it, g); return g; }
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
// Oro per Astri nello Shop: la quantità segue la zona più lontana raggiunta (= ore di combattimento lì)
const GOLD_PACKS = [{ astri: 30, hours: 2 }, { astri: 120, hours: 10 }, { astri: 300, hours: 30 }];
function goldPack(s, i) { const p = GOLD_PACKS[i]; return Math.round(p.hours * 500 * enemyScale(s.maxZone, s.maxZone === s.zone ? s.maxBattle : 30) * (1 + B(s, 'gold'))); }
function buyGold(s, i) { const p = GOLD_PACKS[i]; if (!p || s.astri < p.astri) return 0; const g = goldPack(s, i); s.astri -= p.astri; s.gold += g; return g; }
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
    items.push(finishItem(s, { id: s.nextId++, slot, cls, rarity: r.key, lvl: rollItemLevel(s, s.maxZone), up: 0, isNew: true, price: SHOP_PRICE[r.key], sold: false }));
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
function setZone(s, z) { if (z < 1 || z > s.maxZone) return false; s.zone = z; s.battle = 1; s.runHp = {}; s.zoneStart = s.clock || 0; return true; }
function moveSpeed(s) { return 1 + B(s, 'move'); }
function untank(o) { if (!o || typeof o !== 'object') return; if (o.cls === 'Tank') o.cls = 'Guerriero'; for (const k in o) untank(o[k]); }
function migrate(s) {
  untank(s); for (const id in (s.roster || {})) { const m = s.roster[id]; if (SPECIES[m.species] && !SPECIES[m.species].hero) m.name = SPECIES[m.species].name; } // i mostri tengono il loro nome: si rinominano solo gli eroi // la classe Tank non esiste più: armi e creature passano ai Guerrieri
  if (s.zone === undefined) { s.zone = 1; s.maxZone = 1; s.cleared = 0; s.battle = 1; s.maxBattle = 1; s.maxGlobal = 1; delete s.bossCleared; }
  if (typeof s.runes !== 'object' || s.runes === null) s.runes = { noncomune: s.runes || 0, rara: 0, epica: 0, leggendaria: 0 };
  if (s.runes.mitico === undefined) s.runes.mitico = 0; if (s.runes.astrale === undefined) s.runes.astrale = 0; if (s.runes.arcano === undefined) s.runes.arcano = 0;
  if (s.tree.corona) { const c = [500000, 50000000, 5000000000, 500000000000]; for (let l = 0; l < s.tree.corona; l++) s.gold += c[l]; delete s.tree.corona; }
  if (s.boughtSlots) { s.gold += 2000000 * s.boughtSlots; s.boughtSlots = 0; } // posti comprati: oro restituito, ora si sbloccano da soli
  for (const k in TREE) if (s.tree[k] === undefined) s.tree[k] = 0;
  if (!s.sky) { let back = 0; for (const k in TREE) { for (let l = 0; l < (s.tree[k] || 0); l++) back += TREE[k].cost(l); s.tree[k] = 0; } s.gold += back; s.sky = [0]; }
  if (!s.chest) s.chest = []; if (!s.rareLog) s.rareLog = [];
  delete s.settings.autoStars; delete s.settings.autoMode; delete s._nextStar;
  trimTeam(s);
  if (false) { const keep = []; let n = 0; for (const id of s.team) { if (isHero(id)) keep.push(id); else if (n < slotCount(s)) { keep.push(id); n++; } } s.team = keep; }
  delete s.dust; delete s.train; delete s.move;
  if (s.shop && s.shop.items.some(i => i.price !== SHOP_PRICE[i.rarity])) s.shop = null;
  if (s.runes === undefined) s.runes = 0; if (s.astri === undefined) s.astri = 0; if (s.shop === undefined) s.shop = null;
  const OLD = { armatura: 'corazza', accessorio: 'anello', amuleto: 'collana' }, OLDSL = { armatura: 'corazza', accessorio: 'anello1', amuleto: 'collana' };
  const fixItem = it => { if (it && OLD[it.slot]) it.slot = OLD[it.slot]; if (it && !it.lvl) { it.lvl = Math.max(1, Math.min(MAX_ITEM_LEVEL, Math.ceil((it.ilvl || 1) / 30))); delete it.ilvl; } return it; };
  const addB = it => { if (it && !it.bonus) finishItem(s, it); };
  for (const it of s.inventory || []) { fixItem(it); addB(it); }
  for (const it of s.chest || []) fixItem(it);
  for (const id in s.roster) { const m = s.roster[id]; if (m.lvl > LEVEL_CAP) { m.lvl = LEVEL_CAP; m.xp = 0; } }
  if (s.shop) for (const it of s.shop.items) { fixItem(it); addB(it); }
  for (const id in s.roster) {
    const m = s.roster[id], eq = emptyEq(), slv = emptySlv();
    for (const k in (m.eq || {})) { const nk = OLDSL[k] || k; if (nk in eq) { eq[nk] = fixItem(m.eq[k]); addB(eq[nk]); } }
    for (const k in (m.slv || {})) { const nk = OLDSL[k] || k; if (nk in slv) slv[nk] = m.slv[k]; }
    m.eq = eq; m.slv = slv;
  }
  return s;
}

function buyTree(s, key) { const t = TREE[key], l = s.tree[key]; if (l >= t.max || !starOpen(s, key)) return false; const c = t.cost(l); if (s.gold < c) return false; s.gold -= c; s.tree[key]++; s._nextStar = 0; return true; }
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

const api = { skyCost, enemyCount, enemiesLeft, deactivatePass, TOUGH, SECRET_SPECIES, SECRET_MULT, rerollCost, rerollBonus, FUSE_N, FUSE_MAX, fusable, fuse, PTS_PER_LEVEL, ATTRS, ptsOf, ptsFree, addPts, resetPts, autoPts, synergy, SYN_SAME, SYN_ALL, buyBack, SKY, SKY_SECTORS, SKY_GATES, skyOwned, skyCanBuy, skyBuy, skyReset, skyRingOpen, tb, autoSky, MAX_ITEM_LEVEL, itemLevel, SLOT_BUY_ZONES, TIERS, openTiers, tierOf, starCap, SLOT_PRICES, slotsBuyable, nextSlotPrice, buySlot, GOLD_PACKS, goldPack, buyGold, SPACE_PACK, spaceLeft, buySpace, PASS_MAX_FILTER, toggleLock, STARMAP, starOpen, RUNE_BUY, buyRune, protectIdx, isProtected, nextSlotZone, SLOT_UNLOCKS, BASE_SLOTS, DAILY_ASTRI, dailyReady, claimDaily, nextMidnight, hasPass, maxFilter, minKeep, bagCap, chestCap, toChest, fromChest, offlineCap, isHero, creaturesInTeam, teamFull, CREATURE_SLOTS, HERO_SHOP, PASS_PRICE, buyHero, RARE_FEED, activatePass, targetSlot, itemStats, mainStats, bonusValue, STAT_LABEL, PCT_STATS, missionGoal, missionReward, missionTier, missionReady, claimMission, missionsReady, CLASSES, RARITY, SPECIES, PLANETS, ZONES, MAX_ZONE, ALL_SPECIES, planetOf, zoneOf, gIndex, setZone, ITEM_RARITY, SLOTS, KINDS, kindOf, SLOT_LABEL, TREE, ACH, OFFLINE_CAP, BOSS_BATTLE,
  LEVEL_CAP, newState, startBattle, step, memberStats, memberPower, itemPower, itemName, upgradeCost, sellValue, canUse, classCounts, slotCount, capturedCount, xpNeed,
  autoEquip, sellRest, sellBelow, rarityIndex, RUNE, RUNE_DROP, totalRunes, nextRarity, canRaise, raiseRarity, slotRune, slotCost, upgradeSlot, sellRunes, ensureShop, buyShop, rerollShop, REROLL_COST, moveSpeed, cheapestStar, autoStars, nextRefresh, migrate, SHOP_PRICE, equipTo, unequip, sellItem, buyTree, resetTree, moveMember, addToTeam, removeFromTeam, checkAch, simulateOffline, avgLevel };
if (typeof module !== 'undefined') module.exports = api; else root.FA = api;
})(this);
