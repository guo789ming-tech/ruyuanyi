"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, Sun, Moon } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";
import { ShareButton } from "@/components/ShareButton";
import { getTodayAlmanac, type AlmanacData } from "@/lib/almanac";
import { cn } from "@/lib/utils";

export default function AlmanacPage() {
  const [data, setData] = useState<AlmanacData | null>(null);

  useEffect(() => {
    setData(getTodayAlmanac());
  }, []);

  return (
    <main className="flex-1">
      <div className="mx-auto max-w-2xl px-4 pb-16 pt-6">
        <ScrollReveal>
          <div className="flex items-center gap-3">
            <Link href="/" className="flex size-9 items-center justify-center rounded-full bg-gold/10 text-gold hover:bg-gold/20">
              <ArrowLeft className="size-4" />
            </Link>
            <h1 className="font-display text-2xl text-gold">今日黄历</h1>
          </div>
        </ScrollReveal>

        {data && (
          <div className="mt-6 space-y-5">
            {/* Date header */}
            <ScrollReveal delay={0.1}>
              <div className="rounded-2xl border border-gold/20 bg-gradient-to-b from-xuan-card to-xuan-surface p-6 text-center">
                <Calendar className="mx-auto size-8 text-gold" />
                <h2 className="mt-2 font-display text-xl text-gold">{data.solar_date}</h2>
                <p className="mt-1 text-sm text-paper-dark/70">
                  农历 {data.lunar_date}
                </p>
                <div className="mt-3 flex items-center justify-center gap-3 text-sm">
                  <span className="text-gold">{data.gan_zhi.year}年</span>
                  <span className="text-paper-dark/40">·</span>
                  <span className="text-gold">{data.gan_zhi.month}月</span>
                  <span className="text-paper-dark/40">·</span>
                  <span className="text-gold">{data.gan_zhi.day}日</span>
                </div>
                <p className="mt-1 text-xs text-paper-dark/50">
                  生肖：{data.zodiac_day} · 冲{data.zodiac_clash}（{data.clash_direction}）
                </p>
              </div>
            </ScrollReveal>

            {/* Gods / directions */}
            <ScrollReveal delay={0.15}>
              <div className="rounded-2xl border border-gold/15 bg-xuan-surface/40 p-5">
                <p className="text-xs text-gold/60 mb-3">吉神方位</p>
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center">
                    <p className="text-xs text-paper-dark/50">喜神</p>
                    <p className="text-sm font-medium text-vermillion">{data.gods.xi_shen}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-paper-dark/50">福神</p>
                    <p className="text-sm font-medium text-emerald">{data.gods.fu_shen}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-paper-dark/50">财神</p>
                    <p className="text-sm font-medium text-gold">{data.gods.cai_shen}</p>
                  </div>
                </div>
                <p className="mt-2 text-xs text-paper-dark/40 text-center">
                  胎神：{data.tai_shen}
                </p>
              </div>
            </ScrollReveal>

            {/* Yi / Ji */}
            <ScrollReveal delay={0.2}>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-emerald/20 bg-gradient-to-b from-emerald/5 to-xuan-surface/40 p-4">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Sun className="size-4 text-emerald" />
                    <span className="text-sm font-medium text-emerald">宜</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {data.yi.map((item) => (
                      <span key={item} className="rounded-lg border border-emerald/20 bg-emerald/5 px-2 py-1 text-sm text-emerald">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="rounded-2xl border border-vermillion/20 bg-gradient-to-b from-vermillion/5 to-xuan-surface/40 p-4">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Moon className="size-4 text-vermillion" />
                    <span className="text-sm font-medium text-vermillion">忌</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {data.ji.map((item) => (
                      <span key={item} className="rounded-lg border border-vermillion/15 bg-vermillion/5 px-2 py-1 text-sm text-vermillion">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Peng Zu advice */}
            <ScrollReveal delay={0.25}>
              <div className="rounded-xl border border-gold/10 bg-xuan/40 p-4">
                <p className="text-xs text-paper-dark/60">
                  <span className="text-gold/60">彭祖百忌：</span>{data.peng_zu}
                </p>
              </div>
            </ScrollReveal>

            {/* 12 Shichen */}
            <ScrollReveal delay={0.3}>
              <div className="rounded-2xl border border-gold/15 bg-xuan-surface/40 p-5">
                <p className="text-xs text-gold/60 mb-3">十二时辰吉凶</p>
                <div className="space-y-1.5">
                  {data.shi_chen.map((sc) => (
                    <div
                      key={sc.time}
                      className={cn(
                        "flex items-center justify-between rounded-lg px-3 py-2 text-xs",
                        sc.ji_xiong === "吉" ? "bg-emerald/5" : sc.ji_xiong === "凶" ? "bg-vermillion/5" : "bg-xuan/40"
                      )}
                    >
                      <span className="text-paper-dark w-16 shrink-0">{sc.time.split(" ")[0]}</span>
                      <span className="text-paper-dark/50 w-24 shrink-0">{sc.time.split(" ")[1] || ""}</span>
                      <span className="text-paper-dark/50 w-16 text-center">{sc.gan_zhi}</span>
                      <span className={cn(
                        "w-8 text-center font-medium",
                        sc.ji_xiong === "吉" ? "text-emerald" : sc.ji_xiong === "凶" ? "text-vermillion" : "text-gold/60"
                      )}>
                        {sc.ji_xiong}
                      </span>
                      <span className="text-paper-dark/40 ml-2 text-right flex-1">{sc.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            {/* Source */}
            <ScrollReveal delay={0.35}>
              <div className="rounded-xl border border-gold/10 bg-xuan/40 p-4">
                <p className="text-xs text-paper-dark/40 text-center">
                  参考{data.source}等传统择吉典籍。黄历内容仅作传统文化参考。
                </p>
              </div>
            </ScrollReveal>

            <div className="text-center">
              <ShareButton
                title="今日黄历"
                description={`${data.solar_date} · ${data.lunar_date} · ${data.gan_zhi.year}年${data.gan_zhi.month}月${data.gan_zhi.day}日`}
              />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
