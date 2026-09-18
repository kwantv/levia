import { useEffect } from 'react';
import { Locate, LocateFixed, LocateOff, AlertCircle } from 'lucide-react';
import { useMapStore } from '@/lib/use-map-store';
import type { MapRef } from 'react-map-gl/mapbox';
import { Button } from '../ui/button';

interface GeolocateButtonProps {
  mapRef: React.RefObject<MapRef | null>;
}

export default function GeolocateButton({ mapRef }: GeolocateButtonProps) {
  const { isTracking, geoError, toggleTracking, setUserLocation, setGeoError } =
    useMapStore();

  useEffect(() => {
    let watchId: number;

    if (isTracking) {
      if (!navigator.geolocation) {
        setGeoError('Geolocation is not supported by your browser.');
        return;
      }

      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude, heading } = position.coords;

          setUserLocation({ latitude, longitude, heading });

          // Keep the map centered on the user while tracking
          mapRef.current?.flyTo({
            center: [longitude, latitude],
            zoom: 16,
            duration: 1000,
          });
        },
        (error) => {
          console.error(error);
          setGeoError('Location access denied or unavailable.');
        },
        { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 },
      );
    }

    return () => {
      if (watchId !== undefined) navigator.geolocation.clearWatch(watchId);
    };
  }, [isTracking, mapRef, setUserLocation, setGeoError]);

  return (
    <div className="flex flex-col gap-2">
      <Button onClick={toggleTracking} variant={'outline'} size={'icon'}>
        {isTracking ? (
          <LocateFixed className="w-4 h-4 text-blue-200 animate-pulse" />
        ) : (
          <Locate className="w-4 h-4" />
        )}
      </Button>

      {geoError && (
        <div className="flex items-center gap-1.5 bg-red-400/10 mt-1 p-2 border border-red-400/20 rounded-md text-red-400 text-xs">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{geoError}</span>
        </div>
      )}
    </div>
  );
}
