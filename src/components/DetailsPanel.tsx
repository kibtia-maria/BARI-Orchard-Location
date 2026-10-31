/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Building2,
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
  Phone,
  Mail,
  PieChart,
  ListFilter
} from 'lucide-react';
import { BARIOffice, Orchard, AggregatedStats } from '../types';

interface DetailsPanelProps {
  selectedOffice: BARIOffice | null;
  selectedOrchard: Orchard | null;
  onSelectOffice: (office: BARIOffice | null) => void;
  onSelectOrchard: (orchard: Orchard | null) => void;
  orchards: Orchard[];
  offices: BARIOffice[];
  stats: AggregatedStats;
  selectedDistrict: string;
  selectedUpazila: string;
  onEditOrchard: (orchard: Orchard) => void;
}

export const DetailsPanel: React.FC<DetailsPanelProps> = ({
  selectedOffice,
  selectedOrchard,
  onSelectOffice,
  onSelectOrchard,
  orchards,
  offices,
  stats,
  selectedDistrict,
  selectedUpazila,
  onEditOrchard
}) => {
  const [copiedCoords, setCopiedCoords] = useState(false);
  const [varietySearch, setVarietySearch] = useState('');

  const handleCopyCoords = (lat: number, lng: number) => {
    navigator.clipboard.writeText(`${lat}, ${lng}`);
    setCopiedCoords(true);
    setTimeout(() => setCopiedCoords(false), 2000);
  };

  // Find supervising office for current orchard
  const currentOrchardOffice = selectedOrchard
    ? offices.find(o => o.id === selectedOrchard.officeId)
    : null;

  // Filter orchards under current selected office
  const officeOrchards = selectedOffice
    ? orchards.filter(o => o.officeId === selectedOffice.id)
    : [];

  // ==========================================
  // CASE 1: SPECIFIC ORCHARD IS SELECTED
  // ==========================================
  if (selectedOrchard) {
    const totalTreesInOrchard = selectedOrchard.varieties.reduce(
      (sum, v) => sum + (v.plants || 0),
      0
    );

    const filteredVarieties = selectedOrchard.varieties.filter(v => {
      const q = varietySearch.toLowerCase();
      return (
        v.fruit.toLowerCase().includes(q) ||
        v.variety.toLowerCase().includes(q)
      );
    });

    return (
      <div className="bg-slate-900 border border-emerald-800/80 rounded-2xl p-5 shadow-xl flex flex-col h-full max-h-[800px] overflow-hidden">
        {/* Navigation Breadcrumb & Back */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <button
            onClick={() => onSelectOrchard(null)}
            className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>
              {selectedOffice ? `Back to ${selectedOffice.shortName}` : 'Back to Overview'}
            </span>
          </button>
          <button
            onClick={() => onEditOrchard(selectedOrchard)}
            className="px-2.5 py-1 text-xs font-semibold bg-emerald-800/90 hover:bg-emerald-700 text-emerald-200 hover:text-white rounded-lg border border-emerald-600/70 transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Edit className="w-3.5 h-3.5" />
            <span>Edit Orchard</span>
          </button>
        </div>

        {/* Scrollable Orchard Content */}
        <div className="overflow-y-auto pr-1 flex-1 space-y-4 mt-3">
          {/* Header */}
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Orchard Site
              </span>
              <span className="text-xs text-slate-400">
                {selectedOrchard.upazila}, {selectedOrchard.district}
              </span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1 leading-snug">
              {selectedOrchard.name}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">{selectedOrchard.address}</p>
          </div>

          {/* Supervising Office info */}
          {currentOrchardOffice && (
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-xs flex items-center justify-between">
              <div>
                <span className="text-slate-500 text-[10px] block">Supervising BARI Office</span>
                <span className="font-semibold text-emerald-300">{currentOrchardOffice.name}</span>
              </div>
              <button
                onClick={() => {
                  onSelectOrchard(null);
                  onSelectOffice(currentOrchardOffice);
                }}
                className="text-amber-400 hover:text-amber-300 font-medium text-[11px] flex items-center gap-1"
              >
                <span>View Office</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-500 block uppercase font-medium">Land Area</span>
              <div className="font-bold text-white text-sm mt-0.5">
                {selectedOrchard.areaAcre} <span className="text-xs font-normal text-slate-400">Acre</span>
              </div>
              <span className="text-[10px] text-slate-400">({selectedOrchard.areaHector} Ha)</span>
            </div>
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-500 block uppercase font-medium">Planting Date</span>
              <div className="font-bold text-white text-sm mt-0.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                <span>{selectedOrchard.dateOfPlanting || 'Not Recorded'}</span>
              </div>
            </div>
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-500 block uppercase font-medium">Varieties</span>
              <div className="font-bold text-indigo-400 text-base mt-0.5 font-mono">
                {selectedOrchard.varieties.length}
              </div>
              <span className="text-[10px] text-slate-400">cultivars</span>
            </div>
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-500 block uppercase font-medium">Total Trees</span>
              <div className="font-bold text-teal-400 text-base mt-0.5 font-mono">
                {totalTreesInOrchard}
              </div>
              <span className="text-[10px] text-slate-400">plants</span>
            </div>
          </div>

          {/* Geographic Coordinates & Navigation */}
          <div className="bg-emerald-950/40 p-3 rounded-xl border border-emerald-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
              <div className="text-xs">
                <span className="text-slate-400 block text-[10px]">Geographical Coordinates (GPS WGS84)</span>
                <span className="font-mono text-emerald-200 font-semibold">
                  {selectedOrchard.latitude.toFixed(6)}, {selectedOrchard.longitude.toFixed(6)}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopyCoords(selectedOrchard.latitude, selectedOrchard.longitude)}
                className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 flex items-center gap-1 transition-colors"
              >
                {copiedCoords ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCoords ? 'Copied' : 'Copy'}</span>
              </button>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${selectedOrchard.latitude},${selectedOrchard.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 text-xs bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg flex items-center gap-1 transition-colors font-medium shadow-sm"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Google Maps</span>
              </a>
            </div>
          </div>

          {/* Varieties & Tree Counts Table */}
          <div className="bg-slate-950 rounded-xl border border-slate-800 p-3">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
              <div className="flex items-center gap-1.5">
                <Apple className="w-4 h-4 text-rose-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                  Cultivated Fruit Varieties ({selectedOrchard.varieties.length})
                </h4>
              </div>
              <input
                type="text"
                placeholder="Filter varieties..."
                value={varietySearch}
                onChange={e => setVarietySearch(e.target.value)}
                className="text-xs bg-slate-900 text-slate-200 px-2 py-1 rounded border border-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-400 w-36"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                    <th className="py-1.5 px-2 font-semibold">Fruit Species</th>
                    <th className="py-1.5 px-2 font-semibold">Variety / Cultivar</th>
                    <th className="py-1.5 px-2 font-semibold text-right">Tree Count</th>
                    <th className="py-1.5 px-2 font-semibold text-right">Planted Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-sans">
                  {filteredVarieties.map((v, i) => (
                    <tr key={i} className="hover:bg-slate-900/60 transition-colors">
                      <td className="py-2 px-2">
                        <span className="font-semibold text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/80">
                          {v.fruit}
                        </span>
                      </td>
                      <td className="py-2 px-2 text-white font-medium">
                        {v.variety}
                      </td>
                      <td className="py-2 px-2 text-right font-mono font-bold text-amber-300">
                        {v.plants}
                      </td>
                      <td className="py-2 px-2 text-right text-slate-400 text-[11px]">
                        {v.date || selectedOrchard.dateOfPlanting || '—'}
                      </td>
                    </tr>
                  ))}
                  {filteredVarieties.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-4 text-center text-slate-500">
                        No fruit varieties matching &ldquo;{varietySearch}&rdquo;
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // CASE 2: BARI OFFICE IS SELECTED
  // ==========================================
  if (selectedOffice) {
    const totalTreesInOffice = officeOrchards.reduce(
      (sum, o) => sum + o.varieties.reduce((s, v) => s + (v.plants || 0), 0),
      0
    );

    const varietySet = new Set<string>();
    const fruitTypeSet = new Set<string>();
    let totalOfficeAreaAcre = 0;
    let totalOfficeAreaHector = 0;

    officeOrchards.forEach(o => {
      totalOfficeAreaAcre += o.areaAcre || 0;
      totalOfficeAreaHector += o.areaHector || (o.areaAcre ? o.areaAcre / 2.47105 : 0);
      o.varieties.forEach(v => {
        fruitTypeSet.add(v.fruit);
        varietySet.add(`${v.fruit}::${v.variety}`);
      });
    });

    return (
      <div className="bg-slate-900 border border-emerald-800/80 rounded-2xl p-5 shadow-xl flex flex-col h-full max-h-[800px] overflow-hidden">
        {/* Header with back button */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <button
            onClick={() => onSelectOffice(null)}
            className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Regional Stations</span>
          </button>
          <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            Station Profile
          </span>
        </div>

        {/* Scrollable Office Profile Content */}
        <div className="overflow-y-auto pr-1 flex-1 space-y-4 mt-3">
          {/* Office Title */}
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-amber-400" />
              <span className="text-xs uppercase tracking-wider text-emerald-400 font-semibold">
                BARI Regional Office
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white mt-1 leading-snug">
              {selectedOffice.name}
            </h2>
            <p className="text-xs text-slate-300 mt-1">{selectedOffice.address}</p>
            {selectedOffice.description && (
              <p className="text-xs text-slate-400 mt-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800 italic">
                &ldquo;{selectedOffice.description}&rdquo;
              </p>
            )}
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-slate-950 p-2.5 rounded-xl border border-slate-800">
            {selectedOffice.phone && (
              <div className="flex items-center gap-1.5 text-slate-300">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>{selectedOffice.phone}</span>
              </div>
            )}
            {selectedOffice.email && (
              <div className="flex items-center gap-1.5 text-slate-300">
                <Mail className="w-3.5 h-3.5 text-emerald-400" />
                <span>{selectedOffice.email}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>{selectedOffice.upazila}, {selectedOffice.district}</span>
            </div>
            {selectedOffice.established && (
              <div className="flex items-center gap-1.5 text-slate-400">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                <span>Est. {selectedOffice.established}</span>
              </div>
            )}
          </div>

          {/* Aggregated Metrics for this Office */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Office Orchards & Germplasm Summary
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Total Orchards</span>
                <strong className="text-white text-base font-mono">{officeOrchards.length}</strong>
              </div>
              <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Fruit Types</span>
                <strong className="text-rose-400 text-base font-mono">{fruitTypeSet.size}</strong>
              </div>
              <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Varieties</span>
                <strong className="text-indigo-400 text-base font-mono">{varietySet.size}</strong>
              </div>
              <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Total Trees</span>
                <strong className="text-teal-400 text-base font-mono">{totalTreesInOffice}</strong>
              </div>
              <div className="bg-slate-950 p-2 rounded-xl border border-slate-800 col-span-2 sm:col-span-2">
                <span className="text-[10px] text-slate-500 block">Total Area</span>
                <strong className="text-amber-300 text-sm font-mono">
                  {Math.round(totalOfficeAreaAcre * 100) / 100} Acres
                  <span className="text-xs text-slate-400 font-normal">
                    {' '}({Math.round(totalOfficeAreaHector * 100) / 100} Ha)
                  </span>
                </strong>
              </div>
            </div>
          </div>

          {/* Interactive List of Orchards Under this Office */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                <Trees className="w-4 h-4 text-emerald-400" />
                <span>Orchards Supervised by this Station ({officeOrchards.length})</span>
              </h4>
              <span className="text-[11px] text-slate-400">Click to inspect</span>
            </div>

            <div className="space-y-2">
              {officeOrchards.map(orchard => {
                const plants = orchard.varieties.reduce((s, v) => s + (v.plants || 0), 0);
                const fruits = Array.from(new Set(orchard.varieties.map(v => v.fruit)));

                return (
                  <div
                    key={orchard.id}
                    onClick={() => onSelectOrchard(orchard)}
                    className="p-3 bg-slate-950/90 hover:bg-emerald-950/60 rounded-xl border border-slate-800 hover:border-emerald-600/80 cursor-pointer transition-all group shadow-sm"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h5 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                          {orchard.name}
                        </h5>
                        <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{orchard.address}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors mt-1" />
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px]">
                      <span className="bg-slate-900 px-2 py-0.5 rounded text-slate-300 border border-slate-800">
                        {orchard.areaAcre} Acres
                      </span>
                      <span className="bg-slate-900 px-2 py-0.5 rounded text-amber-300 font-mono border border-slate-800">
                        {plants} Trees
                      </span>
                      <span className="bg-slate-900 px-2 py-0.5 rounded text-indigo-300 font-mono border border-slate-800">
                        {orchard.varieties.length} Varieties
                      </span>
                    </div>

                    {/* Fruit Badges */}
                    <div className="mt-2 flex flex-wrap gap-1">
                      {fruits.map((fr, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] bg-emerald-950 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-800/80"
                        >
                          {fr}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // CASE 3: REGIONAL / GENERAL OVERVIEW
  // ==========================================
  return (
    <div className="bg-slate-900 border border-emerald-800/80 rounded-2xl p-5 shadow-xl flex flex-col h-full max-h-[800px] overflow-hidden">
      {/* Overview Header */}
      <div className="pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Regional Orchards Explorer
          </span>
        </div>
        <h2 className="text-lg font-bold text-white mt-1">
          {selectedDistrict ? `${selectedDistrict} Directory` : 'National Directory'}
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Select an office marker on the map to inspect its orchards and germplasm diversity.
        </p>
      </div>

      <div className="overflow-y-auto pr-1 flex-1 space-y-4 mt-3">
        {/* BARI Research Stations in Region */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-amber-400" />
              <span>BARI Stations ({offices.length})</span>
            </h4>
            <span className="text-[11px] text-slate-400">Click to explore</span>
          </div>

          <div className="space-y-2">
            {offices.map(office => {
              const count = orchards.filter(o => o.officeId === office.id).length;
              return (
                <div
                  key={office.id}
                  onClick={() => onSelectOffice(office)}
                  className="p-3 bg-slate-950/90 hover:bg-emerald-950/60 rounded-xl border border-slate-800 hover:border-emerald-600/80 cursor-pointer transition-all group shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h5 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                        {office.name}
                      </h5>
                      <p className="text-xs text-slate-400 mt-0.5">{office.address}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-colors mt-1" />
                  </div>
                  <div className="mt-2.5 flex items-center justify-between text-xs">
                    <span className="text-emerald-400 font-semibold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/80">
                      {count} Orchard Sites
                    </span>
                    <span className="text-slate-400 text-[11px]">
                      {office.upazila}, {office.district}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Fruit Diversity Breakdown */}
        {stats.fruitBreakdown.length > 0 && (
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                <PieChart className="w-4 h-4 text-indigo-400" />
                <span>Fruit Germplasm Breakdown</span>
              </h4>
              <span className="text-[10px] text-slate-400 font-mono">
                {stats.totalTrees.toLocaleString()} trees
              </span>
            </div>

            <div className="space-y-2.5">
              {stats.fruitBreakdown.map((item, idx) => {
                const percent = Math.min(
                  100,
                  Math.round((item.totalTrees / (stats.totalTrees || 1)) * 100)
                );
                return (
                  <div key={idx} className="text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-slate-200">
                        {item.fruit}
                      </span>
                      <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                        <span>{item.varietiesCount} varieties</span>
                        <strong className="text-teal-400 font-mono">{item.totalTrees}</strong>
                      </div>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
