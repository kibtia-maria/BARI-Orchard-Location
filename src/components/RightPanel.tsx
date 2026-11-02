/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
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
  Sparkles
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
  galleryImages: { id: string; url: string; title: string; caption: string }[];
}

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
  onOpenAdminWithImages,
  galleryImages
}) => {
  const [areaUnit, setAreaUnit] = useState<'acre' | 'hector'>('acre');
  const [copiedCoords, setCopiedCoords] = useState(false);
  const [varietySearch, setVarietySearch] = useState('');
  const [orchardSearch, setOrchardSearch] = useState('');
  const [activeImagePreview, setActiveImagePreview] = useState<{ url: string; title: string; caption: string } | null>(null);

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

  // Filtered orchards list for Layer 2
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
    <div className="flex flex-col space-y-4">
      {/* ========================================================= */}
      {/* LAYER 1 (TOP LAYER): ORCHARD SUMMARY                      */}
      {/* ========================================================= */}
      <section className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 gap-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100">
              <Trees className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                Orchard Summary
              </h2>
              <span className="text-xs text-slate-500 block">
                {regionLabel}
              </span>
            </div>
          </div>

          {/* Unit Toggle */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => setAreaUnit('acre')}
              className={`px-2 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                areaUnit === 'acre'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Acres
            </button>
            <button
              onClick={() => setAreaUnit('hector')}
              className={`px-2 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                areaUnit === 'hector'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Ha
            </button>
          </div>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {/* Total Orchards (Clickable to view details) */}
          <button
            onClick={() => {
              if (selectedOrchard) {
                onSelectOrchard(null);
              }
              // Scroll to Layer 2 if needed
              document.getElementById('regional-orchards-explorer')?.scrollIntoView({ behavior: 'smooth' });
            }}
            title="Click to view orchard details"
            className="group text-left bg-gradient-to-br from-emerald-50/90 to-emerald-100/40 hover:from-emerald-100 hover:to-emerald-200/50 border border-emerald-200/80 rounded-xl p-3 flex flex-col justify-between transition-all cursor-pointer shadow-xs hover:shadow"
          >
            <div className="flex items-center justify-between text-slate-600">
              <span className="text-xs font-semibold text-emerald-900">Total Orchards</span>
              <Trees className="w-4 h-4 text-emerald-700" />
            </div>
            <div className="mt-2">
              <div className="text-2xl font-black text-emerald-800 font-mono tracking-tight flex items-baseline gap-1">
                {stats.totalOrchards}
                <span className="text-[10px] text-emerald-600 font-sans font-normal group-hover:underline">
                  (Click for list)
                </span>
              </div>
              <span className="text-[10px] text-emerald-700">active orchard sites</span>
            </div>
          </button>

          {/* Fruit Types */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-600">
              <span className="text-xs font-semibold text-slate-700">Fruit Types</span>
              <Apple className="w-4 h-4 text-rose-500" />
            </div>
            <div className="mt-2">
              <div className="text-2xl font-black text-rose-600 font-mono tracking-tight">
                {stats.totalFruitTypes}
              </div>
              <span className="text-[10px] text-slate-500">botanical species</span>
            </div>
          </div>

          {/* Varieties */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-600">
              <span className="text-xs font-semibold text-slate-700">Varieties</span>
              <Dna className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="mt-2">
              <div className="text-2xl font-black text-indigo-700 font-mono tracking-tight">
                {stats.totalVarieties}
              </div>
              <span className="text-[10px] text-slate-500">cultivars</span>
            </div>
          </div>

          {/* Total Trees */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-600">
              <span className="text-xs font-semibold text-slate-700">Total Trees</span>
              <Hash className="w-4 h-4 text-teal-600" />
            </div>
            <div className="mt-2">
              <div className="text-2xl font-black text-teal-700 font-mono tracking-tight">
                {stats.totalTrees.toLocaleString()}
              </div>
              <span className="text-[10px] text-slate-500">fruit plants</span>
            </div>
          </div>

          {/* Total Area */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-600">
              <span className="text-xs font-semibold text-slate-700">Total Area</span>
              <Ruler className="w-4 h-4 text-amber-600" />
            </div>
            <div className="mt-2">
              <div className="text-2xl font-black text-amber-700 font-mono tracking-tight">
                {areaUnit === 'acre' ? stats.totalAreaAcre : stats.totalAreaHector}
              </div>
              <span className="text-[10px] text-slate-500">
                {areaUnit === 'acre' ? 'Acres' : 'Hectares'}
              </span>
            </div>
          </div>

          {/* BARI Offices */}
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
      </section>

      {/* ========================================================= */}
      {/* LAYER 2 (SECOND LAYER): REGIONAL ORCHARDS EXPLORER        */}
      {/* ========================================================= */}
      <section
        id="regional-orchards-explorer"
        className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs"
      >
        {selectedOrchard ? (
          /* Single Orchard Detail Mode */
          <div className="space-y-4">
            {/* Header & Back Button */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <button
                onClick={() => onSelectOrchard(null)}
                className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 hover:text-emerald-950 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 text-emerald-700" />
                <span>Back to Regional Orchards Summary</span>
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
                  Orchard Details
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
                  <span>Cultivated Fruit Varieties ({selectedOrchard.varieties.length})</span>
                </h4>
                <input
                  type="text"
                  placeholder="Filter varieties..."
                  value={varietySearch}
                  onChange={e => setVarietySearch(e.target.value)}
                  className="text-xs bg-slate-50 text-slate-800 px-2 py-1 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 w-32"
                />
              </div>

              <div className="overflow-x-auto max-h-56">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 sticky top-0">
                    <tr className="border-b border-slate-200 text-slate-500 text-[11px]">
                      <th className="py-1.5 px-2 font-semibold">Fruit Species</th>
                      <th className="py-1.5 px-2 font-semibold">Variety / Cultivar</th>
                      <th className="py-1.5 px-2 font-semibold text-right">Trees</th>
                      <th className="py-1.5 px-2 font-semibold text-right">Date</th>
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
          /* Multi-Orchard List Mode under "Regional Orchards Summary" */
          <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 mb-3 border-b border-slate-100 gap-2">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-700 block">
                  Regional Orchards Summary
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  Regional Orchards Explorer ({filteredOrchardList.length})
                </h3>
              </div>
              <div className="relative w-full sm:w-48">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter orchards..."
                  value={orchardSearch}
                  onChange={e => setOrchardSearch(e.target.value)}
                  className="w-full bg-slate-50 text-slate-800 text-xs rounded-lg pl-8 pr-3 py-1.5 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Orchards Cards List */}
            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {filteredOrchardList.map(orchard => {
                const totalPlants = orchard.varieties.reduce((s, v) => s + (v.plants || 0), 0);
                const fruits = Array.from(new Set(orchard.varieties.map(v => v.fruit)));

                return (
                  <div
                    key={orchard.id}
                    onClick={() => onSelectOrchard(orchard)}
                    className="p-3 bg-slate-50 hover:bg-emerald-50/60 rounded-xl border border-slate-200 hover:border-emerald-300 transition-all cursor-pointer group shadow-2xs"
                  >
                    <div className="flex items-start justify-between">
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
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 transition-colors mt-1 shrink-0" />
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-slate-600">
                      <span>Area: <strong className="text-slate-800">{orchard.areaAcre} Acres</strong></span>
                      <span>•</span>
                      <span>Trees: <strong className="text-teal-700 font-mono font-bold">{totalPlants}</strong></span>
                      <span>•</span>
                      <span>Varieties: <strong className="text-indigo-700 font-mono font-bold">{orchard.varieties.length}</strong></span>
                    </div>

                    {/* Fruit Species Tags */}
                    <div className="mt-2 flex flex-wrap gap-1">
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
                  No orchards match your current location filter.
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      {/* ========================================================= */}
      {/* LAYER 3 (LAST LAYER): GERMPLASM BREAKDOWN & ORCHARD IMAGES*/}
      {/* ========================================================= */}
      <section className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
        {/* Fruit Germplasm Diversity Bars */}
        {stats.fruitBreakdown.length > 0 && (
          <div>
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <PieChart className="w-4 h-4 text-emerald-700" />
                <span>Fruit Germplasm Breakdown</span>
              </h3>
              <span className="text-[11px] font-mono text-slate-500">
                {stats.totalTrees.toLocaleString()} trees total
              </span>
            </div>

            <div className="space-y-2">
              {stats.fruitBreakdown.slice(0, 6).map((item, idx) => {
                const percent = Math.min(
                  100,
                  Math.round((item.totalTrees / (stats.totalTrees || 1)) * 100)
                );
                return (
                  <div key={idx} className="text-xs">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-semibold text-slate-800">{item.fruit}</span>
                      <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                        <span>{item.varietiesCount} varieties</span>
                        <strong className="text-emerald-800 font-mono">{item.totalTrees}</strong>
                      </div>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-600 rounded-full transition-all"
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 3 Orchard Images Section */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between mb-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-emerald-700" />
              <span>BARI Orchard Field Photography</span>
            </h3>
            {onOpenAdminWithImages && (
              <button
                onClick={onOpenAdminWithImages}
                className="text-[11px] text-emerald-700 hover:text-emerald-900 font-semibold hover:underline cursor-pointer"
              >
                + Add / Manage Images
              </button>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2">
            {galleryImages.slice(0, 3).map((img, i) => (
              <div
                key={img.id || i}
                onClick={() => setActiveImagePreview(img)}
                className="relative group rounded-xl overflow-hidden border border-slate-200 shadow-2xs hover:shadow cursor-pointer transition-all aspect-4/3 bg-slate-100"
              >
                <img
                  src={img.url}
                  alt={img.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-90 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-1.5">
                  <span className="text-[10px] font-bold text-white line-clamp-1 leading-tight">
                    {img.title}
                  </span>
                </div>
                <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 rounded p-0.5 text-white">
                  <Maximize2 className="w-3 h-3" />
                </div>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-slate-400 mt-1.5 italic">
            Visual records from BARI experimental fruit orchards and germplasm research plots.
          </p>
        </div>
      </section>

      {/* Lightbox Modal for Image Preview */}
      {activeImagePreview && (
        <div
          onClick={() => setActiveImagePreview(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="bg-white rounded-2xl overflow-hidden max-w-2xl w-full shadow-2xl border border-slate-200"
          >
            <div className="relative aspect-16/10 bg-slate-900">
              <img
                src={activeImagePreview.url}
                alt={activeImagePreview.title}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="p-4 flex items-center justify-between bg-white">
              <div>
                <h4 className="font-bold text-sm text-slate-900">{activeImagePreview.title}</h4>
                <p className="text-xs text-slate-500 mt-0.5">{activeImagePreview.caption}</p>
              </div>
              <button
                onClick={() => setActiveImagePreview(null)}
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
