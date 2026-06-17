// 周易六十四卦 — hexagram definitions and random generation
// Line order: index 0 = bottom line (初爻), index 5 = top line (上爻)

interface HexagramDef {
  id: number;
  name: string;
  unicode: string;
  upper: { name: string; element: string; nature: string };
  lower: { name: string; element: string; nature: string };
  lines: boolean[]; // true = yang (━━━), false = yin (━ ━), bottom to top
  judgment: string;
}

const TRIGRAMS: Record<string, { name: string; element: string; nature: string }> = {
  "111": { name: "乾", element: "金", nature: "天" },
  "000": { name: "坤", element: "土", nature: "地" },
  "001": { name: "震", element: "木", nature: "雷" },
  "010": { name: "坎", element: "水", nature: "水" },
  "011": { name: "艮", element: "土", nature: "山" },
  "100": { name: "巽", element: "木", nature: "风" },
  "101": { name: "离", element: "火", nature: "火" },
  "110": { name: "兑", element: "金", nature: "泽" },
};

function trigramKey(lines: boolean[]): string {
  return lines.map((l) => (l ? "1" : "0")).join("");
}

const HEXAGRAMS: HexagramDef[] = [
  { id: 1, name: "乾为天", unicode: "䷀", upper: TRIGRAMS["111"], lower: TRIGRAMS["111"], lines: [true,true,true,true,true,true], judgment: "乾：元亨利贞。" },
  { id: 2, name: "坤为地", unicode: "䷁", upper: TRIGRAMS["000"], lower: TRIGRAMS["000"], lines: [false,false,false,false,false,false], judgment: "坤：元亨，利牝马之贞。" },
  { id: 3, name: "水雷屯", unicode: "䷂", upper: TRIGRAMS["010"], lower: TRIGRAMS["001"], lines: [true,false,false,false,true,false], judgment: "屯：元亨利贞。勿用有攸往，利建侯。" },
  { id: 4, name: "山水蒙", unicode: "䷃", upper: TRIGRAMS["011"], lower: TRIGRAMS["010"], lines: [false,true,false,false,false,true], judgment: "蒙：亨。匪我求童蒙，童蒙求我。" },
  { id: 5, name: "水天需", unicode: "䷄", upper: TRIGRAMS["010"], lower: TRIGRAMS["111"], lines: [true,true,true,false,true,false], judgment: "需：有孚，光亨，贞吉。利涉大川。" },
  { id: 6, name: "天水讼", unicode: "䷅", upper: TRIGRAMS["111"], lower: TRIGRAMS["010"], lines: [false,true,false,true,true,true], judgment: "讼：有孚窒惕，中吉，终凶。利见大人，不利涉大川。" },
  { id: 7, name: "地水师", unicode: "䷆", upper: TRIGRAMS["000"], lower: TRIGRAMS["010"], lines: [false,true,false,false,false,false], judgment: "师：贞，丈人吉，无咎。" },
  { id: 8, name: "水地比", unicode: "䷇", upper: TRIGRAMS["010"], lower: TRIGRAMS["000"], lines: [false,false,false,false,true,false], judgment: "比：吉。原筮，元永贞，无咎。" },
  { id: 9, name: "风天小畜", unicode: "䷈", upper: TRIGRAMS["100"], lower: TRIGRAMS["111"], lines: [true,true,true,false,true,true], judgment: "小畜：亨。密云不雨，自我西郊。" },
  { id: 10, name: "天泽履", unicode: "䷉", upper: TRIGRAMS["111"], lower: TRIGRAMS["110"], lines: [true,true,false,true,true,true], judgment: "履：履虎尾，不咥人，亨。" },
  { id: 11, name: "地天泰", unicode: "䷊", upper: TRIGRAMS["000"], lower: TRIGRAMS["111"], lines: [true,true,true,false,false,false], judgment: "泰：小往大来，吉亨。" },
  { id: 12, name: "天地否", unicode: "䷋", upper: TRIGRAMS["111"], lower: TRIGRAMS["000"], lines: [false,false,false,true,true,true], judgment: "否：否之匪人，不利君子贞，大往小来。" },
  { id: 13, name: "天火同人", unicode: "䷌", upper: TRIGRAMS["111"], lower: TRIGRAMS["101"], lines: [true,false,true,true,true,true], judgment: "同人：同人于野，亨。利涉大川，利君子贞。" },
  { id: 14, name: "火天大有", unicode: "䷍", upper: TRIGRAMS["101"], lower: TRIGRAMS["111"], lines: [true,true,true,false,true,true], judgment: "大有：元亨。" },
  { id: 15, name: "地山谦", unicode: "䷎", upper: TRIGRAMS["000"], lower: TRIGRAMS["011"], lines: [false,false,true,false,false,false], judgment: "谦：亨，君子有终。" },
  { id: 16, name: "雷地豫", unicode: "䷏", upper: TRIGRAMS["001"], lower: TRIGRAMS["000"], lines: [false,false,false,false,false,true], judgment: "豫：利建侯行师。" },
  { id: 17, name: "泽雷随", unicode: "䷐", upper: TRIGRAMS["110"], lower: TRIGRAMS["001"], lines: [true,false,false,false,true,true], judgment: "随：元亨利贞，无咎。" },
  { id: 18, name: "山风蛊", unicode: "䷑", upper: TRIGRAMS["011"], lower: TRIGRAMS["100"], lines: [false,true,true,false,false,true], judgment: "蛊：元亨，利涉大川。先甲三日，后甲三日。" },
  { id: 19, name: "地泽临", unicode: "䷒", upper: TRIGRAMS["000"], lower: TRIGRAMS["110"], lines: [true,true,false,false,false,false], judgment: "临：元亨利贞。至于八月有凶。" },
  { id: 20, name: "风地观", unicode: "䷓", upper: TRIGRAMS["100"], lower: TRIGRAMS["000"], lines: [false,false,false,false,true,true], judgment: "观：盥而不荐，有孚颙若。" },
  { id: 21, name: "火雷噬嗑", unicode: "䷔", upper: TRIGRAMS["101"], lower: TRIGRAMS["001"], lines: [true,false,false,true,false,true], judgment: "噬嗑：亨。利用狱。" },
  { id: 22, name: "山火贲", unicode: "䷕", upper: TRIGRAMS["011"], lower: TRIGRAMS["101"], lines: [true,false,true,false,false,true], judgment: "贲：亨。小利有攸往。" },
  { id: 23, name: "山地剥", unicode: "䷖", upper: TRIGRAMS["011"], lower: TRIGRAMS["000"], lines: [false,false,false,false,false,true], judgment: "剥：不利有攸往。" },
  { id: 24, name: "地雷复", unicode: "䷗", upper: TRIGRAMS["000"], lower: TRIGRAMS["001"], lines: [true,false,false,false,false,false], judgment: "复：亨。出入无疾，朋来无咎。" },
  { id: 25, name: "天雷无妄", unicode: "䷘", upper: TRIGRAMS["111"], lower: TRIGRAMS["001"], lines: [true,false,false,false,true,true], judgment: "无妄：元亨利贞。其匪正有眚，不利有攸往。" },
  { id: 26, name: "山天大畜", unicode: "䷙", upper: TRIGRAMS["011"], lower: TRIGRAMS["111"], lines: [true,true,true,false,false,true], judgment: "大畜：利贞，不家食吉，利涉大川。" },
  { id: 27, name: "山雷颐", unicode: "䷚", upper: TRIGRAMS["011"], lower: TRIGRAMS["001"], lines: [true,false,false,false,false,true], judgment: "颐：贞吉。观颐，自求口实。" },
  { id: 28, name: "泽风大过", unicode: "䷛", upper: TRIGRAMS["110"], lower: TRIGRAMS["100"], lines: [false,true,true,true,true,false], judgment: "大过：栋桡，利有攸往，亨。" },
  { id: 29, name: "坎为水", unicode: "䷜", upper: TRIGRAMS["010"], lower: TRIGRAMS["010"], lines: [false,true,false,false,true,false], judgment: "坎：习坎，有孚，维心亨，行有尚。" },
  { id: 30, name: "离为火", unicode: "䷝", upper: TRIGRAMS["101"], lower: TRIGRAMS["101"], lines: [true,false,true,true,false,true], judgment: "离：利贞，亨。畜牝牛，吉。" },
  { id: 31, name: "泽山咸", unicode: "䷞", upper: TRIGRAMS["110"], lower: TRIGRAMS["011"], lines: [false,false,true,true,true,false], judgment: "咸：亨利贞，取女吉。" },
  { id: 32, name: "雷风恒", unicode: "䷟", upper: TRIGRAMS["001"], lower: TRIGRAMS["100"], lines: [false,true,true,false,false,true], judgment: "恒：亨，无咎，利贞，利有攸往。" },
  { id: 33, name: "天山遁", unicode: "䷠", upper: TRIGRAMS["111"], lower: TRIGRAMS["011"], lines: [false,false,true,true,true,true], judgment: "遁：亨，小利贞。" },
  { id: 34, name: "雷天大壮", unicode: "䷡", upper: TRIGRAMS["001"], lower: TRIGRAMS["111"], lines: [true,true,true,true,false,false], judgment: "大壮：利贞。" },
  { id: 35, name: "火地晋", unicode: "䷢", upper: TRIGRAMS["101"], lower: TRIGRAMS["000"], lines: [false,false,false,true,false,true], judgment: "晋：康侯用锡马蕃庶，昼日三接。" },
  { id: 36, name: "地火明夷", unicode: "䷣", upper: TRIGRAMS["000"], lower: TRIGRAMS["101"], lines: [true,false,true,false,false,false], judgment: "明夷：利艰贞。" },
  { id: 37, name: "风火家人", unicode: "䷤", upper: TRIGRAMS["100"], lower: TRIGRAMS["101"], lines: [true,false,true,false,true,true], judgment: "家人：利女贞。" },
  { id: 38, name: "火泽睽", unicode: "䷥", upper: TRIGRAMS["101"], lower: TRIGRAMS["110"], lines: [true,true,false,true,false,true], judgment: "睽：小事吉。" },
  { id: 39, name: "水山蹇", unicode: "䷦", upper: TRIGRAMS["010"], lower: TRIGRAMS["011"], lines: [false,false,true,false,true,false], judgment: "蹇：利西南，不利东北。利见大人，贞吉。" },
  { id: 40, name: "雷水解", unicode: "䷧", upper: TRIGRAMS["001"], lower: TRIGRAMS["010"], lines: [false,true,false,false,false,true], judgment: "解：利西南，无所往，其来复吉。有攸往，夙吉。" },
  { id: 41, name: "山泽损", unicode: "䷨", upper: TRIGRAMS["011"], lower: TRIGRAMS["110"], lines: [true,true,false,false,false,true], judgment: "损：有孚，元吉，无咎，可贞，利有攸往。" },
  { id: 42, name: "风雷益", unicode: "䷩", upper: TRIGRAMS["100"], lower: TRIGRAMS["001"], lines: [true,false,false,false,true,true], judgment: "益：利有攸往，利涉大川。" },
  { id: 43, name: "泽天夬", unicode: "䷪", upper: TRIGRAMS["110"], lower: TRIGRAMS["111"], lines: [true,true,true,true,true,false], judgment: "夬：扬于王庭，孚号有厉，不利即戎，利有攸往。" },
  { id: 44, name: "天风姤", unicode: "䷫", upper: TRIGRAMS["111"], lower: TRIGRAMS["100"], lines: [false,true,true,true,true,true], judgment: "姤：女壮，勿用取女。" },
  { id: 45, name: "泽地萃", unicode: "䷬", upper: TRIGRAMS["110"], lower: TRIGRAMS["000"], lines: [false,false,false,true,true,false], judgment: "萃：亨。王假有庙，利见大人，亨，利贞。" },
  { id: 46, name: "地风升", unicode: "䷭", upper: TRIGRAMS["000"], lower: TRIGRAMS["100"], lines: [false,true,true,false,false,false], judgment: "升：元亨，用见大人，勿恤，南征吉。" },
  { id: 47, name: "泽水困", unicode: "䷮", upper: TRIGRAMS["110"], lower: TRIGRAMS["010"], lines: [false,true,false,true,true,false], judgment: "困：亨，贞，大人吉，无咎，有言不信。" },
  { id: 48, name: "水风井", unicode: "䷯", upper: TRIGRAMS["010"], lower: TRIGRAMS["100"], lines: [false,true,true,false,true,false], judgment: "井：改邑不改井，无丧无得，往来井井。" },
  { id: 49, name: "泽火革", unicode: "䷰", upper: TRIGRAMS["110"], lower: TRIGRAMS["101"], lines: [true,false,true,true,true,false], judgment: "革：己日乃孚，元亨利贞，悔亡。" },
  { id: 50, name: "火风鼎", unicode: "䷱", upper: TRIGRAMS["101"], lower: TRIGRAMS["100"], lines: [false,true,true,true,false,true], judgment: "鼎：元吉，亨。" },
  { id: 51, name: "震为雷", unicode: "䷲", upper: TRIGRAMS["001"], lower: TRIGRAMS["001"], lines: [true,false,false,true,false,false], judgment: "震：亨。震来虩虩，笑言哑哑，震惊百里，不丧匕鬯。" },
  { id: 52, name: "艮为山", unicode: "䷳", upper: TRIGRAMS["011"], lower: TRIGRAMS["011"], lines: [false,false,true,false,false,true], judgment: "艮：艮其背，不获其身，行其庭，不见其人，无咎。" },
  { id: 53, name: "风山渐", unicode: "䷴", upper: TRIGRAMS["100"], lower: TRIGRAMS["011"], lines: [false,false,true,false,true,true], judgment: "渐：女归吉，利贞。" },
  { id: 54, name: "雷泽归妹", unicode: "䷵", upper: TRIGRAMS["001"], lower: TRIGRAMS["110"], lines: [true,true,false,false,false,true], judgment: "归妹：征凶，无攸利。" },
  { id: 55, name: "雷火丰", unicode: "䷶", upper: TRIGRAMS["001"], lower: TRIGRAMS["101"], lines: [true,false,true,true,false,false], judgment: "丰：亨，王假之，勿忧，宜日中。" },
  { id: 56, name: "火山旅", unicode: "䷷", upper: TRIGRAMS["101"], lower: TRIGRAMS["011"], lines: [false,false,true,true,false,true], judgment: "旅：小亨，旅贞吉。" },
  { id: 57, name: "巽为风", unicode: "䷸", upper: TRIGRAMS["100"], lower: TRIGRAMS["100"], lines: [false,true,true,false,true,true], judgment: "巽：小亨，利有攸往，利见大人。" },
  { id: 58, name: "兑为泽", unicode: "䷹", upper: TRIGRAMS["110"], lower: TRIGRAMS["110"], lines: [true,true,false,true,true,false], judgment: "兑：亨利贞。" },
  { id: 59, name: "风水涣", unicode: "䷺", upper: TRIGRAMS["100"], lower: TRIGRAMS["010"], lines: [false,true,false,false,true,true], judgment: "涣：亨。王假有庙，利涉大川，利贞。" },
  { id: 60, name: "水泽节", unicode: "䷻", upper: TRIGRAMS["010"], lower: TRIGRAMS["110"], lines: [true,true,false,false,true,false], judgment: "节：亨。苦节不可贞。" },
  { id: 61, name: "风泽中孚", unicode: "䷼", upper: TRIGRAMS["100"], lower: TRIGRAMS["110"], lines: [true,true,false,true,true,false], judgment: "中孚：豚鱼吉，利涉大川，利贞。" },
  { id: 62, name: "雷山小过", unicode: "䷽", upper: TRIGRAMS["001"], lower: TRIGRAMS["011"], lines: [false,false,true,true,false,false], judgment: "小过：亨利贞，可小事，不可大事。" },
  { id: 63, name: "水火既济", unicode: "䷾", upper: TRIGRAMS["010"], lower: TRIGRAMS["101"], lines: [true,false,true,false,true,false], judgment: "既济：亨小，利贞，初吉终乱。" },
  { id: 64, name: "火水未济", unicode: "䷿", upper: TRIGRAMS["101"], lower: TRIGRAMS["010"], lines: [false,true,false,true,false,true], judgment: "未济：亨，小狐汔济，濡其尾，无攸利。" },
];

