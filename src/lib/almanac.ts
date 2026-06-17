import { Solar, Lunar } from "lunar-javascript";

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
  const clashZodiac = ZODIAC[lunar.getDayChongIndex()] || "龙";
  const clashDir = lunar.getDayChongDesc() || "正北";

  // Tai Shen
  const taiShen = lunar.getDayPositionTaiDesc() || "占门碓外东南";

  // Peng Zu
  const pengZu = lunar.getDayPengZuGan() + " " + lunar.getDayPengZuZhi();

  // Shi Chen (12 two-hour periods)
  const SHI_CHEN_NAMES = [
    "子时 23:00-01:00", "丑时 01:00-03:00", "寅时 03:00-05:00",
    "卯时 05:00-07:00", "辰时 07:00-09:00", "巳时 09:00-11:00",
    "午时 11:00-13:00", "未时 13:00-15:00", "申时 15:00-17:00",
    "酉时 17:00-19:00", "戌时 19:00-21:00", "亥时 21:00-23:00",
  ];

  const shiChen = lunar.getTimes().map((t: { getGanZhi: () => string; getXiongJi: () => string; getPositionDesc: () => string }, i: number) => {
    const gz = t.getGanZhi();
    const xiong = t.getXiongJi(); // "吉" | "凶"
    const desc = t.getPositionDesc() || "";
    let jiXiong: "吉" | "凶" | "平";
    if (xiong === "吉") jiXiong = "吉";
    else if (xiong === "凶") jiXiong = "凶";
    else jiXiong = "平";
    return {
      time: SHI_CHEN_NAMES[i] || `第${i + 1}时辰`,
      gan_zhi: gz,
      ji_xiong: jiXiong,
      description: desc,
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
