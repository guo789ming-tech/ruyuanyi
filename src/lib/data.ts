// 如愿禅苑 - 古籍引用 Mock 数据
// 八字：《渊海子平》《三命通会》《滴天髓》《子平真诠》《穷通宝鉴》
// 六爻：《周易》《增删卜易》《卜筮正宗》《火珠林》《易隐》
// 求签：《灵棋经》
// 解梦：《周公解梦》《梦林玄解》敦煌本《梦书》
// 手相：《麻衣神相》《神相全编》《柳庄神相》

// ============ 功德 ============
export const MOCK_MERIT = {
  code: 0,
  data: {
    device_id: "web_abc123",
    merit: 1280,
    level: "功德主",
    level_thresholds: { 善信: 0, 居士: 100, 行者: 500, 功德主: 1000, 大功德主: 5000 },
    today_incense: 3,
    max_incense_per_day: 3,
    today_checkin: true,
    today_woodfish: 56,
    today_oracle_drawn: true,
    recent_records: [
      { action: "烧香", amount: 5, timestamp: "2026-06-12T08:30:00Z" },
      { action: "签到", amount: 10, timestamp: "2026-06-12T00:01:00Z" },
      { action: "抽签", amount: 5, timestamp: "2026-06-11T11:45:00Z" },
    ],
  },
};

export const MOCK_LEADERBOARD = {
  code: 0,
  data: {
    total_users: 4521,
    my_rank: 42,
    entries: [
      { rank: 1, nickname: "善***士", merit: 12800, level: "大功德主", badge: "gold" },
      { rank: 2, nickname: "清***客", merit: 12130, level: "大功德主", badge: "gold" },
      { rank: 3, nickname: "闻***居", merit: 10880, level: "功德主", badge: "silver" },
      { rank: 4, nickname: "松***隐", merit: 9650, level: "功德主", badge: "bronze" },
      { rank: 5, nickname: "静***心", merit: 9120, level: "功德主", badge: "bronze" },
    ],
  },
};

// ============ 八字精批 ============
export const MOCK_BAZI = {
  code: 0,
  data: {
    session_id: "bazi_calc_abc123",
    bazi: {
      year: { gan: "庚", zhi: "午" },
      month: { gan: "辛", zhi: "巳" },
      day: { gan: "丙", zhi: "寅" },
      hour: { gan: "乙", zhi: "未" },
    },
    lunar_birthday: "庚午年四月廿一日未时",
    gender: "male",
    day_master: "丙火",
    day_master_strength: "身强",
    pattern: "正官格",
    pattern_source: "《渊海子平》卷二·论格局：正官者，克身之谓也，以阴阳相配，刚柔相济为贵。",
    wuxing: { 金: 1, 木: 2, 水: 0, 火: 3, 土: 2 },
    wuxing_detail: [
      { element: "金", count: 1, description: "偏弱", score: 25 },
      { element: "木", count: 2, description: "适中", score: 55 },
      { element: "水", count: 0, description: "极弱", score: 5 },
      { element: "火", count: 3, description: "偏强", score: 75 },
      { element: "土", count: 2, description: "适中", score: 45 },
    ],
    yong_shen: ["水", "木"],
    ji_shen: ["火", "土"],
    yong_shen_source: "《滴天髓》· 调候篇：丙火猛烈，欺霜侮雪，能锻庚金，逢辛反怯。得木则炽，遇水则济。",
    shen_sha: [
      { name: "天乙贵人", omen: "吉", description: "一生有贵人扶持，关键时刻往往有人相助。", source: "《三命通会》卷三·论天乙贵人" },
      { name: "驿马", omen: "平", description: "动中生机，越是行动越能打开局面。", source: "《三命通会》卷三·论驿马" },
      { name: "月德", omen: "吉", description: "心性厚道，容易得长辈与上司认可。", source: "《渊海子平》·论月德贵人" },
    ],
    luck_pillars: [
      { age_range: [2, 11], pillar: { gan: "庚", zhi: "午" }, start_year: 1992, description: "幼年食神透出，学东西快，表现欲与好胜心明显。" },
      { age_range: [12, 21], pillar: { gan: "己", zhi: "未" }, start_year: 2002, description: "少年伤官运，思维活跃但容易与权威顶撞，需要定性。" },
      { age_range: [22, 31], pillar: { gan: "戊", zhi: "申" }, start_year: 2012, description: "偏财运渐起，人脉与机会增多，适合积累资源。" },
      { age_range: [32, 41], pillar: { gan: "丁", zhi: "酉" }, start_year: 2022, description: "当前正财运，重在稳定经营、建立长期信用与口碑。" },
      { age_range: [42, 51], pillar: { gan: "丙", zhi: "戌" }, start_year: 2032, description: "比肩运强调个人主导，适合做品牌与独立事业。" },
    ],
    luck_source: "《渊海子平》卷三·论大运：大运以月柱为基，阳男阴女顺行，阴男阳女逆行，十年一运，吉凶互见。",
    current_luck: {
      age_range: [32, 41],
      pillar: { gan: "丁", zhi: "酉" },
      start_year: 2022,
      description: "当前正行正财运，越稳越旺，重契约、重结果、重声誉。",
    },
    year_2026: {
      title: "丙午流年 · 比肩映官",
      year: 2026,
      summary: "2026 年整体偏忙，竞争环境增强，但若能借助制度、组织与专业能力，反而更容易树立口碑。",
      monthly: [
        { month: "正月", outlook: "起势快，适合确定年度目标与合作框架。" },
        { month: "二月", outlook: "人际互动增多，注意沟通边界，避免情绪上头。" },
        { month: "三月", outlook: "财运转稳，适合推进长期合同或固定收益事项。" },
        { month: "四月", outlook: "工作压力明显，宜做减法，不宜盲目接盘。" },
      ],
    },
    stream_source: "《穷通宝鉴》· 丙火四季调候：丙火生于夏月，火炎土燥，宜用水调候，金发水源。",
  },
};

export const MOCK_BAZI_ANALYSIS = {
  personality: {
    segments: [
      "你的命盘以丙火为日主，火势明朗，做事带着天然的主动性与担当感。你不喜欢拖泥带水，更愿意先点亮局面，再逐步修整细节。",
      "月令巳火当旺，说明你内在有一股很强的推进力。别人还在观望时，你往往已经开始行动，这也是你能在关键节点抢占先机的原因。",
      "不过火旺也意味着容易着急。尤其当你确认方向之后，会希望周围的人都能跟上节奏，所以真正适合你的，是能并肩而行、而不是反复消耗你热情的合作关系。",
    ],
    references: [
      { book: "渊海子平", chapter: "论日主", quote: "丙火猛烈，欺霜侮雪，能锻庚金，逢辛反怯。" },
      { book: "滴天髓", chapter: "天干论", quote: "火性炎上，得木则炽，遇水则济。" },
    ],
  },
  career: {
    segments: [
      "这张命盘事业上最适合走「可见成果型」的路径，比如管理、品牌、咨询、产品经营、项目推进。你需要的是能把责任、资源与影响力放到台前的位置。",
      "当前正财大运落位，说明近十年比起追求虚火，更适合用稳定能力、系统方法和长期信誉去换增长。一步一个脚印，反而比短期暴冲更能积累势能。",
      "如果要做重要转折，2026 年适合先立规则、再扩张。把流程、报价、合同、交付边界理顺之后，你的执行力就会转化为真正的护城河。",
    ],
    references: [
      { book: "三命通会", chapter: "论官星", quote: "官以制身，身旺得官，则能任其职。" },
      { book: "穷通宝鉴", chapter: "丙火总论", quote: "丙火得金，文明显达；得水调候，富贵可期。" },
      { book: "子平真诠", chapter: "论正官", quote: "正官为用，贵气清正，不偏不倚，得之则有声望。" },
    ],
  },
  wealth: {
    segments: [
      "你的财运不是暴富型，而是经营型。命盘里财星需要在秩序和节奏中发力，越是长期项目、复利积累、口碑变现，越容易看到收益。",
      "喜用神在水木，意味着财富往往来自信息流、资源流、连接力与持续学习，而不是单靠蛮力硬拼。越懂得整合资源，财路越宽。",
      "2026 年的财运关键词是「稳进」。可以扩张，但不宜重仓冒险；可以加价，但要让价值感和交付感同步提高。",
    ],
    references: [
      { book: "子平真诠", chapter: "论财", quote: "财宜有源，源远则流长；身宜有任，任财方能富。" },
      { book: "渊海子平", chapter: "论财官", quote: "财为养命之源，官为扶身之本，二者不可偏废。" },
    ],
  },
  relationship: {
    segments: [
      "感情里你比较重真实感，不喜欢模糊试探。你愿意付出，也愿意承担，但前提是对方能给出清晰的回应与稳定的陪伴。",
      "命盘火旺而水弱，情绪表达有时会偏直。你不是没有温柔，而是更习惯用行动表达关心，所以在关系里适度放慢节奏、留一点空间，会更容易被理解。",
      "适合你的伴侣类型，多半是气质温润、心性稳定、情绪不乱的人。这样的人能给你调候，也能让关系更久长。",
    ],
    references: [
      { book: "渊海子平", chapter: "论配偶", quote: "看命配偶，先观日支，再察喜忌，方定其情。" },
      { book: "滴天髓", chapter: "性情论", quote: "阴阳和平，则情志不偏；水火既济，则夫妇和顺。" },
    ],
  },
  health: {
    segments: [
      "从五行平衡看，命盘火旺水弱，日常最要注意的是节律管理，尤其熬夜、上火、情绪积压这类问题。越忙的时候，越要守住作息。",
      "身体层面适合做「降火养水」的长期习惯，比如早点睡、少辛辣、适度有氧、稳定补水。你的恢复力不错，但前提是不要透支。",
      "健康这部分只作传统文化角度参考，不替代专业医疗建议。真正感觉不适时，还是要及时就医检查。",
    ],
    references: [
      { book: "滴天髓", chapter: "疾病论", quote: "五行偏胜，贵在调剂。火炎水涸，当以滋阴降火为先。" },
      { book: "三命通会", chapter: "论疾病", quote: "五行和者，一世无灾。血气乱者，平生多疾。" },
    ],
  },
};

