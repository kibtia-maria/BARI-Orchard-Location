/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { FilterBar } from './components/FilterBar';
import { MapComponent } from './components/Map';
import { RegionalStatsBar } from './components/RegionalStatsBar';
import { DetailsPanel } from './components/DetailsPanel';
import { AdminModal } from './components/AdminModal';
import {
  BARIOffice,
  Orchard,
  UpazilaGeoJSON,
  DistrictHierarchy
} from './types';
import {
  getStoredOffices,
  saveStoredOffices,
  getStoredOrchards,
  saveStoredOrchards,
  resetToDefaults
} from './data/initialData';
import { calculateAggregatedStats, exportOrchardsToCSV } from './utils/stats';
import { Loader2, Globe, Shield, ExternalLink, Leaf } from 'lucide-react';

export default function App() {
  // Stored Data State
  const [offices, setOffices] = useState<BARIOffice[]>(() => getStoredOffices());
  const [orchards, setOrchards] = useState<Orchard[]>(() => getStoredOrchards());

  // Geographic Boundary Data
  const [geoJsonData, setGeoJsonData] = useState<UpazilaGeoJSON | null>(null);
  const [hierarchy, setHierarchy] = useState<DistrictHierarchy>({});
  const [isLoadingGeo, setIsLoadingGeo] = useState(true);

  // Filter & Selection State
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [selectedUpazila, setSelectedUpazila] = useState<string>('');
  const [selectedOffice, setSelectedOffice] = useState<BARIOffice | null>(null);
  const [selectedOrchard, setSelectedOrchard] = useState<Orchard | null>(null);

  // Basemap & Search State
  const [currentBasemap, setCurrentBasemap] = useState<string>('osm');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Admin Modal State
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [editingOrchardForAdmin, setEditingOrchardForAdmin] = useState<Orchard | null>(null);

  // Load Hierarchy and Upazila GeoJSON on mount
  useEffect(() => {
    let isMounted = true;

    async function loadGISData() {
      try {
        setIsLoadingGeo(true);
        const baseUrl = import.meta.env.BASE_URL || './';
        const cleanBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;

        // Load hierarchy
        const hierRes = await fetch(`${cleanBase}data/hierarchy.json`);
        if (hierRes.ok) {
          const hierData: DistrictHierarchy = await hierRes.json();
          if (isMounted) setHierarchy(hierData);
        }

        // Load Upazilas GeoJSON
        const geoRes = await fetch(`${cleanBase}data/bangladesh_upazilas.json`);
        if (geoRes.ok) {
          const geoData: UpazilaGeoJSON = await geoRes.json();
          if (isMounted) setGeoJsonData(geoData);
        }
      } catch (err) {
        console.error('Failed to load GIS datasets', err);
      } finally {
        if (isMounted) setIsLoadingGeo(false);
      }
    }

    loadGISData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Sync state changes with localStorage
  const handleSaveOrchard = (savedOrchard: Orchard) => {
    setOrchards(prev => {
      const idx = prev.findIndex(o => o.id === savedOrchard.id);
      let updated: Orchard[];
      if (idx >= 0) {
        updated = [...prev];
        updated[idx] = savedOrchard;
      } else {
        updated = [savedOrchard, ...prev];
      }
      saveStoredOrchards(updated);
      return updated;
    });

    if (selectedOrchard?.id === savedOrchard.id) {
      setSelectedOrchard(savedOrchard);
    }
  };

  const handleDeleteOrchard = (orchardId: string) => {
    setOrchards(prev => {
      const updated = prev.filter(o => o.id !== orchardId);
      saveStoredOrchards(updated);
      return updated;
    });
    if (selectedOrchard?.id === orchardId) {
      setSelectedOrchard(null);
    }
  };

  const handleSaveOffice = (savedOffice: BARIOffice) => {
    setOffices(prev => {
      const idx = prev.findIndex(o => o.id === savedOffice.id);
      let updated: BARIOffice[];
      if (idx >= 0) {
        updated = [...prev];
        updated[idx] = savedOffice;
      } else {
        updated = [savedOffice, ...prev];
      }
      saveStoredOffices(updated);
      return updated;
    });
    if (selectedOffice?.id === savedOffice.id) {
      setSelectedOffice(savedOffice);
    }
  };

  const handleDeleteOffice = (officeId: string) => {
    setOffices(prev => {
      const updated = prev.filter(o => o.id !== officeId);
      saveStoredOffices(updated);
      return updated;
    });
    if (selectedOffice?.id === officeId) {
      setSelectedOffice(null);
    }
  };

  const handleResetData = () => {
    const defaults = resetToDefaults();
    setOffices(defaults.offices);
    setOrchards(defaults.orchards);
    setSelectedOffice(null);
    setSelectedOrchard(null);
    setSelectedDistrict('');
    setSelectedUpazila('');
  };

  const handleImportJSON = (data: { offices: BARIOffice[]; orchards: Orchard[] }) => {
    setOffices(data.offices);
    setOrchards(data.orchards);
    saveStoredOffices(data.offices);
    saveStoredOrchards(data.orchards);
    setSelectedOffice(null);
    setSelectedOrchard(null);
  };

  // Flatten and extract all sorted districts from hierarchy
  const districts = useMemo(() => {
    const set = new Set<string>();
    Object.values(hierarchy).forEach(divObj => {
      Object.keys(divObj).forEach(dist => set.add(dist));
    });
    return Array.from(set).sort();
  }, [hierarchy]);

  // Extract upazilas for the selected district
  const availableUpazilas = useMemo(() => {
    if (!selectedDistrict) return [];
    for (const div in hierarchy) {
      if (hierarchy[div][selectedDistrict]) {
        return hierarchy[div][selectedDistrict];
      }
    }
    return [];
  }, [hierarchy, selectedDistrict]);

  // Handle District selection
  const handleSelectDistrict = (district: string) => {
    setSelectedDistrict(district);
    setSelectedUpazila('');
    setSelectedOrchard(null);

    // If district is cleared, clear office as well
    if (!district) {
      setSelectedOffice(null);
      return;
    }

    // If the district has an office, focus on it if desired, or let region speak
    const matchingOffices = offices.filter(
      o => o.district.toLowerCase() === district.toLowerCase()
    );
    if (matchingOffices.length === 1) {
      setSelectedOffice(matchingOffices[0]);
    } else {
      setSelectedOffice(null);
    }
  };

  // Handle Upazila selection
  const handleSelectUpazila = (upazila: string) => {
    setSelectedUpazila(upazila);
    setSelectedOrchard(null);

    // If there is an office in this upazila, focus on it
    if (upazila && selectedDistrict) {
      const matching = offices.find(
        o =>
          o.district.toLowerCase() === selectedDistrict.toLowerCase() &&
          o.upazila.toLowerCase() === upazila.toLowerCase()
      );
      if (matching) {
        setSelectedOffice(matching);
      }
    }
  };

  const handleClearFilters = () => {
    setSelectedDistrict('');
    setSelectedUpazila('');
    setSelectedOffice(null);
    setSelectedOrchard(null);
    setSearchTerm('');
  };

  // Filtered orchards based on region and search query
  const filteredOrchards = useMemo(() => {
    return orchards.filter(o => {
      if (selectedDistrict && o.district.toLowerCase() !== selectedDistrict.toLowerCase()) {
        return false;
      }
      if (selectedUpazila && o.upazila.toLowerCase() !== selectedUpazila.toLowerCase()) {
        return false;
      }
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        const matchesName = o.name.toLowerCase().includes(q);
        const matchesAddr = o.address.toLowerCase().includes(q);
        const matchesFruit = o.varieties.some(
          v => v.fruit.toLowerCase().includes(q) || v.variety.toLowerCase().includes(q)
        );
        if (!matchesName && !matchesAddr && !matchesFruit) return false;
      }
      return true;
    });
  }, [orchards, selectedDistrict, selectedUpazila, searchTerm]);

  // Filtered offices based on region
  const filteredOffices = useMemo(() => {
    return offices.filter(o => {
      if (selectedDistrict && o.district.toLowerCase() !== selectedDistrict.toLowerCase()) {
        return false;
      }
      if (selectedUpazila && o.upazila.toLowerCase() !== selectedUpazila.toLowerCase()) {
        return false;
      }
      return true;
    });
  }, [offices, selectedDistrict, selectedUpazila]);

  // Aggregated stats for the selected region
  const aggregatedStats = useMemo(() => {
    return calculateAggregatedStats(filteredOrchards, filteredOffices);
  }, [filteredOrchards, filteredOffices]);

  // Quick export handlers
  const handleExportCSV = () => {
    const csvContent = exportOrchardsToCSV(orchards, offices);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bari_orchards_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportJSON = () => {
    const payload = {
      timestamp: new Date().toISOString(),
      offices,
      orchards
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bari_orchards_database_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-600 selection:text-white">
      {/* Top Institute Header */}
      <Navbar
        offices={offices}
        orchards={orchards}
        onOpenAdmin={() => {
          setEditingOrchardForAdmin(null);
          setIsAdminOpen(true);
        }}
        onResetData={handleResetData}
        onExportCSV={handleExportCSV}
        onExportJSON={handleExportJSON}
      />

      {/* Top Filter Bar: District & Upazilla Selectors */}
      <FilterBar
        districts={districts}
        upazilas={availableUpazilas}
        selectedDistrict={selectedDistrict}
        selectedUpazila={selectedUpazila}
        onSelectDistrict={handleSelectDistrict}
        onSelectUpazila={handleSelectUpazila}
        onClearFilters={handleClearFilters}
        offices={offices}
        orchards={orchards}
        currentBasemap={currentBasemap}
        onBasemapChange={setCurrentBasemap}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5">
        {/* Loading Indicator for Shapefile GeoJSON */}
        {isLoadingGeo && (
          <div className="mb-4 bg-emerald-950/70 border border-emerald-700/60 rounded-xl p-3 flex items-center justify-between text-xs text-emerald-300">
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
              <span>Loading Bangladesh Upazila Administrative Boundaries (464 Upazilas)...</span>
            </div>
            <span className="text-[11px] text-emerald-400 hidden sm:inline">GIS Shapefile Render</span>
          </div>
        )}

        {/* Top Split Grid: Map on Left, Details Beside on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Map Column (7 cols on desktop) */}
          <div className="lg:col-span-7 flex flex-col space-y-4">
            <MapComponent
              offices={offices}
              orchards={orchards}
              selectedDistrict={selectedDistrict}
              selectedUpazila={selectedUpazila}
              selectedOffice={selectedOffice}
              selectedOrchard={selectedOrchard}
              onSelectOffice={office => {
                setSelectedOffice(office);
                setSelectedOrchard(null);
              }}
              onSelectOrchard={orchard => {
                setSelectedOrchard(orchard);
              }}
              geoJsonData={geoJsonData}
              currentBasemap={currentBasemap}
            />

            {/* Region Summary Statistics Displayed Below Map */}
            <RegionalStatsBar
              stats={aggregatedStats}
              selectedDistrict={selectedDistrict}
              selectedUpazila={selectedUpazila}
              officesInRegion={filteredOffices}
              onSelectOffice={office => {
                setSelectedOffice(office);
                setSelectedOrchard(null);
              }}
              selectedOffice={selectedOffice}
            />
          </div>

          {/* Details & Varieties Column Beside Map (5 cols on desktop) */}
          <div className="lg:col-span-5 sticky top-24">
            <DetailsPanel
              selectedOffice={selectedOffice}
              selectedOrchard={selectedOrchard}
              onSelectOffice={setSelectedOffice}
              onSelectOrchard={setSelectedOrchard}
              orchards={filteredOrchards}
              offices={filteredOffices}
              stats={aggregatedStats}
              selectedDistrict={selectedDistrict}
              selectedUpazila={selectedUpazila}
              onEditOrchard={orchard => {
                setEditingOrchardForAdmin(orchard);
                setIsAdminOpen(true);
              }}
            />
          </div>
        </div>
      </main>

      {/* Admin Panel Modal */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => {
          setIsAdminOpen(false);
          setEditingOrchardForAdmin(null);
        }}
        offices={offices}
        orchards={orchards}
        onSaveOrchard={handleSaveOrchard}
        onDeleteOrchard={handleDeleteOrchard}
        onSaveOffice={handleSaveOffice}
        onDeleteOffice={handleDeleteOffice}
        onResetData={handleResetData}
        onImportJSON={handleImportJSON}
        districts={districts}
        hierarchy={hierarchy}
        initialEditOrchard={editingOrchardForAdmin}
      />

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-6 text-xs text-slate-500 mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Leaf className="w-4 h-4 text-emerald-500" />
            <span>
              Bangladesh Agricultural Research Institute (BARI) • Horticulture & Germplasm GIS
            </span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Projection: WGS84 (EPSG:4326)</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-emerald-400">
              <Globe className="w-3.5 h-3.5" />
              <span>Ready for GitHub Pages</span>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
