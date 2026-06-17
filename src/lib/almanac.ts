import { Solar, Lunar, HolidayUtil } from "lunar-javascript";

export interface BaziChart {
  gender: string;
  lunar_birthday: string;
  solar_birthday: string;
  year_pillar: string;
  month_pillar: string;
  day_pillar: string;
  hour_pillar: string;
  day_master: string;
  day_master_element: string;
  pattern: string;
  day_master_strength: string;
  five_elements: string;
  xi_yong: string;
  pillars: {
    label: string;
    gan_zhi: string;
    cang_gan: string;
    na_yin: string;
    shi_shen: string;
  }[];
}

export interface AlmanacData {
  solar_date: string;
  lunar_date: string;
  lunar_year: string;
  lunar_month: string;
  lunar_day: string;
  gan_zhi: {
    year: string;
    month: string;
    day: string;
    year_element: string;
    month_element: string;
    day_element: string;
  };
  zodiac_day: string;
  zodiac_clash: string;
  clash_direction: string;
  gods: {
    xi_shen: string;
    fu_shen: string;
    cai_shen: string;
  };
  yi: string[];
  ji: string[];
  tai_shen: string;
  peng_zu: string;
  shi_chen: {
    time: string;
    gan_zhi: string;
    ji_xiong: "吉" | "凶" | "平";
    description: string;
  }[];
  source: string;
}

const ZODIAC = ["鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪"];
const ELEMENTS: Record<string, string> = {
  甲: "木", 乙: "木", 丙: "火", 丁: "火", 戊: "土",
  己: "土", 庚: "金", 辛: "金", 壬: "水", 癸: "水",
};

function getElement(ganZhi: string): string {
  const gan = ganZhi.charAt(0);
  return ELEMENTS[gan] || "";
}

export function getTodayAlmanac(): AlmanacData {
  const now = new Date();
  const solar = Solar.fromDate(now);
  const lunar = Lunar.fromDate(now);

  const yearGz = lunar.getYearInGanZhi();
  const monthGz = lunar.getMonthInGanZhi();
  const dayGz = lunar.getDayInGanZhi();

  // Solar date
  const solarStr = `${solar.getYear()}年${solar.getMonth()}月${solar.getDay()}日`;

  // Lunar date
  const lunarStr = `${lunar.getYearInChinese()}年${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}`;

  // Yi / Ji
  const yi = lunar.getDayYi().slice(0, 12);
  const ji = lunar.getDayJi().slice(0, 6);

  // Gods
  const xiShen = lunar.getDayPositionXiDesc() || "正南";
  const fuShen = lunar.getDayPositionFuDesc() || "东南";
  const caiShen = lunar.getDayPositionCaiDesc() || "正东";

  // Zodiac
  const dayZodiac = ZODIAC[lunar.getDayZhiIndex()] || "狗";
  const clashZodiac = lunar.getDayChongShengXiao() || "龙";
  const clashDir = lunar.getDayChongDesc() || "正北";

  // Tai Shen
  const taiShen = lunar.getDayPositionTai() || "占门碓外东南";

  // Peng Zu
  const pengZu = lunar.getPengZuGan() + " " + lunar.getPengZuZhi();

  // Shi Chen (12 two-hour periods)
  const SHI_CHEN_NAMES = [
    "子时 23:00-01:00", "丑时 01:00-03:00", "寅时 03:00-05:00",
    "卯时 05:00-07:00", "辰时 07:00-09:00", "巳时 09:00-11:00",
    "午时 11:00-13:00", "未时 13:00-15:00", "申时 15:00-17:00",
    "酉时 17:00-19:00", "戌时 19:00-21:00", "亥时 21:00-23:00",
  ];

  const shiChen = lunar.getTimes().map((t: { getGanZhi: () => string; getTianShenLuck: () => string; getTianShen: () => string }, i: number) => {
    const gz = t.getGanZhi();
    const luck = t.getTianShenLuck();
    const shen = t.getTianShen() || "";
    let jiXiong: "吉" | "凶" | "平";
    if (luck === "吉") jiXiong = "吉";
    else if (luck === "凶") jiXiong = "凶";
    else jiXiong = "平";
    return {
      time: SHI_CHEN_NAMES[i] || `第${i + 1}时辰`,
      gan_zhi: gz,
      ji_xiong: jiXiong,
      description: shen,
    };
  });

  return {
    solar_date: solarStr,
    lunar_date: lunarStr,
    lunar_year: lunar.getYearInChinese(),
    lunar_month: lunar.getMonthInChinese(),
    lunar_day: lunar.getDayInChinese(),
    gan_zhi: {
      year: yearGz,
      month: monthGz,
      day: dayGz,
      year_element: getElement(yearGz),
      month_element: getElement(monthGz),
      day_element: getElement(dayGz),
    },
    zodiac_day: dayZodiac,
    zodiac_clash: clashZodiac,
    clash_direction: clashDir,
    gods: {
      xi_shen: xiShen,
      fu_shen: fuShen,
      cai_shen: caiShen,
    },
    yi: yi.length > 0 ? yi : ["祭祀", "祈福"],
    ji: ji.length > 0 ? ji : ["诸事不宜"],
    tai_shen: taiShen,
    peng_zu: pengZu,
    shi_chen: shiChen,
    source: "《协纪辨方书》《玉匣记》《鳌头通书》",
  };
}

