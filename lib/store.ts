// lib/store.ts
import { create } from 'zustand';
import type { Group } from 'three';
import type Lenis from 'lenis';

interface StoreState {
  stage: string;
  setStage: (stage: string) => void;

  orbit: boolean;
  setOrbit: (v: boolean) => void;

  dragging: boolean;
  setDragging: (v: boolean) => void;

  modelRef: Group | null;
  setModelRef: (ref: Group | null) => void;

  tiltLayerRef: Group | null;
  setTiltLayerRef: (ref: Group | null) => void;

  orbitLayerRef: Group | null;
  setOrbitLayerRef: (ref: Group | null) => void;

  lenis: Lenis | null;
  setLenis: (lenis: Lenis | null) => void;
}

export const useStore = create<StoreState>((set) => ({
  stage: 'hero',
  setStage: (stage) => set({ stage }),

  orbit: true,
  setOrbit: (orbit) => set({ orbit }),

  dragging: false,
  setDragging: (dragging) => set({ dragging }),

  modelRef: null,
  setModelRef: (modelRef) => set({ modelRef }),

  tiltLayerRef: null,
  setTiltLayerRef: (tiltLayerRef) => set({ tiltLayerRef }),

  orbitLayerRef: null,
  setOrbitLayerRef: (orbitLayerRef) => set({ orbitLayerRef }),

  lenis: null,
  setLenis: (lenis) => set({ lenis }),
}));
