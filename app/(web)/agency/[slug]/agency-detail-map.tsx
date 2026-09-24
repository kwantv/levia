'use client';

import type { Agency } from './action';
import InteractiveMap from '@/components/map/interactive-map';
import { useRef } from 'react';
import type { MapRef } from 'react-map-gl/mapbox';

export function AgencyDetailMap({ agency }: { agency: Agency }) {
  const mapRef = useRef<MapRef>(null);

  return (
    <InteractiveMap
      mapRef={mapRef}
      agencies={[agency]}
      selectedAgencyId={agency._id}
    />
  );
}
