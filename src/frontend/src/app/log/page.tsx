"use client";

import React, { useState } from "react";
import { 
  Dog, Package, AlertTriangle, Eye, Image as ImageIcon, 
  ChevronRight, ShieldAlert, Wrench, Clock, Search, X, 
  CheckCircle2, AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const MOCK_LOGS = [
  { id: 1, type: 'POOP', title: 'ココちゃん 排泄検知', time: '14:20:05', date: '2026/03/19', hasImage: true, detail: 'リビング中央付近で検知しました。' },
  { id: 2, type: 'SHOOT', title: 'おやつ投下 (自動)', time: '14:20:10', date: '2026/03/19', hasImage: false, detail: '誘導のため1回分を排出しました。' },
  { id: 3, type: 'SAFETY', title: '近接警告: 自動停止', time: '14:20:45', date: '2026/03/19', hasImage: true, detail: 'ココちゃんが0.5m以内に接近したため、動作を一時中断しました。' },
  { id: 4, type: 'DOME', title: 'シールド展開完了', time: '14:21:30', date: '2026/03/19', hasImage: true, detail: '排泄物のカバーに成功しました。' },
  { id: 5, type: 'PREDICTION', title: 'ウンチポーズ検知', time: '12:05:00', date: '2026/03/19', hasImage: true, detail: '排泄予兆ポーズを検知しましたが、排泄には至りませんでした。' },
  { id: 6, type: 'SCHEDULE', title: 'システム自動起動', time: '09:00:00', date: '2026/03/19', hasImage: false, detail: '設定スケジュールに基づき、監視を開始しました。' },
  { id: 7, type: 'MAINTENANCE', title: 'AIモデル更新完了', time: '22:15:00', date: '2026/03/18', hasImage: false, detail: '推論エンジンのバージョンを v2.4.0 へアップデートしました。' },
  { id: 8, type: 'ERROR', title: '誘導失敗: タイムアウト', time: '10:05:00', date: '2026/03/18', hasImage: false, detail: 'おやつ誘導後、ココちゃんが安全圏へ移動しなかったため出動をキャンセルしました。' },
];

export default function Log() {
  const [filter, setFilter] = useState('ALL');
  const [selectedLog, setSelectedLog] = useState<any | null>(null);

  const filteredLogs = filter === 'ALL' ? MOCK_LOGS : MOCK_LOGS.filter(log => log.type === filter);

  return (
    <div className="flex flex-col gap-6 pb-24">
      <header>
        <h2 className="text-xl font-bold tracking-tight">アクティビティログ</h2>
        <p className="text-xs text-slate-500 font-medium">システムの稼働履歴と詳細情報を確認できます</p>
      </header>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
        <FilterTab active={filter === 'ALL'} label="すべて" onClick={() => setFilter('ALL')} />
        <FilterTab active={filter === 'POOP'} label="💩 排泄" onClick={() => setFilter('POOP')} />
        <FilterTab active={filter === 'SAFETY'} label="🛡️ 安全" onClick={() => setFilter('SAFETY')} />
        <FilterTab active={filter === 'PREDICTION'} label="⏳ 予兆" onClick={() => setFilter('PREDICTION')} />
        <FilterTab active={filter === 'MAINTENANCE'} label="🛠️ 保守" onClick={() => setFilter('MAINTENANCE')} />
        <FilterTab active={filter === 'ERROR'} label="⚠️ 異常" onClick={() => setFilter('ERROR')} />
      </div>

      {/* Log List */}
      <div className="flex flex-col gap-3">
        {filteredLogs.map((log) => (
          <motion.div 
            key={log.id}
            layoutId={`log-${log.id}`}
            onClick={() => setSelectedLog(log)}
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

      {/* Image & Detail Modal */}
      <AnimatePresence>
        {selectedLog && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedLog(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div 
              layoutId={`log-${selectedLog.id}`}
              className="bg-white w-full max-w-sm rounded-[2.5rem] overflow-hidden shadow-2xl z-10 relative"
            >
              <button 
                onClick={() => setSelectedLog(null)}
                className="absolute top-4 right-4 z-20 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full backdrop-blur-md transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Image (Mock) */}
              {selectedLog.hasImage ? (
                <div className="aspect-video bg-slate-200 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center text-slate-400 flex-col gap-2">
                    <ImageIcon className="w-12 h-12 opacity-20" />
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">検知スナップショット</span>
                  </div>
                  {/* Tracking Overlay Mock */}
                  <div className="absolute border-2 border-green-500 rounded-lg inset-12 opacity-60">
                    <span className="absolute -top-6 left-0 bg-green-500 text-white text-[8px] px-1.5 py-0.5 rounded font-bold uppercase">Target Detected</span>
                  </div>
                </div>
              ) : (
                <div className="h-20 bg-slate-50 flex items-center justify-center">
                  <LogIcon type={selectedLog.type} />
                </div>
              )}

              <div className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{selectedLog.time}</span>
                    <span className="text-[10px] font-bold text-slate-400">{selectedLog.date}</span>
                  </div>
                  <LogBadge type={selectedLog.type} />
                </div>
                
                <h3 className="text-xl font-black text-slate-800 mb-3">{selectedLog.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed font-medium">
                  {selectedLog.detail}
                </p>

                <button 
                  onClick={() => setSelectedLog(null)}
                  className="w-full mt-8 bg-slate-900 text-white font-bold py-4 rounded-2xl shadow-xl shadow-slate-200 active:scale-[0.98] transition-all"
                >
                  閉じる
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
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

function LogBadge({ type }: { type: string }) {
  const styles: any = {
    POOP: { label: '排泄', color: 'bg-orange-100 text-orange-600' },
    SAFETY: { label: '安全停止', color: 'bg-green-100 text-green-600' },
    MAINTENANCE: { label: '保守', color: 'bg-blue-100 text-blue-600' },
    ERROR: { label: '異常', color: 'bg-red-100 text-red-600' },
    PREDICTION: { label: '予兆', color: 'bg-amber-100 text-amber-600' },
    SCHEDULE: { label: '稼働予定', color: 'bg-indigo-100 text-indigo-600' },
  };
  const style = styles[type] || { label: '通知', color: 'bg-slate-100 text-slate-600' };
  return <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${style.color}`}>{style.label}</span>;
}

function LogIcon({ type }: { type: string }) {
  switch (type) {
    case 'POOP':
      return <div className="bg-orange-100 p-2.5 rounded-xl text-orange-600"><Dog className="w-5 h-5" /></div>;
    case 'SHOOT':
    case 'DOME':
      return <div className="bg-blue-100 p-2.5 rounded-xl text-blue-600"><Package className="w-5 h-5" /></div>;
    case 'SAFETY':
      return <div className="bg-green-100 p-2.5 rounded-xl text-green-600"><ShieldAlert className="w-5 h-5" /></div>;
    case 'MAINTENANCE':
      return <div className="bg-blue-100 p-2.5 rounded-xl text-blue-600"><Wrench className="w-5 h-5" /></div>;
    case 'PREDICTION':
      return <div className="bg-amber-100 p-2.5 rounded-xl text-amber-600"><Search className="w-5 h-5" /></div>;
    case 'SCHEDULE':
      return <div className="bg-indigo-100 p-2.5 rounded-xl text-indigo-600"><Clock className="w-5 h-5" /></div>;
    case 'ERROR':
      return <div className="bg-red-100 p-2.5 rounded-xl text-red-600"><AlertTriangle className="w-5 h-5" /></div>;
    default:
      return <div className="bg-slate-100 p-2.5 rounded-xl text-slate-600"><Eye className="w-5 h-5" /></div>;
  }
}
