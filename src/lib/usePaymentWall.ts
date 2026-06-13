"use client";

import { useState, useEffect, useCallback } from "react";
import { useUser } from "@/lib/UserContext";
import { supabase } from "@/lib/supabase";

const STORAGE_PREFIX = "ruyuanyi_paid_";

export function usePaymentWall(serviceName: string, price: string) {
  const [isPaid, setIsPaid] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const { isLoggedIn, setShowAuthModal, user } = useUser();

  const checkOrder = useCallback(async () => {
    const phone = user?.phone;
    if (!phone) return;

    const { data, error } = await supabase
      .from("orders")
      .select("status")
      .eq("user_phone", phone)
      .eq("service", serviceName);

    if (error || !data) return;

    const hasPaid = data.some((o: { status: string }) => o.status === "paid");
    const hasPending = data.some((o: { status: string }) => o.status === "pending");

    setIsPaid(hasPaid);
    setIsPending(hasPending);

    // Backward compat: old localStorage fallback
    if (!hasPaid && !hasPending) {
      if (typeof window !== "undefined" && localStorage.getItem(STORAGE_PREFIX + serviceName) === "true") {
        setIsPaid(true);
      }
    }
  }, [serviceName, user?.phone]);

  useEffect(() => {
    checkOrder();
  }, [checkOrder]);

  // Poll for status changes (admin may approve in Supabase)
  useEffect(() => {
    if (!isPending) return;
    const interval = setInterval(() => checkOrder(), 5000);
    return () => clearInterval(interval);
  }, [isPending, checkOrder]);

  const markPaid = useCallback(() => {
    setIsPaid(true);
    setIsPending(false);
  }, []);

  const markPending = useCallback(() => {
    setIsPending(true);
    setIsPaid(false);
  }, []);

  const resetPaid = useCallback(() => {
    setIsPaid(false);
    setIsPending(false);
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_PREFIX + serviceName);
    }
  }, [serviceName]);

  const initiatePayment = useCallback((): string | null => {
    if (!isLoggedIn) {
      setShowAuthModal(true);
      return null;
    }
    setShowPayment(true);
    return null;
  }, [isLoggedIn, setShowAuthModal]);

  return {
    isPaid,
    isPending,
    setIsPaid: resetPaid,
    showPayment,
    setShowPayment,
    initiatePayment,
    markPaid,
    markPending,
    price,
  };
}
