"use client";

import React, { useState } from "react";
import { useCocobaStore } from "@/store/useCocobaStore";
import { 
  RefreshCw, Dog, Bot, Cloud, Activity, Info, Eye, Clock, History, Timer, Bone, Footprints
} from "lucide-react";
import { motion } from "framer-motion";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, Cell
} from 'recharts';

// Today's Activity (Hourly distribution of states %)
const ACTIVITY_DATA_TODAY = [
  { time: '08:00', active: 20, sleep: 70, poop: 10 }, 
  { time: '10:00', active: 60, sleep: 40, poop: 0 },
  { time: '12:00', active: 30, sleep: 50, poop: 20 }, 
  { time: '14:00', active: 25, sleep: 75, poop: 0 },
  { time: '16:00', active: 55, sleep: 45, poop: 0 }, 
  { time: '18:00', active: 80, sleep: 10, poop: 10 },
  { time: '20:00', active: 40, sleep: 60, poop: 0 }, 
  { time: '22:00', active: 10, sleep: 90, poop: 0 },
];

// Robot Work Duration (Hourly in minutes)
const ROBOT_WORK_DATA_TODAY = [
  { time: '08:00', duration: 5 }, { time: '10:00', duration: 0 },
  { time: '12:00', duration: 12 }, { time: '14:00', duration: 0 },
  { time: '16:00', duration: 0 }, { time: '18:00', duration: 8 },
  { time: '20:00', duration: 0 }, { time: '22:00', duration: 0 },
];

// Monthly Activity Trend (Daily for last 30 days - simplified)
const ACTIVITY_DATA_MONTH = [
  { day: '3/1', rate: 65 }, { day: '3/5', rate: 70 },
  { day: '3/10', rate: 40 }, { day: '3/15', rate: 75 },
  { day: '3/19', rate: 60 },
];

