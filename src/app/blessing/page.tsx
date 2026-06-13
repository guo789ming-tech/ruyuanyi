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
  { id: "grandchild", label: "孙辈" },
  { id: "friend", label: "朋友" },
  { id: "self", label: "自己" },
];

// ---- Duration badge style map ----
const DURATION_STYLE: Record<string, string> = {
  "一月": "border-amber-500/30 bg-amber-500/10 text-amber-400",
  "百日": "border-slate-400/30 bg-slate-400/10 text-slate-300",
  "一年": "border-gold/40 bg-gold/10 text-gold",
  "永久": "border-rose-400/30 bg-rose-400/10 text-rose-300",
};

interface LampEntry {
  id: string;
  subject: string;    // "为母亲张三祈福"
  duration: string;   // "一月" | "百日" | "一年" | "永久"
  wish: string;
  userName: string;
  timestamp: string;
  status: "pending" | "paid";
  isMine: boolean;
}

function parseDetail(detail: string): { subject: string; duration: string; wish: string } {
  // Format: "为母亲张三祈福 · 一月" or "为母亲张三祈福 · 一月 · 心愿文字"
  const parts = detail.split(" · ");
  return {
    subject: parts[0] || "",
    duration: parts[1] || "",
    wish: parts[2] || "",
  };
}

function desensitizeName(name: string): string {
  if (!name) return "***";
  if (name.length <= 1) return "*";
  if (name.length === 2) return name[0] + "*";
  if (name.length === 3) return name[0] + "*" + name[2];
  return name[0] + "**" + name[name.length - 1];
}

