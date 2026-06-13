"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BodhiLeaf } from "@/components/BodhiLogo";
import { ScrollReveal } from "@/components/ScrollReveal";
import { ShareButton } from "@/components/ShareButton";
import { cn } from "@/lib/utils";

const FEATURES = [
  { href: "/blessing", icon: "🪔", title: "镇宅祈福", desc: "为家人点灯祈福，挂名长明", badge: null },
  { href: "/almanac", icon: "📅", title: "今日黄历", desc: "干支宜忌、神煞冲煞、十二时辰", badge: "新增" },
  { href: "/dream", icon: "🌙", title: "周公解梦", desc: "百梦皆有意，古今相参证", badge: null },
  { href: "/fortune", icon: "🔮", title: "关帝灵签", desc: "心诚则灵，一签一事。百支签文", badge: null },
  { href: "/bazi", icon: "☯️", title: "八字精批", desc: "真排盘，看命格根骨与一生气运", badge: null },
  { href: "/divination", icon: "☰", title: "六爻占卜", desc: "三铜起卦，观爻象定一时趋避", badge: null },
  { href: "/palm", icon: "✋", title: "手相图解", desc: "依传统手相学逐线开示", badge: null },
  { href: "/naming", icon: "🎋", title: "宝宝起名", desc: "八字喜忌、音韵典故，30个候选", badge: null },
  { href: "/meditation", icon: "🧘", title: "静心禅坐", desc: "钟磬古乐、佛号梵音、溪水声", badge: "新增" },
];