const LIU_QIN = ["父母", "官鬼", "妻财", "兄弟", "子孙"];
const LIU_SHOU = ["青龙", "朱雀", "勾陈", "腾蛇", "白虎", "玄武"];

function lineDisplay(yang: boolean, changing: boolean): string {
  if (yang) return changing ? "━━━○━━━" : "━━━━━";
  return changing ? "━━ ━×━ ━" : "━━ ━━";
}

function flipLine(yang: boolean): boolean {
  return !yang;
}

export interface DivinationResult {
  code: number;
  data: {
    session_id: string;
    method: string;
    method_source: string;
    lines: {
      position: number;
      type: string;
      changing: boolean;
      display: string;
      liu_qin: string;
      liu_shou: string;
    }[];
    original_hexagram: {
      name: string;
      unicode: string;
      bagua_up: { name: string; element: string; nature: string };
      bagua_down: { name: string; element: string; nature: string };
    };
    changed_hexagram: {
      name: string;
      unicode: string;
      bagua_up: { name: string; element: string; nature: string };
      bagua_down: { name: string; element: string; nature: string };
    };
    changing_line: number;
    changing_line_text: string;
    judgment: string;
  };
  interpretation: {
    segments: string[];
    references: { book: string; chapter: string; quote: string }[];
  };
}