function maskSubject(subject: string): string {
  // "为母亲张三祈福" → "为母亲张*祈福"
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

// ---- Lamp card with flame animation ----
function LampCard({ entry }: { entry: LampEntry }) {
  const durStyle = DURATION_STYLE[entry.duration] || DURATION_STYLE["一月"];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      layout
      className={cn(
        "relative rounded-2xl border p-4",
        entry.isMine
          ? "border-gold/40 bg-gradient-to-b from-gold/15 to-xuan-card/90 ring-1 ring-gold/20"
          : entry.status === "pending"
          ? "border-gold/10 bg-xuan-surface/50"
          : "border-gold/15 bg-xuan-surface/60"
      )}
    >
      {/* Glow behind lamp */}
      <div className="absolute inset-x-0 top-2 flex justify-center pointer-events-none">
        <div
          className={cn(
            "size-12 rounded-full blur-xl",
            entry.status === "paid" ? "bg-orange-500/20" : "bg-orange-500/8"
          )}
        />
      </div>

      {/* Lamp icon with flame animation */}
      <div className="relative flex justify-center mb-2">
        <span className="text-4xl relative">
          🪔
          {/* Flame flicker overlay */}
          <span
            className="absolute inset-0 text-4xl animate-pulse"
            style={{ animationDuration: "1.5s", mixBlendMode: "screen" }}
          >
            ✨
          </span>
        </span>
      </div>

      {/* Subject */}
      <p className="text-center text-sm text-gold font-medium leading-tight mt-1">
        {entry.isMine ? entry.subject : maskSubject(entry.subject)}
      </p>

      {/* Wish */}
      {entry.wish && (
        <p className="text-center text-xs text-paper-dark/50 italic mt-1 line-clamp-2">
          「{entry.wish}」
        </p>
      )}

      {/* Duration badge + time */}
      <div className="flex items-center justify-center gap-2 mt-3">
        <span className={cn("rounded-full border px-2.5 py-0.5 text-xs font-medium", durStyle)}>
          {entry.duration}
        </span>
        {entry.status === "pending" && (
          <span className="rounded-full border border-yellow-500/30 bg-yellow-500/10 px-2 py-0.5 text-xs text-yellow-400">
            审核中
          </span>
        )}
      </div>

      {/* Time + user */}
      <div className="flex items-center justify-center gap-2 mt-2 text-xs text-paper-dark/40">
        <Clock className="size-3" />
        <span>{timeAgo(entry.timestamp)}</span>
        <span>·</span>
        <span>{entry.isMine ? entry.userName : desensitizeName(entry.userName)}</span>
      </div>
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

  // Real lamp wall data from Supabase
  const [lampWall, setLampWall] = useState<LampEntry[]>([]);
  const [wallLoading, setWallLoading] = useState(true);

  const durations = [
    { id: "month", label: "一月", days: 30, price: pricing.blessing_month },
    { id: "100days", label: "百日", days: 100, price: pricing.blessing_100days },
    { id: "year", label: "一年", days: 365, price: pricing.blessing_year },
    { id: "forever", label: "永久", days: -1, price: pricing.blessing_forever },
  ];

  const selectedDuration = durations.find((d) => d.id === duration)!;

  // Fetch lamp wall from Supabase
  const fetchLampWall = useCallback(async () => {
    const phone = user?.phone || "";
    const { data, error: supabaseError } = await supabase
      .from("orders")
      .select("*")
      .eq("service", "blessing")
      .in("status", ["paid", "pending"])
      .order("timestamp", { ascending: false })
      .limit(50);

    if (supabaseError || !data) {
      setWallLoading(false);
      return;
    }

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

    // Preserve user's own local entries not yet in Supabase
    setLampWall((prev) => {
      const supabaseIds = new Set(entries.map((e) => e.id));
      const localMine = prev.filter((e) => e.isMine && !supabaseIds.has(e.id));
      return [...localMine, ...entries];
    });
    setWallLoading(false);
  }, [user?.phone]);

  useEffect(() => {
    fetchLampWall();
  }, [fetchLampWall]);

  // Poll for status changes
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

    // Add user's lamp to wall immediately
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
    setName("");
    setRelation("");
    setWish("");
    setYourName("");
    setDuration("month");
    setView("form");
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
                    type="text"
                    value={name}
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
                        key={r.id}
                        onClick={() => setRelation(r.id)}
                        className={cn(
                          "rounded-lg border px-4 py-2 text-sm transition-colors",
                          relation === r.id
                            ? "border-gold bg-gold/10 text-gold"
                            : "border-gold/20 text-paper-dark hover:border-gold/40"
                        )}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-xs text-paper-dark/60 mb-1">供奉时长</label>
                  <div className="grid grid-cols-4 gap-2">
                    {durations.map((d) => (
                      <button
                        key={d.id}
                        onClick={() => setDuration(d.id)}
                        className={cn(
                          "rounded-xl border py-3 text-center transition-colors",
                          duration === d.id
                            ? "border-gold bg-gold/10"
                            : "border-gold/20 hover:border-gold/40"
                        )}
                      >
                        <p className="text-sm font-medium text-gold">{d.label}</p>
                        <p className="text-xs text-paper-dark/60 mt-0.5">{d.price}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Wish */}
                <div>
                  <label className="block text-xs text-paper-dark/60 mb-1">
                    心愿（可选，最多 80 字）
                  </label>
                  <textarea
                    value={wish}
                    onChange={(e) => setWish(e.target.value)}
                    placeholder="写下你的祈福心愿..."
                    maxLength={80}
                    className="w-full rounded-xl border border-gold/20 bg-xuan/80 px-4 py-3 text-sm text-paper placeholder:text-paper-dark/30 focus:border-gold/50 focus:outline-none resize-none"
                    rows={2}
                  />
                </div>

                {/* Your name */}
                <div>
                  <label className="block text-xs text-paper-dark/60 mb-1">
                    您的称呼（可选，会显示在灯墙）
                  </label>
                  <input
                    type="text"
                    value={yourName}
                    onChange={(e) => setYourName(e.target.value)}
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
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring" }}
              className="text-6xl"
            >
              🪔
            </motion.div>
            <motion.div
              animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="size-20 rounded-full bg-orange-500/20 blur-xl"
            />
            <p className="text-sm text-gold/70 animate-pulse">正在点亮祈福灯...</p>
            <p className="text-xs text-paper-dark/50">
              为{RELATIONS.find((r) => r.id === relation)?.label || "家人"} {name || "..."} 点亮 {selectedDuration.label} 祈福灯
            </p>
          </div>
        )}

        {view === "lit" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 space-y-5"
          >
            {/* Lit confirmation */}
            <div className="rounded-2xl border border-gold/30 bg-gradient-to-b from-gold/5 to-xuan-card p-6 text-center">
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="text-6xl"
              >
                🪔
              </motion.span>
              <h2 className="mt-3 font-display text-2xl text-gold">如愿灯已点亮</h2>
              <p className="mt-1 text-sm text-paper-dark/70">
                愿{RELATIONS.find((r) => r.id === relation)?.label} {name} 福寿安康
              </p>
              {wish && (
                <p className="mt-1 text-xs text-paper-dark/60 italic">「{wish}」</p>
              )}
              <div className="mt-3 inline-flex items-center gap-2">
                <span className={cn("rounded-full border px-3 py-1 text-xs font-medium", DURATION_STYLE[selectedDuration.label])}>
                  {selectedDuration.label}
                </span>
                <span className="text-xs text-yellow-400 bg-yellow-500/10 border border-yellow-500/30 rounded-full px-3 py-1">
                  待审核 · 审核后点亮灯墙
                </span>
              </div>
              <p className="mt-2 text-xs text-paper-dark/40">
                您的祈福灯已提交，师父审核通过后将展示在供灯墙上
              </p>

              <div className="mt-5 flex gap-3">
                <Button variant="secondary" className="flex-1" onClick={handleReset}>
                  再点一盏
                </Button>
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
                <span className="text-xs text-paper-dark/40 ml-auto">
                  {lampWall.length} 盏明灯
                </span>
              )}
            </div>
            <p className="text-xs text-paper-dark/40 mb-4">
              盏盏明灯，念念如愿。每一盏灯都是为亲人点亮的真实祈愿。
            </p>

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
            <p className="text-xs text-paper-dark/30">
              一灯传万灯 · 分享传播功德倍增 · 善念起于心，福缘自然生
            </p>
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
