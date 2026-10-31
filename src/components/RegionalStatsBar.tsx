/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Building2, Trees, Apple, Dna, Hash, Ruler, MapPin, Sparkles } from 'lucide-react';
import { AggregatedStats, BARIOffice } from '../types';

interface RegionalStatsBarProps {
  stats: AggregatedStats;
  selectedDistrict: string;
  selectedUpazila: string;
  officesInRegion: BARIOffice[];
  onSelectOffice: (office: BARIOffice) => void;
  selectedOffice: BARIOffice | null;
}

export const RegionalStatsBar: React.FC<RegionalStatsBarProps> = ({
  stats,
  selectedDistrict,
  selectedUpazila,
  officesInRegion,
  onSelectOffice,
  selectedOffice
}) => {
  const [areaUnit, setAreaUnit] = useState<'acre' | 'hector'>('acre');

  const regionLabel = selectedUpazila && selectedDistrict
    ? `${selectedUpazila} Upazila, ${selectedDistrict}`
    : selectedDistrict
    ? `${selectedDistrict} District`
    : 'All Bangladesh (National Coverage)';

  return (
    <div className="bg-slate-900 border border-emerald-800/80 rounded-2xl p-4 sm:p-5 shadow-lg my-4">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 mb-4 border-b border-slate-800 gap-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-950 border border-emerald-700/60 text-emerald-400">
            <MapPin className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
              Regional Germplasm & Office Summary
            </span>
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span>{regionLabel}</span>
              {selectedOffice && (
                <span className="text-xs font-medium text-amber-300 bg-amber-950/80 border border-amber-600/60 px-2 py-0.5 rounded-full">
                  Focused on: {selectedOffice.shortName}
                </span>
              )}
            </h3>
          </div>
        </div>

        {/* Area Unit Switcher */}
        <div className="flex items-center gap-1.5 self-end sm:self-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <span className="text-slate-400 text-[11px] px-2 font-medium">Area Unit:</span>
          <button
            onClick={() => setAreaUnit('acre')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
              areaUnit === 'acre'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Acres
          </button>
          <button
            onClick={() => setAreaUnit('hector')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
              areaUnit === 'hector'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Hectares
          </button>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Total Offices */}
        <div className="bg-gradient-to-br from-emerald-950/80 to-slate-950 border border-emerald-700/50 rounded-xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">BARI Offices</span>
            <Building2 className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-amber-400 font-mono tracking-tight">
              {stats.totalOffices}
            </div>
            <span className="text-[10px] text-slate-400">in this region</span>
          </div>
        </div>

        {/* Total Orchards */}
        <div className="bg-gradient-to-br from-emerald-950/80 to-slate-950 border border-emerald-700/50 rounded-xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Total Orchards</span>
            <Trees className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-white font-mono tracking-tight">
              {stats.totalOrchards}
            </div>
            <span className="text-[10px] text-slate-400">active sites</span>
          </div>
        </div>

        {/* Total Fruit Types */}
        <div className="bg-gradient-to-br from-emerald-950/80 to-slate-950 border border-emerald-700/50 rounded-xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Fruit Types</span>
            <Apple className="w-4 h-4 text-rose-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-rose-400 font-mono tracking-tight">
              {stats.totalFruitTypes}
            </div>
            <span className="text-[10px] text-slate-400">botanical species</span>
          </div>
        </div>

        {/* Total Varieties */}
        <div className="bg-gradient-to-br from-emerald-950/80 to-slate-950 border border-emerald-700/50 rounded-xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Fruit Varieties</span>
            <Dna className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-indigo-300 font-mono tracking-tight">
              {stats.totalVarieties}
            </div>
            <span className="text-[10px] text-slate-400">registered lines</span>
          </div>
        </div>

        {/* Total Trees */}
        <div className="bg-gradient-to-br from-emerald-950/80 to-slate-950 border border-emerald-700/50 rounded-xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Total Trees</span>
            <Hash className="w-4 h-4 text-teal-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-teal-300 font-mono tracking-tight">
              {stats.totalTrees.toLocaleString()}
            </div>
            <span className="text-[10px] text-slate-400">fruit plants</span>
          </div>
        </div>

        {/* Total Area */}
        <div className="bg-gradient-to-br from-emerald-950/80 to-slate-950 border border-emerald-700/50 rounded-xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Total Area</span>
            <Ruler className="w-4 h-4 text-yellow-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-yellow-300 font-mono tracking-tight">
              {areaUnit === 'acre' ? stats.totalAreaAcre : stats.totalAreaHector}
            </div>
            <span className="text-[10px] text-slate-400">
              {areaUnit === 'acre' ? 'Acres' : 'Hectares'}
            </span>
          </div>
        </div>
      </div>

      {/* Offices list tags in this region */}
      {officesInRegion.length > 0 && (
        <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Offices in this region:</span>
          {officesInRegion.map(off => {
            const isSelected = selectedOffice?.id === off.id;
            return (
              <button
                key={off.id}
                onClick={() => onSelectOffice(off)}
                className={`text-xs px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 font-bold border-amber-300'
                    : 'bg-emerald-950/80 text-emerald-200 border-emerald-700/80 hover:bg-emerald-800 hover:text-white'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>{off.name}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
