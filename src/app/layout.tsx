import type { Metadata, Viewport } from "next";
import { ClientLayout } from "@/components/ClientLayout";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#1E1812",
};

export const metadata: Metadata = {
  title: "如愿居 · 为家人祈福求灵签",
  description: "心诚则灵。为家人点一盏祈福灯，求一支灵签，看一卦命理八字。一念慈悲，如愿以偿。",
  applicationName: "如愿居",
  authors: [{ name: "如愿居" }],
  keywords: ["如愿居", "祈福", "求签", "灵签", "八字精批", "周公解梦", "求灵签", "看手相", "命理", "黄历", "禅坐"],
  formatDetection: { telephone: false, email: false, address: false },
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "如愿居" },
  other: {
    "x5-fullscreen": "true",
    "x5-page-mode": "app",
  },
  openGraph: {
    title: "如愿居 · 为家人祈福求灵签",
    description: "心诚则灵。为家人点一盏祈福灯，求一支灵签，看一卦命理八字。一念慈悲，如愿以偿。",
    siteName: "如愿居",
    images: [{ url: "/share-cover.svg", width: 1200, height: 630, alt: "如愿居 · 为家人祈福" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "如愿居 · 为家人祈福求灵签",
    description: "心诚则灵。为家人点一盏祈福灯，求一支灵签，看一卦命理八字。一念慈悲，如愿以偿。",
    images: ["/share-cover.svg"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "16x16" },
      { url: "/favicon.svg" },
    ],
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-xuan text-paper">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
