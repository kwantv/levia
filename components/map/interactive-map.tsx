'use client';

import { Agency } from '@/app/(web)/agency/[slug]/action';
import { MapPin, Navigation } from 'lucide-react';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useState } from 'react';
import Map, { MapRef, Marker, Popup } from 'react-map-gl/mapbox';
import './map.css';
import { useMapStore } from '@/lib/use-map-store';

const VIETNAM_VIEW = {
  latitude: 21.1,
  longitude: 106.5,
  zoom: 8.2,
  pitch: 30,
};

interface StoreLocatorProps {
  mapRef: React.RefObject<MapRef | null>;
  agencies: Agency[];
  selectedAgencyId?: string;
  onAgencySelect?: (agencyId: string) => void;
}

export default function StoreLocator({
  mapRef,
  agencies,
  selectedAgencyId,
  onAgencySelect,
}: StoreLocatorProps) {
  const userLocation = useMapStore((state) => state.userLocation);
  const [viewState, setViewState] = useState(VIETNAM_VIEW);

  const selectedAgency = agencies.find(
    (agency) => agency._id === selectedAgencyId,
  );

  useEffect(() => {
    if (!selectedAgency) return;

    mapRef.current?.flyTo({
      center: [selectedAgency.lng, selectedAgency.lat],
      zoom: 13,
      duration: 1000,
    });
  }, [selectedAgency]);

  useEffect(() => {
    if (agencies.length === 0 || selectedAgency) return;

    if (agencies.length === 1) {
      mapRef.current?.flyTo({
        center: [agencies[0].lng, agencies[0].lat],
        zoom: 12,
        duration: 800,
      });
      return;
    }

    const lngs = agencies.map((agency) => agency.lng);
    const lats = agencies.map((agency) => agency.lat);

    mapRef.current?.fitBounds(
      [
        [Math.min(...lngs), Math.min(...lats)],
        [Math.max(...lngs), Math.max(...lats)],
      ],
      { padding: 56, maxZoom: 11, duration: 800 },
    );
  }, [selectedAgency, agencies]);

  function handleMapLoad() {
    const map = mapRef.current;
    if (!map) return;

    map.setLanguage('vi');
    mapSetTheme(map);
    mapAddMask(map);
    mapSetCustomFont(map);
    mapAddIslands(map);
    mapAddStarryBackground(map);
    mapAdd3dBuildings(map);
  }

  if (!process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
    return (
      <div className="flex justify-center items-center bg-muted/30 min-h-96 text-center">
        <div className="p-6 max-w-sm">
          <MapPin className="mx-auto size-7 text-primary" />
          <p className="mt-3 font-medium">Bản đồ chưa được cấu hình</p>
          <p className="mt-2 text-muted-foreground text-sm">
            Thêm NEXT_PUBLIC_MAPBOX_TOKEN để hiển thị vị trí đại lý.
          </p>
        </div>
      </div>
    );
  }

  return (
    <Map
      ref={mapRef}
      {...viewState}
      onMove={(event) => setViewState(event.viewState)}
      onLoad={handleMapLoad}
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
      mapStyle="mapbox://styles/mapbox/dark-v11"
      style={{ width: '100%', height: '100%' }}
    >
      {userLocation && (
        <Marker
          longitude={userLocation.longitude}
          latitude={userLocation.latitude}
        >
          <div className="relative flex justify-center items-center">
            {/* Heading Arrow (Only shows if heading is available and moving) */}
            {userLocation.heading !== null && (
              <div
                className="z-10 absolute transition-transform duration-300 ease-linear"
                style={{
                  transform: `rotate(${userLocation.heading}deg) translateY(-14px)`,
                }}
              >
                <Navigation
                  className="drop-shadow-md fill-blue-500 w-5 h-5 text-blue-500"
                  strokeWidth={1.5}
                />
              </div>
            )}

            {/* Inner Dot */}
            <div className="z-20 bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.8)] border-2 border-white rounded-full w-4 h-4" />

            {/* Radar Pulse Effect */}
            <div className="z-0 absolute bg-blue-500/30 rounded-full w-8 h-8 animate-ping" />
          </div>
        </Marker>
      )}

      {agencies.map((agency) => {
        const isSelected = selectedAgencyId === agency._id;

        return (
          <Marker key={agency._id} longitude={agency.lng} latitude={agency.lat}>
            <button
              type="button"
              className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring text-primary hover:scale-110 transition-transform"
              aria-label={`Chọn ${agency.name}`}
              onClick={() => onAgencySelect?.(agency._id)}
            >
              <MapPin
                className={isSelected ? 'size-10' : 'size-8'}
                fill="currentColor"
                strokeWidth={1.5}
              />
            </button>
          </Marker>
        );
      })}

      {selectedAgency && (
        <Popup
          longitude={selectedAgency.lng}
          latitude={selectedAgency.lat}
          offset={24}
          closeButton={false}
          closeOnClick={false}
          anchor="bottom"
        >
          <div className="max-w-56 text-foreground">
            <p className="font-semibold text-sm">{selectedAgency.name}</p>
            <p className="mt-1 text-muted-foreground text-xs">
              {selectedAgency.address}
            </p>
          </div>
        </Popup>
      )}
    </Map>
  );
}

