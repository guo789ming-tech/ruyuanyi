"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { useUser } from "@/lib/UserContext";
import { MEDITATION_TRACKS } from "@/lib/data";
import { supabase, type SupabaseOrder } from "@/lib/supabase";

// ---- Types ----

export interface Order {
  id: string;
  userPhone: string;
  userName: string;
  service: "blessing" | "bazi" | "naming" | "palm";
  amount: string;
  amountNumber: number;
  status: "pending" | "paid" | "rejected";
  screenshot?: string;
  detail: string;
  timestamp: string;
}

export interface Track {
  id: string;
  name: string;
  icon: string;
  category: string;
  description: string;
  source: string;
  duration: number;
  url: string;
}

export interface PricingConfig {
  bazi: string;
  naming: string;
  palm: string;
  blessing_month: string;
  blessing_100days: string;
  blessing_year: string;
  blessing_forever: string;
}

export interface SystemConfig {
  siteName: string;
  adminPhones: string[];
  siteDescription: string;
  adminPinHash: string; // SHA-256 of admin secondary PIN
}

const DEFAULT_PRICING: PricingConfig = {
  bazi: "¥28",
  naming: "¥38",
  palm: "¥18",
  blessing_month: "¥6.6",
  blessing_100days: "¥19.9",
  blessing_year: "¥66.6",
  blessing_forever: "¥199",
};

const DEFAULT_SYSTEM_CONFIG: SystemConfig = {
  siteName: "如愿禅苑",
  adminPhones: ["15638837527"],
  siteDescription: "心诚则灵。为家人点一盏祈福灯，求一支灵签，看一卦命理八字。",
  adminPinHash: "c4409ef2f2815b3bb06a6fa2c3d21d72869c7ffe38b3a0fa611da9ca0e386417",
};

const STORAGE_PRICING = "ruyuanyi_admin_pricing";
const STORAGE_QR = "ruyuanyi_admin_qrcodes";
const STORAGE_TRACKS = "ruyuanyi_admin_tracks";
const STORAGE_CONFIG = "ruyuanyi_admin_config";
const STORAGE_ORDERS = "ruyuanyi_admin_orders";
const STORAGE_ACTIVE_USERS = "ruyuanyi_admin_active_users";

function loadJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveJSON(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* noop */
  }
}

function parseAmountNumber(amount: string): number {
  return parseFloat(amount.replace("¥", "")) || 0;
}

// ---- Context ----

interface AdminContextType {
  pricing: PricingConfig;
  updatePricing: (key: keyof PricingConfig, value: string) => void;
  qrCodes: { wechat: string; alipay: string };
  updateQRCode: (type: "wechat" | "alipay", base64: string) => void;
  resetQRCode: (type: "wechat" | "alipay") => void;
  meditationTracks: Track[];
  updateTrack: (id: string, data: Partial<Track>) => void;
  deleteTrack: (id: string) => void;
  addTrack: (track: Track) => void;
  systemConfig: SystemConfig;
  updateSystemConfig: (data: Partial<SystemConfig>) => void;
  orders: Order[];
  addOrder: (order: Omit<Order, "id" | "timestamp">) => void;
  updateOrderStatus: (id: string, status: "paid" | "rejected") => void;
  isAdmin: boolean;
  getPrice: (service: keyof PricingConfig) => string;
}

const AdminContext = createContext<AdminContextType | null>(null);

