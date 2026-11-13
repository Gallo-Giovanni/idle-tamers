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
  fiorastro: [{ P: '#F49AC1', Q: '#D9669C', Y: '#FFE27A', G: '#5A9E6F', H: '#3F7A52', K: '#1B1F3B', W: '#FFFFFF' }, ['....PP.PP....', '...PQPPPQP...', '..PPPYYYPPP..', '...PYKYKYP...', '..PPYYYYYPP..', '...PQPPPQP...', '....PP.PP....', '......G......', '...HH.G.HH...', '....HHGHH....', '......G......', '....GGGGG....']],
  polvino: [{ L: '#C9C2E6', D: '#9A92C0', W: '#FFFFFF', K: '#1B1F3B', P: '#F49AC1', Y: '#FFE27A' }, ['..L.......L..', '.LDL.....LDL.', '.LDL.....LDL.', '..LLLLLLLLL..', '.LLLLLLLLLLL.', 'LLLWKLLLWKLLL', 'LLLKKLLLKKLLL', 'LLPLLLYLLLPLL', '.LLLLLLLLLLL.', '..LLLLLLLLL..', '..DD.....DD..']],
  meteorino: [{ R: '#E2504A', O: '#F28B3C', Y: '#FFE27A', S: '#7A6E66', T: '#5A504A', K: '#1B1F3B', W: '#FFFFFF' }, ['Y............', 'YO...........', '.OR..........', '..ORR.SSSS...', '...RSSSSSSS..', '....SSWKSWKS.', '...SSSKKSKKS.', '...SSSSSSSSS.', '...STSSSTSSS.', '....SSSSSSS..', '.....SSSSS...', '.....T...T...']],
  radichino: [{ B: '#8A5A2B', D: '#5E3A1A', G: '#7ED36F', H: '#4E9A4A', K: '#1B1F3B', W: '#FFFFFF' }, ['.....G.G.....', '....GHGHG....', '.....GGG.....', '...BBBBBBB...', '..BBBBBBBBB..', '.BBWKBBBWKBB.', '.BBKKBBBKKBB.', '.BBBBBBBBBBB.', '.BBDBBDBBDBB.', '..BBBBBBBBB..', '.D.D.D.D.D.D.', 'D..D..D..D..D']],
  lucciolo: [{ Y: '#FFE27A', L: '#FFF6C0', B: '#3E6FD8', D: '#2A4A9A', W: '#BFE8FF', K: '#1B1F3B' }, ['..W.......W..', '.WWW.....WWW.', 'WWWWW...WWWWW', '.WWW.BBB.WWW.', '....BBBBB....', '...BBKBKBB...', '...BBBBBBB...', '....DBBBD....', '....YYYYY....', '...YYLLLYY...', '...YYLLLYY...', '....YYYYY....']],
  pipistrella: [{ V: '#6A3FB8', D: '#432580', P: '#F49AC1', W: '#FFFFFF', K: '#1B1F3B', Y: '#FFE27A' }, ['....V...V....', '....VV.VV....', 'V...VVVVV...V', 'VV.VVWVWVV.VV', 'VVVVVKVKVVVVV', 'VDVVVVVVVVVDV', 'D.DVVVPVVVD.D', '...DVVVVVD...', '....DVVVD....', '.....Y.Y.....']],
  orbo: [{ C: '#B07CF0', D: '#7A4AC0', W: '#FFFFFF', B: '#5BD8E6', K: '#1B1F3B', Y: '#FFE27A' }, ['.Y.........Y.', '..Y..CCC..Y..', '....CCCCC....', '...CCWWWCC...', '..CCWWBBWWCC.', '..CWWBKKBWWC.', '..CWWBKKBWWC.', '..CCWWBBWWCC.', '...CCWWWCC...', '....DCCCD....', '...D.D.D.D...', '..D..D.D..D..']],
  brinello: [{ W: '#E8FBFF', C: '#9FE6FF', D: '#5BB8E0', K: '#1B1F3B', P: '#F49AC1' }, ['......W......', '...W..C..W...', '....WCCCW....', '..WCCCCCCCW..', '...CCCCCCC...', '..CCKCCCKCC..', '..CCCCCCCCC..', '..CCPCCCPCC..', '...CCCCCCC...', '....DCCCD....', '...D.....D...']],
  stalagmo: [{ G: '#8E9AB8', D: '#5E6A88', P: '#C08CFF', W: '#FFFFFF', K: '#1B1F3B' }, ['.....P...P...', '....PP..PP...', '...GPGGGPG...', '..GGGGGGGGG..', '.GGWKGGGWKGG.', '.GGKKGGGKKGG.', '.GGGGGGGGGGG.', 'GGDGGGDGGGDGG', 'GGGGGGGGGGGGG', '.GGG.GGG.GGG.', '.DDD.DDD.DDD.']],
  cristallux: [{ C: '#7FE3FF', D: '#3FA0C8', W: '#FFFFFF', K: '#1B1F3B', R: '#E2504A' }, ['.....CCC.....', '....CWCCC....', '...CCCCCCC...', 'D..CRCCCRC..D', '.D.CCCCCCC.D.', '..DDCCCCCDD..', '.D..DCCCD..D.', 'D..D.D.D.D..D', '..D..D.D..D..', '.D...D.D...D.']],
  gufolunare: [{ S: '#B8C4E8', D: '#7E8AB8', Y: '#FFE27A', K: '#1B1F3B', O: '#F28B3C', W: '#FFFFFF' }, ['..S.......S..', '..SS.....SS..', '..SSSSSSSSS..', '.SSWWSSSWWSS.', '.SWYKWSWYKWS.', '.SSWWSOSWWSS.', '.SSSSSOSSSSS.', 'DSSSSSSSSSSSD', 'DSSDSSDSSDSSD', '.SSSSSSSSSSS.', '..SSSSSSSSS..', '...O.....O...']],
  ghiacciolo: [{ C: '#BFF1FF', D: '#7FCDE6', W: '#FFFFFF', K: '#1B1F3B', P: '#F49AC1' }, ['......W......', '.....WCW.....', '....CCCCC....', '...CCCCCCC...', '..CCWCCCWCC..', '.CCCKCCCKCCC.', '.CCCCCCCCCCC.', 'CCCPCCCCCPCCC', 'CCCCCCCCCCCCC', '.DDDDDDDDDDD.']],
  lunella: [{ W: '#F4F7FF', S: '#C9D3E6', Y: '#FFE27A', K: '#1B1F3B', B: '#7FA8E0' }, ['...Y.....Y...', '....Y...Y....', 'WW...SSS...WW', 'WSW.SSSSS.WSW', 'WBSWSKSKSWSBW', 'WSSWSSSSSWSSW', '.WSWSSSSSWSW.', '..WWWSSSWWW..', '.WSW.SSS.WSW.', '.WW...S...WW.']],
  riflessa: [{ M: '#E8ECFF', V: '#C08CFF', B: '#7FE3FF', K: '#1B1F3B', P: '#F49AC1', Y: '#FFE27A' }, ['.B....Y....B.', 'BBB..YYY..BBB', 'BVBB.MMM.BBVB', '.BVBMMMMMBVB.', '..BBMKMKMBB..', '....MMPMM....', '...VVMMMVV...', '..V.VVVVV.V..', '....VV.VV....', '....M...M....']],
  braciolo: [{ R: '#E2504A', O: '#F28B3C', Y: '#FFE27A', K: '#1B1F3B', D: '#8A2A22' }, ['.....Y.......', '....YOY..Y...', '...YOOOY.O...', '..OORRROOO...', '.ORRRRRRRRO..', '.RRKRRRKRRR..', '.RRKRRRKRRR..', 'RRRRRDDRRRRR.', 'RRRRRRRRRRRR.', '.DRRRRRRRRD..', '..DD...DD....']],
  lavarospo: [{ G: '#5A3A2A', L: '#F28B3C', Y: '#FFE27A', K: '#1B1F3B', W: '#FFFFFF' }, ['..WW.....WW..', '.WKKW...WKKW.', '.GWWGGGGGWWG.', 'GGGGGGGGGGGGG', 'GLGGGLGGGLGGG', 'GGGGGGGGGGGGG', 'GGLLLLLLLLLGG', '.GGGGGGGGGGG.', 'GG.GG...GG.GG', 'LL.LL...LL.LL']],
  fiammella: [{ Y: '#FFE27A', O: '#F28B3C', R: '#E2504A', K: '#1B1F3B', W: '#FFFFFF' }, ['......Y......', '.....YY......', '....YOY..Y...', '...YOOOY.YY..', '..YOOOOOYOY..', '..OORKOKROO..', '.OORRRRRRROO.', '.ORRRRWRRRRO.', '..RRRRRRRRR..', '...RRRRRRR...', '....RRRRR....']],
  cenerino: [{ A: '#7A7480', D: '#55505C', O: '#F28B3C', K: '#1B1F3B', W: '#FFFFFF' }, ['..A.......A..', '.AOA.....AOA.', '.AOA.....AOA.', '..AAAAAAAAA..', '.AAAAAAAAAAA.', 'AAAWKAAAWKAAA', 'AAAKKAAAKKAAA', 'AAAAAAOAAAAAA', '.AAAAAAAAAAA.', '..DD.....DD..']],
  magmolo: [{ M: '#F28B3C', R: '#E2504A', Y: '#FFE27A', K: '#1B1F3B', D: '#8A2A22' }, ['.....Y.......', '....YMY......', '...MMMMM.....', '..MMMMMMMM...', '.MMKMMMMKMM..', '.MMKMMMMKMM..', 'MMMMMRRMMMMM.', 'MYMMMMMMMYMM.', 'MMMMMMMMMMMM.', '.DDDDDDDDDD..']],
  salamandro: [{ S: '#E2504A', D: '#A0302A', Y: '#FFE27A', K: '#1B1F3B', W: '#FFFFFF' }, ['..............', '...SSS........', '..SWKSS.......', '..SSSSSS......', '...SSSSSSS....', '..YSSSSSSSSS..', '.Y.SSDSSDSSSS.', '...SS.SS..SSSY', '...DD.DD...SYY', '............Y.']],
  vulcanello: [{ R: '#E2504A', O: '#F28B3C', B: '#6A4A3A', D: '#4A3228', K: '#1B1F3B', W: '#FFFFFF' }, ['....O.R.O....', '.....ROR.....', '....BRRRB....', '...BBBBBBB...', '..BBWKBBWKB..', '..BBKKBBKKB..', '.BBBBBBBBBBB.', '.BRBBBRBBBRB.', 'BBBBBBBBBBBBB', 'DDDDDDDDDDDDD']],
  fenicino: [{ O: '#F28B3C', Y: '#FFE27A', R: '#E2504A', K: '#1B1F3B', W: '#FFFFFF' }, ['....Y.Y......', '...YOYOY.....', '....OOOO.....', '...OOKOO.....', '..YOOOOOOR...', 'RROOYYOOORRR.', '.RROOYYOORR..', '...OOOOOO....', '....Y..Y.....', '...YY..YY....']],
  scoriatto: [{ C: '#3A2E2A', O: '#F28B3C', Y: '#FFE27A', K: '#1B1F3B', P: '#F49AC1' }, ['.C.......C...', '.CC.....CC...', '.COCCCCCOC...', 'CCCCCCCCCC...', 'CCYKCCYKCC..O', 'CCCCCPCCCC.O.', '.CCCCCCCC.O..', '..CCCCCCCCO..', '..CC.CC.CC...', '..OO.OO.OO...']],
  draghetto: [{ G: '#C0392B', L: '#F28B3C', Y: '#FFE27A', K: '#1B1F3B', W: '#FFFFFF' }, ['..Y.....Y....', '..GG...GG....', '.GGGGGGGG..L.', '.GWKGGWKG.LL.', '.GGGGGGGGLLL.', 'LLGGYYGGLL...', '.LGGYYGGL....', '..GGYYGGG....', '..GG..GG.GG..', '..YY..YY..GG.']],
  ossidiana: [{ O: '#4A3E66', P: '#9A6AE0', L: '#B07CF0', R: '#E2504A', K: '#0B0E24' }, ['....OOOOO....', '...OPLPOOO...', '..OOOOOOOOO..', '.OORKOOOROOO.', '.OOOOOOOOOOO.', 'OOPOOOOOOOPOO', 'OOOOOLLOOOOOO', '.OOO.OOO.OOO.', '.OO..OOO..OO.', 'KKK.KKKKK.KKK']],
  lapillo: [{ A: '#5A4A4A', O: '#F28B3C', Y: '#FFE27A', K: '#1B1F3B', R: '#E2504A' }, ['....A...A....', '....AA.AA....', 'O...AAAAA...O', 'OO.AAYAYAA.OO', 'OOOAAAAAAAOOO', 'ROOAAARAAAOOR', 'R.ROAAAAAOR.R', '...RAAAAAR...', '....RAAAR....', '.....Y.Y.....']],
  solforo: [{ Y: '#E8E04A', G: '#B8B030', W: '#FFFFFF', K: '#1B1F3B', O: '#F28B3C' }, ['.Y.........Y.', '..Y..YYY..Y..', '....YYYYY....', '...YYWWWYY...', '..YYWKYKWYY..', '..YYWWWWWYY..', '...YYOOOYY...', '....YYYYY....', '...G.Y.Y.G...', '..G..Y.Y..G..', '.G...G.G...G.']],
  imperatore: [{ R: '#E2504A', O: '#F28B3C', Y: '#FFE27A', B: '#4A2A22', K: '#1B1F3B', W: '#FFFFFF' }, ['...Y.Y.Y.Y...', '...YYYYYYY...', '..BBBBBBBBB..', '.BBWKBBBWKBB.', '.BBBBBBBBBBB.', '.BBRRRRRRRBB.', 'OBBBBOOBBBBBO', 'OBBRBBBBBRBBO', 'OBBBBBBBBBBBO', '.BBRBBBBBRBB.', '.BBB.BBB.BBB.', 'RRRR.RRR.RRRR']],
  ombretto: [{ S: '#4A4290', D: '#2E2860', W: '#E8ECFF', V: '#B07CF0', K: '#0B0E24' }, ['.....SSS.....', '...SSSSSSS...', '..SSSSSSSSS..', '.SSWWSSSWWSS.', '.SSWVSSSWVSS.', '.SSSSSSSSSSS.', 'SSSSSVVVSSSSS', 'SSSSSSSSSSSSS', 'S.SSS.S.SSS.S', 'D..D..D..D..D']],
  abissale: [{ C: '#7FE3FF', P: '#F49AC1', W: '#E8FBFF', K: '#1B1F3B', V: '#B07CF0' }, ['....CCCCC....', '..CCCCCCCCC..', '.CCWCCCCCWCC.', '.CCKCCCCCKCC.', '.CCCCPPPCCCC.', '..CCCCCCCCC..', '..V.C.V.C.V..', '.V..C.V.C..V.', '..V.C.V.C.V..', '.V..C..V.C..V']],
  lanternino: [{ B: '#3A3F6A', D: '#24284A', Y: '#FFE27A', W: '#FFFFFF', K: '#0B0E24' }, ['.........YY..', '........Y..Y.', '.......B..YY.', '...BBBBBB....', '..BBBBBBBB...', '.BBWKBBBBBBB.', 'BBBBBBBBBBBBB', 'BWBWBWBBBBBB.', '.BBBBBBBBB...', '..DD....DD...']],
  nullo: [{ N: '#3A3060', L: '#6A5AA8', W: '#E8ECFF', K: '#0B0E24', V: '#B07CF0' }, ['..LLLLLLLLL..', '.LNNNNNNNNNL.', '.LNNNNNNNNNL.', '.LNWWNNNWWNL.', '.LNWKNNNWKNL.', '.LNNNNNNNNNL.', '.LNNVVVVVNNL.', '.LNNNNNNNNNL.', '.LLLLLLLLLLL.', '..KK.....KK..']],
  sussurro: [{ G: '#C9C2F0', D: '#8A82C0', K: '#1B1F3B', V: '#B07CF0' }, ['....GGGGG....', '...GGGGGGG...', '..GGGGGGGGG..', '..GKKGGGKKG..', '..GGGGGGGGG..', '..GGGVVVGGG..', '.GGGGGGGGGGG.', 'GGGGGGGGGGGGG', 'G.GG.GGG.GG.G', 'D..D..D..D..D']],
  tentacula: [{ T: '#8A3A9A', P: '#C060D0', W: '#FFFFFF', K: '#1B1F3B' }, ['....TTTTT....', '...TTTTTTT...', '..TTTPTPTTT..', '..TTWKTWKTT..', '..TTTTTTTTT..', '...TTTTTTT...', '.T.T.T.T.T.T.', 'T.T..T.T..T.T', '.P...P.P...P.', 'P...P...P...P']],
  corvonero: [{ C: '#4A4A66', D: '#2E2E48', Y: '#FFE27A', V: '#6A3FB8', K: '#0B0E24' }, ['...CCC.......', '..CCCCC......', '.CCYKCCC.....', 'YYCCCCCC.....', '..CCCCCCCC...', '..CVCCCCCCCC.', '.CVVVCCCCCCCC', '..CVCCCCCC.CC', '...CCCCCC....', '....Y..Y.....']],
  guscionero: [{ G: '#4E4E78', V: '#9A6AE0', W: '#E8ECFF', K: '#0B0E24' }, ['GG.........GG', 'G.G.......G.G', 'GGG.......GGG', '.G..W...W..G.', '.G..K...K..G.', '..GGGGGGGGG..', '.GGVGGVGGVGG.', 'GGGGGGGGGGGGG', '.GGGGGGGGGGG.', 'G.G.G...G.G.G']],
  eclissa: [{ D: '#1B1F3B', Y: '#FFE27A', O: '#F28B3C', W: '#E8ECFF', K: '#0B0E24' }, ['YY.........YY', 'YOY...D...YOY', 'YOOY.DDD.YOOY', 'YOOOYDDDYOOOY', '.YOOYDWDYOOY.', '..YYDDDDDYY..', '.YOOYDDDYOOY.', 'YOOY.DDD.YOOY', 'YOY...D...YOY', 'YY.........YY']],
  milleocchi: [{ P: '#4A2A6A', W: '#FFFFFF', K: '#0B0E24', R: '#E2504A', V: '#B07CF0' }, ['...PPPPPPP...', '..PWKPPPWKP..', '.PPWWPWKPWWP.', 'PWKPPPWWPPPPP', 'PWWPPRRRPWKPP', 'PPPPRWKWRPWWP', 'PWKPRRRRRPPPP', 'PWWPPPPPPPWKP', '.PPPWKPWKPWWP', '..PPWWPWWPPP.', '...V..V..V...']],
  colosso: [{ S: '#4A4A6A', D: '#2E2E48', V: '#B07CF0', W: '#E8ECFF', K: '#0B0E24' }, ['...SSSSSSS...', '..SSVSSSVSS..', '..SSWSSSWSS..', 'SSSSSSSSSSSSS', 'SSSSSVVVSSSSS', 'SS.SSSSSSS.SS', 'SS.SSSSSSS.SS', 'DD.SSS.SSS.DD', '...SSS.SSS...', '..DDDD.DDDD..']],
  spettrina: [{ W: '#E8ECFF', G: '#A8B0E0', K: '#1B1F3B', P: '#F49AC1', V: '#B07CF0' }, ['....WWWWW....', '...WWWWWWW...', '..WWKWWWKWW..', '..WWWWWWWWW..', '..WWPWWWPWW..', '...WWVVVWW...', '..WWWWWWWWW..', '.WWWWWWWWWWW.', 'WW.WW.W.WW.WW', 'G..G..G..G..G']],
  stellanera: [{ D: '#1B1F3B', V: '#B07CF0', W: '#FFFFFF', K: '#0B0E24', Y: '#FFE27A' }, ['......V......', '.....VDV.....', '.....VDV.....', 'VVVVVDDDVVVVV', '.VDDDDDDDDDV.', '..VDWDDDWDV..', '..VDDDYDDDV..', '..VDDDDDDDV..', '.VDDV...VDDV.', '.VDV.....VDV.', 'VV.........VV']],
  divoratore: [{ D: '#2A1A4A', V: '#B07CF0', W: '#FFFFFF', R: '#E2504A', K: '#0B0E24', Y: '#FFE27A' }, ['.Y...V.V...Y.', '..VVVVVVVVV..', '.VDDDDDDDDDV.', 'VDDRRDDDRRDDV', 'VDDRKDDDRKDDV', 'VDDDDDDDDDDDV', 'VDWDWDWDWDWDV', 'VDDDDDDDDDDDV', '.VDWDWDWDWDV.', '..VDDDDDDDV..', '.V.V.V.V.V.V.', 'V..V..V..V..V']],
  hero_arc: [{ R: '#7ED36F', S: '#C9D3E6', B: '#3F8F4A', K: '#1B1F3B', C: '#F2C14E', W: '#C9935A', G: '#F2C14E' }, ['....RRR.....', '...SSSSS....', '..SSSSSSS...', '..SKKKKKS...', '..SKCCCKS...', '..SSSSSSS...', '.BBBBGBBBB.W', 'BBBSBBBSBBWW', 'BB.BBBBB.BW.', 'SS.BBGBB.S..', '...BBBBB....', '...BB.BB....', '..KKK.KKK...']],
  hero_mag: [{ R: '#B07CF0', S: '#C9D3E6', B: '#6A3FB8', K: '#1B1F3B', C: '#F49AC1', W: '#7FE3FF', G: '#F2C14E' }, ['....RRR.....', '...SSSSS....', '..SSSSSSS...', '..SKKKKKS...', '..SKCCCKS...', '..SSSSSSS...', '.BBBBGBBBB.W', 'BBBSBBBSBBWW', 'BB.BBBBB.BW.', 'SS.BBGBB.S..', '...BBBBB....', '...BB.BB....', '..KKK.KKK...']],
  hero: [{ R: '#E2504A', S: '#C9D3E6', B: '#3E6FD8', K: '#1B1F3B', C: '#5BD8E6', W: '#F4F7FF', G: '#F2C14E' }, ['....RRR.....', '...SSSSS....', '..SSSSSSS...', '..SKKKKKS...', '..SKCCCKS...', '..SSSSSSS...', '.BBBBGBBBB.W', 'BBBSBBBSBBWW', 'BB.BBBBB.BW.', 'SS.BBGBB.S..', '...BBBBB....', '...BB.BB....', '..KKK.KKK...']],
  scrigno: [{ K: '#2A1A0E', L: '#C88A3C', G: '#F2C14E', B: '#8A5A2B', D: '#6A421E', Y: '#FFE27A' }, ['..KKKKKKKK..', '.KLLLLLLLLK.', 'KLLLLLLLLLLK', 'KGGGGGGGGGGK', 'KBBBBYYBBBBK', 'KBBBBYYBBBBK', 'KBBBBBBBBBBK', 'KBBBBBBBBBBK', 'KDDDDDDDDDDK', '.KKKKKKKKKK.']],
  scrigno_astri: [{ K: '#1B1240', L: '#8E64FF', G: '#7FE3F0', B: '#4B2FA8', D: '#33207A', Y: '#FFFFFF' }, ['..KKKKKKKK..', '.KLLLLLLLLK.', 'KLLLLLLLLLLK', 'KGGGGGGGGGGK', 'KBBBBYYBBBBK', 'KBBBBYYBBBBK', 'KBBBBBBBBBBK', 'KBBBBBBBBBBK', 'KDDDDDDDDDDK', '.KKKKKKKKKK.']],
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
Object.assign(SPR, {
  pet_micio: [{"D": "#24183F", "P": "#5B3F8C", "L": "#9C7BE6", "Y": "#FFE15A", "W": "#FFFFFF", "S": "#FFE15A"}, [".......D...D.......", "D......DD.DD......D", "DD....DPPPPPD....DD", "DPD...DPYPYPD...DPD", "DPPD..DPPPPPD..DPPD", "DPLPDDDPWPWPDDDPLPD", "DPLLPPPPPPPPPPPLLPD", ".DPLLPDPPPPPDPLLPD.", "..DPD.DDPPPDD.DPD..", "...D....D.D....D..."]],
  pet_gufo: [{"D": "#3B2470", "P": "#8E6BE0", "L": "#B79BF5", "W": "#F4E9FF", "Y": "#FFD34D", "K": "#1B1F3B", "O": "#F2994A", "S": "#FFE15A"}, ["..D.....S.D..", "..DD.....DD..", "..DPPPPPPPD..", ".DPWWPPPWWPD.", ".DWYKWPWYKWD.", ".DPWWPOPWWPD.", ".DPPPPOPPPPD.", "DPLPLPPPLPLPD", "DPPLPLPLPLPPD", ".DPPPPPPPPPD.", "..DPPPPPPPD..", "...O.....O..."]],
  pet_draghetto: [{"D": "#7A1F1C", "R": "#E2504A", "L": "#FF8A6E", "O": "#F2994A", "Y": "#FFE15A", "K": "#1B1F3B", "W": "#FFF3D6"}, ["..........DD...", ".O.......DRRD..", "OOO.....DRRRRD.", "OYOO....DRKRRRD", ".OOOD...DRRRWWD", "..ODRD.DRRRRDD.", "...DRRDRRRRD...", "..DRRRRRYYRD...", ".DRRLRRYYYRRD..", "DRD.DRRRRRRD...", "D...DRD..DRD...", "....DD...DD...."]],
  pet_volpe: [{"D": "#4A5488", "G": "#B8C0E8", "W": "#F2F4FF", "B": "#7FE3FF", "K": "#1B1F3B", "N": "#2A2F55", "M": "#FFE15A", "A": "#CFF6FF"}, ["............D.D..", "...........DGDGD.", "..BB.......DWWWWD", ".BBBB......DWKWWWN", "BBWWBBAAA..DWWWWWN", ".BWWWBAA..DWWWWD..", "..BWWWGGGGWWMWD...", "...DGGGGGGGGGD....", "...DGWGGGGGWD.....", "....DGD...DGD.....", "....DD.....DD....."]],
});
const sprCache = {};
function sprite(key, p, opts) {
  opts = opts || {};
  const ck = key + p;
  if (!sprCache[ck]) {
    const [pal, rows] = SPR[key] || SPR[F.SPECIES[key].base]; const parts = [];
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
  gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.6 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
  more: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  up: '<path d="M6 15l6-6 6 6"/>', down: '<path d="M6 9l6 6 6-6"/>',
  lock: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  unlock: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 7.5-2"/>',
  check: '<path d="M5 12l5 5 9-10"/>',
  map: '<path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2zM9 4v14M15 6v14"/>',
  gem: '<path d="M6 4h12l3 5-9 11L3 9z"/><path d="M3 9h18M9 4l3 16M15 4l-3 16"/>',
  rune: '<rect x="6" y="3" width="12" height="18" rx="3"/><path d="M10 8l4 4-4 4"/>',
};
const icon = (n, c, s, label) => n === 'rune' && typeof ipx === 'function' ? ipx('runa', s || 20, c) : svgIcon(n, c, s, label);
const svgIcon = (n, c, s, label) => `<svg width="${s || 20}" height="${s || 20}" viewBox="0 0 24 24" fill="none" stroke="${c || 'currentColor'}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" ${label ? `role="img" aria-label="${label}"` : 'aria-hidden="true"'}>${IC[n]}</svg>`;

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
const WEAP_IC = { Guerriero: 'spada', Arciere: 'arco', Mago: 'bastone', Curatore: 'bastone' };
const SEC_IC = { Guerriero: 'pugnale', Arciere: 'faretra', Mago: 'tomo', Curatore: 'tomo' };
function itemIconKey(kind, cls) { return kind === 'arma' ? WEAP_IC[cls] || 'spada' : kind === 'secondaria' ? SEC_IC[cls] || 'scudo' : kind; }
// Icone oggetto in pixel art 16x16 (colori realistici). Lettere -> colori della palette dell'oggetto.
const IPX = {
  spada: [{ a: '#E8EEF8', b: '#A9B4C8', c: '#6B7690', g: '#F2C14E', h: '#B07A2A', w: '#7A4A22' }, [
    '..............ab', '.............aba', '............abc.', '...........abc..', '..........abc...', '.........abc....', '........abc.....', '...g...abc......',
    '...gg.abc.......', '....ggbc........', '....hgg.........', '...wh.gg........', '..ww...g........', '.ww.............', 'ww..............', 'w...............']],
  mazza: [{ a: '#C9D3E6', b: '#8A94AC', c: '#555E78', w: '#8A5A2B', d: '#5E3A1A' }, [
    '..........aab...', '.........abbbc..', '........aabbbcc.', '........abbbbc..', '.........bbcc...', '..........cd....', '.........wd.....', '........wd......',
    '.......wd.......', '......wd........', '.....wd.........', '....wd..........', '...wd...........', '..wd............', '.dd.............', '................']],
  arco: [{ w: '#A86A32', d: '#6E4220', s: '#E8E2D0', g: '#F2C14E' }, [
    '.........ww.....', '..........wd....', '...........wd...', '...........sw...', '..........s.wd..', '.........s..wd..', '........s...gw..', '.......s....gw..',
    '......s.....gw..', '.....s......wd..', '....s.......wd..', '...s.......wd...', '..s........wd...', '..........wd....', '.........ww.....', '................']],
  bastone: [{ o: '#7FE3FF', p: '#B07CF0', q: '#E8FBFF', w: '#8A5A2B', d: '#5E3A1A', g: '#F2C14E' }, [
    '...........ppp..', '..........poqop.', '..........pqoop.', '..........poop..', '..........gpp...', '.........wg.....', '........wd......', '.......wd.......',
    '......wd........', '.....wd.........', '....wd..........', '...wd...........', '..wd............', '.wd.............', '.d..............', '................']],
  scudo: [{ a: '#4A78D8', b: '#2E4FA0', g: '#F2C14E', s: '#C9D3E6', k: '#1B2A55' }, [
    '................', '..gggggggggggg..', '..gaaaaaaaaaag..', '..gaaasssaaaag..', '..gaaasssaaaag..', '..gasssssssaag..', '..gasssssssaag..', '..gaaasssaaaag..',
    '..gaaasssaaaag..', '..gbaaaaaaaabg..', '...gbaaaaaabg...', '....gbaaaabg....', '.....gbaabg.....', '......gbbg......', '.......gg.......', '................']],
  pugnale: [{ a: '#E8EEF8', b: '#A9B4C8', g: '#F2C14E', w: '#4A2A6A', d: '#2E1A44' }, [
    '................', '................', '...........ab...', '..........abb...', '.........abb....', '........abb.....', '.......abb......', '.....g.ab.......',
    '.....ggb........', '......gg........', '.....w.gg.......', '....wd..........', '...wd...........', '...d............', '................', '................']],
  faretra: [{ l: '#8A5A2B', d: '#5E3A1A', f: '#E8E2D0', r: '#E2504A', s: '#C9D3E6', g: '#F2C14E' }, [
    '.....r..r.......', '....rr.rr.r.....', '.....s..s.rr....', '.....s..s..s....', '....llllllls....', '....lddddddl....', '....lgggggdl....', '....lddddddl....',
    '....ldddddl.....', '....ldddddl.....', '....lgggggl.....', '....ldddddl.....', '....ldddddl.....', '.....llllll.....', '................', '................']],
  tomo: [{ c: '#6A3FB8', d: '#432580', p: '#F4ECD8', g: '#F2C14E', o: '#7FE3FF' }, [
    '................', '...cccccccccc...', '..cddddddddddc..', '..cdgggggggdcp..', '..cdg..o..gdcp..', '..cdg.ooo.gdcp..', '..cdg..o..gdcp..', '..cdgggggggdcp..',
    '..cddddddddddcp.', '..cddddddddddcp.', '..cddddddddddcp.', '..cddddddddddcp.', '..cccccccccccp..', '...ppppppppppp..', '................', '................']],
  elmo: [{ a: '#C9D3E6', b: '#8A94AC', c: '#555E78', k: '#141830', r: '#E2504A' }, [
    '.......rr.......', '......rrrr......', '.....aaaaaa.....', '....aaaaaaab....', '...aaaaaaaabb...', '...aaaaaaabbb...', '...akkkkkkkbb...', '...ak.k..k.kb...',
    '...akkkkkkkbb...', '...aakk..kkbb...', '...aak....kbb...', '...aak....kbc...', '....ak....kc....', '................', '................', '................']],
  corazza: [{ a: '#C9D3E6', b: '#8A94AC', c: '#555E78', g: '#F2C14E' }, [
    '................', '...aa......aa...', '..aaab....baaa..', '..aaabbbbbbaab..', '..aaaagggabaab..', '...aaaagaabab...', '....aaagaabb....', '....aaagaabb....',
    '....aaaaaabb....', '....bbbbbbbb....', '....aaaaaabb....', '....aaaaaabc....', '....bbbbbbcc....', '................', '................', '................']],
  gambe: [{ a: '#C9D3E6', b: '#8A94AC', c: '#555E78', g: '#F2C14E' }, [
    '................', '....gggggggg....', '....aaaaaabb....', '....aaaaaabb....', '....aaab.aab....', '....aaab.aab....', '....aaab.aab....', '....bbbb.bbb....',
    '....aaab.aab....', '....aaab.aab....', '....aaab.aab....', '....aabb.abb....', '....abbb.abbc...', '...cccc..cccc...', '................', '................']],
  stivali: [{ l: '#8A5A2B', d: '#5E3A1A', s: '#3A2210', g: '#F2C14E' }, [
    '................', '................', '...lll....lll...', '...lld....lld...', '...lld....lld...', '...ggg....ggg...', '...lld....lld...', '...lld....lld...',
    '...lldd...lldd..', '...llldd..llldd.', '..lllldd.lllldd.', '..sssssss.sssss.', '................', '................', '................', '................']],
  guanti: [{ l: '#9A6A3A', d: '#6A4422', g: '#F2C14E', s: '#C9D3E6' }, [
    '................', '.....l.l.l......', '.....l.l.l.l....', '....lllllll.l...', '....lllllllll...', '....llllllldl...', '.l..lllllllll...', '.ll.llllllldl...',
    '..lllllllllll...', '...llllllllld...', '....lllllllld...', '....ggggggggg...', '....sssssssss...', '....ddddddddd...', '................', '................']],
  collana: [{ g: '#F2C14E', h: '#B88A20', r: '#E2504A', w: '#FFB3B0' }, [
    '................', '..g..........g..', '..g..........g..', '...g........g...', '...g........g...', '....g......g....', '.....g....g.....', '......gggg......',
    '.......gg.......', '......hrrh......', '.....hrwrrh.....', '.....hrrrrh.....', '......hrrh......', '.......hh.......', '................', '................']],
  orecchini: [{ g: '#F2C14E', h: '#B88A20', b: '#7FE3FF', w: '#E8FBFF', d: '#3E9FC0' }, [
    '................', '...g......g.....', '..g.g....g.g....', '...g......g.....', '...g......g.....', '...h......h.....', '..bbb....bbb....', '.bwbbd..bwbbd...',
    '.bbbbd..bbbbd...', '.bbbdd..bbbdd...', '..bdd....bdd....', '...d......d.....', '................', '................', '................', '................']],
  anello: [{ g: '#F2C14E', h: '#B88A20', d: '#8A6410', b: '#B07CF0', w: '#F0E0FF', p: '#7A4AC0' }, [
    '................', '......bbbb......', '.....bwbbbp.....', '.....bbbbpp.....', '......pppp......', '.....gghhgg.....', '....gg....hg....', '...gg......hg...',
    '...g........h...', '...g........d...', '...gg......dh...', '....gg....dh....', '.....ghhhdd.....', '................', '................', '................']],
  pietra: [{ a: '#5BD8E6', b: '#3FA0C8', c: '#1F5E7A', w: '#E8FBFF', k: '#1B1F3B', y: '#F2C14E' }, [
    '................', '......kkkk......', '....kkaaaakk....', '...kaawwaaabk...', '..kaawaaaaabbk..', '..kaaaayyaabbk..', '.kaaaayaayabbbk.', '.kaaaayaaaybbbk.', '.kbaaaayyyabbck.', '.kbbaaaaaaabcck.', '..kbbbaaabbcck..', '..kcbbbbbbccck..', '...kcccccccck...', '....kkkkkkkk....', '................', '................']],
  runa: [{ x: 'RUNE', l: 'RUNEL', d: 'RUNED', w: '#FFFFFF', k: '#1B1F3B' }, [
    '................', '.......kk.......', '......kxxk......', '.....kxwlxk.....', '....kxwllxxk....', '...kxwllxxxdk...', '...kxllxxxxdk...', '..kxlxxxxxxddk..',
    '..kxxxxxxxxddk..', '...kxxxxxxddk...', '...kxxxxxddk....', '....kxxxxddk....', '.....kxxddk.....', '......kxdk......', '.......kk.......', '................']],

};
const _ipxCache = {};
function shade(hex, f) { const n = parseInt(hex.slice(1, 7), 16); let r = n >> 16, g = n >> 8 & 255, b = n & 255; r = Math.min(255, Math.round(r * f)); g = Math.min(255, Math.round(g * f)); b = Math.min(255, Math.round(b * f)); return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1); }
function ipxURL(kind, runeColor) {
  const key = kind + (runeColor || ''); if (_ipxCache[key]) return _ipxCache[key];
  const [pal0, rows] = IPX[kind]; const pal = Object.assign({}, pal0);
  if (runeColor) { pal.x = runeColor; pal.l = shade(runeColor, 1.45); pal.d = shade(runeColor, 0.6); }
  const c = document.createElement('canvas'); c.width = 16; c.height = 16; const g = c.getContext('2d');
  rows.forEach((r, y) => { for (let x = 0; x < r.length; x++) { const col = pal[r[x]]; if (r[x] !== '.' && col) { g.fillStyle = col; g.fillRect(x, y, 1, 1); } } });
  return (_ipxCache[key] = c.toDataURL());
}
function ipx(kind, size, runeColor) { return `<img class="ipx" src="${ipxURL(kind, runeColor)}" width="${size}" height="${size}" alt="">`; }

