"use client";

import React, { useState } from "react";
import { 
  Save, Camera, Candy, Smartphone, FastForward, 
  ShieldAlert, Clock, Calendar, Bell, Footprints, Bone, Heart
} from "lucide-react";
import { motion } from "framer-motion";

export default function Settings() {
  // 1. System Schedule
  const [scheduleMode, setScheduleMode] = useState("weekdays"); // weekdays, everyday
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("19:00");

  // 2. AI & Camera
  const [confidence, setConfidence] = useState(0.75);
  const [fps, setFps] = useState(10);
  const [captureCount, setCaptureCount] = useState(5);

  // 3. Robot & Safety
  const [moveSpeed, setMoveSpeed] = useState("standard");
  const [cpuTempLimit, setCpuTempLimit] = useState(75);
  const [robotTempLimit, setRobotTempLimit] = useState(60);

  // 4. Treat Shooter
  const [treatRotations, setTreatRotations] = useState(1);

  // 5. Granular Notifications
  const [notifyOnPoop, setNotifyOnPoop] = useState(true);
  const [notifyOnPose, setNotifyOnPose] = useState(true);
  const [notifyOnDeployed, setNotifyOnDeployed] = useState(true);

  return (
    <div className="flex flex-col gap-8 pb-32">
      <header>
        <h2 className="text-xl font-bold tracking-tight">システム設定</h2>
        <p className="text-xs text-slate-500 font-medium">詳細な動作定数と安全しきい値を設定します</p>
      </header>

      {/* 1. Operation Schedule */}
      <section className="bg-white border border-orange-100 rounded-[2rem] p-6 shadow-sm">
        <h3 className="flex items-center gap-2 font-bold text-sm mb-6 text-[#8B4513]">
          <Calendar className="w-4 h-4 text-orange-400" />
          稼働スケジュール
        </h3>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">稼働日の設定</label>
            <div className="flex bg-orange-50 p-1 rounded-xl gap-1">
               <button onClick={() => setScheduleMode("weekdays")} className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${scheduleMode === "weekdays" ? "bg-white text-[#8B4513] shadow-sm" : "text-[#A0522D]/40"}`}>平日のみ</button>
               <button onClick={() => setScheduleMode("everyday")} className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${scheduleMode === "everyday" ? "bg-white text-[#8B4513] shadow-sm" : "text-[#A0522D]/40"}`}>毎日</button>
            </div>
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">開始時刻</label>
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-xl px-3 py-2">
                <Clock className="w-3 h-3 text-slate-400" />
                <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="bg-transparent text-xs font-bold text-slate-700 w-full outline-none" />
              </div>
            </div>
            <div className="flex-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">終了時刻</label>
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-xl px-3 py-2">
                <Clock className="w-3 h-3 text-slate-400" />
                <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="bg-transparent text-xs font-bold text-slate-700 w-full outline-none" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. AI & Camera */}
      <section className="bg-white border border-orange-100 rounded-[2rem] p-6 shadow-sm">
        <h3 className="flex items-center gap-2 font-bold text-sm mb-6 text-[#8B4513]">
          <Camera className="w-4 h-4 text-orange-500" />
          推論・カメラ設定
        </h3>
        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">検知信頼度しきい値</label>
              <span className="text-sm font-black text-[#8B4513] bg-orange-50 px-2 py-0.5 rounded-lg">{(confidence * 100).toFixed(0)}%</span>
            </div>
            <input type="range" min="0" max="1" step="0.05" value={confidence} onChange={(e) => setConfidence(parseFloat(e.target.value))} className="w-full h-1.5 bg-orange-50 rounded-lg appearance-none cursor-pointer accent-[#8B4513]" />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">フレームレート</label>
            <div className="flex bg-orange-50 p-1 rounded-xl gap-1">
               {[5, 10, 15].map((v) => (
                 <button key={v} onClick={() => setFps(v)} className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${fps === v ? "bg-white text-[#8B4513] shadow-sm" : "text-[#A0522D]/40"}`}>{v} FPS</button>
               ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Robot & Safety */}
      <section className="bg-white border border-orange-100 rounded-[2rem] p-6 shadow-sm">
        <h3 className="flex items-center gap-2 font-bold text-sm mb-6 text-[#8B4513]">
          <ShieldAlert className="w-4 h-4 text-red-400" />
          ロボット・安全設定
        </h3>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">移動速度</label>
            <div className="flex bg-orange-50 p-1 rounded-xl gap-1">
               {["slow", "standard", "fast"].map((s) => (
                 <button key={s} onClick={() => setMoveSpeed(s)} className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${moveSpeed === s ? "bg-white text-[#8B4513] shadow-sm" : "text-[#A0522D]/40"}`}>
                   {s === "slow" ? "ゆっくり" : s === "standard" ? "ふつう" : "いそいで"}
                 </button>
               ))}
            </div>
          </div>
          <div className="h-px bg-slate-50" />
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">CPU強制停止温度</label>
                <p className="text-[8px] text-slate-400 font-bold uppercase tracking-tighter">Overheat protection</p>
              </div>
              <div className="flex items-center gap-2">
                <input type="number" value={cpuTempLimit} onChange={(e) => setCpuTempLimit(parseInt(e.target.value))} className="w-12 bg-slate-50 border border-slate-100 rounded-lg px-2 py-1 text-xs font-bold text-center" />
                <span className="text-[10px] font-bold text-slate-400">℃</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ルンバ強制停止温度</label>
                <p className="text-[8px] text-slate-400 font-bold uppercase tracking-tighter">Robot Safety Limit</p>
              </div>
              <div className="flex items-center gap-2">
                <input type="number" value={robotTempLimit} onChange={(e) => setRobotTempLimit(parseInt(e.target.value))} className="w-12 bg-slate-50 border border-slate-100 rounded-lg px-2 py-1 text-xs font-bold text-center" />
                <span className="text-[10px] font-bold text-slate-400">℃</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Treat Shooter */}
      <section className="bg-white border border-orange-100 rounded-[2rem] p-6 shadow-sm">
        <h3 className="flex items-center gap-2 font-bold text-sm mb-6 text-[#8B4513]">
          <Bone className="w-4 h-4 text-orange-400" />
          おやつ排出設定
        </h3>
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">排出時の回転数</label>
          <div className="flex items-center gap-3">
            <button onClick={() => setTreatRotations(Math.max(1, treatRotations - 1))} className="w-8 h-8 flex items-center justify-center bg-orange-50 rounded-lg text-[#8B4513] font-bold">-</button>
            <span className="text-sm font-black text-[#5D4037]">{treatRotations}</span>
            <button onClick={() => setTreatRotations(Math.min(5, treatRotations + 1))} className="w-8 h-8 flex items-center justify-center bg-orange-50 rounded-lg text-[#8B4513] font-bold">+</button>
            <span className="text-[10px] font-bold text-slate-400 ml-1">回</span>
          </div>
        </div>
      </section>

      {/* 5. Granular Notifications */}
      <section className="bg-white border border-orange-100 rounded-[2rem] p-6 shadow-sm">
        <h3 className="flex items-center gap-2 font-bold text-sm mb-6 text-[#8B4513]">
          <Heart className="w-4 h-4 text-orange-400" />
          LINE通知設定
        </h3>
        <div className="space-y-4">
          <NotificationToggle label="ウンチを検知したとき" description="Poop detected" enabled={notifyOnPoop} setEnabled={setNotifyOnPoop} />
          <div className="h-px bg-orange-50" />
          <NotificationToggle label="ウンチポーズをしたとき" description="Poop pose detected" enabled={notifyOnPose} setEnabled={setNotifyOnPose} />
          <div className="h-px bg-orange-50" />
          <NotificationToggle label="シールドを投下したとき" description="Shield deployment complete" enabled={notifyOnDeployed} setEnabled={setNotifyOnDeployed} />
        </div>
      </section>

      {/* Save Button */}
      <div className="fixed bottom-24 left-0 right-0 px-4 bg-gradient-to-t from-[#FAF9F6] to-transparent pt-12 pb-4">
        <motion.button whileTap={{ scale: 0.98 }} className="max-w-md mx-auto w-full bg-[#8B4513] text-[#FFFFFF] font-black py-4 rounded-[2rem] flex items-center justify-center gap-3 shadow-xl shadow-orange-100 border-2 border-white">
          <Save className="w-5 h-5 text-white" />
          この設定を反映する
        </motion.button>
      </div>
    </div>
  );
}

function NotificationToggle({ label, description, enabled, setEnabled }: { label: string, description: string, enabled: boolean, setEnabled: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col">
        <label className="text-[10px] font-black text-slate-600 uppercase tracking-tight">{label}</label>
        <p className="text-[8px] text-slate-400 font-bold uppercase tracking-tighter">{description}</p>
      </div>
      <button onClick={() => setEnabled(!enabled)} className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${enabled ? "bg-green-500" : "bg-slate-200"}`}>
        <motion.div animate={{ x: enabled ? 22 : 2 }} className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm" />
      </button>
    </div>
  );
}
