"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  DollarSign,
  QrCode,
  Music,
  Settings,
  LogOut,
  ArrowLeft,
  Menu,
  X,
  Edit3,
  Check,
  Plus,
  Trash2,
  Upload,
  RotateCcw,
  Search,
  TrendingUp,
  UserCheck,
  ShoppingCart,
  Clock,
  ClipboardCheck,
  Eye,
  Image,
  Bell,
} from "lucide-react";
import { useUser } from "@/lib/UserContext";
import { useAdmin, getStoredUsers, type Order } from "@/lib/AdminContext";
import { Button } from "@/components/Button";
import { AuthModal } from "@/components/AuthModal";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

// ---- Module types ----
type ModuleKey = "dashboard" | "users" | "orders" | "pricing" | "qrcodes" | "music" | "config";

const NAV_ITEMS: { key: ModuleKey; label: string; icon: React.ReactNode }[] = [
  { key: "dashboard", label: "数据看板", icon: <LayoutDashboard className="size-4" /> },
  { key: "users", label: "用户列表", icon: <Users className="size-4" /> },
  { key: "orders", label: "审核订单", icon: <ClipboardCheck className="size-4" /> },
  { key: "pricing", label: "商品定价", icon: <DollarSign className="size-4" /> },
  { key: "qrcodes", label: "收款码管理", icon: <QrCode className="size-4" /> },
  { key: "music", label: "禅修音乐", icon: <Music className="size-4" /> },
  { key: "config", label: "系统配置", icon: <Settings className="size-4" /> },
];

