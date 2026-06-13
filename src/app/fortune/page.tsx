"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Sparkles } from "lucide-react";
import { BodhiLeaf } from "@/components/BodhiLogo";
import { ScrollReveal } from "@/components/ScrollReveal";
import { ShareButton } from "@/components/ShareButton";
import { Button } from "@/components/Button";
import { LOTTERY_POOL, MOCK_DIVINATION } from "@/lib/data";
import { useUser } from "@/lib/UserContext";
import { delay } from "@/lib/utils";

const TABS = [
  { key: "lottery", label: "关帝灵签", icon: "🔮" },
  { key: "divination", label: "周易占卜", icon: "☰" },
] as const;

export default function FortunePage() {
  const [tab, setTab] = useState<"lottery" | "divination">("lottery");

  return (
    <main className="flex-1">
      <div className="mx-auto max-w-2xl px-4 pb-16 pt-6">
        {/* Header */}
        <ScrollReveal>
          <div className="flex items-center gap-3">
            <Link href="/" className="flex size-9 items-center justify-center rounded-full bg-gold/10 text-gold hover:bg-gold/20">
              <ArrowLeft className="size-4" />
            </Link>
            <h1 className="font-display text-2xl text-gold">求灵签 · 占卜</h1>
          </div>
        </ScrollReveal>

        {/* Tabs */}
        <ScrollReveal delay={0.1}>
          <div className="mt-5 flex rounded-lg border border-gold/20 bg-xuan-surface/60 p-1">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${tab === t.key ? "bg-gold text-xuan" : "text-paper-dark hover:text-gold"}`}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* Content */}
        <div className="mt-6">
          {tab === "lottery" ? <LotterySection /> : <DivinationSection />}
        </div>

        {/* Back home */}
        <ScrollReveal delay={0.3}>
          <div className="mt-12 text-center">
            <p className="font-display text-lg text-gold/60">心诚则灵</p>
            <Link href="/" className="mt-2 inline-block text-sm text-paper-dark/50 hover:text-gold">← 返回首页</Link>
          </div>
        </ScrollReveal>
      </div>
    </main>
  );
}

function LotterySection() {
  const [question, setQuestion] = useState("");
  const [drawing, setDrawing] = useState(false);
  const [result, setResult] = useState<(typeof LOTTERY_POOL)[0] | null>(null);
  const [error, setError] = useState("");
  const { addFortuneRecord } = useUser();

  const handleDraw = async () => {
    if (!question.trim()) { setError("请先输入你想问的问题"); return; }
    setError("");
    setDrawing(true);
    setResult(null);
    await delay(1500 + Math.random() * 1000);
    const sign = LOTTERY_POOL[Math.floor(Math.random() * LOTTERY_POOL.length)];
    setResult(sign);
    addFortuneRecord({
      id: `lottery_${Date.now()}`,
      type: "lottery",
      question: question.trim(),
      result: `${sign.title} · ${sign.level}`,
      level: sign.level,
      timestamp: new Date().toISOString(),
    });
    setDrawing(false);
  };

  return (
    <ScrollReveal delay={0.15}>
      <div className="rounded-2xl border border-gold/20 bg-gradient-to-b from-xuan-card to-xuan-surface p-6">
        <div className="text-center">
          <BodhiLeaf className="mx-auto size-16" />
          <h2 className="mt-3 font-display text-xl text-gold">灵棋占签</h2>
          <p className="mt-1 text-xs text-paper-dark/70">以《灵棋经》为宗，传黄石公或东方朔遗法</p>
        </div>

        {/* Question input */}
        {!result && (
          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-sm text-paper-dark mb-2">你想问什么？（心诚则灵）</label>
              <textarea
                value={question}
                onChange={(e) => { setQuestion(e.target.value); setError(""); }}
                placeholder="如：今年的事业运势如何？"
                className="w-full rounded-xl border border-gold/20 bg-xuan/80 px-4 py-3 text-sm text-paper placeholder:text-paper-dark/30 focus:border-gold/50 focus:outline-none resize-none"
                rows={3}
              />
              {error && <p className="mt-1 text-xs text-vermillion">{error}</p>}
            </div>

            <Button variant="ritual" size="lg" className="w-full" loading={drawing} onClick={handleDraw}>
              {drawing ? "诚心求签中..." : "🔮 摇签求签"}
            </Button>
          </div>
        )}

        {/* Result */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 space-y-4"
            >
              <div className="rounded-xl border border-gold/30 bg-xuan/60 p-5 text-center">
                <p className="text-xs text-gold/50">{"source" in result ? result.source : "《灵棋经》"}</p>
                <p className="text-xs text-gold/60 mt-1">第 {result.sign_no} 签 · {result.level}</p>
                <h3 className="mt-2 font-display text-2xl text-gold">{result.title}</h3>
                <div className="mx-auto mt-3 h-px w-16 bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
                <p className="mt-3 font-display text-lg text-paper leading-relaxed">{result.poem}</p>
              </div>

              <div className="rounded-xl border border-gold/15 bg-xuan-surface/40 p-4">
                <p className="text-xs text-gold/60 mb-2">签文解读</p>
                <p className="text-sm text-paper-dark leading-relaxed">{result.interpret}</p>
              </div>

              <div className="flex gap-2">
                {result.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs text-gold">{tag}</span>
                ))}
              </div>

              <div className="flex gap-3">
                <Button variant="secondary" className="flex-1" onClick={() => { setResult(null); setQuestion(""); }}>
                  再求一签
                </Button>
                <ShareButton title={`灵棋占签 - ${result.title}`} description={result.poem} className="flex-1" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ScrollReveal>
  );
}

function DivinationSection() {
  const [question, setQuestion] = useState("");
  const [casting, setCasting] = useState(false);
  const [result, setResult] = useState<typeof MOCK_DIVINATION | null>(null);
  const [error, setError] = useState("");
  const { addFortuneRecord } = useUser();

  const handleCast = async () => {
    if (!question.trim()) { setError("请先输入你想问的问题"); return; }
    setError("");
    setCasting(true);
    setResult(null);
    await delay(2000 + Math.random() * 1000);
    const divResult = { ...MOCK_DIVINATION, data: { ...MOCK_DIVINATION.data, session_id: `div_${Date.now()}` } };
    setResult(divResult);
    addFortuneRecord({
      id: `div_${Date.now()}`,
      type: "divination",
      question: question.trim(),
      result: `${divResult.data.original_hexagram.name} → ${divResult.data.changed_hexagram.name}`,
      timestamp: new Date().toISOString(),
    });
    setCasting(false);
  };

  return (
    <ScrollReveal delay={0.15}>
      <div className="rounded-2xl border border-gold/20 bg-gradient-to-b from-xuan-card to-xuan-surface p-6">
        <div className="text-center">
          <span className="text-4xl">☰</span>
          <h2 className="mt-2 font-display text-xl text-gold">周易六爻占卜</h2>
          <p className="mt-1 text-xs text-paper-dark/70">六十四卦 · 三百八十四爻 · 卦象通天地</p>
        </div>

        {!result && (
          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-sm text-paper-dark mb-2">请默念问题，诚心求卦</label>
              <textarea
                value={question}
                onChange={(e) => { setQuestion(e.target.value); setError(""); }}
                placeholder="如：换工作是否合适？"
                className="w-full rounded-xl border border-gold/20 bg-xuan/80 px-4 py-3 text-sm text-paper placeholder:text-paper-dark/30 focus:border-gold/50 focus:outline-none resize-none"
                rows={3}
              />
              {error && <p className="mt-1 text-xs text-vermillion">{error}</p>}
            </div>
            <Button variant="ritual" size="lg" className="w-full" loading={casting} onClick={handleCast}>
              {casting ? "起卦中..." : "☰ 诚心起卦"}
            </Button>
          </div>
        )}

        <AnimatePresence>
          {result && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6 space-y-4">
              {/* Hexagram */}
              <div className="rounded-xl border border-gold/30 bg-xuan/60 p-5 text-center">
                <p className="text-5xl mb-2">{result.data.original_hexagram.unicode}</p>
                <p className="text-xs text-gold/60">
                  本卦：{result.data.original_hexagram.name}
                  （{result.data.original_hexagram.bagua_up.nature}{result.data.original_hexagram.bagua_down.nature}）
                </p>
                <p className="text-xs text-gold/60 mt-1">
                  变卦：{result.data.changed_hexagram.name}
                  （{result.data.changed_hexagram.bagua_up.nature}{result.data.changed_hexagram.bagua_down.nature}）
                </p>

                {/* Lines visualization */}
                <div className="mt-3 space-y-1 font-mono text-gold">
                  {result.data.lines.slice().reverse().map((line, i) => (
                    <p key={i} className={`${line.changing ? "text-vermillion" : ""}`}>
                      {line.display} {line.changing ? "○" : ""}
                    </p>
                  ))}
                </div>

                <p className="mt-2 text-xs text-gold/50">动爻：第{result.data.changing_line}爻</p>
                <p className="mt-1 text-xs italic text-paper-dark/70">"{result.data.changing_line_text}"</p>
                <p className="text-xs text-gold/60 mt-1">卦辞：{result.data.judgment}</p>
              </div>

              {/* Interpretation */}
              <div className="rounded-xl border border-gold/15 bg-xuan-surface/40 p-4">
                <p className="text-xs text-gold/60 mb-2">卦象解读</p>
                {result.interpretation.segments.map((s, i) => (
                  <p key={i} className="text-sm text-paper-dark leading-relaxed mt-2">{s}</p>
                ))}
              </div>

              {/* References */}
              {result.interpretation.references && (
                <div className="rounded-xl border border-gold/15 bg-xuan-surface/40 p-4">
                  <p className="text-xs text-gold/60 mb-2">古籍出处</p>
                  {result.interpretation.references.map((ref, i) => (
                    <p key={i} className="text-xs text-paper-dark/60 mt-1">
                      《{ref.book}》·{ref.chapter}："{ref.quote}"
                    </p>
                  ))}
                </div>
              )}

              <div className="flex gap-3">
                <Button variant="secondary" className="flex-1" onClick={() => { setResult(null); setQuestion(""); }}>
                  再起一卦
                </Button>
                <ShareButton title={`周易占卜 - ${result.data.original_hexagram.name}`} description={result.interpretation.segments[0]} className="flex-1" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ScrollReveal>
  );
}
