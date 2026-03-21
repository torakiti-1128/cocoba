"use client";

import React from "react";
import { useCocobaStore } from "@/store/useCocobaStore";
import { 
  RefreshCw, Thermometer, Signal, Package, Wifi, Clock,
  RotateCcw, Power, HardDrive, Trash2, Zap, Camera, Bot, Cloud, Server, Download, Activity,
  Database, Layers, Cpu, ShieldCheck, Info, Footprints, Heart
} from "lucide-react";
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip
} from 'recharts';

// Robot Temperature (Last 30 mins)
const ROBOT_TEMP_DATA = [
  { time: '14:00', temp: 38 }, { time: '14:05', temp: 42 },
  { time: '14:10', temp: 45 }, { time: '14:15', temp: 48 },
  { time: '14:20', temp: 46 }, { time: '14:25', temp: 44 },
];

// CPU Load (Edge PC N100)
const CPU_LOAD_DATA = [
  { time: '14:00', load: 12 }, { time: '14:05', load: 45 },
  { time: '14:10', load: 82 }, { time: '14:15', load: 65 },
  { time: '14:20', load: 30 }, { time: '14:25', load: 15 },
];

// Network Latency (RTT in ms)
const LATENCY_DATA = [
  { time: '14:00', rtt: 12 }, { time: '14:05', rtt: 15 },
  { time: '14:10', rtt: 42 }, { time: '14:15', rtt: 18 },
  { time: '14:20', rtt: 11 }, { time: '14:25', rtt: 14 },
];

export default function Manage() {
  const { domeCount, cpuTemp, isOnline } = useCocobaStore();

  const handleAction = (action: string) => {
    console.log(`Maintenance Command: ${action}`);
  };

  return (
    <div className="flex flex-col gap-8 pb-24">
      <header>
        <h2 className="text-xl font-bold tracking-tight">システム管理</h2>
        <p className="text-xs text-slate-500 font-medium">システムの稼働状態とメンテナンス</p>
      </header>

      {/* 1. Dead/Alive Monitoring Dashboard (Detailed) */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between ml-1">
          <h3 className="text-[10px] font-black text-[#A0522D] uppercase tracking-[0.2em] flex items-center gap-2">
            <Heart className="w-3 h-3 text-orange-400" />
            システムのけんこう状態
          </h3>
          <button className="flex items-center gap-1.5 px-3 py-1 bg-orange-50 text-[#8B4513] rounded-full active:bg-orange-100 transition-colors">
            <RefreshCw className="w-2.5 h-2.5" />
            <span className="text-[9px] font-black uppercase tracking-tighter">再読み込み</span>
          </button>
        </div>

        {/* Local Environment */}
        <div className="bg-white border border-orange-100 rounded-3xl p-5 shadow-sm">
          <p className="text-[10px] text-[#A0522D] font-bold uppercase mb-4 flex items-center gap-1.5">
            <Footprints className="w-3 h-3" />
            おうちのデバイス
          </p>
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <StatusIndicator icon={<Camera className="w-4 h-4" />} label="ネットワークカメラ" status="ONLINE" />
            <StatusIndicator icon={<Server className="w-4 h-4" />} label="エッジPC (N100)" status="ONLINE" />
            <StatusIndicator icon={<Bot className="w-4 h-4" />} label="Cocobaロボット" status="ONLINE" />
            <StatusIndicator icon={<ShieldCheck className="w-4 h-4" />} label="シールド投下機構" status="ONLINE" />
            <StatusIndicator icon={<Zap className="w-4 h-4" />} label="おやつシューター" status="ONLINE" />
            <StatusIndicator icon={<Signal className="w-4 h-4" />} label="ローカルブローカー" status="ONLINE" />
          </div>
        </div>

        {/* Cloud Environment (Detailed AWS Services) */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
          <p className="text-[10px] text-slate-400 font-bold uppercase mb-4">クラウド環境 (AWS)</p>
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <StatusIndicator icon={<Cloud className="w-4 h-4" />} label="IoT Core (通信基盤)" status={isOnline ? "ONLINE" : "OFFLINE"} />
            <StatusIndicator icon={<Layers className="w-4 h-4" />} label="API Gateway" status="ONLINE" />
            <StatusIndicator icon={<Cpu className="w-4 h-4" />} label="AWS Lambda (処理)" status="ONLINE" />
            <StatusIndicator icon={<Database className="w-4 h-4" />} label="DynamoDB (履歴)" status="ONLINE" />
            <StatusIndicator icon={<HardDrive className="w-4 h-4" />} label="Amazon S3 (画像)" status="ONLINE" />
          </div>
        </div>
      </section>

      {/* 2. System Metrics */}
      <section>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 ml-1">システムステータス詳細</h3>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm grid grid-cols-5 gap-1">
          <MetricItem icon={<Package className="w-4 h-4" />} label="残弾" value={`${domeCount}基`} />
          <MetricItem icon={<Thermometer className="w-4 h-4" />} label="CPU" value={`${cpuTemp}℃`} />
          <MetricItem icon={<Signal className="w-4 h-4" />} label="推論" value="10.2fps" />
          <MetricItem icon={<Wifi className="w-4 h-4" />} label="Wi-Fi" value="92%" />
          <MetricItem icon={<Clock className="w-4 h-4" />} label="稼働" value="12d" />
        </div>
      </section>

      {/* 3. System Load Graphs */}
      <section className="flex flex-col gap-4">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
          <Activity className="w-3 h-3" />
          システム負荷状況
        </h3>

        {/* Graph 1: Robot Temperature */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
          <p className="text-[10px] text-slate-400 font-bold uppercase mb-0.5">ルンバの温度遷移</p>
          <h4 className="text-lg font-bold mb-6 text-slate-700">内部温度モニタリング</h4>
          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ROBOT_TEMP_DATA}>
                <defs>
                  <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                <YAxis hide domain={['dataMin - 5', 'dataMax + 5']} />
                <Tooltip contentStyle={{borderRadius: '12px', border: 'none', fontSize: '10px'}} />
                <Area type="monotone" dataKey="temp" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorTemp)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Graph 2: CPU Load */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
          <p className="text-[10px] text-slate-400 font-bold uppercase mb-0.5">エッジPC CPU負荷</p>
          <h4 className="text-lg font-bold mb-6 text-slate-700">プロセッサ使用率</h4>
          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={CPU_LOAD_DATA}>
                <defs>
                  <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                <YAxis hide domain={[0, 100]} />
                <Tooltip contentStyle={{borderRadius: '12px', border: 'none', fontSize: '10px'}} />
                <Area type="monotone" dataKey="load" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorLoad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Graph 3: Network Latency */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
          <p className="text-[10px] text-slate-400 font-bold uppercase mb-0.5">通信レイテンシ (RTT)</p>
          <h4 className="text-lg font-bold mb-6 text-slate-700">ネットワーク応答速度</h4>
          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={LATENCY_DATA}>
                <defs>
                  <linearGradient id="colorRTT" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                <YAxis hide domain={['dataMin - 5', 'dataMax + 5']} />
                <Tooltip contentStyle={{borderRadius: '12px', border: 'none', fontSize: '10px'}} />
                <Area type="monotone" dataKey="rtt" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorRTT)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* 4. System Maintenance (2 * 3 Grid with Row Style) */}
      <section>
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-1">システムメンテナンス</h3>
        <div className="grid grid-cols-2 gap-3">
          <MaintenanceButton icon={<RotateCcw className="w-4 h-4" />} label="推論再起動" onClick={() => handleAction("restart_inf")} />
          <MaintenanceButton icon={<Power className="w-4 h-4" />} label="ESP32リセット" onClick={() => handleAction("reset_esp")} />
          <MaintenanceButton icon={<Download className="w-4 h-4" />} label="AIモデル更新" onClick={() => handleAction("update_model")} />
          <MaintenanceButton icon={<Wifi className="w-4 h-4" />} label="通信テスト" onClick={() => handleAction("ping")} />
          <MaintenanceButton icon={<HardDrive className="w-4 h-4" />} label="ストレージ診断" onClick={() => handleAction("check_storage")} />
          <MaintenanceButton icon={<Trash2 className="w-4 h-4" />} label="ログ消去" onClick={() => handleAction("clear_logs")} color="text-red-500" />
        </div>
      </section>

      {/* 5. Device Details (Moved from Settings) */}
      <section>
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-1 flex items-center gap-2">
          <Info className="w-3 h-3" />
          デバイス詳細
        </h3>
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          <DetailRow label="OS" value="Ubuntu 22.04.3 LTS" />
          <DetailRow label="CPU" value="Intel® Processor N100" />
          <DetailRow label="RAM" value="16GB DDR5" />
          <DetailRow label="Local IP" value="192.168.1.42" />
          <DetailRow label="Serial" value="CCB-N100-2026-X7" />
          <DetailRow label="Firmware" value="v1.2.4-stable" />
        </div>
      </section>
    </div>
  );
}

