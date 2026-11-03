/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Trees,
  Apple,
  Dna,
  Hash,
  Ruler,
  Calendar,
  MapPin,
  ExternalLink,
  Copy,
  Check,
  ChevronRight,
  ArrowLeft,
  Edit,
  PieChart,
  Building2,
  Camera,
  Search,
  Maximize2,
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';
import { BARIOffice, Orchard, AggregatedStats } from '../types';

interface RightPanelProps {
  stats: AggregatedStats;
  selectedDistrict: string;
  selectedUpazila: string;
  selectedOffice: BARIOffice | null;
  selectedOrchard: Orchard | null;
  onSelectOffice: (office: BARIOffice | null) => void;
  onSelectOrchard: (orchard: Orchard | null) => void;
  orchards: Orchard[];
  offices: BARIOffice[];
  onEditOrchard: (orchard: Orchard) => void;
  onOpenAdminWithImages?: () => void;
}

export type RightPanelTab = 'summary' | 'orchards' | 'fruits' | 'varieties';

export const RightPanel: React.FC<RightPanelProps> = ({
  stats,
  selectedDistrict,
  selectedUpazila,
  selectedOffice,
  selectedOrchard,
  onSelectOffice,
  onSelectOrchard,
  orchards,
  offices,
  onEditOrchard,
  onOpenAdminWithImages
}) => {
  const [activeTab, setActiveTab] = useState<RightPanelTab>('summary');
  const [areaUnit, setAreaUnit] = useState<'acre' | 'hector'>('acre');
  const [copiedCoords, setCopiedCoords] = useState(false);
  const [varietySearch, setVarietySearch] = useState('');
  const [orchardSearch, setOrchardSearch] = useState('');
  const [fruitTypeSearch, setFruitTypeSearch] = useState('');
  const [varietyListSearch, setVarietyListSearch] = useState('');
  const [activeLightboxImage, setActiveLightboxImage] = useState<{ url: string; title: string } | null>(null);

  // If user selects an orchard from map, automatically switch tab to 'orchards'
  useEffect(() => {
    if (selectedOrchard) {
      setActiveTab('orchards');
    }
  }, [selectedOrchard]);

  const handleCopyCoords = (lat: number, lng: number) => {
    navigator.clipboard.writeText(`${lat}, ${lng}`);
    setCopiedCoords(true);
    setTimeout(() => setCopiedCoords(false), 2000);
  };

  const regionLabel = selectedUpazila && selectedDistrict
    ? `${selectedUpazila} Upazila, ${selectedDistrict}`
    : selectedDistrict
    ? `${selectedDistrict} District`
    : 'All Bangladesh';

  // Compute all unique varieties across the current filtered orchards for the 'varieties' tab
  const allVarietiesSummary = useMemo(() => {
    const map = new Map<string, {
      variety: string;
      fruit: string;
      totalPlants: number;
      orchards: { id: string; name: string; plants: number; upazila: string }[];
      dates: string[];
    }>();

    orchards.forEach(o => {
      o.varieties.forEach(v => {
        const key = `${v.fruit}:::${v.variety}`;
        if (!map.has(key)) {
          map.set(key, {
            variety: v.variety,
            fruit: v.fruit,
            totalPlants: 0,
            orchards: [],
            dates: []
          });
        }
        const item = map.get(key)!;
        item.totalPlants += v.plants || 0;
        item.orchards.push({
          id: o.id,
          name: o.name,
          plants: v.plants || 0,
          upazila: o.upazila
        });
        if (v.date || o.dateOfPlanting) {
          item.dates.push(v.date || o.dateOfPlanting);
        }
      });
    });

    return Array.from(map.values()).sort((a, b) => b.totalPlants - a.totalPlants);
  }, [orchards]);

  // Compute fruit species details for the 'fruits' tab
  const fruitTypesDetailed = useMemo(() => {
    const map = new Map<string, {
      fruit: string;
      totalTrees: number;
      varieties: Map<string, number>;
      orchards: Set<string>;
    }>();

    orchards.forEach(o => {
      o.varieties.forEach(v => {
        if (!map.has(v.fruit)) {
          map.set(v.fruit, {
            fruit: v.fruit,
            totalTrees: 0,
            varieties: new Map(),
            orchards: new Set()
          });
        }
        const f = map.get(v.fruit)!;
        f.totalTrees += v.plants || 0;
        f.orchards.add(o.name);
        const curVarCount = f.varieties.get(v.variety) || 0;
        f.varieties.set(v.variety, curVarCount + (v.plants || 0));
      });
    });

    return Array.from(map.values())
      .map(item => ({
        fruit: item.fruit,
        totalTrees: item.totalTrees,
        varietiesCount: item.varieties.size,
        varietiesList: Array.from(item.varieties.entries()).map(([name, count]) => ({ name, count })),
        orchardsCount: item.orchards.size,
        orchardsList: Array.from(item.orchards)
      }))
      .sort((a, b) => b.totalTrees - a.totalTrees);
  }, [orchards]);

  // Filtered orchards list for Orchards Explorer tab
  const filteredOrchardList = orchards.filter(o => {
    if (!orchardSearch) return true;
    const q = orchardSearch.toLowerCase();
    return (
      o.name.toLowerCase().includes(q) ||
      o.address.toLowerCase().includes(q) ||
      o.upazila.toLowerCase().includes(q) ||
      o.varieties.some(v => v.fruit.toLowerCase().includes(q) || v.variety.toLowerCase().includes(q))
    );
  });

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl shadow-sm flex flex-col h-full max-h-full overflow-hidden">
      {/* ========================================================= */}
      {/* TAB BAR NAVIGATION                                        */}
      {/* ========================================================= */}
      <div className="flex items-center justify-between px-3 pt-2.5 pb-2 border-b border-slate-200 bg-slate-50/80 shrink-0">
        <div className="flex items-center gap-1 overflow-x-auto text-xs font-semibold scrollbar-none">
          <button
            onClick={() => {
              setActiveTab('summary');
              onSelectOrchard(null);
            }}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'summary'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Trees className="w-3.5 h-3.5" />
            <span>Orchard Summary</span>
          </button>

          <button
            onClick={() => setActiveTab('orchards')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'orchards'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Regional Orchards ({orchards.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('fruits')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'fruits'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Apple className="w-3.5 h-3.5" />
            <span>Fruit Types ({stats.totalFruitTypes})</span>
          </button>

          <button
            onClick={() => setActiveTab('varieties')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'varieties'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Dna className="w-3.5 h-3.5" />
            <span>Varieties ({stats.totalVarieties})</span>
          </button>
        </div>

        {/* Area Unit Switcher */}
        <div className="flex items-center bg-slate-200/80 p-0.5 rounded-lg text-[11px] shrink-0 ml-1">
          <button
            onClick={() => setAreaUnit('acre')}
            className={`px-2 py-0.5 rounded-md font-semibold transition-all cursor-pointer ${
              areaUnit === 'acre' ? 'bg-white text-emerald-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Acre
          </button>
          <button
            onClick={() => setAreaUnit('hector')}
            className={`px-2 py-0.5 rounded-md font-semibold transition-all cursor-pointer ${
              areaUnit === 'hector' ? 'bg-white text-emerald-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Ha
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SCROLLABLE / FIT PANEL BODY                               */}
      {/* ========================================================= */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 min-h-0">
        {/* ======================================================= */}
        {/* TAB 1: ORCHARD SUMMARY (FRONT / STARTING LAYER)         */}
        {/* ======================================================= */}
        {activeTab === 'summary' && (
          <div className="flex flex-col h-full justify-between space-y-4">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 leading-tight flex items-center gap-2">
                    <span>Orchard Summary</span>
                  </h2>
                  <span className="text-xs text-slate-500 block mt-0.5">
                    {regionLabel}
                  </span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-full border border-emerald-200">
                  BARI Directory
                </span>
              </div>

              {/* 6 Interactive Metric Tiles */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {/* 1. Total Orchards -> Opens Orchards Tab */}
                <button
                  onClick={() => setActiveTab('orchards')}
                  className="group text-left bg-gradient-to-br from-emerald-50 to-emerald-100/60 hover:from-emerald-100 hover:to-emerald-200/70 border border-emerald-200/90 rounded-xl p-3 flex flex-col justify-between transition-all cursor-pointer shadow-2xs hover:shadow-xs"
                >
                  <div className="flex items-center justify-between text-slate-700">
                    <span className="text-xs font-bold text-emerald-900">Total Orchards</span>
                    <Trees className="w-4 h-4 text-emerald-700" />
                  </div>
                  <div className="mt-2">
                    <div className="text-2xl font-black text-emerald-900 font-mono tracking-tight flex items-baseline gap-1">
                      {stats.totalOrchards}
                      <ArrowRight className="w-3.5 h-3.5 text-emerald-700 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                    </div>
                    <span className="text-[10px] text-emerald-700 font-medium">Click to open tab</span>
                  </div>
                </button>

                {/* 2. Fruit Types -> Opens Fruit Types Tab */}
                <button
                  onClick={() => setActiveTab('fruits')}
                  className="group text-left bg-gradient-to-br from-rose-50 to-rose-100/60 hover:from-rose-100 hover:to-rose-200/70 border border-rose-200/90 rounded-xl p-3 flex flex-col justify-between transition-all cursor-pointer shadow-2xs hover:shadow-xs"
                >
                  <div className="flex items-center justify-between text-slate-700">
                    <span className="text-xs font-bold text-rose-900">Fruit Types</span>
                    <Apple className="w-4 h-4 text-rose-600" />
                  </div>
                  <div className="mt-2">
                    <div className="text-2xl font-black text-rose-800 font-mono tracking-tight flex items-baseline gap-1">
                      {stats.totalFruitTypes}
                      <ArrowRight className="w-3.5 h-3.5 text-rose-700 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                    </div>
                    <span className="text-[10px] text-rose-700 font-medium">Click to open tab</span>
                  </div>
                </button>

                {/* 3. Fruit Varieties -> Opens Varieties Tab */}
                <button
                  onClick={() => setActiveTab('varieties')}
                  className="group text-left bg-gradient-to-br from-indigo-50 to-indigo-100/60 hover:from-indigo-100 hover:to-indigo-200/70 border border-indigo-200/90 rounded-xl p-3 flex flex-col justify-between transition-all cursor-pointer shadow-2xs hover:shadow-xs"
                >
                  <div className="flex items-center justify-between text-slate-700">
                    <span className="text-xs font-bold text-indigo-900">Varieties</span>
                    <Dna className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div className="mt-2">
                    <div className="text-2xl font-black text-indigo-800 font-mono tracking-tight flex items-baseline gap-1">
                      {stats.totalVarieties}
                      <ArrowRight className="w-3.5 h-3.5 text-indigo-700 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                    </div>
                    <span className="text-[10px] text-indigo-700 font-medium">Click to open tab</span>
                  </div>
                </button>

                {/* 4. Total Trees */}
                <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="text-xs font-semibold text-slate-700">Total Trees</span>
                    <Hash className="w-4 h-4 text-teal-600" />
                  </div>
                  <div className="mt-2">
                    <div className="text-2xl font-black text-teal-800 font-mono tracking-tight">
                      {stats.totalTrees.toLocaleString()}
                    </div>
                    <span className="text-[10px] text-slate-500">fruit plants</span>
                  </div>
                </div>

                {/* 5. Total Area */}
                <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="text-xs font-semibold text-slate-700">Total Area</span>
                    <Ruler className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="mt-2">
                    <div className="text-2xl font-black text-amber-800 font-mono tracking-tight">
                      {areaUnit === 'acre' ? stats.totalAreaAcre : stats.totalAreaHector}
                    </div>
                    <span className="text-[10px] text-slate-500">
                      {areaUnit === 'acre' ? 'Acres' : 'Hectares'}
                    </span>
                  </div>
                </div>

                {/* 6. BARI Offices */}
                <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="text-xs font-semibold text-slate-700">BARI Offices</span>
                    <Building2 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="mt-2">
                    <div className="text-2xl font-black text-slate-800 font-mono tracking-tight">
                      {stats.totalOffices}
                    </div>
                    <span className="text-[10px] text-slate-500">research stations</span>
                  </div>
                </div>
              </div>

              {/* Quick Fruit Germplasm Diversity Bar */}
              {stats.fruitBreakdown.length > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      <PieChart className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Top Fruit Species in Region</span>
                    </span>
                    <button
                      onClick={() => setActiveTab('fruits')}
                      className="text-[11px] text-emerald-700 hover:text-emerald-900 font-semibold hover:underline cursor-pointer"
                    >
                      View All &rarr;
                    </button>
                  </div>
                  <div className="space-y-1.5">
                    {stats.fruitBreakdown.slice(0, 4).map((item, idx) => {
                      const percent = Math.min(100, Math.round((item.totalTrees / (stats.totalTrees || 1)) * 100));
                      return (
                        <div key={idx} className="text-xs">
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="font-medium text-slate-700">{item.fruit}</span>
                            <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                              <span>{item.varietiesCount} varieties</span>
                              <strong className="text-emerald-800 font-mono">{item.totalTrees}</strong>
                            </div>
                          </div>
                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${percent}%` }}></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Action Hint */}
            <div className="bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-100 flex items-center justify-between text-xs text-emerald-900">
              <span className="text-[11px]">
                Click <strong>Total Orchards</strong> above or any pin on map to inspect orchards and photos.
              </span>
              <button
                onClick={() => setActiveTab('orchards')}
                className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-semibold text-[11px] cursor-pointer"
              >
                Explore &rarr;
              </button>
            </div>
          </div>
        )}

        {/* ======================================================= */}
        {/* TAB 2: REGIONAL ORCHARDS EXPLORER & SPECIFIC ORCHARD     */}
        {/* ======================================================= */}
        {activeTab === 'orchards' && (
          <div>
            {selectedOrchard ? (
              /* SPECIFIC ORCHARD DETAILS VIEW WITH ASSOCIATED IMAGES */
              <div className="space-y-4">
                {/* Header with Back button */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <button
                    onClick={() => onSelectOrchard(null)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 hover:text-emerald-950 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4 text-emerald-700" />
                    <span>Back to Orchards List</span>
                  </button>
                  <button
                    onClick={() => onEditOrchard(selectedOrchard)}
                    className="px-2.5 py-1 text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg border border-emerald-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Edit Orchard</span>
                  </button>
                </div>

                {/* Orchard Title & Coordinates */}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                      Orchard Site
                    </span>
                    <span className="text-xs text-slate-500">
                      {selectedOrchard.upazila}, {selectedOrchard.district}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">
                    {selectedOrchard.name}
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">{selectedOrchard.address}</p>
                </div>

                {/* Associated Orchard Images (SPECIFIC TO THIS ORCHARD) */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                      <Camera className="w-4 h-4 text-emerald-700" />
                      <span>Orchard Field Images ({selectedOrchard.images?.length || 0})</span>
                    </span>
                    <button
                      onClick={() => onEditOrchard(selectedOrchard)}
                      className="text-[11px] text-emerald-700 hover:text-emerald-900 font-semibold hover:underline cursor-pointer"
                    >
                      + Add / Manage
                    </button>
                  </div>

                  {selectedOrchard.images && selectedOrchard.images.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {selectedOrchard.images.map((imgUrl, i) => (
                        <div
                          key={i}
                          onClick={() => setActiveLightboxImage({ url: imgUrl, title: `${selectedOrchard.name} - Photo ${i + 1}` })}
                          className="relative group rounded-xl overflow-hidden border border-slate-200 aspect-4/3 bg-slate-200 cursor-pointer shadow-2xs hover:shadow transition-all"
                        >
                          <img
                            src={imgUrl}
                            alt={`${selectedOrchard.name} ${i + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 rounded p-1 text-white">
                            <Maximize2 className="w-3 h-3" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-4 text-center text-slate-500 text-xs bg-white rounded-lg border border-dashed border-slate-300">
                      <Camera className="w-5 h-5 mx-auto text-slate-400 mb-1" />
                      <span>No images currently associated with this orchard.</span>
                      <button
                        onClick={() => onEditOrchard(selectedOrchard)}
                        className="block mx-auto mt-1 text-emerald-700 font-semibold hover:underline cursor-pointer text-[11px]"
                      >
                        Click to add photos in Admin
                      </button>
                    </div>
                  )}
                </div>

                {/* Geographic Coordinates & Navigation */}
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs">
                    <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span className="font-mono text-slate-800 font-semibold text-[11px]">
                      {selectedOrchard.latitude.toFixed(6)}, {selectedOrchard.longitude.toFixed(6)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleCopyCoords(selectedOrchard.latitude, selectedOrchard.longitude)}
                      className="px-2 py-1 text-xs bg-white hover:bg-slate-100 text-slate-700 rounded-lg border border-slate-200 flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      {copiedCoords ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCoords ? 'Copied' : 'Copy GPS'}</span>
                    </button>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${selectedOrchard.latitude},${selectedOrchard.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2 py-1 text-xs bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg flex items-center gap-1 transition-colors font-medium cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Google Maps</span>
                    </a>
                  </div>
                </div>

                {/* Quick Metrics Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="bg-slate-50 p-2 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 block uppercase">Area</span>
                    <strong className="text-slate-800 font-bold">{selectedOrchard.areaAcre} Acres</strong>
                    <span className="text-[10px] text-slate-400 block">({selectedOrchard.areaHector} Ha)</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 block uppercase">Planting Date</span>
                    <strong className="text-slate-800 font-bold block">{selectedOrchard.dateOfPlanting || 'N/A'}</strong>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 block uppercase">Varieties</span>
                    <strong className="text-indigo-700 font-bold font-mono text-base block">{selectedOrchard.varieties.length}</strong>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 block uppercase">Total Trees</span>
                    <strong className="text-teal-700 font-bold font-mono text-base block">
                      {selectedOrchard.varieties.reduce((s, v) => s + (v.plants || 0), 0)}
                    </strong>
                  </div>
                </div>

                {/* Varieties Breakdown Table */}
                <div className="bg-white rounded-xl border border-slate-200 p-3">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                      <Apple className="w-4 h-4 text-emerald-700" />
                      <span>Cultivated Varieties ({selectedOrchard.varieties.length})</span>
                    </h4>
                    <input
                      type="text"
                      placeholder="Filter..."
                      value={varietySearch}
                      onChange={e => setVarietySearch(e.target.value)}
                      className="text-xs bg-slate-50 text-slate-800 px-2 py-1 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 w-28"
                    />
                  </div>

                  <div className="overflow-x-auto max-h-48">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 sticky top-0">
                        <tr className="border-b border-slate-200 text-slate-500 text-[11px]">
                          <th className="py-1 px-2 font-semibold">Fruit</th>
                          <th className="py-1 px-2 font-semibold">Variety</th>
                          <th className="py-1 px-2 font-semibold text-right">Trees</th>
                          <th className="py-1 px-2 font-semibold text-right">Planted</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-sans">
                        {selectedOrchard.varieties
                          .filter(v => {
                            const q = varietySearch.toLowerCase();
                            return v.fruit.toLowerCase().includes(q) || v.variety.toLowerCase().includes(q);
                          })
                          .map((v, i) => (
                            <tr key={i} className="hover:bg-slate-50 transition-colors">
                              <td className="py-1.5 px-2">
                                <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded text-[11px] border border-emerald-100">
                                  {v.fruit}
                                </span>
                              </td>
                              <td className="py-1.5 px-2 text-slate-800 font-medium">{v.variety}</td>
                              <td className="py-1.5 px-2 text-right font-mono font-bold text-amber-700">{v.plants}</td>
                              <td className="py-1.5 px-2 text-right text-slate-500 text-[11px]">{v.date || selectedOrchard.dateOfPlanting || '—'}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              /* REGIONAL ORCHARDS LIST MODE */
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-2 mb-2 border-b border-slate-100 gap-2">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-700 block">
                      Regional Orchards Summary
                    </span>
                    <h3 className="text-sm font-bold text-slate-900">
                      Orchard Sites in {regionLabel} ({filteredOrchardList.length})
                    </h3>
                  </div>
                  <div className="relative w-full sm:w-44">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search..."
                      value={orchardSearch}
                      onChange={e => setOrchardSearch(e.target.value)}
                      className="w-full bg-slate-50 text-slate-800 text-xs rounded-lg pl-8 pr-3 py-1.5 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  {filteredOrchardList.map(orchard => {
                    const totalPlants = orchard.varieties.reduce((s, v) => s + (v.plants || 0), 0);
                    const fruits = Array.from(new Set(orchard.varieties.map(v => v.fruit)));
                    const hasPhotos = orchard.images && orchard.images.length > 0;

                    return (
                      <div
                        key={orchard.id}
                        onClick={() => onSelectOrchard(orchard)}
                        className="p-3 bg-slate-50 hover:bg-emerald-50/70 rounded-xl border border-slate-200 hover:border-emerald-300 transition-all cursor-pointer group shadow-2xs"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            {hasPhotos ? (
                              <img
                                src={orchard.images![0]}
                                alt={orchard.name}
                                className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200">
                                <Trees className="w-6 h-6" />
                              </div>
                            )}
                            <div>
                              <div className="flex items-center gap-1.5">
                                <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                                  {orchard.name}
                                </h4>
                                <span className="text-[10px] font-medium text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                                  {orchard.upazila}
                                </span>
                              </div>
                              <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{orchard.address}</p>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 transition-colors mt-2 shrink-0" />
                        </div>

                        <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-slate-600 pl-14">
                          <span>Area: <strong className="text-slate-800">{orchard.areaAcre} Acres</strong></span>
                          <span>•</span>
                          <span>Trees: <strong className="text-teal-700 font-mono font-bold">{totalPlants}</strong></span>
                          <span>•</span>
                          <span>Varieties: <strong className="text-indigo-700 font-mono font-bold">{orchard.varieties.length}</strong></span>
                          {hasPhotos && (
                            <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-0.5 ml-auto">
                              <Camera className="w-3 h-3" />
                              {orchard.images!.length} photo{orchard.images!.length > 1 ? 's' : ''}
                            </span>
                          )}
                        </div>

                        {/* Fruit Species Tags */}
                        <div className="mt-2 flex flex-wrap gap-1 pl-14">
                          {fruits.map((fr, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] bg-white text-emerald-800 px-1.5 py-0.5 rounded border border-emerald-100 font-medium"
                            >
                              {fr}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}

                  {filteredOrchardList.length === 0 && (
                    <div className="py-8 text-center text-slate-400 text-xs">
                      No orchards match your current filter.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================================= */}
        {/* TAB 3: FRUIT TYPES SUMMARY (NEW TAB)                    */}
        {/* ======================================================= */}
        {activeTab === 'fruits' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-rose-700 block">
                  Germplasm Species
                </span>
                <h3 className="text-sm font-bold text-slate-900">
                  Fruit Types Summary ({fruitTypesDetailed.length} Species)
                </h3>
              </div>
              <div className="relative w-36">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter fruits..."
                  value={fruitTypeSearch}
                  onChange={e => setFruitTypeSearch(e.target.value)}
                  className="w-full bg-slate-50 text-slate-800 text-xs rounded-lg pl-7 pr-2 py-1 border border-slate-200"
                />
              </div>
            </div>

            <div className="space-y-2.5">
              {fruitTypesDetailed
                .filter(item => item.fruit.toLowerCase().includes(fruitTypeSearch.toLowerCase()))
                .map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-200 shadow-2xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-rose-50 text-rose-600 border border-rose-200">
                          <Apple className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">{item.fruit}</h4>
                          <span className="text-[10px] text-slate-500">
                            Cultivated in {item.orchardsCount} orchard site{item.orchardsCount > 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-base font-black text-rose-700 font-mono">
                          {item.totalTrees}
                        </div>
                        <span className="text-[10px] text-slate-500">total plants</span>
                      </div>
                    </div>

                    {/* Varieties under this fruit */}
                    <div className="bg-white p-2 rounded-lg border border-slate-200/80">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                        Registered Cultivars ({item.varietiesCount})
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {item.varietiesList.map((v, i) => (
                          <span
                            key={i}
                            className="text-[11px] bg-slate-50 text-slate-700 px-2 py-0.5 rounded border border-slate-200 flex items-center gap-1 font-medium"
                          >
                            <span>{v.name}</span>
                            <span className="text-rose-700 font-mono font-bold text-[10px]">({v.count})</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}

              {fruitTypesDetailed.length === 0 && (
                <div className="py-8 text-center text-slate-400 text-xs">
                  No fruit species found in this region.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ======================================================= */}
        {/* TAB 4: VARIETIES SUMMARY (NEW TAB)                      */}
        {/* ======================================================= */}
        {activeTab === 'varieties' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-700 block">
                  Cultivar Registry
                </span>
                <h3 className="text-sm font-bold text-slate-900">
                  Varieties Summary ({allVarietiesSummary.length} Cultivars)
                </h3>
              </div>
              <div className="relative w-36">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter varieties..."
                  value={varietyListSearch}
                  onChange={e => setVarietyListSearch(e.target.value)}
                  className="w-full bg-slate-50 text-slate-800 text-xs rounded-lg pl-7 pr-2 py-1 border border-slate-200"
                />
              </div>
            </div>

            <div className="space-y-2">
              {allVarietiesSummary
                .filter(item => {
                  const q = varietyListSearch.toLowerCase();
                  return item.variety.toLowerCase().includes(q) || item.fruit.toLowerCase().includes(q);
                })
                .map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-200 shadow-2xs text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-sm text-slate-900">{item.variety}</span>
                        <span className="text-[10px] bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded border border-emerald-100 font-medium">
                          {item.fruit}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-black text-indigo-700 text-sm">
                          {item.totalPlants}
                        </span>
                        <span className="text-[10px] text-slate-500 ml-1">trees</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-1 text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
                      <span className="text-slate-400 text-[10px]">Orchards:</span>
                      {item.orchards.map((orc, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            const found = orchards.find(o => o.id === orc.id);
                            if (found) {
                              onSelectOrchard(found);
                              setActiveTab('orchards');
                            }
                          }}
                          className="bg-white hover:bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded border border-slate-200 hover:border-emerald-300 font-medium cursor-pointer transition-colors"
                        >
                          {orc.name} ({orc.plants})
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

              {allVarietiesSummary.length === 0 && (
                <div className="py-8 text-center text-slate-400 text-xs">
                  No varieties found in this region.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox Modal for Enlarge Image Preview */}
      {activeLightboxImage && (
        <div
          onClick={() => setActiveLightboxImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="bg-white rounded-2xl overflow-hidden max-w-2xl w-full shadow-2xl border border-slate-200"
          >
            <div className="relative aspect-16/10 bg-slate-900">
              <img
                src={activeLightboxImage.url}
                alt={activeLightboxImage.title}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="p-4 flex items-center justify-between bg-white">
              <h4 className="font-bold text-sm text-slate-900">{activeLightboxImage.title}</h4>
              <button
                onClick={() => setActiveLightboxImage(null)}
                className="px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