// ============ 六爻占卜 ============
export const MOCK_DIVINATION = {
  code: 0,
  data: {
    hexagram_id: "div_xyz789",
    session_id: "div_xyz789",
    method: "纳甲筮法",
    method_source: "《卜筮正宗》卷一·凡例：以钱代蓍，三掷成爻，六爻成卦，纳甲配世应，乃京房遗法也。",
    lines: [
      { position: 1, type: "yang", changing: false, display: "━━━━━", liu_qin: "父母", liu_shou: "青龙" },
      { position: 2, type: "yin", changing: false, display: "━━ ━━", liu_qin: "官鬼", liu_shou: "朱雀" },
      { position: 3, type: "yang", changing: true, display: "━━━━━", liu_qin: "妻财", liu_shou: "勾陈" },
      { position: 4, type: "yin", changing: false, display: "━━ ━━", liu_qin: "兄弟", liu_shou: "腾蛇" },
      { position: 5, type: "yang", changing: false, display: "━━━━━", liu_qin: "子孙", liu_shou: "白虎" },
      { position: 6, type: "yang", changing: false, display: "━━━━━", liu_qin: "妻财", liu_shou: "玄武" },
    ],
    shi_yao: 3,
    ying_yao: 6,
    original_hexagram: {
      name: "乾为天", unicode: "䷀",
      bagua_up: { name: "乾", element: "金", nature: "天" },
      bagua_down: { name: "乾", element: "金", nature: "天" },
    },
    changed_hexagram: {
      name: "天风姤", unicode: "䷫",
      bagua_up: { name: "乾", element: "金", nature: "天" },
      bagua_down: { name: "巽", element: "木", nature: "风" },
    },
    changing_line: 3,
    changing_line_text: "九三：君子终日乾乾，夕惕若厉，无咎。",
    judgment: "乾：元亨利贞。",
  },
  interpretation: {
    segments: [
      "此卦本卦为乾，象征主动、进取、开创。问跳槽之事，说明你本身有向上之心，也具备冲劲与执行力。",
      "三爻妻财发动，临勾陈，落在「终日乾乾，夕惕若厉，无咎」，核心不是不能动，而是提醒你越到关键时刻越要谨慎。机会有，但不能只凭热情出手。",
      "变卦为姤，乾上巽下，天在上而风在下，象征相遇与突发。新机会多半来得快、看起来诱人，但你需要先看清对方真实条件、团队节奏与后续空间，再决定是否定局。",
    ],
    references: [
      { book: "周易", chapter: "乾卦", quote: "九三：君子终日乾乾，夕惕若厉，无咎。" },
      { book: "增删卜易", chapter: "求财章", quote: "凡占求财，先看财爻。财爻旺相，得日月生扶者，其财必得。" },
      { book: "卜筮正宗", chapter: "六亲章", quote: "妻财爻动，须防兄弟克之。财动化回头克，先得后失。" },
      { book: "火珠林", chapter: "纳甲法", quote: "乾纳甲壬，坤纳乙癸，六子各有所配，以成八卦之变。" },
    ],
  },
};

// ============ 灵签（参考灵棋经） ============
export const LINGQI_POOL = [
  {
    sign_no: 1,
    title: "大通卦 · 一上一中一下",
    level: "上上",
    source: "《灵棋经》卷一·第一",
    poem: "纯阳得令，乾天在上，万象昭苏，百事通达。",
    interpret: "此签为灵棋经第一卦「大通」，纯阳无阴，乾卦之象。主万事亨通，升腾发达之兆。事业上宜大胆前行，财运上一本万利，感情上两情相悦。但卦辞提醒「盛极须防亢」，不可得意忘形。",
    tags: ["大通", "纯阳"],
  },
  {
    sign_no: 2,
    title: "渐泰卦 · 一上一中二下",
    level: "上吉",
    source: "《灵棋经》卷一·第二",
    poem: "阴气下伏，阳气上升，由微至著，渐进佳境。",
    interpret: "此卦阴在下而阳在上，阴阳有序，渐入佳境之象。主事情从微细处开始好转，不宜急于求成。事业上适合稳扎稳打，财运上小步快跑优于重注押注。耐心者终有回报。",
    tags: ["渐进", "有序"],
  },
  {
    sign_no: 3,
    title: "吉庆卦 · 一上二中三下",
    level: "上吉",
    source: "《灵棋经》卷一·第三",
    poem: "阴阳调和，天地交泰，福自天来，喜庆盈门。",
    interpret: "此卦阴阳各居其位，不争不乱，主家中将有喜事临门。求姻缘者大吉，求合作者可得良伴。如《易》云「天地交而万物通」，正是此象。",
    tags: ["喜庆", "和谐"],
  },
  {
    sign_no: 4,
    title: "富盛卦 · 一上三中一下",
    level: "中平",
    source: "《灵棋经》卷一·第四",
    poem: "阳盛阴微，盛极当思，居高思危，可以守成。",
    interpret: "此卦阳多阴少，盛极之象。主目前局面尚可，但已近顶点，需防物极必反。事业上宜固守阵地而非盲目扩张，财运上慎防过度消费和投资冲动。保持敬畏之心可以避祸。",
    tags: ["盛极", "守成"],
  },
  {
    sign_no: 5,
    title: "乐道卦 · 一上三中四下",
    level: "中平",
    source: "《灵棋经》卷一·第五",
    poem: "阳上阴下，各归其位，不争不扰，安时处顺。",
    interpret: "此卦阳在上阴在下，各安其位。主当前大局稳定，无须过多操劳。宜保持现状，享受当下。问事业者，不宜轻易变动；问财运者，细水长流即为福。",
    tags: ["安稳", "守常"],
  },
  {
    sign_no: 6,
    title: "惊怖卦 · 二上一中一下",
    level: "下下",
    source: "《灵棋经》卷二·第六",
    poem: "阴气上侵，阳气退避，事有惊惶，宜静制动。",
    interpret: "此卦阴气上升而阳气退避，主有意外之惊。事业上可能遭遇突发变故，人际关系中有口舌之争。此时切忌冲动应对，应以静制动。如同暴风骤雨，总会过去。暂时低调行事，可保平安。",
    tags: ["惊惶", "宜静"],
  },
];

// 旧签池兼容
export const LOTTERY_POOL = LINGQI_POOL;

// ============ 解梦 ============
export const DREAM_CATEGORIES = [
  { id: "weather", name: "天文气象", icon: "🌤️", description: "梦日月、星辰、风雨、雷电" },
  { id: "geography", name: "地理山水", icon: "⛰️", description: "梦山川、江河、湖海、大地" },
  { id: "people", name: "人物人伦", icon: "👨‍👩‍👧", description: "梦父母、夫妻、兄弟、朋友" },
  { id: "body", name: "身体发肤", icon: "🦷", description: "梦头面、牙齿、手足、毛发" },
  { id: "animal", name: "飞禽走兽", icon: "🐉", description: "梦龙蛇、虎豹、鱼鸟、家畜" },
  { id: "building", name: "屋宇宫室", icon: "🏠", description: "梦宅院、宫殿、庙宇、坟墓" },
  { id: "object", name: "器物用具", icon: "🔔", description: "梦镜剑、文书、钱币、衣冠" },
  { id: "action", name: "行为举止", icon: "🏃", description: "梦飞行、坠落、溺水、哭泣" },
];

