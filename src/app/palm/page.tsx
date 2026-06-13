"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Camera, Image, ChevronDown, ChevronUp, Sparkles, BookOpen } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";
import { ShareButton } from "@/components/ShareButton";
import { Button } from "@/components/Button";
import { LockedContent } from "@/components/LockedContent";
import { PaymentModal } from "@/components/PaymentModal";
import { usePaymentWall } from "@/lib/usePaymentWall";
import { useUser } from "@/lib/UserContext";
import { useAdmin } from "@/lib/AdminContext";
import { PALM_LINES, PALM_MOUNDS, MASTERS } from "@/lib/data";
import { delay, cn } from "@/lib/utils";

const LINE_COLORS: Record<string, string> = {
  life: "border-vermillion-light",
  head: "border-sky-400",
  heart: "border-pink-400",
  fate: "border-amber-400",
};

const LINE_BG: Record<string, string> = {
  life: "bg-vermillion/5",
  head: "bg-sky-500/5",
  heart: "bg-pink-500/5",
  fate: "bg-amber-500/5",
};

export default function PalmPage() {
  const [step, setStep] = useState<"form" | "analyzing" | "result">("form");
  const [master, setMaster] = useState("huiming");
  const [hand, setHand] = useState<"left" | "right">("left");
  const [preview, setPreview] = useState<string | null>(null);
  const [showDiagram, setShowDiagram] = useState(false);
  const [selectedLine, setSelectedLine] = useState<string>("");
  const fileRef = useRef<HTMLInputElement>(null);
  const { addFortuneRecord, addMerit, user } = useUser();
  const payment = usePaymentWall("palm", "¥18");
  const { addOrder } = useAdmin();

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("图片不能超过 5MB");
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
  };

  const handleAnalyze = async () => {
    if (!preview) return;
    payment.setIsPaid();
    setStep("analyzing");
    await delay(2500);
    setStep("result");
  };

  const handlePaymentSuccess = (screenshot?: string) => {
    addFortuneRecord({
      id: `palm_${Date.now()}`,
      type: "palm",
      question: `${selectedMaster.name} · ${hand === "left" ? "左手" : "右手"}手相`,
      result: `${PALM_LINES.length}线解读`,
      timestamp: new Date().toISOString(),
    });
    addMerit(18);
    addOrder({
      userPhone: user?.phone || "",
      userName: user?.name || "",
      service: "palm",
      amount: "¥18",
      amountNumber: 18,
      status: "pending",
      screenshot,
      detail: `${selectedMaster.name}开示${hand === "left" ? "左手" : "右手"}手相 · 四线解读`,
    });
    payment.markPending();
  };

  const handleReset = () => {
    setPreview(null);
    setStep("form");
    setSelectedLine("");
    payment.setIsPaid();
  };

  const selectedMaster = MASTERS.find((m) => m.id === master)!;

  return (
    <main className="flex-1">
      <div className="mx-auto max-w-2xl px-4 pb-16 pt-6">
        <ScrollReveal>
          <div className="flex items-center gap-3">
            <Link href="/" className="flex size-9 items-center justify-center rounded-full bg-gold/10 text-gold hover:bg-gold/20">
              <ArrowLeft className="size-4" />
            </Link>
            <h1 className="font-display text-2xl text-gold">手相图解</h1>
          </div>
        </ScrollReveal>

        {/* Intro */}
        <ScrollReveal delay={0.1}>
          <div className="mt-6 rounded-2xl border border-gold/20 bg-gradient-to-b from-xuan-card to-xuan-surface p-6 text-center">
            <span className="text-5xl">🖐️</span>
            <h2 className="mt-2 font-display text-xl text-gold">手相图解</h2>
            <p className="mt-1 text-sm text-paper-dark/70 leading-relaxed">
              拍一张清晰掌心照，师父依《麻衣神相》《神相全编》逐线开示 — 非AI图像识别
            </p>
            <p className="mt-1 text-xs text-paper-dark/60">
              观地纹·人纹·天纹·玉柱纹，可知性情、姻缘、事业、健康与人生走势
            </p>
          </div>
        </ScrollReveal>

        {step === "form" && (
          <>
            {/* Master selection */}
            <ScrollReveal delay={0.15}>
              <div className="mt-5 rounded-2xl border border-gold/15 bg-xuan-surface/40 p-5">
                <p className="text-xs text-gold/60 mb-3">请选一位师父为您开示</p>
                <div className="space-y-2">
                  {MASTERS.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setMaster(m.id)}
                      className={cn(
                        "w-full rounded-xl border p-4 text-left transition-colors flex items-start gap-3",
                        master === m.id
                          ? "border-gold bg-gold/5"
                          : "border-gold/15 hover:border-gold/30"
                      )}
                    >
                      <span className="text-2xl shrink-0">{m.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gold">{m.name}</span>
                          <span className="text-xs text-paper-dark/40">{m.title}</span>
                          <span className="text-xs text-paper-dark/50">· {m.style}</span>
                        </div>
                        <p className="text-sm text-paper-dark/60 mt-0.5 leading-relaxed">{m.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            {/* Hand selection */}
            <ScrollReveal delay={0.2}>
              <div className="mt-4 rounded-2xl border border-gold/15 bg-xuan-surface/40 p-5">
                <p className="text-xs text-gold/60 mb-3">看哪只手</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { key: "left", label: "左手（先天）", desc: "主先天本性" },
                    { key: "right", label: "右手（后天）", desc: "主后天发展" },
                  ].map((h) => (
                    <button
                      key={h.key}
                      onClick={() => setHand(h.key as "left" | "right")}
                      className={cn(
                        "rounded-xl border p-4 text-center transition-colors",
                        hand === h.key
                          ? "border-gold bg-gold/5"
                          : "border-gold/15 hover:border-gold/30"
                      )}
                    >
                      <span className="text-2xl">{h.key === "left" ? "🖐️" : "✋"}</span>
                      <p className="mt-1 text-sm font-medium text-gold">{h.label}</p>
                      <p className="text-xs text-paper-dark/50 mt-0.5">{h.desc}</p>
                    </button>
                  ))}
                </div>
                <p className="mt-3 text-xs text-paper-dark/40 text-center">
                  传统认为：男左女右；左手主先天本性，右手主后天发展。
                </p>
              </div>
            </ScrollReveal>

            {/* Photo upload */}
            <ScrollReveal delay={0.25}>
              <div className="mt-4 rounded-2xl border border-gold/15 bg-xuan-surface/40 p-5">
                <p className="text-xs text-gold/60 mb-3">拍摄要求</p>
                <div className="space-y-1 mb-4">
                  <p className="text-sm text-paper-dark/60">· 自然光下，掌心张开正对镜头</p>
                  <p className="text-sm text-paper-dark/60">· 五指自然伸展，不要过分用力</p>
                  <p className="text-sm text-paper-dark/60">· 主要线条（生命线、智慧线、感情线）清晰可见</p>
                  <p className="text-sm text-paper-dark/60">· 图片小于 5MB，jpg/png 格式</p>
                </div>

                <input
                  ref={fileRef}
                  type="file"
                  accept="image/jpeg,image/png"
                  onChange={handleFile}
                  className="hidden"
                  capture="environment"
                />

                {preview ? (
                  <div className="space-y-3">
                    <div className="relative mx-auto max-w-xs rounded-xl border border-gold/20 overflow-hidden">
                      <img src={preview} alt="手相预览" className="w-full h-auto" />
                      <button
                        onClick={() => setPreview(null)}
                        className="absolute top-2 right-2 size-7 rounded-full bg-black/50 text-white text-xs flex items-center justify-center hover:bg-black/70"
                      >
                        ✕
                      </button>
                    </div>
                    <Button variant="ritual" size="lg" className="w-full" onClick={handleAnalyze}>
                      请师父开示
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => fileRef.current?.click()}
                      className="rounded-xl border border-gold/20 bg-xuan/60 p-4 text-center hover:border-gold/40 transition-colors"
                    >
                      <Camera className="mx-auto size-6 text-gold/60" />
                      <p className="mt-1 text-sm text-gold">拍摄手相</p>
                      <p className="text-xs text-paper-dark/50 mt-0.5">现在打开摄像头</p>
                    </button>
                    <button
                      onClick={() => {
                        const input = fileRef.current;
                        if (input) {
                          input.removeAttribute("capture");
                          input.click();
                          input.setAttribute("capture", "environment");
                        }
                      }}
                      className="rounded-xl border border-gold/20 bg-xuan/60 p-4 text-center hover:border-gold/40 transition-colors"
                    >
                      <Image className="mx-auto size-6 text-gold/60" />
                      <p className="mt-1 text-sm text-gold">从相册选</p>
                      <p className="text-xs text-paper-dark/50 mt-0.5">已有照片直接传</p>
                    </button>
                  </div>
                )}

                <p className="mt-3 text-center text-xs text-paper-dark/30">
                  图片仅用于本次解读，不会用于其他用途。
                </p>
              </div>
            </ScrollReveal>
          </>
        )}

        {step === "analyzing" && (
          <div className="mt-12 flex flex-col items-center gap-4">
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-6xl"
            >
              🖐️
            </motion.div>
            <p className="text-sm text-gold/70 animate-pulse">
              {selectedMaster.name}依《麻衣神相》为您观手相…
            </p>
            <p className="text-xs text-paper-dark/50">
              观手之纹理 · 察色之荣枯 · 辨纹之吉凶 · 非AI图像识别
            </p>
          </div>
        )}

        {step === "result" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 space-y-5"
          >
            {/* Result header */}
            <div className="rounded-2xl border border-gold/30 bg-gradient-to-b from-xuan-card to-xuan-surface p-5 text-center">
              <span className="text-4xl">{selectedMaster.icon}</span>
              <h3 className="mt-2 font-display text-lg text-gold">{selectedMaster.name}·开示</h3>
              <p className="mt-1 text-xs text-paper-dark/60">
                已观{hand === "left" ? "左手（先天）" : "右手（后天）"}掌纹 · 依《麻衣神相》《神相全编》参解 · 非AI生成
              </p>
            </div>

            {/* Line interpretations */}
            <div className="space-y-3">
              {PALM_LINES.slice(0, 1).map((line, i) => (
                <motion.div
                  key={line.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.12 }}
                  className={cn("rounded-2xl border p-5", LINE_BG[line.id], LINE_COLORS[line.id])}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="size-4 text-gold" />
                    <h4 className="font-display text-base text-gold">{line.name}</h4>
                  </div>
                  <p className="text-xs text-paper-dark leading-relaxed">{line.description}</p>
                  <p className="text-xs text-gold/60 mt-3 mb-2">纹路形态</p>
                  <div className="space-y-2">
                    {line.types.map((t, j) => (
                      <div key={j} className="rounded-lg bg-xuan/40 p-2.5">
                        <p className="text-xs font-medium text-gold">{t.name}</p>
                        <p className="text-sm text-paper-dark/60 mt-0.5">{t.meaning}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 border-t border-gold/10 pt-2">
                    <p className="text-xs text-paper-dark/40 italic">{line.source}</p>
                  </div>
                </motion.div>
              ))}

              <LockedContent locked={!payment.isPaid} pending={payment.isPending} price="¥18" onUnlock={() => payment.initiatePayment()}>
                {PALM_LINES.slice(1).map((line, i) => (
                  <motion.div
                    key={line.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (i + 1) * 0.12 }}
                    className={cn("rounded-2xl border p-5 mb-3", LINE_BG[line.id], LINE_COLORS[line.id])}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="size-4 text-gold" />
                      <h4 className="font-display text-base text-gold">{line.name}</h4>
                    </div>
                    <p className="text-xs text-paper-dark leading-relaxed">{line.description}</p>
                    <p className="text-xs text-gold/60 mt-3 mb-2">纹路形态</p>
                    <div className="space-y-2">
                      {line.types.map((t, j) => (
                        <div key={j} className="rounded-lg bg-xuan/40 p-2.5">
                          <p className="text-xs font-medium text-gold">{t.name}</p>
                          <p className="text-sm text-paper-dark/60 mt-0.5">{t.meaning}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 border-t border-gold/10 pt-2">
                      <p className="text-xs text-paper-dark/40 italic">{line.source}</p>
                    </div>
                  </motion.div>
                ))}
              </LockedContent>
            </div>

            <div className="flex gap-3">
              <Button variant="secondary" className="flex-1" onClick={handleReset}>
                重新上传
              </Button>
              <ShareButton
                title="如愿禅苑 · 手相图解"
                description={`${selectedMaster.name}开示${hand === "left" ? "左手" : "右手"}手相 · 以《麻衣神相》为宗`}
                className="flex-1"
              />
            </div>
          </motion.div>
        )}

        {/* Palm line reference diagram (collapsible) */}
        <ScrollReveal delay={0.3}>
          <div className="mt-5 rounded-2xl border border-gold/15 bg-xuan-surface/40 p-5">
            <button
              onClick={() => setShowDiagram(!showDiagram)}
              className="w-full flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl">🖐️</span>
                <span className="text-sm text-gold/70">手相主线位置参考（点击展开对照）</span>
              </div>
              {showDiagram ? (
                <ChevronUp className="size-4 text-gold/50" />
              ) : (
                <ChevronDown className="size-4 text-gold/50" />
              )}
            </button>

            <AnimatePresence>
              {showDiagram && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 space-y-4">
                    {/* SVG diagram */}
                    <div className="relative mx-auto w-48 h-64 rounded-2xl bg-xuan-card border border-gold/20 overflow-hidden">
                      <div className="absolute inset-4 rounded-[60px] border border-gold/20" />
                      <svg viewBox="0 0 200 260" className="absolute inset-0 w-full h-full">
                        <path d="M 60 70 C 30 90, 20 150, 50 220" stroke="#D96555" strokeWidth="1.5" fill="none" />
                        <path d="M 60 70 C 90 75, 140 80, 170 95" stroke="#38BDF8" strokeWidth="1.5" fill="none" />
                        <path d="M 170 60 C 140 90, 110 110, 100 130" stroke="#F472B6" strokeWidth="1.5" fill="none" />
                        <path d="M 100 180 C 100 150, 100 130, 95 80" stroke="#FBBF24" strokeWidth="1" fill="none" strokeDasharray="4 2" />
                      </svg>
                      <button onClick={() => setSelectedLine(selectedLine === "life" ? "" : "life")} className="absolute bottom-3 left-4 text-xs text-vermillion-light hover:text-vermillion">地纹</button>
                      <button onClick={() => setSelectedLine(selectedLine === "head" ? "" : "head")} className="absolute top-8 right-6 text-xs text-sky-400 hover:text-sky-300">人纹</button>
                      <button onClick={() => setSelectedLine(selectedLine === "heart" ? "" : "heart")} className="absolute top-20 right-2 text-xs text-pink-400 hover:text-pink-300">天纹</button>
                      <button onClick={() => setSelectedLine(selectedLine === "fate" ? "" : "fate")} className="absolute top-40 left-1/2 -translate-x-1/2 text-xs text-amber-400 hover:text-amber-300">玉柱纹</button>
                    </div>

                    {selectedLine && (
                      <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}>
                        {PALM_LINES.filter((l) => l.id === selectedLine).map((line) => (
                          <div key={line.id} className={cn("rounded-xl border p-4", LINE_BG[line.id], LINE_COLORS[line.id])}>
                            <p className="text-sm font-medium text-gold">{line.name}</p>
                            <p className="text-xs text-paper-dark/60 mt-1">{line.description}</p>
                            <p className="text-xs text-paper-dark/40 mt-1 italic">{line.source}</p>
                          </div>
                        ))}
                      </motion.div>
                    )}

                    <p className="text-center text-xs text-paper-dark/30">
                      此图为示意之用，实际手相因人而异，须对照自身掌纹参考
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </ScrollReveal>

        {/* Palm mounds */}
        <ScrollReveal delay={0.35}>
          <div className="mt-5 rounded-2xl border border-gold/15 bg-xuan-surface/40 p-5">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="size-4 text-gold/60" />
              <h3 className="font-display text-lg text-gold">八卦九宫 · 掌丘</h3>
            </div>
            <p className="text-xs text-paper-dark/50 mb-4">
              《麻衣神相》相手篇：「八卦列于掌中，九宫分于指下。厚者为吉，薄者为平，陷者为欠。」
            </p>
            <div className="grid grid-cols-2 gap-3">
              {PALM_MOUNDS.map((mound) => (
                <div key={mound.id} className="rounded-xl border border-gold/15 bg-xuan/40 p-3">
                  <p className="text-sm font-medium text-gold">{mound.name}</p>
                  <p className="text-sm text-paper-dark/60 mt-1">{mound.meaning}</p>
                  <p className="text-xs text-paper-dark/30 mt-1 italic">{mound.source}</p>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        <PaymentModal
          open={payment.showPayment}
          onClose={() => payment.setShowPayment(false)}
          title="手相图解"
          amount="¥18"
          description={`${selectedMaster.name}开示${hand === "left" ? "左手" : "右手"}手相 · 四线完整解读`}
          onSuccess={handlePaymentSuccess}
          mode="qrcode"
        />

        {/* Footer */}
        <ScrollReveal delay={0.4}>
          <div className="mt-6 space-y-2 text-center">
            <p className="text-xs text-paper-dark/30">
              《麻衣神相》· 相手篇终：「手之有纹，如木之有络。纹清者贵，纹乱者劳。观手而可知一生矣。」
            </p>
            <ShareButton title="如愿禅苑 · 手相图解" description="拍一张清晰掌心照，依《麻衣神相》等古籍逐线开示。观手之纹理而知命。" />
          </div>
        </ScrollReveal>
      </div>
    </main>
  );
}
