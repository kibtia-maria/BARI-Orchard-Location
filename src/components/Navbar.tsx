/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sprout, ShieldCheck, Download, RefreshCw, MapPin, Database } from 'lucide-react';
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
  return (
    <header className="bg-emerald-950 text-white border-b border-emerald-800 shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Institute Branding */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-700 flex items-center justify-center shadow-inner border border-emerald-400/40 p-2 text-white">
              <Sprout className="w-6 h-6 sm:w-7 sm:h-7 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs uppercase tracking-widest font-semibold text-emerald-300 bg-emerald-900/60 px-2 py-0.5 rounded border border-emerald-700/50">
                  Govt. of Bangladesh • BARI
                </span>
                <span className="text-xs text-emerald-400 hidden md:inline">
                  বাংলাদেশ কৃষি গবেষণা ইনস্টিটিউট
                </span>
              </div>
              <h1 className="text-base sm:text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                BARI Orchards GIS Portal
                <span className="text-xs font-normal text-emerald-300 hidden lg:inline">
                  (Geographical Location & Germplasm Database)
                </span>
              </h1>
            </div>
          </div>

          {/* Quick Stats Badges & Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="hidden md:flex items-center space-x-2 text-xs bg-emerald-900/80 border border-emerald-700/60 rounded-lg px-3 py-1.5">
              <div className="flex items-center gap-1 text-emerald-200">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>Offices:</span>
                <strong className="text-white font-mono">{offices.length}</strong>
              </div>
              <span className="text-emerald-600">|</span>
              <div className="flex items-center gap-1 text-emerald-200">
                <Database className="w-3.5 h-3.5 text-emerald-400" />
                <span>Orchards:</span>
                <strong className="text-white font-mono">{orchards.length}</strong>
              </div>
            </div>

            {/* Export Dropdown / Buttons */}
            <div className="hidden sm:flex items-center space-x-1.5">
              <button
                onClick={onExportCSV}
                title="Export Orchards to CSV"
                className="px-2.5 py-1.5 text-xs font-medium bg-emerald-900 hover:bg-emerald-800 text-emerald-200 hover:text-white rounded-lg border border-emerald-700 transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
              <button
                onClick={onExportJSON}
                title="Download JSON Database for GitHub"
                className="px-2.5 py-1.5 text-xs font-medium bg-emerald-900 hover:bg-emerald-800 text-emerald-200 hover:text-white rounded-lg border border-emerald-700 transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Database className="w-3.5 h-3.5" />
                <span>JSON</span>
              </button>
            </div>

            {/* Reset Button */}
            <button
              onClick={onResetData}
              title="Reset data to original BARI dataset"
              className="p-1.5 text-emerald-300 hover:text-white hover:bg-emerald-800/80 rounded-lg border border-transparent hover:border-emerald-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            {/* Admin Panel Trigger */}
            <button
              onClick={onOpenAdmin}
              className="px-3 py-1.5 text-xs sm:text-sm font-semibold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 border border-amber-300/60"
            >
              <ShieldCheck className="w-4 h-4 text-slate-950" />
              <span>Admin Panel</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