export const MOCK_DREAM = (keyword: string) => ({
  code: 0,
  data: {
    keyword,
    interpretation: getDreamInterpretation(keyword),
    source: {
      primary: "《周公解梦》",
      secondary: ["敦煌本《梦书》", "《梦林玄解》"],
    },
  },
});

function getDreamInterpretation(keyword: string) {
  const interpretations: Record<string, { ji: string; text: string; source: string }[]> = {
    default: [
      { ji: "吉", text: "梦者心之所发也，日有所思，夜有所梦。梦境乃内心之映照，不必过度解读。", source: "《周公解梦》·总论" },
      { ji: "平", text: "《梦林玄解》云：梦乃魂之所游，五脏之气感于外，形于梦寐之间。", source: "《梦林玄解》·卷一" },
    ],
    水: [
      { ji: "吉", text: "梦见大水者，主财。水为财源之象，大江大河入梦，财富将至。", source: "《周公解梦》·地理篇" },
      { ji: "平", text: "敦煌本《梦书》：梦水澄清者吉，浑浊者凶。清水主智慧清明，浊水主烦恼纠缠。", source: "敦煌本《梦书》" },
    ],
    蛇: [
      { ji: "吉", text: "梦蛇入怀者，主生贵子。蛇为小龙，有祥瑞之意。", source: "《周公解梦》·走兽篇" },
      { ji: "平", text: "《梦林玄解》：蛇缠身者，有口舌之争；蛇去者，灾消祸散。", source: "《梦林玄解》·卷三" },
    ],
    火: [
      { ji: "吉", text: "梦见大火者，主名声显赫，事业兴旺。火焰高升，仕途光明。", source: "《周公解梦》·天象篇" },
      { ji: "凶", text: "梦火烧房屋者，恐有口舌是非，须谨言慎行，低调行事。", source: "《梦林玄解》·卷二" },
    ],
    飞: [
      { ji: "吉", text: "梦见身能飞腾者，主志气高远，将有升迁之喜。", source: "《周公解梦》·人事篇" },
      { ji: "平", text: "《梦林玄解》：梦飞而不稳者，心有不安，欲脱困境而未得。", source: "《梦林玄解》·卷五" },
    ],
    牙: [
      { ji: "凶", text: "梦见牙齿脱落者，恐有骨肉分离之忧。上齿主长辈，下齿主晚辈。", source: "《周公解梦》·身体篇" },
      { ji: "平", text: "敦煌本《梦书》：梦齿落而血出者凶，不血出者无碍，主虚惊一场。", source: "敦煌本《梦书》" },
    ],
    鱼: [
      { ji: "吉", text: "梦见大鱼者，主得财。鱼为富足之象，越大则财越多。", source: "《周公解梦》·器物篇" },
      { ji: "吉", text: "《梦林玄解》：梦捕鱼得之者，所求必获。梦鱼跃出水面，佳音将至。", source: "《梦林玄解》·卷四" },
    ],
  };

  // Find matching keywords
  for (const [k, v] of Object.entries(interpretations)) {
    if (keyword.includes(k)) return v;
  }
  return interpretations.default;
}

// ============ 手相（参考麻衣神相） ============
export const PALM_LINES = [
  {
    id: "life",
    name: "地纹（生命线）",
    description: "起于拇指与食指之间，环绕大鱼际而下行。主寿夭、健康、精力。",
    source: "《麻衣神相》·卷四·相手：地纹者，自艮宫起，环绕震宫，主一生寿数及根基厚薄。",
    types: [
      { name: "深长明朗", meaning: "精力充沛，根基深厚，身心健康，寿数绵长。" },
      { name: "短浅模糊", meaning: "精力易散，须注意调养，避免过度劳累透支元气。" },
      { name: "中途断续", meaning: "人生或有起伏转折，遇困难时宜沉着应对，过后更坚韧。" },
    ],
  },
  {
    id: "head",
    name: "人纹（智慧线）",
    description: "横贯掌中，起于食指下方，向掌缘延伸。主智慧、思维、决断。",
    source: "《麻衣神相》·卷四·相手：人纹者，自巽宫起，横贯掌心，主人之智识深浅与决断明暗。",
    types: [
      { name: "平直修长", meaning: "思维清晰，处事理性，适合研究与策略性工作。" },
      { name: "下垂弯曲", meaning: "想象力丰富，感性多于理性，适合创意与艺术方向。" },
      { name: "分叉双出", meaning: "多才多艺，但可能犹豫不决，左右为难时宜从心而择。" },
    ],
  },
  {
    id: "heart",
    name: "天纹（感情线）",
    description: "起于小指下方，向食指方向延伸。主情感、婚姻、人际关系。",
    source: "《神相全编》·卷七·相手：天纹者，自坤宫起，主一生情缘深浅及夫妇和合。",
    types: [
      { name: "清长无断", meaning: "重情重义，感情专一，婚姻和美，伴侣缘深。" },
      { name: "锁链状", meaning: "心思细腻敏感，容易多想，在感情中需要更多安全感。" },
      { name: "短而向上", meaning: "热情主动，但来得快去得也快，宜学会沉淀感情。" },
    ],
  },
  {
    id: "fate",
    name: "玉柱纹（命运线）",
    description: "从手腕附近向中指方向延伸。主事业成就、人生走向。",
    source: "《柳庄神相》·卷三·相手：玉柱纹者，自坎宫直上离宫，主人一生事业成败与际遇。",
    types: [
      { name: "笔直上达", meaning: "事业有明确方向，持之以恒可得大成，早年立定目标者尤佳。" },
      { name: "断续不连", meaning: "人生轨迹多变，不宜固守一行，随势而变反而开创新局。" },
      { name: "无此线", meaning: "不属于按部就班型，随性生活亦有福气，不必强求人人眼中的成功。" },
    ],
  },
];

export const PALM_MOUNDS = [
  {
    id: "jupiter",
    name: "巽宫（食指下）",
    meaning: "主志向、领导力。丰满者有大志，扁平者安于现状。",
    source: "《麻衣神相》·相手·论八卦九宫：巽为风，主名声与志气。",
  },
  {
    id: "saturn",
    name: "离宫（中指下）",
    meaning: "主智慧、稳重。隆起者思虑周全，平淡者生活简单。",
    source: "《麻衣神相》·相手·论八卦九宫：离为火，主文明与智识。",
  },
  {
    id: "apollo",
    name: "坤宫（无名指下）",
    meaning: "主艺术、名声。饱满者有才艺天赋，凹陷者藏而不露。",
    source: "《麻衣神相》·相手·论八卦九宫：坤为地，主藏蓄与才情。",
  },
  {
    id: "mercury",
    name: "乾宫（小指下）",
    meaning: "主口才、社交。丰隆者善于言辞，平坦者寡言务实。",
    source: "《神相全编》·相手：乾为天，主交际与应变之才。",
  },
];

// ============ 取名 ============
export const NAMING_STYLES = [
  { id: "shiyi", label: "诗意", desc: "取自诗词，意蕴深远" },
  { id: "gangyi", label: "刚毅", desc: "气势刚健，意志坚定" },
  { id: "ruya", label: "儒雅", desc: "温文尔雅，书卷气息" },
  { id: "qingyi", label: "清逸", desc: "清新脱俗，飘逸出尘" },
  { id: "dianya", label: "典雅", desc: "庄重典雅，端正大方" },
  { id: "wenrun", label: "温润", desc: "温和内敛，润物无声" },
];

export const SHICHEN_OPTIONS = [
  { value: "zi", label: "子时", time: "23:00-01:00" },
  { value: "chou", label: "丑时", time: "01:00-03:00" },
  { value: "yin", label: "寅时", time: "03:00-05:00" },
  { value: "mao", label: "卯时", time: "05:00-07:00" },
  { value: "chen", label: "辰时", time: "07:00-09:00" },
  { value: "si", label: "巳时", time: "09:00-11:00" },
  { value: "wu", label: "午时", time: "11:00-13:00" },
  { value: "wei", label: "未时", time: "13:00-15:00" },
  { value: "shen", label: "申时", time: "15:00-17:00" },
  { value: "you", label: "酉时", time: "17:00-19:00" },
  { value: "xu", label: "戌时", time: "19:00-21:00" },
  { value: "hai", label: "亥时", time: "21:00-23:00" },
];

