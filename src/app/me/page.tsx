"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  User,
  Flame,
  History,
  LogOut,
  Sparkles,
  Search,
} from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Button } from "@/components/Button";
import { useUser } from "@/lib/UserContext";
import type { FortuneRecord, IncenseRecord, BlessingRecord, DreamRecord } from "@/lib/UserContext";
import { delay, cn } from "@/lib/utils";

const TABS = [
  { key: "fortune", label: "求签记录" },
  { key: "incense", label: "上香记录" },
  { key: "blessing", label: "祈福订单" },
  { key: "dream", label: "解梦记录" },
] as const;

export default function MePage() {
  const {
    user,
    isLoggedIn,
    logout,
    fortuneHistory,
    incenseHistory,
    blessingHistory,
    dreamHistory,
    setShowAuthModal,
    retrieveRecords,
  } = useUser();

  const [activeTab, setActiveTab] = useState<string>("fortune");
  const [retrievePhone, setRetrievePhone] = useState("");
  const [showRetrieve, setShowRetrieve] = useState(false);
  const [retrieving, setRetrieving] = useState(false);
  const [retrieveMsg, setRetrieveMsg] = useState("");

  const handleRetrieve = async () => {
    if (!/^1\d{10}$/.test(retrievePhone)) {
      setRetrieveMsg("请输入正确的手机号");
      return;
    }
    setRetrieving(true);
    await delay(1200);
    const found = retrieveRecords(retrievePhone);
    setRetrieving(false);
    setRetrieveMsg(found ? "记录已找回！" : "未找到该手机号的记录");
    if (found) setTimeout(() => setShowRetrieve(false), 1500);
  };

  if (!isLoggedIn || !user) {
    return (
      <main className="flex-1 pb-20">
        <div className="mx-auto max-w-2xl px-4 pb-16 pt-6">
          <ScrollReveal>
            <div className="flex items-center gap-3">
              <Link href="/" className="flex size-9 items-center justify-center rounded-full bg-gold/10 text-gold hover:bg-gold/20">
                <ArrowLeft className="size-4" />
              </Link>
              <h1 className="font-display text-2xl text-gold">我的</h1>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className="mt-12 flex flex-col items-center gap-4 text-center">
              <div className="size-20 rounded-full border-2 border-gold/20 flex items-center justify-center bg-gold/5">
                <User className="size-10 text-gold/40" />
              </div>
              <div>
                <p className="text-sm text-paper-dark/70">登录后可查看功德、记录与订单</p>
                <p className="mt-1 text-xs text-paper-dark/50">手机号登录 · 记录安全存储</p>
              </div>
              <Button variant="ritual" onClick={() => setShowAuthModal(true)}>
                登录 / 注册
              </Button>

              {/* Retrieve without login */}
              <div className="mt-6 w-full rounded-xl border border-gold/15 bg-xuan-surface/40 p-4">
                <button
                  onClick={() => setShowRetrieve(!showRetrieve)}
                  className="flex items-center gap-2 text-sm text-gold/60 hover:text-gold w-full"
                >
                  <Search className="size-4" />
                  找回记录
                </button>
                {showRetrieve && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-3 space-y-2"
                  >
                    <input
                      type="tel"
                      value={retrievePhone}
                      onChange={(e) => { setRetrievePhone(e.target.value); setRetrieveMsg(""); }}
                      placeholder="输入手机号找回记录"
                      maxLength={11}
                      className="w-full rounded-xl border border-gold/20 bg-xuan/80 px-4 py-2.5 text-sm text-paper placeholder:text-paper-dark/30 focus:border-gold/50 focus:outline-none"
                    />
                    {retrieveMsg && (
                      <p className={cn("text-xs", retrieveMsg.includes("找回") ? "text-emerald" : "text-vermillion")}>
                        {retrieveMsg}
                      </p>
                    )}
                    <Button variant="secondary" className="w-full" loading={retrieving} onClick={handleRetrieve}>
                      找回
                    </Button>
                  </motion.div>
                )}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 pb-20">
      <div className="mx-auto max-w-2xl px-4 pb-16 pt-6">
        <ScrollReveal>
          <div className="flex items-center gap-3">
            <Link href="/" className="flex size-9 items-center justify-center rounded-full bg-gold/10 text-gold hover:bg-gold/20">
              <ArrowLeft className="size-4" />
            </Link>
            <h1 className="font-display text-2xl text-gold">我的</h1>
            <button
              onClick={logout}
              className="ml-auto flex items-center gap-1 text-xs text-paper-dark/40 hover:text-vermillion"
            >
              <LogOut className="size-3" />
              退出
            </button>
          </div>
        </ScrollReveal>

        {/* Profile card */}
        <ScrollReveal delay={0.1}>
          <div className="mt-6 rounded-2xl border border-gold/20 bg-gradient-to-b from-xuan-card to-xuan-surface p-5">
            <div className="flex items-center gap-4">
              <div className="flex size-14 items-center justify-center rounded-full bg-gold/10 text-xl font-display text-gold border border-gold/20">
                {user.avatar}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-display text-lg text-gold">{user.name}</p>
                  <span className="rounded-full border border-gold/20 bg-gold/5 px-2 py-0.5 text-xs text-gold/70">
                    {user.level}
                  </span>
                </div>
                <p className="text-xs text-paper-dark/40">{user.phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2")}</p>
              </div>
              <div className="text-center">
                <p className="font-display text-2xl text-gold">{user.merit}</p>
                <p className="text-xs text-paper-dark/50">功德值</p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="rounded-lg bg-xuan/40 py-2 text-center">
                <p className="font-display text-lg text-gold">{user.total_fortunes}</p>
                <p className="text-xs text-paper-dark/50">求签占卜</p>
              </div>
              <div className="rounded-lg bg-xuan/40 py-2 text-center">
                <p className="font-display text-lg text-gold">{user.total_incense}</p>
                <p className="text-xs text-paper-dark/50">上香礼数</p>
              </div>
              <div className="rounded-lg bg-xuan/40 py-2 text-center">
                <p className="font-display text-lg text-gold">{user.total_blessings}</p>
                <p className="text-xs text-paper-dark/50">祈福灯数</p>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Record retrieval */}
        <ScrollReveal delay={0.15}>
          <div className="mt-4 rounded-xl border border-gold/15 bg-xuan-surface/40 p-4">
            <button
              onClick={() => setShowRetrieve(!showRetrieve)}
              className="flex items-center gap-2 text-xs text-gold/60 hover:text-gold w-full"
            >
              <Search className="size-3.5" />
              找回其他设备的记录
            </button>
            <AnimatePresence>
              {showRetrieve && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3 space-y-2 overflow-hidden"
                >
                  <input
                    type="tel"
                    value={retrievePhone}
                    onChange={(e) => { setRetrievePhone(e.target.value); setRetrieveMsg(""); }}
                    placeholder="输入手机号找回记录"
                    maxLength={11}
                    className="w-full rounded-xl border border-gold/20 bg-xuan/80 px-4 py-2.5 text-sm text-paper placeholder:text-paper-dark/30 focus:border-gold/50 focus:outline-none"
                  />
                  {retrieveMsg && (
                    <p className={cn("text-xs", retrieveMsg.includes("找回") ? "text-emerald" : "text-vermillion")}>
                      {retrieveMsg}
                    </p>
                  )}
                  <Button variant="secondary" size="sm" className="w-full" loading={retrieving} onClick={handleRetrieve}>
                    找回
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </ScrollReveal>

        {/* History tabs */}
        <ScrollReveal delay={0.2}>
          <div className="mt-5">
            <div className="flex gap-1 border-b border-gold/10 pb-2 overflow-x-auto">
              {TABS.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key)}
                  className={cn(
                    "shrink-0 rounded-lg px-4 py-2 text-xs transition-colors",
                    activeTab === t.key
                      ? "bg-gold/10 text-gold font-medium"
                      : "text-paper-dark/50 hover:text-gold"
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="mt-3">
              {activeTab === "fortune" && (
                <RecordList
                  records={fortuneHistory}
                  emptyText="暂无求签记录"
                  renderItem={(r: FortuneRecord) => (
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{r.type === "lottery" ? "🔮" : "☰"}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-paper-dark truncate">{r.question}</p>
                        <p className="text-xs text-gold/60">{r.result}</p>
                      </div>
                      <div className="text-right shrink-0">
                        {r.level && (
                          <span className={cn(
                            "text-xs rounded-full px-1.5 py-0.5",
                            r.level === "上上" || r.level === "上吉" ? "bg-emerald/10 text-emerald" : "text-paper-dark/50"
                          )}>{r.level}</span>
                        )}
                        <p className="text-xs text-paper-dark/40 mt-0.5">
                          {new Date(r.timestamp).toLocaleDateString("zh-CN")}
                        </p>
                      </div>
                    </div>
                  )}
                />
              )}

              {activeTab === "incense" && (
                <RecordList
                  records={incenseHistory}
                  emptyText="暂无上香记录"
                  renderItem={(r: IncenseRecord) => (
                    <div className="flex items-center gap-3">
                      <span className="text-lg">🪔</span>
                      <div className="flex-1">
                        <p className="text-sm text-paper-dark">
                          {r.rituals} 礼 · {r.incense_type === "tanxiang" ? "檀香" : r.incense_type === "chenxiang" ? "沉香" : "安神香"}
                        </p>
                        <p className="text-xs text-gold/60">功德 +{r.merit}</p>
                      </div>
                      <p className="text-xs text-paper-dark/40 shrink-0">
                        {new Date(r.timestamp).toLocaleDateString("zh-CN")}
                      </p>
                    </div>
                  )}
                />
              )}

              {activeTab === "blessing" && (
                <RecordList
                  records={blessingHistory}
                  emptyText="暂无祈福订单"
                  renderItem={(r: BlessingRecord) => (
                    <div className="flex items-center gap-3">
                      <span className="text-lg">🪔</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-paper-dark truncate">
                          为{r.name}祈福
                        </p>
                        <p className="text-xs text-gold/60">{r.duration} · {r.price}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className={cn(
                          "text-xs rounded-full px-1.5 py-0.5",
                          r.status === "paid" ? "bg-emerald/10 text-emerald" : r.status === "lit" ? "bg-gold/10 text-gold" : "bg-amber-500/10 text-amber-500"
                        )}>
                          {r.status === "paid" ? "已支付" : r.status === "lit" ? "已点亮" : "待支付"}
                        </span>
                        <p className="text-xs text-paper-dark/40 mt-0.5">
                          {new Date(r.timestamp).toLocaleDateString("zh-CN")}
                        </p>
                      </div>
                    </div>
                  )}
                />
              )}

              {activeTab === "dream" && (
                <RecordList
                  records={dreamHistory}
                  emptyText="暂无解梦记录"
                  renderItem={(r: DreamRecord) => (
                    <div className="flex items-center gap-3">
                      <span className="text-lg">🌙</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-paper-dark truncate">{r.keyword}</p>
                        <p className="text-xs text-paper-dark/60 truncate">{r.result}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className={cn(
                          "text-xs rounded-full px-1.5 py-0.5",
                          r.ji === "吉" ? "bg-emerald/10 text-emerald" : r.ji === "凶" ? "bg-vermillion/10 text-vermillion" : "bg-gold/10 text-gold"
                        )}>{r.ji}</span>
                        <p className="text-xs text-paper-dark/40 mt-0.5">
                          {new Date(r.timestamp).toLocaleDateString("zh-CN")}
                        </p>
                      </div>
                    </div>
                  )}
                />
              )}
            </div>
          </div>
        </ScrollReveal>

        <div className="mt-8 text-center">
          <p className="text-xs text-paper-dark/30">功德随身 · 善念长存</p>
        </div>
      </div>
    </main>
  );
}

function RecordList<T>({
  records,
  emptyText,
  renderItem,
}: {
  records: T[];
  emptyText: string;
  renderItem: (r: T) => React.ReactNode;
}) {
  if (records.length === 0) {
    return (
      <div className="py-12 text-center">
        <History className="mx-auto size-8 text-paper-dark/20" />
        <p className="mt-2 text-sm text-paper-dark/40">{emptyText}</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {records.map((r, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.03 }}
          className="rounded-lg border border-gold/10 bg-xuan/40 px-4 py-3"
        >
          {renderItem(r)}
        </motion.div>
      ))}
    </div>
  );
}

