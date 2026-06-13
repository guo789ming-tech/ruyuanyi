"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const MAIN_NAV = [
  { href: "/", label: "首页", icon: "🏠" },
  { href: "/blessing", label: "祈福", icon: "🪔" },
  { href: "/almanac", label: "黄历", icon: "📅" },
  { href: "/fortune", label: "灵签", icon: "🔮" },
  { href: "/me", label: "我的", icon: "👤" },
  { href: "#more", label: "更多", icon: "⋯" },
];

const MORE_ITEMS = [
  { href: "/bazi", label: "八字精批", icon: "☯️" },
  { href: "/divination", label: "六爻占卜", icon: "☰" },
  { href: "/dream", label: "周公解梦", icon: "🌙" },
  { href: "/palm", label: "手相图解", icon: "✋" },
  { href: "/naming", label: "宝宝起名", icon: "🎋" },
  { href: "/meditation", label: "静心禅坐", icon: "🧘" },
  { href: "/temple", label: "在线上香", icon: "🪔" },
  { href: "/merit", label: "功德榜", icon: "📿" },
];

export function BottomNav() {
  const pathname = usePathname();
  const [showMore, setShowMore] = useState(false);

  const handleMoreClick = (e: React.MouseEvent) => {
    if (showMore) {
      setShowMore(false);
    } else {
      e.preventDefault();
      setShowMore(true);
    }
  };

  return (
    <>
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-gold/20 bg-xuan-card/97 backdrop-blur-md md:hidden safe-bottom">
        <div className="grid grid-cols-6 px-1 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2">
          {MAIN_NAV.map((item) => {
            const isMore = item.href === "#more";
            const isActive = isMore
              ? false
              : item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            if (isMore) {
              return (
                <button
                  key={item.href}
                  onClick={handleMoreClick}
                  className="flex flex-col items-center gap-0.5 py-0.5"
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-sm text-paper-dark/50">{item.label}</span>
                </button>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center gap-0.5 py-0.5 relative"
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute -top-2 left-1/2 -translate-x-1/2 h-0.5 w-6 rounded-full bg-gold"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                <span className="text-xl">{item.icon}</span>
                <span
                  className={cn(
                    "text-sm",
                    isActive ? "text-gold font-medium" : "text-paper-dark/50"
                  )}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* More drawer */}
      <AnimatePresence>
        {showMore && (
          <>
            <div
              className="fixed inset-0 z-50 bg-black/50 md:hidden"
              onClick={() => setShowMore(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-x-0 bottom-0 z-50 rounded-t-2xl border border-gold/20 bg-xuan-card p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] md:hidden"
            >
              <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-gold/20" />
              <p className="text-center text-xs text-paper-dark/50 mb-4">更多功能</p>
              <div className="grid grid-cols-4 gap-3">
                {MORE_ITEMS.map((item) => {
                  const isActive =
                    item.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setShowMore(false)}
                      className={cn(
                        "flex flex-col items-center gap-1 rounded-xl py-3 transition-colors",
                        isActive ? "bg-gold/10" : "hover:bg-gold/5"
                      )}
                    >
                      <span className="text-2xl">{item.icon}</span>
                      <span
                        className={cn(
                          "text-sm",
                          isActive ? "text-gold font-medium" : "text-paper-dark/70"
                        )}
                      >
                        {item.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