// ---- 八字推演（命名用） ----
function getDayGan(day: number): string {
  const gans = ["甲","乙","丙","丁","戊","己","庚","辛","壬","癸"];
  return gans[(day - 1) % 10];
}
function getShichenElement(shichen: string): string {
  const map: Record<string,string> = { "子时":"水","丑时":"土","寅时":"木","卯时":"木","辰时":"土","巳时":"火","午时":"火","未时":"土","申时":"金","酉时":"金","戌时":"土","亥时":"水" };
  return map[shichen] || "水";
}
function getSeasonElement(month: number): string {
  if (month >= 2 && month <= 4) return "木";
  if (month >= 5 && month <= 7) return "火";
  if (month >= 8 && month <= 10) return "金";
  return "水";
}
function deriveWuxingNeeded(month: number, day: number, shichen: string): { day_master: string; strength: string; needed: string[]; summary: string } {
  const dayGan = getDayGan(day);
  const dayElement = { "甲":"木","乙":"木","丙":"火","丁":"火","戊":"土","己":"土","庚":"金","辛":"金","壬":"水","癸":"水" }[dayGan]!;
  const season = getSeasonElement(month);
  const shichenEl = getShichenElement(shichen);

  // Strength: born in same season → strong, otherwise moderate/weak
  const strong = dayElement === season || (dayElement === "火" && season === "木") || (dayElement === "土" && season === "火") || (dayElement === "金" && season === "土") || (dayElement === "水" && season === "金");
  const strength = strong ? "身强" : "身弱";

  // Determine needed elements based on strength theory
  let needed: string[];
  if (strong) {
    // Need to drain/control: generate child element + control element
    const drain: Record<string,string> = { "木":"火","火":"土","土":"金","金":"水","水":"木" };
    const control: Record<string,string> = { "木":"金","火":"水","土":"木","金":"火","水":"土" };
    needed = [drain[dayElement], control[dayElement]];
    // Add a supporting element based on shichen
    if (!needed.includes(shichenEl)) needed.push(shichenEl);
  } else {
    // Need to support: same element + parent element
    const parent: Record<string,string> = { "木":"水","火":"木","土":"火","金":"土","水":"金" };
    needed = [dayElement, parent[dayElement]];
    if (!needed.includes(shichenEl)) needed.push(shichenEl);
  }

  const seasonNames = ["","正","二","三","四","五","六","七","八","九","十","冬","腊"];
  const summary = `${dayGan}${dayElement}日主 · ${strength} · 生于${seasonNames[month]}月 · 喜${needed.slice(0,2).join("")}`;

  return { day_master: `${dayGan}${dayElement}日主`, strength, needed: [...new Set(needed)], summary };
}

// 名字池：每个名字标注其五行属性
interface NameEntry {
  rank: number; full_name: string; pinyin: string; elements: string[];
  name_meaning: string; poem_ref: string;
  wuxing_score: number; wuxing_analysis: string;
  phonetic_score: number; phonetic_analysis: string;
  stroke_score: number; total_stroke: number;
  description: string;
}

