"use client";

import React from "react";
import { useCocobaStore } from "@/store/useCocobaStore";
import { AlertCircle, Home, Gamepad2, ClipboardList, Settings, User, BarChart3 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const { isOnline, systemState, killSwitch } = useCocobaStore();
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="font-black text-2xl tracking-tighter text-[#CD853F]">Cocoba</h1>
        </div>
      </header>

      {/* Kill Switch (Global Safety - Only shown in Control Tab) */}
      <AnimatePresence>
        {pathname === "/control" && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="sticky top-[57px] z-40 bg-white px-4 py-2 border-b border-slate-200 shadow-sm overflow-hidden"
          >
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (confirm("全システムを緊急停止しますか？")) {
                  killSwitch();
                }
              }}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-3 shadow-lg shadow-red-200 transition-colors"
            >
                ルンバを緊急停止
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Offline Alert Overlay */}
      <AnimatePresence>
        {!isOnline && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-6 text-center"
          >
            <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-sm">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-10 h-10 text-red-600" />
              </div>
              <h2 className="text-xl font-bold mb-2">通信切断</h2>
              <p className="text-slate-600 mb-6 text-sm">
                現在エッジPCとの通信が途絶えています。<br />リアルタイム操作は利用できません。
              </p>
              <button 
                onClick={() => window.location.reload()}
                className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl"
              >
                再読み込み
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 max-w-md mx-auto w-full px-4 pt-6">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 safe-area-bottom shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
        <div className="flex justify-around items-center max-w-md mx-auto h-24 pb-8 px-2">
          <NavItem href="/" icon={<Home />} label="ホーム" active={pathname === "/"} />
          <NavItem href="/control" icon={<Gamepad2 />} label="操作" active={pathname === "/control"} />
          <NavItem href="/log" icon={<ClipboardList />} label="ログ" active={pathname === "/log"} />
          <NavItem href="/manage" icon={<BarChart3 />} label="管理" active={pathname === "/manage"} />
          <NavItem href="/settings" icon={<Settings />} label="設定" active={pathname === "/settings"} />
        </div>
      </nav>
    </div>
  );
}

function NavItem({ href, icon, label, active }: { href: string, icon: React.ReactElement, label: string, active: boolean }) {
  return (
    <Link href={href} className="flex flex-col items-center justify-center gap-0 w-1/4 h-full relative group">
      <div className={`p-1 rounded-xl transition-all duration-300 ${
        active ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"
      }`}>
        {React.cloneElement(icon as React.ReactElement<{ size?: number; strokeWidth?: number }>, { size: 22, strokeWidth: active ? 2.5 : 2 })}
      </div>
      <span className={`text-[9px] font-black transition-all duration-300 -mt-1 ${
        active ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"
      }`}>
        {label}
      </span>
      {active && (
        <motion.div 
          layoutId="activeTab"
          className="absolute -top-[1px] left-0 right-0 h-[3px] bg-blue-600 rounded-full mx-6"
        />
      )}
    </Link>
  );
}

