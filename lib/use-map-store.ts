import { create } from 'zustand';

interface UserLocation {
  latitude: number;
  longitude: number;
  heading: number | null;
}

interface MapState {
  isTracking: boolean;
  userLocation: UserLocation | null;
  geoError: string | null;
  toggleTracking: () => void;
  stopTracking: () => void;
  setUserLocation: (location: UserLocation) => void;
  setGeoError: (error: string | null) => void;
}

export const useMapStore = create<MapState>((set) => ({
  isTracking: false,
  userLocation: null,
  geoError: null,
  toggleTracking: () => set((state) => ({ isTracking: !state.isTracking })),
  stopTracking: () => set({ isTracking: false }),
  setUserLocation: (userLocation) => set({ userLocation, geoError: null }),
  setGeoError: (geoError) => set({ geoError, isTracking: false }),
}));
