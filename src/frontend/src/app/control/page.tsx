"use client";

import React, { useState } from "react";
import { useCocobaStore } from "@/store/useCocobaStore";
import { 
  Candy, Shield, Home, RefreshCw, StopCircle, 
  AlertOctagon, EyeOff, Brain
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Control() {
  const [activeAction, setActiveAction] = useState<string | null>(null);

  const handleAction = (action: string) => {
    setActiveAction(action);
    console.log(`Manual Command: ${action}`);
    setTimeout(() => setActiveAction(null), 1500);
  };

  return (
    <div className="flex flex-col gap-8 pb-20">
      <header>
        <h2 className="text-xl font-bold tracking-tight">手動コマンドセンター</h2>
        <p className="text-xs text-slate-500 font-medium">各システムへ即時命令を送信します</p>
      </header>

      {/* 1. Main Actions (Big Tiles) */}
      <section className="grid grid-cols-3 gap-3">
        <MainCommandButton 
          icon={<Candy className="w-7 h-7" />} 
          label="おやつ投下" 
          color="bg-orange-500" 
          onClick={() => handleAction("shoot")}
        />
        <MainCommandButton 
          icon={<Shield className="w-7 h-7" />} 
          label="シールド投下" 
          color="bg-blue-600" 
          onClick={() => handleAction("deploy")}
        />
        <MainCommandButton 
          icon={<Home className="w-7 h-7" />} 
          label="ドックへ帰還" 
          color="bg-slate-800" 
          onClick={() => handleAction("dock")}
        />
      </section>

      {/* 2. Module Stop Controls (Danger Zone) */}
      <section>
        <h3 className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em] mb-4 ml-1 flex items-center gap-2">
          <AlertOctagon className="w-3 h-3" />
          個別停止
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <StopButton 
            icon={<StopCircle className="w-4 h-4" />} 
            label="全システム停止" 
            onClick={() => handleAction("kill")} 
          />
          <StopButton icon={<BotIcon />} label="ルンバ停止" onClick={() => handleAction("stop_robot")} />
          <StopButton icon={<Shield className="w-4 h-4" />} label="シールド停止" onClick={() => handleAction("stop_shield")} />
          <StopButton icon={<Candy className="w-4 h-4" />} label="シューター停止" onClick={() => handleAction("stop_shooter")} />
          <StopButton icon={<Brain className="w-4 h-4" />} label="AI推論停止" onClick={() => handleAction("stop_inference")} />
          <StopButton icon={<EyeOff className="w-4 h-4" />} label="カメラ停止" onClick={() => handleAction("stop_camera")} />
        </div>
      </section>

      {/* Action Overlay */}
      <AnimatePresence>
        {activeAction && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-x-6 bottom-24 bg-slate-900/95 backdrop-blur-md text-white p-4 rounded-2xl flex items-center justify-between shadow-2xl z-50 border border-slate-700"
          >
            <div className="flex items-center gap-3">
              <RefreshCw className="w-5 h-5 animate-spin text-blue-400" />
              <span className="font-bold text-sm tracking-wide">SENDING: {activeAction.toUpperCase()}</span>
            </div>
            <div className="px-2 py-1 bg-blue-500/20 rounded text-[9px] font-black text-blue-400">EXECUTING...</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MainCommandButton({ icon, label, color, onClick }: { icon: any, label: string, color: string, onClick: () => void }) {
  return (
    <motion.button 
      whileTap={{ scale: 0.95 }}
      className={`${color} text-white p-4 rounded-[2.5rem] flex flex-col items-center justify-center gap-2 shadow-lg shadow-slate-200 aspect-square`}
      onClick={onClick}
    >
      {icon}
      <span className="text-[10px] font-black leading-tight text-center">{label}</span>
    </motion.button>
  );
}

function StopButton({ icon, label, onClick, className, iconBg = "bg-red-50 text-red-600", labelColor = "text-slate-700" }: { icon: any, label: string, onClick: () => void, className?: string, iconBg?: string, labelColor?: string }) {
  return (
    <motion.button 
      whileTap={{ scale: 0.98 }}
      className={`bg-white border-2 border-red-50 hover:border-red-100 p-4 rounded-2xl flex items-center gap-3 shadow-sm ${className}`}
      onClick={onClick}
    >
      <div className={`${iconBg} p-2 rounded-xl`}>
        {icon}
      </div>
      <span className={`font-bold text-xs ${labelColor}`}>{label}</span>
    </motion.button>
  );
}

function BotIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/>
    </svg>
  );
}
