"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { syncHistoryToSupabase, fetchHistoryFromSupabase, syncUserToSupabase, fetchUserFromSupabase, type SupabaseHistoryRecord } from "@/lib/supabase";

export interface FortuneRecord {
  id: string;
  type: "lottery" | "divination" | "bazi" | "naming" | "palm";
  question: string;
  result: string;
  level?: string;
  timestamp: string;
}

export interface IncenseRecord {
  id: string;
  incense_type: string;
  rituals: number;
  merit: number;
  timestamp: string;
}

export interface BlessingRecord {
  id: string;
  name: string;
  relation: string;
  duration: string;
  price: string;
  wish: string;
  status: "pending" | "paid" | "lit";
  timestamp: string;
}

export interface DreamRecord {
  id: string;
  keyword: string;
  result: string;
  ji: string;
  timestamp: string;
}

export interface User {
  phone: string;
  name: string;
  avatar: string;
  merit: number;
  level: string;
  total_incense: number;
  total_blessings: number;
  total_fortunes: number;
  created_at: string;
  last_login?: string;
}

interface UserContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (phone: string, name: string) => void;
  logout: () => void;
  fortuneHistory: FortuneRecord[];
  addFortuneRecord: (r: FortuneRecord) => void;
  incenseHistory: IncenseRecord[];
  addIncenseRecord: (r: IncenseRecord) => void;
  blessingHistory: BlessingRecord[];
  addBlessingRecord: (r: BlessingRecord) => void;
  dreamHistory: DreamRecord[];
  addDreamRecord: (r: DreamRecord) => void;
  addMerit: (amount: number) => void;
  retrieveRecords: (phone: string) => boolean;
  showAuthModal: boolean;
  setShowAuthModal: (v: boolean) => void;
  pendingAction: (() => void) | null;
  setPendingAction: (a: (() => void) | null) => void;
}

const UserContext = createContext<UserContextType | null>(null);

function loadFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultValue;
  } catch { return defaultValue; }
}

function saveToStorage(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* noop */ }
}

const STORAGE_USER = "ruyuanyi_user";
const STORAGE_FORTUNE = "ruyuanyi_fortune_history";
const STORAGE_INCENSE = "ruyuanyi_incense_history";
const STORAGE_BLESSING = "ruyuanyi_blessing_history";
const STORAGE_DREAM = "ruyuanyi_dream_history";

function phoneKey(base: string, phone: string) {
  return `${base}_${phone}`;
}

export function checkExistingUser(phone: string): User | null {
  // Try new key first
  const user = loadFromStorage<User | null>(`${STORAGE_USER}_${phone}`, null);
  if (user) return user;

  // Auto-migrate from old prefix (putiyuan → ruyuanyi)
  interface OldUser { phone: string; name: string; avatar: string; merit: number; level: string; total_incense: number; total_blessings: number; total_fortunes: number; created_at: string; last_login?: string; }
  const old = loadFromStorage<OldUser | null>(`putiyuan_user_${phone}`, null);
  if (old) {
    const migrated: User = {
      phone: old.phone,
      name: old.name,
      avatar: old.avatar,
      merit: old.merit,
      level: old.level,
      total_incense: old.total_incense,
      total_blessings: old.total_blessings,
      total_fortunes: old.total_fortunes,
      created_at: old.created_at,
      last_login: old.last_login,
    };
    saveToStorage(`${STORAGE_USER}_${phone}`, migrated);
    // Migrate histories
    ["fortune_history", "incense_history", "blessing_history", "dream_history"].forEach((suffix) => {
      const oldData = loadFromStorage(`putiyuan_${suffix}_${phone}`, null);
      if (oldData) saveToStorage(`ruyuanyi_${suffix}_${phone}`, oldData);
    });
    return migrated;
  }

  return null;
}

const LEVEL_THRESHOLDS: [number, string][] = [
  [5000, "大功德主"],
  [1000, "功德主"],
  [500, "行者"],
  [100, "居士"],
  [0, "善信"],
];

