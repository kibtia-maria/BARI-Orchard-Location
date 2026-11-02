/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { BARIOffice, Orchard, UpazilaGeoJSON } from '../types';
import { Maximize2, RotateCcw, Eye, EyeOff, Info, Building2, Trees } from 'lucide-react';

interface MapProps {
  offices: BARIOffice[];
  orchards: Orchard[];
  selectedDistrict: string;
  selectedUpazila: string;
  selectedOffice: BARIOffice | null;
  selectedOrchard: Orchard | null;
  onSelectOffice: (office: BARIOffice) => void;
  onSelectOrchard: (orchard: Orchard) => void;
  geoJsonData: UpazilaGeoJSON | null;
  currentBasemap: string;
}

export const MapComponent: React.FC<MapProps> = ({
  offices,
  orchards,
  selectedDistrict,
  selectedUpazila,
  selectedOffice,
  selectedOrchard,
  onSelectOffice,
  onSelectOrchard,
  geoJsonData,
  currentBasemap
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const geoJsonLayerRef = useRef<L.GeoJSON | null>(null);
  const officesLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const orchardsLayerGroupRef = useRef<L.LayerGroup | null>(null);

  const [showBoundaries, setShowBoundaries] = useState(true);
  const [showOffices, setShowOffices] = useState(true);
  const [showOrchards, setShowOrchards] = useState(true);

  // Initialize Map Instance
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Default center Bangladesh: lat 23.8, lng 90.3, zoom 7
    const map = L.map(mapContainerRef.current, {
      center: [23.777176, 90.399452],
      zoom: 7,
      minZoom: 6,
      maxZoom: 19,
      zoomControl: false
    });

    // Add zoom control at bottom-right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Initial tile layer
    const initialTile = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors | BARI GIS'
    }).addTo(map);

    tileLayerRef.current = initialTile;

    // Layer groups for markers
    officesLayerGroupRef.current = L.layerGroup().addTo(map);
    orchardsLayerGroupRef.current = L.layerGroup().addTo(map);

    mapInstanceRef.current = map;

    // Invalidate size to ensure tiles render properly
    setTimeout(() => {
      map.invalidateSize();
    }, 250);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Basemap Layer when currentBasemap changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    let url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    let attribution = '&copy; OpenStreetMap contributors';

    if (currentBasemap === 'satellite') {
      url = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      attribution = 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';
    } else if (currentBasemap === 'carto') {
      url = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
      attribution = '&copy; OpenStreetMap &copy; CARTO';
    } else if (currentBasemap === 'topo') {
      url = 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
      attribution = 'Map data: &copy; OpenStreetMap, SRTM | Map style: &copy; OpenTopoMap (CC-BY-SA)';
    }

    const newLayer = L.tileLayer(url, { attribution, maxZoom: 19 }).addTo(map);
    tileLayerRef.current = newLayer;
  }, [currentBasemap]);

  // Update GeoJSON Upazila Boundaries Layer
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !geoJsonData) return;

    if (geoJsonLayerRef.current) {
      map.removeLayer(geoJsonLayerRef.current);
      geoJsonLayerRef.current = null;
    }

    if (!showBoundaries) return;

    // Filter features:
    // If upazila selected: show only that upazila (or emphasize it)
    // If district selected: show all upazilas in that district
    // If none selected: show all upazilas with light boundary
    const featuresToShow = geoJsonData.features.filter(f => {
      const p = f.properties;
      if (selectedUpazila && selectedDistrict) {
        return (
          p.dist_name?.toLowerCase() === selectedDistrict.toLowerCase() &&
          p.thana_name?.toLowerCase() === selectedUpazila.toLowerCase()
        );
      }
      if (selectedDistrict) {
        return p.dist_name?.toLowerCase() === selectedDistrict.toLowerCase();
      }
      return true; // show all
    });

    const isFiltered = Boolean(selectedDistrict || selectedUpazila);

    const geoLayer = L.geoJSON(
      {
        type: 'FeatureCollection',
        features: featuresToShow
      } as any,
      {
        style: feature => {
          const p = feature?.properties;
          const isTargetUpazila =
            selectedUpazila &&
            p?.thana_name?.toLowerCase() === selectedUpazila.toLowerCase();
          const isTargetDistrict =
            selectedDistrict &&
            p?.dist_name?.toLowerCase() === selectedDistrict.toLowerCase();

          if (isTargetUpazila) {
            return {
              color: '#047857',
              weight: 3,
              fillColor: '#10b981',
              fillOpacity: 0.35,
              dashArray: ''
            };
          }

          if (isTargetDistrict) {
            return {
              color: '#059669',
              weight: 2,
              fillColor: '#34d399',
              fillOpacity: 0.18,
              dashArray: ''
            };
          }

          return {
            color: '#0f766e',
            weight: 0.8,
            fillColor: '#14b8a6',
            fillOpacity: 0.04,
            dashArray: '2, 3'
          };
        },
        onEachFeature: (feature, layer) => {
          const p = feature.properties;
          const tooltipContent = `
            <div class="text-xs p-1 font-sans">
              <strong class="text-emerald-900 block font-semibold text-sm">${p.thana_name}</strong>
              <span class="text-slate-600 block">District: ${p.dist_name}</span>
              <span class="text-slate-400 text-[10px] block">Division: ${p.div_name}</span>
            </div>
          `;
          layer.bindTooltip(tooltipContent, {
            sticky: true,
            className: 'custom-leaflet-tooltip'
          });

          layer.on({
            mouseover: e => {
              const l = e.target;
              l.setStyle({
                weight: 2.5,
                fillOpacity: 0.4
              });
            },
            mouseout: e => {
              geoLayer.resetStyle(e.target);
            }
          });
        }
      }
    ).addTo(map);

    geoJsonLayerRef.current = geoLayer;

    // If filtered by district or upazila, fit bounds to the geometry!
    if (isFiltered && featuresToShow.length > 0) {
      try {
        const bounds = geoLayer.getBounds();
        if (bounds.isValid()) {
          map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
        }
      } catch (err) {
        console.error('Error fitting bounds', err);
      }
    }
  }, [geoJsonData, selectedDistrict, selectedUpazila, showBoundaries]);

  // Render BARI Office Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const group = officesLayerGroupRef.current;
    if (!map || !group) return;

    group.clearLayers();
    if (!showOffices) return;

    // Filter offices based on selected district / upazila
    const visibleOffices = offices.filter(o => {
      if (selectedDistrict && o.district.toLowerCase() !== selectedDistrict.toLowerCase()) {
        return false;
      }
      if (selectedUpazila && o.upazila.toLowerCase() !== selectedUpazila.toLowerCase()) {
        return false;
      }
      return true;
    });

    visibleOffices.forEach(office => {
      const isSelected = selectedOffice?.id === office.id;

      // Custom HTML Marker Icon
      const iconHtml = `
        <div class="relative group cursor-pointer flex flex-col items-center">
          <div class="w-10 h-10 rounded-2xl ${
            isSelected
              ? 'bg-amber-500 ring-4 ring-amber-300 ring-offset-2 ring-offset-slate-900 scale-110'
              : 'bg-emerald-900 hover:bg-emerald-800 ring-2 ring-emerald-400 shadow-xl'
          } flex items-center justify-center text-white transition-all transform hover:scale-110 shadow-lg">
            <svg class="w-5 h-5 ${isSelected ? 'text-slate-950' : 'text-amber-400'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
            </svg>
          </div>
          <div class="mt-1 px-2 py-0.5 rounded-md text-[11px] font-bold ${
            isSelected ? 'bg-amber-500 text-slate-950' : 'bg-emerald-950/95 text-emerald-200 border border-emerald-600/70'
          } whitespace-nowrap shadow-md pointer-events-none">
            ${office.shortName || office.name.split(',')[0]}
          </div>
          <div class="w-2 h-2 bg-emerald-900 rotate-45 -mt-1 ${isSelected ? 'bg-amber-500' : ''}"></div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'custom-office-marker',
        iconSize: [40, 60],
        iconAnchor: [20, 50],
        popupAnchor: [0, -45]
      });

      const marker = L.marker([office.latitude, office.longitude], {
        icon: customIcon,
        zIndexOffset: 1000
      });

      // Count orchards under this office
      const officeOrchards = orchards.filter(o => o.officeId === office.id);
      const totalTrees = officeOrchards.reduce(
        (sum, o) => sum + o.varieties.reduce((s, v) => s + (v.plants || 0), 0),
        0
      );

      const popupHtml = `
        <div class="p-2 min-w-[220px] font-sans">
          <div class="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 uppercase tracking-wide">
            <span class="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
            BARI Research Station
          </div>
          <h4 class="font-bold text-sm text-slate-900 mt-1 leading-snug">${office.name}</h4>
          <p class="text-xs text-slate-600 mt-1">${office.address}</p>
          <div class="mt-2.5 pt-2 border-t border-slate-200 grid grid-cols-2 gap-2 text-xs">
            <div class="bg-emerald-50 p-1.5 rounded">
              <span class="text-slate-500 block text-[10px]">Orchards</span>
              <strong class="text-emerald-900 font-bold text-sm">${officeOrchards.length}</strong>
            </div>
            <div class="bg-amber-50 p-1.5 rounded">
              <span class="text-slate-500 block text-[10px]">Total Trees</span>
              <strong class="text-amber-900 font-bold text-sm">${totalTrees}</strong>
            </div>
          </div>
          <button id="btn-select-office-${office.id}" class="mt-3 w-full py-1.5 px-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-medium transition-colors shadow-sm">
            Explore Orchards & Germplasm &rarr;
          </button>
        </div>
      `;

      marker.bindPopup(popupHtml, { className: 'custom-popup-card' });

      marker.on('popupopen', () => {
        const btn = document.getElementById(`btn-select-office-${office.id}`);
        if (btn) {
          btn.onclick = () => {
            onSelectOffice(office);
            marker.closePopup();
          };
        }
      });

      marker.on('click', () => {
        onSelectOffice(office);
      });

      group.addLayer(marker);
    });
  }, [offices, orchards, selectedDistrict, selectedUpazila, selectedOffice, showOffices, onSelectOffice]);

  // Render Orchard Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const group = orchardsLayerGroupRef.current;
    if (!map || !group) return;

    group.clearLayers();
    if (!showOrchards) return;

    // Filter orchards:
    // If an office is selected, show orchards belonging to that office
    // Otherwise, if district/upazila is selected, show orchards in that region
    // Otherwise show all orchards
    let visibleOrchards = orchards;

    if (selectedOffice) {
      visibleOrchards = orchards.filter(o => o.officeId === selectedOffice.id);
    } else if (selectedDistrict || selectedUpazila) {
      visibleOrchards = orchards.filter(o => {
        if (selectedDistrict && o.district.toLowerCase() !== selectedDistrict.toLowerCase()) {
          return false;
        }
        if (selectedUpazila && o.upazila.toLowerCase() !== selectedUpazila.toLowerCase()) {
          return false;
        }
        return true;
      });
    }

    visibleOrchards.forEach(orchard => {
      const isSelected = selectedOrchard?.id === orchard.id;
      const totalPlants = orchard.varieties.reduce((s, v) => s + (v.plants || 0), 0);
      const varietyCount = orchard.varieties.length;

      // Primary fruit name for marker label
      const primaryFruit = orchard.varieties[0]?.fruit || 'Fruit';

      const iconHtml = `
        <div class="relative group cursor-pointer flex flex-col items-center">
          ${
            isSelected
              ? '<span class="absolute -top-1 -left-1 w-9 h-9 rounded-full bg-amber-400/50 animate-ping"></span>'
              : ''
          }
          <div class="w-7 h-7 rounded-full ${
            isSelected
              ? 'bg-amber-500 ring-4 ring-amber-300 shadow-xl scale-125'
              : 'bg-emerald-600 hover:bg-emerald-500 ring-2 ring-white shadow-md'
          } flex items-center justify-center text-white transition-all transform hover:scale-125">
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
            </svg>
          </div>
          <div class="mt-0.5 px-1.5 py-0.2 rounded text-[10px] font-semibold ${
            isSelected ? 'bg-amber-600 text-white' : 'bg-slate-900/90 text-emerald-200 border border-slate-700'
          } whitespace-nowrap shadow-sm pointer-events-none">
            ${orchard.name}
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'custom-orchard-marker',
        iconSize: [28, 45],
        iconAnchor: [14, 30],
        popupAnchor: [0, -25]
      });

      const marker = L.marker([orchard.latitude, orchard.longitude], {
        icon: customIcon,
        zIndexOffset: isSelected ? 2000 : 500
      });

      const popupHtml = `
        <div class="p-2 min-w-[200px] font-sans">
          <div class="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 uppercase">
            <span class="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
            BARI Fruit Orchard
          </div>
          <h4 class="font-bold text-sm text-slate-900 mt-1">${orchard.name}</h4>
          <p class="text-xs text-slate-600 mt-0.5">${orchard.address}</p>
          <div class="mt-2 grid grid-cols-2 gap-1.5 text-xs bg-slate-50 p-2 rounded border border-slate-200">
            <div>
              <span class="text-slate-500 text-[10px] block">Area</span>
              <strong class="text-slate-800">${orchard.areaAcre} Acres</strong>
            </div>
            <div>
              <span class="text-slate-500 text-[10px] block">Varieties</span>
              <strong class="text-emerald-700">${varietyCount} types</strong>
            </div>
            <div>
              <span class="text-slate-500 text-[10px] block">Total Trees</span>
              <strong class="text-amber-700">${totalPlants}</strong>
            </div>
            <div>
              <span class="text-slate-500 text-[10px] block">Planting Date</span>
              <strong class="text-slate-700">${orchard.dateOfPlanting || 'N/A'}</strong>
            </div>
          </div>
          <button id="btn-select-orchard-${orchard.id}" class="mt-2.5 w-full py-1 px-3 bg-amber-600 hover:bg-amber-700 text-white rounded text-xs font-semibold shadow-sm transition-colors">
            View Details & Variety Table &rarr;
          </button>
        </div>
      `;

      marker.bindPopup(popupHtml, { className: 'custom-popup-card' });

      marker.on('popupopen', () => {
        const btn = document.getElementById(`btn-select-orchard-${orchard.id}`);
        if (btn) {
          btn.onclick = () => {
            onSelectOrchard(orchard);
            marker.closePopup();
          };
        }
      });

      marker.on('click', () => {
        onSelectOrchard(orchard);
      });

      group.addLayer(marker);
    });

    // If an orchard was selected, pan smoothly to it!
    if (selectedOrchard) {
      map.setView([selectedOrchard.latitude, selectedOrchard.longitude], 15, {
        animate: true
      });
    } else if (selectedOffice && visibleOrchards.length > 0) {
      // Fit bounds to office orchards
      const points: [number, number][] = visibleOrchards.map(o => [o.latitude, o.longitude]);
      points.push([selectedOffice.latitude, selectedOffice.longitude]);
      try {
        const b = L.latLngBounds(points);
        if (b.isValid()) {
          map.fitBounds(b, { padding: [50, 50], maxZoom: 15 });
        }
      } catch (err) {
        console.error('Bounds error', err);
      }
    }
  }, [
    orchards,
    selectedOffice,
    selectedOrchard,
    selectedDistrict,
    selectedUpazila,
    showOrchards,
    onSelectOrchard
  ]);

  // Reset to Bangladesh Whole View
  const handleResetView = () => {
    const map = mapInstanceRef.current;
    if (!map) return;
    map.setView([23.777176, 90.399452], 7, { animate: true });
  };

  return (
    <div className="relative w-full h-[520px] sm:h-[600px] lg:h-[680px] rounded-2xl overflow-hidden shadow-md border border-slate-300 bg-slate-100">
      {/* Leaflet Map Div */}
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Floating Map Controls & Overlays */}
      <div className="absolute top-3 left-3 z-20 flex flex-col gap-2">
        {/* Reset View Button */}
        <button
          onClick={handleResetView}
          title="Reset to Whole Bangladesh View"
          className="bg-white/95 hover:bg-slate-100 text-slate-800 p-2 rounded-xl shadow-md border border-slate-300 backdrop-blur-md transition-all flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
        >
          <RotateCcw className="w-4 h-4 text-emerald-700" />
          <span className="hidden sm:inline">Whole Map</span>
        </button>

        {/* Layer Toggle Toggles */}
        <div className="bg-white/95 backdrop-blur-md p-2.5 rounded-xl shadow-md border border-slate-300 flex flex-col gap-1.5 text-xs">
          <label className="flex items-center gap-1.5 text-slate-700 cursor-pointer select-none font-medium">
            <input
              type="checkbox"
              checked={showBoundaries}
              onChange={e => setShowBoundaries(e.target.checked)}
              className="rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
            />
            <span>Upazila Borders</span>
          </label>
          <label className="flex items-center gap-1.5 text-slate-700 cursor-pointer select-none font-medium">
            <input
              type="checkbox"
              checked={showOffices}
              onChange={e => setShowOffices(e.target.checked)}
              className="rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
            />
            <span>BARI Offices</span>
          </label>
          <label className="flex items-center gap-1.5 text-slate-700 cursor-pointer select-none font-medium">
            <input
              type="checkbox"
              checked={showOrchards}
              onChange={e => setShowOrchards(e.target.checked)}
              className="rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
            />
            <span>Fruit Orchards</span>
          </label>
        </div>
      </div>

      {/* Map Legend (Bottom Left) */}
      <div className="absolute bottom-3 left-3 z-20 bg-white/95 backdrop-blur-md p-2.5 rounded-xl shadow-md border border-slate-300 text-[11px] text-slate-700 max-w-[260px] hidden sm:block">
        <div className="font-bold text-xs text-slate-900 mb-1.5 flex items-center gap-1">
          <Info className="w-3.5 h-3.5 text-emerald-600" />
          <span>Map Legend</span>
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-emerald-900 border border-amber-400 flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-amber-400 rounded-xs"></div>
            </div>
            <span>BARI Office / Research Station</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded-full bg-emerald-600 ring-2 ring-white shadow-xs"></div>
            <span>Fruit Orchard Location</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-2 rounded border border-emerald-600 bg-emerald-500/20"></div>
            <span>Upazila Administrative Boundary</span>
          </div>
        </div>
      </div>
    </div>
  );
};