export function generateDivination(): DivinationResult {
  const hex = HEXAGRAMS[Math.floor(Math.random() * HEXAGRAMS.length)];

  // Randomly select 0-2 changing lines
  const numChanging = Math.random() < 0.3 ? 2 : Math.random() < 0.6 ? 1 : 0;
  const changingPositions: number[] = [];
  while (changingPositions.length < numChanging) {
    const pos = Math.floor(Math.random() * 6);
    if (!changingPositions.includes(pos)) changingPositions.push(pos);
  }
  changingPositions.sort((a, b) => a - b);

  // Compute changed hexagram lines
  const changedLines = [...hex.lines];
  for (const pos of changingPositions) {
    changedLines[pos] = flipLine(changedLines[pos]);
  }

  // Find changed hexagram by matching upper/lower trigrams
  const upperKey = trigramKey(changedLines.slice(3, 6));
  const lowerKey = trigramKey(changedLines.slice(0, 3));
  const changedHex = HEXAGRAMS.find(
    (h) =>
      trigramKey(h.lines.slice(3, 6)) === upperKey &&
      trigramKey(h.lines.slice(0, 3)) === lowerKey
  ) || hex;

  // Build lines display
  const lines = hex.lines.map((yang, i) => {
    const changing = changingPositions.includes(i);
    return {
      position: i + 1,
      type: yang ? "yang" : "yin",
      changing,
      display: lineDisplay(yang, changing),
      liu_qin: LIU_QIN[i % LIU_QIN.length],
      liu_shou: LIU_SHOU[i],
    };
  });

  // Changing line text
  const changingLine = changingPositions.length > 0 ? changingPositions[0] + 1 : 0;
  const lineLabels = ["初", "二", "三", "四", "五", "上"];
  const changingLineText = changingLine > 0
    ? `${lineLabels[changingLine - 1]}${hex.lines[changingLine - 1] ? "九" : "六"}：爻动则变，观其变而玩其占。`
    : "";

  return {
    code: 0,
    data: {
      session_id: `div_${Date.now()}`,
      method: "纳甲筮法",
      method_source: "《卜筮正宗》卷一·凡例：以钱代蓍，三掷成爻，六爻成卦，纳甲配世应，乃京房遗法也。",
      lines,
      original_hexagram: {
        name: hex.name,
        unicode: hex.unicode,
        bagua_up: hex.upper,
        bagua_down: hex.lower,
      },
      changed_hexagram: {
        name: changedHex.name,
        unicode: changedHex.unicode,
        bagua_up: changedHex.upper,
        bagua_down: changedHex.lower,
      },
      changing_line: changingLine,
      changing_line_text: changingLineText,
      judgment: hex.judgment,
    },
    interpretation: buildInterpretation(hex, changedHex, changingPositions),
  };
}

