"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/Button";
import { useUser, checkExistingUser } from "@/lib/UserContext";
import { delay } from "@/lib/utils";

export function AuthModal() {
  const { showAuthModal, setShowAuthModal, login, pendingAction } = useUser();
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [step, setStep] = useState<"phone" | "name">("phone");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePhoneNext = () => {
    if (!/^1\d{10}$/.test(phone)) {
      setError("请输入正确的11位手机号码");
      return;
    }
    setError("");

    // Check if returning user - skip name step if already registered
    const existing = checkExistingUser(phone);
    if (existing) {
      setLoading(true);
      delay(300).then(() => {
        login(phone, existing.name);
        setPhone("");
        setName("");
        setStep("phone");
        setLoading(false);
        if (pendingAction) {
          pendingAction();
        }
      });
      return;
    }

    setStep("name");
  };

  const handleLogin = async () => {
    if (!name.trim()) {
      setError("请输入您的称呼");
      return;
    }
    setError("");
    setLoading(true);
    await delay(500);
    login(phone, name.trim());
    setPhone("");
    setName("");
    setStep("phone");
    setLoading(false);
    if (pendingAction) {
      pendingAction();
    }
  };

  const handleClose = () => {
    setShowAuthModal(false);
    setPhone("");
    setName("");
    setStep("phone");
    setError("");
  };

  return (
    <AnimatePresence>
      {showAuthModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center"
        >
          <div className="absolute inset-0 bg-black/60" onClick={handleClose} />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl border border-gold/20 bg-xuan-card p-6 sm:m-4"
          >
            <button
              onClick={handleClose}
              className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-full bg-gold/10 text-gold/60 hover:text-gold"
            >
              <X className="size-4" />
            </button>

            <div className="text-center mb-6">
              <span className="text-4xl">👤</span>
              <h2 className="mt-2 font-display text-xl text-gold">
                {step === "name" ? "完善信息" : "登录 / 注册"}
              </h2>
              <p className="mt-1 text-xs text-paper-dark/60">
                {step === "phone"
                  ? "输入手机号即可绑定，无需短信验证"
                  : `手机号 ${phone} · 请输入您的称呼`}
              </p>
            </div>

            {step === "phone" && (
              <div className="space-y-3">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => { setPhone(e.target.value); setError(""); }}
                  placeholder="请输入11位手机号码"
                  maxLength={11}
                  className="w-full rounded-xl border border-gold/20 bg-xuan/80 px-4 py-3 text-sm text-paper placeholder:text-paper-dark/30 focus:border-gold/50 focus:outline-none"
                />
                {error && <p className="text-xs text-vermillion">{error}</p>}

                <div className="rounded-lg border border-gold/10 bg-xuan/40 p-3">
                  <p className="text-sm text-paper-dark/50 leading-relaxed">
                    输入11位手机号码即可绑定成功，无需发送短信验证码。绑定后可用于同步功德值、祈福订单与求签记录，更换设备时通过手机号找回数据。
                  </p>
                </div>

                <Button variant="ritual" className="w-full" onClick={handlePhoneNext}>
                  下一步
                </Button>
              </div>
            )}

            {step === "name" && (
              <div className="space-y-3">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setError(""); }}
                  placeholder="请输入您的称呼（如：善信张三）"
                  className="w-full rounded-xl border border-gold/20 bg-xuan/80 px-4 py-3 text-sm text-paper placeholder:text-paper-dark/30 focus:border-gold/50 focus:outline-none"
                />
                {error && <p className="text-xs text-vermillion">{error}</p>}
                <div className="flex gap-2">
                  <Button variant="secondary" className="flex-1" onClick={() => setStep("phone")}>
                    返回
                  </Button>
                  <Button variant="ritual" className="flex-1" loading={loading} onClick={handleLogin}>
                    完成绑定
                  </Button>
                </div>
              </div>
            )}

            <p className="mt-4 text-center text-xs text-paper-dark/40">
              绑定即表示同意如愿居用户协议 · 您的信息仅用于功德记录与找回
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
