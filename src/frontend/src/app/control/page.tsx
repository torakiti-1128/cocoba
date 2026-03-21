"use client";

import React, { useState } from "react";
import { useCocobaStore } from "@/store/useCocobaStore";
import { 
  Candy, Shield, Home, RefreshCw, StopCircle, 
  AlertOctagon, EyeOff, Brain, Footprints, Bone
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Control() {
  const { systemState } = useCocobaStore();
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState("3秒前");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleAction = (action: string) => {
    setActiveAction(action);
    console.log(`Manual Command: ${action}`);
    setTimeout(() => setActiveAction(null), 1500);
  };

  const refreshImage = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastUpdate("たった今");
    }, 1000);
  };

  return (
    <div className="flex flex-col gap-8 pb-24">
      <header>
        <h2 className="text-xl font-bold tracking-tight">手動コマンドセンター</h2>
        <p className="text-xs text-slate-500 font-medium">各システムへ即時命令を送信します</p>
      </header>

      {/* 1. Decision Support Area (New) */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between ml-1">
          <h3 className="text-[10px] font-black text-[#A0522D] uppercase tracking-[0.2em] flex items-center gap-2">
            <Footprints className="w-3 h-3 text-orange-500" />
            あんしん判断サポート
          </h3>
          <span className="text-[10px] text-slate-400 font-medium">更新: {lastUpdate}</span>
        </div>

        {/* Distance Alert Banner */}
        <div className="bg-orange-50 border border-orange-100 rounded-[2rem] p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            <span className="text-xs font-bold text-[#8B4513]">ココちゃんとの距離: <span className="text-sm font-black underline">0.8m</span></span>
          </div>
          <span className="bg-[#D32F2F] text-white text-[8px] font-black px-2 py-1 rounded-full shadow-sm">近いよ！</span>
        </div>

        {/* Snapshot with Dual Tracking */}
        <div className="relative aspect-video bg-slate-200 rounded-2xl overflow-hidden shadow-inner">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-300 to-slate-400 flex items-center justify-center opacity-20">
             <div className="grid grid-cols-6 grid-rows-6 gap-2 w-full h-full p-2">
                {[...Array(36)].map((_, i) => <div key={i} className="border border-white" />)}
             </div>
          </div>
          
          {/* Tracking: Coco-chan */}
          <div className="absolute border-2 border-green-500 rounded-lg p-1 bg-green-500/10" style={{ width: '70px', height: '90px', left: '140px', top: '60px' }}>
            <span className="absolute -top-6 left-0 bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded font-bold">ココちゃん</span>
          </div>

          {/* Tracking: Robot */}
          <div className="absolute border-2 border-blue-500 rounded-lg p-1 bg-blue-500/10" style={{ width: '100px', height: '60px', left: '60px', top: '100px' }}>
            <span className="absolute -top-6 left-0 bg-blue-500 text-white text-[10px] px-1.5 py-0.5 rounded font-bold">ルンバ</span>
          </div>

          {isRefreshing && <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] flex items-center justify-center"><RefreshCw className="w-8 h-8 text-blue-600 animate-spin" /></div>}
        </div>

        <button onClick={refreshImage} disabled={isRefreshing} className="w-full bg-white border border-slate-200 text-slate-700 font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-sm text-sm active:bg-slate-50 transition-colors">
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} /> 最新の状況に更新
        </button>
      </section>

      {/* 2. Module Stop Controls (Danger Zone) */}
      <section>
        <h3 className="text-[10px] font-black text-[#D32F2F] uppercase tracking-[0.2em] mb-4 ml-1 flex items-center gap-2">
          <Bone className="w-3 h-3" />
          モジュール個別停止
        </h3>
        <div className="grid grid-cols-1 gap-3">
          <StopButton icon={<BotIcon />} label="ルンバを止める" onClick={() => handleAction("stop_robot")} />
          <StopButton icon={<Shield className="w-4 h-4" />} label="シールドを止める" onClick={() => handleAction("stop_shield")} />
          <StopButton icon={<Candy className="w-4 h-4" />} label="シューターを止める" onClick={() => handleAction("stop_shooter")} />
          <StopButton icon={<Brain className="w-4 h-4" />} label="AI推論を止める" onClick={() => handleAction("stop_inference")} />
          <StopButton icon={<EyeOff className="w-4 h-4" />} label="カメラを止める" onClick={() => handleAction("stop_camera")} />
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

function StopButton({ icon, label, onClick, className, iconBg = "bg-orange-50 text-orange-600", labelColor = "text-[#5D4037]" }: { icon: any, label: string, onClick: () => void, className?: string, iconBg?: string, labelColor?: string }) {
  return (
    <motion.button 
      whileTap={{ scale: 0.98 }}
      className={`bg-white border border-orange-100 p-4 rounded-[1.5rem] flex items-center gap-3 shadow-sm ${className}`}
      onClick={onClick}
    >
      <div className={`${iconBg} p-2.5 rounded-xl`}>
        {icon}
      </div>
      <span className={`font-black text-xs ${labelColor}`}>{label}</span>
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
