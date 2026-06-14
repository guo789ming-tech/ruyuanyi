"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Sparkles } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";
import { ShareButton } from "@/components/ShareButton";
import { Button } from "@/components/Button";
import { LOTTERY_POOL, MOCK_DIVINATION } from "@/lib/data";
import { useUser } from "@/lib/UserContext";
import { delay } from "@/lib/utils";

const STICK_NUMBERS = [
  "第一签", "第二签", "第三签", "第四签", "第五签",
  "第六签", "第七签", "第八签", "第九签", "第十签",
  "十一签", "十二签", "十三签", "十四签", "十五签",
];

// ============ Sound Effects ============
function useSignTubeSound() {
  const ctxRef = useRef<AudioContext | null>(null);

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext();
    }
    return ctxRef.current;
  }, []);

  const playShake = useCallback(() => {
    try {
      const ctx = getCtx();
      const duration = 2.2;
      const now = ctx.currentTime;
      for (let i = 0; i < 40; i++) {
        const t = now + (i / 40) * duration + (Math.random() - 0.5) * 0.04;
        const bufferSize = Math.floor(ctx.sampleRate * (0.02 + Math.random() * 0.04));
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let j = 0; j < bufferSize; j++) {
          data[j] = (Math.random() * 2 - 1) * (0.2 + Math.random() * 0.3);
        }
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        const filter = ctx.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.value = 600 + Math.random() * 1400;
        filter.Q.value = 1.5;
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.25, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
        source.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        source.start(t);
        source.stop(t + 0.05);
      }
    } catch { /* audio not critical */ }
  }, [getCtx]);

  const playRise = useCallback(() => {
    try {
      const ctx = getCtx();
      const now = ctx.currentTime;
      // Single stick scraping sound
      const osc = ctx.createOscillator();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.linearRampToValueAtTime(800, now + 0.4);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(2000, now);
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.5);
    } catch { /* audio not critical */ }
  }, [getCtx]);

  const playPop = useCallback(() => {
    try {
      const ctx = getCtx();
      const now = ctx.currentTime;
      // Sharp pop/clack
      const osc = ctx.createOscillator();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(1800, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.2);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.2);
    } catch { /* audio not critical */ }
  }, [getCtx]);

  return { playShake, playRise, playPop };
}

