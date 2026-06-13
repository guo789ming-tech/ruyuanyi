"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/Button";
import { useAdmin } from "@/lib/AdminContext";
import { delay, cn } from "@/lib/utils";

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  amount: string;
  description?: string;
  onSuccess: () => void;
  mode?: "mock" | "qrcode";
}

const PAYMENT_METHODS = [
  { id: "wechat", name: "微信支付", icon: "💬", color: "border-emerald/30 bg-emerald/5", defaultQr: "/微信收款码.png" },
  { id: "alipay", name: "支付宝", icon: "🔵", color: "border-sky-400/30 bg-sky-500/5", defaultQr: "/支付宝收款码.png" },
];

export function PaymentModal({ open, onClose, title, amount, description, onSuccess, mode = "mock" }: PaymentModalProps) {
  const [method, setMethod] = useState("wechat");
  const [step, setStep] = useState<"confirm" | "paying" | "success">("confirm");
  const { qrCodes } = useAdmin();

  const selectedMethod = PAYMENT_METHODS.find((m) => m.id === method)!;

  const getQrSrc = (m: typeof PAYMENT_METHODS[number]) => {
    return qrCodes[m.id as "wechat" | "alipay"] || m.defaultQr;
  };

  const handlePay = async () => {
    if (mode === "qrcode") {
      setStep("paying");
    } else {
      setStep("paying");
      await delay(2500);
      setStep("success");
      await delay(1500);
      onSuccess();
      setStep("confirm");
      onClose();
    }
  };

  const handlePaid = async () => {
    setStep("success");
    await delay(2000);
    onSuccess();
    setStep("confirm");
    onClose();
  };

  const handleClose = () => {
    if (step === "paying" && mode === "mock") return;
    setStep("confirm");
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center"
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
              disabled={step === "paying" && mode === "mock"}
              className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-full bg-gold/10 text-gold/60 hover:text-gold disabled:opacity-30"
            >
              <X className="size-4" />
            </button>

            {step === "confirm" && (
              <>
                <div className="text-center mb-6">
                  <span className="text-4xl">🪔</span>
                  <h2 className="mt-2 font-display text-xl text-gold">{title}</h2>
                  <p className="mt-1 text-2xl font-display text-vermillion">{amount}</p>
                  {description && <p className="mt-1 text-xs text-paper-dark/60">{description}</p>}
                </div>

                <div className="space-y-2 mb-4">
                  <p className="text-xs text-paper-dark/60">选择供奉方式</p>
                  {PAYMENT_METHODS.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setMethod(m.id)}
                      className={cn(
                        "w-full rounded-xl border p-4 flex items-center gap-3 transition-colors",
                        method === m.id ? m.color + " border-2" : "border-gold/15 hover:border-gold/30"
                      )}
                    >
                      <span className="text-2xl">{m.icon}</span>
                      <span className="text-sm text-paper">{m.name}</span>
                      {method === m.id && (
                        <CheckCircle2 className="size-4 text-emerald ml-auto" />
                      )}
                    </button>
                  ))}
                </div>

                <Button variant="ritual" size="lg" className="w-full" onClick={handlePay}>
                  随喜供奉 {amount}
                </Button>
                <p className="mt-3 text-center text-xs text-paper-dark/40">
                  {mode === "mock" ? "此为模拟支付 · 不会产生实际费用" : "扫码随喜供奉 · 支付后通知管理员审核"}
                </p>
              </>
            )}

            {step === "paying" && mode === "mock" && (
              <div className="py-8 flex flex-col items-center gap-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  className="size-16 rounded-full border-2 border-gold/30 border-t-gold"
                />
                <p className="text-sm text-gold/70 animate-pulse">正在支付...</p>
                <p className="text-xs text-paper-dark/50">{amount}</p>
              </div>
            )}

            {step === "paying" && mode === "qrcode" && (
              <div className="py-4 flex flex-col items-center gap-4">
                <p className="text-sm text-gold">
                  以<span className="text-gold-light">{selectedMethod.name}</span>随喜供奉
                </p>

                <div className="relative rounded-2xl border-2 border-gold/30 bg-white p-3 w-full">
                  <img
                    src={getQrSrc(selectedMethod)}
                    alt={`${selectedMethod.name}收款码`}
                    className="w-full max-w-[280px] h-auto mx-auto block"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>

                <p className="text-xs text-paper-dark/60 text-center leading-relaxed">
                  请截图或使用另一台手机<br/>扫描上方二维码完成供奉
                </p>
                <p className="text-xs text-gold/60 font-medium">随喜 {amount}</p>

                <Button variant="ritual" size="lg" className="w-full" onClick={handlePaid}>
                  我已完成供奉
                </Button>

                <button
                  onClick={handleClose}
                  className="text-xs text-paper-dark/40 hover:text-paper-dark/60"
                >
                  暂不供奉
                </button>
              </div>
            )}

            {step === "success" && (
              <div className="py-8 flex flex-col items-center gap-3">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring" }}
                >
                  <CheckCircle2 className="size-16 text-emerald" />
                </motion.div>
                {mode === "mock" ? (
                  <>
                    <p className="font-display text-lg text-emerald">供奉圆满</p>
                    <p className="text-xs text-paper-dark/60">如愿以偿 · {amount}</p>
                  </>
                ) : (
                  <>
                    <p className="font-display text-lg text-gold">已提交审核</p>
                    <p className="text-sm text-paper-dark/70 text-center">
                      管理员审核通过后<br/>即可查看内容
                    </p>
                    <p className="text-xs text-paper-dark/50">{amount}</p>
                  </>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
