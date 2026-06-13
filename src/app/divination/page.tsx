"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";
import { ShareButton } from "@/components/ShareButton";
import { Button } from "@/components/Button";
import { MOCK_DIVINATION } from "@/lib/data";
import { useUser } from "@/lib/UserContext";
import { delay } from "@/lib/utils";

export default function DivinationPage() {
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
    <main className="flex-1">
      <div className="mx-auto max-w-2xl px-4 pb-16 pt-6">
        <ScrollReveal>
          <div className="flex items-center gap-3">
            <Link href="/" className="flex size-9 items-center justify-center rounded-full bg-gold/10 text-gold hover:bg-gold/20">
              <ArrowLeft className="size-4" />
            </Link>
            <h1 className="font-display text-2xl text-gold">周易占卜</h1>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="mt-6 rounded-2xl border border-gold/20 bg-gradient-to-b from-xuan-card to-xuan-surface p-6">
            <div className="text-center">
              <span className="text-4xl">☰</span>
              <h2 className="mt-2 font-display text-xl text-gold">周易六爻占卜</h2>
              <p className="mt-1 text-xs text-paper-dark/70">以钱代蓍 · 纳甲筮法 · 参《增删卜易》《卜筮正宗》《火珠林》</p>
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
                  <div className="rounded-xl border border-gold/30 bg-xuan/60 p-5 text-center">
                    <p className="text-5xl mb-2">{result.data.original_hexagram.unicode}</p>
                    <p className="text-xs text-gold/60">本卦：{result.data.original_hexagram.name}</p>
                    <p className="text-xs text-gold/60">变卦：{result.data.changed_hexagram.name}</p>

                    <div className="mt-3 space-y-1 font-mono">
                      {result.data.lines.slice().reverse().map((line, i) => (
                        <div key={i} className={`flex items-center justify-center gap-2 ${line.changing ? "text-vermillion" : "text-gold"}`}>
                          <span className="text-xs w-8 text-right text-paper-dark/40">{line.liu_shou}</span>
                          <span>{line.display}</span>
                          <span>{line.changing ? "○" : " "}</span>
                          <span className="text-xs w-8 text-left text-paper-dark/40">{line.liu_qin}</span>
                        </div>
                      ))}
                    </div>
                    {result.data.method_source && (
                      <p className="mt-2 text-xs text-paper-dark/40 italic">{result.data.method_source}</p>
                    )}

                    <p className="mt-2 text-xs text-gold/50">动爻：第{result.data.changing_line}爻</p>
                    <p className="mt-1 text-xs italic text-paper-dark/70">"{result.data.changing_line_text}"</p>
                    <p className="text-xs text-gold/60 mt-1">卦辞：{result.data.judgment}</p>
                  </div>

                  <div className="rounded-xl border border-gold/15 bg-xuan-surface/40 p-4">
                    <p className="text-xs text-gold/60 mb-2">卦象解读</p>
                    {result.interpretation.segments.map((s, i) => (
                      <p key={i} className="text-sm text-paper-dark leading-relaxed mt-2">{s}</p>
                    ))}
                  </div>

                  {result.interpretation.references && (
                    <div className="rounded-xl border border-gold/15 bg-xuan-surface/40 p-4">
                      <p className="text-xs text-gold/60 mb-2">古籍出处</p>
                      {result.interpretation.references.map((ref, i) => (
                        <p key={i} className="text-xs text-paper-dark/60 mt-1">《{ref.book}》·{ref.chapter}："{ref.quote}"</p>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Button variant="secondary" className="flex-1" onClick={() => { setResult(null); setQuestion(""); }}>再起一卦</Button>
                    <ShareButton title={`周易占卜 - ${result.data.original_hexagram.name}`} description={result.interpretation.segments[0]} className="flex-1" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </ScrollReveal>
      </div>
    </main>
  );
}