// Immagine dell'oggetto in pixel art; la rarità resta nel bordo e nell'alone della tessera
const itemIcon = (kind, cls, color, size) => ipx(itemIconKey(kind, cls), size || 22);

// ---------- stato ----------
let S;
function load() {
  try { const raw = localStorage.getItem(KEY); if (raw) { S = F.migrate(JSON.parse(raw)); return true; } } catch (e) { /* storage non disponibile */ }
  S = F.newState(); return false;
}
function save() { S.lastSeen = Date.now(); try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* ignora */ } }

let B; // battaglia corrente (non salvata)
let confirmRune = null, tab = 'squadra', bagView = 'zaino', dirty = true, selItem = null, selSlot = null, equipOpen = null, eqSel = null, openMember = null, confirmReset = 0, confirmTree = 0;

// ---------- scena ----------
const scene = () => $('#scene');
let pEls = [], eEls = [];
function orderFront(list) {
  const rank = { Guerriero: 1, Arciere: 2, Mago: 3, Curatore: 4 };
  const hero = x => x.u.id === 'hero' ? 0 : 1; // il protagonista sta sempre in prima fila, così si vede sempre
  return list.map((u, i) => ({ u, i })).sort((a, b) => hero(a) - hero(b) || rank[a.u.cls] - rank[b.u.cls] || a.i - b.i);
}
const ARC_FRONT = h => `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABECAYAAAAiL3M8AAAUJklEQVR4Xs1cCXhU5bl+Z00y2RdCSAghJIQEwiKIkFoB9aoIantVBLnFBai41F43nlJKK9qr1quXulu1V0RQEdzAi1VoQUEqiBLBIJE9QCD7MpNkktnOfd7v8E9mspAwJrHv85xnzvKf//zfe77tX84AfYQIa6LG7Yc+rqfq6S6M3S3YE8jIHCgChloX7x2amwOv1hxqFf/aoICjRhWEpEkmg03LHTZasxpjQyY4FPSpBrncTrhamkJpp8AaZoPJbA75/lDQZwRRA4bmDBUhPZ7QSaKJ9aUW9QlBipzc3PGoraqCV/Oe88s0GSxwOOowJHMEcvOH/yBfdi7oE321WiKQ2G8g9uzdjtLTJfBpLkNgIxOt/f1+xe1p8V+y++r85Vy+ekNZqVkLs+4Sog8WHzgXOUNGUEN7A1ZLpJabN0qqPlh0AE5ftf+ZEcZEzQoLFiRcjmxvDOp9BgyxmPzNuLt2NVpMGqpd5a33WBO1sRdMhMNeIyQ5Xa319QZ61cQozJAh2WIWNA9bbJjIQGJijHHaqoQ5uC5yopBz2uRGk8UVJOOz8bOwNupGpJpSNKVlFlhwqvSI1PlD04buoFcJIlpcLlRWn5Z9W0QkYixx2t0J07E84RZ/+w6Z7MhHhGxEvA+4ruopA3+JVbGzMC/mCsRYU7TEtHh4Wjz+OklYb6LXCSL4xv/959fIfuqQDPylZj02tBzzyzUBCe1k3Jxwj/il8yOt+MbWhJdqNkKRM2PmtVIn4fa4e5OfvnHSxNq338O48ZPFURPTwwaLpgRCHZMUhdUNTbjIEC2HYVYrRo+6UOoyh5lFO0WCYMvsUfSIBjGM0xmfrZ9EgUgOzePFkb/EZRHWICICj79q1CV2TI7H9OlpOG70ItKgmyvrYF0KXo/Hv8/nM0fixjb1BFM/mCA25J1ps3B05hI8et5FsATkOIwwZaUV/naSnObTFZgyUjcpRYQyNxIyen4iDmke0Zzoz2plmzI3URx2dclpqUOBdTP8tz4AeHz8xTg6exHYpp5IKEMO8/3N+VqV9wh+3u8ePHN5NNYc3IkHd30alLsoqA6qxeMV50xtIf7LWYaCCWYc3aNrxHxDnP8eXpvh64dhka1hn+eeqlkHDS4YTEa43I3t2s/ouDT1BkweMQiPFjbh7zVvoN5TErKcIWkQBc6Muhh/+MnHSEwei19vdGDxrm0dkiPwAItirsf1kVMwyKcLvMnpQlWLHYP6J2Dy5TEoqq+Qc8T3jXqmXai1yL46Zjow3fZTLEm4CZq3jQM7AyaXvzv1rpDDtt03YSVizRkaI2AoJndOmbR6yP3j1/iflRabDGAsUNW9x1MjaFob3Mdw14xsDE6KlRu5//zaQ6j2DsR5hjCJbBs8x9AQm4wxTTZscp5b92RI0hhESdsgJBHLds4Rks5Fo7qtQbTnWTnP+cmpqG2Qh/JXJ6l7IDlfe3VhScjCF7/Gsap6IYok7fCcxIvuw6j26r5mW10pVrn1lCDR1L33aTVGISo+JaiNiqiZuf9zTr6pS4IsxgiJCv+Z+4oQQUIOnzwMR2O5PFT9dgY68c9vuRXPVa/2F9nvOyFkqI1EESTpiTvG4epJCULURPNAXJ81HElhMeLIFWnLatZhxy13ddlhLbUflnr5W1iyx/8yf1fwoT/idfVaz/pK2CWYM/wlqYPqSmIanQcRbUpC5pDz5dju1TXJYrbgjAvpEMULHxBtIQ55TqHg1fVwwQcrjPhi7n1B90wakSnHN3/0Kuy1TVJmYsT5yAjrj3iPBUceuEu0jhHTeRYJTa7TKCwBzssYjb0HP0ZZ1Wk4Gocia2AW5uTocq08sEA7W3+uUw2iI56R/qRojcVnw9EjXyHBdxTXDmjNXElWV9DgwdZ9h/D6Zzo5tUZgV/NeeAxmrFv7Nub+NBcFry5rV83MDa9h9oWDpQyJPOQ6jgFevVuxdd9RHC+vgdvQGuGC4GsdESBJCmw7ZSBZlImykSg68c7k6JSgGN8AYZomVVb1OTLd32N8ghP9osKlLp5fMNSEGFOUHLvRccrPoQ1GuMFJeu7DbPnGqKlIG5CBq352FR5/Yiw2PDykXft4jtcuzB+E9NShmGqb6C/DyDd/04ZOe/LhxqQgUhpqy+SYbacMo3zVIpPyn+HQM/WO0CFBjFZ3TnjBTw6Zv2pcOnJT9IjTL34gGmuLZZ9axActGv++P8q1hRce/HbjNv9pp7kGH0z9mRx/uWkHLlm0B66o1u4FwXPr/1qI+KxR+PL2+XIu26B7hHvf2gp3Jykc3YJquyKlsvakRDWCMlAWyqRkYPnOJhPaEUR1W5D9jC58bbFUpIghXjqoRyCHtzWuK0fdmRZFIAI3xl6CWs2NaOhmQYf8ze0PYmzDzahbsgzWhuAOFc9NS5wlZXiNpLKPxjqutk7o5H0DL47+rd6+xnIs8rRgrC0dcea6oLYroi5LPi2ug/hV9osdvuAONYghsrS+AlNSfH5yUvqZZCP4RmheiVH6+E50ZH+xa2pRR/YcYdKHMQjmQRGeBH9oDwQdL/1LIEgkz/OeQNi01joDcd2l6bjLVoyf2r9G7twLEDY6FktyB/qLJCZF+eXgi6eMJIkyG3y6PIEIIohqppIqV/VxpNrqpawixn2mUUp71Pnk+Cikh5klqqnMVT2E5vpw1HTY3FbEG3Qne4clS0I7BVegEycZjGDKoRMs8+T7X+KpuBw5Zh0cdWSdgdkxX0zVZS9rkZeOF1LmPTYP3Ldl6/fxpQaCbSdZSka6Cba9rakFa9CZfiAZnT2kFiMybUHkPF+YKs8I1B6CTnDaIA1ZjTvkXkUS/cEY0yDJjBWYKFKLGOopuCLppsnjhBhu3A8kp7RZnyhUXQ52V5g0JmOYJH18zm05TyBp020GraTeTwr3DRm636Q8TE/WH8rwv2iLwYmcwYlyTfkjq08POgp+gsjcooL3xbQYsZT5BIJvYdTQqXJKaY8CyxcMSxZ7p7kxYx0SdgkmRub6O5x5xnTc6djgv+cjRwmuXrHKb1YkRpFDU+O1zY4aJJr6yT1zHOuljk+9LiHp2pgMDA27HMzVdlcU4+X4X2m17+6Ssk2HDoD7Ncv+jpb+1dI+5m67jwebMEmSa+7vRXa+3MBRAH+iqIYuqyt2Y8G49HYEKMR7qpGTnQh0kqJRk4pKqrC9YjeqPV9hhu/aIJIVlkb8BLd5C5ERcylu+dsL0D6yA+YzkczLtMGE0TGzUdW0F4utuXJbrdaqidTC7IYYVLl3o/LYcszNGo7clBSUoAJ4dxfirxuPlj27hByC5hRfV41genTwZTOyPVq4G2mxUxFujoDLpZt/UCZNBulL2mpHIGJch2ExtOY8NLc3j5wE0iEmWVbpRX5GfxTt/RYFYcNFEI7txBohY88eQyquqvoU/5c0BdCTcAwMuwjzR7n9uRKxZLMDkeZ+0gdmHWPLdyLJkodKSz36uWOl5z8ryoY/NDRKdyQw0j5eGocbFq9C6rTWfIiawrajk9SPMlN2uotAZy0mRmfHHjq1hxrQEaqrGiT/GZncfuEAnfbqE7ozFOcXFYZ3nYX+N8/pHM5arKjbjSTbKFQjw/+I6PB4pESOxPOFtThWVSPnF246LOd4TSHMlIzosBS8Xr9NSCoJ12dnjb7W5FW92IP2cuzLGNBODLadMlCWjkDZj1R9ExRohKBAxui02oLR69m9NjlNVW0LMh8YJdhQl6/BP7QROJ2TEpWDccnTRCNoXmkxWUIECZj7VBQmzYzTyQiPR3LcACnDskMTJ8m9mhYpA/hlzc3itItTb8J//PMZPzlTNz6BsoaOJxVV25UsbdGR7EFRbPF5NlHFjhCYGAaCZtVW6/LefByc2iHU0Mayuo9RkLJAzrGDS03KTT5fjknSlMxbccWV8Zi04ISQQXKIrJThUtbRXCvdGlUHsc3mkF+LMUJe4vi3nsbehxbjuGMtUoa55ZibgpKtM1l4nS4jEEIQ+yKqv0JQQLW1hXoIHzxqzVNSTjG/72gTst94CDZTPJZEpPhvZQ5EKKG3lD2JUQMnt6t7XOqVfsLYmeRGsGxR3RohlnXQZ+1o1Ls6hM00DBPXPI2F50+UrNvtc2Lu2qfx/NRp+PDmX2DMG39q9yyV07H9mW/+SWRRIBeqf2ZU/S63o0hUMG/N0zJsqTYeK6RH64le9ponccpbZuCUMMvlrf0jip1HcdOXq+DUmg1NZ7RQd85akIkpkpod+tsn3MYmPPq/b8pvZ2hGa3lq2J6W41L0grL35TfH3A+zphdIHkUtIlkTJwzD1OWvoFKrN5AEkqJkOHCsWohh+znwT1n40uk/yQX7Z+QmyMTGrX0MdldZ0AA3j3m+2KEPbVBD2o6f8Pi7prWoN9iD5FvW8Ikcr7QXIy9KnzisqNOHH6gNihBqyuJ5s/0a0xbqnsD7XXDjobJPEBc5FQ5fNf584yScOlYpkZC/Ci0GXRySkPPWg7K/p267vMygGRFOcHrLDBdvec5/b7PmgFnNTC4/vQL1ntZFAoEgu2bzfu2Rr38vGtLRW25L7IcJGurKPJLxUoD8qBwcLvtOnO9AywViZnkN14jjbQs1EkjQ4e5vWO/fZ3meY46kzPRo8RYZH2I3RY1xp04vwLClj7VbIfL7r+/RGEACF1EEgnIsP71Cu2/Qv8nEgJmZ0LKdc7ocyA5U8a7Ah8zf/6rmdFcbfmFfqcVAd7iNnko0NlTiSMtmycCONmzxV/XJ32rFSSuoSMQy9AfTI7LxbsN6RJrnSRESpXxUtFGPvHp/LgGzN62TY2fA8hkFzdgCi/Hso58c1FcD/JIo8qau0J0ynSE/7gbxPYxEJfZ/YHxYFva4yyXxYzJIXHElZN/Rog9uqfMsU+XeL+PSrsYGlDV+KzkS63ND91n5yddjyeatOOHdgWaPs53phAKR1weYu7s6oq0JdQXlpzg1zFCtUOk7hkofxMwoKEM9x26eXX0Ad88aKwQw7CPmzB0VQIu9Auvrv8Ajqddh0am39QtlEHM9WL0VR7ybdY3pxlqh7spBos1mGwzsmLV1Vj0FzmjMG/G6mAJJKG08gV32FyQxvTjlAZ2IM1AOe/vhtyUnUuB9dOj0WU5fnWgHZ1rUMj6TwcSwHvLM6dkgUay3yCG4rlCBQvKNk5wIgxFFFe+0C+vripeKOQWG+/DoaCmryGF9JIRj3dx6ixyC2tYrzBNGg1UbYimQroLqU1ELSM4dsZejpKUcW1tqcUX2b4QQknNz3Fi59z17ifgV+pnA83+xb+y2ifQUeo0gmtfJhx7EuIf+jEHRM8T5cvjj+Vh9sL4ITpnG+e/Gb+V4TkwuLvJFyGIp9rPYsSVIWkp4uEw/89ojFeuC1iz2NnqFIPq1kqWLsWPn95LNMh+JMoTLEhZFDpfbcQqI82Q7UYOpvtYxZ0XS6LT+CC91y3UuXOCsBsvfal/dZ5rU5dRzKFCr4Tl8waz29oRr8ET+nKAVZRwRPJ2u+6hIRMhsh5rxoLYQJIfgQgaOJZEcYnnMrKClw72JXiGIoPa8v1cfd15Vu1GEpYA0LZoSMeCEW47V4s2OQC3jRg2iJhE8fibvpk7n4XoSvUKQWhZ37yX5+KDuS1RpThGOm5o+JpRGtF2rqKAWKxBq0pB1bDM6cce3r/SJmfWKDyIiDOGaBUbYtSZ5Bld+8ff+hJmiQTQnrj2kBk1rM5NAOOAVIniN+wQH/E959Y5o4Cr83kT3FtyEAHZqA4felED/aCzUohPHIKNZ9zOKDBKmiAj0RySRmrQFe1FpsPcZMQohaRC/+WIFe/d+cc73y4ct5rQgyl+I1kcfCeWoSdZS5z/lXIWnFpVRjXA01He4LrE3EZIGFRd9hyRDx1O/XYHLYShsIFQ0I1oXqxix73jrbGhMXCxq67q5zq8HERJBJIdh+4/ffeCfAil2H+y2NlHYQPxy/0toduuzJexbSScRbgzK1BdS/ZjotlAKnOZdV3AnKhuaZb2NmoHdWveVrHTtbCDqvnt/o51+7Qu8U78Leflj/F8eymp5ACXHDvs/k2KimZaRKivrCX6ER+wv+qbXOqadIaQwrwbpi0rKUVxWj+qGFowwj+z0IVyF/9Fz7+GqQRNggBXRMQkitBK8vLQ06BsydqBJGMlTZQiuje5rhGRi24tKcWF+Gh5ef1D6TUwEiY60h055onkEFuRMxsKilZJlF+8rRFq6Pnkoq+/PmFdb8JrL2iQklZ4okcvsBLf9IK83cc4EWeBFeXU93vusHutavoC7sQVc2d4/MRYcZuUn216PJs6YuD/xeulT3frdCzCbTEhJS5NPCCiws7HjGU6F8spTQOv4O9IGDkLpyeNwuXvx65U2OGcfRPQz6J9mczqFv/zgjb903IEgkS+Xb8EpT6kkjDQ1Chkd3frJAT+004UO/qyAmpIxOMvvhxSOHDnUp6H+nDUokBiFWb++WXYXPrNCFltyuZxC4oQcFH/ePsKpz8OpTdOm3YgP1v01iNx77rkXK15bKRGPzppm9kM+Kf+XACNVYEPaHsv3q8NGy58LZGbmydbFPzH4y/Ee+WMBS2SXi797EiGZWKig2eTk5Ik20LQIalBng+0kIzoqVrSIZkkN6msT6/u4yVnOgH9fONv/cIyfMAVNjfqUFO/R/5Sg4/XYvYUfhSBCJYFnw/bPNxiYUf+Y6DOCaC7KvKgJTALtdfWSEpwNHs0bRGb+yHFiqn1FWp8RZDKEy78vEPQ/JId5kNHQtayVFZX+Lgmz8L4kqU8IUv+WoKDISUzqj6yh7RcvBIJ/TEAieY8CSeorhJQHhQL+lQQdbaOjSYYtfJoLTafsXUbR4u/3GGhSzXXN8scECmazpU8y6i4b2BOQ3MVrlo9xiVBnQ5XvITkS2Tr4qLen8f+7QYzpbM8VQgAAAABJRU5ErkJggg==" alt="" style="height:${h}px;image-rendering:pixelated">`;
const MAG_SIDE = h => `<img src="data:image/png;base64,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" alt="" style="height:${h}px;image-rendering:pixelated">`; // Negromante di fronte
const PET_ANIM = { micio: 1, volpe: 1 }; // pet con animazione di volo
const petHTML = (k, p) => PET_ANIM[k] ? `<div class="pa pa-${k}" style="--z:${p * 22}px" aria-hidden="true"></div>` : sprite('pet_' + k, p);
let partyOrder = [], lastFrame = 0;
// la prima linea sta oltre metà scena: la squadra ha più spazio (come negli altri idle), i nemici arrivano da destra
const UNIT_SCALE = 1.5, PU = 19; // personaggi ingranditi ×1,5 (scena grande); PU = pixel per passo di distanza in battaglia
let FRONT = 211; // il primo alleato sta poco a destra del centro; la squadra si allunga verso sinistra, sempre un po' sovrapposta
const partyStep = n => Math.min(18, 195 / Math.max(1, n - 1));
const partyFront = () => 211;
const deadSeen = new Set(); // membri che hanno già fatto l'animazione di morte
function buildScene() { setScroll();
  const sc = $('#units'); sc.innerHTML = '';
  pEls = []; eEls = [];
  const isRanged = c => c === 'Arciere' || c === 'Mago' || c === 'Curatore';
  // squadra: mischia davanti, a distanza dietro con uno stacco
  // ognuno si mette alla distanza della sua gittata: prima i Guerrieri, poi Arcieri, Maghi e Curatori
  const order = orderFront(B.party); FRONT = partyFront(order.length);
  const place = (list) => list.forEach(({ u }, k) => {
    const step = partyStep(list.length); // lo spazio si divide tra tutti, così nessuno esce dallo schermo
    const x = FRONT - k * step - (F.CLASSES[u.cls].range - 1) * 4, y = 26; // tutti sul pavimento
    const el = document.createElement('div'); el.className = 'u pm'; el.dataset.x = x; el.style.left = x + 'px'; el.style.bottom = y + 'px'; el.style.zIndex = 20 - (k % 2) * 5;
    el.innerHTML = `<div class="hpb"><b style="background:${F.isHero(u.id) ? HERO_HP : '#7ED36F'}"></b></div>${u.species === 'hero' ? '<div class="kn" aria-hidden="true"></div>' : u.species === 'hero_mag' ? '<div class="mg" aria-hidden="true"></div>' : u.species === 'hero_arc' ? '<div class="ar" aria-hidden="true"></div>' : sprite(u.species, 2)}`;
    sc.appendChild(el); pEls[u.idx] = el;
  });
  place(order); partyOrder = order;
  // chi era caduto: se è tornato in vita rientra correndo da dietro, se è ancora a terra resta nascosto
  B.party.forEach(u => { const el = pEls[u.idx]; if (!el || !deadSeen.has(u.id)) return; if (u.hp > 0) { deadSeen.delete(u.id); el.classList.add('revive'); setTimeout(() => el.classList.remove('revive'), 1300); } else { el._gone = 1; el.classList.add('dead', 'gone'); } });
  // pet: volano sopra l'eroe, così restano sempre in vista
  const hu = B.party.find(u => u.id === 'hero'), heroEl = hu && pEls[hu.idx], hx = heroEl ? +heroEl.dataset.x : FRONT;
  Object.keys(S.pets || {}).filter(k => F.PETS[k]).forEach((k, i) => { const el = document.createElement('div'); el.className = 'u pet'; el.style.left = (hx - 24 - i * 36) + 'px'; el.style.bottom = (110 + (i % 2) * 14) + 'px'; el.innerHTML = petHTML(k, 2); sc.appendChild(el); });
  // nemici: quelli da mischia si ammassano sul primo bersaglio, quelli a distanza restano indietro
  let mk = 0, rk = 0;
  B.enemies.forEach(u => {
    const bp = u.secret ? 4 : u.boss ? 3 : 2, r = isRanged(u.cls);
    const x = 0, y = 26; mk++; // i nemici si sovrappongono: ognuno sta esattamente alla sua gittata
    const el = document.createElement('div'); el.className = 'u' + (u.secret ? ' secret' : '') + (F.SPECIES[u.species].portal ? ' astral' : '') + (ANIM[(F.SPECIES[u.species].base || u.species)] ? ' anim' : ''); el.dataset.x = x; el.style.left = '420px'; el.style.bottom = y + 'px'; el.style.zIndex = 15 - (mk % 3);
    el.innerHTML = `<div class="hpb"><b style="background:#FF5A6E"></b></div><div class="mk">${icon('dust', '#7ED36F', 10)}</div>${animHTML(u) || sprite(u.species, bp, { flip: true })}`;
    sc.appendChild(el); eEls[u.idx] = el;
  });
  buildLog();
  logAt = -1e9;
  updateScene();
}
// Vita della squadra, stilizzata: barra sottile + danno medio al secondo (media mobile, non si azzera tra le battaglie)
const HERO_HP = '#5BD8E6'; // vita degli eroi, che non occupano posti in squadra
let logRows = [];
const dps = {}, lastDealt = {}, acc = {};
let dpsAt = 0;
function buildLog() {
  const box = $('#log'); logRows = [];
  box.innerHTML = `<div class="lhead"><span id="alive"></span><span>vita · danno/s</span></div><div class="pgrid">${B.party.map(u => `<div class="pc"><div class="pt"><i style="background:${F.CLASSES[u.cls].color}"></i><span class="pn">${esc(S.roster[u.id].name)}</span><b class="ph2"></b><b class="pd"></b></div><div class="hbar"><b></b></div></div>`).join('')}</div>`;
  const cells = box.querySelectorAll('.pc');
  B.party.forEach((u, i) => { logRows.push([u, cells[i]]); lastDealt[u.idx] = 0; });
}
let logAt = 0;
function updateLog() {
  const now = performance.now();
  for (const [u] of logRows) { const d = u.dealt - (lastDealt[u.idx] || 0); if (d > 0) acc[u.id] = (acc[u.id] || 0) + d; lastDealt[u.idx] = u.dealt; }
  if (now - dpsAt >= 1000) {
    const sec = (now - dpsAt) / 1000; dpsAt = now;
    for (const [u] of logRows) { const v = (acc[u.id] || 0) / Math.min(sec, 2) / (S.settings.tFast ? 10 : 1); dps[u.id] = dps[u.id] === undefined ? v : dps[u.id] * 0.85 + v * 0.15; acc[u.id] = 0; }
  }
  if (now - logAt < 250) return; logAt = now;
  let alive = 0; const top = Math.max(1, ...logRows.map(([u]) => dps[u.id] || 0));
  for (const [u, c] of logRows) {
    const pct = Math.max(0, u.hp / u.maxHp); if (u.hp > 0) alive++;
    const b = c.lastChild.firstChild; b.style.width = (100 * pct) + '%';
    b.style.background = pct > 0.6 ? (F.isHero(u.id) ? HERO_HP : '#7ED36F') : pct > 0.3 ? '#F2C14E' : '#FF5A6E'; // gli eroi (fuori dal conteggio dei posti) in azzurro
    c.querySelector('.ph2').textContent = u.hp > 0 ? cfmt(Math.ceil(u.hp)) : 'KO'; c.querySelector('.ph2').style.color = b.style.background;
    c.querySelector('.pd').textContent = u.hp > 0 ? cfmt(dps[u.id] || 0) : '';
    c.classList.toggle('ko', u.hp <= 0);
    c.classList.toggle('mvp', u.hp > 0 && (dps[u.id] || 0) >= top && top > 1);
  }
  const a = $('#alive'); if (a) a.textContent = `Squadra ${alive}/${logRows.length}`;
}
let marching = null;
function updateScene() {
  const en = B.enemies.filter(u => u.hp > 0);
  // telecamera: quando la prima linea avanza, avanza tutta la squadra e la scena la segue (la squadra resta ferma sullo schermo)
  const adv = u => (u.pos === undefined || F.CLASSES[u.cls].range !== 1 || u.hp <= 0) ? 0 : u.pos + 1;
  const cam = B.party.reduce((x, u) => Math.max(x, adv(u)), 0), moving = cam > (B._cam || 0) + 1e-6; B._cam = cam;
  const m = B.over === 'win' || moving || (en.length > 0 && en.every(u => u.arrive > 0));
  if (m !== marching) { marching = m; scene().classList.toggle('march', m); }
  { const left = en.length, fc = $('#foes'); const ft = (S.portalRun ? 'Portale · ondata ' + S.portalRun.wave + '/' + F.PORTAL_WAVES + ' · ' : '') + 'Nemici rimasti ' + left; if (fc && fc.dataset.n !== ft) { fc.dataset.n = ft; fc.textContent = ft; } }
  B.party.forEach(u => { const el = pEls[u.idx]; if (!el) return; el.firstChild.firstChild.style.width = (100 * u.hp / u.maxHp) + '%'; el.classList.toggle('dead', u.hp <= 0);
    if (u.hp <= 0 && !el._gone) { el._gone = 1; const again = deadSeen.has(u.id); deadSeen.add(u.id); if (again) el.classList.add('gone'); else setTimeout(() => el.classList.add('gone'), 2500); } });
  // chi cade resta dove è caduto (scorre via col terreno); gli altri avanzano a prendere il suo posto
  { const now = performance.now(), dt = lastFrame ? Math.min(0.1, (now - lastFrame) / 1000) : 0; lastFrame = now;
    const n = partyOrder.length, step = partyStep(n); let k = 0;
    partyOrder.forEach(({ u }) => { const el = pEls[u.idx]; if (!el) return;
      if (u.hp > 0) { const bx = FRONT - k * step - (F.CLASSES[u.cls].range - 1) * 4; k++; el._wx = undefined; el.style.left = (bx + (F.CLASSES[u.cls].range === 1 ? (adv(u) - cam) * PU : 0)) + 'px'; return; }
      if (el._wx === undefined) { el._wx = parseFloat(el.style.left) || +el.dataset.x; el._cam0 = cam; el.classList.remove('pm'); }
      if (marching) el._wx -= dt * 75 * F.moveSpeed(S);
      el.style.left = (el._wx - (cam - el._cam0) * PU) + 'px'; }); }
  { const bb = $('#bossbar'), fb = B.enemies.find(u => u.boss && (F.SPECIES[u.species].base || u.species) === 'divoratore'); // barra grande solo per il boss finale
    if (bb) { const on = !!fb && fb.hp > 0 && !(fb.arrive > 0); bb.hidden = !on; if (on) { bb.firstChild.style.width = (148 * fb.hp / fb.maxHp) + 'px'; const nm = F.SPECIES[fb.species].name; if (bb.lastChild.textContent !== nm) bb.lastChild.textContent = nm; } } }
  // i nemici si posizionano rispetto all'alleato che stanno colpendo davvero (se cade il guerriero e resta un arciere, si fermano davanti all'arciere, non sopra)
  const prr = u => u.id === 'hero' ? -1 : u.idx; let ft = null; for (const u of B.party) if (u.hp > 0 && (!ft || F.rangeOf(u) < F.rangeOf(ft) || (F.rangeOf(u) === F.rangeOf(ft) && prr(u) < prr(ft)))) ft = u;
  const ftEl = ft && pEls[ft.idx], ftX = ftEl ? parseFloat(ftEl.style.left) : NaN;
  B.enemies.forEach(u => { const el = eEls[u.idx]; if (!el) return; const tx = +el.dataset.x; el.style.left = (isNaN(ftX) ? FRONT + 35 + (u.pos - 1) * PU - B._cam * PU : ftX + 20 + (u.pos - ft.pos - 1) * PU) + tx + 'px'; el.classList.toggle('walk', u.arrive > 0); el.firstChild.firstChild.style.width = (100 * u.hp / u.maxHp) + '%'; el.classList.toggle('dead', u.hp <= 0); el.classList.toggle('marked', u.mark > 0); });
  updateLog();
}
// frecce degli arcieri che restano conficcate nel nemico (al massimo 5, spariscono con lui)
function stickArrow(el) {
  if (!el) return;
  setTimeout(() => {
    if (!el.isConnected || el.classList.contains('dead')) return;
    let box = el.querySelector('.arws'); if (!box) { box = document.createElement('div'); box.className = 'arws'; el.appendChild(box); }
    while (box.children.length >= 5) box.firstChild.remove();
    const a = document.createElement('i'); a.style.bottom = (22 + Math.random() * 50) + '%'; a.style.marginLeft = (Math.random() * 6 | 0) + 'px'; a.style.transform = `rotate(${(Math.random() * 16 - 8).toFixed(0)}deg)`; box.appendChild(a);
  }, 250);
}
// la Succube lancia un cuore e il Negromante un teschio fantasma: volano dritti dalla mano al nemico lasciando una scia, poi scoppiano
const PROJ = { heart: { p: 'heartp', w: 20, h: 18, tr: 'htrail', m: 'hmini', hit: 'hhit', d: 120 }, skull: { p: 'skullp', w: 18, h: 18, tr: 'strail', m: 'smini', hit: 'shit', d: 170 } };
function flyHeart(fromEl, toEl, kind) {
  if (!fromEl || !toEl) return;
  const P = PROJ[kind || 'heart'];
  setTimeout(() => {
    if (!toEl.isConnected || toEl.classList.contains('dead') || !fromEl.isConnected) return;
    const fx = $('#fx'), sc = scene().getBoundingClientRect(), a = fromEl.getBoundingClientRect(), b = toEl.getBoundingClientRect();
    const x0 = a.left - sc.left + a.width * 0.72, y0 = a.top - sc.top + a.height * 0.42, x1 = b.left - sc.left + b.width / 2, y1 = b.top - sc.top + b.height * 0.5;
    const h = document.createElement('div'); h.className = P.p; h.style.left = (x0 - P.w / 2) + 'px'; h.style.top = (y0 - P.h / 2) + 'px'; fx.appendChild(h);
    const T = 260, pt = t => [(x1 - x0) * t, (y1 - y0) * t]; // dritto verso il nemico
    const kf = []; for (let i = 0; i <= 10; i++) { const [x, y] = pt(i / 10); kf.push({ transform: `translate(${x.toFixed(1)}px,${y.toFixed(1)}px) scale(${1 + 0.12 * Math.sin(i * 1.2)})` }); }
    h.animate(kf, { duration: T, easing: 'linear', fill: 'forwards' });
    for (let i = 1; i <= 5; i++) setTimeout(() => { const [x, y] = pt(i / 6); const t = document.createElement('i'); t.className = P.tr; t.style.left = (x0 + x) + 'px'; t.style.top = (y0 + y) + 'px'; fx.appendChild(t); setTimeout(() => t.remove(), 360); }, i * T / 6);
    setTimeout(() => { h.remove(); if (!toEl.isConnected) return;
      for (let i = 0; i < 6; i++) { const m = document.createElement('i'); m.className = P.m; m.style.left = x1 + 'px'; m.style.top = y1 + 'px'; const ang = i / 6 * Math.PI * 2, r = 16 + Math.random() * 8; m.style.setProperty('--dx', (Math.cos(ang) * r).toFixed(0) + 'px'); m.style.setProperty('--dy', (Math.sin(ang) * r - 6).toFixed(0) + 'px'); fx.appendChild(m); setTimeout(() => m.remove(), 450); }
      toEl.classList.remove(P.hit); void toEl.offsetWidth; toEl.classList.add(P.hit);
    }, T);
  }, P.d);
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
const ANIM = { divoratore: 'an-rp' }; // creature con animazione completa
function animHTML(u) { const k = ANIM[F.SPECIES[u.species].base || u.species]; return k ? `<div class="an ${k}" aria-hidden="true"></div>` : ''; }
function knAnim(el, k, ms) { const kn = el && el.querySelector('.kn, .an, .mg, .ar'); if (!kn) return;
  if (kn.classList.contains('mg')) { if (k === 'dg') return; k = 'atk'; ms = 600; }
  else if (kn.classList.contains('kn') || kn.classList.contains('ar')) { if (k === 'dg') return; k = 'atk'; ms = 500; } kn.classList.remove('atk', 'atk2', 'sk', 'dg'); void kn.offsetWidth; kn.classList.add(k); clearTimeout(kn._t); kn._t = setTimeout(() => kn.classList.remove(k), ms); }
function lunge(el, dir) { if (!el) return; el.style.setProperty('--dx', dir + 'px'); el.classList.remove('lg'); void el.offsetWidth; el.classList.add('lg'); }
function banner(text) { const b = $('#banner'); b.textContent = text; b.classList.remove('show'); void b.offsetWidth; b.classList.add('show'); }

function setScroll() { const g = document.querySelector('.ground'); if (g) g.style.animationDuration = (1.4 / F.moveSpeed(S)) + 's'; scene().style.setProperty('--ms', F.moveSpeed(S)); }
// ---------- notifiche ----------
function toast(html, color) {
  const box = $('#toasts'); while (box.children.length >= 3) box.firstChild.remove();
  const t = document.createElement('div'); t.className = 'toast'; if (color) t.style.borderLeftColor = color; t.innerHTML = html; box.appendChild(t);
  setTimeout(() => t.remove(), 2600);
}

// ---------- eventi della simulazione ----------
// il numero del danno esce nel momento del colpo dell'animazione (fendente, sfera, freccia, scatto della creatura)
const IMPACT = { kn: 70, mg: 430, ar: 400, an: 300 }, IMPACT_LUNGE = 90;
function impactDelay(e) { if (e.fs === undefined) return 0; const el = (e.fs === 'p' ? pEls : eEls)[e.fi]; if (!el) return 0; const a = el.querySelector('.kn, .mg, .ar, .an'); return a ? IMPACT[a.classList[0]] || 0 : IMPACT_LUNGE; }
const capQueue = [];
let lvlToastAt = 0;
function handle(ev) {
  for (const e of ev) {
    if (e.type === 'dmg') { const el = (e.side === 'p' ? pEls : eEls)[e.idx], d = impactDelay(e), show = () => { if (e.side === 'e') snd(e.crit ? 'crit' : 'hit'); floatText(el, cfmt(e.dmg), e.crit ? 'crit' : (e.side === 'p' ? 'hurt' : '')); }; if (d) setTimeout(show, d); else show(); }
    else if (e.type === 'atk' && e.side === 'p' && e.tgt !== undefined && B.party[e.idx] && B.party[e.idx].id === 'hero_arc') { flyHeart(pEls[e.idx], eEls[e.tgt]); }
    else if (e.type === 'atk' && e.side === 'p' && e.tgt !== undefined && B.party[e.idx] && B.party[e.idx].id === 'hero_mag') { flyHeart(pEls[e.idx], eEls[e.tgt], 'skull'); }
    else if (e.type === 'atk' && e.side === 'p' && e.tgt !== undefined && B.party[e.idx] && B.party[e.idx].cls === 'Arciere') { stickArrow(eEls[e.tgt]); }
    if (e.type === 'atk') { lunge((e.side === 'p' ? pEls : eEls)[e.idx], e.side === 'p' ? 8 : -8); if (e.side === 'e') knAnim(eEls[e.idx], 'atk', 800); if (e.side === 'p') { const el = pEls[e.idx]; const two = el && (el._k = !el._k); knAnim(el, two ? 'atk2' : 'atk', two ? 400 : 450); } }
    else if (e.type === 'skill') { floatText(pEls[e.idx], e.name, 'skill'); knAnim(pEls[e.idx], 'sk', 450); }
    else if (e.type === 'heal') { floatText(pEls[e.idx], '+' + cfmt(e.h), 'heal'); }
    else if (e.type === 'dodge') { if (e.side === 'p') knAnim(pEls[e.idx], 'dg', 450); }
    else if (e.type === 'kill') { snd('kill'); dirty = true; }
    else if (e.type === 'drop') { const r = F.ITEM_RARITY.find(x => x.key === e.item.rarity); if (e.item.rarity !== 'comune') toast(`Trovato: <b class="${r.rainbow ? 'rbw' : ''}" style="color:${r.color}">${esc(F.itemName(e.item))}</b> · ${r.label}`, r.color); dirty = true; }
    else if (e.type === 'level') { const now = Date.now(); if (now - lvlToastAt > 4000) { lvlToastAt = now; snd('level'); toast(`${esc(S.roster[e.id].name)} sale al livello ${e.lvl}`); } dirty = true; }
    else if (e.type === 'chest') { const el = eEls[e.idx]; floatText(el, e.kind === 'astri' ? '+' + e.n + ' Astri' : '+' + cfmt(e.n) + ' oro', 'crit'); }
    else if (e.type === 'portal') { toast('<b>Si è aperto un portale astrale!</b> Toccalo sopra la battaglia per entrare.', '#B48CFF'); dirty = true; }
    else if (e.type === 'portalend') { toast(e.win ? `<b>Portale completato!</b> +${e.astri} Astri e una runa epica` : '<b>Il portale si è chiuso.</b> Tieni l\'oro delle ondate vinte.', '#B48CFF'); dirty = true; }
    else if (e.type === 'capture') { snd('capture'); capQueue.push(e.species); dirty = true; }
    else if (e.type === 'rare') { snd('rare'); setTimeout(shareDrops, 500); const r = F.ITEM_RARITY.find(x => x.key === e.item.rarity); banner('DROP ' + r.label.toUpperCase() + '!'); toast(`<b class="${r.rainbow ? 'rbw' : ''}" style="color:${r.color}">${r.label}!</b> ${esc(F.itemName(e.item))}`, r.color); dirty = true; }
    else if (e.type === 'lost') { if (!window._lostAt || Date.now() - window._lostAt > 20000) { window._lostAt = Date.now(); toast('<b style="color:#FF8A96">Zaino pieno:</b> gli oggetti nuovi vanno persi', '#FF8A96'); } }
    else if (e.type === 'stone') { toast(`${ipx('pietra', 14)} +1 <b style="color:#5BD8E6">Pietra del rimescolo</b>`, '#5BD8E6'); dirty = true; }
    else if (e.type === 'rune') { const r = F.RUNE[e.rune]; toast(`${runeImg(e.rune, 14)} +${e.n} <b style="color:${r.color}">${r.label}</b>`, r.color); dirty = true; }
    else if (e.type === 'unlock') { toast(e.text, '#F2C14E'); dirty = true; }
    else if (e.type === 'zonetime') { const m = Math.floor(e.t / 60), sec = Math.round(e.t % 60); toast(`Zona ${e.zone} completata in <b>${m}:${String(sec).padStart(2, '0')}</b>${e.best ? ' · nuovo record!' : ''}`, '#F2C14E'); }
    else if (e.type === 'battle') { buildScene(); const bo = B.enemies.find(u => u.boss), sec = bo && bo.secret; if (sec) { snd('rare'); toast('<b class="rbw">Boss segreto!</b> Sconfiggilo e si unirà a te', '#B07CF0'); } banner(e.result === 'win' ? (sec ? 'BOSS SEGRETO: ' + F.SPECIES[bo.species].name.toUpperCase() : S.battle === F.BOSS_BATTLE ? 'BOSS: ' + F.SPECIES[F.ZONES[S.zone].boss].name.toUpperCase() : (S.battle === 1 ? 'ZONA ' + S.zone + ' · ' : '') + 'BATTAGLIA ' + S.battle) : 'SCONFITTA · SI RIPARTE DALLA BATTAGLIA 1'); dirty = true; }
  }
}

// ---------- HUD ----------
const SHOP_VER = 4; // aumentalo quando nello Shop arriva qualcosa di nuovo: compare il pallino
// le finestre si aprono sotto la scena: la battaglia resta sempre in vista
function applyBig() { document.body.classList.toggle('bigscene', !!S.settings.bigScene && !!S.net && !tutOn); }
function sceneEdge() { const sc = $('#scene'), md = $('#modal'); if (!sc || !md || !md.offsetParent) return; const v = Math.round(sc.getBoundingClientRect().bottom - md.offsetParent.getBoundingClientRect().top); if (v > 0 && v !== sceneEdge.v) { sceneEdge.v = v; md.style.setProperty('--sb', v + 'px'); } }
window.addEventListener('resize', sceneEdge);
function hud() {
  sceneEdge();
  { const pb = $('#portalbtn'), on = !!S.portal && !S.portalRun; if (pb) { pb.hidden = !on; if (on) { const h = Math.max(0, (S.portal.until - (S.clock || 0)) / 3600); pb.title = 'Portale aperto ancora ' + (h >= 1 ? Math.floor(h) + ' h' : Math.ceil(h * 60) + ' min'); } }
    scene().classList.toggle('inportal', !!S.portalRun); }
  if (!S.dmgLog || S.dmgLog.zone !== S.zone) S.dmgLog = { since: S.clock || 0, by: {}, zone: S.zone }; // i danni per membro ripartono a ogni zona
  const mr = F.missionsReady(S), bt = document.querySelector('.tab[data-tab=mappa]'); if (bt) bt.classList.toggle('dot', mr > 0); if (tab === 'altro') S.achNew = 0; const stb = document.querySelector('[data-tab=altro]'); if (stb) stb.classList.toggle('dot', (S.achNew || 0) > 0);
  const shb = document.querySelector('[data-tab=shop]'); if (tab === 'shop') S.shopSeen = SHOP_VER; if (shb) shb.classList.toggle('dot', F.dailyReady(S) || S.shopSeen !== SHOP_VER);
  const maxId = S.inventory.reduce((x, it) => Math.max(x, it.id), 0); if (tab === 'zaino') S.bagSeen = Math.max(S.bagSeen || 0, maxId); const zb = document.querySelector('[data-tab=zaino]'); if (zb) zb.classList.toggle('dot', maxId > (S.bagSeen || 0));
  $('#gold').textContent = cfmt(S.gold); $('#astri').textContent = cfmt(S.astri);
  const pl = F.planetOf(S.zone); $('#ptitle').textContent = pl.name; $('#where').textContent = `Zona ${S.zone} · Battaglia ${S.battle}/30`;
  const inf = pl === F.PLANETS[0]; scene().classList.toggle('rinf', inf); scene().classList.toggle('p1', false); for (const k of [1, 2, 3]) scene().classList.toggle('bg' + k, false); /* zone 1-5: Inferno */ scene().classList.toggle('rpur', pl === F.PLANETS[1]); scene().classList.toggle('p2', false); /* zone 6-10: Purgatorio */ scene().classList.toggle('rter', pl === F.PLANETS[2]); scene().classList.toggle('p3', false); /* zone 11-15: Terra */ scene().classList.toggle('p4', pl === F.PLANETS[3]);
  $('#prog').style.width = (100 * S.battle / 30) + '%';
  $('#testbadge').hidden = !(S.settings.tFast || S.settings.tCap);
}

// ---------- pannelli ----------
const CC = c => F.CLASSES[c].color;
// ---------- suoni (sintetizzati, niente file da scaricare) ----------
let actx = null; const sndAt = {};
function snd(kind) {
  if (S.settings.sound === false || document.hidden) return;
  const now = performance.now(), gap = { hit: 120, crit: 150, kill: 90, coin: 200 }[kind] || 0; if (gap && now - (sndAt[kind] || 0) < gap) return; sndAt[kind] = now;
  try { actx = actx || new (window.AudioContext || window.webkitAudioContext)(); if (actx.state === 'suspended') actx.resume(); } catch (e) { return; }
  const t = actx.currentTime, vol = (S.settings.volume ?? 0.5) * 0.25;
  const tone = (f, d, type, v, at, f2) => { const o = actx.createOscillator(), g = actx.createGain(); o.type = type; o.frequency.setValueAtTime(f, t + at); if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + at + d); g.gain.setValueAtTime(0.0001, t + at); g.gain.exponentialRampToValueAtTime(v * vol, t + at + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + at + d); o.connect(g).connect(actx.destination); o.start(t + at); o.stop(t + at + d + 0.02); };
  if (kind === 'hit') tone(180, 0.06, 'square', 0.25, 0, 90);
  else if (kind === 'crit') { tone(520, 0.08, 'square', 0.35, 0, 260); tone(880, 0.06, 'triangle', 0.25, 0.02); }
  else if (kind === 'kill') tone(300, 0.1, 'triangle', 0.3, 0, 120);
  else if (kind === 'coin') { tone(988, 0.07, 'square', 0.18, 0); tone(1319, 0.12, 'square', 0.18, 0.06); }
  else if (kind === 'level') [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.14, 'triangle', 0.35, i * 0.08));
  else if (kind === 'rare') [659, 784, 988, 1319, 1568].forEach((f, i) => tone(f, 0.18, 'square', 0.3, i * 0.07));
  else if (kind === 'capture') [392, 523, 659, 784, 659, 1047].forEach((f, i) => tone(f, 0.15, 'triangle', 0.4, i * 0.09));
  else if (kind === 'click') tone(660, 0.03, 'square', 0.12, 0);
}
function synergyHTML() {
  const cc = F.classCounts(S), all = Object.values(cc).every(x => x > 0);
  const chips = Object.keys(cc).map(c => { const n = cc[c], v = F.SYN_SAME.find(([k]) => n >= k); return `<span class="chip"><i style="background:${CC(c)}"></i>${c} ${n}${v ? ` <em>+${Math.round(v[1] * 100)}%</em>` : ''}</span>`; }).join('');
  return `<div class="chips">${chips}<span class="chip${all ? '' : ' off'}">${all ? '★' : '☆'} Tutte le classi <em>${all ? '+' + Math.round(F.SYN_ALL * 100) + '%' : ''}</em></span></div>`;
}
// Statistiche di un oggetto, in stile scheda
function statsHTML(it, lv) {
  const sm = 1 + F.SLOT_STEP * (lv || 0), main = F.mainStats(it), r = F.ITEM_RARITY.find(x => x.key === it.rarity);
  const val = (k, v) => F.PCT_STATS.includes(k) ? (v * sm * 100).toFixed(2).replace('.', ',') + '%' : (v * sm).toLocaleString('it-IT', { maximumFractionDigits: 1 });
  const rows = Object.keys(main).map(k => `<div class="srow2"><span>${F.STAT_LABEL[k]}</span><b>${val(k, main[k])}</b></div>`).join('');
  const bon = (it.bonus || []).map(b => `<div class="srow2 bon"><span><i style="background:${r.color}"></i>${F.STAT_LABEL[b.k]}</span><b>${val(b.k, F.bonusValue(it, b))}</b></div>`).join('');
  return `<div class="stbox">${rows}${bon ? `<div class="sthead">Bonus</div>${bon}` : ''}<div class="srow2 val"><span>${icon('coin', '#F2C14E', 12)} Valore</span><b>${fmt(F.sellValue(it, S))}</b></div>${lv ? `<div class="sthead" style="color:#5BD8E6">Slot +${lv}: +${lv * 10}% agli attributi</div>` : ''}</div>`;
}
function fullStats(st) {
  const pc = v => (v * 100).toFixed(1).replace('.', ',') + '%';
  const rows = [['Gittata', String(F.CLASSES[st.cls].range)], ['Vita', fmt(st.hp)], ['Attacco', fmt(st.atk)], ['Difesa', String(st.def).replace('.', ',')], ['Attacchi al secondo', (1 / st.spd).toFixed(2).replace('.', ',')], ["Vel. d'attacco", '+' + pc(st.aspd)], ['Prob. critico', pc(st.crit)], ['Danni critici', pc(st.critDmg)], ['Blocco', pc(st.block)], ['Schivata', pc(st.dodge)], ['Vel. movimento', '+' + pc(st.move || 0)]];
  return `<div class="fstats">${rows.map(([l, v]) => `<div><span>${l}</span><b>${v}</b></div>`).join('')}</div>`;
}
function ptsHTML(id) {
  const m = S.roster[id], p = F.ptsOf(m), free = F.ptsFree(m);
  return `<div class="ptsbox"><div class="ptshead"><b>Punti statistica</b><span class="${free ? 'pfree' : ''}">${free} da assegnare</span><button class="sb" data-act="ptsreset" data-id="${id}">Azzera</button></div>
  ${Object.keys(F.ATTRS).map(k => { const a = F.ATTRS[k]; return `<div class="ptsrow"><span class="pn2" style="color:${a.color}">${a.ic} ${a.name} <b>${p[k]}</b></span><span class="pd">${a.desc}</span><span class="pb2">${[-10, -1].map(n => `<button class="ib" data-act="pts" data-id="${id}" data-k="${k}" data-n="${n}" ${p[k] ? '' : 'disabled'}>${n}</button>`).join('')}${[1, 10].map(n => `<button class="ib" data-act="pts" data-id="${id}" data-k="${k}" data-n="${n}" ${free ? '' : 'disabled'}>+${n}</button>`).join('')}<button class="ib" data-act="pts" data-id="${id}" data-k="${k}" data-n="999" ${free ? '' : 'disabled'}>Max</button></span></div>`; }).join('')}
  <div class="note">${F.PTS_PER_LEVEL} punti a ogni livello. Puoi azzerarli gratis quando vuoi.</div></div>`;
}
function rarTag(species) { const d = F.SPECIES[species]; if (!d || d.hero) return ''; const rl = d.secret ? 'Segreto' : F.RARITY[d.rarity] ? F.RARITY[d.rarity].label : ''; const b = F.speciesBonus(species); return `<span class="rtag${d.secret ? ' rbw' : ''}">${rl}${b ? ' ' + b : ''}</span>`; }
function memberRow(id, inTeam, i) {
  const m = S.roster[id], sp = F.SPECIES[m.species], cls = sp.cls, st = F.memberStats(S, id), open = openMember === id;
  const need = F.xpNeed(m.lvl);
  let html = `<div class="card mrow" style="border-left:3px solid ${CC(cls)}">
  <button class="mhead" data-act="openm" data-id="${id}" aria-expanded="${open}">
    <div class="mspr">${sprite(m.species, 2)}</div>
    <div class="minfo"><div class="mname">${esc(m.name)}${m.locked ? ' ' + icon('lock', '#A9B0D6', 13) : ''}${F.ptsFree(m) ? ` <span class="ptsdot">+${F.ptsFree(m)}</span>` : ''}</div><div class="msub"><span style="color:${CC(cls)}">${cls}</span> · Lv ${m.lvl} · Potere ${fmt(F.memberPower(S, id))} ${rarTag(m.species)}</div><div class="xp"><b style="width:${100 * m.xp / need}%"></b></div></div>
  </button>`;
  html += `<button class="eqb" data-act="equip" data-id="${id}" aria-label="Equipaggiamento di ${esc(m.name)}">${itemIcon('corazza', cls, '#F2C14E', 18)}</button>`;
  if (inTeam) html += `<div class="mbtns"><button class="ib" data-act="up" data-id="${id}" aria-label="Sposta su" ${i === 0 ? 'disabled' : ''}>${icon('up')}</button><button class="ib" data-act="down" data-id="${id}" aria-label="Sposta giù" ${i === S.team.length - 1 ? 'disabled' : ''}>${icon('down')}</button></div>`;
  else html += `<div class="mbtns"><button class="sb" data-act="add" data-id="${id}" ${F.teamFull(S) ? 'disabled' : ''}>Aggiungi</button></div>`;
  html += `</div>`;
  if (open) {
    html += `<div class="card detail">
    ${fullStats(st)}
    <button class="sb" data-act="cmppick" data-id="${id}" style="width:100%;margin:6px 0">Confronta con un'altra creatura</button>
    <div class="abil"><b style="color:${CC(cls)}">${F.CLASSES[cls].ability}</b> · ${F.CLASSES[cls].desc}</div>
    ${ptsHTML(id)}
    <div class="row2"><label class="tg"><input type="checkbox" data-act="lockm" data-id="${id}" ${m.locked ? 'checked' : ''}> Blocca equipaggiamento</label>${inTeam && !F.isHero(id) ? `<button class="sb" data-act="bench" data-id="${id}">Metti in riserva</button>` : ''}</div>
    ${F.isHero(id) ? `<form class="rename" data-id="${id}"><label for="rn-${id}">Nome</label><input id="rn-${id}" maxlength="16" value="${esc(m.name)}"><button class="sb" type="submit">Salva</button></form>` : ''}
    </div>`;
  }
  return html;
}
function eqHTML(id) {
  const m = S.roster[id], cls = F.SPECIES[m.species].cls;
  return `<div class="eqgrid">${F.SLOTS.map(sl => { const it = m.eq[sl], lv = m.slv[sl] || 0, k = F.kindOf(sl), sel = selSlot === id + ':' + sl;
      const r = it ? F.ITEM_RARITY.find(x => x.key === it.rarity) : null, col = r ? r.color : '#4A5088';
      return `<button class="eqt${sel ? ' sel' : ''}${it ? '' : ' empty'}${it && F.rarityIndex(it.rarity) >= 4 ? ' fx fx-' + it.rarity : ''}" style="border-color:${col};--c:${col}" data-act="selslot" data-id="${id}" data-slot="${sl}" aria-label="${F.SLOT_LABEL[sl]}${it ? ': ' + esc(F.itemName(it)) : ' vuoto'}">${itemIcon(k, it ? it.cls : cls, col, 22)}<span>${it ? cfmt(Math.round(F.itemPower(it) * (1 + F.SLOT_STEP * lv))) : F.SLOT_LABEL[sl]}</span>${lv ? `<i>+${lv}</i>` : ''}</button>`; }).join('')}</div>
    ${(() => { if (!selSlot || selSlot.split(':')[0] !== id) return '<div class="note">Tocca un posto per vederlo, togliere l\'oggetto o potenziare lo slot.</div>';
      const sl = selSlot.split(':')[1], it = m.eq[sl], lv = m.slv[sl] || 0, c = F.slotCost(lv), rk = F.slotRune(lv), rr = F.RUNE[rk];
      const r = it ? F.ITEM_RARITY.find(x => x.key === it.rarity) : null;
      return `<div class="card eqdet" style="border-color:${r ? r.color : 'var(--line)'}"><div><b style="color:${r ? r.color : 'var(--muted)'}">${it ? esc(F.itemName(it)) : F.SLOT_LABEL[sl] + ' vuoto'}</b><div class="msub">${it ? r.label + ' · ' + F.SLOT_LABEL[F.kindOf(sl)] + ' · ' : ''}slot +${lv}</div>${it ? statsHTML(it, lv) : ''}</div>
      <div class="row2">${it ? `<button class="sb" data-act="uneq" data-id="${id}" data-slot="${sl}">Togli</button>` : ''}<button class="sb" data-act="slotup" data-id="${id}" data-slot="${sl}" ${lv >= 10 || S.astri < c ? 'disabled' : ''}>${lv >= 10 ? 'Slot al massimo' : `Potenzia slot a +${lv + 1} · ${c} ${icon('gem', '#F49AC1', 12)}`}</button></div></div>`; })()}
  <div class="note">Il livello dello slot resta anche se cambi oggetto: +2% alle statistiche dell'oggetto per livello, fino a +20% a +10. Si paga in Astri (5, 10, 15… fino a 50).</div>`;
}
function slotTile(id, sl) { const m = S.roster[id], cls = F.SPECIES[m.species].cls; const it = m.eq[sl], lv = m.slv[sl] || 0, k = F.kindOf(sl), sel = selSlot === id + ':' + sl;
      const r = it ? F.ITEM_RARITY.find(x => x.key === it.rarity) : null, col = r ? r.color : '#4A5088';
      return `<button class="eqt${sel ? ' sel' : ''}${it ? '' : ' empty'}${it && F.rarityIndex(it.rarity) >= 4 ? ' fx fx-' + it.rarity : ''}" style="border-color:${col};--c:${col}" data-act="selslot" data-id="${id}" data-slot="${sl}" aria-label="${F.SLOT_LABEL[sl]}${it ? ': ' + esc(F.itemName(it)) : ' vuoto'}">${itemIcon(k, it ? it.cls : cls, col, 22)}<span>${it ? cfmt(Math.round(F.itemPower(it) * (1 + F.SLOT_STEP * lv))) : F.SLOT_LABEL[sl]}</span>${lv ? `<i>+${lv}</i>` : ''}</button>`; }
