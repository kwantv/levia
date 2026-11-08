import { create } from 'zustand';

type S = {
  ready: boolean;
  revealed: boolean;
  progress: number;
  setReady: () => void;
  setRevealed: () => void;
  setProgress: (p: number) => void;
  reset: () => void;
};

export const useSceneReady = create<S>((set) => ({
  ready: false,
  revealed: false,
  progress: 0,
  setReady: () => set({ ready: true }),
  setRevealed: () => set({ revealed: true }),
  setProgress: (progress) => set({ progress }),
  reset: () => set({ ready: false, revealed: false, progress: 0 }),
}));
