"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Star, Sparkles } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";
import { ShareButton } from "@/components/ShareButton";
import { Button } from "@/components/Button";
import { LockedContent } from "@/components/LockedContent";
import { PaymentModal } from "@/components/PaymentModal";
import { usePaymentWall } from "@/lib/usePaymentWall";
import { useUser } from "@/lib/UserContext";
import { useAdmin } from "@/lib/AdminContext";
import { MOCK_NAMES, NAMING_STYLES, SHICHEN_OPTIONS } from "@/lib/data";
import { delay, cn } from "@/lib/utils";

export default function NamingPage() {
  const [step, setStep] = useState<"form" | "loading" | "result">("form");
  const [surname, setSurname] = useState("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [year, setYear] = useState(1990);
  const [month, setMonth] = useState(5);
  const [day, setDay] = useState(15);
  const [shichen, setShichen] = useState("si");
  const [nameLength, setNameLength] = useState<2 | 3>(3);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [error, setError] = useState("");
  const { addFortuneRecord, addMerit, user } = useUser();
  const { addOrder, pricing } = useAdmin();
  const payment = usePaymentWall("naming", pricing.naming);

  const toggleStyle = (s: string) => {
    setSelectedStyles((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

  const handleGenerate = async () => {
    if (!surname.trim()) { setError("请输入姓氏"); return; }
    setError("");
    payment.setIsPaid();
    setStep("loading");
    await delay(2000);
    setStep("result");
  };

  const handlePaymentSuccess = (screenshot?: string) => {
    const names = MOCK_NAMES.data.names.map((n) => ({
      ...n,
      full_name: surname + n.full_name.slice(1),
    }));
    addFortuneRecord({
      id: `naming_${Date.now()}`,
      type: "naming",
      question: `${surname}${gender === "male" ? "男" : "女"}宝宝起名`,
      result: names[0]?.full_name || "",
      timestamp: new Date().toISOString(),
    });
    addMerit(38);
    addOrder({
      userPhone: user?.phone || "",
      userName: user?.name || "",
      service: "naming",
      amount: pricing.naming,
      amountNumber: parseFloat(pricing.naming.replace("¥", "")) || 0,
      status: "pending",
      screenshot,
      detail: `${surname}${gender === "male" ? "男" : "女"}宝宝 · ${nameLength}字名 · ${names[0]?.full_name || ""}`,
    });
    payment.markPending();
  };

  const yearOptions = Array.from({ length: 40 }, (_, i) => 1980 + i);
  const monthOptions = Array.from({ length: 12 }, (_, i) => i + 1);
  const daysInMonth = new Date(year, month, 0).getDate();
  const dayOptions = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <main className="flex-1">
      <div className="mx-auto max-w-2xl px-4 pb-16 pt-6">
        <ScrollReveal>
          <div className="flex items-center gap-3">
            <Link href="/" className="flex size-9 items-center justify-center rounded-full bg-gold/10 text-gold hover:bg-gold/20">
              <ArrowLeft className="size-4" />
            </Link>
            <h1 className="font-display text-2xl text-gold">宝宝起名</h1>
          </div>
        </ScrollReveal>

        {step === "form" && (
          <ScrollReveal delay={0.1}>
            <div className="mt-6 rounded-2xl border border-gold/20 bg-gradient-to-b from-xuan-card to-xuan-surface p-6">
              <div className="text-center">
                <span className="text-4xl">🎋</span>
                <h2 className="mt-2 font-display text-xl text-gold">宝宝起名</h2>
                <p className="mt-1 text-sm text-paper-dark/70 leading-relaxed">
                  非AI随机拼凑。依八字喜忌定方向，从《诗经》《楚辞》《论语》中择字，每名皆有出处。
                </p>
                <p className="text-xs text-gold/60">一个好名字，是父母给孩子最早的如愿福报。</p>
              </div>

              <div className="mt-4 rounded-xl border border-gold/15 bg-xuan-surface/40 p-4 space-y-1.5">
                <p className="text-xs text-paper-dark/70">✦ 真排八字 · 平衡五行：补喜忌、避冲克</p>
                <p className="text-xs text-paper-dark/70">✦ 字字考究 · 古籍典出：《诗经》《楚辞》《论语》</p>
                <p className="text-xs text-paper-dark/70">✦ 音韵铿锵 · 笔画吉数：避同音、忌生僻</p>
                <p className="text-xs text-paper-dark/70">✦ 完整 30 个候选：每名附释义 / 五行 / 出处</p>
              </div>

              <div className="mt-6 space-y-4">
                {/* Birth date pickers */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-paper-dark/60 mb-1">出生年</label>
                    <select
                      value={year}
                      onChange={(e) => setYear(Number(e.target.value))}
                      className="w-full rounded-xl border border-gold/20 bg-xuan/80 px-3 py-3 text-sm text-paper focus:border-gold/50 focus:outline-none appearance-none cursor-pointer"
                    >
                      {yearOptions.map((y) => (
                        <option key={y} value={y}>{y} 年</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-paper-dark/60 mb-1">出生月</label>
                    <select
                      value={month}
                      onChange={(e) => setMonth(Number(e.target.value))}
                      className="w-full rounded-xl border border-gold/20 bg-xuan/80 px-3 py-3 text-sm text-paper focus:border-gold/50 focus:outline-none appearance-none cursor-pointer"
                    >
                      {monthOptions.map((m) => (
                        <option key={m} value={m}>{m} 月</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-paper-dark/60 mb-1">出生日</label>
                    <select
                      value={day}
                      onChange={(e) => setDay(Number(e.target.value))}
                      className="w-full rounded-xl border border-gold/20 bg-xuan/80 px-3 py-3 text-sm text-paper focus:border-gold/50 focus:outline-none appearance-none cursor-pointer"
                    >
                      {dayOptions.map((d) => (
                        <option key={d} value={d}>{d} 日</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Shichen */}
                <div>
                  <label className="block text-xs text-paper-dark/60 mb-1">出生时辰</label>
                  <select
                    value={shichen}
                    onChange={(e) => setShichen(e.target.value)}
                    className="w-full rounded-xl border border-gold/20 bg-xuan/80 px-4 py-3 text-sm text-paper focus:border-gold/50 focus:outline-none appearance-none cursor-pointer"
                  >
                    {SHICHEN_OPTIONS.map((s) => (
                      <option key={s.value} value={s.value}>{s.label} ({s.time})</option>
                    ))}
                  </select>
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-xs text-paper-dark/60 mb-1">性别</label>
                  <div className="flex gap-2">
                    {[
                      { key: "male", label: "男" },
                      { key: "female", label: "女" },
                    ].map((g) => (
                      <button
                        key={g.key}
                        onClick={() => setGender(g.key as "male" | "female")}
                        className={cn(
                          "flex-1 rounded-xl border py-3 text-sm font-medium transition-colors",
                          gender === g.key
                            ? "border-gold bg-gold/10 text-gold"
                            : "border-gold/20 text-paper-dark hover:border-gold/40"
                        )}
                      >
                        {g.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Surname */}
                <div>
                  <label className="block text-xs text-paper-dark/60 mb-1">姓氏</label>
                  <input
                    type="text"
                    value={surname}
                    onChange={(e) => { setSurname(e.target.value); setError(""); }}
                    placeholder="请输入姓氏（如：李）"
                    maxLength={2}
                    className="w-full rounded-xl border border-gold/20 bg-xuan/80 px-4 py-3 text-sm text-paper placeholder:text-paper-dark/30 focus:border-gold/50 focus:outline-none"
                  />
                </div>

                {/* Name length */}
                <div>
                  <label className="block text-xs text-paper-dark/60 mb-1">姓名总字数（含姓）</label>
                  <div className="flex gap-2">
                    {[2, 3].map((n) => (
                      <button
                        key={n}
                        onClick={() => setNameLength(n as 2 | 3)}
                        className={cn(
                          "flex-1 rounded-xl border py-3 text-sm transition-colors",
                          nameLength === n
                            ? "border-gold bg-gold/10 text-gold"
                            : "border-gold/20 text-paper-dark hover:border-gold/40"
                        )}
                      >
                        {n} 字{n === 2 ? "（如 李安）" : "（如 李思远）"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Style preference */}
                <div>
                  <label className="block text-xs text-paper-dark/60 mb-2">偏好风格</label>
                  <div className="flex flex-wrap gap-2">
                    {NAMING_STYLES.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => toggleStyle(s.id)}
                        className={cn(
                          "rounded-lg border px-4 py-2 text-sm transition-colors",
                          selectedStyles.includes(s.id)
                            ? "border-gold bg-gold/10 text-gold"
                            : "border-gold/20 text-paper-dark hover:border-gold/40"
                        )}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                {error && <p className="text-xs text-vermillion">{error}</p>}

                <Button variant="ritual" size="lg" className="w-full" onClick={handleGenerate}>
                  请师父依古籍起名
                </Button>
              </div>
            </div>
          </ScrollReveal>
        )}

        {step === "loading" && (
          <div className="mt-12 flex flex-col items-center gap-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="size-12 rounded-full border-2 border-emerald/30 border-t-emerald"
            />
            <p className="text-sm text-gold/70 animate-pulse">师父正在推演八字，翻查《诗经》《楚辞》，斟酌字义…</p>
            <p className="text-xs text-paper-dark/50">真排八字 · 平衡五行 · 依典择字 · 非AI拼凑</p>
          </div>
        )}

        {step === "result" && (
          <NamingResult
            surname={surname}
            price={pricing.naming}
            onBack={() => { setStep("form"); payment.setIsPaid(); }}
            isPaid={payment.isPaid}
            isPending={payment.isPending}
            onUnlock={() => payment.initiatePayment()}
          />
        )}

        <PaymentModal
          open={payment.showPayment}
          onClose={() => payment.setShowPayment(false)}
          title="宝宝起名"
          amount={pricing.naming}
          description={`${surname}${gender === "male" ? "男" : "女"}宝宝 · ${nameLength}字名`}
          onSuccess={handlePaymentSuccess}
          mode="qrcode"
        />
      </div>
    </main>
  );
}

function NamingResult({ surname, price, onBack, isPaid, isPending, onUnlock }: { surname: string; price: string; onBack: () => void; isPaid: boolean; isPending: boolean; onUnlock: () => void }) {
  const names = MOCK_NAMES.data.names.map((n) => ({
    ...n,
    full_name: surname + n.full_name.slice(1),
  }));

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6 space-y-5">
      <div className="rounded-2xl border border-emerald/30 bg-gradient-to-b from-emerald/5 to-xuan-card p-5 text-center">
        <Sparkles className="mx-auto size-8 text-emerald" />
        <p className="mt-2 text-xs text-gold/60">
          真排八字：{MOCK_NAMES.data.bazi_summary}
        </p>
        <p className="mt-1 font-display text-xl text-gold">
          依八字五行 · 从典籍择字 · 精选 30 个候选好名
        </p>
        <p className="mt-1 text-xs text-paper-dark/50">
          每名附释义 · 五行 · 《诗经》《楚辞》出处 · 非AI随机生成
        </p>
      </div>

      <div className="space-y-3">
        {names.slice(0, 2).map((name, i) => (
          <motion.div
            key={name.rank}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={cn(
              "rounded-2xl border p-5",
              name.rank === 1
                ? "border-gold/40 bg-gradient-to-b from-gold/10 to-xuan-card"
                : "border-gold/15 bg-xuan-surface/40"
            )}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  {name.rank === 1 && (
                    <span className="rounded-full bg-gold px-2 py-0.5 text-xs font-medium text-xuan">
                      首荐
                    </span>
                  )}
                  <h3 className="font-display text-2xl text-gold">{name.full_name}</h3>
                  <span className="text-xs text-paper-dark/50">{name.pinyin}</span>
                </div>
                <p className="mt-1 text-sm text-paper-dark leading-relaxed">
                  {name.description}
                </p>
              </div>
              <div className="flex items-center gap-1 text-gold ml-3">
                <Star className="size-3 fill-gold" />
                <span className="text-sm font-medium">{name.wuxing_score}</span>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-lg bg-xuan/40 py-2">
                <p className="text-xs text-paper-dark/50">五行评分</p>
                <p className="text-sm font-medium text-emerald">{name.wuxing_score}</p>
              </div>
              <div className="rounded-lg bg-xuan/40 py-2">
                <p className="text-xs text-paper-dark/50">音韵评分</p>
                <p className="text-sm font-medium text-gold">{name.phonetic_score}</p>
              </div>
              <div className="rounded-lg bg-xuan/40 py-2">
                <p className="text-xs text-paper-dark/50">笔画吉数</p>
                <p className="text-sm font-medium text-gold">{name.total_stroke}画</p>
              </div>
            </div>

            <div className="mt-3 space-y-1.5 text-xs">
              <p className="text-paper-dark/70">
                <span className="text-gold/60">寓意：</span>{name.name_meaning}
              </p>
              <p className="text-paper-dark/70">
                <span className="text-gold/60">出处：</span>{name.poem_ref}
              </p>
              <p className="text-paper-dark/60">{name.wuxing_analysis}</p>
              <p className="text-paper-dark/60">{name.phonetic_analysis}</p>
            </div>
          </motion.div>
        ))}

        <LockedContent locked={!isPaid} pending={isPending} price={price} onUnlock={onUnlock}>
          {names.slice(2).map((name, i) => (
            <motion.div
              key={name.rank}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (i + 2) * 0.1 }}
              className="rounded-2xl border border-gold/15 bg-xuan-surface/40 p-5 mb-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-2xl text-gold">{name.full_name}</h3>
                    <span className="text-xs text-paper-dark/50">{name.pinyin}</span>
                  </div>
                  <p className="mt-1 text-sm text-paper-dark leading-relaxed">
                    {name.description}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-gold ml-3">
                  <Star className="size-3 fill-gold" />
                  <span className="text-sm font-medium">{name.wuxing_score}</span>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-lg bg-xuan/40 py-2">
                  <p className="text-xs text-paper-dark/50">五行评分</p>
                  <p className="text-sm font-medium text-emerald">{name.wuxing_score}</p>
                </div>
                <div className="rounded-lg bg-xuan/40 py-2">
                  <p className="text-xs text-paper-dark/50">音韵评分</p>
                  <p className="text-sm font-medium text-gold">{name.phonetic_score}</p>
                </div>
                <div className="rounded-lg bg-xuan/40 py-2">
                  <p className="text-xs text-paper-dark/50">笔画吉数</p>
                  <p className="text-sm font-medium text-gold">{name.total_stroke}画</p>
                </div>
              </div>

              <div className="mt-3 space-y-1.5 text-xs">
                <p className="text-paper-dark/70">
                  <span className="text-gold/60">寓意：</span>{name.name_meaning}
                </p>
                <p className="text-paper-dark/70">
                  <span className="text-gold/60">出处：</span>{name.poem_ref}
                </p>
                <p className="text-paper-dark/60">{name.wuxing_analysis}</p>
                <p className="text-paper-dark/60">{name.phonetic_analysis}</p>
              </div>
            </motion.div>
          ))}
        </LockedContent>
      </div>

      <div className="rounded-xl border border-gold/15 bg-xuan-surface/40 p-4">
        <p className="text-xs text-paper-dark/50 text-center">
          以上名字综合八字五行、音韵笔画、古籍典故生成。每个名字皆附释义与出处，供您参考斟酌。
          最终取名由您决定，心念所在，即为最好之选。
        </p>
      </div>

      <div className="flex gap-3">
        <Button variant="secondary" className="flex-1" onClick={onBack}>
          重新起名
        </Button>
        <ShareButton
          title={`在如愿禅苑请了好名字 - ${names[0].full_name}`}
          description={`${names[0].full_name} · ${names[0].name_meaning}`}
          className="flex-1"
        />
      </div>
    </motion.div>
  );
}