const ANCIENT_BOOKS = ["渊海子平", "三命通会", "滴天髓", "穷通宝鉴", "子平真诠", "周易", "麻衣神相", "周公解梦", "灵棋经"];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-20">
      {/* ===== Hero ===== */}
      <section className="flex min-h-[calc(100svh-3.5rem)] flex-col items-center justify-center gap-6 px-2 text-center md:min-h-[calc(100vh-3.5rem)]">
        <ScrollReveal>
          <motion.div
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="relative mx-auto flex size-20 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-gold shadow-[0_0_30px_-5px_rgba(201,160,92,0.15)]"
          >
            <BodhiLeaf className="size-11 drop-shadow-[0_0_10px_rgba(201,160,92,0.4)]" />
          </motion.div>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <div className="space-y-5">
            <h1 className="font-display text-5xl tracking-[0.25em] text-gold sm:text-6xl">如 愿 居</h1>
            <p className="text-base leading-loose text-paper-dark/80 sm:text-lg">以古籍为根，以师父为引</p>
            <p className="text-base text-paper-dark/60">为家人祈福 · 求灵签 · 看八字</p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.3}>
          <div className="flex w-full flex-col gap-3 px-4 sm:w-auto sm:flex-row sm:px-0">
            <Link href="/blessing">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-vermillion px-8 text-lg tracking-wider text-white shadow-lg shadow-vermillion/20 hover:bg-vermillion-light transition-colors"
              >
                为家人祈福
              </motion.button>
            </Link>
            <Link href="/fortune">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-lg border border-gold/40 bg-transparent px-6 text-lg text-gold hover:border-gold/60 hover:bg-gold/10 transition-colors"
              >
                求一支灵签
              </motion.button>
            </Link>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.5}>
          <p className="text-sm text-gold/40 animate-bounce mt-4">向下滚动 · 看更多功德</p>
        </ScrollReveal>
      </section>

      {/* ===== Gold Divider ===== */}
      <div className="gold-divider mb-8" />

      {/* ===== Features ===== */}
      <section className="space-y-6 pb-16">
        <ScrollReveal>
          <p className="text-center text-2xl tracking-widest text-gold">— 九大善门 —</p>
        </ScrollReveal>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <ScrollReveal key={f.href} delay={i * 0.06}>
              <Link href={f.href}>
                <div className="card-feature">
                  <div className="flex items-center justify-between">
                    <span className="text-4xl">{f.icon}</span>
                    {f.badge && (
                      <span className="rounded-full bg-vermillion/10 border border-vermillion/30 px-2 py-0.5 text-xs text-vermillion-light">
                        {f.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="font-display text-xl text-paper-dark">{f.title}</h3>
                  <p className="text-sm text-paper-dark/80 leading-relaxed">{f.desc}</p>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ===== Gold Divider ===== */}
      <div className="gold-divider mb-8" />

      {/* ===== Temple Incense ===== */}
      <section className="space-y-6 pb-16">
        <div className="card-default space-y-5 text-center">
          <ScrollReveal>
            <span className="text-4xl">🪔</span>
            <h2 className="mt-2 font-display text-2xl text-gold">在线上香</h2>
            <p className="mt-1 text-base text-paper-dark/80">每日三礼 · 每礼三炷</p>
            <p className="mt-1 text-sm text-paper-dark/70 max-w-md mx-auto leading-relaxed">
              静心三礼九炷，为自己、为家人、为众生。心念在哪里，福报就在哪里。
            </p>
          </ScrollReveal>
          <Link href="/temple">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="mt-3 inline-flex h-11 items-center gap-2 rounded-lg border border-gold/40 bg-transparent px-8 text-gold hover:border-gold/60 hover:bg-gold/10 transition-colors"
            >
              敬上一炷清香
            </motion.button>
          </Link>
        </div>
      </section>

      {/* ===== Gold Divider ===== */}
      <div className="gold-divider mb-8" />

      {/* ===== Why Us ===== */}
      <section className="space-y-6 pb-16">
        <ScrollReveal>
          <p className="text-center text-2xl tracking-widest text-gold">— 为何选如愿居 —</p>
        </ScrollReveal>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: "古籍为根",
              desc: "解读围绕《渊海子平》《滴天髓》《周易》等经典展开，引文皆有出处。",
            },
            {
              title: "师父开示",
              desc: "三位虚拟师父分别擅长稳重派、慈悲派与直爽派，选适合您的来听。",
            },
            {
              title: "心诚为本",
              desc: "网站不替代医疗、法律、投资建议。一切结果，仅作传统文化参考。",
            },
          ].map((item) => (
            <ScrollReveal key={item.title}>
              <div className="rounded-lg border border-gold/15 bg-xuan-surface/40 p-5 text-left h-full">
                <p className="font-display text-base text-gold">{item.title}</p>
                <p className="mt-1 text-sm text-paper-dark/70 leading-relaxed">{item.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ===== Gold Divider ===== */}
      <div className="gold-divider mb-8" />

      {/* ===== Ancient Books ===== */}
      <section className="space-y-6 pb-16">
        <ScrollReveal>
          <div className="grid grid-cols-3 gap-2 md:grid-cols-6">
            {ANCIENT_BOOKS.map((book) => (
              <div key={book} className="rounded-lg border border-gold/15 bg-xuan-surface/70 px-2 py-3 text-center text-base text-paper-dark md:text-lg">
                {book}
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* ===== Gold Divider ===== */}
      <div className="gold-divider mb-8" />

      {/* ===== Share ===== */}
      <section className="space-y-6 pb-16">
        <div className="rounded-2xl border border-gold/20 bg-gradient-to-b from-gold/5 to-transparent p-8 text-center space-y-5">
          <ScrollReveal>
            <p className="font-display text-3xl text-gold">一灯传万灯</p>
            <p className="mt-2 text-base text-paper-dark/80 leading-relaxed">
              发给亲朋好友，让他们也能为家人点一盏灯、求一支签。
            </p>
            <p className="text-sm text-paper-dark/60">微信、朋友圈、抖音私信都可以分享。</p>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <div className="flex flex-col items-center gap-3">
              <ShareButton />
              <p className="text-sm text-paper-dark/50">分享传播 · 功德倍增</p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== Gold Divider ===== */}
      <div className="gold-divider mb-8" />

      {/* ===== Footer ===== */}
      <footer className="space-y-5 border-t border-gold/10 pt-10 text-center text-sm">
        <ScrollReveal>
          <div className="space-y-3">
            <p className="text-base text-paper-dark/70 leading-loose">
              善念起于心，福缘自然生。一念清净，万物皆宁。
            </p>
            <p className="font-display text-base text-gold/60">
              菩提本无树，明镜亦非台。本来无一物，何处惹尘埃。
            </p>
            <p className="text-sm text-paper-dark/50">
              命自我立，福自我求。诸恶莫作，众善奉行。
            </p>
          </div>
        </ScrollReveal>

        <div className="mx-auto w-12 border-t border-gold/15" />

        <ScrollReveal>
          <p className="text-sm text-paper-dark/50">
            灵棋经 · 渊海子平 · 增删卜易 · 麻衣神相 · 周公解梦
          </p>
          <p className="mt-1 text-sm text-paper-dark/40">如愿居 · 一念慈悲，一灯长明</p>
        </ScrollReveal>
      </footer>
    </div>
  );
}