function slotDetail(id) { const m = S.roster[id], cls = F.SPECIES[m.species].cls; return `${(() => { if (!selSlot || selSlot.split(':')[0] !== id) return '<div class="note">Tocca un posto per vederlo, togliere l\'oggetto o potenziare lo slot.</div>';
      const sl = selSlot.split(':')[1], it = m.eq[sl], lv = m.slv[sl] || 0, c = F.slotCost(lv), rk = F.slotRune(lv), rr = F.RUNE[rk];
      const r = it ? F.ITEM_RARITY.find(x => x.key === it.rarity) : null;
      return `<div class="card eqdet" style="border-color:${r ? r.color : 'var(--line)'}"><div><b style="color:${r ? r.color : 'var(--muted)'}">${it ? esc(F.itemName(it)) : F.SLOT_LABEL[sl] + ' vuoto'}</b><div class="msub">${it ? r.label + ' · ' + F.SLOT_LABEL[F.kindOf(sl)] + ' · ' : ''}slot +${lv}</div>${it ? statsHTML(it, lv) : ''}</div>
      <div class="row2">${it ? `<button class="sb" data-act="uneq" data-id="${id}" data-slot="${sl}">Togli</button>` : ''}<button class="sb" data-act="slotup" data-id="${id}" data-slot="${sl}" ${lv >= 10 || S.astri < c ? 'disabled' : ''}>${lv >= 10 ? 'Slot al massimo' : `Potenzia slot a +${lv + 1} · ${c} ${icon('gem', '#F49AC1', 12)}`}</button></div></div>`; })()}`; }
