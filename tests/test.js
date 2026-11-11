const FA = require('../src/core.js');
for (const test of [false, true]) {
  const s = FA.newState(); s.seed = 12345; s.settings.test = test;
  let t0 = Date.now();
  for (let h = 1; h <= 24; h++) {
    const r = FA.simulateOffline(s, 3600);
    FA.checkAch(s);
    if ([1,2,4,8,12,24].includes(h)) console.log(`test=${test} h=${h} battle=${s.battle} max=${s.maxBattle} boss=${s.bossCleared} kills=${s.stats.kills} W/L=${s.stats.wins}/${s.stats.losses} gold=${s.gold} dust=${s.dust} team=${s.team.map(id=>id+':'+s.roster[id].lvl).join(',')} caps=${FA.capturedCount(s)} inv=${s.inventory.length}`);
  }
  console.log('ms', Date.now()-t0);
}
