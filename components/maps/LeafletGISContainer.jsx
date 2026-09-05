"use client";

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet Default Icon URLs for Webpack / Next.js
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

export default function LeafletGISContainer({
  mandiData,
  selectedMandi,
  onSelectMandi,
  filterType,
  searchQuery
}) {
  const mapRef = useRef(null);
  const leafletMapRef = useRef(null);
  const markersRef = useRef([]);
  const routePolylineRef = useRef(null);

  // Initialize Leaflet Map Instance
  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current) return;

    if (!leafletMapRef.current) {
      // Center India [20.5937, 78.9629], zoom 5
      const map = L.map(mapRef.current, {
        center: [20.5937, 78.9629],
        zoom: 5,
        zoomControl: true,
        attributionControl: false
      });

      // CartoDB Dark Matter Tile Layer
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 18,
        subdomains: 'abcd',
      }).addTo(map);

      leafletMapRef.current = map;
    }

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []);

  // Update Markers and Active Route on Map when selectedMandi or filters change
  useEffect(() => {
    const map = leafletMapRef.current;
    if (!map) return;

    // Clear existing markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    if (routePolylineRef.current) {
      routePolylineRef.current.remove();
      routePolylineRef.current = null;
    }

    // Filter mandis based on search & filterType
    const filtered = mandiData.filter((m) => {
      const matchSearch = searchQuery === '' || 
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.district.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (!matchSearch) return false;
      if (filterType === 'OVERPRODUCING') return m.capacityMT >= 50000;
      if (filterType === 'STANDARD') return m.capacityMT < 50000;
      return true;
    });

    // Custom HTML Pin DivIcon
    const createCustomIcon = (mandi, isSelected) => {
      const isOverproducing = mandi.capacityMT >= 50000;
      const colorClass = isSelected 
        ? 'bg-emerald-400 border-white ring-4 ring-emerald-500/50 scale-125' 
        : isOverproducing 
        ? 'bg-rose-500 border-rose-300' 
        : 'bg-cyan-400 border-cyan-200';

      return L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div class="relative flex items-center justify-center">
            <span class="w-6 h-6 rounded-full ${colorClass} border-2 shadow-lg flex items-center justify-center text-[10px] font-bold text-slate-950 font-mono">
              ${mandi.hasColdStorage ? '❄' : '📦'}
            </span>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });
    };

    // Plot Mandi Markers
    filtered.forEach((mandi) => {
      const isSelected = selectedMandi?.id === mandi.id;
      const marker = L.marker([mandi.lat, mandi.lng], {
        icon: createCustomIcon(mandi, isSelected)
      }).addTo(map);

      // Tooltip popup
      marker.bindPopup(`
        <div class="p-2 font-mono text-xs text-slate-900 space-y-1 min-w-[180px]">
          <div class="font-bold text-emerald-700">${mandi.id}: ${mandi.name}</div>
          <div>District: <strong>${mandi.district}, ${mandi.state}</strong></div>
          <div>Type: <strong>${mandi.type}</strong></div>
          <div>Capacity: <strong class="text-emerald-600">${mandi.capacityMT.toLocaleString()} MT</strong></div>
          <div>Coordinates: (${mandi.lat.toFixed(4)}, ${mandi.lng.toFixed(4)})</div>
        </div>
      `);

      marker.on('click', () => {
        onSelectMandi(mandi);
      });

      markersRef.current.push(marker);
    });

    // Draw Route Polyline from Origin FPO (Nashik 20.0059, 73.7898) to selectedMandi
    if (selectedMandi) {
      const originLat = 20.0059;
      const originLng = 73.7898;
      const destLat = selectedMandi.lat;
      const destLng = selectedMandi.lng;

      // Curved intermediate point
      const midLat = (originLat + destLat) / 2 + 0.3;
      const midLng = (originLng + destLng) / 2 - 0.2;

      const routeLatLngs = [
        [originLat, originLng],
        [midLat, midLng],
        [destLat, destLng]
      ];

      const polyline = L.polyline(routeLatLngs, {
        color: '#10b981',
        weight: 4,
        dashArray: '8, 8',
        opacity: 0.95
      }).addTo(map);

      routePolylineRef.current = polyline;

      // Pan map smoothly to selected location
      map.panTo([destLat, destLng], { animate: true, duration: 1 });
    }

  }, [mandiData, selectedMandi, filterType, searchQuery, onSelectMandi]);

  return <div ref={mapRef} className="w-full h-full min-h-[520px] rounded-3xl" />;
}
