"use client";

import Link from "next/link";
import { BookOpen, Search, MessageSquare, Menu } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 glass">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-sky-500/20 flex items-center justify-center group-hover:bg-sky-500/30 transition-colors">
            <BookOpen className="w-6 h-6 text-sky-400" />
          </div>
          <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-sky-400">
            AuraInsights
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Dashboard</Link>
          <Link href="/chat" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">AI Q&A</Link>
          <button className="px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-900 font-semibold text-sm transition-all hover:shadow-[0_0_20px_rgba(56,189,248,0.4)]">
            Sync Library
          </button>
        </div>

        <button className="md:hidden">
          <Menu className="w-6 h-6" />
        </button>
      </div>
    </nav>
  );
}