// scheda a colpo d'occhio: slot intorno al personaggio, statistiche compatte, zaino che scorre di lato; si passa da un personaggio all'altro scorrendo
const DOLL_L = ['elmo', 'collana', 'orecchini', 'corazza', 'guanti', 'gambe'], DOLL_R = ['arma', 'secondaria', 'anello1', 'anello2', 'stivali'];
function eqOrder() { return S.team.concat(Object.keys(S.roster).filter(x => !S.team.includes(x))); }
function showEquip(id) {
  equipOpen = id; const m = S.roster[id], sp = F.SPECIES[m.species], st = F.memberStats(S, id), ord = eqOrder(), at = ord.indexOf(id);
  const pc = v => (v * 100).toFixed(0) + '%';
  const mini = [['Vita', fmt(st.hp)], ['Attacco', fmt(st.atk)], ['Difesa', String(Math.round(st.def * 10) / 10).replace('.', ',')], ['Critico', pc(st.crit)], ['Danni crit.', pc(st.critDmg)], ['Vel. att.', '+' + pc(st.aspd)], ['Blocco', pc(st.block)], ['Schivata', pc(st.dodge)], ['Vel. movimento', '+' + pc(st.move || 0)]];
  $('#modal').innerHTML = `<div class="mod eqmod doll" role="dialog" aria-modal="true" aria-labelledby="eqt" id="dollmod">
   <div class="dhead"><button class="ib" data-act="eqnav" data-d="-1" aria-label="Precedente" ${at <= 0 ? 'disabled' : ''}>◀</button>
    <div class="dtitle"><h2 id="eqt">${esc(m.name)}</h2><div class="msub"><span style="color:${CC(sp.cls)}">${sp.cls}</span> · Lv ${m.lvl} · Potere <b style="color:var(--gold)">${fmt(F.memberPower(S, id))}</b> ${rarTag(m.species)}</div></div>
    <button class="ib" data-act="eqnav" data-d="1" aria-label="Successivo" ${at >= ord.length - 1 ? 'disabled' : ''}>▶</button><button class="ib" data-act="close" aria-label="Chiudi">✕</button></div>
   <div class="dgrid"><div class="dcol">${DOLL_L.map(sl => slotTile(id, sl)).join('')}</div>
    <div class="dmid"><div class="dspr">${m.species === 'hero' ? '<div class="kn" aria-hidden="true"></div>' : m.species === 'hero_mag' ? '<div class="mg" aria-hidden="true"></div>' : m.species === 'hero_arc' ? '<div class="ar" aria-hidden="true"></div>' : sprite(m.species, 4)}</div><div class="dpos">${at + 1}/${ord.length}${S.team.includes(id) ? '' : ' · riserva'}</div></div>
    <div class="dcol">${DOLL_R.map(sl => slotTile(id, sl)).join('')}</div></div>
   <div class="dstats">${mini.map(([l, v]) => `<div><span>${l}</span><b>${v}</b></div>`).join('')}</div>
   ${slotDetail(id)}
   ${bagForMember(id)}</div>`;
  $('#modal').classList.add('dollfull'); $('#modal').hidden = false;
  const md = $('#dollmod'); let x0 = null, y0 = null;
  md.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
  md.addEventListener('touchend', e => { if (x0 === null) return; const dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0; x0 = null; if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) eqNav(dx < 0 ? 1 : -1); }, { passive: true });
}
function eqNav(d) { const ord = eqOrder(), i = ord.indexOf(equipOpen) + d; if (i < 0 || i >= ord.length) return; selSlot = null; eqSel = null; showEquip(ord[i]); }
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
      <div class="row2"><button class="pb" data-act="eqto" data-item="${it.id}" data-id="${id}">Equipaggia</button><button class="sb" data-act="sell" data-item="${it.id}">Vendi · ${cfmt(F.sellValue(it, S))}</button></div></div>`;
  }
  return `<div class="ph"><h2 style="font-size:13px">Zaino</h2><span>${inv.length} oggetti adatti</span></div>${det}
  <div class="igrid dbag">${inv.map(it => { const r = F.ITEM_RARITY.find(x => x.key === it.rarity), cur = m.eq[F.targetSlot(m, it)], up = !cur || F.itemPower(it) > F.itemPower(cur); return `<button class="it${eqSel === it.id ? ' sel' : ''}${F.rarityIndex(r.key) >= 4 ? ' fx fx-' + r.key : ''}" style="border-color:${r.color};--c:${r.color}" data-act="eqpick" data-item="${it.id}">${itemIcon(it.slot, it.cls, r.color, 22)}<b>${cfmt(F.itemPower(it))}</b>${up ? '<i class="upar">▲</i>' : ''}</button>`; }).join('') || '<div class="note" style="grid-column:1/-1">Nessun oggetto adatto nello zaino.</div>'}</div>`;
}
function dmgHTML() { const d = S.dmgLog || { by: {}, since: S.clock || 0 }, ids = Object.keys(d.by).filter(id => S.roster[id]).sort((a, b) => d.by[b] - d.by[a]), tot = ids.reduce((x, id) => x + d.by[id], 0), secs = Math.max(1, (S.clock || 0) - d.since);
    return `<div class="ph"><h2>Contributo di battaglia</h2><button class="sb" data-act="dmgreset" style="min-height:28px;font-size:11px">Azzera</button></div>
    <div class="card">${ids.length ? ids.map(id => { const m = S.roster[id], c = CC(F.SPECIES[m.species].cls); return `<div class="dmrow"><span class="dmn">${esc(m.name)}</span><div class="dmbar"><b style="width:${100 * d.by[id] / d.by[ids[0]]}%;background:${c}"></b></div><span class="dmv">${cfmt(d.by[id] / secs)}/s · ${Math.round(100 * d.by[id] / tot)}%</span></div>`; }).join('') : '<div class="note">Nessun dato ancora.</div>'}<div class="msub" style="margin-top:4px">Danni medi al secondo e quota sul totale nella zona attuale, da ${dur(secs)} di battaglie. Si azzerano a ogni cambio di zona.</div></div>`; }
let showDmg = false;
function pSquadra() {
  const slots = F.slotCount(S), n = F.creaturesInTeam(S);
  const reserve = Object.keys(S.roster).filter(id => !S.team.includes(id));
  return `<div class="ph"><h2>Squadra</h2><span>creature ${n}/${slots}</span></div>
  <button class="sb small" data-act="dmgtoggle" style="width:100%;margin-bottom:5px">${showDmg ? 'Nascondi contributo di battaglia' : 'Contributo di battaglia'}</button>
  ${showDmg ? dmgHTML() : ''}
  ${synergyHTML()}
  ${S.team.map((id, i) => memberRow(id, true, i)).join('')}
  ${Array.from({ length: Math.max(0, slots - n) }, () => `<div class="card mrow freeslot">${icon('team', '#7C84BC', 18)}<span>Posto libero</span><small>aggiungi una creatura dalla riserva</small></div>`).join('')}
  ${slots < F.CREATURE_SLOTS ? `<div class="card mrow freeslot lock">${icon('lock', '#7C84BC', 16)}<span>Prossimo posto</span><small>alla zona ${F.nextSlotZone ? F.nextSlotZone(S) : ''}</small></div>` : ''}

  ${reserve.length ? `<div class="ph"><h2>Riserva</h2><span>${reserve.length}</span></div>${reserve.map(id => memberRow(id, false)).join('')}` : ''}`;
}
function rcls(r) { return r.rainbow ? ' rbw' : ''; }
function itemGrid(list, empty, sellMode) {
  return `<div class="igrid">${list.map(it => { const r = F.ITEM_RARITY.find(x => x.key === it.rarity), prot = F.isProtected(S, it); return `<button class="it${selItem === it.id ? ' sel' : ''}${F.rarityIndex(r.key) >= 4 ? ' fx fx-' + r.key : ''}" style="border-color:${r.color};--c:${r.color}" data-act="selit" data-item="${it.id}" aria-label="${esc(F.itemName(it))}, ${r.label}, potere ${F.itemPower(it)}">${itemIcon(it.slot, it.cls, r.color, 22)}<b>${cfmt(F.itemPower(it))}</b><em>${sellMode ? (prot ? 'protetto' : cfmt(F.sellValue(it, S)) + ' oro') : it.cls ? it.cls : F.SLOT_LABEL[it.slot]}</em><i class="ilv">${F.itemLevel(it)}</i>${it.isNew ? '<i>nuovo</i>' : ''}${F.isUpgrade(S, it) ? '<i class="upg" title="Migliora qualcuno">▲</i>' : ''}${(it.locked || (prot && sellMode)) ? `<i class="plk">${icon('lock', '#F2C14E', 10)}</i>` : ''}</button>`; }).join('') || `<div class="note" style="grid-column:1/-1">${empty}</div>`}</div>`;
}
const byPower = l => l.slice().sort((a, b) => F.itemPower(b) - F.itemPower(a));
function wareDetail() { const it = selShop !== null && S.shop.items[selShop]; if (!it) return ''; const r = F.ITEM_RARITY.find(x => x.key === it.rarity);
    return `<div class="card idet" style="border-color:${r.color}"><div class="iname${rcls(r)}" style="color:${r.color};display:flex;align-items:center;gap:6px">${itemIcon(it.slot, it.cls, r.color, 26)}${esc(F.itemName(it))}</div>
    <div class="msub">${r.label} · ${F.SLOT_LABEL[it.slot]}${it.cls ? ' · solo ' + it.cls : ' · tutte le classi'} · Lv ${F.itemLevel(it)} · punteggio ${fmt(F.itemPower(it))}</div>${statsHTML(it, 0)}
    <div class="row2"><button class="pb" data-act="buy" data-i="${selShop}" ${it.sold || S.astri < it.price || S.inventory.length >= F.bagCap(S) ? 'disabled' : ''}>${it.sold ? 'Venduto' : S.inventory.length >= F.bagCap(S) ? 'Zaino pieno' : `Compra · ${it.price} Astri`}</button></div></div>`; }
let rrLocks = [], rrItem = null;
function rerollHTML(it) {
  if (!(it.bonus || []).length) return '';
  if (rrItem !== it.id) { rrItem = it.id; rrLocks = []; }
  const c = F.rerollCost(it, rrLocks), all = rrLocks.length >= it.bonus.length;
  return `<div class="rrbox"><div class="msub"><b>Rimescola i bonus</b> · tocca un bonus per bloccarlo (ogni blocco raddoppia il costo)</div>
  <div class="rrchips">${it.bonus.map((b, i) => `<button class="rrc${rrLocks.includes(i) ? ' on' : ''}" data-act="rrlock" data-i="${i}">${rrLocks.includes(i) ? icon('lock', '#1B1F3B', 10) + ' ' : ''}${F.STAT_LABEL[b.k]}</button>`).join('')}</div>
  <button class="sb" data-act="reroll2" data-item="${it.id}" ${all || (S.stones || 0) < c ? 'disabled' : ''}>Rimescola · ${c} ${ipx('pietra', 14)} (hai ${S.stones || 0})</button></div>`;
}
function itemDetail(it, where) {
  const r = F.ITEM_RARITY.find(x => x.key === it.rarity), prot = F.isProtected(S, it);
  const head = `<div class="iname${rcls(r)}" style="color:${r.color};display:flex;align-items:center;gap:6px">${itemIcon(it.slot, it.cls, r.color, 26)}${esc(F.itemName(it))}${it.up ? ' +' + it.up : ''}</div>
      <div class="msub">${r.label} · ${F.SLOT_LABEL[it.slot]}${it.cls ? ' · solo ' + it.cls : ' · tutte le classi'} · Lv ${F.itemLevel(it)} · punteggio ${fmt(F.itemPower(it))}</div>${statsHTML(it, 0)}`;
  const lockBtn = `<button class="sb${it.locked ? ' on' : ''}" data-act="lockit" data-item="${it.id}">${icon('lock', it.locked ? '#1B1F3B' : '#F2C14E', 13)} ${it.locked ? 'Bloccato' : 'Blocca'}</button>`;
  const sellBtn = lockBtn + (prot ? `<span class="msub">${it.locked ? 'Bloccato: non si vende' : 'Rarità protetta: non si vende'}</span>` : `<button class="sb" data-act="sell" data-item="${it.id}">Vendi · ${cfmt(F.sellValue(it, S))} oro</button>`);
  if (where === 'chest') return `<div class="card idet" style="border-color:${r.color}">${head}${rrOpen === it.id ? rerollHTML(it) : (it.bonus || []).length ? `<div class="row2"><button class="sb" data-act="rropen" data-item="${it.id}">${ipx('pietra', 14)} Rimescola</button></div>` : ''}<div class="row2"><button class="pb" data-act="fromchest" data-item="${it.id}" ${S.inventory.length >= F.bagCap(S) ? 'disabled' : ''}>↑ Sposta nello zaino</button>${lockBtn}</div></div>`;
  if (where === 'shop') return `<div class="card idet" style="border-color:${r.color}">${head}<div class="row2">${sellBtn}</div></div>`;
  const users = Object.keys(S.roster).filter(id => F.canUse(S.roster[id], it));
  return `<div class="card idet" style="border-color:${r.color}">${head}
      ${users.length ? `<div class="row2"><label for="eqsel">Equipaggia a</label><select id="eqsel">${users.map(id => { const c = S.roster[id].eq[F.targetSlot(S.roster[id], it)]; return `<option value="${id}">${esc(S.roster[id].name)} (ora ${c ? fmt(F.itemPower(c)) : '—'})</option>`; }).join('')}</select><button class="sb" data-act="eqto" data-item="${it.id}">Equipaggia</button></div>` : `<div class="note">Nessuno nella tua collezione può usarlo.</div>`}
      ${rrOpen === it.id ? rerollHTML(it) : ''}
      <div class="row2">${(it.bonus || []).length && rrOpen !== it.id ? `<button class="sb" data-act="rropen" data-item="${it.id}">${ipx('pietra', 14)} Rimescola</button>` : ''}${(() => { const n = F.nextRarity(it); if (!n) return ''; const rr = F.RUNE[n], nr = F.ITEM_RARITY.find(x => x.key === n); return `<button class="sb" data-act="raise" data-item="${it.id}" ${S.runes[n] < 1 ? 'disabled' : ''}>↑ <b style="color:${nr.color}">${nr.label}</b> · 1 runa (${S.runes[n]})</button>`; })()}<button class="sb" data-act="tochest" data-item="${it.id}" ${S.chest.length >= F.chestCap(S) ? 'disabled' : ''}>↓ Nel forziere</button>${sellBtn}</div>
    </div>`;
}
let selRune = null, selShop = null, rrOpen = null;
// rune animate (tools/runes.py): pietra con glifo che pulsa
const RUNE_IMG = {"noncomune": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAAAQCAYAAADeWHeIAAAErElEQVR4Xu2Z/W9TVRjHv0Ne5iDL4hjDaETmmKYDdI4wYdPaqIQIiZFszMhCHIos6B+AiT+RaDXGRE2A+RLUUnEoGGMYEF5WGrc5VDLBrdq16wbD7KVMSddK195zrznn9DZtd3t7e69ZxPRJmnN228+e8zzneZ773HOBnORktqVzwtEz2zpzoix5SpeXLjZJStfHrrvyOicce+qWWN5Sc2gGvqe2pKqmy997oW6J5ZHZ1q8lENTW/3/j5yYaJBve2NCMkZErWLg2gtCP89lP6HxXy749tSVV1s4JB5SCIJUv3DCNwOkFjKfzU3sh1ZtewVHXPsXNT+WLNodx43g+4+l8xxbj+un/ooGsFnjp7D/zAbLi8ysEhAe4i+m8w5YdP/9egsjwbYyn8/Nt2fFa9M9JdURD/QsYGvbh9jXTeHr7OjYW1f/N5gf2H7Z2+XtfU6sAMr/oyTCaG7eycfFLITbf8Pp6pi5d5lOR+cJNN7G74UU2luwOsfknx+z/in41UbP/iVdrMxYAmZ9XHkH1zrvYuNAcZnNzU51mfu49EZh2FbKxYG2YzR/bqp3Xqj8eADT76rdsh2/QAyIIEEXCM//hKJ56/FE4LjtxowuwbjtsVSqRqbwkiZx/MIpt655Hm8uOyfY8VFfVKpbYGbzI+YJKATtrXsbB/lb4v5kza/rT2a91/SLh/itYFcVDm5ehr9uHYL+kmScCtz//AQEVzxbD6/Aj5NHOa9WfVAE8XjcEIrCPGNsAy2oznF4nGxfVRNl36USJf87UhCNeOxuLNmbBS7wN2VHZgk8HWtl4xzNZ8LH169Zv0H4SS6CV68vg+nWQjQsqtK+fiNzP5ZYS+C6Os3Hesmx4HoCZ9LMAoNm3srIahAjxj+wAp8cBc7kZp846MPk9Yd/T3yZWASVergB08xvLm3Co247x77Ln6eY3V7Tgo55WjH6dPa9Xv1H7Zb7/sgemVffhp289CPRpX7/M+34eRVl1KfqOjCLoyZ7PpD/eBApCcmaLIm8+zCssOHmmA1c/S5/5VNLxdPNtXYcw+G5U9f43k+dLo5v/4Q8H4LFmy/P169dvzH5CeHGtXL0CF465MXGSZ2Q6SbWfEN6nlq25E5e+vIZJJ78laOe16Y8HAM3sRIlVQLSfPocrB6dVlVNJ5SWJG2DrtGHgnbAOnhvQ2r0f7jf08Mb0G7VfTqCeo79hrF09eJX8J/O/fDEC/3n9fCb9LABij0XS8uX3xzdKjG3AlGfmfWdoyJ30KKXIxzI4MMB7ikTRwksSj82gVx9vVL9R+0ksYaeG9PmPEN4DBa9GIMQaSlm0+E+r/qRzANr9yyIS/pVIxKTrapLIyz0AHROva+VFkTuAjnp4w/oN2i/GSjjtxvWsXxR5BaO9gC5eo/6kAEiMtD/OhmCXjmP03M2M5VuWRN7XNoX3xY8x/FVQF+/9PIC3pfcwaJvSxRvVb9T+670EJ968iL8uRXSt/08XQcfe3xFwZy7/Sv7Xqj/pRIx286Wld6sueHz8mupJWo6/tfw340hUfrwrLl6aFAiTk2Ps73THqLLkeP4e5VbxX9qXG6mnfZk2PlVyfPILtf+q//4BnfJ2yqhx7JwAAAAASUVORK5CYII=", "rara": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAAAQCAYAAADeWHeIAAAEa0lEQVR4Xu1ZW0hUWxj+rbHCOkEZZRcwjw9ZlmBCF7pZShF2gcp6CLoYBRHdniqih3qpCHpI6iXqLTqcw+FwTsmp05GpjNAuhJVpaWqQOmNaCKk47Uv869beyz2z1rRjqJgfNstvO998//+vf/1r7zUASUtaoq2y3q5OtGbSvC3gdTtj3Azb636o60VKZb19uGh6yqlYCVXwq5fl9MzFIiianjIv0fo6hRDL/5+N7yoAHvim0u3QkZopYjWa75K/95ypO7wsp+dkZb0NXkXg5IdGzxb8T3V/kb/vV4O9eVEuXKmqq/GafBd/7Pwv/Nrfvpk+fhEWcqzCixY/+q/Lb//0i5AwQ89F/Lr8tv5hgm91NcbN19V3JQInoHTDNugIZMLKTRuFA/9VPoH+mosE7z974Ui0DsD5odH5sHNrseBfrngDfcHTBD94eCfmBKB+eOx8OFC2UPDL/wlB760TCdOPFb+O/22RUZC3drfwv+7uvzDw4pp2/G/7ApC96qDgt1b9AZGmoDY/Hv0hXAUnb8O6LdD8uhEsyyS3b/7/mFzLi/JhxJwdYBoGnN2366RXi3TybYvuIJevvyFXWUkmpBUeIvyC/AWeLdbFty3CL/+7g1x712TAyOJjCdOPFb+O/5ZJ8/fsdgW5chevhNScEu34LYPG33z7d3JNXVQKgaxCfX4c+qIA0BqbXoJhGmBZ1IFIuAF6qs7DjVuPYEVxAaRmLyH/j2aCzyYw0tkAH24eh0vXW6FsVSYMz1uvx2cFFOl8Be8rjsI5LIK1E2HE7M16fN/6/uI3Ob/rNXys/RNqg9dgVmEJDMmYqeW/adEcR963QG/DDWgKXoVfCzdCSnq2Jp/5r6FPCgBX38zcAjBNg1y8AHBEPBCqJw5xjJ91dgGZbzMHcER+hPE5VvLZBOJI+OEGos+xku9T32/8vIPgSPx/18TyR7HKf1k/0t0aV/7j0RcPgYbxZWXzCsYR78vYy5x8vgJxxPsyVvPpFmLZNuO7sZpPV8DX6vuNP8BasGmaxH8Zq/wfyrosFgvyZazix6MvCgDFuNnsGQBHvC9jL3Py5QqWsYovr2AZq/j+9eke/vXxUz7vAPKKVPnvLEDSlVlHw9GZZ6e586+vTwqAvRbZWVnTyHe6VoDkAOKWlpeuJ3mZ72zh+HkZq/iujoFbknNFJ0Dfb/wmmwAcaf7ohHCsij+VLUYLO4BpDMIqfjz6rnMAfEqnlU9bKNmzDewAbhzNOJ8/xOGI92Ss4tus5eNI9CWs4vvW9xu/ybYgk+ZPxir/XSte2oJ5jj27CJu/ePTFOQA+yE2aNFV875i81fDhKX13RXPi9vbWQe/yMn/8wh3Qee+S4DuxDn/i0r3QESwXfCfW4fvV9xv/qKy58LGlRvjvxDr+p02eBX1tzwTfiXX4uvqDDoImTJgStULRwuG3MQ9ykvwfK3+DjkT56116eoarELq7QwRHO0blluTT31F+lPxF/XFDPu1TTbxsSb77B7XvNX+fAWLP1Ggv6kxLAAAAAElFTkSuQmCC", "epica": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAAAQCAYAAADeWHeIAAAEk0lEQVR4Xu2ZX0xbVRzHv1vMugIyHdUCm1vLMkRndBst1C4RHEPcg7o0zG0v+Ccx8WGJPk5NNPqCJmrig3txiUzdWCLZ3MRBKVkgbqWjzRAyYeVfweIGS5vOaSTE3nvNufeem15oL+feTnSmv+Q+cLmffn+/8/ud3zn3XCBnOVtpiwQXAiutmbP0tird7WLLo0K6+7Ox4VWR4MIRu9P0odaALsMHbI756qmQ+bLdaXKttD5LIWj5/3/j70kNiAZ+YP8ryJ8vwbWYeqJ+8t7AEZtjvjkSXEC6IkjlrdwjCF3vVI2XPwDhyb070NcxkDb5qfwGbEcgelbF3wl98oOkkLUKL1P8xH9WXvjNjJnb15bEz8r/lViN2T8ihnlW/dWLB2J/48sw/2nFi/s8KC+qQpLjlOuNd99sngqZ39LqAIR/IFmBg6/WY2dJg4qvctaIcplmPjHClwpP4NDrNaje+Pw/oq9lWvFT/5fjuYQJjTUvobSgPG38y/HzccDjeg2WvM2GeD36SgGQ2dfoacLkxBh4jhd9tObbUFFUDS6ZVK7Dbx9uTtciVTwv8wV2OEqfVfGVO3albbGpvED5fBvcD72w4vpa8bP4z/GcOH7rzaXYcG+57vh5TuLvN1nxYN5m3bwefdUSMDYeFoV5QUrg0884ADhwwWuHN9yy7PJHeUHm6w5sBbAVJafK0Db0KTPPC9IWpK7JBsAG61d2nBrQ3HaIduf0s4ufJnCPq0H0y+fvQH+0gzl+Ti6A+sp9IuMNnsbQjV5mXo++2AHI7HtsWyU4LilevFzB3Z2XEeyZxO4GJ7ZZ3cr/ybOpXWApLyWwuzWMwOk51B0sh2vTc8w8LaDu45Pwt8awp8mOp8oamXk+S/3s45dmcNelH9B/JYh6915sWlehw3+J7+hvg3+oBw1OD4oL7Lp5Fn2lAySTSaXCaAtft9YCZ22Z1BV4XvXMYlPx8gwqMN0Hl8eqdJXUZzR5OYF5awrhPmSR9QV2Pmt9qQMYjZ+24MK1FlTtdIq/Re6xxk87QOGa9XA/XivxZC+WkiOt8dOjrxQAmfnUaAE4a7eg63wfZhKjGIhe0GxBqTxdw0nyfSdHEE2MonfsW3ZeTiBJvq9lAjO3xuAb+ZqdlxNoVD/b+OkewlVZjfO95zB7O4KJ2CCz/7QD7dq+G+3+Vtz8PYpoQlqeM5kqf/IejkVfLAD5tUiw2x9WZjsxb7sf3w1+vkQzEgmrXqWW8HICu06O4Hjf+8b5lnEcu/iOcd6ovlxARuOnM7C95wx+HD+j23/Kn714AqHpLsM8i75qE0h2+8RoBU7Hh5V7LEZ5OgOnY0Z5aQ/xSzz8r+hnGz/lf02MG/KfLgE3bkUM8Xr0VQVA3vmJBSY6wX8poD/iZcm7YpT3Xv0G/GcCfD+fMMR//9MXED4W0D54zBCfrX628Y9cD+Fo20cYnbtiyP/Jm1dx9NwHmIoNG+L16KtOxMhu3mrdqCk6NzejeZKW4++u8VtyJEpf74qKilWFEI/Pin9nOkalluOl7yh3y/hl/Lix+LRvucQvthyv/qD2Xx2/vwGMD1LfNJ+PDQAAAABJRU5ErkJggg==", "leggendaria": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAAAQCAYAAADeWHeIAAAE7UlEQVR4Xu2Za0wUVxTH/7tBaqw12KVIYx8qWGUxTQy0lqA8BSRWQQp9hwg+atu0xmJS2i+NTVNakbQfaivW2pp+KG0IUT7II4iCFTCUBqos4m6pqEtZAoWitXSZR3Nn9k52ln3c2VVSmz3JzebOzG//95w599yZO0DQgjbbZjfVdcy2ZtDcm87d4chwo+ju+PCoSWc31ZWGGrM/8hZQH3zHnJiENdN97edDjdlPzbY+SyJ4G///jQ9xdog6/lxBEVaEXEDTbwtU/lbtryidE5NQZjfVwV0SOPOJ9/2MKpNBxbd1QHwkqQRXWyvc3nxnPn1hF775Jfy265M/JInsLfE8+U/Gz8ob7H3ots2b4T8rf++tflwam+s3z6qvdw1EQf5WLNf3oKggHq/FDYPjeaXll9SWTfe1v+OtAhA+YX4XcgpfwHvrrqv4J59IluQ8zXxihE8N68SGol34MOXaHdH3Zt78p+P3xYdN9aJkUxhyHxtz678vfu5NE97N1mH9knG/eC36SgKQ2ZefV4iBX80QBEEaY2J6Et6IHwHPcUrbsrumzF2JdOZFB79yYzHeTx5S8XGrE92WWDUvr0DLcvbg4zTrrOt7859l/ALPS+N/JulB5K34Q7P/lC9cOw+ZSyf85ln0VRXAbOkHx3MQBNkBc1sT1mYkY/eaUek4bZ5M4UU5gWynDiPm6W34IG1EEy86+LH6A4jKfQsHMm2a+ED1A/bfEb+znVdQkLIY+TETmsbPO/iTP41ja9J8ZEVNauK16EsJQGbfqtg48DwnNToDhm7o0dLQjHWZqciKuqmcJ9c6V4GZvDyDR//So7f2CIybtuHlxyfZeVHmx6d0sByvkJJgR9yf7Hyg+o4K5q//9AZaJ3WoOjWIZ9MexurIWxrGL0/AoRvAkdPjKE5ZgJjwv5l5LfpKBeA4Tmk0AMlZaRBFEQePtaDWFKK6xtWceTqDYzdvByDi+y+/xledoey84wZE55YAoogThz7FZ233sPOOCuKvfqD+0xL+fPqj0n/t++4qOgb1zOPnODkBtqcuhMALKP1hAt1WHTOvRV9JADr75QogD6D/XCNSNqTDGGFXnSfXuJqal5eA4aZKxG7egdiIaU08vYGj9eWI3rIXxgi5Mjm3O6l/u/w/027BixlLEX2/1vHL8a/tsGHnegOWhGmLH01gFn0pAchrkdnSq6wzdA2t79ej+WQjUrMzsHHlP8p5cq3zq5QrT29gs0WPiycqsSpnJ4rjp5h5ugS0DuhxuaYcy/P24vUEdj5wfTmB/fWfluAmiw7f1pvxUtYyxC+2M/tP+ZYBHT5vsGFX5gPSJKTPYL7ir0VftQ9AnvaJCby8BpPys69Bhx5rI45fJK/OM2e+sym8owKQ31er9XjFWonKdpJrbDxdAshvcZUee4bK8UkrOx+ofsD+K/HjcfS8Dn3Dl9E+SOInJ5Ynmxl/HtXdOphHfkfPkH+8L31VApB3fmLVPYBQWY+aC/JQSZ/FKH/wR0AQD+GLc4TipT759WWULz9N+P2oOCNzpK+FD1Q/UP/PDgBvH72Etiuyx6TPYtT/rmvAm8es6LbKFOmzGOW16Kt2xMjT/KJFD3nVstmue91JC/J3V/xmbInS1zuDIVKVCGNjw1Lf0zYqtSAvf0e5W+Ln8eOG626frxvvakFe/UHtvxq/fwFgPz2EIvg6aQAAAABJRU5ErkJggg==", "mitico": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAAAQCAYAAADeWHeIAAAFAUlEQVR4Xu1ZDUyUZRz/oWwmms075kfRl7siNWsNQZTGR0EZgzA6RIx5EIL4tSlsDjccLlKK4GabpqIsWFbTBuF0RoBQ5BRNXZqoBydS1PgYBxIqhHdc+z8vd7t7u4/n9XUs2/2324/f/+7H7/k//+d53/eeAzzhifEOs6G6abw9PeE4vBylZ/nOMzvKd/Ve9TIbqnO8lEs/cjWhbvRNUAQvQl/TWS/l0uDx9udZCK7G/3/Te9sWZCk8MSEVHR2/sbeiFw/ixJlH2d8V5docKIILzIZqOFoEjvSa6H6Un5jO9KebYJ7tn4VOndZh8x3pM98xYN+3ygfmT/+IFrKrheesfhq/VP3CuUM4f22ytX6p+vlzhtHc9sh96935TxBPRII6BTfb22A0mZC1sgdpKYEMicclHy1AX9NWV1cAW/3H6zvx9vIkhqQPCgxjds52PoWt/tPNfyLq3UyGD9LfVbiq3zJ+Xv3yyH5szVQwtK2fV//WkgF8sMGb4f3oefytC4B2nzp+FdputMJkNGLLe70ICQtF26/1DIlTPmZFRYGjS6RYX7SxG6rAVPS3HGBInPQBr4Q4vMSK9buzu+AXsAm3W7QMiY+nv7P6ecefFHULibGP46fT7QyJS6k/ZskAVqun4PjJfobEpeh5/e2uAK16HYwmI6JDBhESEYYbl+uwrvAxhsQpT+87C4s+NXYAzwW9z5qflKtgSJzyPPp16lt4ciE1vxjqHAVD4pTn0cv1l1t/wNy7WBHnhx9P3cSOz6cyJE55nvHPe3YI6YnTcKzOgN3f+DAkTnkevRR/di+k3ffi/AC7vm5Lu4PQ11+D/nIdVC9FovFkPfJLp1g/c6X5gvVe6ki/Z8sgnl+0Gv26Ekz3z0DL2YNYXyg8S1C405fm/oWnArNwW1eMqf7Z+P1nLdI+nMatl+svt35NzDCS45/BD6faEP7qHByqbEf5ceFezlN/fMTfWLtSgaO1vYiL8sXer/pQ2TCJW8/rb30INBrtd3be/kk44FsL1ctR0F+qRd5+HwDOd79Yv2bnZFQUlkDhn4E+XQnW7KTFw6/XbPfBMa3QfFoEmu3S9HL95dZfWuWNJ3z1iAhVoaFRj9Iqaj5//UdqJ2K2sgfL3pyBqu97cKSWms+v5/W33gJMJqPdKy99iDW/9ZKwCIjbfkYcYv3enLvW5tMiIC5FX5Z3Z6z5RQyJS9HL9Zdbf0rsMGt+fWMrQ+JSxk9XAGp+ZXU3Q+JS9Lz+bAHQ16JWfTO7v9BrWfgIwqMiUV9TA03eBIbEKU/v02dtv0qJ9WvVI3hhcTqunylBzKaJDIlTnkefnTyCp4Oy0X6uGG9s8GZInPI8ern+cusPXnAPmgQVyg63IPczL4bEKc8z/gWqe9i4agZ2lXWi6AswJE55Hr0Uf7uHQHrKpNfo6Cjb4BevmRknpKA8cWch1l8Y0xNK0ZvH/H+5LvgTUlB+PPxl128yCfd5vTBeQla/ycQ5fkGvaxf0hML8ceol+NsdBNF3TYqvq8nsOxyuESZezJ2FRa89BIya92HXl8LAxdydPv8g6T/BjlJBL+bu9HL95dbfcB7YnH8VjReF+RNzd+M/dwXI2NZh3Thi7k4vxd/uRIye5mfO9HNqQNHd/YfLkzSP/uGav38diVoOeZTKWXYLwWDoYtzZMaolPHrhd5SHZf6c/rghPu1z13hxePT2P6j9V+fvHzTnuY+CAot+AAAAAElFTkSuQmCC", "astrale": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAAAQCAYAAADeWHeIAAAEWklEQVR4Xu2ZcUxVVRzHv7j+yyEkG5rGwhYulNAZCFFA5YthDJVQ07U030aI/dMfbTJtbaijP1phU9MaGas02gxXDqfRKCzFh85AsQHqU0YgC+bD1drq3XPa77z7Lvc+7rvvvnPrme39/vntnHM/93t+5/zuueeeC8QtbrE27vF1xlozbuaWYFY9KyWTm9XfHLucwD2+rQm5SW9ZDWgEvhM5WIounE3ITcqLtb6dRLDq//+Nv0cfUDDwtatfRtYfM9A61qM1L095FO6aNVuRg3ru8cEsCfT80/4H0DTyg8ZvmP0EXmmp47OXP46R1tOmk6/nn+PzsH+oXeOr5z4F16ZnHOvTDSmRrRIvXPzbjzXY5lMnpuHcba8m81hiOt472WibT7zlR+9vv2j8gulz8GHbJ7Z5u/qGBCBbXbkRmb8nwr2qHErL5ELgXlGOD/Y011e9urbWagUgvvivOSh3l4A1Mi2A8k0lYJxh89GdlDymT35Qv1RJh6vGBbZvUt9V7cKJfSfrS7DMsb6VWcWvMI43W3dH5FNuAbXFldj53RfatbWFlVAYw962gxH5e8f+RF3+emw7c0i7ti73BSgKw0ftn0Xko9GfFrwbPX2VFS/h2tUBcKaI6mX3ZaJq1Qrhyai+bNvr9WZLpJEPTFxR8iNY6S4VPsBzLFlcYLrEGnge4AuSM1BS86zwguc8NvoW8dvpP1MC41eUlIHtxWuEJ6P6aPj8GQ9hV/564WV4O/paApANXOmDX/GjZbgLp06cxbyih0U9eSpTPbWHsyB/4HobBj7vQXLFg+JS8lSmejt8w9VWDDZdwvR1AZ48laneDu9U32n8p8f7cOjMt3hy0SLRf/JUpno7/b/g8+LAueMoy1wqePJUpno7fDT64l1IT9/CBUumzOsb859HYWkeOo53YkffEUP7pd7z2rs0HL83242MddnoP9yNLd2NUfONi6uRtjELgx9fhPvC/qh5p/pO49+QVoQXC1z49Mdv0DT4fdT9r7g/F5tzyvB+1zF8OeyJmrejr+0B/P6pT/ZPPi8KkSe8WbvewvEZyJbmeyZuIA1Zwt8Jfafx/zwxJIaIvEz/+28PC568DG9HX0sAxWRpZyywiSNv1q63f4Xnqj6/Q/oO41fUvQR5qfFT9xLkZXg7+iIB1M8inp4+3zCp+gHQv3u83j7Dp1Q4PriZIy/Fq5tJ8lK8upmU1XcaP1MTgLxM//0qT16Gt6Nv+AxUQl4D+huEtpnZVF63gpi8YkIt9BqurgDkZXjDEyyh7zh+/RMsox8D3pAAflUwaIevdYAd5Gi+fsp0wkMtlH+n9yjYboaGy19J8Tu6m8He5tjVM/k9bWX/tL7T+NtHLuK1I3vQMdorFb/n135Uff0uzo9fkeLt6BtOxGg3n5o611JsdHTI8iQtzt9d4zflSDR4yDNz5ixDIoyP3xTlcMeoQYvzgf8od8v4hf25EXraF2niQy3OG3+o/VfH729bPfJXNg72sQAAAABJRU5ErkJggg==", "arcano": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAAAQCAYAAADeWHeIAAAFUklEQVR4Xu2Za1AVZRjH/7t7SGBQTHJAS0ZI4YBycfoAHzJ1KGlK0wCjgYYJQ/hiIph4g0bzQhY3SzNQsSGtqekYDI5JxEzlNANlgsDhEgEqXiBUQJDb2XPeZl85p3Ngz2GXZZhqeL49u/ub/3N5n3dvwLRN21Rbv6akfKo1p03cGLHDbk/4ErHj7XfrmH5NyU7H8ND3bRV0HL7cISwoaOBcRYVjeGjwVOtLWQi24v+/8SrzhIyJR26IRVvbdYtcVz7sQ9zm7J0OYUHp/ZoSiC0CW3zYg268UwfimZCEFmSLNt8WH9XThZe2KtcXkhIWsq2FZy3/QzWYMO83OIDcqonzXsND+OzKxHlr+hYLQLANEW+i9VqLRX0Serrw7MvLkfvx2fQEYJetHUCM39PViaVJsSBHCbbXVwqLR3Tyrenvu/8X1Pu2oPjAp+lrJkHfltnKX08MOFx7WTa/rq8X6xfNh94QhJPVFbL5kIE+RM1xAh8YjDNVtu+eYvHb0jdNgjB9EWExaG1tNgUYMjgAL34Yy9eswKXzP+G4kzM993vlL2OmSIx/rb8P3rwOfsmxqMk6jf2zHpfFxzzshRevg/q9LWh49yOkOs+RxSvVV5p/gG4IHrwOYYsX4FxTGwodnGTF763TwV3PI3ruTJzt7EWpvYMsXoq+xQ7Q9Gejqfmb+/vw3NqV1P+5+EccdXQC9LzN1WvO7+17AP9tG+n11Zn52Os0Sxaf3tsDn/2JlK9PO4JdM51l8Ur1leYfPjiAcG93Gr+m8QY0QvNk1G/10CBiXGdTvqCjG9/PsJfFS9WnC0CY3qVLnoF+JMDVumHa/IbCMnSwLBo4znROMOFaaEGM99LRfNTQIG3+zQ9P4D7Dol4mv3FokDb/Tmo2uhkGDZxqSvWV5r+M52nzL9W1oJ1l0czKq5+PXk+bf/H2XVr/6zJ5OfqmHYDn/5nuCwwLr6IyrFofAjWAFQD1c+xmWN0BzPkCTgV1xkkEbN+EpwD4A9Tf/Zi9JD6PU8E7NQe+B5IwD4APQP1twhRYscnUV5r/bwC+qmtBpK+nKVrB/1plJyn+GgCnb3cidv5c0/WCf4GTxsvRNy0A4/QbLZPlUFdUBl9C4EYIVr36AvW/YznRJEbzOzgVYjJOwZcY4EIIAlLiEZ1xCgWcNH6rSoWEtBz4EILZhMD3YDLi0nKQy415bqU22fpK8/+SYdCkbcYiQjCPEET6Lab+ZZaVVL9iMGi51YmFI/WPXeBKfS0j/iY6On+p+rSaI1s58fDwtghOPdJ4wcq+LUWxIK7n0draaPEQaI33MRgQmBJP+coP8pAvJC+DVxsMtPGCafdk4ZhMXrG+wvw9CcHrfl40/i9q/kA5rZ9Bcv3cCcFb7sIeCJy4cQdXR5ovtf5S9C3GSW92G9jBMAgJD8UPmhJoAZwnot+GLMycz2JZLEuJp42vJQT5Am8wWN0C6RSb6X/CslhyMJk2XksIjsnkleorzT+aYRAVoMaZqw1oAvCrzPq9wjDYtPBJ5F67BeGlXKjheGZeP6n6FguA1+upxlqWxfMRL6L0m4s4NHJMihn5OI6jzb9yOBeJZk0dz4z82xxHm1+7OxMJE+CV6ivNP4hl8UagDwqq6vH5BOrnzzBIeNodx1vaUDjO0JibsX5y9C1uKMLTvKur8NgGrONUKBJ5benouGnzS5qRj1fZIY/Xjem5VD7Rzg5HdBPnleorzT+Y5VBueDRQ5iY1f3+WRbVI86XyUvXHPFEYP8e6uLhZBH7vXjv1rX1GNdo0/+g/yn+lflZ/boz+ITJe40fbNG/5Q+3fWr+/ASs1+3pRY2lOAAAAAElFTkSuQmCC"};
function runeImg(k, s) { return `<span class="rn" style="--s:${s}px;width:${s}px;height:${s}px;background-image:url(${RUNE_IMG[k]});background-size:${8 * s}px ${s}px" aria-hidden="true"></span>`; }
function runeTiles() {
  return `<div class="igrid rrow"><button class="it${selRune === 'stone' ? ' sel' : ''}" style="border-color:#5BD8E6;--c:#5BD8E6" data-act="selrune" data-k="stone" aria-label="Pietra del rimescolo: ${S.stones || 0}">${ipx('pietra', 16)}<b>${fmt(S.stones || 0)}</b></button>${Object.keys(F.RUNE).map(k => { const r = F.RUNE[k]; return `<button class="it${selRune === k ? ' sel' : ''}" style="border-color:${r.color};--c:${r.color}" data-act="selrune" data-k="${k}" aria-label="${r.label}: ${S.runes[k]}">${runeImg(k, 18)}<b>${fmt(S.runes[k])}</b></button>`; }).join('')}</div>`;
}
function runeDetail(k) {
  if (k === 'stone') return `<div class="card idet" style="border-color:#5BD8E6"><div class="iname" style="color:#5BD8E6;display:flex;align-items:center;gap:6px">${ipx('pietra', 26)}Pietra del rimescolo × ${fmt(S.stones || 0)}</div><div class="msub">Cambia a caso i bonus di un oggetto: tocca l'oggetto e usa "Rimescola i bonus". Costa 1 pietra, il doppio per ogni bonus che blocchi. È rara: cade dai nemici circa una volta ogni 3 giorni.</div></div>`;
  const r = F.RUNE[k], n = S.runes[k], nr = F.ITEM_RARITY.find(x => x.key === k);
  return `<div class="card idet" style="border-color:${r.color}"><div class="iname" style="color:${r.color};display:flex;align-items:center;gap:6px">${runeImg(k, 26)}${r.label} × ${fmt(n)}</div>
    <div class="msub">Porta un oggetto a <b style="color:${nr.color}">${nr.label}</b>. Gli slot ora si potenziano con gli Astri.</div>
    <div class="stbox"><div class="srow2"><span>Valore di una runa</span><b>${r.value} ${icon('gem', '#F49AC1', 11)}</b></div><div class="srow2"><span>Valore di tutte (${fmt(n)})</span><b>${fmt(n * r.value)} ${icon('gem', '#F49AC1', 11)}</b></div></div>
    <div class="row2"><button class="sb" data-act="sellrune1" data-k="${k}" ${n < 1 ? 'disabled' : ''}>Vendi 1 · ${r.value} Astri</button><button class="sb" data-act="sellruneall" data-k="${k}" ${n < 1 ? 'disabled' : ''}>Vendi tutte · ${fmt(n * r.value)} Astri</button></div></div>`;
}
function showAutoSell() {
  const k = F.minKeep(S), pi = F.protectIdx(S), mx = F.maxFilter(S);
  $('#modal').innerHTML = `<div class="mod" role="dialog" aria-modal="true" aria-labelledby="ast"><div class="eqhead"><h2 id="ast" style="margin:0;font-size:18px">Vendita automatica</h2><button class="ib" data-act="close" aria-label="Chiudi" style="margin-left:auto">✕</button></div>
  <div class="msub" style="margin:4px 0 8px">Tocca il grado <b>da cui conservare</b>: quelli sotto si vendono in oro appena cadono.</div>
  <div class="rarbar big">${F.ITEM_RARITY.map((r, i) => { const sell = i < k, lock = i > mx, passOnly = lock && i <= F.PASS_MAX_FILTER; return `<button class="rb1 ${sell ? 'sell' : 'keep'}${i === k ? ' cur' : ''}" style="--c:${r.color}" data-act="setkeep" data-k="${r.key}" ${lock ? 'disabled' : ''}><i class="${r.rainbow ? 'rbg' : ''}"></i><span class="${r.rainbow && !sell ? 'rbw' : ''}">${r.label}</span><em>${sell ? 'vendi' : i >= pi ? 'sempre tenuto' : 'tieni'}</em>${passOnly ? `<b class="passov">${icon('lock', '#1B1F3B', 9)} PASS</b>` : ''}</button>`; }).join('')}</div>
  <div class="note">Le rune, gli oggetti bloccati col lucchetto e le rarità protette dal Mercante non si vendono mai.${F.hasPass(S) ? '' : '<br><span style="color:var(--gold)">Gratis si vendono in automatico solo i comuni; col Pass Astrale anche i non comuni. Le rarità più alte non si vendono mai in automatico.</span>'}</div>
  <div class="row2"><button class="sb" data-act="sellbelow">Vendi ora quelli nello zaino</button><button class="pb" data-act="close">Fatto</button></div></div>`;
  $('#modal').hidden = false;
}
function showFuse() {
  $('#modal').innerHTML = `<div class="mod" role="dialog" aria-modal="true"><div class="eqhead"><h2 style="margin:0;font-size:18px">Fusione</h2><button class="ib" data-act="close" aria-label="Chiudi" style="margin-left:auto">✕</button></div>
  <div class="msub" style="margin:4px 0 8px">Unisci ${F.FUSE_N} oggetti della stessa rarità per ottenerne uno della rarità successiva, con il livello più alto tra quelli usati. Si usano i più deboli; quelli bloccati o protetti non vengono toccati. Si arriva al massimo all'Arcano.</div>
  ${F.ITEM_RARITY.slice(0, F.FUSE_MAX + 1).map(r => { const n = F.fusable(S, r.key).length, nx = F.ITEM_RARITY[F.rarityIndex(r.key) + 1]; return `<div class="card srow"><div><b style="color:${r.color}">${r.label}</b> → <b style="color:${nx.color}">${nx.label}</b><div class="msub">Ne hai ${n}/${F.FUSE_N}</div><div class="bar" style="height:4px;margin-top:3px"><b style="width:${Math.min(100, 100 * n / F.FUSE_N)}%;background:${r.color}"></b></div></div><button class="pb" data-act="fuse" data-k="${r.key}" ${n < F.FUSE_N ? 'disabled' : ''}>Fondi</button></div>`; }).join('')}</div>`;
  $('#modal').hidden = false;
}
// opzioni di scarto e vendita, in una finestra per lasciare spazio allo zaino
let sellOpen = false;
function showSellOpts() {
  sellOpen = true;
  $('#modal').innerHTML = `<div class="mod" role="dialog" aria-modal="true"><div class="eqhead"><h2 style="margin:0;font-size:18px">Scarto e vendita</h2><button class="ib" data-act="close" aria-label="Chiudi">✕</button></div>
  <div class="card autos3"><span class="autol">Scarta in automatico</span>${(() => { const k = F.minKeep(S); return [['comune', 1], ['noncomune', 2]].map(([key, lvl]) => { const r = F.ITEM_RARITY.find(x => x.key === key), on = k >= lvl, needPass = lvl > 1 && !F.hasPass(S), needZone = lvl === 1 && !F.hasPass(S) && S.maxZone < F.FREE_FILTER_ZONE; return `<button class="atog${on ? ' on' : ''}" style="--c:${r.color}" data-act="atog" data-k="${key}"><span>${r.label}</span>${needPass ? `<b class="passov">${icon('lock', '#1B1F3B', 9)} PASS</b>` : needZone ? `<b class="passov">${icon('lock', '#1B1F3B', 9)} zona ${F.FREE_FILTER_ZONE}</b>` : ''}</button>`; }).join(''); })()}</div>
  <div class="card protc"><span class="autol">Non vendere mai</span><div class="protg">${(() => { const ps = F.protectSet(S); return F.ITEM_RARITY.map(r => `<button class="pchip${ps[r.key] ? ' on' : ''}${r.rainbow ? ' rb' : ''}" style="--c:${r.color}" data-act="protk" data-k="${r.key}" aria-pressed="${!!ps[r.key]}" aria-label="${r.label}" title="${r.label}"><i>${ps[r.key] ? '✓' : ''}</i><span>${r.label.slice(0, 3)}</span></button>`).join(''); })()}</div></div>
  <div class="note">Gli oggetti scartati si vendono in oro appena cadono. Rune, oggetti bloccati e rarità protette non si vendono mai.</div>
  <button class="sb" data-act="sellrest" style="width:100%;margin-top:6px">Vendi il resto dello zaino</button></div>`;
  $('#modal').hidden = false;
}
function pZaino() {
  const inBag = selItem && S.inventory.find(x => x.id === selItem), inChest = selItem && S.chest.find(x => x.id === selItem);
  const det = inBag ? itemDetail(inBag, 'bag') : inChest ? itemDetail(inChest, 'chest') : '';
  return `<div class="row2 bagbar"><button class="pb" data-act="equipall">Equipaggia tutto</button><label class="tg eqres"><input type="checkbox" data-act="eqres" ${S.settings.eqReserve ? 'checked' : ''}> riserva</label><button class="sb" data-act="fuseopen">Fusione</button><button class="sb" data-act="sellopts">Scarto e vendita</button></div>
  <div class="ph"><h2 style="font-size:13px">Rune</h2><span></span></div>
  ${runeTiles()}
  <div class="ph"><h2 style="font-size:13px">Zaino</h2><span${S.inventory.length >= F.bagCap(S) ? ' style="color:#FF8A96"' : ''}>${S.inventory.length}/${F.bagCap(S)}</span></div>
  ${itemGrid(byPower(S.inventory), 'Vuoto. Gli oggetti cadono dai nemici sconfitti.')}
  <div class="ph"><h2 style="font-size:13px">Forziere</h2><span>${S.chest.length}/${F.chestCap(S)}</span></div>
  ${itemGrid(byPower(S.chest), 'Tocca un oggetto dello zaino e premi "Nel forziere" per conservarlo qui.')}`;
}
function runeBar() { return `<div class="runebar">${Object.keys(F.RUNE).map(k => { const r = F.RUNE[k]; return `<span title="${r.label}">${runeImg(k, 16)}<b>${fmt(S.runes[k])}</b></span>`; }).join('')}</div>`; }
// riepilogo di quello che hai comprato e cosa ti dà
function ownedHTML() {
  const rows = [], lab = { gold: 'oro', xp: 'esperienza', drop: 'drop', capture: 'soggiogamento' };
  for (const k of Object.keys(S.pets || {})) { const p = F.PETS[k]; if (!p) continue; const b = p.bonus; rows.push([petHTML(k, 2), p.name, Object.keys(b).filter(x => x !== 'bag' && x !== 'chest').map(x => `+${Math.round(b[x] * 100)}% ${lab[x]}`).concat(`+${b.bag} zaino`, `+${b.chest} forziere`).join(' · ')]); }
  for (const h of F.HERO_SHOP) if (S.roster[h.id]) { const sp = F.SPECIES[h.id]; rows.push([h.id === 'hero_arc' ? ARC_FRONT(30) : h.id === 'hero_mag' ? MAG_SIDE(30) : sprite(h.id, 2), sp.name, `${sp.cls} in squadra, senza occupare posti · +${h.space} zaino · +${h.space} forziere`]); }
  if (F.hasPass(S)) rows.push([ipx('collana', 22), 'Pass Astrale', `×2 oro ed esperienza, zaino e forziere doppi · scade il ${new Date(S.pass).toLocaleDateString('it-IT')}`]);
  if (S.extraBag || S.extraChest) rows.push([icon('bag', '#F2C14E', 20), 'Spazio extra', `+${S.extraBag || 0} zaino · +${S.extraChest || 0} forziere`]);
  if (S.welcomePack) rows.push([icon('gem', '#F49AC1', 20), 'Pacchetto Benvenuto', '500 Astri + un pet']);
  const nb = Object.keys(S.astriBought || {}).length; if (nb) rows.push([icon('gem', '#F49AC1', 20), 'Pacchetti di Astri', `${nb} tipi già comprati (non più doppi)`]);
  return `<div class="ph"><h2 style="font-size:13px">I tuoi acquisti</h2><span>${rows.length}</span></div>
  ${rows.length ? `<div class="card owned">${rows.map(([ic, n, d]) => `<div class="orow"><div class="oic">${ic}</div><div><b>${n}</b><div class="msub">${d}</div></div></div>`).join('')}</div>` : '<div class="note">Non hai ancora comprato nulla.</div>'}`;
}
function pShop() {
  const left = Math.max(0, F.nextMidnight(Date.now()) - Date.now()), h = Math.floor(left / 3600000), mi = Math.floor(left % 3600000 / 60000), ready = F.dailyReady(S);
  return `<div class="ph"><h2>Shop</h2><span>${icon('gem', '#F49AC1', 14)} ${fmt(S.astri)} Astri</span></div>
  <div class="note" style="color:#9BFFB8;text-align:center">Versione di prova: per ora gli acquisti sono gratis, nessun pagamento reale.</div>
  <div class="card daily"><div style="flex:1"><b>Regalo del giorno</b><div class="msub">${ready ? 'Gratis, una volta al giorno.' : `Già riscosso. Il prossimo tra ${h} h ${mi} min.`}</div></div><div class="big">${F.DAILY_ASTRI} ${icon('gem', '#F49AC1', 18)}</div><button class="pb" data-act="daily" ${ready ? '' : 'disabled'}>${ready ? 'Riscuoti' : 'Fatto'}</button></div>
  <div class="ph"><h2 style="font-size:13px">Eroi</h2><span>non occupano posti in squadra</span></div>
  ${F.HERO_SHOP.map(h => { const sp = F.SPECIES[h.id], own = !!S.roster[h.id]; return `<div class="card herocard"><div class="mspr" data-act="preview" data-kind="hero" data-id="${h.id}" role="button" aria-label="Guarda ${sp.name}">${h.id === 'hero_mag' ? '<div class="mg" aria-hidden="true"></div><i class="shopskull" aria-hidden="true"></i>' : h.id === 'hero_arc' ? '<div class="ar" aria-hidden="true"></div><i class="shopheart" aria-hidden="true"></i>' : sprite(h.id, 3)}</div><div style="flex:1"><b>${sp.name}</b><div class="msub"><span style="color:${CC(sp.cls)}">${sp.cls}${sp.tough ? ' robusto' : ''}</span> · ${F.CLASSES[sp.cls].ability}</div>${sp.hbText ? `<div class="msub" style="color:#FFD86B">${sp.hbText}</div>` : ''}<div class="msub" style="color:#9BFFB8">+${h.space} zaino · +${h.space} forziere</div><div class="msub"><i>“${sp.quote}”</i></div></div>${own ? '<span class="zdone">Nella squadra</span>' : `<button class="pb" data-act="buyhero" data-id="${h.id}">${h.price}</button>`}</div>`; }).join('')}
  <div class="ph" id="shop-pet"><h2 style="font-size:13px">Pet</h2><span>non combattono · i bonus si sommano</span></div>
  ${S.welcomePack || !Object.keys(F.PETS).some(k => !F.PETS[k].astri && !(S.pets && S.pets[k])) ? '' : `<div class="card welcome"><b>Pacchetto Benvenuto · 4,99 €</b><div class="msub">500 ${icon('gem', '#F49AC1', 11)} + un pet a scelta · una sola volta</div>
   <div class="wpick">${Object.keys(F.PETS).filter(k => !F.PETS[k].astri && !(S.pets && S.pets[k])).map(k => `<button class="sb" data-act="welcome" data-k="${k}">${petHTML(k, 2)}<span>${F.PETS[k].name}</span></button>`).join('')}</div></div>`}
  ${Object.keys(F.PETS).map(k => { const p = F.PETS[k], own = S.pets && S.pets[k], b = p.bonus, lab = { gold: 'oro', xp: 'esperienza', drop: 'drop', capture: 'soggiogamento' };
    const main = Object.keys(b).filter(x => x !== 'bag' && x !== 'chest').map(x => `+${Math.round(b[x] * 100)}% ${lab[x]}`).join(' · ');
    return `<div class="card petcard${own ? ' own' : ''}"><div class="pspr" data-act="preview" data-kind="pet" data-id="${k}" role="button" aria-label="Guarda ${p.name}">${petHTML(k, 4)}</div><div style="flex:1"><b>${p.name}</b><div class="msub">${main}<br>+${b.bag} zaino · +${b.chest} forziere</div></div>${own ? '<span class="pown">Posseduto</span>' : `<button class="pb" data-act="buypet" data-k="${k}" ${p.astri && S.astri < p.astri ? 'disabled' : ''}>${p.astri ? fmt(p.astri) + ' ' + icon('gem', '#1B1F3B', 11) : p.price + ''}</button>`}</div>`; }).join('')}
  <div class="ph"><h2 style="font-size:13px">Abbonamento</h2></div>
  <div class="card passbig${F.hasPass(S) ? ' on' : ''}"><div class="pbhead"><div class="pbic">${ipx('collana', 44)}</div><div style="flex:1"><b class="pbt">Pass Astrale</b><div class="pbp">${F.PASS_PRICE}</div>${F.hasPass(S) ? `<div class="msub" style="color:#7ED36F">Attivo fino al ${new Date(S.pass).toLocaleDateString('it-IT')}</div>` : ''}</div></div>
   <ul class="pbl"><li><b>×2 oro</b> da ogni nemico</li><li><b>×2 esperienza</b> per tutta la squadra</li><li>Zaino e forziere <b>doppi</b> (${F.bagCap(S) + (F.hasPass(S) ? 0 : 20)} posti)</li><li>Vendita automatica anche dei <b>non comuni</b></li></ul>
   <button class="pb wide" data-act="pass">${F.hasPass(S) ? 'Rinnova' : 'Attiva'}</button>${F.hasPass(S) ? '<button class="sb wide" data-act="passoff" style="margin-top:6px;width:100%">Togli il Pass (prova)</button>' : ''}</div>
  <div class="ph"><h2 style="font-size:13px">Rune</h2><span>si pagano in Astri</span></div>
  <div class="sgrid runes4">${Object.keys(F.RUNE_BUY).map(k => { const r = F.RUNE[k]; return `<div class="card sitem" style="border-color:${r.color}">${runeImg(k, 24)}<b style="color:${r.color}">${r.label.replace('Runa ', '')}</b><span>→ ${F.ITEM_RARITY.find(x => x.key === k).label}</span><span>hai ${fmt(S.runes[k])}</span><button class="pb" data-act="buyrune" data-k="${k}" ${S.astri < F.RUNE_BUY[k] ? 'disabled' : ''}>${F.RUNE_BUY[k]} ${icon('gem', '#1B1F3B', 11)}</button></div>`; }).join('')}</div>
  <div class="ph"><h2 style="font-size:13px">Spazio</h2><span>+${F.SPACE_PACK.n} posti per sempre · max ${F.SPACE_PACK.perMonth} al mese</span></div>
  <div class="sgrid">${[['bag', 'Zaino', 'Posti zaino', F.bagCap(S)], ['chest', 'Forziere', 'Posti forziere', F.chestCap(S)]].map(([k, n, l, cap]) => { const left = F.spaceLeft(S, k); return `<div class="card sitem"><b>+${F.SPACE_PACK.n} ${l.toLowerCase()}</b><span>${n} ora: ${cap} posti</span><span>Questo mese: ancora ${left}</span><button class="pb" data-act="buyspace" data-k="${k}" ${left < 1 || S.astri < F.SPACE_PACK.cost ? 'disabled' : ''}>${left < 1 ? 'Finiti per questo mese' : F.SPACE_PACK.cost + ' Astri'}</button></div>`; }).join('')}</div>
  <div class="ph" id="shop-astri"><h2 style="font-size:13px">Astri</h2><span>la moneta dello Shop</span></div>
  <div class="sgrid astri4">${F.ASTRI_PACKS.map((p, i) => `<div class="card sitem">${icon('gem', '#F49AC1', 26)}<b style="color:#F49AC1">${fmt(p.astri)} Astri</b>${F.astriFirst(S, i) ? '<span class="x2">×2 al primo acquisto</span>' : ''}<span>${p.name}</span><button class="pb" data-act="buyastri" data-i="${i}">${p.price}</button></div>`).join('')}</div>
  <div class="ph" id="shop-oro"><h2 style="font-size:13px">Oro</h2><span>con gli Astri · cresce con la zona più lontana raggiunta</span></div>
  <div class="sgrid gold3">${F.GOLD_PACKS.map((p, i) => `<div class="card sitem">${icon('coin', '#F2C14E', 26)}<b style="color:var(--gold)">${cfmt(F.goldPack(S, i))}</b><span>${p.name}<br>≈ ${p.hours} ore di battaglie</span><button class="pb" data-act="buygold" data-i="${i}" ${S.astri < p.astri ? 'disabled' : ''}>${p.astri} ${icon('gem', '#1B1F3B', 11)}</button></div>`).join('')}</div>
  ${ownedHTML()}
`;
}
function pNegozio() {
  const left = Math.max(0, F.nextRefresh(Date.now()) - Date.now()), h = Math.floor(left / 3600000), mi = Math.floor(left % 3600000 / 60000);
  const sel = selItem && S.inventory.find(x => x.id === selItem);
  const pi = F.protectIdx(S);
  return `<div class="ph"><h2>Mercante</h2><span>merce nuova tra ${h} h ${mi} min</span></div>
  <div class="row2"><div class="card wallet" style="flex:1;margin:0">${icon('gem', '#F49AC1', 16)} <b>${fmt(S.astri)}</b> Astri</div><button class="sb" data-act="reroll" ${S.astri < F.REROLL_COST ? 'disabled' : ''}>Rinnova · ${F.REROLL_COST} Astri</button></div>

  <div class="ph"><h2 style="font-size:13px">Rune</h2><span>tocca per vendere</span></div>
  ${runeTiles()}
  <div class="ph"><h2 style="font-size:13px">In vendita</h2><span>▲ migliora un tuo personaggio</span></div>
  <div class="igrid shopg">${S.shop.items.map((it, i) => { const r = F.ITEM_RARITY.find(x => x.key === it.rarity);
    return `<button class="it${selShop === i ? ' sel' : ''}${it.sold ? ' sold' : F.rarityIndex(r.key) >= 4 ? ' fx fx-' + r.key : ''}" style="border-color:${it.sold ? 'var(--line)' : r.color};--c:${r.color}" data-act="selshop" data-i="${i}" aria-label="${esc(F.itemName(it))}, ${r.label}, ${it.price} Astri">${itemIcon(it.slot, it.cls, r.color, 24)}<b>${cfmt(F.itemPower(it))}</b><em>${it.sold ? 'venduto' : it.price + ' Astri'}</em>${!it.sold && F.isUpgrade(S, it) ? '<i class="upg" title="Migliora qualcuno">▲</i>' : ''}</button>`; }).join('')}</div>
  <div class="note">Tocca un oggetto per vedere i bonus. Cambia merce alle 0, alle 8 e alle 16, con le stesse probabilità dei drop.</div>
  ${(S.sold || []).length ? `<div class="ph"><h2 style="font-size:13px">Riacquista</h2><span>ultimi 10 venduti, allo stesso prezzo</span></div>
  ${S.sold.map((e, i) => { const r = F.ITEM_RARITY.find(x => x.key === e.it.rarity); return `<div class="card srow"><div style="display:flex;align-items:center;gap:8px">${itemIcon(e.it.slot, e.it.cls, r.color, 22)}<div><b class="${r.rainbow ? 'rbw' : ''}" style="color:${r.color}">${esc(F.itemName(e.it))}</b><div class="msub">${r.label} · Lv ${F.itemLevel(e.it)}</div></div></div><button class="sb" data-act="buyback" data-i="${i}" ${S.gold < e.g || S.inventory.length >= F.bagCap(S) ? 'disabled' : ''}>${cfmt(e.g)} oro</button></div>`; }).join('')}` : ''}
`;
}
// guida completa, dalla cosa più importante alla meno importante
const guideOpen = new Set(); // le voci aperte restano aperte anche quando il pannello si ridisegna
document.addEventListener('toggle', e => { const d = e.target; if (d.classList && d.classList.contains('guide')) { const i = +d.dataset.g; if (d.open) guideOpen.add(i); else guideOpen.delete(i); } }, true);
const GUIDE = [
  ['Battaglie e zone', 'La squadra combatte da sola, anche a gioco chiuso. Ogni zona ha 30 battaglie e un boss: sconfiggilo per aprire la zona dopo. Le zone già finite servono per farmare. Se la squadra cade, la zona riparte dalla battaglia 1.'],
  ['Squadra e classi', 'Guerrieri davanti a prendere i colpi, Arcieri, Maghi e Curatori dietro. Ogni classe ha la sua gittata e un\'abilità. Più classi uguali danno un bonus, e con tutte e 4 le classi in squadra hai +8% a tutti. Ogni 5 zone completate si apre un posto in più.'],
  ['Cattura delle creature', 'Ogni nemico sconfitto ha una piccola probabilità di unirsi a te: le creature più rare sono più difficili da prendere ma più forti. Ogni creatura si cattura una sola volta.'],
  ['Equipaggiamento e zaino', 'Gli oggetti cadono dai nemici e finiscono nello Zaino. Il triangolo verde indica che migliora qualcuno della squadra. Con lo zaino pieno gli oggetti nuovi vanno persi, quindi equipaggia e vendi spesso.'],
  ['Livelli e punti', 'Le creature salgono di livello combattendo (solo chi è vivo prende esperienza). A ogni livello hai punti da assegnare a danni, vita, difesa o critico nella scheda del personaggio.'],
  ['Costellazioni', 'Con l\'oro accendi le stelle: bonus permanenti per tutta la squadra, anche più tempo offline. Ogni stella costa più della precedente: un terzo basta per finire il gioco, le altre sono per chi continua a farmare.'],
  ['Gioco offline', 'Quando chiudi il gioco la squadra continua a combattere fino a 6 ore (fino a 10 con le stelle). Al ritorno vedi il riepilogo di oro, oggetti e catture.'],
  ['Rarità, rune e Mercante', 'Gli oggetti vanno da Comune a Segreto. Con le rune puoi alzare la rarità di un oggetto, con le pietre rimescolarne i bonus. Al Mercante vendi gli oggetti e compri rune e oggetti.'],
  ['Scarto automatico e protezioni', 'Puoi far vendere da solo gli oggetti comuni (dalla zona 10, subito col Pass) e i non comuni (col Pass). Blocca gli oggetti che vuoi tenere e spunta le rarità da non vendere mai.'],
  ['Boss segreti', 'Molto di rado al posto del boss di zona compare la sua versione gigante: se la sconfiggi si unisce subito a te, più forte del 30%.'],
  ['Portale astrale', 'Ogni 2-3 giorni compare un portale sopra la battaglia: 3 ondate più forti, forzieri d\'oro e di Astri e il Guardiano del pianeta, che ogni tanto si cattura.'],
  ['Bestiario e missioni', 'Dalla Mappa apri il Bestiario: tutte le creature, dove trovarle e le missioni per ognuna. Sconfiggendone tante ricevi Astri e rune.'],
  ['Velocità di movimento', 'Stivali e gambali (e alcuni bonus) fanno camminare la squadra più in fretta: battaglie più veloci, farm più rapido.'],
  ['Astri e potenziamenti', 'Gli Astri si guadagnano col regalo giornaliero, gli achievement, le missioni, il portale e vendendo le rune. Servono a potenziare gli slot dell\'equipaggiamento e nello Shop.'],
  ['Shop, eroi e pet', 'Nello Shop trovi eroi con talenti propri, pet che volano sopra la squadra con bonus cumulabili, il Pass Astrale (oro ed esperienza doppi, zaino più grande) e pacchetti di Astri e oro.'],
  ['Achievement, classifica e chat', 'Gli achievement danno Astri. In Stats trovi le tue statistiche, il contributo di ogni membro e la classifica; la chat è in alto a destra.'],
];
function pImpost() {
  return `<div class="ph"><h2>Guida al gioco</h2></div>
  <div class="note">Tutte le funzioni del gioco, dalla più importante. Tocca per leggere.</div>
  ${GUIDE.map(([t, d], i) => `<details class="card guide" data-g="${i}"${guideOpen.has(i) ? ' open' : ''}><summary><b>${i + 1}. ${t}</b></summary><div class="msub">${d}</div></details>`).join('')}
  <div class="ph"><h2>Impostazioni</h2></div>
  <button class="sb" data-act="tutshow" style="width:100%;margin-bottom:6px">Rivedi il tutorial</button>
  <label class="tg"><input type="checkbox" data-act="sound" ${S.settings.sound !== false ? 'checked' : ''}> Suoni</label>
  <div class="row2"><label for="vol">Volume</label><input id="vol" type="range" min="0" max="1" step="0.1" value="${S.settings.volume ?? 0.5}" data-act="vol" style="flex:1"></div>
  <div class="ph"><h2>Strumenti di test</h2></div>
  <div class="tgrow"><label class="tg"><input type="checkbox" data-act="tfast" ${S.settings.tFast ? 'checked' : ''}> Velocità ×10</label><label class="tg"><input type="checkbox" data-act="tcap" ${S.settings.tCap ? 'checked' : ''}> Cattura ×10</label></div>
  <div class="note">Fa avanzare il gioco come se fosse passato questo tempo (senza il limite di ore offline).</div>
  <div class="skips">${[[1, '1 h'], [6, '6 h'], [12, '12 h'], [24, '1 g'], [168, '7 g']].map(([h, l]) => `<button class="sb" data-act="skip" data-h="${h}">+${l}</button>`).join('')}</div>
  <div class="note">Aggiungi risorse per provare il gioco.</div>
  <div class="skips">${[[1e4, '10K'], [1e6, '1M'], [1e8, '100M'], [1e10, '10B']].map(([v, l]) => `<button class="sb" data-act="givegold" data-v="${v}">${icon('coin', '#F2C14E', 12)} +${l}</button>`).join('')}</div>
  <div class="skips">${[100, 1000, 10000].map(v => `<button class="sb" data-act="giveastri" data-v="${v}">${icon('gem', '#F49AC1', 12)} +${fmt(v)}</button>`).join('')}</div>
  <form class="giveform row2"><input id="givev" type="number" min="1" inputmode="numeric" placeholder="Cifra a scelta" aria-label="Cifra"><button class="sb" type="submit" data-give="gold">Oro</button><button class="sb" type="submit" data-give="astri">Astri</button></form>
  <div class="note">Portale astrale: di solito si apre una volta ogni 2-3 giorni.</div>
  <button class="sb" data-act="spawnportal" style="width:100%" ${S.portal || S.portalRun ? 'disabled' : ''}>${S.portalRun ? 'Sei già nel portale' : S.portal ? 'Il portale è già aperto' : 'Fai comparire il portale'}</button>
  <div class="note">Account pronto per un'area: livelli, equipaggiamento e costellazioni giusti per battere quella zona (come un giocatore normale in quel momento). Sostituisce equipaggiamento e costellazioni.</div>
  <div class="tzgrid">${[5, 10, 15, 20].map(z => `<button class="sb" data-act="testacc" data-k="${z}">Zona ${z}</button>`).join('')}</div>
  <button class="sb" data-act="testacc" data-k="full" style="width:100%;margin-top:6px">Tutto completo (massimo di tutto)</button>
  <button class="sb" data-act="testcap" style="width:100%;margin-top:6px">Mostra la finestra di cattura</button>
  <div class="ph"><h2>Salvataggio</h2></div>
  <div class="note">Il salvataggio resta in questo browser. Versione del gioco: <b>/*BUILD*/</b></div>
  <button class="sb wide danger" data-act="reset">${confirmReset > Date.now() ? 'Tocca di nuovo: cancella tutto' : 'Ricomincia da zero'}</button>`;
}
function pBestiario() {
  const n = F.capturedCount(S), tot = F.ALL_SPECIES.length, ready = F.missionsReady(S);
  return `<button class="sb" data-tab="mappa" style="margin-bottom:6px">← Mappa</button><div class="ph"><h2>Bestiario</h2><span>${n}/${tot}${ready ? ` · <b style="color:var(--gold)">${ready} missioni da riscuotere</b>` : ''}</span></div>
  <div class="bar"><b style="width:${100 * n / tot}%"></b></div>
  <div class="note">Ogni creatura si cattura una sola volta. Quelle già incontrate si vedono a colori, il nome si scopre con la cattura. Torna nella zona indicata per cercare quelle che mancano.</div>
  ${F.PLANETS.map(pl => `<div class="ph"><h2 style="font-size:13px">${pl.name}</h2><span>${pl.species.filter(k => S.roster[k]).length}/${pl.species.length} · zone ${pl.zones[0]}-${pl.zones[1]}</span></div>
  <div class="bgrid">${pl.species.map(k => { const sp = F.SPECIES[k], m = S.roster[k], rar = F.RARITY[sp.rarity].label, z = F.zoneOf(k);
    const mis = missionHTML(k);
    if (m) return `<div class="card best"><div class="bspr">${sprite(k, 3)}</div><b>${esc(m.name)}</b><span style="color:${CC(sp.cls)}">${sp.cls}${sp.tough ? ' robusto' : ''}</span><em>${rarTag(k)}</em><small>Zona ${z} · dopo ${fmt(m.waitKills)} incontri</small>${mis}</div>`;
    return `<div class="card best"><div class="bspr">${sprite(k, 3, (S.seen && S.seen[k]) || (S.kills && S.kills[k]) ? undefined : { sil: true })}</div><b>???</b><span>&nbsp;</span><em>${rar}</em><small>${z <= S.maxZone ? 'Zona ' + z + ' · incontri ' + fmt(S.hunt[k] || 0) : 'Zona ' + z + ' (bloccata)'}</small>${mis}</div>`; }).join('')}</div>`).join('')}
  ${secretHTML()}${portalHTML()}`;
}


