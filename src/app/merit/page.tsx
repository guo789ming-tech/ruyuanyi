"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Award, Flame, TrendingUp, Zap, Gift } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";
import { ShareButton } from "@/components/ShareButton";
import { useUser, type User } from "@/lib/UserContext";
import { delay, cn } from "@/lib/utils";

const LEVEL_THRESHOLDS: [number, string][] = [
  [5000, "大功德主"],
  [1000, "功德主"],
  [500, "行者"],
  [100, "居士"],
  [0, "善信"],
];

const MAX_INCENSE_PER_DAY = 3;
const STORAGE_TODAY = "ruyuanyi_merit_today";

function getTodayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function MeritPage() {
  const { user, isLoggedIn, addMerit, incenseHistory, fortuneHistory, blessingHistory, dreamHistory } = useUser();

  const todayKey = getTodayKey();
  const saved = typeof window !== "undefined" ? (() => {
    try {
      const raw = localStorage.getItem(STORAGE_TODAY);
      return raw ? JSON.parse(raw) : { date: "", checkin: false, incense: 0 };
    } catch { return { date: "", checkin: false, incense: 0 }; }
  })() : { date: "", checkin: false, incense: 0 };

  const isToday = saved.date === todayKey;
  const [todayCheckin, setTodayCheckin] = useState(isToday && saved.checkin);
  const [todayIncense, setTodayIncense] = useState(isToday ? saved.incense : 0);

  const [showAnimation, setShowAnimation] = useState(false);
  const [animText, setAnimText] = useState("");

  // Persist today state
  useEffect(() => {
    localStorage.setItem(STORAGE_TODAY, JSON.stringify({ date: todayKey, checkin: todayCheckin, incense: todayIncense }));
  }, [todayCheckin, todayIncense]);

  const merit = user?.merit || 0;
  const currentLevel = LEVEL_THRESHOLDS.find(([t]) => merit >= t)?.[1] || "善信";
  const nextLevel = LEVEL_THRESHOLDS.slice().reverse().find(([t]) => t > merit);

  const handleCheckin = async () => {
    if (todayCheckin || !isLoggedIn) return;
    setAnimText("功德 +10");
    setShowAnimation(true);
    setTodayCheckin(true);
    addMerit(10);
    await delay(1500);
    setShowAnimation(false);
  };

  const handleIncense = async () => {
    if (todayIncense >= MAX_INCENSE_PER_DAY || !isLoggedIn) return;
    setAnimText("功德 +5");
    setShowAnimation(true);
    setTodayIncense((n: number) => n + 1);
    addMerit(5);
    await delay(1500);
    setShowAnimation(false);
  };

  // Recent records from all histories (real data)
  const recentRecords = (() => {
    const all: { action: string; amount: number; timestamp: string }[] = [];
    for (const r of fortuneHistory) {
      all.push({ action: r.type === "lottery" ? "求签" : "占卜", amount: 5, timestamp: r.timestamp });
    }
    for (const r of incenseHistory) {
      all.push({ action: `上香 · ${r.rituals}礼`, amount: r.merit, timestamp: r.timestamp });
    }
    for (const r of blessingHistory) {
      all.push({ action: "祈福点灯", amount: 10, timestamp: r.timestamp });
    }
    for (const r of dreamHistory) {
      all.push({ action: "解梦", amount: 3, timestamp: r.timestamp });
    }
    all.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
    return all.slice(0, 10);
  })();

  // Leaderboard from localStorage
  const [leaderboard, setLeaderboard] = useState<{ phone: string; name: string; merit: number; level: string }[]>([]);
  const [myRank, setMyRank] = useState<number | null>(null);

  useEffect(() => {
    const entries: { phone: string; name: string; merit: number; level: string }[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("ruyuanyi_user_1")) {
        try {
          const u = JSON.parse(localStorage.getItem(key)!) as User;
          entries.push({ phone: u.phone, name: u.name, merit: u.merit, level: u.level });
        } catch { /* skip corrupt data */ }
      }
    }
    entries.sort((a, b) => b.merit - a.merit);
    setLeaderboard(entries.slice(0, 20));
    if (user) {
      const idx = entries.findIndex((e) => e.phone === user.phone);
      setMyRank(idx >= 0 ? idx + 1 : null);
    }
  }, [user, merit]);

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
                  <span>距{nextLevel[1]}</span>
                  <span>{merit}/{nextLevel[0]}</span>
                </div>
                <div className="h-1.5 rounded-full bg-xuan-surface/80 overflow-hidden">
                  <motion.div className="h-full rounded-full bg-gold" initial={{ width: 0 }} animate={{ width: `${Math.min(100, (merit / nextLevel[0]) * 100)}%` }} transition={{ duration: 0.8 }} />
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
              disabled={todayIncense >= MAX_INCENSE_PER_DAY}
              className={cn("rounded-2xl border p-4 text-center transition-colors", todayIncense >= MAX_INCENSE_PER_DAY ? "border-gold/10 bg-xuan-surface/30 opacity-50 cursor-not-allowed" : "border-gold/20 bg-xuan-surface/60 hover:border-gold/40 hover:bg-gold/5")}
            >
              <Flame className="mx-auto size-6 text-orange-400" />
              <p className="mt-2 text-sm font-medium text-gold">烧香祈福</p>
              <p className="mt-0.5 text-xs text-paper-dark/50">{todayIncense}/{MAX_INCENSE_PER_DAY} · +5功德</p>
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
              {recentRecords.length === 0 ? (
                <p className="text-xs text-paper-dark/40 text-center py-4">暂无记录 · 求签上香即得功德</p>
              ) : (
                recentRecords.slice(0, 8).map((r, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <span className="text-paper-dark/70">{r.action}</span>
                    <span className="text-gold/60">+{r.amount}</span>
                  </div>
                ))
              )}
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

            {myRank && (
              <div className="mb-3 rounded-lg border border-gold/30 bg-gold/5 px-4 py-3 flex items-center gap-3">
                <span className="font-mono text-sm text-gold">#{myRank}</span>
                <span className="flex-1 text-sm text-paper-dark">我的排名</span>
                <span className="text-sm text-gold">{merit.toLocaleString()}功德</span>
              </div>
            )}

            <div className="space-y-2">
              {leaderboard.length === 0 ? (
                <p className="text-xs text-paper-dark/40 text-center py-4">暂无数据</p>
              ) : (
                leaderboard.slice(0, 10).map((entry, i) => (
                  <div key={entry.phone} className={cn("flex items-center gap-3 rounded-lg px-3 py-2.5", i < 3 ? "bg-gold/5 border border-gold/10" : "")}>
                    <span className={cn("w-6 text-center font-mono text-sm", i < 3 ? ["text-yellow-400", "text-zinc-300", "text-amber-600"][i] : "text-paper-dark/40")}>
                      {i < 3 ? ["🥇", "🥈", "🥉"][i] : i + 1}
                    </span>
                    <Award className={cn("size-3", i < 3 ? ["text-yellow-400", "text-zinc-300", "text-amber-600"][i] : "")} />
                    <span className="flex-1 text-sm text-paper-dark truncate">{entry.name}</span>
                    <span className="text-xs text-gold/70">{entry.level}</span>
                    <span className="text-xs text-paper-dark/50 w-16 text-right">{entry.merit.toLocaleString()}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.3}>
          <div className="mt-6 text-center">
            <p className="font-display text-sm text-gold/50">日行一善 · 功德无量</p>
            <ShareButton title="如愿禅苑功德榜" description={`我已累积${merit}功德${myRank ? `，排名第${myRank}位` : ""}`} className="mt-3" />
          </div>
        </ScrollReveal>
      </div>
    </main>
  );
}
