'use client';

import { Store } from '@/types/store';
import { MapPin } from 'lucide-react';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useRef, useState } from 'react';
import Map, {
  GeolocateControl,
  MapRef,
  Marker,
  NavigationControl,
} from 'react-map-gl/mapbox';
import './map.css';

export default function StoreLocator({ stores }: { stores: Store[] }) {
  const mapRef = useRef<MapRef>(null);
  const [viewState, setViewState] = useState({
    latitude: 21.1,
    longitude: 106.5,
    zoom: 8.2,
    pitch: 45,
  });

  // customize map
  function handleMapLoad() {
    const map = mapRef.current;
    if (!map) return;

    map.setLanguage('vi');
    mapAddMask(map);
    mapSetCustomFont(map);
    mapAddIslands(map);
    mapAddStarryBackground(map);
    mapAdd3dBuildings(map);
  }

  return (
    <div className="flex place-content-center">
      <Map
        ref={mapRef}
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        onLoad={handleMapLoad}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        style={{ width: '90vw', height: 900 }}
      >
        <NavigationControl
          position="bottom-right"
          showCompass={true}
          showZoom={false}
          visualizePitch={true}
        />
        <GeolocateControl
          position="bottom-right"
          trackUserLocation={true}
          showUserHeading={true}
        />
        {stores.map((s) => (
          <Marker key={s._id} longitude={s.lng} latitude={s.lat}>
            <MapPin
              className="size-8"
              fill="var(--color-primary)"
              absoluteStrokeWidth
            />
          </Marker>
        ))}
      </Map>
    </div>
  );
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
      'text-font': ['DIN Pro Regular', 'Arial Unicode MS Regular'], // match dark-v11's country-label font stack
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
  const map = mapRef.getMap();

  map.setFog({
    'space-color': 'rgb(5, 5, 8)', // deep space background
    'star-intensity': 0.2, // 0 = no stars, 1 = max density
    'horizon-blend': 0.05, // atmosphere thickness at the edge of the globe
    color: 'rgb(30, 26, 20)', // atmosphere glow color near the horizon — tuned warm to match your gold theme
    'high-color': 'rgb(20, 18, 22)', // upper atmosphere color
  });
}

function mapAdd3dBuildings(mapRef: MapRef) {
  const map = mapRef.getMap();

  map.addLayer({
    id: '3d-buildings',
    source: 'composite',
    'source-layer': 'building',
    type: 'fill-extrusion',
    minzoom: 14, // buildings only make sense at street-level zoom
    paint: {
      'fill-extrusion-color': '#1A1816', // matches your dark panel tone
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
    const layer = map.getStyle().layers.find((l) => l.id === id);
    if (!layer) return;
    map.setFilter(id, [
      'all',
      layer.filter ?? true,
      ['==', ['get', 'iso_3166_1'], 'VN'],
    ]);
  });
}