function calcLevel(merit: number): string {
  for (const [threshold, level] of LEVEL_THRESHOLDS) {
    if (merit >= threshold) return level;
  }
  return "善信";
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [fortuneHistory, setFortuneHistory] = useState<FortuneRecord[]>([]);
  const [incenseHistory, setIncenseHistory] = useState<IncenseRecord[]>([]);
  const [blessingHistory, setBlessingHistory] = useState<BlessingRecord[]>([]);
  const [dreamHistory, setDreamHistory] = useState<DreamRecord[]>([]);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  // Load from localStorage on mount, then sync from Supabase
  useEffect(() => {
    const savedUser = loadFromStorage<User | null>(STORAGE_USER, null);
    setUser(savedUser);
    if (savedUser) {
      const p = savedUser.phone;
      setFortuneHistory(loadFromStorage<FortuneRecord[]>(phoneKey(STORAGE_FORTUNE, p), []));
      setIncenseHistory(loadFromStorage<IncenseRecord[]>(phoneKey(STORAGE_INCENSE, p), []));
      setBlessingHistory(loadFromStorage<BlessingRecord[]>(phoneKey(STORAGE_BLESSING, p), []));
      setDreamHistory(loadFromStorage<DreamRecord[]>(phoneKey(STORAGE_DREAM, p), []));
      void syncRecordsFromSupabase(p);
      // Also pull latest user profile from Supabase
      void (async () => {
        const remote = await fetchUserFromSupabase(p);
        if (remote) {
          const updated: User = {
            phone: remote.phone as string,
            name: remote.name as string,
            avatar: remote.avatar as string,
            merit: remote.merit as number,
            level: remote.level as string,
            total_incense: remote.total_incense as number,
            total_blessings: remote.total_blessings as number,
            total_fortunes: remote.total_fortunes as number,
            created_at: remote.created_at as string,
            last_login: remote.last_login as string,
          };
          setUser(updated);
          saveToStorage(STORAGE_USER, updated);
          saveToStorage(phoneKey(STORAGE_USER, p), updated);
        }
      })();
    } else {
      setFortuneHistory(loadFromStorage<FortuneRecord[]>(STORAGE_FORTUNE, []));
      setIncenseHistory(loadFromStorage<IncenseRecord[]>(STORAGE_INCENSE, []));
      setBlessingHistory(loadFromStorage<BlessingRecord[]>(STORAGE_BLESSING, []));
      setDreamHistory(loadFromStorage<DreamRecord[]>(STORAGE_DREAM, []));
    }
  }, []);

  const login = useCallback((phone: string, name: string) => {
    const local = loadFromStorage<User | null>(phoneKey(STORAGE_USER, phone), null);

    // Always pull from Supabase for cross-device consistency
    void (async () => {
      const remote = await fetchUserFromSupabase(phone);
      let userData: User;

      if (remote) {
        // Use Supabase as source of truth (most recent across devices)
        userData = {
          phone: remote.phone as string,
          name: remote.name as string,
          avatar: remote.avatar as string,
          merit: remote.merit as number,
          level: remote.level as string,
          total_incense: remote.total_incense as number,
          total_blessings: remote.total_blessings as number,
          total_fortunes: remote.total_fortunes as number,
          created_at: remote.created_at as string,
          last_login: new Date().toISOString(),
        };
      } else if (local) {
        // No remote data, use local
        userData = { ...local, last_login: new Date().toISOString() };
      } else {
        // New user
        userData = {
          phone, name, avatar: name.slice(0, 1),
          merit: 0, level: "善信",
          total_incense: 0, total_blessings: 0, total_fortunes: 0,
          created_at: new Date().toISOString(),
          last_login: new Date().toISOString(),
        };
      }

      setUser(userData);
      saveToStorage(STORAGE_USER, userData);
      saveToStorage(phoneKey(STORAGE_USER, phone), userData);
      syncUserToSupabase(userData as unknown as Record<string, unknown>);

      // Load records from local + Supabase
      setFortuneHistory(loadFromStorage<FortuneRecord[]>(phoneKey(STORAGE_FORTUNE, phone), []));
      setIncenseHistory(loadFromStorage<IncenseRecord[]>(phoneKey(STORAGE_INCENSE, phone), []));
      setBlessingHistory(loadFromStorage<BlessingRecord[]>(phoneKey(STORAGE_BLESSING, phone), []));
      setDreamHistory(loadFromStorage<DreamRecord[]>(phoneKey(STORAGE_DREAM, phone), []));
      void syncRecordsFromSupabase(phone);
    })();

    setShowAuthModal(false);
  }, []);

  // Pull records from Supabase and merge into state; also backfill local to remote
  async function syncRecordsFromSupabase(phone: string) {
    try {
      const localFortune = loadFromStorage<FortuneRecord[]>(phoneKey(STORAGE_FORTUNE, phone), []);
      const localIncense = loadFromStorage<IncenseRecord[]>(phoneKey(STORAGE_INCENSE, phone), []);
      const localBlessing = loadFromStorage<BlessingRecord[]>(phoneKey(STORAGE_BLESSING, phone), []);
      const localDream = loadFromStorage<DreamRecord[]>(phoneKey(STORAGE_DREAM, phone), []);

      const [remoteFortune, remoteIncense, remoteBlessing, remoteDream] = await Promise.all([
        fetchHistoryFromSupabase(phone, "fortune"),
        fetchHistoryFromSupabase(phone, "incense"),
        fetchHistoryFromSupabase(phone, "blessing"),
        fetchHistoryFromSupabase(phone, "dream"),
      ]);

      const mapGeneric = (rows: SupabaseHistoryRecord[]) =>
        rows.map((r) => r.data as unknown as FortuneRecord);
      const mapBlessing = (rows: SupabaseHistoryRecord[]) =>
        rows.map((r) => r.data as unknown as BlessingRecord);
      const mapIncense = (rows: SupabaseHistoryRecord[]) =>
        rows.map((r) => r.data as unknown as IncenseRecord);
      const mapDream = (rows: SupabaseHistoryRecord[]) =>
        rows.map((r) => r.data as unknown as DreamRecord);

      const remoteIds = new Set(remoteFortune.map((r) => r.id));

      // Backfill: push local-only records to Supabase
      for (const r of localFortune) {
        if (!remoteIds.has(r.id)) {
          syncHistoryToSupabase({ id: r.id, user_phone: phone, record_type: "fortune", data: r as unknown as Record<string, unknown>, timestamp: r.timestamp });
        }
      }
      for (const r of localIncense) {
        if (!remoteIds.has(r.id)) {
          syncHistoryToSupabase({ id: r.id, user_phone: phone, record_type: "incense", data: r as unknown as Record<string, unknown>, timestamp: r.timestamp });
        }
      }
      for (const r of localBlessing) {
        if (!remoteIds.has(r.id)) {
          syncHistoryToSupabase({ id: r.id, user_phone: phone, record_type: "blessing", data: r as unknown as Record<string, unknown>, timestamp: r.timestamp });
        }
      }
      for (const r of localDream) {
        if (!remoteIds.has(r.id)) {
          syncHistoryToSupabase({ id: r.id, user_phone: phone, record_type: "dream", data: r as unknown as Record<string, unknown>, timestamp: r.timestamp });
        }
      }

      // Merge: remote + local, deduped
      const mergedFortune = mergeRecords(mapGeneric(remoteFortune), localFortune);
      const mergedIncense = mergeRecords(mapIncense(remoteIncense), localIncense);
      const mergedBlessing = mergeRecords(mapBlessing(remoteBlessing), localBlessing);
      const mergedDream = mergeRecords(mapDream(remoteDream), localDream);

      setFortuneHistory(mergedFortune);
      setIncenseHistory(mergedIncense);
      setBlessingHistory(mergedBlessing);
      setDreamHistory(mergedDream);

      saveToStorage(phoneKey(STORAGE_FORTUNE, phone), mergedFortune);
      saveToStorage(phoneKey(STORAGE_INCENSE, phone), mergedIncense);
      saveToStorage(phoneKey(STORAGE_BLESSING, phone), mergedBlessing);
      saveToStorage(phoneKey(STORAGE_DREAM, phone), mergedDream);
    } catch (e) {
      console.error("syncRecordsFromSupabase error:", e);
    }
  }

  function mergeRecords<T extends { id: string }>(remote: T[], local: T[]): T[] {
    const ids = new Set(local.map((r) => r.id));
    const merged = [...local];
    for (const r of remote) {
      if (!ids.has(r.id)) merged.push(r);
    }
    merged.sort((a, b) => {
      const ta = (a as Record<string, unknown>).timestamp as string || "";
      const tb = (b as Record<string, unknown>).timestamp as string || "";
      return tb.localeCompare(ta);
    });
    return merged.slice(0, 50);
  }

  const logout = useCallback(() => {
    if (user) {
      const p = user.phone;
      saveToStorage(phoneKey(STORAGE_USER, p), { ...user, last_login: new Date().toISOString() });
      saveToStorage(phoneKey(STORAGE_FORTUNE, p), fortuneHistory);
      saveToStorage(phoneKey(STORAGE_INCENSE, p), incenseHistory);
      saveToStorage(phoneKey(STORAGE_BLESSING, p), blessingHistory);
      saveToStorage(phoneKey(STORAGE_DREAM, p), dreamHistory);
    }
    setUser(null);
    saveToStorage(STORAGE_USER, null);
    setFortuneHistory([]);
    setIncenseHistory([]);
    setBlessingHistory([]);
    setDreamHistory([]);
  }, [user, fortuneHistory, incenseHistory, blessingHistory, dreamHistory]);

  const addFortuneRecord = useCallback((r: FortuneRecord) => {
    setFortuneHistory((prev) => {
      const next = [r, ...prev].slice(0, 50);
      if (user) {
        saveToStorage(phoneKey(STORAGE_FORTUNE, user.phone), next);
        syncHistoryToSupabase({ id: r.id, user_phone: user.phone, record_type: "fortune", data: r as unknown as Record<string, unknown>, timestamp: r.timestamp });
      }
      return next;
    });
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, total_fortunes: prev.total_fortunes + 1 };
      saveToStorage(STORAGE_USER, updated);
      saveToStorage(phoneKey(STORAGE_USER, prev.phone), updated);
      return updated;
    });
  }, [user]);

  const addIncenseRecord = useCallback((r: IncenseRecord) => {
    setIncenseHistory((prev) => {
      const next = [r, ...prev].slice(0, 50);
      if (user) {
        saveToStorage(phoneKey(STORAGE_INCENSE, user.phone), next);
        syncHistoryToSupabase({ id: r.id, user_phone: user.phone, record_type: "incense", data: r as unknown as Record<string, unknown>, timestamp: r.timestamp });
      }
      return next;
    });
    setUser((prev) => {
      if (!prev) return prev;
      const merit = prev.merit + r.merit;
      const updated = { ...prev, total_incense: prev.total_incense + r.rituals, merit, level: calcLevel(merit) };
      saveToStorage(STORAGE_USER, updated);
      saveToStorage(phoneKey(STORAGE_USER, prev.phone), updated);
      return updated;
    });
  }, [user]);

  const addBlessingRecord = useCallback((r: BlessingRecord) => {
    setBlessingHistory((prev) => {
      const next = [r, ...prev].slice(0, 50);
      if (user) {
        saveToStorage(phoneKey(STORAGE_BLESSING, user.phone), next);
        syncHistoryToSupabase({ id: r.id, user_phone: user.phone, record_type: "blessing", data: r as unknown as Record<string, unknown>, timestamp: r.timestamp });
      }
      return next;
    });
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, total_blessings: prev.total_blessings + 1 };
      saveToStorage(STORAGE_USER, updated);
      saveToStorage(phoneKey(STORAGE_USER, prev.phone), updated);
      return updated;
    });
  }, [user]);

  const addDreamRecord = useCallback((r: DreamRecord) => {
    setDreamHistory((prev) => {
      const next = [r, ...prev].slice(0, 30);
      if (user) {
        saveToStorage(phoneKey(STORAGE_DREAM, user.phone), next);
        syncHistoryToSupabase({ id: r.id, user_phone: user.phone, record_type: "dream", data: r as unknown as Record<string, unknown>, timestamp: r.timestamp });
      }
      return next;
    });
  }, [user]);

  const addMerit = useCallback((amount: number) => {
    setUser((prev) => {
      if (!prev) return prev;
      const merit = prev.merit + amount;
      const updated = { ...prev, merit, level: calcLevel(merit) };
      saveToStorage(STORAGE_USER, updated);
      saveToStorage(phoneKey(STORAGE_USER, prev.phone), updated);
      return updated;
    });
  }, []);

  const retrieveRecords = useCallback((phone: string): boolean => {
    const saved = checkExistingUser(phone);
    if (saved) {
      setUser((prev) => prev ? { ...prev, merit: saved.merit, level: saved.level, total_incense: saved.total_incense, total_blessings: saved.total_blessings, total_fortunes: saved.total_fortunes } : prev);
      if (user) {
        const updated = { ...user, merit: saved.merit, level: saved.level, total_incense: saved.total_incense, total_blessings: saved.total_blessings, total_fortunes: saved.total_fortunes };
        saveToStorage(STORAGE_USER, updated);
      }
      return true;
    }
    return false;
  }, [user]);

  const isLoggedIn = !!user;

  return (
    <UserContext.Provider
      value={{
        user, isLoggedIn, login, logout,
        fortuneHistory, addFortuneRecord,
        incenseHistory, addIncenseRecord,
        blessingHistory, addBlessingRecord,
        dreamHistory, addDreamRecord,
        addMerit,
        retrieveRecords,
        showAuthModal, setShowAuthModal,
        pendingAction, setPendingAction,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
}