// ---- Main Page ----
export default function AdminPage() {
  const router = useRouter();
  const { isLoggedIn, user, setShowAuthModal } = useUser();
  const { isAdmin, systemConfig } = useAdmin();

  const [activeModule, setActiveModule] = useState<ModuleKey>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [prevPendingIds, setPrevPendingIds] = useState<Set<string>>(new Set());
  const [notification, setNotification] = useState<{ id: number; text: string } | null>(null);
  const hasMounted = useRef(false);

  const { login } = useUser();

  // Play a simple chime sound
  const playChime = () => {
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.setValueAtTime(1100, ctx.currentTime + 0.15);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.8);
    } catch { /* browser may block audio without interaction */ }
  };

  const showNotification = (text: string) => {
    const id = Date.now();
    setNotification({ id, text });
    playChime();
    setTimeout(() => setNotification((prev) => (prev?.id === id ? null : prev)), 5000);
  };

  // Poll for new pending orders
  useEffect(() => {
    if (!isAdmin) return;
    const poll = async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("id, status, detail")
        .eq("status", "pending")
        .order("timestamp", { ascending: false });

      if (error || !data) return;

      const pendingIds = new Set(data.map((o: { id: string }) => o.id));
      const count = data.length;
      setPendingCount(count);

      if (hasMounted.current) {
        // Detect new pending orders
        const newIds = [...pendingIds].filter((id) => !prevPendingIds.has(id));
        if (newIds.length > 0) {
          const newOrder = data.find((o: { id: string }) => o.id === newIds[0]) as { detail?: string } | undefined;
          showNotification(`新订单待审核：${newOrder?.detail || "查看详情"}${newIds.length > 1 ? ` 等${newIds.length}笔` : ""}`);
        }
      } else {
        hasMounted.current = true;
      }
      setPrevPendingIds(pendingIds);
    };

    poll();
    const interval = setInterval(poll, 8000);
    return () => clearInterval(interval);
  }, [isAdmin]);

  // If not logged in, show login with quick admin access
  if (!isLoggedIn) {
    const quickAdminLogin = () => {
      login("13800000000", "管理员");
    };
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-center mb-6">
            <span className="text-5xl">🪔</span>
            <h2 className="mt-2 font-display text-xl text-gold">如愿禅苑 · 管理后台</h2>
          </div>
          <Button variant="ritual" onClick={() => setShowAuthModal(true)}>
            手机号登录
          </Button>
          <div className="flex items-center gap-2">
            <div className="h-px flex-1 bg-gold/10" />
            <span className="text-xs text-paper-dark/30">或</span>
            <div className="h-px flex-1 bg-gold/10" />
          </div>
          <Button variant="secondary" onClick={quickAdminLogin}>
            快速进入（默认管理员）
          </Button>
          <p className="text-xs text-paper-dark/30">默认管理员手机号 13800000000</p>
          <AuthModal />
        </div>
      </div>
    );
  }

  // If logged in but not admin
  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-vermillion">无权限访问</p>
          <p className="text-xs text-paper-dark/50">
            当前账号 {user?.phone || ""} 不是管理员
          </p>
          <Button variant="secondary" onClick={() => router.push("/")}>
            返回首页
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-xuan overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-60 bg-xuan-card border-r border-gold/10 flex flex-col transition-transform duration-200 md:relative md:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Sidebar header */}
        <div className="h-14 flex items-center gap-2 px-4 border-b border-gold/10 shrink-0">
          <span className="text-xl">🪔</span>
          <span className="font-display text-gold text-lg">{systemConfig.siteName}</span>
          <span className="text-xs text-gold/40 ml-auto">后台</span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden size-7 flex items-center justify-center rounded text-gold/50 hover:text-gold"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              onClick={() => {
                setActiveModule(item.key);
                setSidebarOpen(false);
              }}
              className={cn(
                "w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors text-left",
                activeModule === item.key
                  ? "bg-gold/10 text-gold font-medium"
                  : "text-paper-dark/60 hover:text-gold hover:bg-gold/5"
              )}
            >
              {item.icon}
              {item.label}
              {item.key === "orders" && pendingCount > 0 && (
                <span className="ml-auto rounded-full bg-vermillion px-1.5 py-0.5 text-[10px] font-bold text-white leading-none min-w-[18px] text-center">
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Sidebar footer */}
        <div className="border-t border-gold/10 p-3 space-y-1">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-paper-dark/50 hover:text-gold transition-colors"
          >
            <ArrowLeft className="size-3.5" />
            返回站点
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-14 flex items-center gap-2 px-4 border-b border-gold/10 bg-xuan-card shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden size-8 flex items-center justify-center rounded text-gold/50 hover:text-gold"
          >
            <Menu className="size-4" />
          </button>
          <span className="text-sm text-gold/70 font-medium">
            {NAV_ITEMS.find((n) => n.key === activeModule)?.label}
          </span>
          <span className="ml-auto text-xs text-paper-dark/40">
            {user?.name} · {user?.phone}
          </span>
        </header>

        {/* Toast notification */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -20, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: -20, x: "-50%" }}
              className="fixed top-16 left-1/2 z-[100] rounded-xl border border-vermillion/30 bg-vermillion/10 px-5 py-3 shadow-lg backdrop-blur-sm cursor-pointer"
              onClick={() => setNotification(null)}
            >
              <div className="flex items-center gap-2">
                <Bell className="size-4 text-vermillion-light animate-bounce" />
                <span className="text-sm text-paper">{notification.text}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {activeModule === "dashboard" && <DashboardModule />}
          {activeModule === "users" && <UsersModule />}
          {activeModule === "orders" && <OrderReviewModule />}
          {activeModule === "pricing" && <PricingModule />}
          {activeModule === "qrcodes" && <QRCodesModule />}
          {activeModule === "music" && <MusicModule />}
          {activeModule === "config" && <ConfigModule />}
        </div>
      </div>
    </div>
  );
}

