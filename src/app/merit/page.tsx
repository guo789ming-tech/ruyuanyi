"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Award, Flame, TrendingUp, Zap, Gift } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";
import { ShareButton } from "@/components/ShareButton";
import { Button } from "@/components/Button";
import { MOCK_MERIT, MOCK_LEADERBOARD } from "@/lib/data";
import { delay, cn } from "@/lib/utils";

export default function MeritPage() {
  const [merit, setMerit] = useState(MOCK_MERIT.data.merit);
  const [todayIncense, setTodayIncense] = useState(MOCK_MERIT.data.today_incense);
  const [todayCheckin, setTodayCheckin] = useState(MOCK_MERIT.data.today_checkin);
  const [showAnimation, setShowAnimation] = useState(false);
  const [animText, setAnimText] = useState("");

  const handleCheckin = async () => {
    if (todayCheckin) return;
    setAnimText("功德 +10");
    setShowAnimation(true);
    setMerit((m) => m + 10);
    setTodayCheckin(true);
    await delay(1500);
    setShowAnimation(false);
  };

  const handleIncense = async () => {
    if (todayIncense >= MOCK_MERIT.data.max_incense_per_day) return;
    setAnimText("功德 +5");
    setShowAnimation(true);
    setMerit((m) => m + 5);
    setTodayIncense((n) => n + 1);
    await delay(1500);
    setShowAnimation(false);
  };

  const levelInfo = MOCK_MERIT.data.level_thresholds;
  const currentLevel = Object.entries(levelInfo).reduce((acc, [level, threshold]) => (merit >= threshold ? level : acc), "善信");
  const nextLevel = Object.entries(levelInfo).find(([, t]) => t > merit);

  return (
    <main className="flex-1">
      <div className="mx-auto max-w-2xl px-4 pb-16 pt-6">
        <ScrollReveal>
          <div className="flex items-center gap-3">
            <Link href="/" className="flex size-9 items-center justify-center rounded-full bg-gold/10 text-gold hover:bg-gold/20">
              <ArrowLeft className="size-4" />
            </Link>
            <h1 className="font-display text-2xl text-gold">功德榜</h1>
          </div>
        </ScrollReveal>

        <AnimatePresence>
          {showAnimation && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.8 }}
              animate={{ opacity: 1, y: -30, scale: 1.2 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed top-1/3 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
            >
              <p className="font-display text-3xl text-gold drop-shadow-lg">{animText}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Merit card */}
        <ScrollReveal delay={0.1}>
          <div className="mt-6 rounded-2xl border border-gold/30 bg-gradient-to-b from-gold/10 via-xuan-card to-xuan-surface p-6 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-xuan-surface/60 px-4 py-1.5">
              <Award className="size-4 text-gold" />
              <span className="text-sm text-gold">{currentLevel}</span>
            </div>

            <p className="mt-4 font-mono text-5xl font-bold text-gold">{merit.toLocaleString()}</p>
            <p className="mt-1 text-xs text-paper-dark/50">当前功德</p>

            {nextLevel && (
              <div className="mt-3">
                <div className="flex justify-between text-xs text-paper-dark/40 mb-1">
                  <span>距{nextLevel[0]}</span>
                  <span>{merit}/{nextLevel[1]}</span>
                </div>
                <div className="h-1.5 rounded-full bg-xuan-surface/80 overflow-hidden">
                  <motion.div className="h-full rounded-full bg-gold" initial={{ width: 0 }} animate={{ width: `${Math.min(100, (merit / nextLevel[1]) * 100)}%` }} transition={{ duration: 0.8 }} />
                </div>
              </div>
            )}
          </div>
        </ScrollReveal>

        {/* Daily actions */}
        <ScrollReveal delay={0.15}>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              onClick={handleCheckin}
              disabled={todayCheckin}
              className={cn("rounded-2xl border p-4 text-center transition-colors", todayCheckin ? "border-gold/10 bg-xuan-surface/30 opacity-50 cursor-not-allowed" : "border-gold/20 bg-xuan-surface/60 hover:border-gold/40 hover:bg-gold/5")}
            >
              <Zap className="mx-auto size-6 text-gold" />
              <p className="mt-2 text-sm font-medium text-gold">每日签到</p>
              <p className="mt-0.5 text-xs text-paper-dark/50">{todayCheckin ? "今日已签到" : "+10功德"}</p>
            </button>

            <button
              onClick={handleIncense}
              disabled={todayIncense >= MOCK_MERIT.data.max_incense_per_day}
              className={cn("rounded-2xl border p-4 text-center transition-colors", todayIncense >= MOCK_MERIT.data.max_incense_per_day ? "border-gold/10 bg-xuan-surface/30 opacity-50 cursor-not-allowed" : "border-gold/20 bg-xuan-surface/60 hover:border-gold/40 hover:bg-gold/5")}
            >
              <Flame className="mx-auto size-6 text-orange-400" />
              <p className="mt-2 text-sm font-medium text-gold">烧香祈福</p>
              <p className="mt-0.5 text-xs text-paper-dark/50">{todayIncense}/{MOCK_MERIT.data.max_incense_per_day} · +5功德</p>
            </button>
          </div>
        </ScrollReveal>

        {/* Recent records */}
        <ScrollReveal delay={0.2}>
          <div className="mt-4 rounded-2xl border border-gold/15 bg-xuan-surface/40 p-4">
            <h3 className="text-sm font-medium text-gold flex items-center gap-2">
              <TrendingUp className="size-3" />近期记录
            </h3>
            <div className="mt-2 space-y-1.5">
              {MOCK_MERIT.data.recent_records.map((r, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <span className="text-paper-dark/70">{r.action}</span>
                  <span className="text-gold/60">+{r.amount}</span>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Leaderboard */}
        <ScrollReveal delay={0.25}>
          <div className="mt-5 rounded-2xl border border-gold/15 bg-xuan-surface/40 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Gift className="size-4 text-gold" />
              <h3 className="font-display text-lg text-gold">功德排行榜</h3>
            </div>

            {/* My rank */}
            <div className="mb-3 rounded-lg border border-gold/30 bg-gold/5 px-4 py-3 flex items-center gap-3">
              <span className="font-mono text-sm text-gold">#{MOCK_LEADERBOARD.data.my_rank}</span>
              <span className="flex-1 text-sm text-paper-dark">我的排名</span>
              <span className="text-sm text-gold">{merit.toLocaleString()}功德</span>
            </div>

            <div className="space-y-2">
              {MOCK_LEADERBOARD.data.entries.map((entry) => {
                const badgeColor = entry.badge === "gold" ? "text-yellow-400" : entry.badge === "silver" ? "text-zinc-300" : "text-amber-600";
                return (
                  <div key={entry.rank} className={cn("flex items-center gap-3 rounded-lg px-3 py-2.5", entry.rank <= 3 ? "bg-gold/5 border border-gold/10" : "")}>
                    <span className={cn("w-6 text-center font-mono text-sm", entry.rank <= 3 ? badgeColor : "text-paper-dark/40")}>
                      {entry.rank <= 3 ? ["🥇", "🥈", "🥉"][entry.rank - 1] : entry.rank}
                    </span>
                    <Award className={cn("size-3", badgeColor)} />
                    <span className="flex-1 text-sm text-paper-dark">{entry.nickname}</span>
                    <span className="text-xs text-gold/70">{entry.level}</span>
                    <span className="text-xs text-paper-dark/50 w-16 text-right">{entry.merit.toLocaleString()}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.3}>
          <div className="mt-6 text-center">
            <p className="font-display text-sm text-gold/50">日行一善 · 功德无量</p>
            <ShareButton title="如愿禅苑功德榜" description={`我已累积${merit}功德，排名第${MOCK_LEADERBOARD.data.my_rank}位`} className="mt-3" />
          </div>
        </ScrollReveal>
      </div>
    </main>
  );
}
