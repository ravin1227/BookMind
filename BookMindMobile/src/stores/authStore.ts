// Simple store for future use - keeping minimal for now
import { create } from 'zustand';

interface AppState {
  // We'll add state here as we build the app
  isReady: boolean;
  setReady: (ready: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  isReady: false,
  setReady: (ready: boolean) => set({ isReady: ready }),
}));