function buildInterpretation(
  hex: HexagramDef,
  changedHex: HexagramDef,
  changingPositions: number[]
): { segments: string[]; references: { book: string; chapter: string; quote: string }[] } {
  const hasChange = hex.id !== changedHex.id;
  const upEl = hex.upper.element;
  const downEl = hex.lower.element;
  const relation = upEl === downEl ? "比和" :
    (upEl === "火" && downEl === "金") || (upEl === "金" && downEl === "木") ||
    (upEl === "木" && downEl === "土") || (upEl === "土" && downEl === "水") ||
    (upEl === "水" && downEl === "火") ? "上克下" :
    (downEl === "火" && upEl === "金") || (downEl === "金" && upEl === "木") ||
    (downEl === "木" && upEl === "土") || (downEl === "土" && upEl === "水") ||
    (downEl === "水" && upEl === "火") ? "下克上" : "相生";

  const segments: string[] = [];
  segments.push(`本卦为${hex.name}，上${hex.upper.nature}下${hex.lower.nature}，${relation}之象。卦辞曰："${hex.judgment}"`);

  if (hasChange) {
    const lineLabel = changingPositions.length > 0 ?
      ["初", "二", "三", "四", "五", "上"][changingPositions[0]] : "";
    segments.push(`动爻在${lineLabel}爻，由${hex.name}变为${changedHex.name}。爻动则事机已发，观变卦可知事之归趋。`);
    segments.push(`变卦${changedHex.name}，上${changedHex.upper.nature}下${changedHex.lower.nature}。${hex.name}为事之始，${changedHex.name}为事之终，合而观之可明吉凶进退。`);
  } else {
    segments.push("此卦六爻安静，无动爻。静卦主当前局势稳定，所求之事尚无变动之机，宜静观其变，待时而动。");
  }

  return {
    segments,
    references: [
      { book: "周易", chapter: `${hex.name}卦`, quote: hex.judgment },
      { book: "增删卜易", chapter: "总论", quote: "凡占事之吉凶，先观用神。用神旺相，得日月生扶者吉。" },
      { book: "卜筮正宗", chapter: "六亲章", quote: "卦有六爻，爻各有亲。观其生克冲合，可知事之成败。" },
    ],
  };
}
