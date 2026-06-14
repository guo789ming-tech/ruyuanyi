"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";
import { ShareButton } from "@/components/ShareButton";
import { Button } from "@/components/Button";
import { MOCK_DIVINATION } from "@/lib/data";
import { useUser } from "@/lib/UserContext";
import { delay } from "@/lib/utils";

const STICK_NUMBERS = [
  "第一签", "第二签", "第三签", "第四签", "第五签",
  "第六签", "第七签", "第八签", "第九签", "第十签",
  "十一签", "十二签", "十三签", "十四签", "十五签",
];

function SignTube({ size = "sm" }: { size?: "sm" | "lg" }) {
  const s = size === "lg" ? 1.6 : 1;
  return (
    <div
      className="relative inline-flex flex-col items-center"
      style={{ width: 72 * s, height: 96 * s }}
    >
      {/* Sticks cluster */}
      <div className="absolute top-0 flex justify-center gap-[2px]" style={{ left: 10 * s, right: 10 * s }}>
        {Array.from({ length: 11 }).map((_, i) => (
          <div
            key={i}
            className="rounded-t-sm"
            style={{
              width: 3 * s,
              height: 48 * s,
              background: "linear-gradient(to bottom, #C45641 0%, #C45641 20%, #E8D5A3 20%, #D4C08C 100%)",
              borderRadius: "2px 2px 0 0",
            }}
          />
        ))}
      </div>
      {/* Tube body */}
      <div
        className="absolute bottom-0 rounded-lg flex items-center justify-center"
        style={{
          width: 68 * s,
          height: 52 * s,
          background: "linear-gradient(180deg, #C4956A 0%, #A0724A 30%, #8B5E3C 60%, #7A4E30 100%)",
          border: "2px solid #6B3A20",
          boxShadow: "inset 0 2px 8px rgba(0,0,0,0.3), 0 4px 12px rgba(0,0,0,0.4)",
        }}
      >
        {/* Tube pattern */}
        <div className="flex gap-4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="rounded-full bg-gold/15"
              style={{ width: 6 * s, height: 28 * s, border: "1px solid rgba(180,130,60,0.3)" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function DivinationPage() {
  const [question, setQuestion] = useState("");
  const [casting, setCasting] = useState(false);
  const [result, setResult] = useState<typeof MOCK_DIVINATION | null>(null);
  const [error, setError] = useState("");
  const { addFortuneRecord } = useUser();

  // Shaking animation states
  const [shakePhase, setShakePhase] = useState<"idle" | "shaking" | "rising" | "reveal" | "done">("idle");
  const [stickNumber, setStickNumber] = useState("");

  useEffect(() => {
    if (shakePhase === "idle" || shakePhase === "done") return;

    const timers: ReturnType<typeof setTimeout>[] = [];

    if (shakePhase === "shaking") {
      timers.push(setTimeout(() => {
        setStickNumber(STICK_NUMBERS[Math.floor(Math.random() * STICK_NUMBERS.length)]);
        setShakePhase("rising");
      }, 2200));
    }

    if (shakePhase === "rising") {
      timers.push(setTimeout(() => {
        setShakePhase("reveal");
      }, 900));
    }

    if (shakePhase === "reveal") {
      timers.push(setTimeout(async () => {
        setShakePhase("done");
        // Show results
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
      }, 1200));
    }

    return () => timers.forEach(clearTimeout);
  }, [shakePhase]);

  const handleCast = async () => {
    if (!question.trim()) { setError("请先输入你想问的问题"); return; }
    setError("");
    setCasting(true);
    setResult(null);
    setShakePhase("shaking");
  };

  const resetForNew = () => {
    setResult(null);
    setQuestion("");
    setShakePhase("idle");
    setStickNumber("");
  };

  return (
    <main className="flex-1">
      <div className="mx-auto max-w-2xl px-4 pb-16 pt-6">
        <ScrollReveal>
          <div className="flex items-center gap-3">
            <Link href="/" className="flex size-9 items-center justify-center rounded-full bg-gold/10 text-gold hover:bg-gold/20">
              <ArrowLeft className="size-4" />
            </Link>
            <h1 className="font-display text-2xl text-gold">关帝灵签</h1>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="mt-6 rounded-2xl border border-gold/20 bg-gradient-to-b from-xuan-card to-xuan-surface p-6">
            {/* Header with sign tube */}
            <div className="text-center">
              <div className="inline-flex justify-center">
                <SignTube size="sm" />
              </div>
              <h2 className="mt-3 font-display text-xl text-gold">关帝灵签</h2>
              <p className="mt-1 text-xs text-paper-dark/70">诚心摇签 · 灵签指路 · 参《关帝灵签》百签谱</p>
            </div>

            {/* Shaking animation overlay */}
            <AnimatePresence>
              {(shakePhase === "shaking" || shakePhase === "rising" || shakePhase === "reveal") && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="relative mt-4 rounded-xl border border-gold/20 bg-xuan-dark/90 p-8 overflow-hidden"
                >
                  {/* Ambient glow */}
                  <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/5 blur-3xl"
                    style={{ width: 200, height: 200 }}
                  />

                  <div className="relative flex flex-col items-center gap-6">
                    {/* Status text */}
                    <motion.p
                      key={shakePhase}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="font-display text-gold text-sm tracking-wider"
                    >
                      {shakePhase === "shaking" && "诚心摇动签筒..."}
                      {shakePhase === "rising" && "灵签将出..."}
                      {shakePhase === "reveal" && "灵签已得"}
                    </motion.p>

                    {/* Shaking tube */}
                    <div
                      className={shakePhase === "shaking" ? "animate-[tube-shake_0.12s_ease-in-out_infinite]" : ""}
                      style={{ transformOrigin: "bottom center" }}
                    >
                      <SignTube size="lg" />
                    </div>

                    {/* Rising stick */}
                    <AnimatePresence>
                      {(shakePhase === "rising" || shakePhase === "reveal") && (
                        <motion.div
                          initial={{ opacity: 0, y: 0, rotate: 0 }}
                          animate={
                            shakePhase === "rising"
                              ? { opacity: 1, y: -100, rotate: -5 }
                              : { opacity: 1, y: 20, rotate: 0 }
                          }
                          transition={
                            shakePhase === "rising"
                              ? { duration: 0.9, ease: "easeOut" }
                              : { duration: 0.5, ease: "easeOut", type: "spring", stiffness: 200 }
                          }
                          className="absolute z-10"
                          style={{
                            width: 6,
                            height: 60,
                            background: "linear-gradient(to bottom, #C45641 0%, #C45641 22%, #E8D5A3 22%, #D4C08C 100%)",
                            borderRadius: "3px 3px 0 0",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                          }}
                        />
                      )}
                    </AnimatePresence>

                    {/* Revealed stick number */}
                    <AnimatePresence>
                      {shakePhase === "reveal" && (
                        <motion.div
                          initial={{ scale: 0, rotate: -180, opacity: 0 }}
                          animate={{ scale: 1, rotate: 0, opacity: 1 }}
                          transition={{ type: "spring", stiffness: 200, damping: 15 }}
                          className="flex items-center gap-3 rounded-xl border-2 border-gold/40 bg-xuan-card px-6 py-3 shadow-gold"
                        >
                          <div
                            className="rounded-full flex items-center justify-center"
                            style={{
                              width: 32,
                              height: 32,
                              background: "radial-gradient(circle at 30% 30%, #C45641, #8B2A1A)",
                              boxShadow: "0 0 12px rgba(196,86,65,0.5)",
                            }}
                          >
                            <span className="text-white text-xs font-bold">签</span>
                          </div>
                          <span className="font-display text-xl text-gold">{stickNumber}</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input area - only show when not casting and no result */}
            {!casting && !result && shakePhase === "idle" && (
              <div className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm text-paper-dark mb-2">请默念所求之事，诚心摇签</label>
                  <textarea
                    value={question}
                    onChange={(e) => { setQuestion(e.target.value); setError(""); }}
                    placeholder="如：换工作是否合适？"
                    className="w-full rounded-xl border border-gold/20 bg-xuan/80 px-4 py-3 text-sm text-paper placeholder:text-paper-dark/30 focus:border-gold/50 focus:outline-none resize-none"
                    rows={3}
                  />
                  {error && <p className="mt-1 text-xs text-vermillion">{error}</p>}
                </div>
                <Button variant="ritual" size="lg" className="w-full" onClick={handleCast}>
                  摇签求签
                </Button>
              </div>
            )}

            {/* Result */}
            <AnimatePresence>
              {result && shakePhase === "done" && (
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
                    <p className="mt-1 text-xs italic text-paper-dark/70">&ldquo;{result.data.changing_line_text}&rdquo;</p>
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
                        <p key={i} className="text-xs text-paper-dark/60 mt-1">《{ref.book}》·{ref.chapter}：&ldquo;{ref.quote}&rdquo;</p>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Button variant="secondary" className="flex-1" onClick={resetForNew}>再求一签</Button>
                    <ShareButton title={`关帝灵签 - ${result.data.original_hexagram.name}`} description={result.interpretation.segments[0]} className="flex-1" />
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
