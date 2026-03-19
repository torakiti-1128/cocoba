"use client";

import React, { useState } from "react";
import { Dog, Package, AlertTriangle, Eye, Image as ImageIcon, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const MOCK_LOGS = [
  { id: 1, type: 'POOP', title: 'ココちゃん 排泄検知', time: '14:20:05', date: '2026/03/19', hasImage: true },
  { id: 2, type: 'SHOOT', title: 'おやつ投下 (自動)', time: '14:20:10', date: '2026/03/19', hasImage: false },
  { id: 3, type: 'DOME', title: 'シールド展開完了', time: '14:21:30', date: '2026/03/19', hasImage: true },
  { id: 4, type: 'ERROR', title: '誘導失敗: タイムアウト', time: '10:05:00', date: '2026/03/19', hasImage: false },
];

export default function Log() {
  const [filter, setFilter] = useState('ALL');

  return (
    <div className="flex flex-col gap-6 pb-12">
      <header>
        <h2 className="text-xl font-bold">アクティビティログ</h2>
        <p className="text-xs text-slate-500 font-medium font-bold">システムの全稼働履歴を確認できます</p>
      </header>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <FilterTab active={filter === 'ALL'} label="すべて" onClick={() => setFilter('ALL')} />
        <FilterTab active={filter === 'POOP'} label="💩 排泄" onClick={() => setFilter('POOP')} />
        <FilterTab active={filter === 'SHOOT'} label="🍬 おやつ" onClick={() => setFilter('SHOOT')} />
        <FilterTab active={filter === 'ERROR'} label="⚠️ 異常" onClick={() => setFilter('ERROR')} />
      </div>

      {/* Log List */}
      <div className="flex flex-col gap-3">
        {MOCK_LOGS.map((log) => (
          <motion.div 
            key={log.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-sm active:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <LogIcon type={log.type} />
              <div>
                <p className="font-bold text-sm text-slate-800">{log.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] text-slate-400 font-bold">{log.date}</span>
                  <span className="text-[10px] text-blue-600 font-black">{log.time}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {log.hasImage && (
                <div className="bg-blue-50 p-2 rounded-xl">
                  <ImageIcon className="w-4 h-4 text-blue-600" />
                </div>
              )}
              <ChevronRight className="w-5 h-5 text-slate-300" />
            </div>
          </motion.div>
        ))}
      </div>
      
      <button className="text-sm font-bold text-slate-400 py-4 hover:text-slate-600 transition-colors">
        さらに読み込む
      </button>
    </div>
  );
}

function FilterTab({ active, label, onClick }: { active: boolean, label: string, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
        active ? "bg-slate-900 text-white shadow-md shadow-slate-200" : "bg-white border border-slate-100 text-slate-500"
      }`}
    >
      {label}
    </button>
  );
}

function LogIcon({ type }: { type: string }) {
  switch (type) {
    case 'POOP':
      return <div className="bg-orange-100 p-2.5 rounded-xl text-orange-600"><Dog className="w-5 h-5" /></div>;
    case 'SHOOT':
      return <div className="bg-blue-100 p-2.5 rounded-xl text-blue-600"><Package className="w-5 h-5" /></div>;
    case 'ERROR':
      return <div className="bg-red-100 p-2.5 rounded-xl text-red-600"><AlertTriangle className="w-5 h-5" /></div>;
    default:
      return <div className="bg-slate-100 p-2.5 rounded-xl text-slate-600"><Eye className="w-5 h-5" /></div>;
  }
}
