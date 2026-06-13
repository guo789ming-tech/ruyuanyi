"use client";

import { motion } from "framer-motion";
import { Lock, Clock } from "lucide-react";
import { Button } from "@/components/Button";

interface LockedContentProps {
  locked: boolean;
  price: string;
  onUnlock: () => void;
  children: React.ReactNode;
  pending?: boolean;
}

export function LockedContent({ locked, price, onUnlock, children, pending }: LockedContentProps) {
  if (!locked) return <>{children}</>;

  if (pending) {
    return (
      <div className="relative rounded-2xl border border-gold/20 overflow-hidden">
        <div className="blur-sm select-none opacity-30 pointer-events-none">
          {children}
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-xuan/30 via-xuan/60 to-xuan/90 flex flex-col items-center justify-center gap-3 p-6">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="rounded-full bg-gold/10 border border-gold/30 p-3"
          >
            <Clock className="size-6 text-gold" />
          </motion.div>
          <p className="text-base text-gold font-display">审核中</p>
          <p className="text-sm text-paper-dark/70 -mt-1 text-center">
            您的支付截图已提交，管理员正在审核<br/>审核通过后即可查看完整内容
          </p>
          <p className="text-xs text-paper-dark/50">{price} · 随喜结缘</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative rounded-2xl border border-gold/20 overflow-hidden">
      <div className="blur-sm select-none opacity-30 pointer-events-none">
        {children}
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-xuan/30 via-xuan/60 to-xuan/90 flex flex-col items-center justify-center gap-3 p-6">
        <div className="rounded-full bg-gold/10 border border-gold/30 p-3">
          <Lock className="size-6 text-gold" />
        </div>
        <p className="text-base text-gold font-display">随喜结缘 · 查看完整开示</p>
        <p className="text-sm text-paper-dark/70 -mt-1">师父依古籍逐句参解，非AI泛泛生成。一念之诚，如愿以偿</p>
        <Button variant="ritual" size="lg" onClick={onUnlock} className="mt-1">
          结缘 {price} · 如愿查看
        </Button>
      </div>
    </div>
  );
}
