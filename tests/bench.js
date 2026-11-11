const F=require('../src/core.js');
const seed=+process.argv[2], DAYS=+process.argv[3]||30;
const s=F.newState();s.seed=seed;
const first={};const mark=(k,h)=>{if(first[k]===undefined)first[k]=h;};
let prevR={...s.runes};
const rarSeen=new Set();
for(let h=1;h<=DAYS*24;h++){
  const before=s.stats.items;
  F.simulateOffline(s,3600,true);
  for(const k in s.runes){ if(s.runes[k]>0) mark('runa_'+k,h); }
  // rarità presenti (inventario + equipaggiati)
  const all=[...s.inventory];for(const id in s.roster)for(const sl in s.roster[id].eq)if(s.roster[id].eq[sl])all.push(s.roster[id].eq[sl]);
  for(const it of all) mark('ogg_'+it.rarity,h);
  if(s.stats.legendary>0) mark('ogg_leggendaria_drop',h);
  if(s.roster.hero.lvl>=30) mark('eroe_lv30',h);
  if(s.team.length>1 && s.team.every(id=>s.roster[id].lvl>=30)) mark('squadra_lv30',h);
  for(let z=1;z<=10;z++) if(s.cleared>=z) mark('zona'+z,h);
  if(F.PLANETS[0].species.every(k=>s.roster[k])) mark('cattura_pianeta1',h);
  if(F.ALL_SPECIES.every(k=>s.roster[k])) mark('cattura_tutte',h);
  for(const k of F.ALL_SPECIES) if(s.roster[k]) mark('c_'+k,h);
}
console.log(JSON.stringify({seed,first,runes:s.runes,kills:s.stats.kills,team:s.team.length}));
