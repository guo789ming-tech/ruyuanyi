"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { X, Share2, Check, Copy, MessageCircle } from "lucide-react";
import { Button } from "./Button";
import { cn } from "@/lib/utils";

function toDataURL(url: string): Promise<string> {
  return new Promise((resolve) => {
    // Generate a simple QR-like data URL as placeholder
    const canvas = document.createElement("canvas");
    canvas.width = 280;
    canvas.height = 280;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#1A1410";
    ctx.fillRect(0, 0, 280, 280);
    ctx.fillStyle = "#C9A05C";
    ctx.font = "bold 20px serif";
    ctx.textAlign = "center";
    ctx.fillText("如愿禅苑", 140, 120);
    ctx.font = "14px sans-serif";
    ctx.fillText("扫一扫访问", 140, 160);
    ctx.fillStyle = "#F5F0E8";
    ctx.font = "12px monospace";
    ctx.fillText(url.replace(/^https?:\/\//, ""), 140, 200);

    // Simple QR-like border
    ctx.strokeStyle = "#C9A05C";
    ctx.lineWidth = 4;
    ctx.strokeRect(40, 40, 200, 200);

    resolve(canvas.toDataURL("image/png"));
  });
}

interface ShareModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  url?: string;
}

export function ShareModal({ open, onClose, title, description, url }: ShareModalProps) {
  const [shareUrl, setShareUrl] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [urlCopied, setUrlCopied] = useState(false);
  const [textCopied, setTextCopied] = useState(false);

  useEffect(() => {
    setShareUrl(url ?? `${window.location.origin}${window.location.pathname}`);
  }, [url, open]);

  useEffect(() => {
    if (!shareUrl) { setQrDataUrl(""); return; }
    let cancelled = false;
    toDataURL(shareUrl).then((d) => { if (!cancelled) setQrDataUrl(d); });
    return () => { cancelled = true; };
  }, [shareUrl]);

  const shareTitle = title || "如愿禅苑 · 为家人祈福求灵签";
  const shareDesc = description || "心诚则灵。为家人点一盏祈福灯，求一支灵签，看一卦命理八字。一念慈悲，如愿以偿。";
  const shareText = `${shareTitle}\n${shareDesc}\n${shareUrl}`;

  const copyUrl = async () => {
    try { await navigator.clipboard.writeText(shareUrl); setUrlCopied(true); setTimeout(() => setUrlCopied(false), 1500); } catch {}
  };

  const copyText = async () => {
    try { await navigator.clipboard.writeText(shareText); setTextCopied(true); setTimeout(() => setTextCopied(false), 1500); } catch {}
  };

  const nativeShare = async () => {
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try { await navigator.share({ title: shareTitle, text: shareDesc, url: shareUrl }); } catch {}
    } else {
      copyText();
    }
  };

  useEffect(() => {
    if (open) {
      window.dispatchEvent(new CustomEvent("lingji:modal-open"));
      return () => { window.dispatchEvent(new CustomEvent("lingji:modal-close")); };
    }
  }, [open]);

  if (!open) return null;

  return (
    <div
      data-modal="true"
      className="fixed inset-0 z-[120] flex items-end justify-center bg-xuan/95 backdrop-blur-sm px-3 py-3 sm:items-center sm:px-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md max-h-full overflow-y-auto rounded-2xl border border-gold/40 bg-xuan-card shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-10 flex size-9 items-center justify-center rounded-full bg-black/40 text-paper-dark hover:bg-black/60 hover:text-paper"
          aria-label="关闭"
        >
          <X className="size-5" />
        </button>

        <div className="border-b border-gold/15 bg-gradient-to-r from-gold/10 via-vermillion/5 to-gold/10 px-5 py-4 text-center">
          <p className="flex items-center justify-center gap-1.5 text-xs tracking-widest text-gold/85">
            <Share2 className="size-4" />分享如愿禅苑
          </p>
          <h3 className="mt-1.5 font-display text-2xl text-gold">分享一念，福报倍增</h3>
          <p className="mt-1 text-xs text-paper-dark/70">一灯传万灯 · 让家人朋友也求一支签、点一盏灯</p>
        </div>

        <div className="space-y-4 px-5 py-4">
          {qrDataUrl && (
            <div className="flex flex-col items-center gap-2">
              <div className="rounded-2xl border-2 border-gold/30 bg-paper-warm p-3">
                <img src={qrDataUrl} alt="分享二维码" className="size-48" />
              </div>
              <p className="text-xs text-paper-dark/70">长按二维码 → 识别 → 在浏览器中打开</p>
            </div>
          )}

          <div className="space-y-2">
            <p className="text-xs text-paper-dark/60">网址</p>
            <div className="flex items-center gap-2 rounded-lg border border-gold/20 bg-xuan-surface/60 px-3 py-2.5">
              <span className="flex-1 truncate font-mono text-xs text-paper-dark/85">{shareUrl}</span>
              <button
                type="button"
                onClick={copyUrl}
                className="flex shrink-0 items-center gap-1 rounded-md border border-gold/30 bg-gold/10 px-2 py-1 text-xs text-gold hover:bg-gold/20"
              >
                {urlCopied ? <Check className="size-3" /> : <Copy className="size-3" />}
                {urlCopied ? "已复制" : "复制"}
              </button>
            </div>
          </div>

          <div className="grid gap-2.5">
            <Button variant="ritual" size="lg" onClick={nativeShare} className="w-full gap-2 text-base">
              <Share2 className="size-5" />发给好友 / 朋友圈
            </Button>
            <Button variant="secondary" size="lg" onClick={copyText} className="w-full gap-2 text-base">
              {textCopied ? <Check className="size-5" /> : <Copy className="size-5" />}
              {textCopied ? "标题与链接已复制" : "复制标题 + 链接"}
            </Button>
          </div>

          <div className="rounded-xl border border-gold/15 bg-xuan-surface/40 p-3 text-sm leading-relaxed text-paper-dark/85">
            <p className="font-display text-base text-gold">分享小贴士</p>
            <ul className="mt-1 space-y-1">
              <li className="flex gap-1.5">
                <MessageCircle className="mt-0.5 size-4 shrink-0 text-emerald" />
                <span><span className="text-emerald">微信</span>：直接发链接 / 长按二维码识别</span>
              </li>
              <li className="flex gap-1.5">
                <MessageCircle className="mt-0.5 size-4 shrink-0 text-vermillion-light" />
                <span><span className="text-vermillion-light">抖音私信</span>：复制链接后让对方在浏览器中打开</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ShareButtonProps {
  title?: string;
  description?: string;
  url?: string;
  variant?: "primary" | "secondary" | "ghost" | "ritual";
  className?: string;
}

export function ShareButton({ title, description, url, variant = "ritual", className }: ShareButtonProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant={variant} onClick={() => setOpen(true)} className={className}>
        <Share2 className="mr-2 size-4" />分享传播 · 功德倍增
      </Button>
      <ShareModal open={open} onClose={() => setOpen(false)} title={title} description={description} url={url} />
    </>
  );
}