export default function Dashboard() {
  const { systemState, domeCount, cpuTemp } = useCocobaStore();
  const [lastUpdate, setLastUpdate] = useState("3秒前");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshImage = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastUpdate("たった今");
    }, 1000);
  };

  return (
    <div className="flex flex-col gap-6 pb-24">
      {/* 1. Vision Area */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold flex items-center gap-2">
            <Eye className="w-4 h-4 text-blue-600" />
            現在の様子
          </h2>
          <span className="text-[10px] text-slate-400 font-medium">最終更新: {lastUpdate}</span>
        </div>
        <div className="relative aspect-video bg-slate-200 rounded-2xl overflow-hidden shadow-inner">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-300 to-slate-400 flex items-center justify-center opacity-20">
             <div className="grid grid-cols-6 grid-rows-6 gap-2 w-full h-full p-2">
                {[...Array(36)].map((_, i) => <div key={i} className="border border-white" />)}
             </div>
          </div>
          <div className="absolute border-2 border-green-500 rounded-lg p-1 bg-green-500/10" style={{ width: '80px', height: '100px', left: '110px', top: '75px' }}>
            <span className="absolute -top-6 left-0 bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded font-bold">ここちゃん</span>
          </div>
          {isRefreshing && <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] flex items-center justify-center"><RefreshCw className="w-8 h-8 text-blue-600 animate-spin" /></div>}
        </div>
        <button onClick={refreshImage} disabled={isRefreshing} className="w-full mt-3 bg-white border border-slate-200 text-slate-700 font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-sm">
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} /> 最新画像を取得
        </button>
      </section>

      {/* 2. Status Tiles */}
      <section className="grid grid-cols-2 gap-3">
        <StatusTile icon={<Dog className="w-5 h-5" />} label="ココちゃんの状態" value={systemState === 'IDLE' ? "寝ています" : "活動中"} color="bg-orange-50 text-orange-600" subValue="室温: 24℃" />
        <StatusTile icon={<Bone className="w-5 h-5" />} label="ルンバの状態" value={systemState === 'IDLE' ? "待機中" : systemState} color="bg-amber-50 text-[#8B4513]" subValue="バッテリー: 85%" />
      </section>


      {/* 3. Detailed Metrics Grid */}
      <section>
        <h3 className="text-xs font-bold text-[#A0522D] uppercase tracking-wider mb-3 ml-1">ココちゃん・メトリクス</h3>
        <div className="grid grid-cols-3 gap-3">
          <MetricCard icon={<Footprints className="w-4 h-4" />} label="ココ活動率" value="42%" trend="+5%" />
          <MetricCard icon={<Timer className="w-4 h-4" />} label="ルンバ稼働" value="12.5h" trend="+1.2h" />
          <MetricCard icon={<History className="w-4 h-4" />} label="ウンチ回数" value="2回" trend="±0" />
        </div>
      </section>



      {/* 4. Environment Tile */}
      <section className="bg-gradient-to-r from-[#FF8C00] to-[#CD853F] rounded-[2rem] p-5 text-white shadow-lg shadow-orange-100 border-2 border-white/20">
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-xl"><Cloud className="w-6 h-6" /></div>
            <div><p className="text-xs text-white/70 font-medium">現在の環境</p><p className="font-bold">晴れ / 福岡市中央区</p></div>
          </div>
          <div className="text-right"><p className="text-2xl font-bold tracking-tighter">22℃</p></div>
        </div>
      </section>


      {/* 5. Graphs Section */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between ml-1">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">アクティビティ・分析</h3>
          <Info className="w-3.5 h-3.5 text-slate-300" />
        </div>

        {/* Graph 1: Today's Trend */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
          <p className="text-[10px] text-slate-400 font-bold uppercase mb-0.5">今日の活動トレンド</p>
          <h4 className="text-lg font-bold mb-6">時間別活動率</h4>
          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ACTIVITY_DATA_TODAY}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                <YAxis hide domain={[0, 100]} />
                <Tooltip 
                  cursor={{fill: 'transparent'}}
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '10px'}} 
                />
                <Bar dataKey="sleep" stackId="a" fill="#D2B48C" />
                <Bar dataKey="active" stackId="a" fill="#8B4513" />
                <Bar dataKey="poop" stackId="a" fill="#FF7F50" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          {/* Legend */}
          <div className="flex gap-4 mt-4 justify-center border-t border-orange-50 pt-4">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#FF7F50]" />
              <span className="text-[10px] font-black text-[#8B4513]/60">うんち</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#8B4513]" />
              <span className="text-[10px] font-black text-[#8B4513]/60">動いている</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#D2B48C]" />
              <span className="text-[10px] font-black text-[#8B4513]/60">寝ている</span>
            </div>
          </div>
        </div>

        {/* Graph 2: Robot Work Trend (NEW) */}
        <div className="bg-white border border-orange-100 rounded-[2rem] p-5 shadow-sm">
          <p className="text-[10px] text-slate-400 font-bold uppercase mb-0.5">システムの稼働傾向</p>
          <h4 className="text-lg font-bold mb-6 flex items-center gap-2 text-[#5D4037]">
            <Timer className="w-5 h-5 text-[#A0522D]" />
            ルンバの稼働時間
          </h4>
          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ROBOT_WORK_DATA_TODAY}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#fff7ed" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#A0522D'}} />
                <YAxis hide />
                <Tooltip 
                  cursor={{fill: 'transparent'}}
                  contentStyle={{borderRadius: '12px', border: 'none', fontSize: '10px'}} 
                />
                <Bar dataKey="duration" fill="#A0522D" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[10px] text-slate-400 mt-4 text-center">※ 1時間あたりのルンバ走行時間（分）です</p>
        </div>


        {/* Graph 3: Monthly Trend (NEW) */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
          <p className="text-[10px] text-slate-400 font-bold uppercase mb-0.5">直近1ヶ月の活動率遷移</p>
          <h4 className="text-lg font-bold mb-6">長期健康トレンド</h4>
          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ACTIVITY_DATA_MONTH}>
                <defs>
                  <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                <YAxis hide domain={[0, 100]} />
                <Tooltip contentStyle={{borderRadius: '12px', border: 'none', fontSize: '10px'}} />
                <Area type="monotone" dataKey="rate" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRate)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[10px] text-slate-400 mt-4 text-center">※ ここちゃんの「元気がない日」を早期発見します</p>
        </div>
      </section>
    </div>
  );
}

function StatusTile({ icon, label, value, color, subValue }: { icon: any, label: string, value: string, color: string, subValue: string }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
      <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center mb-3`}>{icon}</div>
      <p className="text-[10px] text-slate-400 font-bold mb-0.5">{label}</p>
      <p className="font-bold text-slate-800 text-lg mb-1">{value}</p>
      <p className="text-[10px] text-slate-400">{subValue}</p>
    </div>
  );
}

function MetricCard({ icon, label, value, trend }: { icon: any, label: string, value: string, trend: string }) {
  const isPositive = trend.startsWith('+');
  return (
    <div className="bg-white border border-orange-100 rounded-2xl p-3 shadow-sm">
      <div className="text-[#A0522D] mb-2">{icon}</div>
      <p className="text-[10px] text-slate-400 font-bold leading-tight mb-1">{label}</p>
      <div className="flex items-baseline justify-between gap-1">
        <span className="text-sm font-black text-[#5D4037]">{value}</span>
        <span className={`text-[8px] font-black ${isPositive ? "text-green-500" : trend === 'Avg' ? "text-slate-400" : "text-orange-400"}`}>{trend}</span>
      </div>
    </div>
  );
}
