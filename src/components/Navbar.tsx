/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShieldCheck, Download, RefreshCw, MapPin, Database } from 'lucide-react';
import { BARIOffice, Orchard } from '../types';

interface NavbarProps {
  offices: BARIOffice[];
  orchards: Orchard[];
  onOpenAdmin: () => void;
  onResetData: () => void;
  onExportJSON: () => void;
  onExportCSV: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  offices,
  orchards,
  onOpenAdmin,
  onResetData,
  onExportJSON,
  onExportCSV
}) => {
  const baseUrl = import.meta.env.BASE_URL || './';
  const cleanBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  const bariLogoUrl = `${cleanBase}assets/aistudio/BARI_Logo_006df12d.png`;

  return (
    <header className="bg-emerald-900 text-white border-b border-emerald-800/80 shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Institute Title */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-xl bg-white flex items-center justify-center shadow-md border border-emerald-200/90 p-1 shrink-0 overflow-hidden">
              <img
                src={bariLogoUrl}
                alt="BARI Logo"
                className="w-full h-full object-contain"
                onError={(e) => {
                  // Fallback if path prefix differs
                  (e.target as HTMLImageElement).src = './assets/aistudio/BARI_Logo_006df12d.png';
                }}
              />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold text-emerald-200">
                  বাংলাদেশ কৃষি গবেষণা ইনস্টিটিউট (BARI)
                </span>
              </div>
              <h1 className="text-base sm:text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                Fruit Orchard Locations
                <span className="text-xs font-normal text-emerald-200/90 hidden lg:inline">
                  (Geographical Location & Germplasm Database)
                </span>
              </h1>
            </div>
          </div>

          {/* Quick Stats Badges & Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="hidden md:flex items-center space-x-2 text-xs bg-emerald-800/90 border border-emerald-700/80 rounded-lg px-3 py-1.5 shadow-xs">
              <div className="flex items-center gap-1 text-emerald-100">
                <MapPin className="w-3.5 h-3.5 text-amber-300" />
                <span>Offices:</span>
                <strong className="text-white font-mono">{offices.length}</strong>
              </div>
              <span className="text-emerald-600">|</span>
              <div className="flex items-center gap-1 text-emerald-100">
                <Database className="w-3.5 h-3.5 text-emerald-300" />
                <span>Orchards:</span>
                <strong className="text-white font-mono">{orchards.length}</strong>
              </div>
            </div>

            {/* Export Dropdown / Buttons */}
            <div className="hidden sm:flex items-center space-x-1.5">
              <button
                onClick={onExportCSV}
                title="Export Orchards to CSV"
                className="px-2.5 py-1.5 text-xs font-medium bg-emerald-800 hover:bg-emerald-700 text-emerald-100 hover:text-white rounded-lg border border-emerald-700 transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
              <button
                onClick={onExportJSON}
                title="Download JSON Database for GitHub"
                className="px-2.5 py-1.5 text-xs font-medium bg-emerald-800 hover:bg-emerald-700 text-emerald-100 hover:text-white rounded-lg border border-emerald-700 transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <Database className="w-3.5 h-3.5" />
                <span>JSON</span>
              </button>
            </div>

            {/* Reset Button */}
            <button
              onClick={onResetData}
              title="Reset data to original BARI dataset"
              className="p-1.5 text-emerald-200 hover:text-white hover:bg-emerald-800/80 rounded-lg border border-transparent hover:border-emerald-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            {/* Admin Panel Trigger */}
            <button
              onClick={onOpenAdmin}
              className="px-3 py-1.5 text-xs sm:text-sm font-semibold bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-900 rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-1.5 border border-amber-300/80 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-slate-900" />
              <span>Admin Panel</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
