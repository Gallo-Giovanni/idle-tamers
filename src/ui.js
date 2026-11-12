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
  return list.map((u, i) => ({ u, i })).sort((a, b) => rank[a.u.cls] - rank[b.u.cls] || a.i - b.i);
}
function buildScene() {
  const sc = $('#units'); sc.innerHTML = '';
  pEls = []; eEls = [];
  const isRanged = c => c === 'Arciere' || c === 'Mago' || c === 'Curatore';
  // squadra: mischia davanti, a distanza dietro con uno stacco
  // ognuno si mette alla distanza della sua gittata: prima i Guerrieri, poi Arcieri, Maghi e Curatori
  const order = orderFront(B.party);
  const place = (list) => list.forEach(({ u }, k) => {
    const x = 168 - k * 10 - (F.CLASSES[u.cls].range - 1) * 4, y = 26; // tutti sul pavimento
    const el = document.createElement('div'); el.className = 'u'; el.dataset.x = x; el.style.left = x + 'px'; el.style.bottom = y + 'px'; el.style.zIndex = 20 - (k % 2) * 5;
    el.innerHTML = `<div class="hpb"><b style="background:#7ED36F"></b></div>${u.species === 'hero' ? '<div class="kn" aria-hidden="true"></div>' : sprite(u.species, 2)}`;
    sc.appendChild(el); pEls[u.idx] = el;
  });
  place(order);
  // nemici: quelli da mischia si ammassano sul primo bersaglio, quelli a distanza restano indietro
  let mk = 0, rk = 0;
  B.enemies.forEach(u => {
    const bp = u.secret ? 4 : u.boss ? 3 : 2, r = isRanged(u.cls);
    const x = r ? 214 + (F.CLASSES[u.cls].range - 3) * 12 + (rk++) * 7 : 180 + (mk++) * 6 - (u.boss ? 6 : 0), y = 26;
    const el = document.createElement('div'); el.className = 'u' + (u.secret ? ' secret' : '') + (ANIM[(F.SPECIES[u.species].base || u.species)] ? ' anim' : ''); el.dataset.x = x; el.style.left = '420px'; el.style.bottom = y + 'px'; el.style.zIndex = 15 - (mk % 3);
    el.innerHTML = `<div class="hpb"><b style="background:#FF5A6E"></b></div><div class="mk">${icon('dust', '#7ED36F', 10)}</div>${animHTML(u) || sprite(u.species, bp, { flip: true })}`;
    sc.appendChild(el); eEls[u.idx] = el;
  });
  buildLog();
  logAt = -1e9;
  updateScene();
}
// Vita della squadra, stilizzata: barra sottile + danno medio al secondo (media mobile, non si azzera tra le battaglie)
let logRows = [];
const dps = {}, lastDealt = {}, acc = {};
let dpsAt = 0;
function buildLog() {
  const box = $('#log'); logRows = [];
  box.innerHTML = `<div class="lhead"><span id="alive"></span><span>danno medio / s</span></div><div class="pgrid">${B.party.map(u => `<div class="pc"><div class="pt"><i style="background:${F.CLASSES[u.cls].color}"></i><span class="pn">${esc(S.roster[u.id].name)}</span><b class="pd"></b></div><div class="hbar"><b></b></div></div>`).join('')}</div>`;
  const cells = box.querySelectorAll('.pc');
  B.party.forEach((u, i) => { logRows.push([u, cells[i]]); lastDealt[u.idx] = 0; });
}
let logAt = 0;
function updateLog() {
  const now = performance.now();
  for (const [u] of logRows) { const d = u.dealt - (lastDealt[u.idx] || 0); if (d > 0) acc[u.id] = (acc[u.id] || 0) + d; lastDealt[u.idx] = u.dealt; }
  if (now - dpsAt >= 1000) {
    const sec = (now - dpsAt) / 1000; dpsAt = now;
    for (const [u] of logRows) { const v = (acc[u.id] || 0) / Math.min(sec, 2) * (S.settings.test ? 0.2 : 1); dps[u.id] = dps[u.id] === undefined ? v : dps[u.id] * 0.85 + v * 0.15; acc[u.id] = 0; }
  }
  if (now - logAt < 250) return; logAt = now;
  let alive = 0; const top = Math.max(1, ...logRows.map(([u]) => dps[u.id] || 0));
  for (const [u, c] of logRows) {
    const pct = Math.max(0, u.hp / u.maxHp); if (u.hp > 0) alive++;
    const b = c.lastChild.firstChild; b.style.width = (100 * pct) + '%';
    b.style.background = pct > 0.6 ? '#7ED36F' : pct > 0.3 ? '#F2C14E' : '#FF5A6E';
    c.querySelector('.pd').textContent = u.hp > 0 ? cfmt(dps[u.id] || 0) : 'KO';
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
  { const left = en.length + (F.BOSS_BATTLE - S.battle) * 3, fc = $('#foes'); if (fc && fc.dataset.n !== String(left)) { fc.dataset.n = left; fc.textContent = 'Nemici rimasti ' + left; } }
  B.party.forEach(u => { const el = pEls[u.idx]; if (!el) return; el.firstChild.firstChild.style.width = (100 * u.hp / u.maxHp) + '%'; el.classList.toggle('dead', u.hp <= 0); });
  B.party.forEach(u => { const el = pEls[u.idx]; if (el) el.style.left = (+el.dataset.x + (F.CLASSES[u.cls].range === 1 && u.hp > 0 ? (adv(u) - cam) * 17 : 0)) + 'px'; });
  { const bb = $('#bossbar'), fb = B.enemies.find(u => u.boss && (F.SPECIES[u.species].base || u.species) === 'divoratore'); // barra grande solo per il boss finale
    if (bb) { const on = !!fb && fb.hp > 0 && !(fb.arrive > 0); bb.hidden = !on; if (on) { bb.firstChild.style.width = (148 * fb.hp / fb.maxHp) + 'px'; const nm = F.SPECIES[fb.species].name; if (bb.lastChild.textContent !== nm) bb.lastChild.textContent = nm; } } }
  B.enemies.forEach(u => { const el = eEls[u.idx]; if (!el) return; const tx = +el.dataset.x; el.style.left = (u.arrive > 0 ? tx + 240 * u.arrive / u.arriveMax : tx + (u.pos - F.CLASSES[u.cls].range - B._cam) * 17) + 'px'; el.classList.toggle('walk', u.arrive > 0); el.firstChild.firstChild.style.width = (100 * u.hp / u.maxHp) + '%'; el.classList.toggle('dead', u.hp <= 0); el.classList.toggle('marked', u.mark > 0); });
  updateLog();
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
function knAnim(el, k, ms) { const kn = el && el.querySelector('.kn, .an'); if (!kn) return; kn.classList.remove('atk', 'atk2', 'sk', 'dg'); void kn.offsetWidth; kn.classList.add(k); clearTimeout(kn._t); kn._t = setTimeout(() => kn.classList.remove(k), ms); }
function lunge(el, dir) { if (!el) return; el.style.setProperty('--dx', dir + 'px'); el.classList.remove('lg'); void el.offsetWidth; el.classList.add('lg'); }
function banner(text) { const b = $('#banner'); b.textContent = text; b.classList.remove('show'); void b.offsetWidth; b.classList.add('show'); }

function setScroll() { const g = document.querySelector('.ground'); if (g) g.style.animationDuration = (1.4 / F.moveSpeed(S)) + 's'; }
// ---------- notifiche ----------
function toast(html, color) {
  const box = $('#toasts'); while (box.children.length >= 3) box.firstChild.remove();
  const t = document.createElement('div'); t.className = 'toast'; if (color) t.style.borderLeftColor = color; t.innerHTML = html; box.appendChild(t);
  setTimeout(() => t.remove(), 2600);
}

// ---------- eventi della simulazione ----------
const capQueue = [];
let lvlToastAt = 0;
function handle(ev) {
  for (const e of ev) {
    if (e.type === 'dmg' && e.side === 'e') snd(e.crit ? 'crit' : 'hit');
    if (e.type === 'dmg') { const el = (e.side === 'p' ? pEls : eEls)[e.idx]; floatText(el, cfmt(e.dmg), e.crit ? 'crit' : (e.side === 'p' ? 'hurt' : '')); }
    else if (e.type === 'atk') { lunge((e.side === 'p' ? pEls : eEls)[e.idx], e.side === 'p' ? 8 : -8); if (e.side === 'e') knAnim(eEls[e.idx], 'atk', 800); if (e.side === 'p') { const el = pEls[e.idx]; const two = el && (el._k = !el._k); knAnim(el, two ? 'atk2' : 'atk', two ? 400 : 450); } }
    else if (e.type === 'skill') { floatText(pEls[e.idx], e.name, 'skill'); knAnim(pEls[e.idx], 'sk', 450); }
    else if (e.type === 'heal') { floatText(pEls[e.idx], '+' + cfmt(e.h), 'heal'); }
    else if (e.type === 'dodge') { if (e.side === 'p') knAnim(pEls[e.idx], 'dg', 450); }
    else if (e.type === 'kill') { snd('kill'); dirty = true; }
    else if (e.type === 'drop') { const r = F.ITEM_RARITY.find(x => x.key === e.item.rarity); if (e.item.rarity !== 'comune') toast(`Trovato: <b class="${r.rainbow ? 'rbw' : ''}" style="color:${r.color}">${esc(F.itemName(e.item))}</b> · ${r.label}`, r.color); dirty = true; }
    else if (e.type === 'level') { const now = Date.now(); if (now - lvlToastAt > 4000) { lvlToastAt = now; snd('level'); toast(`${esc(S.roster[e.id].name)} sale al livello ${e.lvl}`); } dirty = true; }
    else if (e.type === 'capture') { snd('capture'); capQueue.push(e.species); dirty = true; }
    else if (e.type === 'rare') { snd('rare'); setTimeout(shareDrops, 500); const r = F.ITEM_RARITY.find(x => x.key === e.item.rarity); banner('DROP ' + r.label.toUpperCase() + '!'); toast(`<b class="${r.rainbow ? 'rbw' : ''}" style="color:${r.color}">${r.label}!</b> ${esc(F.itemName(e.item))}`, r.color); dirty = true; }
    else if (e.type === 'lost') { if (!window._lostAt || Date.now() - window._lostAt > 20000) { window._lostAt = Date.now(); toast('<b style="color:#FF8A96">Zaino pieno:</b> gli oggetti nuovi vanno persi', '#FF8A96'); } }
    else if (e.type === 'stone') { toast(`${ipx('pietra', 14)} +1 <b style="color:#5BD8E6">Pietra del rimescolo</b>`, '#5BD8E6'); dirty = true; }
    else if (e.type === 'rune') { const r = F.RUNE[e.rune]; toast(`${icon('rune', r.color, 14)} +${e.n} <b style="color:${r.color}">${r.label}</b>`, r.color); dirty = true; }
    else if (e.type === 'unlock') { toast(e.text, '#F2C14E'); dirty = true; }
    else if (e.type === 'zonetime') { const m = Math.floor(e.t / 60), sec = Math.round(e.t % 60); toast(`Zona ${e.zone} completata in <b>${m}:${String(sec).padStart(2, '0')}</b>${e.best ? ' · nuovo record!' : ''}`, '#F2C14E'); }
    else if (e.type === 'battle') { buildScene(); const sec = B.enemies[0] && B.enemies[0].secret; if (sec) { snd('rare'); toast('<b class="rbw">Boss segreto!</b> Sconfiggilo e si unirà a te', '#B07CF0'); } banner(e.result === 'win' ? (sec ? 'BOSS SEGRETO: ' + F.SPECIES[B.enemies[0].species].name.toUpperCase() : S.battle === F.BOSS_BATTLE ? 'BOSS: ' + F.SPECIES[F.ZONES[S.zone].boss].name.toUpperCase() : (S.battle === 1 ? 'ZONA ' + S.zone + ' · ' : '') + 'BATTAGLIA ' + S.battle) : 'SCONFITTA · SI RIPARTE DALLA BATTAGLIA 1'); dirty = true; }
  }
}

// ---------- HUD ----------
function hud() {
  if (!S.dmgLog || S.dmgLog.zone !== S.zone) S.dmgLog = { since: S.clock || 0, by: {}, zone: S.zone }; // i danni per membro ripartono a ogni zona
  const mr = F.missionsReady(S), bt = document.querySelector('[data-tab=bestiario]'); if (bt) bt.classList.toggle('dot', mr > 0); const shb = document.querySelector('[data-tab=shop]'); if (shb) shb.classList.toggle('dot', F.dailyReady(S));
  $('#gold').textContent = cfmt(S.gold); $('#astri').textContent = cfmt(S.astri);
  const pl = F.planetOf(S.zone); $('#ptitle').textContent = pl.name; $('#where').textContent = `Zona ${S.zone} · Battaglia ${S.battle}/30`;
  scene().classList.toggle('p1', pl === F.PLANETS[0]); scene().classList.toggle('p2', pl === F.PLANETS[1]); scene().classList.toggle('p3', pl === F.PLANETS[2]); scene().classList.toggle('p4', pl === F.PLANETS[3]);
  $('#prog').style.width = (100 * S.battle / 30) + '%';
  $('#testbadge').hidden = !S.settings.test;
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
  return `<div class="chips">${chips}<span class="chip${all ? '' : ' off'}">${all ? '★' : '☆'} Tutte le classi <em>${all ? '+' + Math.round(F.SYN_ALL * 100) + '%' : ''}</em></span></div><div class="note">Classi uguali: +5% con 2, +12% con 4, +20% con 6 (vita e attacco). Con tutte e 5 le classi in squadra: +8% a tutti.</div>`;
}
// Statistiche di un oggetto, in stile scheda
function statsHTML(it, lv) {
  const sm = 1 + 0.1 * (lv || 0), main = F.mainStats(it), r = F.ITEM_RARITY.find(x => x.key === it.rarity);
  const val = (k, v) => F.PCT_STATS.includes(k) ? (v * sm * 100).toFixed(2).replace('.', ',') + '%' : (v * sm).toLocaleString('it-IT', { maximumFractionDigits: 1 });
  const rows = Object.keys(main).map(k => `<div class="srow2"><span>${F.STAT_LABEL[k]}</span><b>${val(k, main[k])}</b></div>`).join('');
  const bon = (it.bonus || []).map(b => `<div class="srow2 bon"><span><i style="background:${r.color}"></i>${F.STAT_LABEL[b.k]}</span><b>${val(b.k, F.bonusValue(it, b))}</b></div>`).join('');
  return `<div class="stbox">${rows}${bon ? `<div class="sthead">Bonus</div>${bon}` : ''}<div class="srow2 val"><span>${icon('coin', '#F2C14E', 12)} Valore</span><b>${fmt(F.sellValue(it, S))}</b></div>${lv ? `<div class="sthead" style="color:#5BD8E6">Slot +${lv}: +${lv * 10}% agli attributi</div>` : ''}</div>`;
}
function fullStats(st) {
  const pc = v => (v * 100).toFixed(1).replace('.', ',') + '%';
  const rows = [['Gittata', String(F.CLASSES[st.cls].range)], ['Vita', fmt(st.hp)], ['Attacco', fmt(st.atk)], ['Difesa', String(st.def).replace('.', ',')], ['Attacchi al secondo', (1 / st.spd).toFixed(2).replace('.', ',')], ["Vel. d'attacco", '+' + pc(st.aspd)], ['Prob. critico', pc(st.crit)], ['Danni critici', pc(st.critDmg)], ['Blocco', pc(st.block)], ['Schivata', pc(st.dodge)]];
  return `<div class="fstats">${rows.map(([l, v]) => `<div><span>${l}</span><b>${v}</b></div>`).join('')}</div>`;
}
function ptsHTML(id) {
  const m = S.roster[id], p = F.ptsOf(m), free = F.ptsFree(m);
  return `<div class="ptsbox"><div class="ptshead"><b>Punti statistica</b><span class="${free ? 'pfree' : ''}">${free} da assegnare</span><button class="sb" data-act="ptsreset" data-id="${id}">Azzera</button></div>
  ${Object.keys(F.ATTRS).map(k => { const a = F.ATTRS[k]; return `<div class="ptsrow"><span class="pn2" style="color:${a.color}">${a.ic} ${a.name} <b>${p[k]}</b></span><span class="pd">${a.desc}</span><span class="pb2">${[-10, -1].map(n => `<button class="ib" data-act="pts" data-id="${id}" data-k="${k}" data-n="${n}" ${p[k] ? '' : 'disabled'}>${n}</button>`).join('')}${[1, 10].map(n => `<button class="ib" data-act="pts" data-id="${id}" data-k="${k}" data-n="${n}" ${free ? '' : 'disabled'}>+${n}</button>`).join('')}<button class="ib" data-act="pts" data-id="${id}" data-k="${k}" data-n="999" ${free ? '' : 'disabled'}>Max</button></span></div>`; }).join('')}
  <div class="note">${F.PTS_PER_LEVEL} punti a ogni livello. Puoi azzerarli gratis quando vuoi.</div></div>`;
}
function memberRow(id, inTeam, i) {
  const m = S.roster[id], sp = F.SPECIES[m.species], cls = sp.cls, st = F.memberStats(S, id), open = openMember === id;
  const need = F.xpNeed(m.lvl);
  let html = `<div class="card mrow" style="border-left:3px solid ${CC(cls)}">
  <button class="mhead" data-act="openm" data-id="${id}" aria-expanded="${open}">
    <div class="mspr">${sprite(m.species, 2)}</div>
    <div class="minfo"><div class="mname">${esc(m.name)}${m.locked ? ' ' + icon('lock', '#A9B0D6', 13) : ''}${F.ptsFree(m) ? ` <span class="ptsdot">+${F.ptsFree(m)}</span>` : ''}</div><div class="msub"><span style="color:${CC(cls)}">${cls}</span> · Lv ${m.lvl} · Potere ${fmt(F.memberPower(S, id))}</div><div class="xp"><b style="width:${100 * m.xp / need}%"></b></div></div>
  </button>`;
  html += `<button class="eqb" data-act="equip" data-id="${id}" aria-label="Equipaggiamento di ${esc(m.name)}">${itemIcon('corazza', cls, '#F2C14E', 18)}</button>`;
  if (inTeam) html += `<div class="mbtns"><button class="ib" data-act="up" data-id="${id}" aria-label="Sposta su" ${i === 0 ? 'disabled' : ''}>${icon('up')}</button><button class="ib" data-act="down" data-id="${id}" aria-label="Sposta giù" ${i === S.team.length - 1 ? 'disabled' : ''}>${icon('down')}</button></div>`;
  else html += `<div class="mbtns"><button class="sb" data-act="add" data-id="${id}" ${F.teamFull(S) ? 'disabled' : ''}>Aggiungi</button></div>`;
  html += `</div>`;
  if (open) {
    html += `<div class="card detail">
    ${fullStats(st)}
    <div class="abil"><b style="color:${CC(cls)}">${F.CLASSES[cls].ability}</b> · ${F.CLASSES[cls].desc}</div>
    ${ptsHTML(id)}
    <div class="row2"><label class="tg"><input type="checkbox" data-act="lockm" data-id="${id}" ${m.locked ? 'checked' : ''}> Blocca equipaggiamento</label>${inTeam && !F.isHero(id) ? `<button class="sb" data-act="bench" data-id="${id}">Metti in riserva</button>` : ''}</div>
    <form class="rename" data-id="${id}"><label for="rn-${id}">Nome</label><input id="rn-${id}" maxlength="16" value="${esc(m.name)}"><button class="sb" type="submit">Salva</button></form>
    </div>`;
  }
  return html;
}
function eqHTML(id) {
  const m = S.roster[id], cls = F.SPECIES[m.species].cls;
  return `<div class="eqgrid">${F.SLOTS.map(sl => { const it = m.eq[sl], lv = m.slv[sl] || 0, k = F.kindOf(sl), sel = selSlot === id + ':' + sl;
      const r = it ? F.ITEM_RARITY.find(x => x.key === it.rarity) : null, col = r ? r.color : '#4A5088';
      return `<button class="eqt${sel ? ' sel' : ''}${it ? '' : ' empty'}${it && F.rarityIndex(it.rarity) >= 4 ? ' fx fx-' + it.rarity : ''}" style="border-color:${col};--c:${col}" data-act="selslot" data-id="${id}" data-slot="${sl}" aria-label="${F.SLOT_LABEL[sl]}${it ? ': ' + esc(F.itemName(it)) : ' vuoto'}">${itemIcon(k, it ? it.cls : cls, col, 22)}<span>${it ? cfmt(Math.round(F.itemPower(it) * (1 + 0.1 * lv))) : F.SLOT_LABEL[sl]}</span>${lv ? `<i>+${lv}</i>` : ''}</button>`; }).join('')}</div>
    ${(() => { if (!selSlot || selSlot.split(':')[0] !== id) return '<div class="note">Tocca un posto per vederlo, togliere l\'oggetto o potenziare lo slot.</div>';
      const sl = selSlot.split(':')[1], it = m.eq[sl], lv = m.slv[sl] || 0, c = F.slotCost(lv), rk = F.slotRune(lv), rr = F.RUNE[rk];
      const r = it ? F.ITEM_RARITY.find(x => x.key === it.rarity) : null;
      return `<div class="card eqdet" style="border-color:${r ? r.color : 'var(--line)'}"><div><b style="color:${r ? r.color : 'var(--muted)'}">${it ? esc(F.itemName(it)) : F.SLOT_LABEL[sl] + ' vuoto'}</b><div class="msub">${it ? r.label + ' · ' + F.SLOT_LABEL[F.kindOf(sl)] + ' · ' : ''}slot +${lv}</div>${it ? statsHTML(it, lv) : ''}</div>
      <div class="row2">${it ? `<button class="sb" data-act="uneq" data-id="${id}" data-slot="${sl}">Togli</button>` : ''}<button class="sb" data-act="slotup" data-id="${id}" data-slot="${sl}" ${lv >= 10 || S.runes[rk] < c ? 'disabled' : ''}>${lv >= 10 ? 'Slot al massimo' : `Potenzia slot · ${c} runa <span style="color:${rr.color}">${rr.label.replace('Runa ', '')}</span>`}</button></div></div>`; })()}
  <div class="note">Il livello dello slot resta anche se cambi oggetto: +10% al potere per livello.</div>`;
}
function showEquip(id) {
  equipOpen = id; const m = S.roster[id], sp = F.SPECIES[m.species], st = F.memberStats(S, id);
  $('#modal').innerHTML = `<div class="mod eqmod" role="dialog" aria-modal="true" aria-labelledby="eqt"><div class="eqhead"><div class="mspr">${sprite(m.species, 3)}</div><div><h2 id="eqt" style="text-align:left;font-size:20px;margin:0">${esc(m.name)}</h2><div class="msub"><span style="color:${CC(sp.cls)}">${sp.cls}${sp.tough ? ' robusto' : ''}</span> · Lv ${m.lvl} · Potere ${fmt(F.memberPower(S, id))}</div></div><button class="ib" data-act="close" aria-label="Chiudi" style="margin-left:auto">✕</button></div>
  ${fullStats(st)}
  ${eqHTML(id)}
  ${bagForMember(id)}</div>`;
  $('#modal').hidden = false;
}
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
  <div class="igrid">${inv.map(it => { const r = F.ITEM_RARITY.find(x => x.key === it.rarity), cur = m.eq[F.targetSlot(m, it)], up = !cur || F.itemPower(it) > F.itemPower(cur); return `<button class="it${eqSel === it.id ? ' sel' : ''}${F.rarityIndex(r.key) >= 4 ? ' fx fx-' + r.key : ''}" style="border-color:${r.color};--c:${r.color}" data-act="eqpick" data-item="${it.id}">${itemIcon(it.slot, it.cls, r.color, 22)}<b>${cfmt(F.itemPower(it))}</b>${up ? '<i class="upar">▲</i>' : ''}</button>`; }).join('') || '<div class="note" style="grid-column:1/-1">Nessun oggetto adatto nello zaino.</div>'}</div>`;
}
function dmgHTML() { const d = S.dmgLog || { by: {}, since: S.clock || 0 }, ids = Object.keys(d.by).filter(id => S.roster[id]).sort((a, b) => d.by[b] - d.by[a]), tot = ids.reduce((x, id) => x + d.by[id], 0), secs = Math.max(1, (S.clock || 0) - d.since);
    return `<div class="ph"><h2>Danni per membro</h2><button class="sb" data-act="dmgreset" style="min-height:28px;font-size:11px">Azzera</button></div>
    <div class="card">${ids.length ? ids.map(id => { const m = S.roster[id], c = CC(F.SPECIES[m.species].cls); return `<div class="dmrow"><span class="dmn">${esc(m.name)}</span><div class="dmbar"><b style="width:${100 * d.by[id] / d.by[ids[0]]}%;background:${c}"></b></div><span class="dmv">${cfmt(d.by[id] / secs)}/s · ${Math.round(100 * d.by[id] / tot)}%</span></div>`; }).join('') : '<div class="note">Nessun dato ancora.</div>'}<div class="msub" style="margin-top:4px">Danni medi al secondo e quota sul totale nella zona attuale, da ${dur(secs)} di battaglie. Si azzerano a ogni cambio di zona.</div></div>`; }
let showDmg = false;
function pSquadra() {
  const slots = F.slotCount(S), n = F.creaturesInTeam(S);
  const reserve = Object.keys(S.roster).filter(id => !S.team.includes(id));
  return `<div class="ph"><h2>Squadra</h2><span>creature ${n}/${slots} (max ${F.CREATURE_SLOTS}) · eroi esclusi</span></div>
  <button class="sb" data-act="dmgtoggle" style="width:100%;margin-bottom:6px">${showDmg ? 'Nascondi i danni per membro' : 'Mostra i danni per membro'}</button>
  ${showDmg ? dmgHTML() : ''}
  <div class="slotgrid">${Array.from({ length: F.CREATURE_SLOTS }, (_, i) => { const crea = S.team.filter(id => !F.isHero(id)), id = crea[i];
    if (i < F.slotCount(S)) return id ? `<button class="sl2" style="border-color:${CC(F.SPECIES[S.roster[id].species].cls)}" data-act="openm" data-id="${id}">${sprite(S.roster[id].species, 2)}<span>Lv ${S.roster[id].lvl}</span></button>` : `<div class="sl2 empty"><span>Libero</span></div>`;
    const z = F.SLOT_UNLOCKS[i - F.BASE_SLOTS]; return `<div class="sl2 lock">${icon('lock', '#7C84BC', 14)}<span>Zona ${z}${z > F.MAX_ZONE ? '<br><small>presto</small>' : ''}</span></div>`; }).join('')}</div>
  <div class="note">8 posti di base, +1 in automatico ogni 5 zone completate: massimo 12 alleati. Gli eroi non occupano posti.</div>
  ${synergyHTML()}
  <div class="note">L'ordine conta: chi sta più in alto riceve per primo l'equipaggiamento.</div>
  ${S.team.map((id, i) => memberRow(id, true, i)).join('')}

  ${reserve.length ? `<div class="ph"><h2>Riserva</h2><span>${reserve.length}</span></div>${reserve.map(id => memberRow(id, false)).join('')}` : ''}`;
}
function rcls(r) { return r.rainbow ? ' rbw' : ''; }
function itemGrid(list, empty, sellMode) {
  return `<div class="igrid">${list.map(it => { const r = F.ITEM_RARITY.find(x => x.key === it.rarity), prot = F.isProtected(S, it); return `<button class="it${selItem === it.id ? ' sel' : ''}${F.rarityIndex(r.key) >= 4 ? ' fx fx-' + r.key : ''}" style="border-color:${r.color};--c:${r.color}" data-act="selit" data-item="${it.id}" aria-label="${esc(F.itemName(it))}, ${r.label}, potere ${F.itemPower(it)}">${itemIcon(it.slot, it.cls, r.color, 22)}<b>${cfmt(F.itemPower(it))}</b><em>${sellMode ? (prot ? 'protetto' : cfmt(F.sellValue(it, S)) + ' oro') : it.cls ? it.cls : F.SLOT_LABEL[it.slot]}</em><i class="ilv">${F.itemLevel(it)}</i>${it.isNew ? '<i>nuovo</i>' : ''}${(it.locked || (prot && sellMode)) ? `<i class="plk">${icon('lock', '#F2C14E', 10)}</i>` : ''}</button>`; }).join('') || `<div class="note" style="grid-column:1/-1">${empty}</div>`}</div>`;
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
  if (where === 'chest') return `<div class="card idet" style="border-color:${r.color}">${head}${rerollHTML(it)}<div class="row2"><button class="pb" data-act="fromchest" data-item="${it.id}" ${S.inventory.length >= F.bagCap(S) ? 'disabled' : ''}>↑ Sposta nello zaino</button>${lockBtn}</div></div>`;
  if (where === 'shop') return `<div class="card idet" style="border-color:${r.color}">${head}<div class="row2">${sellBtn}</div></div>`;
  const users = Object.keys(S.roster).filter(id => F.canUse(S.roster[id], it));
  return `<div class="card idet" style="border-color:${r.color}">${head}
      ${users.length ? `<div class="row2"><label for="eqsel">Equipaggia a</label><select id="eqsel">${users.map(id => { const c = S.roster[id].eq[F.targetSlot(S.roster[id], it)]; return `<option value="${id}">${esc(S.roster[id].name)} (ora ${c ? fmt(F.itemPower(c)) : '—'})</option>`; }).join('')}</select><button class="sb" data-act="eqto" data-item="${it.id}">Equipaggia</button></div>` : `<div class="note">Nessuno nella tua collezione può usarlo.</div>`}
      ${rerollHTML(it)}
      <div class="row2">${(() => { const n = F.nextRarity(it); if (!n) return ''; const rr = F.RUNE[n], nr = F.ITEM_RARITY.find(x => x.key === n); return `<button class="sb" data-act="raise" data-item="${it.id}" ${S.runes[n] < 1 ? 'disabled' : ''}>Porta a <b style="color:${nr.color}">${nr.label}</b> · 1 ${rr.label.toLowerCase()} (${S.runes[n]})</button>`; })()}<button class="sb" data-act="tochest" data-item="${it.id}" ${S.chest.length >= F.chestCap(S) ? 'disabled' : ''}>↓ Nel forziere</button>${sellBtn}</div>
    </div>`;
}
let selRune = null, selShop = null;
function runeTiles() {
  return `<div class="igrid"><button class="it${selRune === 'stone' ? ' sel' : ''}" style="border-color:#5BD8E6;--c:#5BD8E6" data-act="selrune" data-k="stone">${ipx('pietra', 22)}<b>${fmt(S.stones || 0)}</b><em>rimescolo</em></button>${Object.keys(F.RUNE).map(k => { const r = F.RUNE[k]; return `<button class="it${selRune === k ? ' sel' : ''}" style="border-color:${r.color};--c:${r.color}" data-act="selrune" data-k="${k}" aria-label="${r.label}: ${S.runes[k]}">${icon('rune', r.color, 22)}<b>${fmt(S.runes[k])}</b><em>${r.label.replace('Runa ', '')}</em></button>`; }).join('')}</div>`;
}
function runeDetail(k) {
  if (k === 'stone') return `<div class="card idet" style="border-color:#5BD8E6"><div class="iname" style="color:#5BD8E6;display:flex;align-items:center;gap:6px">${ipx('pietra', 26)}Pietra del rimescolo × ${fmt(S.stones || 0)}</div><div class="msub">Cambia a caso i bonus di un oggetto: tocca l'oggetto e usa "Rimescola i bonus". Costa 1 pietra, il doppio per ogni bonus che blocchi. È rara: cade dai nemici circa una volta ogni 3 giorni.</div></div>`;
  const r = F.RUNE[k], n = S.runes[k], nr = F.ITEM_RARITY.find(x => x.key === k);
  return `<div class="card idet" style="border-color:${r.color}"><div class="iname" style="color:${r.color};display:flex;align-items:center;gap:6px">${icon('rune', r.color, 26)}${r.label} × ${fmt(n)}</div>
    <div class="msub">Porta un oggetto a <b style="color:${nr.color}">${nr.label}</b> e potenzia di 1 livello uno slot.</div>
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
function pZaino() {
  const inBag = selItem && S.inventory.find(x => x.id === selItem), inChest = selItem && S.chest.find(x => x.id === selItem);
  const det = inBag ? itemDetail(inBag, 'bag') : inChest ? itemDetail(inChest, 'chest') : '';
  return `<div class="row2"><button class="pb" data-act="equipall">Equipaggia tutto</button><button class="sb" data-act="sellrest">Vendi il resto</button><button class="sb" data-act="fuseopen">Fusione</button></div>
  <div class="card autos3"><span class="autol">Scarta in automatico</span>${(() => { const k = F.minKeep(S); return [['comune', 1], ['noncomune', 2]].map(([key, lvl]) => { const r = F.ITEM_RARITY.find(x => x.key === key), on = k >= lvl, needPass = lvl > 1 && !F.hasPass(S); return `<button class="atog${on ? ' on' : ''}" style="--c:${r.color}" data-act="atog" data-k="${key}"><span>${r.label}</span>${needPass ? `<b class="passov">${icon('lock', '#1B1F3B', 9)} PASS</b>` : ''}</button>`; }).join(''); })()}</div>
  <div class="note" style="margin-top:-2px">Tocca per scartare: gli oggetti barrati si vendono in oro appena cadono. Rune, oggetti bloccati e rarità protette non si vendono mai.</div>
  <div class="ph"><h2 style="font-size:13px">Rune</h2><span>non occupano spazio</span></div>
  ${runeTiles()}
  <div class="ph"><h2 style="font-size:13px">Zaino</h2><span${S.inventory.length >= F.bagCap(S) ? ' style="color:#FF8A96"' : ''}>${S.inventory.length}/${F.bagCap(S)}</span></div>
  ${itemGrid(byPower(S.inventory), 'Vuoto. Gli oggetti cadono dai nemici sconfitti.')}
  <div class="ph"><h2 style="font-size:13px">Forziere</h2><span>${S.chest.length}/${F.chestCap(S)}</span></div>
  ${itemGrid(byPower(S.chest), 'Tocca un oggetto dello zaino e premi "Nel forziere" per conservarlo qui.')}
  <div class="note">${F.hasPass(S) ? 'Spazio raddoppiato dal Pass Astrale.' : `Col Pass Astrale zaino e forziere raddoppiano (${F.bagCap(S) * 2} posti).`} Le rune non occupano spazio. A zaino pieno i nuovi oggetti vanno persi: libera spazio o attiva la vendita automatica.</div>`;
}
function runeBar() { return `<div class="runebar">${Object.keys(F.RUNE).map(k => { const r = F.RUNE[k]; return `<span title="${r.label}">${icon('rune', r.color, 16, r.label)}<b>${fmt(S.runes[k])}</b></span>`; }).join('')}</div>`; }
function pShop() {
  const left = Math.max(0, F.nextMidnight(Date.now()) - Date.now()), h = Math.floor(left / 3600000), mi = Math.floor(left % 3600000 / 60000), ready = F.dailyReady(S);
  return `<div class="ph"><h2>Shop</h2><span>${icon('gem', '#F49AC1', 14)} ${fmt(S.astri)} Astri</span></div>
  <div class="card daily"><div style="flex:1"><b>Regalo del giorno</b><div class="msub">${ready ? 'Gratis, una volta al giorno.' : `Già riscosso. Il prossimo tra ${h} h ${mi} min (a mezzanotte).`}</div></div><div class="big">${F.DAILY_ASTRI} ${icon('gem', '#F49AC1', 18)}</div><button class="pb" data-act="daily" ${ready ? '' : 'disabled'}>${ready ? 'Riscuoti' : 'Fatto'}</button></div>
  <div class="ph"><h2 style="font-size:13px">Rune</h2><span>si pagano in Astri</span></div>
  <div class="sgrid runes4">${Object.keys(F.RUNE_BUY).map(k => { const r = F.RUNE[k]; return `<div class="card sitem" style="border-color:${r.color}">${icon('rune', r.color, 24)}<b style="color:${r.color}">${r.label.replace('Runa ', '')}</b><span>→ ${F.ITEM_RARITY.find(x => x.key === k).label}</span><span>hai ${fmt(S.runes[k])}</span><button class="pb" data-act="buyrune" data-k="${k}" ${S.astri < F.RUNE_BUY[k] ? 'disabled' : ''}>${F.RUNE_BUY[k]} ${icon('gem', '#1B1F3B', 11)}</button></div>`; }).join('')}</div>
  <div class="ph"><h2 style="font-size:13px">Oro</h2><span>cresce con la zona più lontana raggiunta</span></div>
  <div class="sgrid gold3">${F.GOLD_PACKS.map((p, i) => `<div class="card sitem">${icon('coin', '#F2C14E', 26)}<b style="color:var(--gold)">${cfmt(F.goldPack(S, i))}</b><span>≈ ${p.hours} ore di battaglie</span><button class="pb" data-act="buygold" data-i="${i}" ${S.astri < p.astri ? 'disabled' : ''}>${p.astri} ${icon('gem', '#1B1F3B', 11)}</button></div>`).join('')}</div>
  <div class="ph"><h2 style="font-size:13px">Spazio</h2><span>+${F.SPACE_PACK.n} posti per sempre · max ${F.SPACE_PACK.perMonth} al mese</span></div>
  <div class="sgrid">${[['bag', 'Zaino', 'Posti zaino', F.bagCap(S)], ['chest', 'Forziere', 'Posti forziere', F.chestCap(S)]].map(([k, n, l, cap]) => { const left = F.spaceLeft(S, k); return `<div class="card sitem"><b>+${F.SPACE_PACK.n} ${l.toLowerCase()}</b><span>${n} ora: ${cap} posti</span><span>Questo mese: ancora ${left}</span><button class="pb" data-act="buyspace" data-k="${k}" ${left < 1 || S.astri < F.SPACE_PACK.cost ? 'disabled' : ''}>${left < 1 ? 'Finiti per questo mese' : F.SPACE_PACK.cost + ' Astri'}</button></div>`; }).join('')}</div>
  <div class="ph"><h2 style="font-size:13px">Eroi</h2><span>non occupano posti in squadra</span></div>
  ${F.HERO_SHOP.map(h => { const sp = F.SPECIES[h.id], own = !!S.roster[h.id]; return `<div class="card herocard"><div class="mspr">${sprite(h.id, 3)}</div><div style="flex:1"><b>${sp.name}</b><div class="msub"><span style="color:${CC(sp.cls)}">${sp.cls}${sp.tough ? ' robusto' : ''}</span> · ${F.CLASSES[sp.cls].ability}</div><div class="msub"><i>“${sp.quote}”</i></div></div>${own ? '<span class="zdone">Nella squadra</span>' : `<button class="pb" data-act="buyhero" data-id="${h.id}">${h.price}<br><small>prova gratis</small></button>`}</div>`; }).join('')}
  <div class="ph"><h2 style="font-size:13px">Abbonamento</h2></div>
  <div class="card passbig${F.hasPass(S) ? ' on' : ''}"><div class="pbhead"><div class="pbic">${ipx('collana', 44)}</div><div style="flex:1"><b class="pbt">Pass Astrale</b><div class="pbp">${F.PASS_PRICE}</div>${F.hasPass(S) ? `<div class="msub" style="color:#7ED36F">Attivo fino al ${new Date(S.pass).toLocaleDateString('it-IT')}</div>` : ''}</div></div>
   <ul class="pbl"><li><b>×2 oro</b> da ogni nemico</li><li><b>×2 esperienza</b> per tutta la squadra</li><li>Zaino e forziere <b>doppi</b> (${F.bagCap(S) + (F.hasPass(S) ? 0 : 20)} posti)</li><li>Guadagno offline fino a <b>8 ore</b> (invece di 4)</li><li>Vendita automatica anche dei <b>non comuni</b></li></ul>
   <button class="pb wide" data-act="pass">${F.hasPass(S) ? 'Rinnova' : 'Attiva'} · prova gratis</button>${F.hasPass(S) ? '<button class="sb wide" data-act="passoff" style="margin-top:6px;width:100%">Togli il Pass (prova)</button>' : ''}</div>
  <div class="note">Versione di prova: gli acquisti si sbloccano gratis, nessun pagamento reale.</div>`;
}
function pNegozio() {
  const left = Math.max(0, F.nextRefresh(Date.now()) - Date.now()), h = Math.floor(left / 3600000), mi = Math.floor(left % 3600000 / 60000);
  const sel = selItem && S.inventory.find(x => x.id === selItem);
  const pi = F.protectIdx(S);
  return `<div class="ph"><h2>Mercante</h2><span>merce nuova tra ${h} h ${mi} min</span></div>
  <div class="row2"><div class="card wallet" style="flex:1;margin:0">${icon('gem', '#F49AC1', 16)} <b>${fmt(S.astri)}</b> Astri</div><button class="sb" data-act="reroll" ${S.astri < F.REROLL_COST ? 'disabled' : ''}>Rinnova · ${F.REROLL_COST} Astri</button></div>

  <div class="igrid shopg">${S.shop.items.map((it, i) => { const r = F.ITEM_RARITY.find(x => x.key === it.rarity);
    return `<button class="it${selShop === i ? ' sel' : ''}${it.sold ? ' sold' : F.rarityIndex(r.key) >= 4 ? ' fx fx-' + r.key : ''}" style="border-color:${it.sold ? 'var(--line)' : r.color};--c:${r.color}" data-act="selshop" data-i="${i}" aria-label="${esc(F.itemName(it))}, ${r.label}, ${it.price} Astri">${itemIcon(it.slot, it.cls, r.color, 24)}<b>${cfmt(F.itemPower(it))}</b><em>${it.sold ? 'venduto' : it.price + ' Astri'}</em></button>`; }).join('')}</div>
  <div class="note">Tocca un oggetto per vedere i bonus. Cambia merce alle 0, alle 8 e alle 16, con le stesse probabilità dei drop.</div>
  <div class="ph"><h2>Il tuo zaino</h2><span>${S.inventory.length}/${F.bagCap(S)} · tocca per vendere</span></div>
  <div class="row2"><label for="prot">Tieni sempre</label><select id="prot" data-act="prot">${F.ITEM_RARITY.slice(1).map((r, k) => `<option value="${r.key}" ${pi === k + 1 ? 'selected' : ''}>da ${r.label} in su</option>`).join('')}<option value="none" ${pi >= F.ITEM_RARITY.length ? 'selected' : ''}>Nessuna protezione</option></select></div>
  <button class="sb wide" data-act="sellrest">Vendi tutto ciò che non migliora nessuno</button>
  ${itemGrid(byPower(S.inventory), 'Zaino vuoto.', true)}
  ${(S.sold || []).length ? `<div class="ph"><h2 style="font-size:13px">Riacquista</h2><span>ultimi 10 venduti, allo stesso prezzo</span></div>
  ${S.sold.map((e, i) => { const r = F.ITEM_RARITY.find(x => x.key === e.it.rarity); return `<div class="card srow"><div style="display:flex;align-items:center;gap:8px">${itemIcon(e.it.slot, e.it.cls, r.color, 22)}<div><b class="${r.rainbow ? 'rbw' : ''}" style="color:${r.color}">${esc(F.itemName(e.it))}</b><div class="msub">${r.label} · Lv ${F.itemLevel(e.it)}</div></div></div><button class="sb" data-act="buyback" data-i="${i}" ${S.gold < e.g || S.inventory.length >= F.bagCap(S) ? 'disabled' : ''}>${cfmt(e.g)} oro</button></div>`; }).join('')}` : ''}
  <div class="ph"><h2 style="font-size:13px">Rune</h2><span>non occupano spazio · tocca per vendere</span></div>
  ${runeTiles()}`;
}
function pBestiario() {
  const n = F.capturedCount(S), tot = F.ALL_SPECIES.length, ready = F.missionsReady(S);
  return `<div class="ph"><h2>Bestiario</h2><span>${n}/${tot}${ready ? ` · <b style="color:var(--gold)">${ready} missioni da riscuotere</b>` : ''}</span></div>
  <div class="bar"><b style="width:${100 * n / tot}%"></b></div>
  <div class="note">Ogni creatura si cattura una sola volta. Quelle già sconfitte si vedono a colori, il nome si scopre con la cattura. Torna nella zona indicata per cercare quelle che mancano.</div>
  ${F.PLANETS.map(pl => `<div class="ph"><h2 style="font-size:13px">${pl.name}</h2><span>${pl.species.filter(k => S.roster[k]).length}/${pl.species.length} · zone ${pl.zones[0]}-${pl.zones[1]}</span></div>
  <div class="bgrid">${pl.species.map(k => { const sp = F.SPECIES[k], m = S.roster[k], rar = F.RARITY[sp.rarity].label, z = F.zoneOf(k);
    const mis = missionHTML(k);
    if (m) return `<div class="card best"><div class="bspr">${sprite(k, 3)}</div><b>${esc(m.name)}</b><span style="color:${CC(sp.cls)}">${sp.cls}${sp.tough ? ' robusto' : ''}</span><em>${rar}</em><small>Zona ${z} · dopo ${fmt(m.waitKills)} incontri</small>${mis}</div>`;
    return `<div class="card best"><div class="bspr">${sprite(k, 3, (S.kills && S.kills[k]) ? undefined : { sil: true })}</div><b>???</b><span>&nbsp;</span><em>${rar}</em><small>${z <= S.maxZone ? 'Zona ' + z + ' · incontri ' + fmt(S.hunt[k] || 0) : 'Zona ' + z + ' (bloccata)'}</small>${mis}</div>`; }).join('')}</div>`).join('')}
  ${secretHTML()}`;
}
function secretHTML() {
  const L = F.SECRET_SPECIES, n = L.filter(k => S.roster[k]).length;
  return `<div class="ph"><h2 style="font-size:13px" class="rbw">Boss segreti</h2><span>${n}/${L.length}</span></div>
  <div class="note">Molto di rado, al posto del boss di zona compare la sua versione gigante. Se lo sconfiggi si unisce subito alla squadra, più forte del ${Math.round((F.SECRET_MULT - 1) * 100)}%.</div>
  <div class="bgrid">${L.map(k => { const sp = F.SPECIES[k], m = S.roster[k], z = F.zoneOf(k);
    return m ? `<div class="card best sec"><div class="bspr">${sprite(k, 3)}</div><b>${esc(m.name)}</b><span style="color:${CC(sp.cls)}">${sp.cls}${sp.tough ? ' robusto' : ''}</span><em class="rbw">Segreto</em><small>Zona ${z}</small></div>`
      : `<div class="card best"><div class="bspr">${sprite(k, 3, (S.kills && S.kills[k]) ? undefined : { sil: true })}</div><b>???</b><span>&nbsp;</span><em>Segreto</em><small>Zona ${z}</small></div>`; }).join('')}</div>`;
}
function missionHTML(k) {
  const t = F.missionTier(S, k), kills = (S.kills && S.kills[k]) || 0;
  const stars = [0, 1, 2].map(i => `<i class="${i < t ? 'on' : ''}"></i>`).join('');
  if (t >= 3) return `<div class="mis"><div class="mstars">${stars}</div><span class="mdone">Missioni completate</span></div>`;
  const goal = F.missionGoal(k, t), r = F.missionReward(k, t), rr = F.RUNE[r.rune[0]], ready = kills >= goal;
  return `<div class="mis"><div class="mstars">${stars}</div><span>Sconfiggi ${fmt(Math.min(kills, goal))}/${fmt(goal)}</span><div class="bar"><b style="width:${Math.min(100, 100 * kills / goal)}%"></b></div>
    <span class="mrew">${r.astri} ${icon('gem', '#F49AC1', 10)} 1 ${icon('rune', rr.color, 10)}</span>
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
  return `<div class="ph"><h2>Mappa</h2><span>zone completate ${S.cleared}/${F.MAX_ZONE}</span></div>
  <div class="note">La campagna avanza solo nella zona più lontana raggiunta; quelle precedenti servono per farmare e catturare le creature mancanti.</div>
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
  <div class="card sdet">${o.r ? `<div style="flex:1">${det}</div><button class="pb" data-act="skybuy" data-id="${o.id}" ${own || !can || S.gold < o.cost ? 'disabled' : ''}>${own ? 'Accesa' : `Accendi<br><small>${cfmt(o.cost)} oro</small>`}</button>` : `<div style="flex:1">${det}</div>`}</div>
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
  <div class="ph"><h2>Impostazioni</h2></div>
  <label class="tg"><input type="checkbox" data-act="sound" ${S.settings.sound !== false ? 'checked' : ''}> Suoni</label>
  <div class="row2"><label for="vol">Volume</label><input id="vol" type="range" min="0" max="1" step="0.1" value="${S.settings.volume ?? 0.5}" data-act="vol" style="flex:1"></div>
  <label class="tg"><input type="checkbox" data-act="test" ${S.settings.test ? 'checked' : ''}> Modalità test: velocità ×5 e catture ×200</label>
  <div class="ph"><h2>Strumenti di test</h2></div>
  <div class="note">Fa avanzare il gioco come se fosse passato questo tempo (senza il limite di ore offline).</div>
  <div class="skips">${[[1, '1 h'], [6, '6 h'], [12, '12 h'], [24, '1 g'], [168, '7 g']].map(([h, l]) => `<button class="sb" data-act="skip" data-h="${h}">+${l}</button>`).join('')}</div>
  <div class="note">Aggiungi risorse per provare il gioco.</div>
  <div class="skips">${[[1e4, '10K'], [1e6, '1M'], [1e8, '100M'], [1e10, '10B']].map(([v, l]) => `<button class="sb" data-act="givegold" data-v="${v}">${icon('coin', '#F2C14E', 12)} +${l}</button>`).join('')}</div>
  <div class="skips">${[100, 1000, 10000].map(v => `<button class="sb" data-act="giveastri" data-v="${v}">${icon('gem', '#F49AC1', 12)} +${fmt(v)}</button>`).join('')}</div>
  <form class="giveform row2"><input id="givev" type="number" min="1" inputmode="numeric" placeholder="Cifra a scelta" aria-label="Cifra"><button class="sb" type="submit" data-give="gold">Oro</button><button class="sb" type="submit" data-give="astri">Astri</button></form>
  <div class="note">Il salvataggio resta in questo browser. Versione del gioco: <b>/*BUILD*/</b></div>
  <button class="sb wide danger" data-act="reset">${confirmReset > Date.now() ? 'Tocca di nuovo: cancella tutto' : 'Ricomincia da zero'}</button>`;
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
  d.style.top = top + 'px'; d.style.setProperty('--ax', Math.max(14, Math.min(pr.width - 14, ax)) + 'px');
  // se esce dal fondo, la apre sopra l'oggetto
  if (top + d.offsetHeight > p.scrollTop + p.clientHeight && ar.top - pr.top > d.offsetHeight + 10) { d.style.top = (ar.top - pr.top + p.scrollTop - d.offsetHeight - 6) + 'px'; d.classList.add('up'); }
  // appena aperta, scorre quanto basta per mostrarla tutta
  if (popKey !== pc[1]) { popKey = pc[1]; const b = d.offsetTop + d.offsetHeight + 8 - (p.scrollTop + p.clientHeight); if (b > 0) p.scrollTop += b; }
}
let popKey = null;
function render() {
  const p = $('#panel');
  const y = p.scrollTop;
  p.innerHTML = tab === 'squadra' ? pSquadra() : tab === 'zaino' ? pZaino() : tab === 'negozio' ? pNegozio() : tab === 'shop' ? pShop() : tab === 'mappa' ? pMappa() : tab === 'bestiario' ? pBestiario() : tab === 'stelle' ? pStelle() : pAltro();
  p.scrollTop = y; placePop();
  if (tab === 'altro') drawChart();
  document.querySelectorAll('.tab').forEach(t => t.setAttribute('aria-current', t.dataset.tab === tab ? 'page' : 'false'));
  dirty = false;
}

// ---------- modali ----------
function showCapture(sp) {
  const m = S.roster[sp], d = F.SPECIES[sp], cls = d.cls, inTeam = S.team.includes(sp);
  const m$ = $('#modal');
  m$.innerHTML = `<div class="mod cap" role="dialog" aria-modal="true" aria-labelledby="capname">
   <div class="kick${d.secret ? ' rbw' : ''}">${d.secret ? 'BOSS SEGRETO CATTURATO' : 'NUOVA CREATURA'}</div>
   <div class="halo"><div class="bob">${sprite(sp, 9)}</div></div>
   <h2 id="capname">${esc(m.name)}</h2>
   <div class="badges"><span class="rb${d.secret ? ' rbw' : ''}">${F.RARITY[d.rarity].label}</span><span class="cb" style="background:${CC(cls)}">${cls}${d.tough ? ' robusto' : ''}</span></div>
   <p class="quote">«${esc(d.quote)}»</p>
   <div class="card"><div class="kv"><span>Pianeta</span><b>${F.planetOf(F.zoneOf(sp)).name}</b></div>${d.secret ? `<div class="kv"><span>Bonus</span><b class="rbw">+${Math.round((F.SECRET_MULT - 1) * 100)}% vita, attacco e difesa</b></div>` : `<div class="kv"><span>Incontri prima della cattura</span><b>${fmt(m.waitKills)}</b></div>`}<div class="kv"><span>Abilità</span><b style="color:${CC(cls)}">${F.CLASSES[cls].ability}</b></div>${d.tough ? `<div class="kv"><span>Robusto</span><b>vita e difesa ×${F.TOUGH.hp}, attacco ×${F.TOUGH.atk}</b></div>` : ''}</div>
   <form class="rename" data-id="${sp}"><label for="capn">Dai un nome</label><input id="capn" maxlength="16" value="${esc(m.name)}"><button class="sb" type="submit">Salva</button></form>
   ${inTeam ? '<div class="note">È già entrata in squadra.</div>' : `<button class="pb wide" data-act="capadd" data-id="${sp}" ${F.teamFull(S) ? 'disabled' : ''}>${F.teamFull(S) ? 'Squadra piena: resta in riserva' : 'Metti in squadra'}</button>`}
   <div class="row2"><button class="discord" data-act="share" data-id="${sp}">Copia per Discord</button><button class="sb" data-act="close">Continua</button></div>
  </div>`;
  m$.hidden = false;
}
function showOffline(r) {
  const h = Math.floor(r.seconds / 3600), mi = Math.floor(r.seconds % 3600 / 60);
  const caps = r.events.filter(e => e.type === 'capture').map(e => S.roster[e.species] ? S.roster[e.species].name : e.species);
  $('#modal').innerHTML = `<div class="mod" role="dialog" aria-modal="true" aria-labelledby="offt">
   <h2 id="offt">Bentornato!</h2>
   <p class="msub">Mentre eri via (${h >= 48 ? Math.round(h / 24) + ' giorni' : h + ' h ' + mi + ' min'}${!r.skip && r.seconds >= F.offlineCap(S) ? `, massimo ${F.offlineCap(S) / 3600} ore${F.hasPass(S) ? '' : ' (8 col Pass)'}` : ''}) la squadra ha combattuto da sola.</p>
   <div class="card"><div class="kv"><span>Nemici sconfitti</span><b>${fmt(r.kills)}</b></div><div class="kv"><span>Oro</span><b>+${cfmt(r.gold)}</b></div><div class="kv"><span>Oggetti trovati</span><b>${fmt(r.items)}</b></div>${F.ITEM_RARITY.filter(x => r.byRar && r.byRar[x.key] > 0).map(x => `<div class="kv sub"><span class="${x.rainbow ? 'rbw' : ''}" style="color:${x.color}">· ${x.label}</span><b>${fmt(r.byRar[x.key])}</b></div>`).join('')}${Object.keys(r.runes).filter(k => r.runes[k] > 0).map(k => `<div class="kv"><span style="color:${F.RUNE[k].color}">${F.RUNE[k].label}</span><b>+${fmt(r.runes[k])}</b></div>`).join('')}
   ${r.levels.map(l => `<div class="kv"><span>${esc(S.roster[l.id].name)}</span><b>Lv ${l.from} → ${l.to}</b></div>`).join('')}</div>
   ${r.lost ? `<div class="card" style="border-color:#FF8A96"><b style="color:#FF8A96">Zaino pieno:</b> ${fmt(r.lost)} oggetti persi. Libera spazio, usa il forziere o attiva la vendita automatica.</div>` : ''}
   ${caps.length ? `<div class="card" style="border-color:#F2C14E"><b style="color:#F2C14E">Catture:</b> ${caps.map(esc).join(', ')}</div>` : ''}
   <button class="pb wide" data-act="close">Raccogli</button></div>`;
  $('#modal').hidden = false;
  r.events.filter(e => e.type === 'capture').forEach(e => capQueue.push(e.species));
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
function closeModal() { equipOpen = null; $('#modal').hidden = true; $('#modal').innerHTML = ''; }

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
function chatRender() {
  const me = S.net && S.net.id, list = $('#chatlist'), atBottom = !list || list.scrollHeight - list.scrollTop - list.clientHeight < 40;
  let body;
  if (chatTab === 'chat') {
    body = `<div class="chatlist" id="chatlist">${chatMsgs.map(m => `<div class="cmsg${m.player_id === me ? ' me' : ''}"><time>${ago(m.created_at)}</time>${m.player_id !== me && me ? `<button class="rep" data-chat="report" data-id="${m.id}" aria-label="Segnala">segnala</button>` : ''}<span class="cn">${esc(m.nickname)}</span>${esc(clean(m.body))}</div>`).join('') || '<div class="note">Ancora nessun messaggio. Rompi il ghiaccio!</div>'}</div>
    ${S.net ? `<form class="chatform" id="chatform"><input id="chatin" maxlength="200" placeholder="Scrivi come ${esc(S.net.nick)}…" autocomplete="off" aria-label="Messaggio"><button class="pb" type="submit">Invia</button></form>`
      : `<form class="chatform" id="nickform"><input id="nickin" maxlength="16" minlength="3" placeholder="Scegli un nickname (3-16)" autocomplete="off" aria-label="Nickname"><button class="pb" type="submit">Entra</button></form><div class="note">Il nickname sarà visibile a tutti e non si può cambiare. Niente insulti: i messaggi segnalati da 3 giocatori spariscono.</div>`}`;
  } else if (chatTab === 'top') {
    const me = S.net && S.net.id;
    body = `<div class="note">Potenza totale: la somma del potere di tutti i tuoi personaggi (squadra e riserva).${S.net ? '' : ' Entra in chat con un nickname per comparire.'}</div><div class="chatlist">${chatTop.map((r, i) => `<div class="cmsg toprow${r.player_id === me ? ' me' : ''}"><b class="tpos">${i < 3 ? ['🥇', '🥈', '🥉'][i] : i + 1}</b><span class="cn" style="flex:1">${esc(r.nickname)}</span><span class="msub">zona ${r.zone} · ${r.creatures} creature</span><b class="tpow">${cfmt(r.power)}</b></div>`).join('') || '<div class="note">Classifica vuota: sii il primo!</div>'}</div>`;
  } else {
    body = `<div class="note">Gli ultimi oggetti Astrale, Arcano, Eterno e Segreto trovati da tutti i giocatori.</div><div class="chatlist">${chatDrops.map(d => { const r = F.ITEM_RARITY.find(x => x.key === d.rarity); return `<div class="cmsg dropg">${itemIcon(d.slot, null, r.color, 20)}<div style="flex:1"><span class="cn">${esc(d.nickname)}</span>ha trovato <b class="${r.rainbow ? 'rbw' : ''}" style="color:${r.color}">${r.label}</b> · ${F.SLOT_LABEL[d.slot] || esc(d.slot)} Lv ${d.ilvl}<div class="msub">Zona ${d.zone} · ${ago(d.created_at)}</div></div></div>`; }).join('') || '<div class="note">Nessun drop raro ancora: il primo potresti essere tu.</div>'}</div>`;
  }
  $('#modal').innerHTML = `<div class="mod chatmod" role="dialog" aria-modal="true" aria-label="Chat globale"><div class="eqhead"><h2 style="margin:0;font-size:18px">Community</h2><button class="ib" data-chat="close" aria-label="Chiudi" style="margin-left:auto">✕</button></div>
  <div class="tabs2"><button class="sb${chatTab === 'chat' ? ' on' : ''}" data-chat="tab" data-v="chat">Chat</button><button class="sb${chatTab === 'drops' ? ' on' : ''}" data-chat="tab" data-v="drops">Drop rari</button><button class="sb${chatTab === 'top' ? ' on' : ''}" data-chat="tab" data-v="top">Classifica</button></div>
  ${chatErr ? `<div class="note" style="color:#FF8A96">${chatErr}</div>` : ''}${body}</div>`;
  $('#modal').hidden = false;
  const l = $('#chatlist'); if (l && atBottom) l.scrollTop = l.scrollHeight;
}
function chatShow() { chatOpen = true; $('#chatbtn').classList.remove('dot'); chatRender(); chatLoad(); clearInterval(chatTimer); chatTimer = setInterval(chatLoad, 6000); }
function chatClose() { chatOpen = false; clearInterval(chatTimer); closeModal(); }
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
async function chatPeek() { if (chatOpen) return; try { const r = await api('it_chat?select=id&order=id.desc&limit=1'); const seen = +(localStorage.getItem('it_seen') || 0); if (r && r[0] && r[0].id > seen) $('#chatbtn').classList.add('dot'); } catch (e) {} }
document.addEventListener('click', async e => {
  const t = e.target.closest('[data-chat]'); if (!t) return;
  const a = t.dataset.chat;
  if (a === 'open') chatShow();
  else if (a === 'close') chatClose();
  else if (a === 'tab') { chatTab = t.dataset.v; chatRender(); chatLoad(); }
  else if (a === 'report') { try { await api('rpc/it_report', { p_token: S.net.token, p_chat_id: +t.dataset.id }); toast('Segnalazione inviata, grazie'); } catch (err) { toast('Segnalazione non riuscita'); } }
});
document.addEventListener('submit', async e => {
  if (e.target.id === 'nickform') {
    e.preventDefault(); const v = $('#nickin').value.trim();
    if (v.length < 3) { toast('Il nickname deve avere almeno 3 caratteri'); return; }
    if (BAD.some(w => v.toLowerCase().includes(w))) { toast('Scegli un nickname senza parolacce'); return; }
    try { const r = await api('rpc/it_register', { p_nickname: v }); S.net = { id: r.id, token: r.token, nick: r.nickname }; save(); toast('Benvenuto in chat, ' + esc(r.nickname) + '!', '#7FE3FF'); shareDrops(); chatRender(); }
    catch (err) { toast(/taken/.test(err.message) ? 'Nickname già usato, scegline un altro' : /check/.test(err.message) ? 'Usa solo lettere, numeri, spazi, _ . -' : 'Registrazione non riuscita'); }
  } else if (e.target.id === 'chatform') {
    e.preventDefault(); const inp = $('#chatin'), v = inp.value.trim(); if (!v) return;
    try { await api('rpc/it_post_message', { p_token: S.net.token, p_body: v }); inp.value = ''; await chatLoad(); const l = $('#chatlist'); if (l) l.scrollTop = l.scrollHeight; }
    catch (err) { toast(/too_fast/.test(err.message) ? 'Piano! Aspetta qualche secondo' : 'Messaggio non inviato'); }
  }
});
setInterval(() => { shareDrops(); chatPeek(); }, 60000); setInterval(shareScore, 600000); setTimeout(() => { shareDrops(); chatPeek(); }, 3000);

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
    if (key === 'comune') S.settings.minRarity = k >= 1 ? 'comune' : 'noncomune';
    else S.settings.minRarity = k >= 2 ? 'noncomune' : 'rara';
    if (F.minKeep(S) > k) { const r = F.sellBelow(S); if (r.n) toast(`Venduti ${r.n} oggetti per ${cfmt(r.gold)} oro`); }
  }
  else if (a === 'goshop') { closeModal(); tab = 'shop'; selItem = null; render(); $('#panel').scrollTop = 0; return; }
  else if (a === 'setkeep') { S.settings.minRarity = t.dataset.k; dirty = true; showAutoSell(); return; }
  else if (a === 'pts') { F.addPts(S, id, t.dataset.k, +t.dataset.n); rebuild(); }
  else if (a === 'ptsauto') { F.autoPts(S, id); rebuild(); }
  else if (a === 'ptsreset') { F.resetPts(S, id); rebuild(); }
  else if (a === 'rrlock') { const i = +t.dataset.i; rrLocks = rrLocks.includes(i) ? rrLocks.filter(x => x !== i) : rrLocks.concat(i); }
  else if (a === 'reroll2') { if (F.rerollBonus(S, item, rrLocks)) { snd('coin'); toast('Bonus rimescolati', '#F49AC1'); } }
  else if (a === 'fuseopen') { showFuse(); return; }
  else if (a === 'fuse') { const it = F.fuse(S, t.dataset.k); if (it) { const r = F.ITEM_RARITY.find(x => x.key === it.rarity); snd('rare'); toast(`Fusione riuscita: <b style="color:${r.color}">${esc(F.itemName(it))}</b>`, r.color); } showFuse(); dirty = true; return; }
  else if (a === 'dmgtoggle') { showDmg = !showDmg; }
  else if (a === 'dmgreset') { S.dmgLog = { since: S.clock || 0, by: {}, zone: S.zone }; }
  else if (a === 'selrune') { selRune = selRune === t.dataset.k ? null : t.dataset.k; selItem = null; }
  else if (a === 'selshop') selShop = selShop === +t.dataset.i ? null : +t.dataset.i;
  else if (a === 'equipall') { const n = F.autoEquip(S); toast(n ? `Equipaggiati ${n} oggetti` : 'Nessun miglioramento disponibile'); }
  else if (a === 'sellrest') { const r = F.sellRest(S); toast(r.n ? `Venduti ${r.n} oggetti per ${cfmt(r.gold)} oro` : 'Niente da vendere'); }
  else if (a === 'eqto') { F.equipTo(S, item, id || $('#eqsel').value); selItem = null; eqSel = null; }
  else if (a === 'eqpick') { eqSel = eqSel === item ? null : item; }
  else if (a === 'sell') { F.sellItem(S, item); selItem = null; }
  else if (a === 'equip') { selSlot = null; eqSel = null; showEquip(id); return; }
  else if (a === 'selslot') { const v = id + ':' + t.dataset.slot; selSlot = selSlot === v ? null : v; }
  else if (a === 'slotup') { if (confirmRune !== 'slot' + id + t.dataset.slot) { confirmRune = 'slot' + id + t.dataset.slot; toast('Tocca di nuovo per usare la runa', '#F2C14E'); setTimeout(() => { confirmRune = null; }, 3000); return; } confirmRune = null; if (F.upgradeSlot(S, id, t.dataset.slot)) rebuild(); }
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
  else if (a === 'buygold') { const g = F.buyGold(S, +t.dataset.i); if (g) toast(`+${cfmt(g)} oro`, '#F2C14E'); }
  else if (a === 'buyspace') { if (F.buySpace(S, t.dataset.k)) toast(`+${F.SPACE_PACK.n} posti ${t.dataset.k === 'bag' ? 'nello zaino' : 'nel forziere'}`, '#F2C14E'); }
  else if (a === 'buyrune') { if (F.buyRune(S, t.dataset.k)) toast(`+1 ${F.RUNE[t.dataset.k].label.toLowerCase()}`, F.RUNE[t.dataset.k].color); }
  else if (a === 'daily') { const g = F.claimDaily(S); if (g) toast(`+${g} ${icon('gem', '#F49AC1', 14)} Astri: regalo del giorno`, '#F49AC1'); }
  else if (a === 'passoff') { F.deactivatePass(S); toast('Pass Astrale tolto', '#F2C14E'); }
  else if (a === 'pass') { F.activatePass(S); toast('Pass Astrale attivo per 30 giorni (versione di prova)', '#F2C14E'); }
  else if (a === 'zone') { if (F.setZone(S, +t.dataset.z)) { rebuild(); banner('ZONA ' + S.zone); } }
  else if (a === 'tree') { F.buyTree(S, t.dataset.k); }
  else if (a === 'treereset') { if (confirmTree > Date.now()) { const b = F.skyReset(S); confirmTree = 0; toast(`Recuperati ${cfmt(b)} oro`); rebuild(); } else confirmTree = Date.now() + 3000; }
  else if (a === 'reset') { if (confirmReset > Date.now()) { S = F.newState(); save(); rebuild(); confirmReset = 0; toast('Nuova partita'); } else confirmReset = Date.now() + 3000; }
  else if (a === 'capadd') { F.addToTeam(S, id); rebuild(); closeModal(); }
  else if (a === 'share') { const m = S.roster[id], d = F.SPECIES[m.species]; const txt = `Ho catturato ${m.name} (${F.RARITY[d.rarity].label}, ${d.cls}) in Frontiera Arcana dopo ${fmt(m.waitKills)} incontri!`; try { navigator.clipboard.writeText(txt).then(() => { t.textContent = 'Copiato!'; }, () => { t.textContent = 'Copia non riuscita'; }); } catch (err) { t.textContent = 'Copia non riuscita'; } return; }
  else if (a === 'close') { closeModal(); }
  else if (a === 'lockm' || a === 'autoeq' || a === 'test' || a === 'minr' || a === 'prot' || a === 'sound' || a === 'vol') return; // gestiti da change
  if (a === 'tree' || a === 'treereset') { /* stelle cambiano le statistiche */ B.party.forEach(() => {}); }
  save(); render(); if (equipOpen && !$('#modal').hidden) { const y = $('#modal .mod') ? $('#modal .mod').scrollTop : 0; showEquip(equipOpen); if ($('#modal .mod')) $('#modal .mod').scrollTop = y; }
});
document.addEventListener('change', e => {
  const t = e.target; const a = t.dataset && t.dataset.act; if (!a) return;
  if (a === 'lockm') S.roster[t.dataset.id].locked = t.checked;
  if (a === 'autoeq') { S.settings.autoEquip = t.checked; if (t.checked) F.autoEquip(S); }
  if (a === 'test') S.settings.test = t.checked;
  if (a === 'minr') S.settings.minRarity = t.value;
  if (a === 'sound') { S.settings.sound = t.checked; if (t.checked) snd('coin'); }
  if (a === 'vol') { S.settings.volume = +t.value; snd('coin'); }
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
  const speed = S.settings.test ? 5 : 1; let left = dt * speed;
  const ev = [];
  while (left > 0) { const d = Math.min(0.05, left); F.step(S, B, d, ev); left -= d; }
  handle(ev); updateScene(); hud();
  if (now - achAt > 1500) { achAt = now; for (const a of F.checkAch(S)) { toast(`Achievement: <b>${esc(a.name)}</b> · +${a.astri} Astri`, '#F2C14E'); dirty = true; } }
  if ($('#modal').hidden && capQueue.length) showCapture(capQueue.shift());
  if (dirty && !skyDrag && now - renderAt > 700 && !document.activeElement.matches('input,select')) { renderAt = now; render(); }
  if (now - saveAt > 10000) { saveAt = now; if (F.ensureShop(S, Date.now())) toast('Il mercante ha nuovi oggetti', '#F49AC1'); save(); }
  requestAnimationFrame(frame);
}
function catchUp() {
  const away = (Date.now() - (S.lastSeen || Date.now())) / 1000;
  if (away > 30) { const r = F.simulateOffline(S, away); F.checkAch(S); save(); showOffline(r); }
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
if (had) catchUp(); else { B = F.startBattle(S); buildScene(); toast('Benvenuto! La squadra combatte da sola: guarda, potenzia, cattura.', '#F2C14E'); }
banner('BATTAGLIA ' + S.battle);
setScroll(); render(); hud();
requestAnimationFrame(t => { last = t; frame(t); });
})();
