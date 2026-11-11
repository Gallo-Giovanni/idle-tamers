const F=require(process.argv[2]||'../src/core.js');
const s=F.newState();s.seed=5;s.settings.autoEquip=true;
const days=+(process.argv[3]||10);let t=0;const b0=F.startBattle(s);
for(let d=1;d<=days;d++){while(t<d*86400){F.step(s,b0,0.25,[]);t+=0.25;if(t%3600===0){F.autoStars(s);F.sellRest(s);F.autoEquip(s);}}
 const eqp=id=>{let p=0;for(const k in s.roster[id].eq)if(s.roster[id].eq[k])p+=F.itemPower(s.roster[id].eq[k]);return p};
 console.log('g'+d,'z'+s.zone,'max'+s.maxZone+':'+s.maxBattle,'cl'+s.cleared,'team',s.team.map(id=>id.slice(0,4)+s.roster[id].lvl+'/'+Math.round(eqp(id))).join(' '),'W/L',s.stats.wins,s.stats.losses,'gold',Math.round(s.gold),'tree',JSON.stringify(s.tree).replace(/"/g,''),'lost',s.stats.lost||0);}