function mapSetTheme(mapRef: MapRef) {
  const map = mapRef.getMap();

  map.setPaintProperty('water', 'fill-color', '#121212');
}

function mapSetCustomFont(mapRef: MapRef) {
  const map = mapRef.getMap();

  map.setLayoutProperty('country-label', 'text-font', [
    'Roboto Mono Bold',
    'Arial Unicode MS Bold',
  ]);
  map.setLayoutProperty('settlement-major-label', 'text-font', [
    'Roboto Mono Regular',
    'Arial Unicode MS Regular',
  ]);
  map.setLayoutProperty('settlement-minor-label', 'text-font', [
    'Roboto Mono Regular',
    'Arial Unicode MS Regular',
  ]);
}

function mapAddIslands(mapRef: MapRef) {
  const map = mapRef.getMap();

  if (map.getSource('vn-islands-label')) return;

  map.addSource('vn-islands-label', {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: { name: 'Hoàng Sa' },
          geometry: { type: 'Point', coordinates: [112.3, 16.9] },
        },
        {
          type: 'Feature',
          properties: { name: 'Trường Sa' },
          geometry: { type: 'Point', coordinates: [115.8, 10.73] },
        },
      ],
    },
  });

  map.addLayer({
    id: 'vn-islands-label-layer',
    type: 'symbol',
    source: 'vn-islands-label',
    minzoom: 4,
    layout: {
      'text-field': ['get', 'name'],
      'text-font': ['DIN Pro Regular', 'Arial Unicode MS Regular'],
      'text-size': 11,
      'text-letter-spacing': 0.05,
    },
    paint: {
      'text-color': '#656565',
      'text-halo-color': '#0E0D0C',
      'text-halo-width': 1,
    },
  });
}

function mapAddStarryBackground(mapRef: MapRef) {
  mapRef.getMap().setFog({
    'space-color': 'rgb(5, 5, 8)',
    'star-intensity': 0.2,
    'horizon-blend': 0.05,
    color: 'rgb(30, 26, 20)',
    'high-color': 'rgb(20, 18, 22)',
  });
}

function mapAdd3dBuildings(mapRef: MapRef) {
  const map = mapRef.getMap();

  if (map.getLayer('3d-buildings')) return;

  map.addLayer({
    id: '3d-buildings',
    source: 'composite',
    'source-layer': 'building',
    type: 'fill-extrusion',
    minzoom: 14,
    paint: {
      'fill-extrusion-color': '#1A1816',
      'fill-extrusion-height': ['get', 'height'],
      'fill-extrusion-base': ['get', 'min_height'],
      'fill-extrusion-opacity': 0.85,
    },
  });
}

function mapAddMask(mapRef: MapRef) {
  const map = mapRef.getMap();

  const detailLayers = [
    'national-park',
    'landuse',
    'waterway',
    'land-structure-polygon',
    'land-structure-line',
    'aeroway-polygon',
    'aeroway-line',
    'building',
    'road-path-trail',
    'road-path-cycleway-piste',
    'road-path',
    'road-steps',
    'road-pedestrian',
    'road-simple',
    'road-rail',
    'tunnel-path-trail',
    'tunnel-path-cycleway-piste',
    'tunnel-path',
    'tunnel-steps',
    'tunnel-pedestrian',
    'tunnel-simple',
    'bridge-path-trail',
    'bridge-path-cycleway-piste',
    'bridge-path',
    'bridge-steps',
    'bridge-pedestrian',
    'bridge-case-simple',
    'bridge-simple',
    'bridge-rail',
    'admin-1-boundary',
    'admin-1-boundary-bg',
    'state-label',
    'settlement-major-label',
    'settlement-minor-label',
    'settlement-subdivision-label',
    'airport-label',
    'poi-label',
    'water-point-label',
    'water-line-label',
    'natural-point-label',
    'natural-line-label',
    'waterway-label',
    'road-label-simple',
  ];

  detailLayers.forEach((id) => {
    const layer = map.getStyle().layers.find((item) => item.id === id);
    if (!layer) return;

    map.setFilter(id, [
      'all',
      layer.filter ?? true,
      ['==', ['get', 'iso_3166_1'], 'VN'],
    ]);
  });
}
