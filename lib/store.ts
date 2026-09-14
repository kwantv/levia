import { create } from 'zustand';
import type { Group } from 'three';
import type Lenis from 'lenis';

interface StoreState {
  stage: string | null;
  setStage: (id: string | null) => void;

  orbit: boolean;
  setOrbit: (v: boolean) => void;

  dragging: boolean;
  setDragging: (v: boolean) => void;

  modelRef: Group | null;
  setModelRef: (ref: Group | null) => void;

  resetInteraction: (() => void) | null;
  setResetInteraction: (fn: (() => void) | null) => void;

  lenis: Lenis | null;
  setLenis: (lenis: Lenis | null) => void;
}

export const useStore = create<StoreState>((set) => ({
  stage: null,
  setStage: (activeStage) => set({ stage: activeStage }),

  orbit: true,
  setOrbit: (orbit) => set({ orbit }),

  dragging: false,
  setDragging: (dragging) => set({ dragging }),

  modelRef: null,
  setModelRef: (modelRef) => set({ modelRef }),

  resetInteraction: null,
  setResetInteraction: (resetInteraction) => set({ resetInteraction }),

  lenis: null,
  setLenis: (lenis) => set({ lenis }),
}));
