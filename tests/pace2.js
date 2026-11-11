const F=require(process.argv[2]||'../src/core.js');
const s=F.newState();s.seed=5;s.settings.autoEquip=true;
let t=0;const reach={};const days=+(process.argv[3]||10);
const b=F.startBattle(s);
while(t<days*86400){F.step(s,b,0.25,[]);t+=0.25;if(t%3600===0)F.autoStars(s); // giocatore che compra stelle ogni ora
if(!reach[s.cleared]&&s.cleared>0)reach[s.cleared]=t;}
const f=x=>x===undefined?'-':x<3600?(x/60).toFixed(0)+'m':x<86400?(x/3600).toFixed(1)+'h':(x/86400).toFixed(1)+'g';
console.log(Array.from({length:10},(_,i)=>'z'+(i+1)+':'+f(reach[i+1])).join(' '));
console.log('hero',s.roster.hero.lvl,'team',s.team.length,'caps',F.capturedCount(s),'zone',s.zone,'battle',s.battle,'maxBattle',s.maxBattle,'kills',s.stats.kills,'items',s.stats.items,'gold',s.stats.gold);
