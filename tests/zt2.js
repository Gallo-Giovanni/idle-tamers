process.env.ZK=process.argv[2];const F=require('../src/core.js');
for(const seed of [5,11,23]){const s=F.newState();s.seed=seed;s.settings.autoEquip=true;let t=0;const b=F.startBattle(s);const r={};
while(t<+(process.argv[3]||20)*86400&&s.cleared<10){F.step(s,b,0.25,[]);t+=0.25;if(t%14400===0){F.autoSky(s);while(F.buySlot(s));for(const id in s.roster)F.autoPts(s,id);F.sellRest(s);F.autoEquip(s);}if(!r[s.cleared]&&s.cleared)r[s.cleared]=(t/86400).toFixed(1)+'/L'+s.roster.hero.lvl;}
console.log('  ',Array.from({length:10},(_,i)=>r[i+1]||'-').join(' '),'| fine z'+s.zone+' b'+s.maxBattle+' L'+s.roster.hero.lvl);}