// ============ Sign Tube Component ============
function SignTube({ size = "sm" }: { size?: "sm" | "lg" }) {
  const s = size === "lg" ? 1.6 : 1;
  return (
    <div
      className="relative inline-flex flex-col items-center"
      style={{ width: 72 * s, height: 96 * s }}
    >
      {/* Sticks */}
      <div className="absolute top-0 flex justify-center" style={{ left: 12 * s, right: 12 * s, gap: 2 * s }}>
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            style={{
              width: 3.5 * s,
              height: 46 * s,
              background: "linear-gradient(to bottom, #C45641 0%, #C45641 18%, #E8D5A3 18%, #D4C08C 100%)",
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
          height: 54 * s,
          background: "linear-gradient(180deg, #C4956A 0%, #A0724A 30%, #8B5E3C 60%, #7A4E30 100%)",
          border: `${2 * s}px solid #6B3A20`,
          boxShadow: "inset 0 2px 8px rgba(0,0,0,0.3), 0 4px 12px rgba(0,0,0,0.4)",
        }}
      >
        {/* Bamboo texture lines */}
        <div className="flex gap-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="rounded-full"
              style={{
                width: 5 * s,
                height: 26 * s,
                background: "rgba(180,130,60,0.15)",
                border: "1px solid rgba(180,130,60,0.25)",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

const TAB_ICON_SIGN_TUBE = (
  <span className="inline-flex align-text-bottom" style={{ width: 18, height: 20, verticalAlign: "middle" }}>
    <span
      className="inline-block rounded-sm"
      style={{
        width: 16,
        height: 14,
        background: "linear-gradient(180deg, #C4956A, #8B5E3C)",
        border: "1px solid #6B3A20",
        marginTop: 4,
      }}
    />
  </span>
);

export default function FortunePage() {
  const [tab, setTab] = useState<"lottery" | "divination">("lottery");

  return (
    <main className="flex-1">
      <div className="mx-auto max-w-2xl px-4 pb-16 pt-6">
        <ScrollReveal>
          <div className="flex items-center gap-3">
            <Link href="/" className="flex size-9 items-center justify-center rounded-full bg-gold/10 text-gold hover:bg-gold/20">
              <ArrowLeft className="size-4" />
            </Link>
            <h1 className="font-display text-2xl text-gold">求灵签 · 占卜</h1>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="mt-5 flex rounded-lg border border-gold/20 bg-xuan-surface/60 p-1">
            <button
              onClick={() => setTab("lottery")}
              className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors flex items-center justify-center gap-1.5 ${tab === "lottery" ? "bg-gold text-xuan" : "text-paper-dark hover:text-gold"}`}
            >
              {TAB_ICON_SIGN_TUBE} 关帝灵签
            </button>
            <button
              onClick={() => setTab("divination")}
              className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${tab === "divination" ? "bg-gold text-xuan" : "text-paper-dark hover:text-gold"}`}
            >
              ☰ 周易占卜
            </button>
          </div>
        </ScrollReveal>

        <div className="mt-6">
          {tab === "lottery" ? <LotterySection /> : <DivinationSection />}
        </div>

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
  const sound = useSignTubeSound();

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
        sound.playRise();
      }, 2200));
    }

    if (shakePhase === "rising") {
      timers.push(setTimeout(() => {
        setShakePhase("reveal");
        sound.playPop();
      }, 900));
    }

    if (shakePhase === "reveal") {
      timers.push(setTimeout(() => {
        setShakePhase("done");
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
      }, 1000));
    }

    return () => timers.forEach(clearTimeout);
  }, [shakePhase]);

  const handleDraw = () => {
    if (!question.trim()) { setError("请先输入你想问的问题"); return; }
    setError("");
    setDrawing(true);
    setResult(null);
    setShakePhase("shaking");
    sound.playShake();
  };

  const resetForNew = () => {
    setResult(null);
    setQuestion("");
    setShakePhase("idle");
    setStickNumber("");
  };

  return (
    <ScrollReveal delay={0.15}>
      <div className="rounded-2xl border border-gold/20 bg-gradient-to-b from-xuan-card to-xuan-surface p-6">
        {/* Header */}
        <div className="text-center">
          <SignTube size="sm" />
          <h2 className="mt-3 font-display text-xl text-gold">关帝灵签</h2>
          <p className="mt-1 text-xs text-paper-dark/70">诚心摇签 · 一签一事 · 百签指迷津</p>
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
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
                style={{
                  width: 200,
                  height: 200,
                  background: "radial-gradient(circle, rgba(212,168,83,0.1) 0%, transparent 70%)",
                }}
              />

              <div className="relative flex flex-col items-center gap-6">
                {/* Status text */}
                <motion.p
                  key={shakePhase}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-display text-gold text-sm tracking-wider"
                >
                  {shakePhase === "shaking" && "哗啦... 诚心摇动签筒..."}
                  {shakePhase === "rising" && "灵签将出..."}
                  {shakePhase === "reveal" && "灵签已得"}
                </motion.p>

                {/* Shaking tube */}
                <div
                  className={shakePhase === "shaking" ? "animate-[tube-shake_0.1s_ease-in-out_infinite]" : shakePhase === "rising" ? "animate-[tube-shake_0.3s_ease-in-out_infinite]" : ""}
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
                          : { type: "spring", stiffness: 200, damping: 15 }
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

        {/* Input */}
        {!drawing && !result && shakePhase === "idle" && (
          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-sm text-paper-dark mb-2">请默念所求之事，诚心摇签</label>
              <textarea
                value={question}
                onChange={(e) => { setQuestion(e.target.value); setError(""); }}
                placeholder="如：今年的事业运势如何？"
                className="w-full rounded-xl border border-gold/20 bg-xuan/80 px-4 py-3 text-sm text-paper placeholder:text-paper-dark/30 focus:border-gold/50 focus:outline-none resize-none"
                rows={3}
              />
              {error && <p className="mt-1 text-xs text-vermillion">{error}</p>}
            </div>

            <Button variant="ritual" size="lg" className="w-full" onClick={handleDraw}>
              摇签求签
            </Button>
          </div>
        )}

        {/* Result */}
        <AnimatePresence>
          {result && shakePhase === "done" && (
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
                <Button variant="secondary" className="flex-1" onClick={resetForNew}>
                  再求一签
                </Button>
                <ShareButton title={`关帝灵签 - ${result.title}`} description={result.poem} className="flex-1" />
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

                <div className="mt-3 space-y-1 font-mono text-gold">
                  {result.data.lines.slice().reverse().map((line, i) => (
                    <p key={i} className={`${line.changing ? "text-vermillion" : ""}`}>
                      {line.display} {line.changing ? "○" : ""}
                    </p>
                  ))}
                </div>

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
                    <p key={i} className="text-xs text-paper-dark/60 mt-1">
                       《{ref.book}》·{ref.chapter}：&ldquo;{ref.quote}&rdquo;
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
