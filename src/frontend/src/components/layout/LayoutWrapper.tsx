"use client";

import React from "react";
import { useCocobaStore } from "@/store/useCocobaStore";
import { AlertCircle, Home, Gamepad2, ClipboardList, Settings, User, BarChart3, Footprints, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const { isOnline, systemState, killSwitch } = useCocobaStore();
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#FAF9F6] border-b border-orange-100 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-[#8B4513] p-1.5 rounded-xl shadow-sm">
            <Footprints className="w-5 h-5 text-[#FFDAB9]" />
          </div>
          <h1 className="font-black text-2xl tracking-tighter text-[#5D4037]">Cocoba</h1>
        </div>

        <button 
          onClick={() => confirm("ログアウトしますか？")}
          className="p-2 bg-orange-50 hover:bg-orange-100 text-[#8B4513] rounded-xl transition-colors shadow-sm"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </header>

      {/* Kill Switch (Global Safety - Only shown in Control Tab) */}
      {pathname === "/control" && (
        <div className="sticky top-[57px] z-40 bg-[#FAF9F6] px-4 py-3 border-b border-orange-100 shadow-sm">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (confirm("全システムを緊急停止しますか？")) {
                killSwitch();
              }
            }}
            className="w-full bg-[#D32F2F] hover:bg-red-700 text-white font-black py-4 rounded-[2rem] flex items-center justify-center gap-3 shadow-lg shadow-red-100 transition-colors border-2 border-white"
          >
              <AlertCircle className="w-5 h-5 text-red-100" />
              システムを緊急停止
          </motion.button>
        </div>
      )}


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
    <Link href={href} className="flex flex-col items-center justify-center gap-0 w-1/5 h-full relative group">
      <div className={`p-1 rounded-xl transition-all duration-300 ${
        active ? "text-[#8B4513]" : "text-slate-400 group-hover:text-slate-600"
      }`}>
        {React.cloneElement(icon as React.ReactElement<{ size?: number; strokeWidth?: number }>, { size: 22, strokeWidth: active ? 2.5 : 2 })}
      </div>
      <span className={`text-[9px] font-black transition-all duration-300 -mt-1 ${
        active ? "text-[#8B4513]" : "text-slate-400 group-hover:text-slate-600"
      }`}>
        {label}
      </span>
      {active && (
        <motion.div 
          layoutId="activeTab"
          className="absolute -top-[1px] left-0 right-0 h-[4px] bg-[#8B4513] rounded-full mx-4"
        />
      )}
    </Link>
  );
}

