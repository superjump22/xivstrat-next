import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s | XivStrat",
    default: "XivStrat | 最终幻想14中文攻略站",
  },
  description: "从7.2开始的最终幻想14中文攻略站",
  generator: "Next.js",
  applicationName: "XivStrat",
  keywords: [
    "FF14",
    "最终幻想14",
    "FFXIV",
    "攻略",
    "FF14攻略",
    "最终幻想14攻略",
    "FF14攻略站",
    "FF14中文攻略站",
    "FF14机制图解",
    "艾欧泽亚",
    "副本时间轴",
    "时间轴攻略",
    "攻略协作",
    "副本攻略",
    "机制教学",
    "副本站位",
    "XivStrat",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={`antialiased`}>{children}</body>
    </html>
  );
}
