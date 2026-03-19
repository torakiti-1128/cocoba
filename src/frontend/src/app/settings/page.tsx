"use client";

import React, { useState } from "react";
import { Sliders, Bell, FastForward, Info, Trash2, Save } from "lucide-react";
import { motion } from "framer-motion";

export default function Settings() {
  const [confidence, setConfidence] = useState(0.75);

  return (
    <div className="flex flex-col gap-8 pb-12">
      <header>
        <h2 className="text-xl font-bold">システム設定</h2>
        <p className="text-xs text-slate-500 font-medium">エッジPCの内部動作定数を調整します</p>
      </header>

      {/* AI Inference Section */}
      <section className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <h3 className="flex items-center gap-2 font-bold text-sm mb-6">
          <Sliders className="w-4 h-4 text-blue-600" />
          AI推論設定
        </h3>
        
        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="text-xs font-bold text-slate-600 uppercase">検知の信頼度閾値</label>
              <span className="text-sm font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg">
                {(confidence * 100).toFixed(0)}%
              </span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.05" 
              value={confidence} 
              onChange={(e) => setConfidence(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between mt-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              <span>低精度</span>
              <span>高精度</span>
            </div>
          </div>
        </div>
      </section>

      {/* Robot Config Section */}
      <section className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <h3 className="flex items-center gap-2 font-bold text-sm mb-6">
          <FastForward className="w-4 h-4 text-blue-600" />
          ロボット制御設定
        </h3>
        
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600">移動速度</span>
            <div className="flex bg-slate-100 p-1 rounded-xl gap-1">
               <button className="px-3 py-1.5 rounded-lg text-[10px] font-bold bg-white shadow-sm">低速</button>
               <button className="px-3 py-1.5 rounded-lg text-[10px] font-bold text-slate-400">標準</button>
               <button className="px-3 py-1.5 rounded-lg text-[10px] font-bold text-slate-400">高速</button>
            </div>
          </div>
          <div className="h-px bg-slate-100 my-1" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600">LINE通知</span>
            <div className="w-12 h-6 bg-green-500 rounded-full relative">
              <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
            </div>
          </div>
        </div>
      </section>

      {/* Advanced / Maintenance */}
      <section className="space-y-3">
        <button className="w-full bg-white border border-slate-200 text-slate-800 font-bold py-4 rounded-2xl flex items-center justify-center gap-3 active:bg-slate-50">
          <Info className="w-4 h-4 text-slate-400" />
          デバイス情報・ログ詳細
        </button>
        <button className="w-full bg-red-50 text-red-600 font-bold py-4 rounded-2xl flex items-center justify-center gap-3 active:bg-red-100">
          <Trash2 className="w-4 h-4" />
          キャッシュデータの削除
        </button>
      </section>

      {/* Save Button */}
      <motion.button 
        whileTap={{ scale: 0.98 }}
        className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-slate-200 mb-8"
      >
        <Save className="w-5 h-5" />
        設定を保存・反映する
      </motion.button>
    </div>
  );
}
