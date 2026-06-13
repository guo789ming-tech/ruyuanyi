"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";
import { ShareButton } from "@/components/ShareButton";
import { Button } from "@/components/Button";
import { LockedContent } from "@/components/LockedContent";
import { PaymentModal } from "@/components/PaymentModal";
import { usePaymentWall } from "@/lib/usePaymentWall";
import { useUser } from "@/lib/UserContext";
import { useAdmin } from "@/lib/AdminContext";
import { MOCK_BAZI, MOCK_BAZI_ANALYSIS, MASTERS } from "@/lib/data";
import { delay, cn } from "@/lib/utils";

type TabKey = "chart" | "personality" | "career" | "wealth" | "relationship" | "health";

const SHICHEN = [
  { value: "子时", range: "23:00-00:59", hour: 0 },
  { value: "丑时", range: "01:00-02:59", hour: 2 },
  { value: "寅时", range: "03:00-04:59", hour: 4 },
  { value: "卯时", range: "05:00-06:59", hour: 6 },
  { value: "辰时", range: "07:00-08:59", hour: 8 },
  { value: "巳时", range: "09:00-10:59", hour: 10 },
  { value: "午时", range: "11:00-12:59", hour: 12 },
  { value: "未时", range: "13:00-14:59", hour: 14 },
  { value: "申时", range: "15:00-16:59", hour: 16 },
  { value: "酉时", range: "17:00-18:59", hour: 18 },
  { value: "戌时", range: "19:00-20:59", hour: 20 },
  { value: "亥时", range: "21:00-22:59", hour: 22 },
];

const ANALYSIS_TABS: { key: TabKey; label: string; icon: string }[] = [
  { key: "chart", label: "命盘", icon: "☯️" },
  { key: "personality", label: "性格", icon: "🧠" },
  { key: "career", label: "事业", icon: "💼" },
  { key: "wealth", label: "财运", icon: "💰" },
  { key: "relationship", label: "感情", icon: "💕" },
  { key: "health", label: "健康", icon: "🫀" },
];

const currentYear = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 100 }, (_, i) => currentYear - i);
const MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => i + 1);

