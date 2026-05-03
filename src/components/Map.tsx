'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapProps {
  center: [number, number];
  zoom?: number;
  polylines?: { positions: [number, number][]; color: string }[];
  markers?: { position: [number, number]; label: string; color?: string }[];
}

export default function Map({ center, zoom = 14, polylines = [], markers = [] }: MapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const tileUrl = process.env.NEXT_PUBLIC_ONEMAP_TILE_URL ||
      'https://www.onemap.gov.sg/maps/tiles/Default/{z}/{x}/{y}.png';

    const map = L.map(containerRef.current, { zoomControl: true, attributionControl: true }).setView(center, zoom);

    L.tileLayer(tileUrl, {
      attribution: '&copy; <a href="https://www.onemap.gov.sg">OneMap</a> &copy; contributors &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    mapRef.current = map;
    return () => { map.remove(); mapRef.current = null; };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    map.setView(center, zoom);
  }, [center, zoom]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const layers: L.Layer[] = [];

    for (const pl of polylines) {
      if (pl.positions.length < 2) continue;
      const line = L.polyline(pl.positions, { color: pl.color, weight: 5, opacity: 0.85 }).addTo(map);
      layers.push(line);
    }

    const greenIcon = L.divIcon({ className: '', html: '<div style="background:#16a34a;width:14px;height:14px;border-radius:50%;border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,.4)"></div>' });
    const redIcon = L.divIcon({ className: '', html: '<div style="background:#dc2626;width:14px;height:14px;border-radius:50%;border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,.4)"></div>' });

    for (const m of markers) {
      const marker = L.marker(m.position, { icon: m.color === 'red' ? redIcon : greenIcon })
        .bindPopup(m.label)
        .addTo(map);
      layers.push(marker);
    }

    if (polylines.length > 0) {
      const allPoints = polylines.flatMap((pl) => pl.positions);
      if (allPoints.length > 0) map.fitBounds(L.latLngBounds(allPoints), { padding: [20, 20] });
    }

    return () => { layers.forEach((l) => map.removeLayer(l)); };
  }, [polylines, markers]);

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} aria-label="Route map" />;
}
