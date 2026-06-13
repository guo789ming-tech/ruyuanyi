"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserProvider } from "@/lib/UserContext";
import { AdminProvider } from "@/lib/AdminContext";
import { BottomNav } from "@/components/BottomNav";
import { AuthModal } from "@/components/AuthModal";
import { BodhiLeaf } from "@/components/BodhiLogo";

function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <header
      className={`fixed top-0 z-50 h-14 w-full transition-all duration-base safe-top ${
        isHome ? "bg-transparent" : "bg-xuan-card/95 backdrop-blur-md border-b border-gold/10"
      }`}
    >
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <BodhiLeaf className="size-7 drop-shadow-[0_0_8px_rgba(212,168,83,0.3)]" />
          <span className="font-display text-lg text-gold tracking-wider">如愿居</span>
        </Link>
        <nav className="hidden items-center gap-5 md:flex">
          <Link href="/blessing" className="text-sm text-paper-dark/70 hover:text-gold transition-colors">祈福</Link>
          <Link href="/almanac" className="text-sm text-paper-dark/70 hover:text-gold transition-colors">黄历</Link>
          <Link href="/fortune" className="text-sm text-paper-dark/70 hover:text-gold transition-colors">灵签</Link>
          <Link href="/bazi" className="text-sm text-paper-dark/70 hover:text-gold transition-colors">八字</Link>
          <Link href="/dream" className="text-sm text-paper-dark/70 hover:text-gold transition-colors">解梦</Link>
          <Link href="/me" className="text-sm text-paper-dark/70 hover:text-gold transition-colors">我的</Link>
        </nav>
      </div>
    </header>
  );
}

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <AdminProvider>
      {/* Background layers */}
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-[#1E1812] via-[#282018] to-[#1E1812]" />
      <div
        className="fixed inset-0 z-0 bg-center bg-no-repeat opacity-[0.15]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4A853' fill-opacity='0.06'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: "60px 60px",
        }}
      />
      <div className="pointer-events-none fixed inset-x-0 top-0 z-0 h-32 bg-gradient-to-b from-gold/10 to-transparent" />

      <Header />

      {/* Main content */}
      <main className="relative z-10 mx-auto min-h-[calc(100vh-3.5rem)] w-full pt-14 pb-24 md:pb-8">
        {children}
      </main>

      <BottomNav />
      <AuthModal />
      </AdminProvider>
    </UserProvider>
  );
}