// ---- Bazi (八字) ----
const GAN = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
const GAN_ELEMENT: Record<string, string> = { 甲: "木", 乙: "木", 丙: "火", 丁: "火", 戊: "土", 己: "土", 庚: "金", 辛: "金", 壬: "水", 癸: "水" };
const ZHI_ELEMENT: Record<string, string> = {
  子: "水", 丑: "土", 寅: "木", 卯: "木", 辰: "土", 巳: "火",
  午: "火", 未: "土", 申: "金", 酉: "金", 戌: "土", 亥: "水",
};

function countElements(pillars: string[]): Record<string, number> {
  const counts: Record<string, number> = { 木: 0, 火: 0, 土: 0, 金: 0, 水: 0 };
  for (const p of pillars) {
    const gEl = GAN_ELEMENT[p[0]] || "";
    const zEl = ZHI_ELEMENT[p[1]] || "";
    if (gEl) counts[gEl]++;
    if (zEl) counts[zEl]++;
  }
  return counts;
}

export function getBaziChart(opts: {
  gender: string;
  calendarType: "solar" | "lunar";
  year: number;
  month: number;
  day: number;
  shichenValue: string;
}): BaziChart {
  const { gender, calendarType, year, month, day, shichenValue } = opts;

  // Map shichen to hour index (0-based, e.g. 子时=0, 丑时=1, ...)
  const SHICHEN_INDEX: Record<string, number> = {
    "子时": 0, "丑时": 1, "寅时": 2, "卯时": 3, "辰时": 4, "巳时": 5,
    "午时": 6, "未时": 7, "申时": 8, "酉时": 9, "戌时": 10, "亥时": 11,
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let lunar: any;
  if (calendarType === "solar") {
    const solar = Solar.fromYmd(year, month, day);
    lunar = solar.getLunar();
  } else {
    lunar = Lunar.fromYmd(year, month, day);
  }

  const shichenIdx = SHICHEN_INDEX[shichenValue] ?? 0;

  const yearPillar = lunar.getYearInGanZhi();
  const monthPillar = lunar.getMonthInGanZhi();
  const dayPillar = lunar.getDayInGanZhi();
  // Hour pillar from day pillar + shichen index
  const dayGan = dayPillar[0];
  const ganIdx = GAN.indexOf(dayGan);
  const hourGanIdx = (ganIdx * 2 + shichenIdx) % 10;
  const ZHI = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
  const hourPillar = GAN[hourGanIdx] + ZHI[shichenIdx];

  const pillars = [yearPillar, monthPillar, dayPillar, hourPillar];
  const dayMaster = dayPillar[0];
  const dayEl = GAN_ELEMENT[dayMaster] || "土";
  const counts = countElements(pillars);

  // Determine strength: count day master element and its generating element
  const generating: Record<string, string> = { 木: "水", 火: "木", 土: "火", 金: "土", 水: "金" };
  const genEl = generating[dayEl];
  const strengthScore = (counts[dayEl] || 0) + (counts[genEl] || 0) * 0.5;
  const dayMasterStrength = strengthScore >= 4 ? "身强" : strengthScore >= 2.5 ? "中和" : "身弱";

  // Pattern: simplified based on day master and month
  const monthZhi = monthPillar[1];
  const monthEl = ZHI_ELEMENT[monthZhi] || "";
  const sameAsMonth = dayEl === monthEl;
  const pattern = sameAsMonth ? `${dayEl}旺` : `${dayMaster}${dayEl}${dayMasterStrength === "身强" ? "得令" : "失令"}`;

  // Five elements count summary
  const fiveElements = `木${counts["木"]} 火${counts["火"]} 土${counts["土"]} 金${counts["金"]} 水${counts["水"]}`;

  // Simplified xi/yong
  const xiYong = dayMasterStrength === "身强"
    ? `喜${getRestraining(dayEl)} 用${getRestraining(getRestraining(dayEl))}`
    : `喜${genEl} 用${dayEl}`;

  const pillarLabels = ["年柱", "月柱", "日柱", "时柱"];

  return {
    gender,
    lunar_birthday: `${lunar.getYearInChinese()}年${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}日 ${shichenValue}`,
    solar_birthday: `${lunar.getSolar().getYear()}-${lunar.getSolar().getMonth()}-${lunar.getSolar().getDay()}`,
    year_pillar: yearPillar,
    month_pillar: monthPillar,
    day_pillar: dayPillar,
    hour_pillar: hourPillar,
    day_master: dayMaster,
    day_master_element: dayEl,
    pattern,
    day_master_strength: dayMasterStrength,
    five_elements: fiveElements,
    xi_yong: xiYong,
    pillars: pillars.map((gz, i) => ({
      label: pillarLabels[i],
      gan_zhi: gz,
      cang_gan: "",
      na_yin: "",
      shi_shen: i === 2 ? "日主" : getShiShen(dayMaster, gz.charAt(0)),
    })),
  };
}

function getRestraining(element: string): string {
  const cycle: Record<string, string> = { 木: "金", 火: "水", 土: "木", 金: "火", 水: "土" };
  return cycle[element] || "土";
}

function getShiShen(dayGan: string, pillarGan: string): string {
  const gans = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
  const elements = ["木", "木", "火", "火", "土", "土", "金", "金", "水", "水"];
  const isYang = [true, false, true, false, true, false, true, false, true, false];

  const dIdx = gans.indexOf(dayGan);
  const pIdx = gans.indexOf(pillarGan);
  if (dIdx === -1 || pIdx === -1) return "";

  const dEl = elements[dIdx];
  const pEl = elements[pIdx];
  const samePolarity = isYang[dIdx] === isYang[pIdx];

  // Generating: 木→火→土→金→水→木
  const generates: Record<string, string> = { 木: "火", 火: "土", 土: "金", 金: "水", 水: "木" };
  // Controlling: 木→土→水→火→金→木
  const controls: Record<string, string> = { 木: "土", 土: "水", 水: "火", 火: "金", 金: "木" };

  if (pEl === dEl) return samePolarity ? "比肩" : "劫财";
  if (generates[dEl] === pEl) return samePolarity ? "食神" : "伤官";
  if (generates[pEl] === dEl) return samePolarity ? "偏印" : "正印";
  if (controls[dEl] === pEl) return samePolarity ? "偏财" : "正财";
  if (controls[pEl] === dEl) return samePolarity ? "七杀" : "正官";

  return "";
}