function showPortal() {
  if (!S.portal || S.portalRun) return;
  const g = F.SPECIES[F.portalGuardian(S)], h = Math.max(0, (S.portal.until - (S.clock || 0)) / 3600);
  $('#modal').innerHTML = `<div class="mod" role="dialog" aria-modal="true" aria-label="Portale astrale"><div class="eqhead"><h2 style="margin:0;font-size:18px;color:#C9A8FF">Portale astrale</h2><button class="ib" data-act="close" aria-label="Chiudi" style="margin-left:auto">✕</button></div>
    <div class="pvbig"><div class="pvortex"></div></div>
    <div class="note">Dall'altra parte ti aspettano <b>${F.PORTAL_WAVES} ondate</b> di creature più forti della tua zona migliore e, alla fine, il <b style="color:#C9A8FF">${g.name}</b>.</div>
    <div class="stbox"><div class="srow2"><span>Oro</span><b>×8 per ogni nemico</b></div><div class="srow2"><span>Se vinci</span><b>+${F.PORTAL_ASTRI} Astri e 1 runa epica</b></div><div class="srow2"><span>Cattura del Guardiano</span><b>5%</b></div></div>
    <div class="msub">La campagna resta ferma dove sei. Se la squadra cade, il portale si chiude ma tieni l'oro. Resta aperto ancora ${h >= 1 ? Math.floor(h) + ' ore' : Math.ceil(h * 60) + ' minuti'}.</div>
    <div class="row2" style="margin-top:10px"><button class="pb" style="flex:1" data-act="enterportal">Entra nel portale</button><button class="sb" data-act="close">Più tardi</button></div></div>`;
  $('#modal').hidden = false;
}
function portalHTML() {
  const L = F.PORTAL_SPECIES, n = L.filter(k => S.roster[k]).length;
  return `<div class="ph"><h2 style="font-size:13px;color:#C9A8FF">Guardiani del portale</h2><span>${n}/${L.length}</span></div>
  <div class="note">Ogni tanto si apre un portale astrale: alla fine c'è il Guardiano del tuo pianeta, che si unisce a te nel 5% dei casi, più forte del 25%.</div>
  <div class="bgrid">${L.map(k => { const sp = F.SPECIES[k], m = S.roster[k], seen = (S.seen && S.seen[k]) || (S.kills && S.kills[k]);
    return `<div class="card best"><div class="bspr astral">${sprite(k, 3, m || seen ? undefined : { sil: true })}</div><b>${m ? esc(m.name) : '???'}</b><span style="color:${CC(sp.cls)}">${m ? sp.cls : '&nbsp;'}</span><em style="color:#C9A8FF">Portale</em><small>${m ? 'Catturato' : seen ? 'Incontrato' : 'Mai visto'}</small></div>`; }).join('')}</div>`;
}
function secretHTML() {
  const L = F.SECRET_SPECIES, n = L.filter(k => S.roster[k]).length;
  return `<div class="ph"><h2 style="font-size:13px" class="rbw">Boss segreti</h2><span>${n}/${L.length}</span></div>
  <div class="note">Molto di rado, al posto del boss di zona compare la sua versione gigante. Se lo sconfiggi si unisce subito alla squadra, più forte del ${Math.round((F.SECRET_MULT - 1) * 100)}%.</div>
  <div class="bgrid">${L.map(k => { const sp = F.SPECIES[k], m = S.roster[k], z = F.zoneOf(k);
    return m ? `<div class="card best sec"><div class="bspr">${sprite(k, 3)}</div><b>${esc(m.name)}</b><span style="color:${CC(sp.cls)}">${sp.cls}${sp.tough ? ' robusto' : ''}</span><em class="rbw">Segreto</em><small>Zona ${z}</small></div>`
      : `<div class="card best"><div class="bspr">${sprite(k, 3, (S.seen && S.seen[k]) || (S.kills && S.kills[k]) ? undefined : { sil: true })}</div><b>???</b><span>&nbsp;</span><em>Segreto</em><small>Zona ${z}</small></div>`; }).join('')}</div>`;
}
function missionHTML(k) {
  const t = F.missionTier(S, k), kills = (S.kills && S.kills[k]) || 0;
  const stars = [0, 1, 2].map(i => `<i class="${i < t ? 'on' : ''}"></i>`).join('');
  if (t >= 3) return `<div class="mis"><div class="mstars">${stars}</div><span class="mdone">Missioni completate</span></div>`;
  const goal = F.missionGoal(k, t), r = F.missionReward(k, t), rr = F.RUNE[r.rune[0]], ready = kills >= goal;
  return `<div class="mis"><div class="mstars">${stars}</div><span>Sconfiggi ${fmt(Math.min(kills, goal))}/${fmt(goal)}</span><div class="bar"><b style="width:${Math.min(100, 100 * kills / goal)}%"></b></div>
    <span class="mrew">${r.astri} ${icon('gem', '#F49AC1', 10)} 1 ${runeImg(r.rune[0], 12)}</span>
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
  const mr = F.missionsReady(S);
  return `<button class="sb wide bestbtn${mr ? ' dot' : ''}" data-tab="bestiario" style="width:100%;margin-bottom:8px">Bestiario · ${F.capturedCount(S)}/${F.ALL_SPECIES.length} creature${mr ? ` · <b style="color:var(--gold)">${mr} missioni</b>` : ''}</button>
  <div class="ph"><h2>Mappa</h2><span>zone completate ${S.cleared}/${F.MAX_ZONE}</span></div>
  ${F.PLANETS.map((pl, pi) => `<div class="planetmap p${pi}"><div class="pmhead"><span class="pmglobe g${pi}"></span><b>${pl.name}</b></div>
   <svg class="path" viewBox="0 0 100 500" preserveAspectRatio="none" aria-hidden="true"><path d="M28 40 C 90 90, 90 110, 72 140 S 10 200, 28 240 S 90 300, 72 340 S 10 400, 28 440" fill="none" stroke="#6B7BD1" stroke-width="1.2" stroke-dasharray="3 3" vector-effect="non-scaling-stroke"/></svg>
   ${Array.from({ length: pl.zones[1] - pl.zones[0] + 1 }, (_, i) => isl(pl.zones[0] + i, i, pi)).join('')}</div>`).join('')}`;
}
let selStar = 0, skyView = { x: 0, y: 0, k: 34 }, skyDrag = false;
const fmtPct = (k, v) => k === 'bag' || k === 'chest' ? '+' + v : k === 'offline' ? '+' + Math.round(v / 60) + ' min' : '+' + (v * 100).toFixed(1).replace('.', ',') + '%';
function skySVG() {
  const own = new Set(F.skyOwned(S)), W = 360, H = 360, k = skyView.k, P = o => [W / 2 + (o.x - skyView.x) * k, H / 2 + (o.y - skyView.y) * k];
  let g = '';
  for (let r = 1; r < F.SKY_GATES.length; r++) if (F.SKY_GATES[r] !== F.SKY_GATES[r - 1]) { const c = P({ x: 0, y: 0 }), lock = !F.skyRingOpen(S, r); g += `<circle cx="${c[0]}" cy="${c[1]}" r="${(r - 0.5) * k}" fill="none" stroke="${lock ? '#F2C14E88' : '#ffffff22'}" stroke-dasharray="${lock ? '5 5' : '0'}"/>${lock ? `<text x="${c[0]}" y="${c[1] - (r - 0.5) * k - 4}" text-anchor="middle" font-size="11" fill="#F2C14E">🔒 boss zona ${F.SKY_GATES[r]}</text>` : ''}`; }
  for (const o of F.SKY) for (const a of o.adj) if (a > o.id) { const q = F.SKY[a], [x1, y1] = P(o), [x2, y2] = P(q), on = own.has(o.id) && own.has(a); g += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${on ? '#F2C14E' : '#3a4382'}" stroke-width="${on ? 2 : 1}" opacity="${F.skyRingOpen(S, Math.max(o.r, q.r)) ? 1 : .35}"/>`; }
  const d = Math.max(4, Math.min(14, k * 0.3));
  for (const o of F.SKY) { const [x, y] = P(o); if (x < -20 || y < -20 || x > W + 20 || y > H + 20) continue;
    if (!o.r) { g += `<circle cx="${x}" cy="${y}" r="${d * 1.5}" fill="#F2C14E"/><text x="${x}" y="${y + d * 0.55}" text-anchor="middle" font-size="${d * 1.5}" fill="#1B1F3B">★</text>`; continue; }
    const col = o.special ? '#FFFFFF' : F.SKY_SECTORS[o.sec].color, on = own.has(o.id), can = F.skyCanBuy(S, o.id), open = F.skyRingOpen(S, o.r), rr = o.special ? d * 1.35 : d;
    g += `<g data-node="${o.id}"><circle cx="${x}" cy="${y}" r="${rr + 6}" fill="transparent"/><circle cx="${x}" cy="${y}" r="${rr}" fill="${on ? col : '#141a46'}" stroke="${selStar === o.id ? '#fff' : col}" stroke-width="${selStar === o.id ? 3 : on ? 0 : 1.5}" opacity="${open ? (on || can ? 1 : .55) : .25}" ${on ? `style="filter:drop-shadow(0 0 ${d * .6}px ${col})"` : ''}/>${k > 26 && open ? `<text x="${x}" y="${y + rr * 0.4}" text-anchor="middle" font-size="${rr * 1.1}" fill="${on ? '#1B1F3B' : col}" pointer-events="none">${o.ic}</text>` : ''}${can && !on ? `<circle cx="${x}" cy="${y}" r="${rr + 3}" fill="none" stroke="${col}" stroke-width="1" opacity=".7" class="skypulse"/>` : ''}</g>`; }
  return `<svg id="skysvg" viewBox="0 0 ${W} ${H}" width="100%" style="display:block;touch-action:none">${g}</svg>`;
}
function pStelle() {
  const o = F.SKY[selStar] || F.SKY[0], own = F.skyOwned(S).includes(o.id), can = F.skyCanBuy(S, o.id), open = F.skyRingOpen(S, o.r);
  const tot = F.tb(S), sec = o.sec >= 0 ? F.SKY_SECTORS[o.sec] : null, col = o.special ? '#FFFFFF' : sec ? sec.color : '#F2C14E';
  const det = !o.r ? `<b style="color:#F2C14E">★ Stella madre</b><div class="msub">Da qui partono tutti i percorsi: tocca una stella vicina accesa a metà per accenderla.</div>`
    : `<b style="color:${col}">${o.ic} ${o.label}</b> <span class="lvl">${fmtPct(o.kind, o.v)}</span><div class="msub">Anello ${o.r}${sec && !o.special ? ' · ' + sec.name : ' · speciale'}</div><div class="msub" style="color:${own ? '#7ED36F' : !open ? '#F2C14E' : can ? '#7ED36F' : '#FF8A96'}">${own ? 'Accesa' : !open ? 'Anello chiuso: completa la zona ' + F.SKY_GATES[o.r] : can ? 'Collegata a una stella accesa' : 'Non ancora collegata: accendi prima una stella vicina'}</div>`;
  const sums = Object.keys(tot).filter(k => tot[k]).map(k => { const lab = { atk: 'Danni', hp: 'Vita', def: 'Difesa', crit: 'Critico', critDmg: 'Danni critici', aspd: "Vel. d'attacco", block: 'Blocco', dodge: 'Schivata', gold: 'Oro', sell: 'Vendita', xp: 'Esperienza', drop: 'Drop', capture: 'Cattura', heal: 'Cure', bag: 'Zaino', chest: 'Forziere', offline: 'Offline', move: 'Marcia' }[k] || k; return `<span>${lab} <b>${fmtPct(k, tot[k])}</b></span>`; }).join('');
  return `<div class="ph"><h2>Costellazioni</h2><span>${icon('coin', '#F2C14E', 14)} ${cfmt(S.gold)} oro · ${F.skyOwned(S).length - 1}/${F.SKY.length - 1}</span></div>
  <div class="card sdet">${o.r ? `<div style="flex:1">${det}</div><button class="pb" data-act="skybuy" data-id="${o.id}" ${own || !can || S.gold < F.skyCost(S, o.id) ? 'disabled' : ''}>${own ? 'Accesa' : `Accendi<br><small>${cfmt(F.skyCost(S, o.id))} oro</small>`}</button>` : `<div style="flex:1">${det}</div>`}</div>
  <div class="skywrap" id="skywrap">${skySVG()}<div class="skyzoom"><button class="ib" data-act="skyzoom" data-z="1.4" aria-label="Ingrandisci">＋</button><button class="ib" data-act="skyzoom" data-z="0.7" aria-label="Rimpicciolisci">－</button><button class="ib" data-act="skycenter" aria-label="Centra">◎</button></div></div>
  <div class="legend">${F.SKY_SECTORS.map(x => `<span><i style="background:${x.color}"></i>${x.name}</span>`).join('')}<span><i style="background:#fff"></i>Speciali</span></div>
  ${sums ? `<div class="card skysum">${sums}</div>` : ''}
  <div class="note">Trascina per muoverti, pizzica o usa ＋/－ per ingrandire. Ogni stella accende la successiva: scegli tu il percorso. Gli anelli esterni si aprono battendo i boss.</div>
  <button class="sb wide" data-act="treereset">${confirmTree > Date.now() ? 'Tocca di nuovo per confermare' : 'Ridistribuisci tutte le stelle (rimborso completo)'}</button>`;
}
// trascinamento e pizzico sulla mappa
(() => {
  const pts = new Map(); let start = null, moved = 0;
  const svgUpdate = () => { const w = $('#skywrap'); if (!w) return; const old = $('#skysvg'); if (old) old.outerHTML = skySVG(); };
  document.addEventListener('pointerdown', e => { if (!e.target.closest('#skysvg')) return; pts.set(e.pointerId, { x: e.clientX, y: e.clientY }); skyDrag = true; moved = 0; start = { v: Object.assign({}, skyView), pts: new Map(pts), node: e.target.closest('[data-node]') }; });
  document.addEventListener('pointermove', e => { if (!pts.has(e.pointerId) || !start) return; pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const svg = $('#skysvg'); if (!svg) return; const sc = 360 / svg.getBoundingClientRect().width;
    if (pts.size === 1) { const p0 = start.pts.get(e.pointerId); if (!p0) return; const dx = (e.clientX - p0.x) * sc, dy = (e.clientY - p0.y) * sc; moved = Math.max(moved, Math.abs(dx) + Math.abs(dy)); skyView.x = start.v.x - dx / skyView.k; skyView.y = start.v.y - dy / skyView.k; }
    else if (pts.size === 2) { const [a, b] = [...pts.values()], [a0, b0] = [...start.pts.values()]; if (!a0 || !b0) { start.pts = new Map(pts); start.v = Object.assign({}, skyView); return; } const d = Math.hypot(a.x - b.x, a.y - b.y), d0 = Math.hypot(a0.x - b0.x, a0.y - b0.y) || 1; skyView.k = Math.max(10, Math.min(90, start.v.k * d / d0)); moved = 99; }
    svgUpdate(); });
  const end = e => { if (!pts.has(e.pointerId)) return; pts.delete(e.pointerId);
    if (!pts.size) { skyDrag = false; if (moved < 8 && start && start.node) { selStar = +start.node.dataset.node; render(); } start = null; } else { start = { v: Object.assign({}, skyView), pts: new Map(pts) }; } };
  document.addEventListener('pointerup', end); document.addEventListener('pointercancel', end);
  document.addEventListener('wheel', e => { if (!e.target.closest('#skysvg')) return; e.preventDefault(); skyView.k = Math.max(10, Math.min(90, skyView.k * (e.deltaY < 0 ? 1.15 : 0.87))); svgUpdate(); }, { passive: false });
})();
function dur(sec) { const d = Math.floor(sec / 86400), h = Math.floor(sec % 86400 / 3600), m = Math.floor(sec % 3600 / 60); return d ? `${d} g ${h} h` : `${h} h ${m} min`; }
function pAltro() {
  const st = S.stats, h = Math.floor(st.played / 3600), mi = Math.floor(st.played % 3600 / 60);
  const RL = S.rareLog || [], when = t => { const d = Date.now() - t; return d < 3600000 ? Math.max(1, Math.round(d / 60000)) + ' min fa' : d < 86400000 ? Math.round(d / 3600000) + ' h fa' : Math.round(d / 86400000) + ' g fa'; };
  const rare = `<div class="ph"><h2>Drop rari</h2><span>Astrale · Arcano · Eterno · Segreto</span></div>
  <div class="note">Le rarità più alte (Astrale, Arcano, Eterno, Segreto) possono cadere da qualsiasi nemico, in ogni zona, con la stessa probabilità. Qui trovi i tuoi; quando ci sarà la chat globale vedrai anche quelli degli altri giocatori.</div>
  <div class="chips">${F.RARE_FEED.map(k => { const r = F.ITEM_RARITY.find(x => x.key === k); return `<span class="chip"><i style="background:${r.color}"></i><span class="${r.rainbow ? 'rbw' : ''}" style="color:${r.color}">${r.label}</span> <em>${(st.rare && st.rare[k]) || 0}</em></span>`; }).join('')}</div>
  ${RL.slice(0, 10).map(e => { const r = F.ITEM_RARITY.find(x => x.key === e.rarity); return `<div class="card feed">${itemIcon(e.slot, null, r.color, 20)}<div style="flex:1"><b class="${r.rainbow ? 'rbw' : ''}" style="color:${r.color}">${r.label}</b> · ${F.SLOT_LABEL[e.slot]} · Lv ${e.lvl || Math.max(1, Math.ceil((e.ilvl || 1) / 30))}<div class="msub">Zona ${e.zone} · ${when(e.t)}</div></div></div>`; }).join('') || '<div class="note">Nessuno ancora. Buona fortuna!</div>'}`;
  return `<div class="ph"><h2>Statistiche</h2></div>
  <div class="sgrid">
   <div><span>Nemici sconfitti</span><b>${fmt(st.kills)}</b></div><div><span>Oro totale</span><b>${cfmt(st.gold)}</b></div>
   <div><span>Vittorie / sconfitte</span><b>${fmt(st.wins)} / ${fmt(st.losses)}</b></div><div><span>Oggetti trovati</span><b>${fmt(st.items)}</b></div>
   <div><span>Catture</span><b>${F.capturedCount(S)}/${F.ALL_SPECIES.length}</b></div><div><span>Tempo con il gioco aperto</span><b>${h} h ${mi} min</b></div>
   <div><span>Tempo offline</span><b>${dur(st.offline || 0)}</b></div><div><span>Tempo totale di gioco</span><b>${dur(st.played + (st.offline || 0))}</b></div>
  </div>
  ${dmgHTML()}
  ${rare}
  <div class="card"><div class="msub">Nemici sconfitti al minuto, ultimi 30 minuti</div><canvas id="chart" width="680" height="220" role="img" aria-label="Grafico dei nemici sconfitti al minuto"></canvas></div>
  <div class="ph"><h2>Achievement</h2><span>${Object.keys(S.ach).length}/${F.ACH.length}</span></div>
  ${F.ACH.map(a => `<div class="card arow${S.ach[a.id] ? ' done' : ''}">${S.ach[a.id] ? icon('check', '#7ED36F', 20) : icon('lock', '#7C84BC', 20)}<div><b>${a.name}</b><div class="msub">${a.desc} · +${a.astri} Astri</div></div></div>`).join('')}
`;
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
// Tendina con i bonus: si apre sotto l'oggetto toccato
function popContent() {
  if (tab === 'zaino' || tab === 'negozio') {
    if (selRune) return [runeDetail(selRune), `[data-act=selrune][data-k="${selRune}"]`];
    if (selItem) { const b = S.inventory.find(x => x.id === selItem), c = S.chest.find(x => x.id === selItem);
      if (b) return [itemDetail(b, tab === 'negozio' ? 'shop' : 'bag'), `[data-act=selit][data-item="${selItem}"]`];
      if (c && tab === 'zaino') return [itemDetail(c, 'chest'), `[data-act=selit][data-item="${selItem}"]`]; }
    if (tab === 'negozio' && selShop !== null) return [wareDetail(), `[data-act=selshop][data-i="${selShop}"]`];
  }
  return null;
}
function placePop() {
  const pc = popContent(); if (!pc) { popKey = null; return; }
  const p = $('#panel'), anc = p.querySelector(pc[1]); if (!anc) return;
  const d = document.createElement('div'); d.className = 'pop'; d.innerHTML = pc[0]; p.appendChild(d);
  const pr = p.getBoundingClientRect(), ar = anc.getBoundingClientRect();
  const top = ar.bottom - pr.top + p.scrollTop + 6, ax = ar.left + ar.width / 2 - pr.left;
  let lx = 8; // gli oggetti si aprono in un riquadro piccolo vicino all'oggetto, non a tutta larghezza
  if (pc[1].includes('selit')) { const w = Math.min(268, pr.width - 16); d.classList.add('mini'); d.style.width = w + 'px'; lx = Math.max(8, Math.min(pr.width - w - 8, ax - w / 2)); d.style.left = lx + 'px'; }
  d.style.top = top + 'px'; d.style.setProperty('--ax', (Math.max(14, Math.min(pr.width - 14, ax)) - lx + 8) + 'px');
  // se esce dal fondo, la apre sopra l'oggetto
  if ((selRune && pc[1].includes('selrune') && ar.top - pr.top + p.scrollTop > d.offsetHeight + 10) || (top + d.offsetHeight > p.scrollTop + p.clientHeight && ar.top - pr.top > d.offsetHeight + 10)) { d.style.top = (ar.top - pr.top + p.scrollTop - d.offsetHeight - 6) + 'px'; d.classList.add('up'); }
  // appena aperta, scorre quanto basta per mostrarla tutta
  if (popKey !== pc[1]) { popKey = pc[1]; const b = d.offsetTop + d.offsetHeight + 8 - (p.scrollTop + p.clientHeight); if (b > 0) p.scrollTop += b; if (d.offsetTop < p.scrollTop) p.scrollTop = d.offsetTop - 8; }
}
let popKey = null, scrollAt = 0, touching = false; // non ridisegnare mentre si scorre o si tocca il pannello
setTimeout(() => { const p = $('#panel'); if (!p) return; p.addEventListener('scroll', () => { scrollAt = performance.now(); }, { passive: true }); p.addEventListener('touchstart', () => { touching = true; }, { passive: true }); p.addEventListener('touchend', () => { touching = false; scrollAt = performance.now(); }, { passive: true }); }, 0);
function render() {
  applyBig();
  const p = $('#panel');
  const y = p.scrollTop;
  p.innerHTML = tab === 'squadra' ? pSquadra() : tab === 'zaino' ? pZaino() : tab === 'negozio' ? pNegozio() : tab === 'shop' ? pShop() : tab === 'mappa' ? pMappa() : tab === 'bestiario' ? pBestiario() : tab === 'stelle' ? pStelle() : tab === 'impost' ? pImpost() : pAltro();
  placePop(); p.scrollTop = y; // prima il riquadro (allunga la pagina), poi la posizione: niente salti verso l'alto
  if (tab === 'altro') drawChart();
  document.querySelectorAll('.tab').forEach(t => t.setAttribute('aria-current', t.dataset.tab === tab || (tab === 'bestiario' && t.dataset.tab === 'mappa') ? 'page' : 'false'));
  dirty = false;
}

// ---------- modali ----------
function showCapture(sp) {
  const m = S.roster[sp], d = F.SPECIES[sp], cls = d.cls, inTeam = S.team.includes(sp);
  const RC = { comune: '#A9B0D6', noncomune: '#6CCB5F', rara: '#5B9BFF', boss: '#F2C14E', segreto: '#FF7AD9' }, col = RC[d.rarity] || '#F2C14E';
  const sparks = Array.from({ length: 14 }, (_, i) => `<i style="--a:${i * 360 / 14}deg;--d:${(i % 4) * 0.18}s;--r:${70 + (i % 3) * 22}px"></i>`).join('');
  const m$ = $('#modal'); m$.classList.add('capfull');
  m$.innerHTML = `<div class="capx" role="dialog" aria-modal="true" aria-labelledby="capname" style="--c:${col}">
   <button class="capskip" data-act="capskip">Salta tutto${capQueue.length ? ` (${capQueue.length + 1})` : ''} ✕</button>
   <div class="capkick${d.secret ? ' rbw' : ''}">${d.secret ? 'BOSS SEGRETO CATTURATO!' : 'NUOVA CREATURA!'}</div>
   <div class="capstage"><div class="caprays"></div><div class="capglow"></div><div class="capsparks">${sparks}</div><div class="capmon"><div class="bob">${sprite(sp, 10)}</div></div><div class="capshadow"></div></div>
   <h2 id="capname" class="capname">${esc(m.name)}</h2>
   <div class="badges"><span class="rb${d.secret ? ' rbw' : ''}" style="background:${col};color:#141836">${F.RARITY[d.rarity].label}</span><span class="cb" style="background:${CC(cls)}">${cls}${d.tough ? ' robusto' : ''}</span></div>
   ${d.secret ? `<div class="capwait"><b class="rbw">+${Math.round((F.SECRET_MULT - 1) * 100)}%</b><span>vita, attacco e difesa</span></div>` : `<div class="capwait"><b>${fmt(m.waitKills)}</b><span>incontri prima di catturarla</span></div>`}
   <p class="quote">«${esc(d.quote)}»</p>
   <div class="capinfo"><span>${F.planetOf(F.zoneOf(sp)).name}</span><span style="color:${CC(cls)}">${F.CLASSES[cls].ability}</span>${d.tough ? `<span>vita e difesa ×${F.TOUGH.hp}</span>` : ''}</div>
   ${inTeam ? '<div class="note" style="text-align:center">È già entrata in squadra.</div>' : `<button class="pb wide" data-act="capadd" data-id="${sp}" ${F.teamFull(S) ? 'disabled' : ''}>${F.teamFull(S) ? 'Squadra piena: resta in riserva' : 'Metti in squadra'}</button>`}
   <button class="sb wide" data-act="close" style="margin-top:6px">Continua</button>
  </div>`;
  m$.hidden = false;
}
// stima di quanti oggetti persi si sarebbero salvati col Pass (scarto anche dei non comuni + 20 posti in più)
function passSaved(r) {
  if (F.hasPass(S) || !r.lost || !r.byRar) return 0;
  const idx = k => F.ITEM_RARITY.findIndex(x => x.key === k), keep = F.minKeep(S);
  const cand = th => Object.keys(r.byRar).reduce((t, k) => t + (idx(k) >= th ? r.byRar[k] : 0), 0);
  const used = cand(keep) - r.lost, lostPass = Math.max(0, cand(Math.max(keep, F.PASS_MAX_FILTER)) - (used + 20));
  return Math.max(0, r.lost - lostPass);
}
// lista degli oggetti arrivati nello zaino mentre eri via (i migliori in alto)
function foundListHTML(r) {
  if (r.since === undefined) return '';
  const list = S.inventory.concat(S.chest).filter(it => it.id >= r.since).sort((a, b) => F.rarityIndex(b.rarity) - F.rarityIndex(a.rarity) || F.itemPower(b) - F.itemPower(a));
  if (!list.length) return '';
  return `<div class="flhead">${list.length} oggetti raccolti</div><div class="flist">${list.slice(0, 40).map(it => { const ra = F.ITEM_RARITY.find(x => x.key === it.rarity);
    return `<div class="frow" style="--c:${ra.color}">${itemIcon(it.slot, it.cls, ra.color, 24)}<div class="fmid"><b class="${ra.rainbow ? 'rbw' : ''}" style="color:${ra.color}">${esc(F.itemName(it))}</b><span>Lv ${F.itemLevel(it)} · ${F.SLOT_LABEL[it.slot]}${it.cls ? ' · ' + it.cls : ''}</span></div>${F.isUpgrade(S, it) ? '<i class="upgs">▲</i>' : ''}<em style="color:${ra.color}">${ra.label}</em></div>`; }).join('')}</div>`;
}
// il riepilogo resta salvato finché non si preme Raccogli: se esci e rientri si somma a quello nuovo
function showOffline(r) {
  const o = S.offRep || (S.offRep = { seconds: 0, kills: 0, gold: 0, items: 0, byRar: {}, runes: {}, levels: [], lost: 0, caps: [], since: r.since });
  o.seconds += r.seconds || 0; o.kills += r.kills || 0; o.gold += r.gold || 0; o.items += r.items || 0; o.lost += r.lost || 0; o.skip = !!r.skip;
  if (r.since !== undefined) o.since = o.since === undefined ? r.since : Math.min(o.since, r.since);
  for (const k in r.byRar || {}) o.byRar[k] = (o.byRar[k] || 0) + r.byRar[k];
  for (const k in r.runes || {}) o.runes[k] = (o.runes[k] || 0) + r.runes[k];
  for (const l of r.levels || []) { const x = o.levels.find(y => y.id === l.id); if (x) x.to = Math.max(x.to, l.to); else o.levels.push({ id: l.id, from: l.from, to: l.to }); }
  (r.events || []).filter(e => e.type === 'capture').forEach(e => { o.caps.push(e.species); capQueue.push(e.species); });
  save(); renderOffline();
}
function renderOffline() { const r = S.offRep; if (!r) return;
  const h = Math.floor(r.seconds / 3600), mi = Math.floor(r.seconds % 3600 / 60);
  const caps = r.caps.map(sp => S.roster[sp] ? S.roster[sp].name : sp);
  $('#modal').innerHTML = `<div class="mod" role="dialog" aria-modal="true" aria-labelledby="offt">
   <h2 id="offt">Bentornato!</h2>
   <p class="msub">Mentre eri via (${h >= 48 ? Math.round(h / 24) + ' giorni' : h + ' h ' + mi + ' min'}${!r.skip && r.seconds >= F.offlineCap(S) ? `, massimo ${+(F.offlineCap(S) / 3600).toFixed(1)} ore` : ''}) la squadra ha combattuto da sola.</p>
   <div class="card"><div class="kv"><span>Nemici sconfitti</span><b>${fmt(r.kills)}</b></div><div class="kv"><span>Oro</span><b>+${cfmt(r.gold)}</b></div><div class="kv"><span>Oggetti trovati</span><b>${fmt(r.items)}</b></div>${F.ITEM_RARITY.filter(x => r.byRar && r.byRar[x.key] > 0).map(x => `<div class="kv sub"><span class="${x.rainbow ? 'rbw' : ''}" style="color:${x.color}">· ${x.label}</span><b>${fmt(r.byRar[x.key])}</b></div>`).join('')}${Object.keys(r.runes).filter(k => r.runes[k] > 0).map(k => `<div class="kv"><span style="color:${F.RUNE[k].color}">${F.RUNE[k].label}</span><b>+${fmt(r.runes[k])}</b></div>`).join('')}
   ${r.levels.filter(l => S.roster[l.id]).map(l => `<div class="kv"><span>${esc(S.roster[l.id].name)}</span><b>Lv ${l.from} → ${l.to}</b></div>`).join('')}</div>
   ${r.lost ? `<div class="card" style="border-color:#FF8A96"><b style="color:#FF8A96">Zaino pieno:</b> ${fmt(r.lost)} oggetti persi. Libera spazio, usa il forziere o attiva la vendita automatica.</div>` : ''}
   ${caps.length ? `<div class="card" style="border-color:#F2C14E"><b style="color:#F2C14E">Catture:</b> ${caps.map(esc).join(', ')}</div>` : ''}
   ${foundListHTML(r)}
   <button class="pb wide" data-act="offok">Raccogli</button></div>`;
  $('#modal').hidden = false;
}
function skipTime(hours) {
  const total = hours * 3600, chunk = 6 * 3600;
  let done = 0; const sum = { byRar: {}, skip: true, seconds: 0, gold: 0, kills: 0, items: 0, lost: 0, runes: { noncomune: 0, rara: 0, epica: 0, leggendaria: 0, mitico: 0, astrale: 0, arcano: 0 }, levels: {}, events: [] };
  $('#modal').innerHTML = `<div class="mod" role="dialog" aria-modal="true"><h2>Avanti veloce</h2><p class="msub" id="skipst">Simulazione in corso…</p><div class="bar"><b id="skipbar" style="width:0%"></b></div></div>`;
  $('#modal').hidden = false;
  const run = () => {
    const sec = Math.min(chunk, total - done);
    const r = F.simulateOffline(S, sec, true);
    sum.seconds += r.seconds; sum.gold += r.gold; sum.kills += r.kills; sum.items += r.items; sum.lost += r.lost || 0; for (const k in (r.byRar || {})) sum.byRar[k] = (sum.byRar[k] || 0) + r.byRar[k];
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

// ---------- benvenuto: nickname + breve tutorial ----------
const TUT = [
  ['La squadra combatte da sola', 'I tuoi personaggi avanzano e combattono in automatico, anche quando chiudi il gioco (6 ore, fino a 10 con le Costellazioni). Tu decidi come farli crescere.'],
  ['Cattura le creature', 'Ogni nemico sconfitto può unirsi a te. Le creature catturate entrano in squadra: le trovi in Squadra e nel Bestiario.'],
  ['Equipaggia e vendi', 'Gli oggetti finiscono nello Zaino. Equipaggia i migliori e vendi il resto al Mercante: con lo zaino pieno gli oggetti nuovi vanno persi.'],
  ['Punti e stelle', 'A ogni livello hai 5 punti da assegnare nella scheda del personaggio. Con l\'oro accendi le stelle delle Costellazioni: bonus per tutta la squadra.'],
  ['Zone e boss', 'Ogni zona ha 30 battaglie e un boss alla fine. Sconfiggilo per aprire la zona successiva. Se la squadra cade, torna più forte e riprova.'],
  ['Shop', 'Ogni giorno nello Shop c\'è un regalo di Astri gratis. Buon viaggio, ' + '{nick}' + '!'],
];
function showWelcome() {
  const m$ = $('#modal'); m$.classList.add('wfull'); // a tutto schermo e in alto: con la tastiera aperta resta tutto visibile
  m$.innerHTML = `<div class="mod cap" role="dialog" aria-modal="true" aria-labelledby="wtit">
   <div class="kick">BENVENUTO</div><h2 id="wtit">Idle Tamers</h2>
   <p class="quote">Scegli il nome con cui ti vedranno gli altri giocatori in chat e in classifica.</p>
   <div id="wmsg" class="note" style="color:#FF8A96;min-height:16px" aria-live="polite"></div>
   <form id="welcomeform" class="wform"><label for="wnick">Nickname</label><input id="wnick" maxlength="16" minlength="3" autocomplete="off" placeholder="3-16 caratteri" value="${esc(S.nick || '')}"><button class="pb" type="submit">Inizia</button></form>
  </div>`;
  m$.hidden = false; setTimeout(() => { const i = $('#wnick'); if (i) i.focus(); }, 50);
}
let tutOn = false;
function showTutorial(i) {
  tutOn = true; $('#modal').classList.remove('wfull');
  const [t, d] = TUT[i], m$ = $('#modal'), last = i === TUT.length - 1;
  m$.innerHTML = `<div class="mod cap" role="dialog" aria-modal="true" aria-labelledby="ttit">
   <div class="kick">TUTORIAL ${i + 1}/${TUT.length}</div><h2 id="ttit">${t}</h2>
   <p class="quote" style="font-style:normal">${esc(d.replace('{nick}', S.nick || (S.net && S.net.nick) || 'Domatore'))}</p>
   <div class="row2">${last ? '' : '<button class="sb" data-act="tutskip">Salta</button>'}<button class="pb wide" data-act="tutnext" data-i="${i}">${last ? 'Gioca' : 'Avanti'}</button></div>
  </div>`;
  m$.hidden = false;
}
async function registerNick(v) {
  try { const r = await api('rpc/it_register', { p_nickname: v }); S.net = { id: r.id, token: r.token, nick: r.nickname }; S.nick = r.nickname; save(); return 'ok'; }
  catch (err) { return /taken/.test(err.message) ? 'taken' : /check/.test(err.message) ? 'check' : 'net'; }
}

function showCmpPick(a) {
  const ids = Object.keys(S.roster).filter(x => x !== a);
  $('#modal').innerHTML = `<div class="mod" role="dialog" aria-modal="true" aria-labelledby="cpt"><div class="eqhead"><h2 id="cpt" style="margin:0;font-size:17px">Confronta ${esc(S.roster[a].name)} con…</h2><button class="ib" data-act="close" aria-label="Chiudi" style="margin-left:auto">✕</button></div>
   <div class="cpick">${ids.map(b => { const m = S.roster[b], sp = F.SPECIES[m.species]; return `<button class="sb" data-act="cmp" data-a="${a}" data-b="${b}"><div class="mspr">${sprite(m.species, 2)}</div><div style="text-align:left;flex:1"><b>${esc(m.name)}</b><div class="msub"><span style="color:${CC(sp.cls)}">${sp.cls}</span> · Lv ${m.lvl} ${rarTag(m.species)}</div></div></button>`; }).join('') || '<div class="note">Non hai altre creature.</div>'}</div></div>`;
  $('#modal').hidden = false;
}
function showCmp(a, b) {
  const A = [F.bareStats(S, a), F.memberStats(S, a)], Bs = [F.bareStats(S, b), F.memberStats(S, b)];
  const pc = v => (v * 100).toFixed(1).replace('.', ',') + '%', n = v => fmt(Math.round(v)), d1 = v => (Math.round(v * 10) / 10).toString().replace('.', ',');
  const rows = [['Vita', 'hp', n], ['Attacco', 'atk', n], ['Difesa', 'def', d1], ['Prob. critico', 'crit', pc], ['Danni critici', 'critDmg', pc], ['Blocco', 'block', pc], ['Schivata', 'dodge', pc], ['Vel. movimento', 'move', pc]];
  const head = id => { const m = S.roster[id], sp = F.SPECIES[m.species]; return `<div class="cphead">${sprite(m.species, 2)}<b>${esc(m.name)}</b><span class="msub"><span style="color:${CC(sp.cls)}">${sp.cls}</span> · Lv ${m.lvl}</span>${rarTag(m.species)}</div>`; };
  const cell = (x, y, f) => `<td class="${x > y * 1.0001 ? 'win' : x * 1.0001 < y ? 'lose' : ''}">${f(x)}</td>`;
  const table = (k, title) => `<div class="msub" style="margin:8px 0 4px">${title}</div><table class="cmpt"><tbody>${rows.map(([l, key, f]) => `<tr><th>${l}</th>${cell(A[k][key] || 0, Bs[k][key] || 0, f)}${cell(Bs[k][key] || 0, A[k][key] || 0, f)}</tr>`).join('')}<tr><th>Potere</th>${cell(k ? F.memberPower(S, a) : 0, k ? F.memberPower(S, b) : 0, n)}${cell(k ? F.memberPower(S, b) : 0, k ? F.memberPower(S, a) : 0, n)}</tr></tbody></table>`;
  $('#modal').innerHTML = `<div class="mod" role="dialog" aria-modal="true" aria-label="Confronto"><div class="eqhead"><h2 style="margin:0;font-size:17px">Confronto</h2><button class="ib" data-act="close" aria-label="Chiudi" style="margin-left:auto">✕</button></div>
   <div class="cpheads">${head(a)}${head(b)}</div>${table(0, 'Statistiche base (senza equipaggiamento)').replace(/<tr><th>Potere<\/th>.*?<\/tr>/, '')}${table(1, 'Con equipaggiamento, punti e bonus')}
   <div class="note">In verde chi è più forte. Le statistiche base contano livello, classe, rarità e punti.</div></div>`;
  $('#modal').hidden = false;
}

// scheda ingrandita di un eroe o di un pet del negozio
function showPreview(kind, id) {
  let body = '';
  if (kind === 'hero') {
    const h = F.HERO_SHOP.find(x => x.id === id), sp = F.SPECIES[id], c = F.CLASSES[sp.cls], own = !!S.roster[id];
    const big = id === 'hero_mag' ? '<div class="mg" aria-hidden="true"></div><i class="shopskull" aria-hidden="true"></i>' : id === 'hero_arc' ? '<div class="ar" aria-hidden="true"></div><i class="shopheart" aria-hidden="true"></i>' : sprite(id, 6);
    body = `<div class="pvbig herocard"><div class="mspr">${big}</div></div>
      <h2 class="pvt">${sp.name}</h2><div class="msub" style="text-align:center"><span style="color:${CC(sp.cls)}">${sp.cls}</span> · gittata ${F.rangeOf({ species: id, cls: sp.cls })}</div>
      <div class="note" style="text-align:center"><i>“${sp.quote}”</i></div>
      <div class="stbox"><div class="srow2"><span>Vita (livello 1)</span><b>${c.hp}</b></div><div class="srow2"><span>Danni</span><b>${c.atk}</b></div><div class="srow2"><span>Difesa</span><b>${c.def}</b></div><div class="srow2"><span>Attacchi al secondo</span><b>${(1 / c.spd).toFixed(2).replace('.', ',')}</b></div></div>
      <div class="stbox"><div class="srow2"><span>Abilità</span><b style="color:${CC(sp.cls)}">${c.ability}</b></div><div class="msub">${c.desc}</div></div>
      ${sp.hbText ? `<div class="stbox"><div class="srow2"><span>Talento dell'eroe</span></div><div class="msub" style="color:#FFD86B">${sp.hbText}</div></div>` : ''}
      <div class="stbox"><div class="srow2"><span>Bonus</span><b style="color:#9BFFB8">+${h.space} zaino · +${h.space} forziere</b></div><div class="msub">Gli eroi non occupano posti in squadra.</div></div>
      ${own ? '<div class="note" style="text-align:center">Già nella tua squadra</div>' : `<button class="pb" style="width:100%" data-act="buyhero" data-id="${id}">Acquista · ${h.price}</button>`}`;
  } else {
    const p = F.PETS[id], own = S.pets && S.pets[id], b = p.bonus, lab = { gold: 'oro', xp: 'esperienza', drop: 'drop', capture: 'soggiogamento' };
    body = `<div class="pvbig">${petHTML(id, 8)}</div><h2 class="pvt">${p.name}</h2>
      <div class="stbox">${Object.keys(b).filter(x => x !== 'bag' && x !== 'chest').map(x => `<div class="srow2"><span>Bonus ${lab[x]}</span><b>+${Math.round(b[x] * 100)}%</b></div>`).join('')}<div class="srow2"><span>Spazio</span><b style="color:#9BFFB8">+${b.bag} zaino · +${b.chest} forziere</b></div></div>
      <div class="msub" style="text-align:center">Vola sopra la squadra durante le battaglie. I bonus dei pet si sommano.</div>
      ${own ? '<div class="note" style="text-align:center">Già tuo</div>' : `<button class="pb" style="width:100%;margin-top:8px" data-act="buypet" data-k="${id}" ${p.astri && S.astri < p.astri ? 'disabled' : ''}>Acquista · ${p.astri ? fmt(p.astri) + ' Astri' : p.price}</button>`}`;
  }
  $('#modal').innerHTML = `<div class="mod" role="dialog" aria-modal="true" aria-label="Anteprima"><div class="eqhead"><button class="ib" data-act="close" aria-label="Chiudi" style="margin-left:auto">✕</button></div>${body}</div>`;
  $("#modal").hidden = false;
}
function closeModal() { $('#modal').classList.remove('chatfull', 'dollfull', 'capfull', 'wfull'); equipOpen = null; $('#modal').hidden = true; $('#modal').innerHTML = ''; }

// ---------- chat globale e drop rari (Supabase) ----------
const NET = { url: 'https://nvfpiwrienohvavvceqi.supabase.co', key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im52ZnBpd3JpZW5vaHZhdnZjZXFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI4NTQ4MzYsImV4cCI6MjEwODQzMDgzNn0.M_fmOZlu6qbdXw5flxwQsdvJxCgeMTY-WOpxwcLRSpA' };
const BAD = ['cazz', 'stronz', 'vaffanc', 'puttan', 'merd', 'coglion', 'troia', 'fuck', 'shit', 'bitch', 'negr', 'fanculo'];
const clean = t => BAD.reduce((x, w) => x.replace(new RegExp(w + '\\w*', 'gi'), m => '*'.repeat(m.length)), t);
async function api(path, body) {
  const r = await fetch(NET.url + '/rest/v1/' + path, { method: body ? 'POST' : 'GET', headers: { apikey: NET.key, Authorization: 'Bearer ' + NET.key, 'Content-Type': 'application/json' }, body: body ? JSON.stringify(body) : undefined });
  if (!r.ok) { let m = 'errore'; try { m = (await r.json()).message || m; } catch (e) {} throw new Error(m); }
  const txt = await r.text(); return txt ? JSON.parse(txt) : null;
}
let chatOpen = false, chatTab = 'chat', chatMsgs = [], chatDrops = [], chatTop = [], chatTimer = null, chatErr = '', lastSeenChat = 0;
const ago = t => { const d = (Date.now() - new Date(t).getTime()) / 1000; return d < 60 ? 'ora' : d < 3600 ? Math.floor(d / 60) + ' min' : d < 86400 ? Math.floor(d / 3600) + ' h' : Math.floor(d / 86400) + ' g'; };
async function chatLoad() {
  try {
    if (chatTab === 'chat') chatMsgs = (await api('it_chat?select=id,player_id,nickname,body,created_at&order=id.desc&limit=60')).reverse();
    else if (chatTab === 'top') { await shareScore(); chatTop = await api('it_scores?select=player_id,nickname,power,zone,creatures&order=power.desc&limit=50'); }
    else chatDrops = await api('it_drops?select=id,nickname,rarity,slot,zone,ilvl,created_at&order=id.desc&limit=40');
    chatErr = '';
    if (chatMsgs.length) { lastSeenChat = chatMsgs[chatMsgs.length - 1].id; try { localStorage.setItem('it_seen', lastSeenChat); } catch (e) {} }
  } catch (e) { chatErr = 'Connessione non riuscita. Riprovo tra poco.'; }
  if (chatOpen && document.querySelector('#modal .chatmod')) chatRender();
}
const nickColor = n => { let h = 0; for (const ch of String(n)) h = (h * 31 + ch.charCodeAt(0)) % 360; return `hsl(${h},75%,72%)`; };
function chatListHTML() {
  const me = S.net && S.net.id;
  if (chatTab === 'chat') return chatMsgs.map(m => { const mine = m.player_id === me;
    return `<div class="bub${mine ? ' me' : ''}">${mine ? '' : `<span class="cn" style="color:${nickColor(m.nickname)}">${esc(m.nickname)}</span>`}<div class="btxt">${esc(clean(m.body))}</div><div class="bmeta"><time>${m.id < 0 ? 'invio…' : ago(m.created_at)}</time>${!mine && me ? `<button class="rep" data-chat="report" data-id="${m.id}" aria-label="Segnala">segnala</button>` : ''}</div></div>`; }).join('') || '<div class="cempty">Ancora nessun messaggio.<br>Rompi il ghiaccio!</div>';
  if (chatTab === 'top') return chatTop.map((r, i) => `<div class="cmsg toprow${r.player_id === me ? ' me' : ''}"><b class="tpos">${i < 3 ? ['🥇', '🥈', '🥉'][i] : i + 1}</b><span class="cn" style="color:${nickColor(r.nickname)}">${esc(r.nickname)}</span><span class="msub">zona ${r.zone} · ${r.creatures} creature</span><b class="tpow">${cfmt(r.power)}</b></div>`).join('') || '<div class="cempty">Classifica vuota.</div>';
  return chatDrops.map(d => { const r = F.ITEM_RARITY.find(x => x.key === d.rarity); return `<div class="cmsg dropg">${itemIcon(d.slot, null, r.color, 20)}<div style="flex:1"><span class="cn" style="color:${nickColor(d.nickname)}">${esc(d.nickname)}</span> ha trovato <b class="${r.rainbow ? 'rbw' : ''}" style="color:${r.color}">${r.label}</b><div class="msub">${F.SLOT_LABEL[d.slot] || d.slot} · Lv ${d.ilvl} · zona ${d.zone} · ${ago(d.created_at)}</div></div></div>`; }).join('') || '<div class="cempty">Nessun drop raro per ora.</div>';
}
function chatRender(full) {
  const list = $('#chatlist'), atBottom = !list || list.scrollHeight - list.scrollTop - list.clientHeight < 60;
  if (!full && list && list.dataset.tab === chatTab) { // aggiorna solo i messaggi: quello che stai scrivendo resta
    list.innerHTML = chatListHTML(); const er = $('#chaterr'); if (er) er.textContent = chatErr;
    if (atBottom || chatTab !== 'chat') list.scrollTop = chatTab === 'chat' ? list.scrollHeight : list.scrollTop; return;
  }
  const foot = chatTab !== 'chat' ? (chatTab === 'top' ? `<div class="note">Potenza totale: la somma del potere di tutti i tuoi personaggi.</div>` : `<div class="note">Gli ultimi oggetti Astrale, Arcano, Eterno e Segreto trovati da tutti.</div>`)
    : S.net ? `<form class="chatbar" id="chatform"><input id="chatin" maxlength="200" placeholder="Scrivi un messaggio…" autocomplete="off" enterkeyhint="send" aria-label="Messaggio"><button class="csend" type="submit" aria-label="Invia">➤</button></form>`
    : `<div class="note">Scegli un nickname per scrivere in chat.</div>`;
  $('#modal').classList.add('chatfull');
  $('#modal').innerHTML = `<div class="mod chatmod" role="dialog" aria-modal="true" aria-label="Community">
   <div class="chead"><div><h2>Community</h2><span class="msub">${S.net ? 'sei ' + esc(S.net.nick) : ''}</span></div><button class="ib" data-chat="close" aria-label="Chiudi">✕</button></div>
   <div class="tabs2"><button class="sb${chatTab === 'chat' ? ' on' : ''}" data-chat="tab" data-v="chat">Chat</button><button class="sb${chatTab === 'drops' ? ' on' : ''}" data-chat="tab" data-v="drops">Drop rari</button><button class="sb${chatTab === 'top' ? ' on' : ''}" data-chat="tab" data-v="top">Classifica</button></div>
   <div id="chaterr" class="cerr">${chatErr}</div>
   <div class="chatlist${chatTab === 'chat' ? ' talk' : ''}" id="chatlist" data-tab="${chatTab}">${chatListHTML()}</div>
   ${foot}</div>`;
  $('#modal').hidden = false;
  const l = $('#chatlist'); if (l && chatTab === 'chat') l.scrollTop = l.scrollHeight;
}
function chatShow() { chatOpen = true; $('#chatbtn').classList.remove('dot'); chatRender(true); chatLoad(); clearInterval(chatTimer); chatTimer = setInterval(chatLoad, 6000); }
function chatClose() { chatOpen = false; clearInterval(chatTimer); $('#modal').classList.remove('chatfull'); closeModal(); }
// invia al server i drop rari non ancora condivisi (anche quelli trovati offline)
async function shareDrops() {
  if (!S.net || !S.rareLog) return;
  for (const e of S.rareLog.filter(x => !x.sent).reverse().slice(0, 5)) {
    try { await api('rpc/it_post_drop', { p_token: S.net.token, p_rarity: e.rarity, p_slot: e.slot, p_zone: e.zone, p_ilvl: e.lvl || 1 }); e.sent = true; } catch (err) { e.sent = true; }
  }
}
// classifica: potenza totale di tutti i personaggi
function totalPower() { let p = 0; for (const id in S.roster) p += F.memberPower(S, id); return Math.round(p); }
let lastScore = 0;
async function shareScore() { if (!S.net || Date.now() - lastScore < 60000) return; lastScore = Date.now(); try { await api('rpc/it_post_score', { p_token: S.net.token, p_power: totalPower(), p_zone: S.cleared, p_creatures: F.capturedCount(S) }); } catch (e) {} }
// pallino sul pulsante se ci sono messaggi nuovi
async function chatPeek() {
  if (chatOpen) return;
  try { // pallino se ci sono messaggi di altri più recenti dell'ultimo letto (anche appena entri nel gioco)
    const seen = +(localStorage.getItem('it_seen') || 0);
    const r = await api(`it_chat?select=id,player_id&id=gt.${seen}&order=id.desc&limit=20`);
    if ((r || []).some(m => !S.net || m.player_id !== S.net.id)) $('#chatbtn').classList.add('dot');
  } catch (e) {}
}
document.addEventListener('click', async e => {
  const t = e.target.closest('[data-chat]'); if (!t) return;
  const a = t.dataset.chat;
  if (a === 'open') chatShow();
  else if (a === 'close') chatClose();
  else if (a === 'tab') { chatTab = t.dataset.v; chatRender(); chatLoad(); }
  else if (a === 'report') { try { await api('rpc/it_report', { p_token: S.net.token, p_chat_id: +t.dataset.id }); toast('Segnalazione inviata, grazie'); } catch (err) { toast('Segnalazione non riuscita'); } }
});
document.addEventListener('submit', async e => {
  if (e.target.id === 'welcomeform') {
    e.preventDefault(); const v = $('#wnick').value.trim(), msg = t => { const w = $('#wmsg'); if (w) w.textContent = t; };
    if (v.length < 3) { msg('Il nickname deve avere almeno 3 caratteri.'); return; }
    if (BAD.some(w => v.toLowerCase().includes(w))) { msg('Scegli un nickname senza parolacce.'); return; }
    msg(''); const btn = e.target.querySelector('button'); btn.disabled = true;
    const res = await registerNick(v); btn.disabled = false;
    if (res === 'taken') { msg('Il nickname «' + v + '» è già occupato: scegline un altro.'); return; }
    if (res === 'check') { msg('Usa solo lettere, numeri, spazi, _ . -'); return; }
    if (res === 'net') { msg('Connessione assente: serve internet per registrare il nickname. Riprova.'); return; }
    S.nick = v; save();
    if (!S.tutorial) showTutorial(0); else closeModal();
    return;
  }
  if (e.target.id === 'nickform') {
    e.preventDefault(); const v = $('#nickin').value.trim();
    if (v.length < 3) { toast('Il nickname deve avere almeno 3 caratteri'); return; }
    if (BAD.some(w => v.toLowerCase().includes(w))) { toast('Scegli un nickname senza parolacce'); return; }
    try { const r = await api('rpc/it_register', { p_nickname: v }); S.net = { id: r.id, token: r.token, nick: r.nickname }; save(); toast('Benvenuto in chat, ' + esc(r.nickname) + '!', '#7FE3FF'); shareDrops(); chatRender(); }
    catch (err) { toast(/taken/.test(err.message) ? 'Nickname già usato, scegline un altro' : /check/.test(err.message) ? 'Usa solo lettere, numeri, spazi, _ . -' : 'Registrazione non riuscita'); }
  } else if (e.target.id === 'chatform') {
    e.preventDefault(); const inp = $('#chatin'), v = inp.value.trim(); if (!v) return;
    const tmp = { id: -Date.now(), player_id: S.net.id, nickname: S.net.nick, body: v, created_at: new Date().toISOString() }; chatMsgs.push(tmp); inp.value = ''; chatRender(); const l0 = $('#chatlist'); if (l0) l0.scrollTop = l0.scrollHeight; inp.focus();
    try { await api('rpc/it_post_message', { p_token: S.net.token, p_body: v }); await chatLoad(); const l = $('#chatlist'); if (l) l.scrollTop = l.scrollHeight; }
    catch (err) { chatMsgs = chatMsgs.filter(m => m !== tmp); chatRender(); inp.value = v; toast(/too_fast/.test(err.message) ? 'Piano! Aspetta qualche secondo' : 'Messaggio non inviato'); }
  }
});
setInterval(shareDrops, 60000); setInterval(chatPeek, 20000); setInterval(shareScore, 600000); setTimeout(() => { shareDrops(); chatPeek(); }, 3000);

// ---------- input ----------
document.addEventListener('click', e => {
  const t = e.target.closest('[data-act],[data-tab]');
  if (!t) { if (!e.target.closest('.pop') && (selItem || selRune || selShop !== null) && e.target.closest('#panel')) { selItem = null; selRune = null; selShop = null; render(); } return; }
  if (t.dataset.tab) { tab = t.dataset.tab; selItem = null; selRune = null; selShop = null; render(); $('#panel').scrollTop = 0; return; }
  const a = t.dataset.act, id = t.dataset.id, item = +t.dataset.item;
  const rebuild = () => { B = F.startBattle(S); buildScene(); };
  if (a === 'openm') openMember = openMember === id ? null : id;
  else if (a === 'up') F.moveMember(S, id, -1);
  else if (a === 'down') F.moveMember(S, id, 1);
  else if (a === 'add') { F.addToTeam(S, id); rebuild(); }
  else if (a === 'bench') { F.removeFromTeam(S, id); openMember = null; rebuild(); }
  else if (a === 'uneq') F.unequip(S, id, t.dataset.slot);
  else if (a === 'selit') { selItem = selItem === item ? null : item; selRune = null; }
  else if (a === 'lockit') { const on = F.toggleLock(S, item); toast(on ? 'Oggetto bloccato: non verrà mai venduto' : 'Oggetto sbloccato'); }
  else if (a === 'autoopen') { showAutoSell(); return; }
  else if (a === 'atog') {
    const k = F.minKeep(S), key = t.dataset.k;
    if (key === 'noncomune' && !F.hasPass(S)) { $('#modal').innerHTML = `<div class="mod" role="dialog" aria-modal="true"><h2>Serve il Pass Astrale</h2><p class="msub">Scartare in automatico anche i non comuni è incluso nel Pass Astrale. Vuoi aprire lo Shop?</p><div class="row2"><button class="sb" data-act="close">No, grazie</button><button class="pb" data-act="goshop">Vai allo Shop</button></div></div>`; $('#modal').hidden = false; return; }
    if (key === 'comune' && !F.hasPass(S) && S.maxZone < F.FREE_FILTER_ZONE) { toast(`Lo scarto dei comuni si sblocca alla zona ${F.FREE_FILTER_ZONE} (subito col Pass Astrale)`, '#F2C14E'); return; }
    if (key === 'comune') S.settings.minRarity = k >= 1 ? 'comune' : 'noncomune';
    else S.settings.minRarity = k >= 2 ? 'noncomune' : 'rara';
    if (F.minKeep(S) > k) { const r = F.sellBelow(S); if (r.n) toast(`Venduti ${r.n} oggetti per ${cfmt(r.gold)} oro`); }
  }
  else if (a === 'bigscene') { if (!S.net || tutOn) return; /* niente ingrandimento durante la scelta del nick e il tutorial */ S.settings.bigScene = !S.settings.bigScene; applyBig(); save(); }
  else if (a === 'goshop') { closeModal(); tab = 'shop'; selItem = null; selRune = null; selShop = null; render(); const v = t.dataset.v, pn = $('#panel'); pn.scrollTop = 0; if (v) { const go = () => { const el = document.getElementById('shop-' + v); if (el) pn.scrollTop += el.getBoundingClientRect().top - pn.getBoundingClientRect().top - 6; }; go(); requestAnimationFrame(go); } return; }
  else if (a === 'setkeep') { S.settings.minRarity = t.dataset.k; dirty = true; showAutoSell(); return; }
  else if (a === 'pts') { F.addPts(S, id, t.dataset.k, +t.dataset.n); rebuild(); }
  else if (a === 'ptsauto') { F.autoPts(S, id); rebuild(); }
  else if (a === 'ptsreset') { F.resetPts(S, id); rebuild(); }
  else if (a === 'portal') { showPortal(); return; }
  else if (a === 'testacc') { F.testAccount(S, t.dataset.k); save(); B = F.startBattle(S); buildScene(); render(); toast(t.dataset.k === 'full' ? '<b>Account completo</b>: tutto al massimo' : `<b>Pronto per la zona ${t.dataset.k}</b>`, '#F2C14E'); return; }
  else if (a === 'spawnportal') { if (!S.portal && !S.portalRun) { S.portal = { until: (S.clock || 0) + 12 * 3600 }; save(); toast('<b>Portale aperto!</b> Lo trovi sopra la battaglia.', '#B48CFF'); } return; }
  else if (a === 'enterportal') { if (F.enterPortal(S)) { closeModal(); save(); B = F.startBattle(S); buildScene(); } return; }
  else if (a === 'preview') { showPreview(t.dataset.kind, t.dataset.id); return; }
  else if (a === 'rropen') { rrOpen = t.dataset.item; }
  else if (a === 'rrlock') { const i = +t.dataset.i; rrLocks = rrLocks.includes(i) ? rrLocks.filter(x => x !== i) : rrLocks.concat(i); }
  else if (a === 'reroll2') { if (F.rerollBonus(S, item, rrLocks)) { snd('coin'); toast('Bonus rimescolati', '#F49AC1'); } }
  else if (a === 'fuseopen') { showFuse(); return; }
  else if (a === 'sellopts') { showSellOpts(); return; }
  else if (a === 'capskip') { capQueue.length = 0; closeModal(); return; } // salta questa e tutte le catture in coda
  else if (a === 'testcap') { const ids = Object.keys(S.roster).filter(k => !F.isHero(k)); if (ids.length) showCapture(ids[Math.floor(Math.random() * ids.length)]); else toast('Nessuna creatura catturata'); return; }
  else if (a === 'fuse') { const it = F.fuse(S, t.dataset.k); if (it) { const r = F.ITEM_RARITY.find(x => x.key === it.rarity); snd('rare'); toast(`Fusione riuscita: <b style="color:${r.color}">${esc(F.itemName(it))}</b>`, r.color); } showFuse(); dirty = true; return; }
  else if (a === 'dmgtoggle') { showDmg = !showDmg; }
  else if (a === 'dmgreset') { S.dmgLog = { since: S.clock || 0, by: {}, zone: S.zone }; }
  else if (a === 'selrune') { selRune = selRune === t.dataset.k ? null : t.dataset.k; selItem = null; }
  else if (a === 'selshop') selShop = selShop === +t.dataset.i ? null : +t.dataset.i;
  else if (a === 'equipall') { const n = F.autoEquip(S); toast(n ? `Equipaggiati ${n} oggetti` : 'Nessun miglioramento disponibile'); }
  else if (a === 'sellrest') { const r = F.sellRest(S); toast(r.n ? `Venduti ${r.n} oggetti per ${cfmt(r.gold)} oro` : 'Niente da vendere'); }
  else if (a === 'eqto') { F.equipTo(S, item, id || $('#eqsel').value); selItem = null; eqSel = null; }
  else if (a === 'eqpick') { eqSel = eqSel === item ? null : item; }
  else if (a === 'protk') { F.toggleProtect(S, t.dataset.k); }
  else if (a === 'sell') { F.sellItem(S, item); selItem = null; }
  else if (a === 'equip') { selSlot = null; eqSel = null; showEquip(id); return; }
  else if (a === 'eqnav') { eqNav(+t.dataset.d); return; }
  else if (a === 'selslot') { const v = id + ':' + t.dataset.slot; selSlot = selSlot === v ? null : v; }
  else if (a === 'slotup') { if (confirmRune !== 'slot' + id + t.dataset.slot) { confirmRune = 'slot' + id + t.dataset.slot; toast('Tocca di nuovo per spendere gli Astri', '#F49AC1'); setTimeout(() => { confirmRune = null; }, 3000); return; } confirmRune = null; if (F.upgradeSlot(S, id, t.dataset.slot)) { snd('coin'); rebuild(); } }
  else if (a === 'sellrune1') { F.sellRunes(S, t.dataset.k, 1); }
  else if (a === 'sellruneall') { const g = F.sellRunes(S, t.dataset.k, S.runes[t.dataset.k]); toast(`+${g} Astri`); }
  else if (a === 'raise' && confirmRune !== 'raise' + item) { confirmRune = 'raise' + item; toast('Tocca di nuovo per usare la runa', '#F2C14E'); setTimeout(() => { confirmRune = null; }, 3000); return; }
  else if (a === 'raise') { confirmRune = null; const it = S.inventory.find(x => x.id === item); if (it && F.raiseRarity(S, it)) { toast(`Rarità migliorata: ${esc(F.itemName(it))}`, F.ITEM_RARITY.find(x => x.key === it.rarity).color); if (S.settings.autoEquip) F.autoEquip(S); } }
  else if (a === 'buy') { if (F.buyShop(S, +t.dataset.i)) toast('Acquistato: lo trovi nello zaino'); }
  else if (a === 'reroll') { selShop = null; if (F.rerollShop(S)) toast('Il mercante ha cambiato la merce', '#F49AC1'); }
  else if (a === 'skip') { skipTime(+t.dataset.h); return; }
  else if (a === 'sellbelow') { const r = F.sellBelow(S); toast(r.n ? `Venduti ${r.n} oggetti per ${cfmt(r.gold)} oro` : 'Niente sotto la soglia'); }
  else if (a === 'claim') { const r = F.claimMission(S, id); if (r) toast(`Missione completata: +${r.astri} Astri, +1 ${F.RUNE[r.rune[0]].label.toLowerCase()}`, '#F2C14E'); }
  else if (a === 'buyhero') { if (F.buyHero(S, id)) { toast(F.SPECIES[id].name + ' si unisce alla squadra! (versione di prova)', '#F2C14E'); rebuild(); } }
  else if (a === 'bagview') { bagView = t.dataset.v; selItem = null; }
  else if (a === 'tochest') { F.toChest(S, +t.dataset.item); selItem = null; }
  else if (a === 'fromchest') { F.fromChest(S, +t.dataset.item); selItem = null; }
  else if (a === 'givegold') { S.gold += +t.dataset.v; toast(`+${cfmt(+t.dataset.v)} oro`, '#F2C14E'); }
  else if (a === 'giveastri') { S.astri += +t.dataset.v; toast(`+${fmt(+t.dataset.v)} Astri`, '#F49AC1'); }
  else if (a === 'skybuy') { if (F.skyBuy(S, +t.dataset.id)) { const o = F.SKY[+t.dataset.id]; toast(`${o.ic} ${o.label} ${fmtPct(o.kind, o.v)}`, o.special ? '#FFFFFF' : F.SKY_SECTORS[o.sec].color); rebuild(); } }
  else if (a === 'skyzoom') { skyView.k = Math.max(10, Math.min(90, skyView.k * +t.dataset.z)); }
  else if (a === 'skycenter') { skyView = { x: 0, y: 0, k: 34 }; }
  else if (a === 'buyback') { if (F.buyBack(S, +t.dataset.i)) toast('Oggetto riacquistato', '#7ED36F'); }
  else if (a === 'buyslot') { if (F.buySlot(S)) { toast('Nuovo posto in squadra!', '#F2C14E'); rebuild(); } }
  else if (a === 'buypet') { if (F.buyPet(S, t.dataset.k)) { snd('rare'); toast(`${F.PETS[t.dataset.k].name} si unisce a te!`, '#F2C14E'); buildScene(); } }
  else if (a === 'welcome') { if (F.buyWelcome(S, t.dataset.k)) { snd('rare'); toast(`Pacchetto Benvenuto: ${F.PETS[t.dataset.k].name} + 500 Astri`, '#F2C14E'); buildScene(); } }
  else if (a === 'buyastri') { const n = F.buyAstri(S, +t.dataset.i); if (n) { snd('coin'); toast(`+${fmt(n)} Astri`, '#F49AC1'); } }
  else if (a === 'buygold') { const g = F.buyGold(S, +t.dataset.i); if (g) toast(`+${cfmt(g)} oro`, '#F2C14E'); }
  else if (a === 'buyspace') { if (F.buySpace(S, t.dataset.k)) toast(`+${F.SPACE_PACK.n} posti ${t.dataset.k === 'bag' ? 'nello zaino' : 'nel forziere'}`, '#F2C14E'); }
  else if (a === 'buyrune') { if (F.buyRune(S, t.dataset.k)) toast(`+1 ${F.RUNE[t.dataset.k].label.toLowerCase()}`, F.RUNE[t.dataset.k].color); }
  else if (a === 'daily') { const g = F.claimDaily(S); if (g) toast(`+${g} ${icon('gem', '#F49AC1', 14)} Astri: regalo del giorno`, '#F49AC1'); }
  else if (a === 'passoff') { F.deactivatePass(S); toast('Pass Astrale tolto', '#F2C14E'); }
  else if (a === 'pass') { F.activatePass(S); toast('Pass Astrale attivo per 30 giorni (versione di prova)', '#F2C14E'); }
  else if (a === 'zone') { if (F.setZone(S, +t.dataset.z)) { rebuild(); banner('ZONA ' + S.zone); } }
  else if (a === 'tree') { F.buyTree(S, t.dataset.k); }
  else if (a === 'treereset') { if (confirmTree > Date.now()) { const b = F.skyReset(S); confirmTree = 0; toast(`Recuperati ${cfmt(b)} oro`); rebuild(); } else confirmTree = Date.now() + 3000; }
  else if (a === 'reset') { if (confirmReset > Date.now()) { const tk = S.net && S.net.token; if (tk) api('rpc/it_unregister', { p_token: tk }).catch(() => {}); S = F.newState(); save(); rebuild(); confirmReset = 0; showWelcome(); } else confirmReset = Date.now() + 3000; }
  else if (a === 'capadd') { F.addToTeam(S, id); rebuild(); closeModal(); }
  else if (a === 'close') { closeModal(); }
  else if (a === 'offok') { S.offRep = null; save(); closeModal(); }
  else if (a === 'cmppick') { showCmpPick(id); return; }
  else if (a === 'cmp') { showCmp(t.dataset.a, t.dataset.b); return; }
  else if (a === 'tutnext') { const i = +t.dataset.i + 1; if (i < TUT.length) { showTutorial(i); return; } S.tutorial = 1; tutOn = false; save(); closeModal(); }
  else if (a === 'tutskip') { S.tutorial = 1; tutOn = false; save(); closeModal(); }
  else if (a === 'tutshow') { showTutorial(0); return; }
  else if (a === 'eqres' || a === 'lockm' || a === 'autoeq' || a === 'tfast' || a === 'tcap' || a === 'minr' || a === 'prot' || a === 'sound' || a === 'vol') return; // gestiti da change
  if (a === 'tree' || a === 'treereset') { /* stelle cambiano le statistiche */ B.party.forEach(() => {}); }
  save(); render(); if (sellOpen && !$('#modal').hidden && $('#modal').innerHTML.includes('Scarto e vendita')) showSellOpts(); else sellOpen = false; if (equipOpen && !$('#modal').hidden) { const y = $('#modal .mod') ? $('#modal .mod').scrollTop : 0; showEquip(equipOpen); if ($('#modal .mod')) $('#modal .mod').scrollTop = y; }
});
document.addEventListener('change', e => {
  const t = e.target; const a = t.dataset && t.dataset.act; if (!a) return;
  if (a === 'lockm') S.roster[t.dataset.id].locked = t.checked;
  if (a === 'autoeq') { S.settings.autoEquip = t.checked; if (t.checked) F.autoEquip(S); }
  if (a === 'tfast') S.settings.tFast = t.checked;
  if (a === 'tcap') S.settings.tCap = t.checked;
  if (a === 'minr') S.settings.minRarity = t.value;
  if (a === 'sound') { S.settings.sound = t.checked; if (t.checked) snd('coin'); }
  if (a === 'vol') { S.settings.volume = +t.value; snd('coin'); }
  if (a === 'eqres') { S.settings.eqReserve = t.checked; dirty = true; }
  if (a === 'prot') { S.settings.protect = t.value; dirty = true; }
  save(); render(); hud();
});
document.addEventListener('submit', e => {
  if (e.target.classList.contains('giveform')) { e.preventDefault(); const v = Math.floor(+$('#givev').value || 0); if (v > 0) { const k = e.submitter && e.submitter.dataset.give; if (k === 'astri') S.astri += v; else S.gold += v; toast(`+${cfmt(v)} ${k === 'astri' ? 'Astri' : 'oro'}`); save(); hud(); dirty = true; } return; }
  const f = e.target.closest('form.rename'); if (!f) return; e.preventDefault();
  const v = f.querySelector('input').value.trim(); if (v) { S.roster[f.dataset.id].name = v.slice(0, 16); save(); toast('Nome salvato'); }
  if (!$('#modal').hidden && f.closest('#modal')) { const h = $('#capname'); if (h) h.textContent = v; } else render();
});

// ---------- ciclo ----------
let last = performance.now(), saveAt = 0, achAt = 0, renderAt = 0;
function frame(now) {
  let dt = Math.min(0.1, (now - last) / 1000); last = now;
  S.stats.played += dt;
  const speed = S.settings.tFast ? 10 : 1; let left = S.net && !tutOn ? dt * speed : 0; // fermo finché non c'è il nickname e durante il tutorial
  const ev = [];
  while (left > 0) { const d = Math.min(0.05, left); F.step(S, B, d, ev); left -= d; }
  handle(ev); updateScene(); hud();
  if (now - achAt > 1500) { achAt = now; for (const a of F.checkAch(S)) { S.achNew = (S.achNew || 0) + 1; dirty = true; } } // niente avvisi a schermo: solo il pallino su Stats
  if ($('#modal').hidden && S.offRep) renderOffline();
  else if ($('#modal').hidden && capQueue.length) showCapture(capQueue.shift());
  if (dirty && !skyDrag && now - renderAt > 700 && now - scrollAt > 1500 && !touching && !document.activeElement.matches('input,select')) { renderAt = now; render(); }
  if (now - saveAt > 10000) { saveAt = now; if (F.ensureShop(S, Date.now())) toast('Il mercante ha nuovi oggetti', '#F49AC1'); save(); }
  requestAnimationFrame(frame);
}
function catchUp() {
  const away = (Date.now() - (S.lastSeen || Date.now())) / 1000;
  if (!S.net || !S.tutorial) { S.lastSeen = Date.now(); B = F.startBattle(S); buildScene(); return; } // niente progressi offline prima di aver scelto il nick e finito il tutorial
  if (away > 30) { const id0 = S.nextId; const r = F.simulateOffline(S, away); r.since = id0; F.checkAch(S); save(); showOffline(r); }
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
if (had) catchUp(); else { B = F.startBattle(S); buildScene(); }
if (!S.net) showWelcome(); else if (!had && !S.tutorial) showTutorial(0);
banner('BATTAGLIA ' + S.battle);
setScroll(); applyBig(); render(); hud();
addEventListener('resize', applyBig);
requestAnimationFrame(t => { last = t; frame(t); });
})();
