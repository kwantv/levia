import { create } from 'zustand';
import type { Group } from 'three';
import type Lenis from 'lenis';
import { Pose } from '@/app/(web)/test/section/showcase-stages';

interface StoreState {
  stage: string | null;
  setStage: (id: string | null) => void;

  orbit: boolean;
  setOrbit: (v: boolean) => void;

  dragging: boolean;
  setDragging: (v: boolean) => void;

  modelRef: Group | null;
  setModelRef: (ref: Group | null) => void;

  dockTargetId: string | null;
  setDockTargetId: (id: string | null) => void;

  resetInteraction: (() => void) | null;
  setResetInteraction: (fn: (() => void) | null) => void;

  pendingPose: Pose | null;
  setPendingPose: (pose: Pose | null) => void;

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

  dockTargetId: null,
  setDockTargetId: (dockTargetId) => set({ dockTargetId }),

  resetInteraction: null,
  setResetInteraction: (resetInteraction) => set({ resetInteraction }),

  pendingPose: null,
  setPendingPose: (pendingPose) => set({ pendingPose }),

  lenis: null,
  setLenis: (lenis) => set({ lenis }),
}));
