"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Flame } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";
import { ShareButton } from "@/components/ShareButton";
import { Button } from "@/components/Button";
import { INCENSE_TYPES, MAX_INCENSE_RITUALS, INCENSE_PER_RITUAL } from "@/lib/data";
import { useUser } from "@/lib/UserContext";
import { delay, cn } from "@/lib/utils";

export default function TemplePage() {
  const [totalRituals, setTotalRituals] = useState(0);
  const [totalIncense, setTotalIncense] = useState(0);
  const [merit, setMerit] = useState(0);
  const [selectedIncense, setSelectedIncense] = useState("tanxiang");
  const [lighting, setLighting] = useState(false);
  const [lit, setLit] = useState(false);
  const [smokeParticles, setSmokeParticles] = useState<{ id: number; x: number; delay: number }[]>([]);
  const { addIncenseRecord, addMerit } = useUser();

  const incense = INCENSE_TYPES.find((i) => i.id === selectedIncense)!;
  const canLight = totalRituals < MAX_INCENSE_RITUALS;

  const handleLight = async () => {
    if (!canLight) return;
    setLighting(true);
    setLit(false);

    // Generate smoke particles
    const particles = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      x: (Math.random() - 0.5) * 60,
      delay: Math.random() * 0.8,
    }));
    setSmokeParticles(particles);

    await delay(3000);

    const newRituals = totalRituals + 1;
    const newIncense = totalIncense + INCENSE_PER_RITUAL;
    setTotalRituals(newRituals);
    setTotalIncense(newIncense);
    setMerit((prev) => prev + incense.merit_bonus);
    addMerit(incense.merit_bonus);
    addIncenseRecord({
      id: `incense_${Date.now()}`,
      incense_type: selectedIncense,
      rituals: 1,
      merit: incense.merit_bonus,
      timestamp: new Date().toISOString(),
    });
    setLighting(false);
    setLit(true);
    setTimeout(() => setLit(false), 2000);
  };

  return (
    <main className="flex-1">
      <div className="mx-auto max-w-2xl px-4 pb-16 pt-6">
        <ScrollReveal>
          <div className="flex items-center gap-3">
            <Link href="/" className="flex size-9 items-center justify-center rounded-full bg-gold/10 text-gold hover:bg-gold/20">
              <ArrowLeft className="size-4" />
            </Link>
            <h1 className="font-display text-2xl text-gold">在线上香</h1>
          </div>
        </ScrollReveal>

        <div className="mt-6 space-y-5">
          {/* Main incense area */}
          <ScrollReveal delay={0.1}>
            <div className="rounded-2xl border border-gold/20 bg-gradient-to-b from-xuan-card to-xuan-surface p-6 text-center">
              <p className="text-xs text-paper-dark/60">
                心诚则灵，每日最多三礼，每礼三炷清香。
              </p>

              {/* Incense display area */}
              <div className="relative my-6 mx-auto h-48 w-64">
                {/* Incense holder */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-8 rounded-t-full bg-[#8B6914] border-2 border-[#A07818]" />

                {/* Incense sticks */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
                  {Array.from({ length: INCENSE_PER_RITUAL }).map((_, i) => (
                    <div key={i} className="relative">
                      <motion.div
                        className="w-1 h-20 bg-gradient-to-b from-[#D4A54A] to-[#8B4513] rounded-full origin-bottom"
                        animate={lighting ? { opacity: [0.3, 1, 0.3] } : {}}
                        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                      />
                      {/* Glowing tip */}
                      {lighting && (
                        <motion.div
                          className="absolute -top-1 left-1/2 -translate-x-1/2 size-2 rounded-full bg-orange-400 blur-[2px]"
                          animate={{ scale: [1, 1.5, 1], opacity: [0.7, 1, 0.7] }}
                          transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
                        />
                      )}
                    </div>
                  ))}
                </div>

                {/* Smoke particles */}
                <AnimatePresence>
                  {lighting &&
                    smokeParticles.map((p) => (
                      <motion.div
                        key={p.id}
                        initial={{ opacity: 0.6, y: 40, x: 0, scale: 0.3 }}
                        animate={{ opacity: 0, y: -60, x: p.x, scale: 1.5 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 2, delay: p.delay, ease: "easeOut" }}
                        className="absolute left-1/2 top-20 size-3 rounded-full bg-stone-400/40 blur-sm"
                      />
                    ))}
                </AnimatePresence>

                {/* Lit confirmation */}
                <AnimatePresence>
                  {lit && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <span className="text-6xl drop-shadow-[0_0_20px_rgba(251,191,36,0.5)]">🪔</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-center gap-6 mb-4">
                <div className="text-center">
                  <p className="text-xs text-paper-dark/50">三礼九炷</p>
                  <p className="font-display text-xl text-gold">
                    {totalRituals} <span className="text-sm text-paper-dark/50">/ {MAX_INCENSE_RITUALS}</span> 礼
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-paper-dark/50">已奉香</p>
                  <p className="font-display text-xl text-gold">
                    {totalIncense} <span className="text-sm text-paper-dark/50">炷</span>
                  </p>
                </div>
              </div>

              {/* Light button */}
              <Button
                variant="ritual"
                size="lg"
                className="w-full"
                loading={lighting}
                onClick={handleLight}
                disabled={!canLight && !lighting}
              >
                {lighting
                  ? "清香冉冉升起..."
                  : !canLight
                  ? `今日已完成 ${MAX_INCENSE_RITUALS} 礼`
                  : "敬上三炷清香"}
              </Button>

              {/* Full message */}
              {!canLight && !lighting && (
                <motion.p
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 text-sm text-gold"
                >
                  今日已奉香 {totalRituals} / {MAX_INCENSE_RITUALS} 礼 · 已插入 {totalIncense} 炷清香
                </motion.p>
              )}

              {/* Incense type selector */}
              <div className="mt-5">
                <p className="text-xs text-gold/60 mb-2">选择香火</p>
                <div className="grid grid-cols-3 gap-2">
                  {INCENSE_TYPES.map((inc) => (
                    <button
                      key={inc.id}
                      onClick={() => setSelectedIncense(inc.id)}
                      className={cn(
                        "rounded-xl border p-3 text-center transition-colors",
                        selectedIncense === inc.id
                          ? "border-gold bg-gold/10"
                          : "border-gold/15 bg-xuan-surface/40 hover:border-gold/30"
                      )}
                    >
                      <span className="text-xl">{inc.icon}</span>
                      <p className="mt-1 text-xs font-medium text-gold">{inc.name}</p>
                      <p className="text-xs text-paper-dark/50">+{inc.merit_bonus}功德</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Merit display */}
              <div className="mt-4 rounded-xl border border-gold/15 bg-xuan/60 py-3">
                <div className="flex items-center justify-center gap-2">
                  <Flame className="size-4 text-orange-400" />
                  <span className="text-xs text-paper-dark/60">当前功德值</span>
                  <span className="font-display text-lg text-gold">{merit}</span>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Explanation */}
          <ScrollReveal delay={0.2}>
            <div className="rounded-xl border border-gold/10 bg-xuan/40 p-4 text-center">
              <p className="text-xs text-paper-dark/60 leading-relaxed">
                一礼三炷清香，记 5 点功德。香火不在多，在心念端正、持之以恒。
              </p>
              <p className="mt-1 text-xs text-paper-dark/40">
                《华严经》：「若人欲了知，三世一切佛，应观法界性，一切唯心造。」
              </p>
            </div>
          </ScrollReveal>

          <div className="text-center">
            <ShareButton title="如愿禅苑在线上香" description="三礼九炷，为家人、为众生敬奉清香。香火在心念，不在多。" />
          </div>
        </div>
      </div>
    </main>
  );
}
