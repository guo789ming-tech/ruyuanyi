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