// ===================== Dashboard =====================
function DashboardModule() {
  const { orders } = useAdmin();
  const [filter, setFilter] = useState<"all" | "paid">("all");

  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);

  const paidOrders = orders.filter((o) => o.status === "paid");
  const pendingOrders = orders.filter((o) => o.status === "pending");
  const todayPaidOrders = paidOrders.filter((o) => o.timestamp.startsWith(todayStr));
  const todayRevenue = todayPaidOrders.reduce((sum, o) => sum + o.amountNumber, 0);
  const totalRevenue = paidOrders.reduce((sum, o) => sum + o.amountNumber, 0);
  const totalUsers = getStoredUsers().length;

  const filteredOrders =
    filter === "all" ? orders : orders.filter((o) => o.status === "paid");

  const stats = [
    { label: "今日收入", value: `¥${todayRevenue.toFixed(1)}`, icon: <TrendingUp className="size-5 text-emerald" />, color: "border-emerald/20 bg-emerald/5" },
    { label: "累计收入", value: `¥${totalRevenue.toFixed(1)}`, icon: <DollarSign className="size-5 text-gold" />, color: "border-gold/20 bg-gold/5" },
    { label: "待审订单", value: `${pendingOrders.length}笔`, icon: <Clock className="size-5 text-amber-400" />, color: "border-amber-400/20 bg-amber-500/5" },
    { label: "注册用户", value: `${totalUsers}人`, icon: <UserCheck className="size-5 text-sky-400" />, color: "border-sky-400/20 bg-sky-500/5" },
  ];

  const SERVICE_LABELS: Record<string, string> = {
    blessing: "祈福灯",
    bazi: "八字精批",
    naming: "宝宝起名",
    palm: "手相图解",
  };

  return (
    <div className="space-y-5">
      <h2 className="font-display text-xl text-gold">数据看板</h2>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((s) => (
          <div key={s.label} className={cn("rounded-xl border p-4", s.color)}>
            <div className="flex items-center justify-between">
              <span className="text-xs text-paper-dark/60">{s.label}</span>
              {s.icon}
            </div>
            <p className="mt-2 font-display text-xl text-gold">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Order list */}
      <div className="rounded-xl border border-gold/15 bg-xuan-surface/40 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-lg text-gold">订单列表</h3>
          <div className="flex gap-1">
            {[
              { key: "all", label: "全部" },
              { key: "paid", label: "已支付" },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key as "all" | "paid")}
                className={cn(
                  "rounded-lg px-3 py-1 text-xs transition-colors",
                  filter === f.key
                    ? "bg-gold/10 text-gold"
                    : "text-paper-dark/50 hover:text-gold"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <p className="py-8 text-center text-xs text-paper-dark/40">暂无订单</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gold/10 text-paper-dark/40">
                  <th className="text-left py-2 pr-3 font-medium">手机号</th>
                  <th className="text-left py-2 pr-3 font-medium">服务</th>
                  <th className="text-left py-2 pr-3 font-medium">金额</th>
                  <th className="text-left py-2 pr-3 font-medium">详情</th>
                  <th className="text-left py-2 pr-3 font-medium">状态</th>
                  <th className="text-left py-2 font-medium">时间</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((o) => (
                  <tr key={o.id} className="border-b border-gold/5">
                    <td className="py-2 pr-3 text-paper-dark/70 whitespace-nowrap">
                      {o.userPhone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2")}
                    </td>
                    <td className="py-2 pr-3 text-paper-dark whitespace-nowrap">
                      {SERVICE_LABELS[o.service] || o.service}
                    </td>
                    <td className="py-2 pr-3 text-gold font-medium whitespace-nowrap">{o.amount}</td>
                    <td className="py-2 pr-3 text-paper-dark/60 max-w-[120px] truncate">
                      {o.detail}
                    </td>
                    <td className="py-2 pr-3 whitespace-nowrap">
                      <span className="rounded-full bg-emerald/10 text-emerald text-xs px-2 py-0.5">
                        已支付
                      </span>
                    </td>
                    <td className="py-2 text-paper-dark/40 whitespace-nowrap">
                      {new Date(o.timestamp).toLocaleString("zh-CN", {
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ===================== Users =====================
function UsersModule() {
  const [users, setUsers] = useState<Record<string, unknown>[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setUsers(getStoredUsers());
  }, []);

  const filtered = users.filter((u) => {
    if (!search.trim()) return true;
    const phone = (u.phone as string) || "";
    const name = (u.name as string) || "";
    return phone.includes(search) || name.includes(search);
  });

  return (
    <div className="space-y-5">
      <h2 className="font-display text-xl text-gold">用户列表</h2>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-paper-dark/30" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="搜索手机号或昵称..."
          className="w-full rounded-xl border border-gold/20 bg-xuan/80 pl-10 pr-4 py-2.5 text-sm text-paper placeholder:text-paper-dark/30 focus:border-gold/50 focus:outline-none"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="py-8 text-center text-xs text-paper-dark/40">
          {search ? "未找到匹配用户" : "暂无注册用户"}
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gold/15 bg-xuan-surface/40">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gold/10 text-paper-dark/40">
                <th className="text-left py-3 px-4 font-medium">手机号</th>
                <th className="text-left py-3 px-4 font-medium">昵称</th>
                <th className="text-left py-3 px-4 font-medium">功德值</th>
                <th className="text-left py-3 px-4 font-medium">等级</th>
                <th className="text-left py-3 px-4 font-medium">注册时间</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, i) => (
                <tr key={i} className="border-b border-gold/5">
                  <td className="py-2.5 px-4 text-paper-dark/70 whitespace-nowrap">
                    {(u.phone as string) || "-"}
                  </td>
                  <td className="py-2.5 px-4 text-paper-dark whitespace-nowrap">
                    {(u.name as string) || "-"}
                  </td>
                  <td className="py-2.5 px-4 text-gold font-medium">
                    {String(u.merit ?? 0)}
                  </td>
                  <td className="py-2.5 px-4 whitespace-nowrap">
                    <span className="rounded-full border border-gold/20 bg-gold/5 px-2 py-0.5 text-xs text-gold/70">
                      {u.level as string || "善信"}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-paper-dark/40 whitespace-nowrap">
                    {u.created_at
                      ? new Date(u.created_at as string).toLocaleDateString("zh-CN")
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ===================== Order Review =====================
function OrderReviewModule() {
  const { orders, updateOrderStatus } = useAdmin();
  const [previewScreenshot, setPreviewScreenshot] = useState<string | null>(null);
  const [filter, setFilter] = useState<"pending" | "paid" | "rejected">("pending");

  const filteredOrders = orders.filter((o) => o.status === filter);

  const statusLabel = { pending: "待审核", paid: "已通过", rejected: "已拒绝" };
  const statusColor = {
    pending: "text-amber-400 bg-amber-500/10 border-amber-400/30",
    paid: "text-emerald bg-emerald/10 border-emerald/30",
    rejected: "text-red-400 bg-red-500/10 border-red-400/30",
  };

  const serviceLabel: Record<string, string> = {
    blessing: "镇宅祈福",
    bazi: "八字精批",
    naming: "宝宝起名",
    palm: "手相图解",
  };

  return (
    <div className="space-y-4">
      <h2 className="font-display text-xl text-gold">审核订单</h2>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {(["pending", "paid", "rejected"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-sm transition-colors",
              filter === s
                ? "border-gold bg-gold/10 text-gold"
                : "border-gold/15 text-paper-dark hover:border-gold/30"
            )}
          >
            {statusLabel[s]} ({orders.filter((o) => o.status === s).length})
          </button>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <div className="py-12 text-center border border-gold/10 rounded-xl">
          <ShoppingCart className="size-8 text-paper-dark/30 mx-auto mb-2" />
          <p className="text-sm text-paper-dark/40">暂无{statusLabel[filter]}订单</p>
        </div>
      )}

      <div className="space-y-3">
        {filteredOrders.map((order) => (
          <div
            key={order.id}
            className="rounded-xl border border-gold/15 bg-xuan-surface/40 p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-gold text-sm">
                    {serviceLabel[order.service] || order.service}
                  </span>
                  <span className={cn("rounded-full border px-2 py-0.5 text-xs", statusColor[order.status])}>
                    {statusLabel[order.status]}
                  </span>
                  <span className="text-sm text-vermillion font-medium">{order.amount}</span>
                </div>
                <p className="mt-1 text-xs text-paper-dark/70">{order.detail}</p>
                <div className="mt-1 flex items-center gap-3 text-xs text-paper-dark/50">
                  <span>{order.userName}</span>
                  <span>{order.userPhone}</span>
                  <span>{new Date(order.timestamp).toLocaleString("zh-CN")}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {order.screenshot && (
                  <button
                    onClick={() => setPreviewScreenshot(order.screenshot!)}
                    className="flex size-8 items-center justify-center rounded-full bg-gold/10 text-gold hover:bg-gold/20"
                    title="查看支付截图"
                  >
                    <Eye className="size-4" />
                  </button>
                )}
                {order.status === "pending" && (
                  <>
                    <button
                      onClick={() => updateOrderStatus(order.id, "paid")}
                      className="flex size-8 items-center justify-center rounded-full bg-emerald/10 text-emerald hover:bg-emerald/20"
                      title="通过"
                    >
                      <Check className="size-4" />
                    </button>
                    <button
                      onClick={() => updateOrderStatus(order.id, "rejected")}
                      className="flex size-8 items-center justify-center rounded-full bg-red-500/10 text-red-400 hover:bg-red-500/20"
                      title="拒绝"
                    >
                      <X className="size-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Screenshot preview modal */}
      <AnimatePresence>
        {previewScreenshot && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70"
            onClick={() => setPreviewScreenshot(null)}
          >
            <div className="relative max-h-[90vh] max-w-[90vw]" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setPreviewScreenshot(null)}
                className="absolute -top-10 right-0 flex size-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
              >
                <X className="size-4" />
              </button>
              <img
                src={previewScreenshot}
                alt="支付截图"
                className="max-h-[85vh] max-w-[85vw] rounded-xl object-contain"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ===================== Pricing =====================
function PricingModule() {
  const { pricing, updatePricing } = useAdmin();
  const [editing, setEditing] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const PRICING_ITEMS: { key: keyof typeof pricing; label: string }[] = [
    { key: "bazi", label: "八字精批" },
    { key: "naming", label: "宝宝起名" },
    { key: "palm", label: "手相图解" },
    { key: "blessing_month", label: "祈福灯 · 一月" },
    { key: "blessing_100days", label: "祈福灯 · 百日" },
    { key: "blessing_year", label: "祈福灯 · 一年" },
    { key: "blessing_forever", label: "祈福灯 · 永久" },
  ];

  const startEdit = (key: string, current: string) => {
    setEditing(key);
    setEditValue(current.replace("¥", ""));
  };

  const saveEdit = (key: string) => {
    const val = parseFloat(editValue);
    if (isNaN(val) || val <= 0) return;
    updatePricing(key as keyof typeof pricing, `¥${val}`);
    setEditing(null);
  };

  return (
    <div className="space-y-5">
      <h2 className="font-display text-xl text-gold">商品定价</h2>
      <p className="text-xs text-paper-dark/50">修改后即时生效，刷新页面仍保持。</p>

      <div className="rounded-xl border border-gold/15 bg-xuan-surface/40 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gold/10 text-paper-dark/40 text-xs">
              <th className="text-left py-3 px-4 font-medium">服务项目</th>
              <th className="text-left py-3 px-4 font-medium">当前价格</th>
              <th className="text-right py-3 px-4 font-medium">操作</th>
            </tr>
          </thead>
          <tbody>
            {PRICING_ITEMS.map((item) => (
              <tr key={item.key} className="border-b border-gold/5">
                <td className="py-3 px-4 text-paper-dark">{item.label}</td>
                <td className="py-3 px-4">
                  {editing === item.key ? (
                    <div className="flex items-center gap-1">
                      <span className="text-gold">¥</span>
                      <input
                        type="number"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-20 rounded-lg border border-gold/30 bg-xuan px-2 py-1 text-sm text-gold focus:border-gold focus:outline-none"
                        autoFocus
                        onKeyDown={(e) => e.key === "Enter" && saveEdit(item.key)}
                      />
                    </div>
                  ) : (
                    <span className="text-gold font-medium">{pricing[item.key]}</span>
                  )}
                </td>
                <td className="py-3 px-4 text-right">
                  {editing === item.key ? (
                    <button
                      onClick={() => saveEdit(item.key)}
                      className="inline-flex items-center gap-1 rounded-lg bg-emerald/10 text-emerald px-3 py-1.5 text-xs hover:bg-emerald/20"
                    >
                      <Check className="size-3" /> 保存
                    </button>
                  ) : (
                    <button
                      onClick={() => startEdit(item.key, pricing[item.key])}
                      className="inline-flex items-center gap-1 rounded-lg bg-gold/10 text-gold px-3 py-1.5 text-xs hover:bg-gold/20"
                    >
                      <Edit3 className="size-3" /> 编辑
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ===================== QR Codes =====================
function QRCodesModule() {
  const { qrCodes, updateQRCode, resetQRCode } = useAdmin();
  const [uploading, setUploading] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (type: "wechat" | "alipay") => {
    const input = fileRef.current;
    if (!input) return;
    setUploading(type);
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) { setUploading(null); return; }
      if (file.size > 500 * 1024) {
        alert("图片不能超过 500KB，请压缩后重试");
        setUploading(null);
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        updateQRCode(type, reader.result as string);
        setUploading(null);
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  const QREntry = ({ type, label, path }: { type: "wechat" | "alipay"; label: string; path: string }) => {
    const hasCustom = !!qrCodes[type];
    const src = hasCustom ? qrCodes[type] : path;

    return (
      <div className="rounded-xl border border-gold/15 bg-xuan-surface/40 p-4">
        <h3 className="text-sm font-medium text-gold mb-3">{label}</h3>
        <div className="flex items-start gap-4">
          <div className="w-32 h-32 rounded-xl border border-gold/20 bg-white flex items-center justify-center overflow-hidden">
            {src ? (
              <img src={src} alt={label} className="max-w-full max-h-full object-contain" />
            ) : (
              <span className="text-xs text-paper-dark/30">未设置</span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => handleFile(type)}
              disabled={uploading === type}
              className="inline-flex items-center gap-1.5 rounded-lg bg-gold/10 text-gold px-3 py-2 text-xs hover:bg-gold/20 disabled:opacity-50"
            >
              <Upload className="size-3" />
              {uploading === type ? "上传中..." : "更换图片"}
            </button>
            {hasCustom && (
              <button
                onClick={() => resetQRCode(type)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-xuan/60 text-paper-dark/50 px-3 py-2 text-xs hover:text-vermillion"
              >
                <RotateCcw className="size-3" />
                恢复默认
              </button>
            )}
            <p className="text-xs text-paper-dark/40 mt-1">
              {hasCustom ? "已自定义" : "使用默认收款码"}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-5">
      <h2 className="font-display text-xl text-gold">收款码管理</h2>
      <p className="text-xs text-paper-dark/50">
        上传后即时生效。清空则恢复使用 /public/ 下的默认文件。
      </p>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" />
      <QREntry type="wechat" label="微信支付" path="/微信收款码.png" />
      <QREntry type="alipay" label="支付宝" path="/支付宝收款码.png" />
    </div>
  );
}

// ===================== Music =====================
function MusicModule() {
  const { meditationTracks, updateTrack, deleteTrack, addTrack } = useAdmin();
  const [editing, setEditing] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<import("@/lib/AdminContext").Track>>({});
  const [adding, setAdding] = useState(false);
  const [newTrack, setNewTrack] = useState({
    name: "",
    icon: "🎵",
    category: "自然",
    description: "",
    source: "",
    duration: 600,
  });

  const startEdit = (track: import("@/lib/AdminContext").Track) => {
    setEditing(track.id);
    setEditData({ ...track });
  };

  const saveEdit = () => {
    if (editing && editData.name) {
      updateTrack(editing, editData);
    }
    setEditing(null);
  };

  const handleAdd = () => {
    if (!newTrack.name.trim()) return;
    addTrack({
      id: `custom_${Date.now()}`,
      name: newTrack.name,
      icon: newTrack.icon,
      category: newTrack.category,
      description: newTrack.description,
      source: newTrack.source,
      duration: newTrack.duration,
      url: "",
    });
    setNewTrack({ name: "", icon: "🎵", category: "自然", description: "", source: "", duration: 600 });
    setAdding(false);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl text-gold">禅修音乐</h2>
          <p className="text-xs text-paper-dark/50 mt-1">共 {meditationTracks.length} 首曲目</p>
        </div>
        <button
          onClick={() => setAdding(true)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-gold/10 text-gold px-3 py-2 text-xs hover:bg-gold/20"
        >
          <Plus className="size-3" /> 新增曲目
        </button>
      </div>

      {/* Add new track form */}
      <AnimatePresence>
        {adding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="rounded-xl border border-emerald/30 bg-emerald/5 p-4 space-y-3">
              <h3 className="text-sm font-medium text-emerald">新增曲目</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-paper-dark/50">曲名</label>
                  <input
                    type="text"
                    value={newTrack.name}
                    onChange={(e) => setNewTrack((p) => ({ ...p, name: e.target.value }))}
                    className="w-full rounded-lg border border-gold/20 bg-xuan/80 px-3 py-2 text-sm text-paper focus:border-gold/50 focus:outline-none mt-1"
                    placeholder="曲名"
                  />
                </div>
                <div>
                  <label className="text-xs text-paper-dark/50">图标 emoji</label>
                  <input
                    type="text"
                    value={newTrack.icon}
                    onChange={(e) => setNewTrack((p) => ({ ...p, icon: e.target.value }))}
                    className="w-full rounded-lg border border-gold/20 bg-xuan/80 px-3 py-2 text-sm focus:border-gold/50 focus:outline-none mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs text-paper-dark/50">分类</label>
                  <input
                    type="text"
                    value={newTrack.category}
                    onChange={(e) => setNewTrack((p) => ({ ...p, category: e.target.value }))}
                    className="w-full rounded-lg border border-gold/20 bg-xuan/80 px-3 py-2 text-sm focus:border-gold/50 focus:outline-none mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs text-paper-dark/50">时长（秒）</label>
                  <input
                    type="number"
                    value={newTrack.duration}
                    onChange={(e) => setNewTrack((p) => ({ ...p, duration: parseInt(e.target.value) || 0 }))}
                    className="w-full rounded-lg border border-gold/20 bg-xuan/80 px-3 py-2 text-sm focus:border-gold/50 focus:outline-none mt-1"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-paper-dark/50">描述</label>
                  <input
                    type="text"
                    value={newTrack.description}
                    onChange={(e) => setNewTrack((p) => ({ ...p, description: e.target.value }))}
                    className="w-full rounded-lg border border-gold/20 bg-xuan/80 px-3 py-2 text-sm focus:border-gold/50 focus:outline-none mt-1"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-paper-dark/50">出处</label>
                  <input
                    type="text"
                    value={newTrack.source}
                    onChange={(e) => setNewTrack((p) => ({ ...p, source: e.target.value }))}
                    className="w-full rounded-lg border border-gold/20 bg-xuan/80 px-3 py-2 text-sm focus:border-gold/50 focus:outline-none mt-1"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleAdd}
                  className="rounded-lg bg-emerald/10 text-emerald px-4 py-2 text-xs hover:bg-emerald/20"
                >
                  确认添加
                </button>
                <button
                  onClick={() => setAdding(false)}
                  className="rounded-lg bg-xuan/60 text-paper-dark/50 px-4 py-2 text-xs hover:text-paper-dark"
                >
                  取消
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Track list */}
      <div className="space-y-2">
        {meditationTracks.map((track) => (
          <div
            key={track.id}
            className="rounded-xl border border-gold/15 bg-xuan-surface/40 p-4"
          >
            {editing === track.id ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-paper-dark/50">曲名</label>
                    <input
                      type="text"
                      value={editData.name || ""}
                      onChange={(e) => setEditData((p) => ({ ...p, name: e.target.value }))}
                      className="w-full rounded-lg border border-gold/20 bg-xuan/80 px-3 py-2 text-sm text-paper focus:border-gold focus:outline-none mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-paper-dark/50">图标</label>
                    <input
                      type="text"
                      value={editData.icon || ""}
                      onChange={(e) => setEditData((p) => ({ ...p, icon: e.target.value }))}
                      className="w-full rounded-lg border border-gold/20 bg-xuan/80 px-3 py-2 text-sm focus:border-gold focus:outline-none mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-paper-dark/50">分类</label>
                    <input
                      type="text"
                      value={editData.category || ""}
                      onChange={(e) => setEditData((p) => ({ ...p, category: e.target.value }))}
                      className="w-full rounded-lg border border-gold/20 bg-xuan/80 px-3 py-2 text-sm focus:border-gold focus:outline-none mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-paper-dark/50">时长（秒）</label>
                    <input
                      type="number"
                      value={editData.duration || 0}
                      onChange={(e) => setEditData((p) => ({ ...p, duration: parseInt(e.target.value) || 0 }))}
                      className="w-full rounded-lg border border-gold/20 bg-xuan/80 px-3 py-2 text-sm focus:border-gold focus:outline-none mt-1"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs text-paper-dark/50">描述</label>
                    <input
                      type="text"
                      value={editData.description || ""}
                      onChange={(e) => setEditData((p) => ({ ...p, description: e.target.value }))}
                      className="w-full rounded-lg border border-gold/20 bg-xuan/80 px-3 py-2 text-sm focus:border-gold focus:outline-none mt-1"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs text-paper-dark/50">出处</label>
                    <input
                      type="text"
                      value={editData.source || ""}
                      onChange={(e) => setEditData((p) => ({ ...p, source: e.target.value }))}
                      className="w-full rounded-lg border border-gold/20 bg-xuan/80 px-3 py-2 text-sm focus:border-gold focus:outline-none mt-1"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={saveEdit} className="rounded-lg bg-emerald/10 text-emerald px-4 py-2 text-xs hover:bg-emerald/20">
                    保存
                  </button>
                  <button onClick={() => setEditing(null)} className="rounded-lg bg-xuan/60 text-paper-dark/50 px-4 py-2 text-xs hover:text-paper-dark">
                    取消
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <span className="text-2xl shrink-0">{track.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gold">{track.name}</p>
                  <p className="text-sm text-paper-dark/60 truncate">{track.description}</p>
                  <p className="text-xs text-paper-dark/40">
                    {track.category} · {Math.floor(track.duration / 60)}:{String(track.duration % 60).padStart(2, "0")} · {track.source}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => startEdit(track)}
                    className="size-7 flex items-center justify-center rounded text-paper-dark/40 hover:text-gold"
                  >
                    <Edit3 className="size-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`确定删除「${track.name}」？`)) deleteTrack(track.id);
                    }}
                    className="size-7 flex items-center justify-center rounded text-paper-dark/40 hover:text-vermillion"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ===================== Config =====================
function ConfigModule() {
  const { systemConfig, updateSystemConfig } = useAdmin();
  const [newPhone, setNewPhone] = useState("");

  const addAdminPhone = () => {
    const phone = newPhone.trim();
    if (!phone || !/^1\d{10}$/.test(phone)) return;
    if (systemConfig.adminPhones.includes(phone)) return;
    updateSystemConfig({
      adminPhones: [...systemConfig.adminPhones, phone],
    });
    setNewPhone("");
  };

  const removeAdminPhone = (phone: string) => {
    if (systemConfig.adminPhones.length <= 1) {
      alert("至少保留一个管理员手机号");
      return;
    }
    updateSystemConfig({
      adminPhones: systemConfig.adminPhones.filter((p) => p !== phone),
    });
  };

  return (
    <div className="space-y-5 max-w-2xl">
      <h2 className="font-display text-xl text-gold">系统配置</h2>

      {/* Site name */}
      <div className="rounded-xl border border-gold/15 bg-xuan-surface/40 p-4">
        <label className="text-xs text-paper-dark/60">站点名称</label>
        <input
          type="text"
          value={systemConfig.siteName}
          onChange={(e) => updateSystemConfig({ siteName: e.target.value })}
          className="w-full rounded-lg border border-gold/20 bg-xuan/80 px-3 py-2.5 text-sm text-paper focus:border-gold/50 focus:outline-none mt-1"
        />
      </div>

      {/* Site description */}
      <div className="rounded-xl border border-gold/15 bg-xuan-surface/40 p-4">
        <label className="text-xs text-paper-dark/60">站点描述</label>
        <input
          type="text"
          value={systemConfig.siteDescription}
          onChange={(e) => updateSystemConfig({ siteDescription: e.target.value })}
          className="w-full rounded-lg border border-gold/20 bg-xuan/80 px-3 py-2.5 text-sm text-paper focus:border-gold/50 focus:outline-none mt-1"
        />
      </div>

      {/* Admin phones */}
      <div className="rounded-xl border border-gold/15 bg-xuan-surface/40 p-4">
        <label className="text-xs text-paper-dark/60">管理员手机号</label>
        <p className="text-xs text-paper-dark/40 mt-0.5 mb-3">
          拥有后台管理权限的手机号列表
        </p>
        <div className="space-y-2 mb-3">
          {systemConfig.adminPhones.map((phone) => (
            <div
              key={phone}
              className="flex items-center justify-between rounded-lg bg-xuan/60 px-3 py-2"
            >
              <span className="text-sm text-paper-dark">{phone}</span>
              <button
                onClick={() => removeAdminPhone(phone)}
                className="text-paper-dark/30 hover:text-vermillion text-xs"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="tel"
            value={newPhone}
            onChange={(e) => setNewPhone(e.target.value)}
            placeholder="输入手机号添加"
            maxLength={11}
            className="flex-1 rounded-lg border border-gold/20 bg-xuan/80 px-3 py-2.5 text-sm text-paper placeholder:text-paper-dark/30 focus:border-gold/50 focus:outline-none"
            onKeyDown={(e) => e.key === "Enter" && addAdminPhone()}
          />
          <button
            onClick={addAdminPhone}
            className="rounded-lg bg-gold/10 text-gold px-4 py-2.5 text-sm hover:bg-gold/20"
          >
            <Plus className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
