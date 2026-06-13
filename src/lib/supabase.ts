import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://cfzninrnwfpebebedmpt.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmem5pbnJud2ZwZWJlYmVkbXB0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEyNjkyOTUsImV4cCI6MjA5Njg0NTI5NX0.Oh21v5BDGLS7Nu5tvi9w-8TgyaEgkxV-d3t3qoI-jAw";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface SupabaseOrder {
  id: string;
  user_phone: string;
  user_name: string;
  service: "blessing" | "bazi" | "naming" | "palm";
  amount: string;
  amount_number: number;
  status: "pending" | "paid" | "rejected";
  screenshot?: string | null;
  detail: string;
  timestamp: string;
}

// ---- User History (cross-device sync) ----
export interface SupabaseHistoryRecord {
  id: string;
  user_phone: string;
  record_type: "fortune" | "incense" | "blessing" | "dream";
  data: Record<string, unknown>;
  timestamp: string;
}

export async function syncHistoryToSupabase(record: SupabaseHistoryRecord) {
  const { error } = await supabase.from("user_history").upsert(record);
  if (error) console.error("Supabase syncHistory error:", error.message);
}

export async function fetchHistoryFromSupabase(phone: string, recordType: string) {
  const { data, error } = await supabase
    .from("user_history")
    .select("*")
    .eq("user_phone", phone)
    .eq("record_type", recordType)
    .order("timestamp", { ascending: false })
    .limit(50);

  if (error) {
    console.error("Supabase fetchHistory error:", error.message);
    return [];
  }
  return (data || []) as SupabaseHistoryRecord[];
}
