"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Sparkles, Clock } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";
import { ShareButton } from "@/components/ShareButton";
import { Button } from "@/components/Button";
import { PaymentModal } from "@/components/PaymentModal";
import { useUser } from "@/lib/UserContext";
import { useAdmin } from "@/lib/AdminContext";
import { supabase } from "@/lib/supabase";
import { delay, cn } from "@/lib/utils";

const RELATIONS = [
  { id: "father", label: "父亲" },
  { id: "mother", label: "母亲" },
  { id: "lover", label: "爱人" },
  { id: "child", label: "孩子" },
  { id: "sister", label: "姐妹" },
  { id: "brother", label: "兄弟" },
  { id: "grandchild", label: "孙辈" },
  { id: "friend", label: "朋友" },
  { id: "self", label: "自己" },
];

// ---- Duration visual config ----
const DURATION_META: Record<string, {
  icon: string; subtitle: string; desc: string;
  flameColor: string; glowColor: string; ringColor: string;
  borderGlow: string;
}> = {
  "month":    { icon: "🕯️", subtitle: "随喜灯", desc: "小灯 · 30日长明",   flameColor: "from-amber-400 to-orange-500", glowColor: "bg-amber-500/15", ringColor: "ring-amber-500/20", borderGlow: "shadow-[0_0_30px_rgba(245,158,11,0.12)]" },
  "100days":  { icon: "🏮", subtitle: "祈福灯", desc: "中灯 · 百日长明",   flameColor: "from-orange-400 to-red-500", glowColor: "bg-orange-500/15", ringColor: "ring-orange-500/20", borderGlow: "shadow-[0_0_30px_rgba(249,115,22,0.12)]" },
  "year":     { icon: "🪔", subtitle: "长明灯", desc: "大灯 · 全年长明",   flameColor: "from-yellow-300 to-amber-500", glowColor: "bg-gold/20", ringColor: "ring-gold/30", borderGlow: "shadow-[0_0_40px_rgba(212,168,83,0.2)]" },
  "forever":  { icon: "🪷", subtitle: "永驻灯", desc: "莲灯 · 永久供奉",   flameColor: "from-rose-300 via-amber-400 to-rose-400", glowColor: "bg-rose-400/15", ringColor: "ring-rose-400/20", borderGlow: "shadow-[0_0_40px_rgba(251,113,133,0.15)]" },
};

const DURATION_BADGE: Record<string, string> = {
  "一月": "border-amber-500/30 bg-amber-500/10 text-amber-400",
  "百日": "border-orange-400/30 bg-orange-400/10 text-orange-300",
  "一年": "border-gold/40 bg-gold/10 text-gold",
  "永久": "border-rose-400/30 bg-rose-400/10 text-rose-300",
};

// ---- Types ----
interface LampEntry {
  id: string;
  subject: string;
  duration: string;
  wish: string;
  userName: string;
  timestamp: string;
  status: "pending" | "paid";
  isMine: boolean;
}

// ---- Helpers ----
function parseDetail(detail: string): { subject: string; duration: string; wish: string } {
  const parts = detail.split(" · ");
  return { subject: parts[0] || "", duration: parts[1] || "", wish: parts[2] || "" };
}

function desensitizeName(name: string): string {
  if (!name) return "***";
  if (name.length <= 1) return "*";
  if (name.length === 2) return name[0] + "*";
  if (name.length === 3) return name[0] + "**";
  return name[0] + "**" + name[name.length - 1];
}

