"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, BookOpen, Search } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";
import { ShareButton } from "@/components/ShareButton";
import { Button } from "@/components/Button";
import { DREAM_CATEGORIES, interpretDream } from "@/lib/data";
import { useUser } from "@/lib/UserContext";
import { delay } from "@/lib/utils";

export default function DreamPage() {
  const [view, setView] = useState<"categories" | "search" | "result">("categories");
  const [keyword, setKeyword] = useState("");
  const [searching, setSearching] = useState(false);
  const [result, setResult] = useState<ReturnType<typeof interpretDream> | null>(null);
  const [error, setError] = useState("");
  const { addDreamRecord } = useUser();

  const handleSearch = async (term?: string) => {
    const q = (term ?? keyword).trim();
    if (!q) { setError("请输入梦境关键词"); return; }
    if (term) setKeyword(term);
    setError("");
    setSearching(true);
    setView("search");
    await delay(1500);
    const dreamResult = interpretDream(q);
    setResult(dreamResult);
    addDreamRecord({
      id: `dream_${Date.now()}`,
      keyword: q,
      result: dreamResult.data.interpretation[0]?.text || "",
      ji: dreamResult.data.interpretation[0]?.ji || "平",
      timestamp: new Date().toISOString(),
    });
    setView("result");
    setSearching(false);
  };

  return (
    <main className="flex-1">
      <div className="mx-auto max-w-2xl px-4 pb-16 pt-6">
        <ScrollReveal>
          <div className="flex items-center gap-3">
            <Link href="/" className="flex size-9 items-center justify-center rounded-full bg-gold/10 text-gold hover:bg-gold/20">
              <ArrowLeft className="size-4" />
            </Link>
            <h1 className="font-display text-2xl text-gold">周公解梦</h1>
          </div>
        </ScrollReveal>

        {view === "categories" && (
          <>
            <ScrollReveal delay={0.1}>
              <div className="mt-6 rounded-2xl border border-gold/20 bg-gradient-to-b from-xuan-card to-xuan-surface p-6">
                <div className="text-center">
                  <span className="text-4xl">🌙</span>
                  <h2 className="mt-2 font-display text-xl text-gold">周公解梦</h2>
                  <p className="mt-1 text-xs text-paper-dark/70">
                    以《周公解梦》为宗，参考敦煌本《梦书》、明代《梦林玄解》
                  </p>
                </div>

                <div className="mt-5">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={keyword}
                      onChange={(e) => { setKeyword(e.target.value); setError(""); }}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                      placeholder="输入梦境关键词，如：水、蛇、飞、鱼、牙齿..."
                      className="flex-1 rounded-xl border border-gold/20 bg-xuan/80 px-4 py-3 text-sm text-paper placeholder:text-paper-dark/30 focus:border-gold/50 focus:outline-none"
                    />
                    <Button variant="primary" onClick={() => handleSearch()}>
                      <Search className="size-4" /> 解梦
                    </Button>
                  </div>
                  {error && <p className="mt-1 text-xs text-vermillion">{error}</p>}
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.15}>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {DREAM_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleSearch(cat.name.slice(2))}
                    className="rounded-xl border border-gold/15 bg-xuan-surface/40 p-4 text-left hover:border-gold/30 transition-colors"
                  >
                    <span className="text-2xl">{cat.icon}</span>
                    <p className="mt-1 text-sm font-medium text-gold">{cat.name}</p>
                    <p className="text-sm text-paper-dark/60 mt-0.5">{cat.description}</p>
                  </button>
                ))}
              </div>
            </ScrollReveal>
          </>
        )}

        {view === "search" && (
          <div className="mt-12 flex flex-col items-center gap-4">
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }} className="text-5xl">🌙</motion.div>
            <p className="text-sm text-gold/70 animate-pulse">翻阅古籍，寻觅梦兆...</p>
          </div>
        )}

        {view === "result" && result && (
          <DreamResult result={result} keyword={keyword} onBack={() => { setView("categories"); setKeyword(""); }} />
        )}
      </div>
    </main>
  );
}

function DreamResult({ result, keyword, onBack }: { result: ReturnType<typeof interpretDream>; keyword: string; onBack: () => void }) {
  const data = result.data;
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6 space-y-5">
      <div className="rounded-2xl border border-gold/30 bg-gradient-to-b from-xuan-card to-xuan-surface p-5 text-center">
        <p className="text-xs text-gold/50">梦境关键词</p>
        <h2 className="mt-1 font-display text-3xl text-gold">「{data.keyword}」</h2>
        <p className="mt-1 text-xs text-paper-dark/50">据《周公解梦》诸本 · 敦煌遗书 ·《梦林玄解》综合参解</p>
      </div>

      <div className="space-y-3">
        {data.interpretation.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: item.ji === "吉" ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.15 }}
            className={`rounded-2xl border p-4 ${item.ji === "吉" ? "border-emerald/30 bg-emerald/5" : item.ji === "凶" ? "border-vermillion/30 bg-vermillion/5" : "border-gold/15 bg-xuan-surface/40"}`}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-xs font-medium rounded-full px-2 py-0.5 ${item.ji === "吉" ? "bg-emerald/20 text-emerald" : item.ji === "凶" ? "bg-vermillion/20 text-vermillion-light" : "bg-gold/10 text-gold"}`}>
                {item.ji}
              </span>
              <span className="text-xs text-paper-dark/40">{item.source}</span>
            </div>
            <p className="text-sm text-paper-dark leading-relaxed">{item.text}</p>
          </motion.div>
        ))}
      </div>

      <div className="rounded-xl border border-gold/15 bg-xuan-surface/40 p-4">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="size-4 text-gold/60" />
          <p className="text-xs text-gold/60">考据来源</p>
        </div>
        <p className="text-xs text-paper-dark/50">
          本解梦以{data.source.primary}为宗，参校{data.source.secondary.join("、")}等历代梦书典籍。
          敦煌遗书伯希和编号P.3908与斯坦因编号S.620均有《新集周公解梦书》残卷，为现存最早系统解梦文献之一。
        </p>
        <p className="text-xs text-paper-dark/30 mt-2">
          《周礼·春官》云：「占梦掌其岁时，观天地之会，辨阴阳之气，以日月星辰占六梦之吉凶。」
          周代已设「占梦」之官，梦占之学，源远流长。
        </p>
      </div>

      <div className="flex gap-3">
        <Button variant="secondary" className="flex-1" onClick={onBack}>再解一梦</Button>
        <ShareButton title={`周公解梦 - ${data.keyword}`} description={data.interpretation[0]?.text || "夜有所梦，日有所解"} className="flex-1" />
      </div>
    </motion.div>
  );
}
