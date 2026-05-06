import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "상상우리 — 시니어 일자리 매칭",
  description: "시니어와 일자리를 자동으로 연결하는 매칭 시스템",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${geist.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-gray-50">
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-blue-700 tracking-tight">
              상상우리
            </Link>
            <nav className="flex gap-6">
              <Link
                href="/register"
                className="text-lg font-medium text-gray-700 hover:text-blue-700 transition-colors"
              >
                프로필 등록
              </Link>
              <Link
                href="/recommendations"
                className="text-lg font-medium text-gray-700 hover:text-blue-700 transition-colors"
              >
                추천 목록
              </Link>
              <Link
                href="/admin"
                className="text-lg font-medium text-gray-700 hover:text-blue-700 transition-colors"
              >
                담당자 대시보드
              </Link>
            </nav>
          </div>
        </header>
        <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
          {children}
        </main>
        <footer className="bg-white border-t border-gray-200 py-4 text-center text-gray-400 text-sm">
          © 2026 상상우리 — 시니어 일자리 자동 매칭 시스템
        </footer>
      </body>
    </html>
  );
}