function maskSubject(subject: string): string {
  return subject.replace(/^为(.{2})(.+?)祈福$/, (_, relation, name) => {
    return `为${relation}${desensitizeName(name)}祈福`;
  });
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "刚刚";
  if (mins < 60) return `${mins}分钟前`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}小时前`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}天前`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}个月前`;
  return `${Math.floor(months / 12)}年前`;
}

// ---- CSS Oil Lamp Flame ----
function LampFlame({ colorClass, size = "lg" }: { colorClass: string; size?: "sm" | "lg" }) {
  const dims = size === "sm" ? "size-6" : "size-8";
  const innerDims = size === "sm" ? "size-3" : "size-4";
  return (
    <div className={cn("relative mx-auto", size === "sm" ? "h-7" : "h-10")}>
      {/* Outer glow */}
      <div
        className={cn("absolute left-1/2 top-0 -translate-x-1/2 rounded-full blur-md bg-gradient-to-b", colorClass, dims)}
        style={{ animation: "flame-glow-pulse 2s ease-in-out infinite" }}
      />
      {/* Flame body - teardrop shape */}
      <div className="absolute left-1/2 top-0 -translate-x-1/2">
        <div
          className={cn("mx-auto rounded-full bg-gradient-to-t", colorClass, innerDims)}
          style={{
            animation: "flame-flicker 1.5s ease-in-out infinite",
            clipPath: "polygon(50% 0%, 0% 100%, 50% 85%, 100% 100%)",
            transformOrigin: "bottom center",
          }}
        />
      </div>
      {/* Floating sparkles */}
      <div
        className={cn("absolute left-1/2 top-0 -translate-x-1/2 rounded-full bg-amber-300/60", size === "sm" ? "size-0.5" : "size-1")}
        style={{ animation: "flame-spark-rise 1.8s ease-out infinite" }}
      />
    </div>
  );
}

// ---- Lamp Wall Card ----
function LampCard({ entry }: { entry: LampEntry }) {
  const durId = Object.entries(DURATION_META).find(
    ([, v]) => v.subtitle === ({ month: "随喜灯", "100days": "祈福灯", year: "长明灯", forever: "永驻灯" }[
      entry.duration === "一月" ? "month" : entry.duration === "百日" ? "100days" : entry.duration === "一年" ? "year" : "forever"
    ])
  )?.[0] || "month";
  const meta = DURATION_META[durId] || DURATION_META["month"];
  const badgeStyle = DURATION_BADGE[entry.duration] || DURATION_BADGE["一月"];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      layout
      className={cn(
        "relative rounded-2xl border p-3.5 flex flex-col items-center",
        entry.isMine
          ? "border-gold/50 bg-gradient-to-b from-gold/15 to-xuan-card/90 ring-1 ring-gold/30"
          : entry.status === "pending"
          ? "border-gold/10 bg-xuan-surface/50"
          : "border-gold/15 bg-xuan-surface/60"
      )}
    >
      {/* Background halo */}
      <div className="absolute inset-x-0 top-0 flex justify-center pointer-events-none">
        <div className={cn("size-14 rounded-full blur-xl", meta.glowColor, entry.status === "paid" ? "opacity-100" : "opacity-50")} />
      </div>

      {/* Flame + Lamp */}
      <div className="relative mt-1">
        <LampFlame colorClass={meta.flameColor} size="sm" />
        {/* Lamp body */}
        <div className="relative -mt-1 flex justify-center">
          <span className="text-3xl drop-shadow-[0_0_6px_rgba(212,168,83,0.4)]">
            {meta.icon}
          </span>
        </div>
      </div>

      {/* Subject — red ribbon plaque style */}
      <div className="mt-2 w-full rounded-md bg-gradient-to-r from-red-900/30 via-red-800/40 to-red-900/30 border border-red-800/30 px-2 py-1.5">
        <p className="text-center text-xs text-gold font-medium leading-tight">
          {entry.isMine ? entry.subject : maskSubject(entry.subject)}
        </p>
      </div>

      {/* Wish */}
      {entry.wish && (
        <p className="text-center text-[11px] text-paper-dark/45 italic mt-1.5 line-clamp-2 leading-tight">
          「{entry.wish}」
        </p>
      )}

      {/* Duration badge */}
      <div className="flex items-center justify-center gap-1.5 mt-2">
        <span className={cn("rounded-full border px-2 py-0.5 text-[11px] font-medium", badgeStyle)}>
          {entry.duration}
        </span>
        {entry.status === "pending" && (
          <span className="rounded-full border border-yellow-500/30 bg-yellow-500/10 px-1.5 py-0.5 text-[11px] text-yellow-400">
            审核中
          </span>
        )}
      </div>

      {/* Time + user */}
      <div className="flex items-center justify-center gap-1.5 mt-1.5 text-[11px] text-paper-dark/40">
        <Clock className="size-2.5" />
        <span>{timeAgo(entry.timestamp)}</span>
        <span>·</span>
        <span>{entry.isMine ? entry.userName : desensitizeName(entry.userName)}</span>
      </div>

      {/* Corner sparkle for paid lamps */}
      {entry.status === "paid" && (
        <Sparkles className="absolute top-2 right-2 size-3 text-gold/40" />
      )}
    </motion.div>
  );
}

export default function BlessingPage() {
  const [view, setView] = useState<"form" | "lighting" | "lit">("form");
  const [name, setName] = useState("");
  const [relation, setRelation] = useState("");
  const [duration, setDuration] = useState("month");
  const [wish, setWish] = useState("");
  const [yourName, setYourName] = useState("");
  const [error, setError] = useState("");
  const [showPayment, setShowPayment] = useState(false);
  const { isLoggedIn, setShowAuthModal, addBlessingRecord, user } = useUser();
  const { addOrder, pricing } = useAdmin();

  const [lampWall, setLampWall] = useState<LampEntry[]>([]);
  const [wallLoading, setWallLoading] = useState(true);

  const durations = [
    { id: "month", label: "一月", price: pricing.blessing_month },
    { id: "100days", label: "百日", price: pricing.blessing_100days },
    { id: "year", label: "一年", price: pricing.blessing_year },
    { id: "forever", label: "永久", price: pricing.blessing_forever },
  ];

  const selectedDuration = durations.find((d) => d.id === duration)!;
  const selectedMeta = DURATION_META[duration] || DURATION_META["month"];

  const fetchLampWall = useCallback(async () => {
    const phone = user?.phone || "";
    const { data, error: supabaseError } = await supabase
      .from("orders")
      .select("*")
      .eq("service", "blessing")
      .in("status", ["paid", "pending"])
      .order("timestamp", { ascending: false })
      .limit(50);

    if (supabaseError || !data) { setWallLoading(false); return; }

    const entries: LampEntry[] = data.map((o: Record<string, unknown>) => {
      const detail = (o.detail as string) || "";
      const parsed = parseDetail(detail);
      return {
        id: o.id as string,
        subject: parsed.subject,
        duration: parsed.duration,
        wish: parsed.wish,
        userName: (o.user_name as string) || "",
        timestamp: o.timestamp as string,
        status: (o.status as "paid" | "pending") || "paid",
        isMine: (o.user_phone as string) === phone,
      };
    });

    setLampWall((prev) => {
      const supabaseIds = new Set(entries.map((e) => e.id));
      const localMine = prev.filter((e) => e.isMine && !supabaseIds.has(e.id));
      return [...localMine, ...entries];
    });
    setWallLoading(false);
  }, [user?.phone]);

  useEffect(() => { fetchLampWall(); }, [fetchLampWall]);
  useEffect(() => {
    const interval = setInterval(() => fetchLampWall(), 15000);
    return () => clearInterval(interval);
  }, [fetchLampWall]);

  const handleLight = async () => {
    if (!name.trim()) { setError("请输入家人姓名"); return; }
    if (!relation) { setError("请选择与您的关系"); return; }
    if (!isLoggedIn) { setShowAuthModal(true); return; }
    setError("");
    setShowPayment(true);
  };

  const handlePaymentSuccess = async () => {
    const relationLabel = RELATIONS.find((r) => r.id === relation)?.label || "家人";
    const durationLabel = selectedDuration.label;

    addBlessingRecord({
      id: `bless_${Date.now()}`,
      name,
      relation: relationLabel,
      duration: durationLabel,
      price: selectedDuration.price,
      wish,
      status: "paid",
      timestamp: new Date().toISOString(),
    });

    const detailParts = [`为${relationLabel}${name}祈福`, durationLabel];
    if (wish.trim()) detailParts.push(wish.trim());

    await addOrder({
      userPhone: user?.phone || "",
      userName: user?.name || "",
      service: "blessing",
      amount: selectedDuration.price,
      amountNumber: parseFloat(selectedDuration.price.replace("¥", "")) || 0,
      status: "pending",
      detail: detailParts.join(" · "),
    });

    const newEntry: LampEntry = {
      id: `bless_${Date.now()}`,
      subject: `为${relationLabel}${name}祈福`,
      duration: durationLabel,
      wish: wish.trim(),
      userName: user?.name || "",
      timestamp: new Date().toISOString(),
      status: "pending",
      isMine: true,
    };
    setLampWall((prev) => [newEntry, ...prev]);

    setView("lighting");
    void (async () => {
      await delay(2500);
      setView("lit");
    })();
  };

  const handleReset = () => {
    setName(""); setRelation(""); setWish(""); setYourName(""); setDuration("month"); setView("form");
  };

  return (
    <main className="flex-1">
      <div className="mx-auto max-w-2xl px-4 pb-16 pt-6">
        <ScrollReveal>
          <div className="flex items-center gap-3">
            <Link href="/" className="flex size-9 items-center justify-center rounded-full bg-gold/10 text-gold hover:bg-gold/20">
              <ArrowLeft className="size-4" />
            </Link>
            <h1 className="font-display text-2xl text-gold">为家人祈福</h1>
          </div>
        </ScrollReveal>

        {view === "form" && (
          <ScrollReveal delay={0.1}>
            <div className="mt-6 rounded-2xl border border-gold/20 bg-gradient-to-b from-xuan-card to-xuan-surface p-6">
              <div className="text-center">
                <span className="text-4xl">🪔</span>
                <h2 className="mt-2 font-display text-xl text-gold">为家人祈福</h2>
                <p className="mt-1 text-sm text-paper-dark/70">
                  为家人点一盏如愿灯，挂名长明。心念所在，福报所在。
                </p>
              </div>

              <div className="mt-6 space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-xs text-paper-dark/60 mb-1">为谁祈福</label>
                  <input
                    type="text" value={name}
                    onChange={(e) => { setName(e.target.value); setError(""); }}
                    placeholder="家人姓名"
                    className="w-full rounded-xl border border-gold/20 bg-xuan/80 px-4 py-3 text-sm text-paper placeholder:text-paper-dark/30 focus:border-gold/50 focus:outline-none"
                  />
                </div>

                {/* Relation */}
                <div>
                  <label className="block text-xs text-paper-dark/60 mb-1">与您的关系</label>
                  <div className="flex flex-wrap gap-2">
                    {RELATIONS.map((r) => (
                      <button
                        key={r.id} onClick={() => setRelation(r.id)}
                        className={cn(
                          "rounded-lg border px-4 py-2 text-sm transition-colors",
                          relation === r.id ? "border-gold bg-gold/10 text-gold" : "border-gold/20 text-paper-dark hover:border-gold/40"
                        )}
                      >{r.label}</button>
                    ))}
                  </div>
                </div>

                {/* Duration — Temple plaque cards */}
                <div>
                  <label className="block text-xs text-paper-dark/60 mb-3">供奉时长</label>
                  <div className="grid grid-cols-2 gap-3">
                    {durations.map((d) => {
                      const meta = DURATION_META[d.id] || DURATION_META["month"];
                      const sel = duration === d.id;
                      return (
                        <button
                          key={d.id}
                          onClick={() => setDuration(d.id)}
                          className={cn(
                            "relative rounded-2xl border-2 py-5 px-3 text-center transition-all duration-500 flex flex-col items-center gap-2",
                            sel
                              ? "border-gold bg-gradient-to-b from-gold/12 via-gold/5 to-transparent scale-[1.02] " + meta.borderGlow
                              : "border-gold/10 bg-xuan/40 hover:border-gold/25 hover:bg-xuan/70"
                          )}
                        >
                          {/* Top ornamental line */}
                          <div className="flex items-center gap-2 w-full">
                            <div className={cn("h-px flex-1", sel ? "bg-gradient-to-r from-transparent to-gold/40" : "bg-gold/10")} />
                            <span className={cn("text-[10px] tracking-[0.3em] font-display", sel ? "text-gold/60" : "text-paper-dark/30")}>
                              {sel ? "· 供灯 ·" : "供灯"}
                            </span>
                            <div className={cn("h-px flex-1", sel ? "bg-gradient-to-l from-transparent to-gold/40" : "bg-gold/10")} />
                          </div>

                          {/* Lamp with flame */}
                          <div className="relative mt-1">
                            <LampFlame colorClass={meta.flameColor} size="sm" />
                            <span className={cn(
                              "text-3xl block -mt-1 transition-transform duration-500",
                              sel && "scale-110 drop-shadow-[0_0_12px_rgba(212,168,83,0.5)]"
                            )}>
                              {meta.icon}
                            </span>
                          </div>

                          {/* Duration name — large font */}
                          <p className={cn(
                            "font-display text-xl tracking-[0.3em] transition-colors duration-500",
                            sel ? "text-gold" : "text-paper-dark/60"
                          )}>
                            {d.label}
                          </p>

                          {/* Buddhist subtitle */}
                          <p className={cn(
                            "text-xs tracking-[0.2em] font-display",
                            sel ? "text-gold/80" : "text-paper-dark/40"
                          )}>
                            {meta.subtitle}
                          </p>

                          {/* Price + desc */}
                          <div className={cn(
                            "rounded-lg px-3 py-1.5 mt-1 transition-colors duration-500",
                            sel ? "bg-gold/10 border border-gold/20" : "bg-transparent"
                          )}>
                            <p className={cn("text-base font-medium", sel ? "text-gold" : "text-paper-dark/50")}>
                              {d.price}
                            </p>
                            <p className={cn("text-[10px] mt-0.5", sel ? "text-gold/50" : "text-paper-dark/30")}>
                              {meta.desc}
                            </p>
                          </div>

                          {/* Bottom ornamental dot */}
                          {sel && (
                            <div className="flex items-center gap-1.5">
                              <div className="size-1 rounded-full bg-gold/50" />
                              <div className="size-1.5 rounded-full bg-gold/70" />
                              <div className="size-1 rounded-full bg-gold/50" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Wish */}
                <div>
                  <label className="block text-xs text-paper-dark/60 mb-1">心愿（可选，最多 80 字）</label>
                  <textarea
                    value={wish} onChange={(e) => setWish(e.target.value)}
                    placeholder="写下你的祈福心愿..."
                    maxLength={80} rows={2}
                    className="w-full rounded-xl border border-gold/20 bg-xuan/80 px-4 py-3 text-sm text-paper placeholder:text-paper-dark/30 focus:border-gold/50 focus:outline-none resize-none"
                  />
                </div>

                {/* Your name */}
                <div>
                  <label className="block text-xs text-paper-dark/60 mb-1">您的称呼（可选，会显示在灯墙）</label>
                  <input
                    type="text" value={yourName} onChange={(e) => setYourName(e.target.value)}
                    placeholder="您的称呼"
                    className="w-full rounded-xl border border-gold/20 bg-xuan/80 px-4 py-3 text-sm text-paper placeholder:text-paper-dark/30 focus:border-gold/50 focus:outline-none"
                  />
                </div>

                {error && <p className="text-xs text-vermillion">{error}</p>}

                <Button variant="ritual" size="lg" className="w-full" onClick={handleLight}>
                  随喜供奉 {selectedDuration.price} · 如愿点灯
                </Button>
              </div>
            </div>
          </ScrollReveal>
        )}

        {view === "lighting" && (
          <div className="mt-12 flex flex-col items-center gap-4">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
              <LampFlame colorClass={selectedMeta.flameColor} size="lg" />
            </motion.div>
            <div className="text-5xl drop-shadow-[0_0_12px_rgba(212,168,83,0.5)]">{selectedMeta.icon}</div>
            <motion.div
              animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
              className={cn("size-20 rounded-full blur-xl", selectedMeta.glowColor)}
            />
            <p className="text-sm text-gold/70 animate-pulse">正在点亮祈福灯...</p>
            <p className="text-xs text-paper-dark/50">
              为{RELATIONS.find((r) => r.id === relation)?.label || "家人"} {name || "..."} 点亮 {selectedDuration.label} 祈福灯
            </p>
          </div>
        )}

        {view === "lit" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6 space-y-5">
            <div className="rounded-2xl border border-gold/30 bg-gradient-to-b from-gold/5 to-xuan-card p-6 text-center">
              <motion.div
                initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }}
                className="flex justify-center"
              >
                <LampFlame colorClass={selectedMeta.flameColor} size="lg" />
              </motion.div>
              <div className="text-5xl drop-shadow-[0_0_16px_rgba(212,168,83,0.6)]">{selectedMeta.icon}</div>
              <h2 className="mt-3 font-display text-2xl text-gold">如愿灯已点亮</h2>
              <p className="mt-1 text-sm text-paper-dark/70">
                愿{RELATIONS.find((r) => r.id === relation)?.label} {name} 福寿安康
              </p>
              {wish && <p className="mt-1 text-xs text-paper-dark/60 italic">「{wish}」</p>}
              <div className="mt-3 inline-flex items-center gap-2">
                <span className={cn("rounded-full border px-3 py-1 text-xs font-medium", DURATION_BADGE[selectedDuration.label])}>
                  {selectedDuration.label} · {selectedMeta.subtitle}
                </span>
                <span className="text-xs text-yellow-400 bg-yellow-500/10 border border-yellow-500/30 rounded-full px-3 py-1">
                  待审核 · 审核后点亮灯墙
                </span>
              </div>
              <p className="mt-2 text-xs text-paper-dark/40">您的祈福灯已提交，师父审核通过后将展示在供灯墙上</p>
              <div className="mt-5 flex gap-3">
                <Button variant="secondary" className="flex-1" onClick={handleReset}>再点一盏</Button>
                <ShareButton
                  title={`在如愿禅苑为${relation ? RELATIONS.find((r) => r.id === relation)?.label : "家人"}${name}点了一盏祈福灯`}
                  description={wish || "愿心愿成就，福寿安康"}
                  className="flex-1"
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* ======== 供灯墙 ======== */}
        <ScrollReveal delay={0.2}>
          <div className="mt-8 rounded-2xl border border-gold/15 bg-xuan-surface/40 p-5">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="size-4 text-gold" />
              <h3 className="font-display text-lg text-gold">供灯墙</h3>
              {!wallLoading && (
                <span className="text-xs text-paper-dark/40 ml-auto">{lampWall.length} 盏明灯</span>
              )}
            </div>
            <p className="text-xs text-paper-dark/40 mb-4">盏盏明灯，念念如愿。每一盏灯都是为亲人点亮的真实祈愿。</p>

            {wallLoading ? (
              <div className="flex justify-center py-12">
                <div className="size-8 rounded-full border-2 border-gold/30 border-t-gold animate-spin" />
              </div>
            ) : lampWall.length === 0 ? (
              <div className="text-center py-12">
                <span className="text-4xl">🪔</span>
                <p className="mt-3 text-sm text-paper-dark/50">供灯墙虚位以待</p>
                <p className="text-xs text-paper-dark/30 mt-1">成为第一个点灯的人，为家人祈福</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                <AnimatePresence mode="popLayout">
                  {lampWall.map((entry) => (
                    <LampCard key={entry.id} entry={entry} />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.3}>
          <div className="mt-4 text-center">
            <p className="text-xs text-paper-dark/30">一灯传万灯 · 分享传播功德倍增 · 善念起于心，福缘自然生</p>
          </div>
        </ScrollReveal>
      </div>

      <PaymentModal
        open={showPayment}
        onClose={() => setShowPayment(false)}
        title="点亮如愿灯"
        amount={selectedDuration.price}
        description={`为${RELATIONS.find((r) => r.id === relation)?.label || "家人"} ${name} · ${selectedDuration.label}长明`}
        onSuccess={handlePaymentSuccess}
        mode="qrcode"
      />
    </main>
  );
}