function StatusIndicator({ icon, label, status }: { icon: any, label: string, status: "ONLINE" | "OFFLINE" | "ERROR" }) {
  const isOnline = status === "ONLINE";
  return (
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-xl ${isOnline ? "bg-orange-50 text-orange-400" : "bg-red-50 text-red-400"}`}>
        {icon}
      </div>
      <div>
        <p className="text-[9px] text-slate-400 font-bold leading-none mb-1">{label}</p>
        <div className="flex items-center gap-1.5">
          <div className={`w-1.5 h-1.5 rounded-full ${isOnline ? "bg-[#10b981] shadow-[0_0_8px_rgba(16,185,129,0.4)]" : "bg-red-500"}`} />
          <span className={`text-[10px] font-black ${isOnline ? "text-[#5D4037]" : "text-red-500"}`}>{status}</span>
        </div>
      </div>
    </div>
  );
}

function MaintenanceButton({ icon, label, onClick, color = "text-[#5D4037]" }: { icon: any, label: string, onClick: () => void, color?: string }) {
  return (
    <button 
      onClick={onClick}
      className="bg-white border border-orange-50 p-4 rounded-[1.5rem] flex items-center gap-3 shadow-sm active:bg-orange-50 transition-colors group"
    >
      <div className="bg-orange-50 p-2.5 rounded-xl text-orange-400 group-active:text-[#8B4513] transition-colors flex-shrink-0">
        {icon}
      </div>
      <p className={`font-bold text-[10px] ${color} leading-tight text-left`}>{label}</p>
    </button>
  );
}

function MetricItem({ icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="text-slate-400">{icon}</div>
      <div className="text-[8px] text-slate-400 font-bold leading-none text-center">{label}</div>
      <div className="text-[10px] font-bold text-slate-800 text-center">{value}</div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-50 pb-3 last:border-0 last:pb-0">
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
      <span className="text-xs font-bold text-slate-700">{value}</span>
    </div>
  );
}