const NAME_POOL: NameEntry[] = [
  { rank: 1, full_name: "X沐宸", pinyin: "Mù Chén", elements: ["水","土"],
    name_meaning: "沐为润泽，宸为帝居，寓意承露得泽、器宇轩昂。",
    poem_ref: "《诗经》「如沐春风」；《论语》「为政以德，譬如北辰」",
    wuxing_score: 95, wuxing_analysis: "沐属水、宸含土，水土调和，恰补命局。",
    phonetic_score: 92, phonetic_analysis: "声调起伏清亮，开口自然，朗读顺口。",
    stroke_score: 88, total_stroke: 24, description: "温润有气度，适合书卷气与贵气并行的风格。" },
  { rank: 2, full_name: "X泽楷", pinyin: "Zé Kǎi", elements: ["水","木"],
    name_meaning: "泽为恩泽，楷为楷模，寓意温厚有则。",
    poem_ref: "《周易》「君子以厚德载物」；《后汉书》「楷模后进」",
    wuxing_score: 91, wuxing_analysis: "泽属水，楷属木，水木相生，利于培元启智。",
    phonetic_score: 89, phonetic_analysis: "平仄相间，收尾稳健。",
    stroke_score: 86, total_stroke: 28, description: "端正稳重，适合沉静、自律、成长型气质。" },
  { rank: 3, full_name: "X清珩", pinyin: "Qīng Héng", elements: ["水","金"],
    name_meaning: "清为澄明，珩为佩玉，寓意清朗端方。",
    poem_ref: "《楚辞》「纫秋兰以为佩」；《礼记》「君子比德于玉」",
    wuxing_score: 90, wuxing_analysis: "清属水，珩含金，金水相生，利于格局清正。",
    phonetic_score: 90, phonetic_analysis: "发音清亮，尾音挺拔，有书卷感。",
    stroke_score: 84, total_stroke: 25, description: "自带玉佩般的雅致感，适合儒雅路线。" },
  { rank: 4, full_name: "X承澜", pinyin: "Chéng Lán", elements: ["土","水"],
    name_meaning: "承为承续，澜为大波，寓意志向宏远而不失承载力。",
    poem_ref: "《尚书》「克承厥后」；《滕王阁序》「层峦耸翠，上出重霄」",
    wuxing_score: 88, wuxing_analysis: "澜属水，承含土木，兼顾气势与平衡。",
    phonetic_score: 87, phonetic_analysis: "音形大气，读来有层次。",
    stroke_score: 82, total_stroke: 29, description: "兼具格局与行动力。" },
  { rank: 5, full_name: "X书沅", pinyin: "Shū Yuán", elements: ["火","水"],
    name_meaning: "书为文脉，沅为清流，寓意文心清澈。",
    poem_ref: "《楚辞》「沅有芷兮澧有兰」；《汉书》「书以载道」",
    wuxing_score: 87, wuxing_analysis: "沅属水，书偏木火文气，整体趋于灵秀。",
    phonetic_score: 88, phonetic_analysis: "温柔舒展，尾音绵长。",
    stroke_score: 81, total_stroke: 22, description: "文雅秀逸，适合偏诗意与文化感的审美。" },
  { rank: 6, full_name: "X沛然", pinyin: "Pèi Rán", elements: ["水","火"],
    name_meaning: "沛为丰沛，然为自然，寓意才情丰沛、顺遂从容。",
    poem_ref: "《孟子》「油然作云，沛然下雨」；《庄子》「道法自然」",
    wuxing_score: 85, wuxing_analysis: "沛属水，然含水火之调，水气充沛。",
    phonetic_score: 86, phonetic_analysis: "开口响亮，收尾轻灵，易于叫唤。",
    stroke_score: 80, total_stroke: 21, description: "阳光大气，适合开朗外向的孩子。" },
  { rank: 7, full_name: "X槿言", pinyin: "Jǐn Yán", elements: ["木","金"],
    name_meaning: "槿为木槿花，言为言语，寓意言辞如花之清雅。",
    poem_ref: "《诗经》「颜如舜华」；《论语》「言寡尤，行寡悔」",
    wuxing_score: 83, wuxing_analysis: "槿属木、言含金，木金相济灵气倍增。",
    phonetic_score: 91, phonetic_analysis: "音色清秀，婉而不弱，有文艺气息。",
    stroke_score: 79, total_stroke: 23, description: "纤细而不柔弱，适合文静内秀的气质。" },
  { rank: 8, full_name: "X砚清", pinyin: "Yàn Qīng", elements: ["土","水"],
    name_meaning: "砚为文房之宝，清为澄澈，寓意文心清正。",
    poem_ref: "《文心雕龙》「陶钧文思，贵在虚静」",
    wuxing_score: 86, wuxing_analysis: "砚含土金、清属水，水土相安有助稳健。",
    phonetic_score: 85, phonetic_analysis: "沉着有力，有书生气质。",
    stroke_score: 83, total_stroke: 26, description: "沉静淡雅，适合学术与文化路线。" },
  { rank: 9, full_name: "X知弦", pinyin: "Zhī Xián", elements: ["火","水"],
    name_meaning: "知为明悟，弦为乐律，寓意知音识律、心有灵犀。",
    poem_ref: "《礼记》「知止而后有定」；《琵琶行》「转轴拨弦三两声」",
    wuxing_score: 82, wuxing_analysis: "知属火、弦含水，水火既济灵气逼人。",
    phonetic_score: 89, phonetic_analysis: "声韵优美如曲，读来余音绕梁。",
    stroke_score: 78, total_stroke: 24, description: "文艺气息浓郁，适合有音乐天赋的孩子。" },
  { rank: 10, full_name: "X景澄", pinyin: "Jǐng Chéng", elements: ["火","水"],
    name_meaning: "景为光景，澄为清澈，寓意志向光明、心境澄明。",
    poem_ref: "《岳阳楼记》「春和景明」；《淮南子》「澄心清意」",
    wuxing_score: 84, wuxing_analysis: "澄属水，景含火光，水清火明格局朗润。",
    phonetic_score: 83, phonetic_analysis: "前响后清，有层次感。",
    stroke_score: 82, total_stroke: 27, description: "大气而不失雅致，适合有领导气质的孩子。" },
  { rank: 11, full_name: "X牧遥", pinyin: "Mù Yáo", elements: ["土","火"],
    name_meaning: "牧为涵养，遥为高远，寓意心怀宽广、志存高远。",
    poem_ref: "《庄子》「逍遥游」；《易经》「牧以卑自牧也」",
    wuxing_score: 81, wuxing_analysis: "牧含土水、遥属火，土厚火明根基扎实。",
    phonetic_score: 87, phonetic_analysis: "开阔舒展，有山林之气。",
    stroke_score: 77, total_stroke: 25, description: "透出自由与旷达，适合天性洒脱的孩子。" },
  { rank: 12, full_name: "X予安", pinyin: "Yǔ Ān", elements: ["土","土"],
    name_meaning: "予为给予，安为安宁，寓意予人以安、自心亦定。",
    poem_ref: "《大学》「知止而后有定，定而后能安」",
    wuxing_score: 80, wuxing_analysis: "予含水土、安属土性，双土培元根基厚实。",
    phonetic_score: 88, phonetic_analysis: "唇齿音柔和，给人亲切感。",
    stroke_score: 79, total_stroke: 16, description: "温润简洁，有暖意与安心感。" },
  { rank: 13, full_name: "X若溪", pinyin: "Ruò Xī", elements: ["木","水"],
    name_meaning: "若为如似，溪为清流，寓意如溪水般清澈从容。",
    poem_ref: "《道德经》「上善若水」；《兰亭集序》「清流激湍」",
    wuxing_score: 89, wuxing_analysis: "若含木水、溪属水，水木清华灵气充沛。",
    phonetic_score: 91, phonetic_analysis: "轻音入耳，如溪水潺潺。",
    stroke_score: 84, total_stroke: 22, description: "清雅自然，适合温婉平和的气质。" },
  { rank: 14, full_name: "X怀瑾", pinyin: "Huái Jǐn", elements: ["水","金"],
    name_meaning: "怀为胸怀，瑾为美玉，寓意怀瑾握瑜、品德如玉。",
    poem_ref: "《楚辞》「怀瑾握瑜兮」；《诗经》「言念君子，温其如玉」",
    wuxing_score: 87, wuxing_analysis: "怀含水土、瑾属金，土生金而水润之。",
    phonetic_score: 84, phonetic_analysis: "高低有致，字正腔圆，有君子之风。",
    stroke_score: 85, total_stroke: 30, description: "君子之风，适合品格教育为先的家庭。" },
  { rank: 15, full_name: "X修远", pinyin: "Xiū Yuǎn", elements: ["金","土"],
    name_meaning: "修为修养，远为高远，寓意修身致远、厚积薄发。",
    poem_ref: "《大学》「修身齐家治国平天下」；《论语》「任重而道远」",
    wuxing_score: 83, wuxing_analysis: "修含金木、远属土火，土厚金清有向上升华之势。",
    phonetic_score: 82, phonetic_analysis: "庄重稳健，有书卷气。",
    stroke_score: 80, total_stroke: 23, description: "端正有志向，适合踏实进取的孩子。" },
  { rank: 16, full_name: "X翊辰", pinyin: "Yì Chén", elements: ["木","土"],
    name_meaning: "翊为辅佐腾飞，辰为星辰时运，寓意天时助飞。",
    poem_ref: "《诗经》「翊翊其羽」；《尚书》「抚辰凝绩」",
    wuxing_score: 86, wuxing_analysis: "翊含木、辰属土水，土厚木秀有助成长。",
    phonetic_score: 85, phonetic_analysis: "文白兼具，朗朗上口。",
    stroke_score: 81, total_stroke: 25, description: "独特而不生僻，充满向上之气。" },
  { rank: 17, full_name: "X逸尘", pinyin: "Yì Chén", elements: ["木","土"],
    name_meaning: "逸为超逸，尘为尘世，寓意超然于尘而不离尘。",
    poem_ref: "《庄子》「彷徨乎尘垢之外，逍遥乎无为之业」",
    wuxing_score: 79, wuxing_analysis: "逸属木火、尘含土金，灵动中有根基。",
    phonetic_score: 86, phonetic_analysis: "声调飘逸，有禅意。",
    stroke_score: 75, total_stroke: 27, description: "洒脱禅意，适合不拘一格的孩子。" },
  { rank: 18, full_name: "X听澜", pinyin: "Tīng Lán", elements: ["金","水"],
    name_meaning: "听为聆听，澜为波澜，寓意静听波澜、心境如海。",
    poem_ref: "《岳阳楼记》「浩浩汤汤，横无际涯」",
    wuxing_score: 85, wuxing_analysis: "听含金水、澜属水，金水双清耳聪目明。",
    phonetic_score: 83, phonetic_analysis: "一个听字活了全名，辨识度极高。",
    stroke_score: 78, total_stroke: 26, description: "独树一帜，适合个性鲜明的孩子。" },
  { rank: 19, full_name: "X子墨", pinyin: "Zǐ Mò", elements: ["水","土"],
    name_meaning: "子为文脉传承，墨为文房之魂，寓意文章传世。",
    poem_ref: "《论语》「子曰」千古开篇；《墨经》以墨为道",
    wuxing_score: 82, wuxing_analysis: "子属水、墨含土金，水土相安文星高照。",
    phonetic_score: 84, phonetic_analysis: "简洁明快，两字皆有好意象。",
    stroke_score: 82, total_stroke: 19, description: "极简却分量足，两个字承载千年文化。" },
  { rank: 20, full_name: "X彦舟", pinyin: "Yàn Zhōu", elements: ["木","水"],
    name_meaning: "彦为才德之士，舟为渡船，寓意才德俱备、渡人自渡。",
    poem_ref: "《诗经》「邦之彦兮」；《金刚经》「如筏喻者」",
    wuxing_score: 84, wuxing_analysis: "彦含木、舟属水，水木清华主才华。",
    phonetic_score: 88, phonetic_analysis: "咬字清晰，有一帆风顺的联想。",
    stroke_score: 80, total_stroke: 23, description: "古典之雅与一帆风顺的祝福兼得。" },
  { rank: 21, full_name: "X栖梧", pinyin: "Qī Wú", elements: ["木","木"],
    name_meaning: "栖为栖居，梧为梧桐，寓意良禽择木、凤栖梧桐。",
    poem_ref: "《诗经》「凤凰鸣矣，于彼高岗。梧桐生矣，于彼朝阳」",
    wuxing_score: 88, wuxing_analysis: "双木成林，栖梧皆为木属，木秀于林灵气充盈。",
    phonetic_score: 86, phonetic_analysis: "音有画意，古风盎然。",
    stroke_score: 79, total_stroke: 26, description: "自带诗经画面感，古雅非凡。" },
  { rank: 22, full_name: "X昀泽", pinyin: "Yún Zé", elements: ["火","水"],
    name_meaning: "昀为日光，泽为恩泽，寓意阳光普照、恩泽四方。",
    poem_ref: "《淮南子》「日中有踆乌」；《楚辞》「芳与泽其杂糅兮」",
    wuxing_score: 90, wuxing_analysis: "昀属火、泽属水，水火既济润泽光明。",
    phonetic_score: 85, phonetic_analysis: "音形端正，四平八稳。",
    stroke_score: 83, total_stroke: 24, description: "有阳光之暖与流水之润，平衡美好的名字。" },
  { rank: 23, full_name: "X恩澈", pinyin: "Ēn Chè", elements: ["土","水"],
    name_meaning: "恩为感恩，澈为清澈，寓意知恩于心、心澈如水。",
    poem_ref: "《诗经》「投我以木桃，报之以琼瑶」",
    wuxing_score: 81, wuxing_analysis: "恩含土金、澈属水，土厚水清厚道与智慧并重。",
    phonetic_score: 83, phonetic_analysis: "前后分明，有深情之感。",
    stroke_score: 77, total_stroke: 24, description: "温厚有情，注重品格的家长之选。" },
  { rank: 24, full_name: "X霁川", pinyin: "Jì Chuān", elements: ["水","水"],
    name_meaning: "霁为雨过天晴，川为山川河流，寓意雨霁川清、气象万千。",
    poem_ref: "《滕王阁序》「云销雨霁，彩彻区明」",
    wuxing_score: 86, wuxing_analysis: "双水并流，霁川皆为水属，润泽通透格局清朗。",
    phonetic_score: 87, phonetic_analysis: "雨后初晴般的澄澈感，余韵悠长。",
    stroke_score: 81, total_stroke: 24, description: "有自然气象之美，寓意否极泰来。" },
  { rank: 25, full_name: "X瑾瑜", pinyin: "Jǐn Yú", elements: ["金","金"],
    name_meaning: "瑾瑜皆为美玉，双玉合璧，寓意品德与才情双美。",
    poem_ref: "《楚辞》「怀瑾握瑜」；《说文》「瑾瑜，美玉也」",
    wuxing_score: 92, wuxing_analysis: "双金辉映，瑾瑜皆为金属，金声玉振贵气逼人。",
    phonetic_score: 90, phonetic_analysis: "叠韵美玉，读来如佩玉叮当。",
    stroke_score: 86, total_stroke: 27, description: "精致华美，适合对品质有极致追求的家庭。" },
  { rank: 26, full_name: "X柏舟", pinyin: "Bǎi Zhōu", elements: ["木","水"],
    name_meaning: "柏为松柏长青，舟为渡船远航，寓意坚毅前行。",
    poem_ref: "《论语》「岁寒，然后知松柏之后凋也」",
    wuxing_score: 80, wuxing_analysis: "柏属木、舟属水，水木清华根基扎实。",
    phonetic_score: 81, phonetic_analysis: "沉稳有力，有坚实可靠的感觉。",
    stroke_score: 76, total_stroke: 22, description: "平实而有筋骨，适合低调坚韧的性格。" },
  { rank: 27, full_name: "X砚书", pinyin: "Yàn Shū", elements: ["土","火"],
    name_meaning: "砚为墨池，书为典籍，寓意文墨传家、书香门第。",
    poem_ref: "《文房四谱》「砚者，研也，研墨使和濡也」",
    wuxing_score: 83, wuxing_analysis: "砚含土金、书属木火，文曲星高照。",
    phonetic_score: 89, phonetic_analysis: "字字有声，文人风骨。",
    stroke_score: 82, total_stroke: 20, description: "最简单的文房意象，书香气质不言自明。" },
  { rank: 28, full_name: "X皓然", pinyin: "Hào Rán", elements: ["金","火"],
    name_meaning: "皓为皓月之白，然为泰然之态，寓意光明磊落。",
    poem_ref: "《岳阳楼记》「皓月千里」；《孟子》「我善养吾浩然之气」",
    wuxing_score: 84, wuxing_analysis: "皓属金水、然含火木，金火相映格局清亮。",
    phonetic_score: 88, phonetic_analysis: "鲜明嘹亮，充满正气。",
    stroke_score: 83, total_stroke: 23, description: "浩然正气，适合刚正不阿的性格。" },
  { rank: 29, full_name: "X锦樾", pinyin: "Jǐn Yuè", elements: ["金","木"],
    name_meaning: "锦为锦绣，樾为树荫，寓意锦上添花、荫庇有福。",
    poem_ref: "《诗经》「锦衾烂兮」；《淮南子》「荫不祥之木」",
    wuxing_score: 82, wuxing_analysis: "锦属金火、樾属木，金木相济主贵气。",
    phonetic_score: 84, phonetic_analysis: "音韵绵密，有福荫之暖意。",
    stroke_score: 79, total_stroke: 29, description: "有华贵与福荫的双重寓意，吉祥美好。" },
  { rank: 30, full_name: "X沅芷", pinyin: "Yuán Zhǐ", elements: ["水","木"],
    name_meaning: "沅为沅水，芷为香草，寓意沅芷澧兰、性洁行芳。",
    poem_ref: "《楚辞》「沅有芷兮澧有兰，思公子兮未敢言」",
    wuxing_score: 91, wuxing_analysis: "沅属水、芷含木香，水木清华灵气充盈。",
    phonetic_score: 93, phonetic_analysis: "屈子笔下的香草美人，音韵极致优美。",
    stroke_score: 85, total_stroke: 23, description: "最美的楚辞意象，诗情画意尽在其中。" },
  // ---- 新增名字 ----
  { rank: 31, full_name: "X润禾", pinyin: "Rùn Hé", elements: ["水","木"],
    name_meaning: "润为滋润，禾为嘉禾，寓意雨露润苗、生生不息。",
    poem_ref: "《诗经》「彼黍离离，彼稷之苗」",
    wuxing_score: 88, wuxing_analysis: "润属水、禾属木，水木清华生机盎然。",
    phonetic_score: 85, phonetic_analysis: "圆润饱满，有田野之清新。",
    stroke_score: 80, total_stroke: 21, description: "朴实中有灵气，适合自然气质的名字。" },
  { rank: 32, full_name: "X铭泽", pinyin: "Míng Zé", elements: ["金","水"],
    name_meaning: "铭为铭记，泽为恩泽，寓意铭记恩德、泽被他人。",
    poem_ref: "《礼记》「铭者，自名也」",
    wuxing_score: 87, wuxing_analysis: "铭属金、泽属水，金生水旺，德才兼备。",
    phonetic_score: 86, phonetic_analysis: "响亮有力，充满正能量。",
    stroke_score: 83, total_stroke: 24, description: "现代感强，适合开朗阳光的孩子。" },
  { rank: 33, full_name: "X思源", pinyin: "Sī Yuán", elements: ["火","水"],
    name_meaning: "思为思虑深远，源为源头活水，寓意饮水思源、不忘根本。",
    poem_ref: "《论语》「学而不思则罔」；朱熹「为有源头活水来」",
    wuxing_score: 85, wuxing_analysis: "思属火、源属水，水火既济智慧通达。",
    phonetic_score: 88, phonetic_analysis: "简洁有力，寓意深远。",
    stroke_score: 82, total_stroke: 22, description: "经典而不过时，有家国情怀。" },
  { rank: 34, full_name: "X敬尧", pinyin: "Jìng Yáo", elements: ["木","土"],
    name_meaning: "敬为恭敬，尧为圣王，寓意心存敬意、志在圣贤。",
    poem_ref: "《论语》「修己以敬」；《尚书》载尧舜之道",
    wuxing_score: 86, wuxing_analysis: "敬含木金、尧属土，木土相安有圣贤气度。",
    phonetic_score: 84, phonetic_analysis: "庄重典雅，有大器之风。",
    stroke_score: 85, total_stroke: 27, description: "端正大气，有传承文化之意。" },
  { rank: 35, full_name: "X乐言", pinyin: "Lè Yán", elements: ["火","金"],
    name_meaning: "乐为快乐，言为言语，寓意乐观善言、悦人悦己。",
    poem_ref: "《论语》「知之者不如好之者，好之者不如乐之者」",
    wuxing_score: 82, wuxing_analysis: "乐属火、言含金，火金相济热情而有分寸。",
    phonetic_score: 90, phonetic_analysis: "轻快明亮，如春风拂面。",
    stroke_score: 78, total_stroke: 19, description: "快乐阳光，适合活泼开朗的孩子。" },
  { rank: 36, full_name: "X鹤鸣", pinyin: "Hè Míng", elements: ["水","金"],
    name_meaning: "鹤为仙禽，鸣为声名远播，寓意鹤鸣九皋、声闻于天。",
    poem_ref: "《诗经》「鹤鸣于九皋，声闻于天」",
    wuxing_score: 89, wuxing_analysis: "鹤含水金之灵，鸣含金声，双清共鸣格调高逸。",
    phonetic_score: 87, phonetic_analysis: "鹤鸣九皋，声闻于天，音韵气场十足。",
    stroke_score: 82, total_stroke: 23, description: "仙风道骨，适合气质不凡的孩子。" },
  { rank: 37, full_name: "X谦益", pinyin: "Qiān Yì", elements: ["土","水"],
    name_meaning: "谦为谦虚，益为增益，寓意谦受益、满招损。",
    poem_ref: "《尚书》「满招损，谦受益」",
    wuxing_score: 84, wuxing_analysis: "谦含土金、益属水，土厚水润谦和而有力。",
    phonetic_score: 83, phonetic_analysis: "质朴有劲，如金石之声。",
    stroke_score: 81, total_stroke: 26, description: "传统智慧，适合重视修养的家庭。" },
  { rank: 38, full_name: "X峻熙", pinyin: "Jùn Xī", elements: ["土","火"],
    name_meaning: "峻为高山，熙为光明，寓意气宇轩昂、光明磊落。",
    poem_ref: "《诗经》「峻极于天」；《尔雅》「熙，光也」",
    wuxing_score: 85, wuxing_analysis: "峻属土、熙含火，土厚火明高山仰止。",
    phonetic_score: 86, phonetic_analysis: "高昂有力，有领袖气场。",
    stroke_score: 83, total_stroke: 25, description: "大气磅礴，适合有远大志向的孩子。" },
  { rank: 39, full_name: "X婉清", pinyin: "Wǎn Qīng", elements: ["水","水"],
    name_meaning: "婉为温婉，清为清澈，寓意温婉如水、清澈如玉。",
    poem_ref: "《诗经》「有美一人，清扬婉兮」",
    wuxing_score: 90, wuxing_analysis: "双水并流，婉清皆水属，润泽灵秀至极。",
    phonetic_score: 92, phonetic_analysis: "柔美清澈，如泉水流淌。",
    stroke_score: 85, total_stroke: 22, description: "《诗经》原句入名，古典之美无以复加。" },
  { rank: 40, full_name: "X明哲", pinyin: "Míng Zhé", elements: ["火","火"],
    name_meaning: "明为明智，哲为哲思，寓意明辨是非、哲思深远。",
    poem_ref: "《诗经》「既明且哲，以保其身」",
    wuxing_score: 86, wuxing_analysis: "双火辉映，明哲皆火光之属，智慧光芒四射。",
    phonetic_score: 84, phonetic_analysis: "平实中正，有大智慧的感觉。",
    stroke_score: 82, total_stroke: 21, description: "《诗经》原文入名，智慧之选。" },
  { rank: 41, full_name: "X云舒", pinyin: "Yún Shū", elements: ["水","金"],
    name_meaning: "云为云端，舒为舒展，寓意云卷云舒、自在从容。",
    poem_ref: "《菜根谭》「宠辱不惊，看庭前花开花落；去留无意，望天上云卷云舒」",
    wuxing_score: 83, wuxing_analysis: "云属水、舒含金，金生水起云卷云舒。",
    phonetic_score: 91, phonetic_analysis: "如云般舒展，念来便觉心境开阔。",
    stroke_score: 79, total_stroke: 18, description: "意境名字，给人从容淡定的美感。" },
  { rank: 42, full_name: "X嘉树", pinyin: "Jiā Shù", elements: ["木","木"],
    name_meaning: "嘉为美好，树为栋梁，寓意嘉木可树、日后栋梁。",
    poem_ref: "《楚辞》「后皇嘉树，橘徕服兮」",
    wuxing_score: 87, wuxing_analysis: "双木成林，嘉含吉庆、树属栋梁，木秀于林。",
    phonetic_score: 83, phonetic_analysis: "端正有力，有栋梁之气。",
    stroke_score: 81, total_stroke: 25, description: "《楚辞》名篇命名，文化底蕴深厚。" },
  { rank: 43, full_name: "X知行", pinyin: "Zhī Xíng", elements: ["火","水"],
    name_meaning: "知为认知，行为实践，寓意知行合一、学以致用。",
    poem_ref: "王阳明「知是行之始，行是知之成」",
    wuxing_score: 84, wuxing_analysis: "知属火、行含水，心学精髓火水既济。",
    phonetic_score: 87, phonetic_analysis: "简洁明快，寓意深远。",
    stroke_score: 80, total_stroke: 17, description: "王阳明心学精髓，适合注重实践的家庭。" },
  { rank: 44, full_name: "X若愚", pinyin: "Ruò Yú", elements: ["木","水"],
    name_meaning: "若为如似，愚为大智若愚，寓意大巧若拙、大智若愚。",
    poem_ref: "《道德经》「大智若愚，大巧若拙」",
    wuxing_score: 82, wuxing_analysis: "若含木水、愚含水意，水润木秀内敛有德。",
    phonetic_score: 85, phonetic_analysis: "反义见智，名字本身便是哲思。",
    stroke_score: 78, total_stroke: 21, description: "道家智慧，适合崇尚内敛的家庭。" },
  { rank: 45, full_name: "X延昭", pinyin: "Yán Zhāo", elements: ["土","火"],
    name_meaning: "延为延续，昭为昭明，寓意光明延绵、德泽长久。",
    poem_ref: "《尚书》「以昭受上帝，天其申命用休」",
    wuxing_score: 83, wuxing_analysis: "延含土、昭属火，土厚火明绵延长久。",
    phonetic_score: 82, phonetic_analysis: "稳重大气，有历史延绵之感。",
    stroke_score: 80, total_stroke: 22, description: "光明持久，寓意福泽延绵子孙。" },
];