function getDaysInMonth(year: number, month: number) {
  const isLeap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  const days = [31, isLeap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return days[month - 1];
}

export default function BaziPage() {
  const [step, setStep] = useState<"form" | "loading" | "result">("form");
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("1990-05-15");
  const [calendarType, setCalendarType] = useState<"solar" | "lunar">("solar");
  const [lunarYear, setLunarYear] = useState(1990);
  const [lunarMonth, setLunarMonth] = useState(5);
  const [lunarDay, setLunarDay] = useState(15);
  const [birthShichen, setBirthShichen] = useState("午时");
  const [gender, setGender] = useState("male");
  const [master, setMaster] = useState("huiming");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<TabKey>("chart");
  const { addFortuneRecord, addMerit, user } = useUser();
  const { addOrder, pricing } = useAdmin();
  const payment = usePaymentWall("bazi", pricing.bazi);

  const lunarDaysInMonth = calendarType === "lunar" ? 30 : 31;

  const handleSubmit = async () => {
    if (!name.trim()) { setError("请输入姓名"); return; }
    if (calendarType === "solar" && !birthDate) { setError("请选择出生日期"); return; }
    setError("");

    const finalBirthDate =
      calendarType === "solar"
        ? birthDate
        : `${lunarYear}-${String(lunarMonth).padStart(2, "0")}-${String(lunarDay).padStart(2, "0")}`;
    payment.setIsPaid();
    setStep("loading");
    await delay(2000);
    setStep("result");
    setActiveTab("chart");
  };

  const handlePaymentSuccess = () => {
    addFortuneRecord({
      id: `bazi_${Date.now()}`,
      type: "bazi",
      question: `${MASTERS.find((m) => m.id === master)!.name} · ${name} 八字精批`,
      result: `${MOCK_BAZI.data.day_master} · ${MOCK_BAZI.data.pattern}`,
      timestamp: new Date().toISOString(),
    });
    addMerit(28);
    addOrder({
      userPhone: user?.phone || "",
      userName: user?.name || "",
      service: "bazi",
      amount: pricing.bazi,
      amountNumber: parseFloat(pricing.bazi.replace("¥", "")) || 0,
      status: "pending",
      detail: `${MASTERS.find((m) => m.id === master)!.name}开示 · ${name} · ${MOCK_BAZI.data.day_master} · ${MOCK_BAZI.data.pattern}`,
    });
    payment.markPending();
  };

  return (
    <main className="flex-1">
      <div className="mx-auto max-w-2xl px-4 pb-16 pt-6">
        <ScrollReveal>
          <div className="flex items-center gap-3">
            <Link href="/" className="flex size-9 items-center justify-center rounded-full bg-gold/10 text-gold hover:bg-gold/20">
              <ArrowLeft className="size-4" />
            </Link>
            <h1 className="font-display text-2xl text-gold">八字精批</h1>
          </div>
        </ScrollReveal>

        {step === "form" && (
          <ScrollReveal delay={0.1}>
            <div className="mt-6 rounded-2xl border border-gold/20 bg-gradient-to-b from-xuan-card to-xuan-surface p-6">
              <p className="text-center text-sm text-paper-dark/70">依《渊海子平》《滴天髓》真排四柱，非AI套模板生成</p>
              <p className="text-center text-xs text-paper-dark/50 mt-1">真排盘 · 看命格根骨 · 知一生气运起伏</p>
              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm text-paper-dark mb-1">姓名</label>
                  <input type="text" value={name} onChange={(e) => { setName(e.target.value); setError(""); }} placeholder="请输入姓名" className="w-full rounded-xl border border-gold/20 bg-xuan/80 px-4 py-3 text-sm text-paper placeholder:text-paper-dark/30 focus:border-gold/50 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm text-paper-dark mb-2">出生日期</label>
                  <div className="flex gap-2 mb-2">
                    {[
                      { key: "solar", label: "阳历（公历）" },
                      { key: "lunar", label: "阴历（农历）" },
                    ].map((c) => (
                      <button
                        key={c.key}
                        type="button"
                        onClick={() => setCalendarType(c.key as "solar" | "lunar")}
                        className={`flex-1 rounded-lg border py-2 text-xs transition-colors ${calendarType === c.key ? "border-gold bg-gold/10 text-gold" : "border-gold/20 text-paper-dark/60 hover:border-gold/40"}`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                  {calendarType === "solar" ? (
                    <input
                      type="date"
                      value={birthDate}
                      onChange={(e) => { setBirthDate(e.target.value); setError(""); }}
                      className="w-full rounded-xl border border-gold/20 bg-xuan/80 px-4 py-3 text-sm text-paper focus:border-gold/50 focus:outline-none"
                    />
                  ) : (
                    <div className="grid grid-cols-3 gap-2">
                      <select
                        value={lunarYear}
                        onChange={(e) => { setLunarYear(Number(e.target.value)); setError(""); }}
                        className="w-full rounded-xl border border-gold/20 bg-xuan/80 px-3 py-3 text-sm text-paper focus:border-gold/50 focus:outline-none appearance-none cursor-pointer"
                      >
                        {YEAR_OPTIONS.map((y) => (
                          <option key={y} value={y}>{y}年</option>
                        ))}
                      </select>
                      <select
                        value={lunarMonth}
                        onChange={(e) => { setLunarMonth(Number(e.target.value)); setError(""); }}
                        className="w-full rounded-xl border border-gold/20 bg-xuan/80 px-3 py-3 text-sm text-paper focus:border-gold/50 focus:outline-none appearance-none cursor-pointer"
                      >
                        {MONTH_OPTIONS.map((m) => (
                          <option key={m} value={m}>{m}月</option>
                        ))}
                      </select>
                      <select
                        value={lunarDay}
                        onChange={(e) => { setLunarDay(Number(e.target.value)); setError(""); }}
                        className="w-full rounded-xl border border-gold/20 bg-xuan/80 px-3 py-3 text-sm text-paper focus:border-gold/50 focus:outline-none appearance-none cursor-pointer"
                      >
                        {Array.from({ length: lunarDaysInMonth }, (_, i) => i + 1).map((d) => (
                          <option key={d} value={d}>{d}日</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-paper-dark mb-2">出生时辰（十二时辰）</label>
                  <select
                    value={birthShichen}
                    onChange={(e) => setBirthShichen(e.target.value)}
                    className="w-full rounded-xl border border-gold/20 bg-xuan/80 px-4 py-3 text-sm text-paper focus:border-gold/50 focus:outline-none appearance-none cursor-pointer"
                  >
                    {SHICHEN.map((sc) => (
                      <option key={sc.value} value={sc.value}>
                        {sc.value}（{sc.range}）
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-paper-dark mb-1">性别</label>
                  <div className="flex gap-2">
                    {["male", "female"].map((g) => (
                      <button key={g} onClick={() => setGender(g)} className={`flex-1 rounded-xl border py-3 text-sm font-medium transition-colors ${gender === g ? "border-gold bg-gold/10 text-gold" : "border-gold/20 text-paper-dark hover:border-gold/40"}`}>
                        {g === "male" ? "男" : "女"}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-paper-dark mb-2">选一位师父为您解盘</label>
                  <div className="space-y-2">
                    {MASTERS.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setMaster(m.id)}
                        className={cn(
                          "w-full rounded-xl border p-3 text-left transition-colors flex items-start gap-3",
                          master === m.id
                            ? "border-gold bg-gold/5"
                            : "border-gold/15 hover:border-gold/30"
                        )}
                      >
                        <span className="text-xl shrink-0">{m.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gold">{m.name}</span>
                            <span className="text-xs text-paper-dark/40">{m.title}</span>
                            <span className="text-xs text-paper-dark/50">· {m.style}</span>
                          </div>
                          <p className="text-xs text-paper-dark/60 mt-0.5 leading-relaxed">{m.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                {error && <p className="text-xs text-vermillion">{error}</p>}
                <Button variant="ritual" size="lg" className="w-full" onClick={handleSubmit}>
                  ☯️ 真排八字 · 开始精批
                </Button>
              </div>
            </div>
          </ScrollReveal>
        )}

        {step === "loading" && (
          <div className="mt-12 flex flex-col items-center gap-4">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="size-12 rounded-full border-2 border-gold/30 border-t-gold" />
            <p className="text-sm text-gold/70 animate-pulse">{MASTERS.find((m) => m.id === master)!.name}依《渊海子平》推演四柱、定格局、排大运…</p>
          </div>
        )}

        {step === "result" && <BaziResult activeTab={activeTab} setActiveTab={setActiveTab} name={name} master={MASTERS.find((m) => m.id === master)!} price={pricing.bazi} onBack={() => { setStep("form"); payment.setIsPaid(); }} isPaid={payment.isPaid} isPending={payment.isPending} onUnlock={() => payment.initiatePayment()} />}

      <PaymentModal
        open={payment.showPayment}
        onClose={() => payment.setShowPayment(false)}
        title="八字精批"
        amount={pricing.bazi}
        description={`${MASTERS.find((m) => m.id === master)!.name}开示 · ${name} · ${MOCK_BAZI.data.day_master} · ${MOCK_BAZI.data.pattern}`}
        onSuccess={handlePaymentSuccess}
        mode="qrcode"
      />
      </div>
    </main>
  );
}

function BaziResult({ activeTab, setActiveTab, name, master, price, onBack, isPaid, isPending, onUnlock }: { activeTab: TabKey; setActiveTab: (t: TabKey) => void; name: string; master: typeof MASTERS[0]; price: string; onBack: () => void; isPaid: boolean; isPending: boolean; onUnlock: () => void }) {
  const bazi = MOCK_BAZI.data;
  const analysis = MOCK_BAZI_ANALYSIS;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6 space-y-5">
      {/* Header */}
      <div className="rounded-2xl border border-gold/20 bg-gradient-to-b from-xuan-card to-xuan-surface p-5 text-center">
        <span className="text-3xl">{master.icon}</span>
        <p className="text-xs text-gold/60 mt-1">{master.name} · 开示</p>
        <p className="text-xs text-gold/60 mt-2">{name} · {bazi.gender === "male" ? "乾造" : "坤造"}</p>
        <p className="mt-1 font-display text-xl text-gold">{bazi.day_master} · {bazi.pattern} · {bazi.day_master_strength}</p>
        <p className="mt-1 text-xs text-paper-dark/60">{bazi.lunar_birthday}</p>
        <p className="mt-2 text-xs text-gold/40">依《渊海子平》《滴天髓》《三命通会》真排 · 非AI生成</p>

        {/* Four pillars */}
        <div className="mt-4 grid grid-cols-4 gap-2">
          {[
            { label: "年柱", gan: bazi.bazi.year.gan, zhi: bazi.bazi.year.zhi },
            { label: "月柱", gan: bazi.bazi.month.gan, zhi: bazi.bazi.month.zhi },
            { label: "日柱", gan: bazi.bazi.day.gan, zhi: bazi.bazi.day.zhi },
            { label: "时柱", gan: bazi.bazi.hour.gan, zhi: bazi.bazi.hour.zhi },
          ].map((pillar) => (
            <div key={pillar.label} className="rounded-lg border border-gold/15 bg-xuan-surface/60 p-2">
              <p className="text-xs text-gold/50">{pillar.label}</p>
              <p className="font-display text-lg text-gold">{pillar.gan}{pillar.zhi}</p>
            </div>
          ))}
        </div>

        {/* Five elements */}
        <div className="mt-4 flex justify-center gap-3">
          {bazi.wuxing_detail.map((wx) => (
            <div key={wx.element} className="text-center">
              <p className="text-xs text-paper-dark/50">{wx.element}</p>
              <div className="mt-1 h-16 w-4 rounded-full bg-xuan-surface/60 mx-auto relative">
                <div className="absolute bottom-0 w-full rounded-full bg-gold/40" style={{ height: `${wx.score}%` }} />
              </div>
              <p className="mt-1 text-xs text-gold/60">{wx.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-3 flex justify-center gap-4 text-xs">
          <span className="text-emerald">用神：{bazi.yong_shen.join("、")}</span>
          <span className="text-vermillion-light">忌神：{bazi.ji_shen.join("、")}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1.5">
        {ANALYSIS_TABS.map((t) => (
          <button key={t.key} onClick={() => setActiveTab(t.key)} className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${activeTab === t.key ? "bg-gold text-xuan" : "bg-xuan-surface/60 text-paper-dark hover:text-gold"}`}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <LockedContent locked={!isPaid} pending={isPending} price={price} onUnlock={onUnlock}>
      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="rounded-2xl border border-gold/15 bg-xuan-surface/40 p-5">
          {activeTab === "chart" && (
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gold/60 mb-2">当前大运</p>
                <div className="rounded-lg border border-gold/15 bg-xuan/60 p-3">
                  <p className="text-sm text-gold">{bazi.current_luck.pillar.gan}{bazi.current_luck.pillar.zhi} · {bazi.current_luck.age_range[0]}~{bazi.current_luck.age_range[1]}岁</p>
                  <p className="text-xs text-paper-dark/70 mt-1">{bazi.current_luck.description}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-gold/60 mb-2">2026流年</p>
                <div className="rounded-lg border border-gold/15 bg-xuan/60 p-3">
                  <p className="text-sm text-gold">{bazi.year_2026.title}</p>
                  <p className="text-xs text-paper-dark/70 mt-1">{bazi.year_2026.summary}</p>
                  <div className="mt-2 space-y-1">
                    {bazi.year_2026.monthly.map((m) => (
                      <p key={m.month} className="text-xs text-paper-dark/60"><span className="text-gold/60">{m.month}</span>：{m.outlook}</p>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <p className="text-xs text-gold/60 mb-2">神煞</p>
                <div className="flex flex-wrap gap-2">
                  {bazi.shen_sha.map((ss) => (
                    <div key={ss.name} className="rounded-lg border border-gold/15 bg-xuan/60 px-3 py-2">
                      <span className={`text-xs font-medium ${ss.omen === "吉" ? "text-emerald" : "text-vermillion-light"}`}>{ss.name}</span>
                      <p className="text-xs text-paper-dark/50 mt-0.5">{ss.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "personality" && <AnalysisSection title="性格分析" segments={analysis.personality.segments} references={analysis.personality.references} />}
          {activeTab === "career" && <AnalysisSection title="事业分析" segments={analysis.career.segments} references={analysis.career.references} />}
          {activeTab === "wealth" && <AnalysisSection title="财运分析" segments={analysis.wealth.segments} references={analysis.wealth.references} />}
          {activeTab === "relationship" && <AnalysisSection title="感情分析" segments={analysis.relationship.segments} references={analysis.relationship.references} />}
          {activeTab === "health" && <AnalysisSection title="健康分析" segments={analysis.health.segments} references={analysis.health.references} />}
        </motion.div>
      </AnimatePresence>
      </LockedContent>

      <div className="flex gap-3">
        <Button variant="secondary" className="flex-1" onClick={onBack}>重新排盘</Button>
        <ShareButton title={`${master.name}开示 · ${name}的八字精批`} description={`${bazi.day_master} · ${bazi.pattern}`} className="flex-1" />
      </div>
    </motion.div>
  );
}

function AnalysisSection({ title, segments, references }: { title: string; segments: string[]; references?: { book: string; chapter: string; quote: string }[] }) {
  return (
    <div className="space-y-3">
      <h3 className="font-display text-lg text-gold">{title}</h3>
      {segments.map((s, i) => (
        <p key={i} className="text-sm text-paper-dark leading-relaxed">{s}</p>
      ))}
      {references && references.length > 0 && (
        <div className="mt-4 border-t border-gold/10 pt-3">
          <p className="text-xs text-gold/40 mb-2">古籍出处</p>
          {references.map((ref, i) => (
            <p key={i} className="text-xs text-paper-dark/40 mt-0.5">
              《{ref.book}》·{ref.chapter}：{ref.quote}
            </p>
          ))}
        </div>
      )}
      <p className="text-xs text-paper-dark/30 mt-2">以上内容仅作传统文化参考，不作为人生决策依据。</p>
    </div>
  );
}