export function AdminProvider({ children }: { children: ReactNode }) {
  const { user, isLoggedIn } = useUser();

  const [pricing, setPricing] = useState<PricingConfig>(DEFAULT_PRICING);
  const [qrCodes, setQRCodes] = useState({ wechat: "", alipay: "" });
  const [meditationTracks, setMeditationTracks] = useState<Track[]>(MEDITATION_TRACKS);
  const [systemConfig, setSystemConfig] = useState<SystemConfig>(DEFAULT_SYSTEM_CONFIG);
  const [orders, setOrders] = useState<Order[]>([]);

  // Load from localStorage on mount, orders from Supabase
  useEffect(() => {
    setPricing(loadJSON(STORAGE_PRICING, DEFAULT_PRICING));
    setQRCodes(loadJSON(STORAGE_QR, { wechat: "", alipay: "" }));
    setMeditationTracks(loadJSON(STORAGE_TRACKS, MEDITATION_TRACKS));
    setSystemConfig(loadJSON(STORAGE_CONFIG, DEFAULT_SYSTEM_CONFIG));

    // Load orders from Supabase
    supabase
      .from("orders")
      .select("*")
      .order("timestamp", { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          console.error("Supabase loadOrders error:", error.message);
          // Fallback to localStorage
          setOrders(loadJSON(STORAGE_ORDERS, []));
          return;
        }
        const mapped: Order[] = ((data || []) as SupabaseOrder[]).map((o) => ({
          id: o.id,
          userPhone: o.user_phone,
          userName: o.user_name,
          service: o.service as Order["service"],
          amount: o.amount,
          amountNumber: o.amount_number,
          status: o.status as Order["status"],
          screenshot: o.screenshot || undefined,
          detail: o.detail,
          timestamp: o.timestamp,
        }));
        setOrders(mapped);
      });
  }, []);

  const isAdmin = isLoggedIn && systemConfig.adminPhones.includes(user?.phone || "");

  // Pricing
  const updatePricing = useCallback((key: keyof PricingConfig, value: string) => {
    setPricing((prev) => {
      const next = { ...prev, [key]: value };
      saveJSON(STORAGE_PRICING, next);
      return next;
    });
  }, []);

  // QR Codes
  const updateQRCode = useCallback((type: "wechat" | "alipay", base64: string) => {
    setQRCodes((prev) => {
      const next = { ...prev, [type]: base64 };
      saveJSON(STORAGE_QR, next);
      return next;
    });
  }, []);

  const resetQRCode = useCallback((type: "wechat" | "alipay") => {
    setQRCodes((prev) => {
      const next = { ...prev, [type]: "" };
      saveJSON(STORAGE_QR, next);
      return next;
    });
  }, []);

  // Meditation tracks
  const updateTrack = useCallback((id: string, data: Partial<Track>) => {
    setMeditationTracks((prev) => {
      const next = prev.map((t) => (t.id === id ? { ...t, ...data } : t));
      saveJSON(STORAGE_TRACKS, next);
      return next;
    });
  }, []);

  const deleteTrack = useCallback((id: string) => {
    setMeditationTracks((prev) => {
      const next = prev.filter((t) => t.id !== id);
      saveJSON(STORAGE_TRACKS, next);
      return next;
    });
  }, []);

  const addTrack = useCallback((track: Track) => {
    setMeditationTracks((prev) => {
      const next = [...prev, track];
      saveJSON(STORAGE_TRACKS, next);
      return next;
    });
  }, []);

  // System config
  const updateSystemConfig = useCallback((data: Partial<SystemConfig>) => {
    setSystemConfig((prev) => {
      const next = { ...prev, ...data };
      saveJSON(STORAGE_CONFIG, next);
      return next;
    });
  }, []);

  // Orders
  const addOrder = useCallback(async (orderData: Omit<Order, "id" | "timestamp">) => {
    const id = `order_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const timestamp = new Date().toISOString();
    const order: Order = { ...orderData, id, timestamp };

    // Write to Supabase
    const supabaseOrder: SupabaseOrder = {
      id,
      user_phone: orderData.userPhone,
      user_name: orderData.userName,
      service: orderData.service,
      amount: orderData.amount,
      amount_number: orderData.amountNumber,
      status: orderData.status,
      screenshot: orderData.screenshot || null,
      detail: orderData.detail,
      timestamp,
    };

    const { error } = await supabase.from("orders").insert(supabaseOrder);
    if (error) console.error("Supabase addOrder error:", error.message);

    setOrders((prev) => [order, ...prev]);
  }, []);

  // Order status
  const updateOrderStatus = useCallback(async (id: string, status: "paid" | "rejected") => {
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (error) console.error("Supabase updateOrderStatus error:", error.message);

    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status } : o))
    );
  }, []);

  // Helper: get current price for a service
  const getPrice = useCallback(
    (service: keyof PricingConfig) => pricing[service],
    [pricing]
  );

  return (
    <AdminContext.Provider
      value={{
        pricing,
        updatePricing,
        qrCodes,
        updateQRCode,
        resetQRCode,
        meditationTracks,
        updateTrack,
        deleteTrack,
        addTrack,
        systemConfig,
        updateSystemConfig,
        orders,
        addOrder,
        updateOrderStatus,
        isAdmin,
        getPrice,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
  return ctx;
}

// Non-hook helper for reading stored orders/users directly
export function getStoredOrders(): Order[] {
  return loadJSON(STORAGE_ORDERS, []);
}

export function getStoredActiveUsers(): Record<string, string> {
  return loadJSON(STORAGE_ACTIVE_USERS, {});
}

export function getStoredUsers(): Record<string, unknown>[] {
  if (typeof window === "undefined") return [];
  const users: Record<string, unknown>[] = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("ruyuanyi_user_1") || key?.startsWith("putiyuan_user_1")) {
        try {
          const val = localStorage.getItem(key);
          if (val) users.push(JSON.parse(val));
        } catch {
          /* skip */
        }
      }
    }
  } catch {
    /* skip */
  }
  return users;
}