function scoreName(name: NameEntry, needed: string[], surname: string, gender: "male" | "female", nameLength: 2 | 3): number {
  let score = 0;
  // Element match: each matching element = +30
  for (const el of name.elements) {
    if (needed.includes(el)) score += 30;
  }
  // Phonetic bonus
  score += name.phonetic_score / 10;
  // Wuxing bonus
  score += name.wuxing_score / 10;
  // Gender adjustment (some names lean masculine/feminine)
  const feminineNames = ["若溪","婉清","沅芷","槿言","云舒","书沅"];
  const masculineNames = ["泽楷","承澜","景澄","峻熙","鹤鸣","牧遥","柏舟","修远","皓然","敬尧","翊辰"];
  if (gender === "male" && masculineNames.some(n => name.full_name.includes(n))) score += 5;
  if (gender === "female" && feminineNames.some(n => name.full_name.includes(n))) score += 5;
  if (gender === "male" && feminineNames.some(n => name.full_name.includes(n))) score -= 5;
  // Name length filter
  const charCount = name.full_name.replace("X", "").length + 1; // +1 for surname
  if (charCount !== nameLength) score -= 20;

  return score;
}

export function getNamingResults(params: {
  surname: string; gender: "male" | "female";
  year: number; month: number; day: number; shichen: string;
  nameLength: 2 | 3; styles: string[];
}) {
  const { surname, gender, month, day, shichen, nameLength } = params;
  const bazi = deriveWuxingNeeded(month, day, shichen);

  // Score and sort all names
  const scored = NAME_POOL.map((n) => ({
    ...n,
    full_name: surname + n.full_name.slice(1),
    score: scoreName(n, bazi.needed, surname, gender, nameLength),
  }));

  scored.sort((a, b) => b.score - a.score);

  // Apply style filter if specified
  let filtered = scored;
  if (params.styles.length > 0) {
    const styleMap: Record<string, string[]> = {
      classical: ["沐宸","怀瑾","清珩","栖梧","瑾瑜","鹤鸣","沅芷","敬尧","若愚","砚书"],
      modern: ["泽楷","铭泽","思源","乐言","知行","云舒","皓然","明哲","谦益","若溪"],
      poetic: ["书沅","知弦","霁川","听澜","婉清","逸尘","牧遥","锦樾","嘉树","润禾"],
      powerful: ["承澜","景澄","峻熙","修远","翊辰","柏舟","予安","延昭","彦舟","昀泽"],
    };
    const allowedNames = params.styles.flatMap((s) => styleMap[s] || []);
    if (allowedNames.length > 0) {
      filtered = scored.filter((n) => allowedNames.some((a) => n.full_name.includes(a)));
      // If too few results, fall back to all names
      if (filtered.length < 10) filtered = scored;
    }
  }

  const top30 = filtered.slice(0, 30).map((n, i) => ({
    ...n,
    rank: i + 1,
    wuxing_analysis: n.wuxing_analysis.replace("恰补命局", `恰补命局所缺之${bazi.needed.join("")}`),
  }));

  return {
    code: 0,
    data: {
      surname,
      bazi_summary: bazi.summary,
      wuxing_needed: bazi.needed,
      total_available: top30.length,
      names: top30,
    },
  };
}

