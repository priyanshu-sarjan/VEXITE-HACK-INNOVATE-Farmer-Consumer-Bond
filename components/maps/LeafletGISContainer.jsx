"use client";

import React, { useEffect, useRef } from 'react';

export default function LeafletGISContainer({
  mandiData,
  districtData,
  selectedLocation,
  onSelectLocation,
  filterType,
  searchQuery,
  activeLayer = 'DISTRICTS' // 'DISTRICTS' | 'MANDIS' | 'ALL'
}) {
  const mapRef = useRef(null);
  const leafletMapRef = useRef(null);
  const leafletInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const routePolylineRef = useRef(null);

  // Initialize Leaflet Map Instance on client-side only
  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current) return;

    let isMounted = true;

    async function initMap() {
      const L = (await import('leaflet')).default;
      leafletInstanceRef.current = L;

      // Fix Leaflet Default Icon URLs for Webpack / Next.js
      if (L.Icon && L.Icon.Default && L.Icon.Default.prototype) {
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
          iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
        });
      }

      if (!isMounted || !mapRef.current) return;

      if (!leafletMapRef.current) {
        // Center Tamil Nadu / Central India [11.1271, 78.6569], zoom 7
        const map = L.map(mapRef.current, {
          center: [11.1271, 78.6569],
          zoom: 7,
          zoomControl: true,
          attributionControl: false
        });

        // CartoDB Dark Matter Tile Layer
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
          maxZoom: 18,
          subdomains: 'abcd',
        }).addTo(map);

        leafletMapRef.current = map;
        renderMapElements(L, map);
      }
    }

    initMap();

    return () => {
      isMounted = false;
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []);

  // Function to render markers and polyline
  const renderMapElements = (L, map) => {
    if (!L || !map) return;

    // Clear existing markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    if (routePolylineRef.current) {
      routePolylineRef.current.remove();
      routePolylineRef.current = null;
    }

    // 1. Render Real Geotagged District Markers (Tamil Nadu 31 Districts)
    if (activeLayer === 'DISTRICTS' || activeLayer === 'ALL') {
      const districtsList = districtData || [];
      const filteredDistricts = districtsList.filter((d) => {
        const matchSearch = searchQuery === '' || 
          d.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.majorSpices.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
        
        if (!matchSearch) return false;
        if (filterType === 'OVERPRODUCING') return d.isOverproducing;
        if (filterType === 'STANDARD') return !d.isOverproducing;
        return true;
      });

      filteredDistricts.forEach((d) => {
        const isSelected = selectedLocation?.district === d.district;
        const colorClass = isSelected
          ? 'bg-emerald-400 border-white ring-4 ring-emerald-500/50 scale-125'
          : d.isOverproducing
          ? 'bg-rose-500 border-rose-300 animate-pulse'
          : 'bg-emerald-500 border-emerald-300';

        const customIcon = L.divIcon({
          className: 'custom-district-marker',
          html: `
            <div class="relative flex items-center justify-center">
              <span class="w-7 h-7 rounded-full ${colorClass} border-2 shadow-lg flex items-center justify-center text-[10px] font-bold text-slate-950 font-mono">
                ${d.isOverproducing ? '🌶️' : '🌾'}
              </span>
            </div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14]
        });

        const marker = L.marker([d.lat, d.lng], { icon: customIcon }).addTo(map);

        marker.bindPopup(`
          <div class="p-2.5 font-mono text-xs text-slate-900 space-y-1.5 min-w-[210px]">
            <div class="font-bold text-emerald-800 text-sm flex items-center justify-between">
              <span>${d.district} District</span>
              <span class="${d.isOverproducing ? 'text-rose-600 font-extrabold' : 'text-emerald-600'} text-[10px]">
                ${d.isOverproducing ? 'OVERPRODUCING' : 'STANDARD'}
              </span>
            </div>
            <div>State: <strong>${d.state}</strong></div>
            <div>Area: <strong>${d.areaHa.toLocaleString()} Ha</strong></div>
            <div>Production: <strong>${d.productionTonnes.toLocaleString()} Tonnes</strong></div>
            <div>Productivity: <strong class="${d.productivity > 25 ? 'text-rose-600 font-extrabold' : 'text-emerald-700'}">${d.productivity} T/Ha</strong></div>
            <div>Major Spices: <strong>${d.majorSpices.join(', ')}</strong></div>
            <div class="text-[10px] text-slate-500">GPS: (${d.lat.toFixed(4)}, ${d.lng.toFixed(4)})</div>
          </div>
        `);

        marker.on('click', () => {
          if (onSelectLocation) onSelectLocation(d);
        });

        markersRef.current.push(marker);
      });
    }

    // 2. Render Mandi & Warehouse Markers
    if (activeLayer === 'MANDIS' || activeLayer === 'ALL') {
      const mandisList = mandiData || [];
      const filteredMandis = mandisList.filter((m) => {
        const matchSearch = searchQuery === '' || 
          m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.district.toLowerCase().includes(searchQuery.toLowerCase());
        
        if (!matchSearch) return false;
        if (filterType === 'OVERPRODUCING') return m.capacityMT >= 50000;
        if (filterType === 'STANDARD') return m.capacityMT < 50000;
        return true;
      });

      filteredMandis.forEach((mandi) => {
        const isSelected = selectedLocation?.id === mandi.id;
        const isOverproducing = mandi.capacityMT >= 50000;
        const colorClass = isSelected 
          ? 'bg-emerald-400 border-white ring-4 ring-emerald-500/50 scale-125' 
          : isOverproducing 
          ? 'bg-amber-500 border-amber-300' 
          : 'bg-cyan-400 border-cyan-200';

        const customIcon = L.divIcon({
          className: 'custom-mandi-marker',
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

        const marker = L.marker([mandi.lat, mandi.lng], { icon: customIcon }).addTo(map);

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
          if (onSelectLocation) onSelectLocation(mandi);
        });

        markersRef.current.push(marker);
      });
    }

    // Draw Active Route Polyline if location selected
    if (selectedLocation && selectedLocation.lat && selectedLocation.lng) {
      const originLat = 11.6643; // Salem Hub
      const originLng = 78.1460;
      const destLat = selectedLocation.lat;
      const destLng = selectedLocation.lng;

      const midLat = (originLat + destLat) / 2 + 0.15;
      const midLng = (originLng + destLng) / 2 - 0.1;

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

      // Smooth pan to selected coordinates
      map.panTo([destLat, destLng], { animate: true, duration: 1 });
    }
  };

  // Update Markers and Active Route on Map when data/filters change
  useEffect(() => {
    const L = leafletInstanceRef.current;
    const map = leafletMapRef.current;
    if (L && map) {
      renderMapElements(L, map);
    }
  }, [mandiData, districtData, selectedLocation, filterType, searchQuery, activeLayer, onSelectLocation]);

  return <div ref={mapRef} className="w-full h-full min-h-[520px] rounded-3xl" />;
}

