// cerca ZONE_K zona per zona perché ogni zona finisca al giorno obiettivo (giocatore che controlla ogni 4 ore)
const { execFileSync } = require('child_process');
const target = [0, 0.25, 0.9, 1.9, 3.2, 4.8, 6.6, 8.6, 10.6, 12.8, 15]; // giorni
let K = [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1];
function run(K, z) {
  const code = `process.env.XPR="3.6";process.env.XP0="50000";process.env.ZK=${JSON.stringify(JSON.stringify(K))};const F=require('../src/core.js');const s=F.newState();s.seed=5;s.settings.autoEquip=true;let t=0;const b=F.startBattle(s);const lim=${target[z]}*86400*2.5;
  while(t<lim&&s.cleared<${z}){F.step(s,b,0.25,[]);t+=0.25;if(t%14400===0){F.autoStars(s);while(F.buySlot(s));F.sellRest(s);F.autoEquip(s);}}console.log(s.cleared>=${z}?t/86400:99)`;
  return +execFileSync('node', ['-e', code], { cwd: __dirname }).toString().trim();
}
for (let z = 2; z <= 10; z++) {
  let lo = 0.6, hi = 1.8;
  for (let i = 0; i < 8; i++) { const mid = Math.sqrt(lo * hi); K[z] = mid; const d = run(K, z); if (d < target[z]) lo = mid; else hi = mid; }
  K[z] = +Math.sqrt(lo * hi).toFixed(3); console.log('zona', z, 'K', K[z], 'giorni', run(K, z).toFixed(2), 'obiettivo', target[z]);
}
console.log(JSON.stringify(K));