// ============ 今日黄历 ============
export const MOCK_ALMANAC = {
  code: 0,
  data: {
    solar_date: "2026年6月12日",
    lunar_date: "丙午年四月廿七日",
    lunar_year: "丙午",
    lunar_month: "四月",
    lunar_day: "廿七",
    gan_zhi: {
      year: "丙午", month: "癸巳", day: "壬戌",
      year_element: "火", month_element: "水", day_element: "水",
    },
    zodiac_day: "狗",
    zodiac_clash: "龙",
    clash_direction: "正北",
    gods: {
      xi_shen: "正南",
      fu_shen: "东南",
      cai_shen: "正东",
    },
    yi: ["祭祀", "祈福", "求嗣", "开光", "出行", "解除", "嫁娶", "纳采", "订盟", "入宅", "安床", "动土", "上梁"],
    ji: ["开市", "交易", "作灶", "安葬", "行丧"],
    tai_shen: "占门碓外东南",
    peng_zu: "壬不汲水更难防，戌不吃犬作怪上床",
    shi_chen: [
      { time: "子时 23:00-01:00", gan_zhi: "庚子", ji_xiong: "凶", description: "天刑，不遇" },
      { time: "丑时 01:00-03:00", gan_zhi: "辛丑", ji_xiong: "凶", description: "朱雀，不遇" },
      { time: "寅时 03:00-05:00", gan_zhi: "壬寅", ji_xiong: "吉", description: "金匮，时德" },
      { time: "卯时 05:00-07:00", gan_zhi: "癸卯", ji_xiong: "吉", description: "天德，玉堂" },
      { time: "辰时 07:00-09:00", gan_zhi: "甲辰", ji_xiong: "凶", description: "白虎，日煞" },
      { time: "巳时 09:00-11:00", gan_zhi: "乙巳", ji_xiong: "吉", description: "明堂，续世" },
      { time: "午时 11:00-13:00", gan_zhi: "丙午", ji_xiong: "平", description: "天刑，路空" },
      { time: "未时 13:00-15:00", gan_zhi: "丁未", ji_xiong: "吉", description: "玉堂，贵人" },
      { time: "申时 15:00-17:00", gan_zhi: "戊申", ji_xiong: "凶", description: "天牢，六戊" },
      { time: "酉时 17:00-19:00", gan_zhi: "己酉", ji_xiong: "平", description: "玄武，不遇" },
      { time: "戌时 19:00-21:00", gan_zhi: "庚戌", ji_xiong: "凶", description: "司命，日破" },
      { time: "亥时 21:00-23:00", gan_zhi: "辛亥", ji_xiong: "吉", description: "勾陈，福星" },
    ],
    source: "《协纪辨方书》《玉匣记》",
  },
};


