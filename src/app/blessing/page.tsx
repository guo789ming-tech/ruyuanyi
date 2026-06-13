"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Flame, Heart, Sparkles } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";
import { ShareButton } from "@/components/ShareButton";
import { Button } from "@/components/Button";
import { PaymentModal } from "@/components/PaymentModal";
import { BLESSING_WALL } from "@/lib/data";
import { useUser } from "@/lib/UserContext";
import { useAdmin } from "@/lib/AdminContext";
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

const DURATIONS = [
  { id: "month", label: "一月", days: 30, price: "¥6.6" },
  { id: "100days", label: "百日", days: 100, price: "¥19.9" },
  { id: "year", label: "一年", days: 365, price: "¥66.6" },
  { id: "forever", label: "永久", days: -1, price: "¥199" },
];

export default function BlessingPage() {
  const [view, setView] = useState<"form" | "lighting" | "lit">("form");
  const [name, setName] = useState("");
  const [relation, setRelation] = useState("");
  const [duration, setDuration] = useState("month");
  const [wish, setWish] = useState("");
  const [yourName, setYourName] = useState("");
  const [litLamps, setLitLamps] = useState(0);
  const [todayLamps, setTodayLamps] = useState(0);
  const [error, setError] = useState("");
  const [showPayment, setShowPayment] = useState(false);
  const { isLoggedIn, setShowAuthModal, addBlessingRecord, user } = useUser();
  const { addOrder } = useAdmin();

  const selectedDuration = DURATIONS.find((d) => d.id === duration)!;

  // Simulate live wall updates
  const [wallEntries, setWallEntries] = useState(BLESSING_WALL);
  useEffect(() => {
    const interval = setInterval(() => {
      setWallEntries((prev) => {
        const names = ["善***士", "居***客", "行***心", "功***主", "清***莲"];
        const wishes = [
          "愿母亲身体健康",
          "愿事业蒸蒸日上",
          "愿孩子学业有成",
          "愿全家平安喜乐",
          "愿天下太平",
        ];
        const newEntry = {
          id: Date.now(),
          type: "health",
          name: names[Math.floor(Math.random() * names.length)],
          blessing: wishes[Math.floor(Math.random() * wishes.length)],
          lamps: Math.floor(Math.random() * 5) + 1,
          created_at: "刚刚",
        };
        return [newEntry, ...prev].slice(0, 20);
      });
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleLight = async () => {
    if (!name.trim()) { setError("请输入家人姓名"); return; }
    if (!relation) { setError("请选择与您的关系"); return; }
    if (!isLoggedIn) { setShowAuthModal(true); return; }
    setError("");
    setShowPayment(true);
  };

  const handlePaymentSuccess = (screenshot?: string) => {
    addBlessingRecord({
      id: `bless_${Date.now()}`,
      name,
      relation,
      duration: selectedDuration.label,
      price: selectedDuration.price,
      wish,
      status: "paid",
      timestamp: new Date().toISOString(),
    });
    addOrder({
      userPhone: user?.phone || "",
      userName: user?.name || "",
      service: "blessing",
      amount: selectedDuration.price,
      amountNumber: parseFloat(selectedDuration.price.replace("¥", "")) || 0,
      status: "pending",
      screenshot,
      detail: `为${RELATIONS.find((r) => r.id === relation)?.label || "家人"}${name}祈福 · ${selectedDuration.label}`,
    });
    setView("lighting");
    void (async () => {
      await delay(2500);
      setLitLamps((prev) => prev + 1);
      setTodayLamps((prev) => prev + 1);
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
      <div className="mx-auto max-w-lg px-4 pb-16 pt-6">
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

              <div className="mt-4 flex items-center justify-center gap-6 text-center">
                <div>
                  <p className="text-xs text-paper-dark/50">已点亮</p>
                  <p className="font-display text-xl text-gold">{litLamps}</p>
                  <p className="text-xs text-paper-dark/50">盏</p>
                </div>
                <div className="h-10 w-px bg-gold/15" />
                <div>
                  <p className="text-xs text-paper-dark/50">今日新增</p>
                  <p className="font-display text-xl text-vermillion">{todayLamps}</p>
                  <p className="text-xs text-paper-dark/50">盏</p>
                </div>
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
                    {DURATIONS.map((d) => (
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
              <p className="mt-2 text-xs text-gold/60">
                {selectedDuration.label}长明 · {selectedDuration.price}
              </p>

              <div className="mt-5 flex gap-3">
                <Button variant="secondary" className="flex-1" onClick={handleReset}>
                  再点一盏
                </Button>
                <ShareButton
                  title={`在如愿居为${relation ? RELATIONS.find((r) => r.id === relation)?.label : "家人"}${name}点了一盏祈福灯`}
                  description={wish || "愿心愿成就，福寿安康"}
                  className="flex-1"
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Blessing Wall */}
        <ScrollReveal delay={0.2}>
          <div className="mt-8 rounded-2xl border border-gold/15 bg-xuan-surface/40 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="size-4 text-gold" />
              <h3 className="font-display text-lg text-gold">功德灯墙</h3>
              <span className="text-xs text-paper-dark/40 ml-auto">姓名已脱敏处理 · 心诚则灵</span>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              <AnimatePresence>
                {wallEntries.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3 rounded-lg border border-gold/10 bg-xuan/40 px-3 py-2.5"
                  >
                    <span className="text-lg">🪔</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gold">{item.name}</span>
                        <span className="text-xs text-paper-dark/40">{item.created_at}</span>
                      </div>
                      <p className="text-xs text-paper-dark truncate mt-0.5">{item.blessing}</p>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: Math.min(item.lamps, 5) }).map((_, i) => (
                        <Flame key={i} className="size-3 text-orange-400" />
                      ))}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
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
