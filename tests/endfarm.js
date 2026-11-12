const F=require('../src/core.js');
const seed=+(process.env.SEED||5);const s=F.newState();s.seed=seed;s.settings.autoEquip=true;let t=0;let b=F.startBattle(s);
const maint=()=>{F.autoSky(s);while(F.buySlot(s));for(const id in s.roster)F.autoPts(s,id);F.sellRest(s);F.autoEquip(s);};
while(s.cleared<20&&t<60*86400){F.step(s,b,0.25,[]);t+=0.25;if(t%14400===0)maint();}
// dopo la fine: 10 giorni di farm sulla zona 20 per crescere un po'
for(let u=0;u<10*86400;u+=0.25){F.step(s,b,0.25,[]);if(u%14400===0)maint();}
maint();
const val=r=>Object.keys(r).reduce((a,k)=>a+r[k]*F.RUNE[k].value,0);
console.log('fine gioco giorno',(t/86400).toFixed(1),'livello eroe',s.roster.hero.lvl,'stelle',s.sky.length);
for(const z of [20,18,15,12,10,5]){F.setZone(s,z);b=F.startBattle(s);const r0=JSON.parse(JSON.stringify(s.runes)),k0=s.stats.kills;
 for(let u=0;u<86400;u+=0.25){F.step(s,b,0.25,[]);if(u%14400===0)F.sellRest(s);}
 const d={};for(const k in s.runes)d[k]=s.runes[k]-r0[k];
 console.log('zona',z,'| uccisioni/giorno',s.stats.kills-k0,'| rune',JSON.stringify(d),'| Astri vendendole',val(d));}