// ============ 禅修 ============
export const MEDITATION_TRACKS = [
  {
    id: "bodhi_theme",
    name: "如愿禅苑主题曲",
    icon: "🪷",
    category: "主题",
    description: "金光普照，寺院庄严，作为开场冥想最适宜",
    source: "项目原创",
    duration: 177,
    url: "/meditation/bodhi_theme.mp3",
  },
  {
    id: "bodhi_garden",
    name: "如愿禅苑",
    icon: "🌿",
    category: "禅意",
    description: "走在如愿禅苑的小径上，万缘澄定，最适合午后冥想",
    source: "项目原创",
    duration: 171,
    url: "/meditation/bodhi_garden.mp3",
  },
  {
    id: "bodhi_light",
    name: "如愿禅苑·轻音乐",
    icon: "🪷",
    category: "轻禅",
    description: "轻柔版如愿禅苑主题，更适合长时间禅修陪伴",
    source: "项目原创",
    duration: 195,
    url: "/meditation/bodhi_light.mp3",
  },
  {
    id: "bodhi_crossing",
    name: "如愿禅苑·渡尘缘",
    icon: "🛶",
    category: "禅悟",
    description: "渡过红尘缠缚，回归本心清净的旋律",
    source: "项目原创",
    duration: 219,
    url: "/meditation/bodhi_crossing.mp3",
  },
  {
    id: "palace_dawn",
    name: "宝殿晨曦",
    icon: "🌅",
    category: "晨修",
    description: "晨曦时分宝殿初开的庄严景象，最适合清晨第一坐",
    source: "项目原创",
    duration: 168,
    url: "/meditation/palace_dawn.mp3",
  },
  {
    id: "zen_sit",
    name: "禅坐",
    icon: "🧘",
    category: "正念",
    description: "纯净的禅坐音乐，引导身心快速安住于当下",
    source: "项目原创",
    duration: 156,
    url: "/meditation/zen_sit.mp3",
  },
  {
    id: "zen_mind",
    name: "禅意",
    icon: "☯️",
    category: "禅意",
    description: "在喧嚣中也能听见的内心静默，让禅意流淌",
    source: "项目原创",
    duration: 192,
    url: "/meditation/zen_mind.mp3",
  },
  {
    id: "crystal_moon",
    name: "琉璃月",
    icon: "🌕",
    category: "禅韵",
    description: "如月光透过琉璃般清澈的旋律，照见五蕴皆空",
    source: "项目原创",
    duration: 211,
    url: "/meditation/crystal_moon.mp3",
  },
  {
    id: "great_compassion",
    name: "大悲咒",
    icon: "🙏",
    category: "梵音",
    description: "观世音菩萨大悲咒梵音版，消业除障、增长慈悲",
    source: "传统佛曲",
    duration: 246,
    url: "/meditation/great_compassion.mp3",
  },
  {
    id: "heart_sutra",
    name: "心经",
    icon: "📿",
    category: "梵音",
    description: "《般若波罗蜜多心经》260 字浓缩般若智慧",
    source: "传统佛曲",
    duration: 235,
    url: "/meditation/heart_sutra.mp3",
  },
];

export const GUIDED_MEDITATIONS = [
  {
    id: "10min",
    title: "十分钟入门",
    subtitle: "适合初学者",
    duration: 600,
    steps: [
      "盘腿端坐，背挺直",
      "深呼吸三次，吸气数 4 秒，呼气数 6 秒",
      "把注意力放在鼻尖呼吸的进出",
      "杂念升起时不评判，温柔回到呼吸",
      "结束时双手合掌，回向众生",
    ],
  },
  {
    id: "20min",
    title: "二十分钟正念",
    subtitle: "进阶练习",
    duration: 1200,
    steps: [
      "三下吐纳调息",
      "观呼吸：注意力锁定鼻尖出入气",
      "扫描身体：从头顶到脚趾，依次放松每一处",
      "观念头来去：见妄念升起即知见，不跟随",
      "回向：愿一切众生离苦得乐",
    ],
  },
  {
    id: "namo",
    title: "南无阿弥陀佛",
    subtitle: "持名念佛",
    duration: 900,
    steps: [
      "盘坐，掐念珠或合掌",
      "心中默念或低声出声「南无阿弥陀佛」六字",
      "字字分明、心心相续",
      "杂念起，回到佛号",
      "下座前合掌回向",
    ],
  },
];

export const DAILY_QUOTE = {
  text: "若见诸相非相，即见如来",
  source: "《金刚经》",
};

// ============ 在线上香 ============
export const INCENSE_TYPES = [
  { id: "tanxiang", name: "檀香", icon: "🪵", description: "檀香清雅，安神静心", merit_bonus: 5 },
  { id: "chenxiang", name: "沉香", icon: "🪨", description: "沉香厚重，通灵达愿", merit_bonus: 8 },
  { id: "anshen", name: "安神香", icon: "🌸", description: "安神定志，消烦解忧", merit_bonus: 6 },
];

export const MAX_INCENSE_RITUALS = 3;
export const INCENSE_PER_RITUAL = 3;

// ============ 祈福 ============
export const BLESSING_CATALOG = [
  { id: "health", name: "健康平安", icon: "🪷", description: "愿家人身体健康，远离疾病灾厄" },
  { id: "career", name: "事业顺利", icon: "📿", description: "愿事业顺遂，步步高升" },
  { id: "study", name: "学业有成", icon: "📖", description: "愿学业进步，金榜题名" },
  { id: "wealth", name: "财源广进", icon: "🏮", description: "愿财运亨通，福禄双至" },
  { id: "love", name: "姻缘美满", icon: "❤️", description: "愿良缘早至，家庭和睦" },
  { id: "peace", name: "消灾解难", icon: "🔔", description: "愿厄运远离，灾祸不生" },
];

// ============ 三位师父 ============
export const MASTERS = [
  {
    id: "huiming",
    name: "慧明长老",
    title: "古寺住持",
    style: "庄重持重，引经据典",
    desc: "通读《渊海子平》《滴天髓》，言语稳重克制。适合希望深度解读、看古籍出处的施主。",
    icon: "🧘",
  },
  {
    id: "mingxin",
    name: "明心师父",
    title: "尼众法师",
    style: "慈悲温柔，劝人向善",
    desc: "语调温和，慈悲为怀。适合家庭、感情、亲人祈福场景。",
    icon: "🙏",
  },
  {
    id: "xuanzhen",
    name: "玄真道长",
    title: "山中道人",
    style: "直爽通透，说大白话",
    desc: "山中道人，不爱绕弯子。把命理讲成大白话，适合急性子。",
    icon: "☯️",
  },
];
