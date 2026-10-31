/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { MapPin, Layers, Search, X, Compass, Filter } from 'lucide-react';
import { BARIOffice, Orchard } from '../types';

interface FilterBarProps {
  districts: string[];
  upazilas: string[];
  selectedDistrict: string;
  selectedUpazila: string;
  onSelectDistrict: (district: string) => void;
  onSelectUpazila: (upazila: string) => void;
  onClearFilters: () => void;
  offices: BARIOffice[];
  orchards: Orchard[];
  currentBasemap: string;
  onBasemapChange: (basemap: string) => void;
  searchTerm: string;
  onSearchChange: (search: string) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  districts,
  upazilas,
  selectedDistrict,
  selectedUpazila,
  onSelectDistrict,
  onSelectUpazila,
  onClearFilters,
  offices,
  orchards,
  currentBasemap,
  onBasemapChange,
  searchTerm,
  onSearchChange
}) => {
  // Count how many offices and orchards exist in each district for badge display
  const districtCounts = React.useMemo(() => {
    const counts: Record<string, { offices: number; orchards: number }> = {};
    offices.forEach(o => {
      if (!counts[o.district]) counts[o.district] = { offices: 0, orchards: 0 };
      counts[o.district].offices++;
    });
    orchards.forEach(o => {
      if (!counts[o.district]) counts[o.district] = { offices: 0, orchards: 0 };
      counts[o.district].orchards++;
    });
    return counts;
  }, [offices, orchards]);

  // Count how many orchards exist in each upazila in the selected district
  const upazilaCounts = React.useMemo(() => {
    if (!selectedDistrict) return {};
    const counts: Record<string, { offices: number; orchards: number }> = {};
    offices
      .filter(o => o.district.toLowerCase() === selectedDistrict.toLowerCase())
      .forEach(o => {
        if (!counts[o.upazila]) counts[o.upazila] = { offices: 0, orchards: 0 };
        counts[o.upazila].offices++;
      });
    orchards
      .filter(o => o.district.toLowerCase() === selectedDistrict.toLowerCase())
      .forEach(o => {
        if (!counts[o.upazila]) counts[o.upazila] = { offices: 0, orchards: 0 };
        counts[o.upazila].orchards++;
      });
    return counts;
  }, [offices, orchards, selectedDistrict]);

  const hasActiveFilter = Boolean(selectedDistrict || selectedUpazila || searchTerm);

  return (
    <div className="bg-emerald-900/90 backdrop-blur-md border-b border-emerald-800/80 shadow-md py-3 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* District & Upazila Selectors */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 flex-1">
          <div className="flex items-center gap-1.5 text-emerald-200 text-xs font-semibold uppercase tracking-wider">
            <Filter className="w-3.5 h-3.5 text-amber-400" />
            <span>Location:</span>
          </div>

          {/* District Dropdown */}
          <div className="relative min-w-[170px] sm:min-w-[210px] flex-1 sm:flex-initial">
            <select
              aria-label="Select District"
              value={selectedDistrict}
              onChange={e => onSelectDistrict(e.target.value)}
              className="w-full appearance-none bg-emerald-950 text-white text-xs sm:text-sm font-medium rounded-lg px-3 py-2 pr-8 border border-emerald-700/80 hover:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 cursor-pointer shadow-sm"
            >
              <option value="">All Districts of Bangladesh (64)</option>
              {districts.map(dist => {
                const count = districtCounts[dist];
                const label = count
                  ? `${dist} (${count.offices} office${count.offices > 1 ? 's' : ''}, ${count.orchards} orchard${count.orchards > 1 ? 's' : ''})`
                  : dist;
                return (
                  <option key={dist} value={dist}>
                    {label}
                  </option>
                );
              })}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-emerald-400">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>

          {/* Upazila Dropdown */}
          <div className="relative min-w-[170px] sm:min-w-[210px] flex-1 sm:flex-initial">
            <select
              aria-label="Select Upazilla"
              value={selectedUpazila}
              disabled={!selectedDistrict}
              onChange={e => onSelectUpazila(e.target.value)}
              className="w-full appearance-none bg-emerald-950 text-white text-xs sm:text-sm font-medium rounded-lg px-3 py-2 pr-8 border border-emerald-700/80 hover:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-sm"
            >
              <option value="">
                {selectedDistrict
                  ? `All Upazilas in ${selectedDistrict} (${upazilas.length})`
                  : 'Select District first'}
              </option>
              {upazilas.map(upz => {
                const count = upazilaCounts[upz];
                const label = count
                  ? `${upz} (${count.orchards} orchard${count.orchards > 1 ? 's' : ''})`
                  : upz;
                return (
                  <option key={upz} value={upz}>
                    {label}
                  </option>
                );
              })}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-emerald-400">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilter && (
            <button
              onClick={onClearFilters}
              title="Reset view to whole Bangladesh"
              className="px-2.5 py-1.5 text-xs bg-emerald-800/80 hover:bg-emerald-700 text-emerald-200 hover:text-white rounded-lg border border-emerald-600/70 flex items-center gap-1 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>

        {/* Right side: Search & Basemap Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Search */}
          <div className="relative flex-1 sm:w-48 md:w-56">
            <Search className="w-3.5 h-3.5 text-emerald-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search orchard, fruit..."
              value={searchTerm}
              onChange={e => onSearchChange(e.target.value)}
              className="w-full bg-emerald-950/90 text-white text-xs rounded-lg pl-8 pr-7 py-2 border border-emerald-700/80 focus:outline-none focus:ring-2 focus:ring-emerald-400 placeholder-emerald-400/60"
            />
            {searchTerm && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-emerald-400 hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Basemap Switcher */}
          <div className="relative">
            <select
              aria-label="Select Basemap"
              value={currentBasemap}
              onChange={e => onBasemapChange(e.target.value)}
              className="appearance-none bg-emerald-950 text-emerald-200 hover:text-white text-xs font-medium rounded-lg px-2.5 py-2 pr-7 border border-emerald-700/80 hover:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 cursor-pointer shadow-sm"
            >
              <option value="osm">Standard Map</option>
              <option value="satellite">Satellite (Esri)</option>
              <option value="carto">Clean Light</option>
              <option value="topo">Topographic</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1.5 text-emerald-400">
              <Layers className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
