import { create } from 'zustand';

type SystemState = 'IDLE' | 'DETECTED' | 'DECOYING' | 'MOVING' | 'DEPLOYING' | 'RETURNING' | 'ERROR';

interface CocobaStore {
  isOnline: boolean;
  systemState: SystemState;
  domeCount: number;
  cpuTemp: number;
  isManualMode: boolean;
  robotPos: { x: number; y: number };
  notifications: string[];
  setOnline: (online: boolean) => void;
  setSystemState: (state: SystemState) => void;
  setDomeCount: (count: number) => void;
  setManualMode: (mode: boolean) => void;
  killSwitch: () => void;
}

export const useCocobaStore = create<CocobaStore>((set) => ({
  isOnline: true,
  systemState: 'IDLE',
  domeCount: 4,
  cpuTemp: 45,
  isManualMode: false,
  robotPos: { x: 1.2, y: 0.8 },
  notifications: [],
  setOnline: (online) => set({ isOnline: online }),
  setSystemState: (state) => set({ systemState: state }),
  setDomeCount: (count) => set({ domeCount: count }),
  setManualMode: (mode) => set({ isManualMode: mode }),
  killSwitch: () => set({ 
    systemState: 'ERROR', 
    isManualMode: false, 
    notifications: ['Emergency Kill Switch Activated!'] 
  }),
}));
