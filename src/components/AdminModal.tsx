/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Trash2,
  Edit,
  Save,
  Download,
  Upload,
  RefreshCw,
  Building2,
  Trees,
  Apple,
  Search,
  Check,
  AlertCircle
} from 'lucide-react';
import { BARIOffice, Orchard, FruitVariety, DistrictHierarchy } from '../types';
import { exportOrchardsToCSV } from '../utils/stats';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  offices: BARIOffice[];
  orchards: Orchard[];
  onSaveOrchard: (orchard: Orchard) => void;
  onDeleteOrchard: (orchardId: string) => void;
  onSaveOffice: (office: BARIOffice) => void;
  onDeleteOffice: (officeId: string) => void;
  onResetData: () => void;
  onImportJSON: (data: { offices: BARIOffice[]; orchards: Orchard[] }) => void;
  districts: string[];
  hierarchy: DistrictHierarchy;
  initialEditOrchard?: Orchard | null;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  offices,
  orchards,
  onSaveOrchard,
  onDeleteOrchard,
  onSaveOffice,
  onDeleteOffice,
  onResetData,
  onImportJSON,
  districts,
  hierarchy,
  initialEditOrchard
}) => {
  const [activeTab, setActiveTab] = useState<'orchards' | 'offices' | 'importExport'>('orchards');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingOrchard, setEditingOrchard] = useState<Orchard | null>(null);
  const [isCreatingOrchard, setIsCreatingOrchard] = useState(false);

  const [editingOffice, setEditingOffice] = useState<BARIOffice | null>(null);
  const [isCreatingOffice, setIsCreatingOffice] = useState(false);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // If initialEditOrchard is provided on open, switch to editing it
  useEffect(() => {
    if (initialEditOrchard) {
      setEditingOrchard(initialEditOrchard);
      setIsCreatingOrchard(false);
      setActiveTab('orchards');
    }
  }, [initialEditOrchard]);

  if (!isOpen) return null;

  // ------------------------------------------
  // ORCHARD FORM STATE
  // ------------------------------------------
  const handleStartCreateOrchard = () => {
    const defaultOffice = offices[0]?.id || '';
    const defaultDist = offices[0]?.district || districts[0] || 'Gazipur';
    setIsCreatingOrchard(true);
    setEditingOrchard({
      id: `orchard_custom_${Date.now()}`,
      officeId: defaultOffice,
      name: '',
      address: '',
      district: defaultDist,
      upazila: offices[0]?.upazila || 'Gazipur',
      latitude: offices[0]?.latitude || 23.9883,
      longitude: offices[0]?.longitude || 90.4125,
      areaAcre: 1.0,
      areaHector: 0.405,
      dateOfPlanting: new Date().toISOString().split('T')[0],
      varieties: [
        { fruit: 'Mango', variety: 'BARI Aam-4', plants: 20, date: new Date().toISOString().split('T')[0] }
      ]
    });
  };

  const handleSaveOrchardForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrchard) return;
    if (!editingOrchard.name.trim()) {
      alert('Please enter an orchard name.');
      return;
    }
    onSaveOrchard(editingOrchard);
    setEditingOrchard(null);
    setIsCreatingOrchard(false);
    showToast('Orchard saved successfully!');
  };

  const handleAddVariety = () => {
    if (!editingOrchard) return;
    setEditingOrchard({
      ...editingOrchard,
      varieties: [
        ...editingOrchard.varieties,
        { fruit: 'Mango', variety: 'BARI Aam-3', plants: 10, date: editingOrchard.dateOfPlanting }
      ]
    });
  };

  const handleUpdateVariety = (index: number, field: keyof FruitVariety, value: any) => {
    if (!editingOrchard) return;
    const updated = [...editingOrchard.varieties];
    updated[index] = { ...updated[index], [field]: value };
    setEditingOrchard({ ...editingOrchard, varieties: updated });
  };

  const handleRemoveVariety = (index: number) => {
    if (!editingOrchard) return;
    if (editingOrchard.varieties.length <= 1) {
      alert('An orchard must contain at least one fruit variety.');
      return;
    }
    const updated = editingOrchard.varieties.filter((_, i) => i !== index);
    setEditingOrchard({ ...editingOrchard, varieties: updated });
  };

  // Get available upazilas for editing orchard district
  const getUpazilasForDistrict = (districtName: string): string[] => {
    for (const div in hierarchy) {
      if (hierarchy[div][districtName]) {
        return hierarchy[div][districtName];
      }
    }
    return [];
  };

  // ------------------------------------------
  // OFFICE FORM STATE
  // ------------------------------------------
  const handleStartCreateOffice = () => {
    setIsCreatingOffice(true);
    setEditingOffice({
      id: `office_custom_${Date.now()}`,
      name: '',
      shortName: '',
      district: districts[0] || 'Gazipur',
      upazila: 'Gazipur',
      division: 'Dhaka Division',
      address: '',
      latitude: 23.8,
      longitude: 90.4,
      phone: '',
      email: '',
      established: '',
      description: ''
    });
  };

  const handleSaveOfficeForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOffice) return;
    if (!editingOffice.name.trim()) {
      alert('Please enter office name.');
      return;
    }
    onSaveOffice(editingOffice);
    setEditingOffice(null);
    setIsCreatingOffice(false);
    showToast('BARI Office saved successfully!');
  };

  // ------------------------------------------
  // EXPORT / IMPORT HANDLERS
  // ------------------------------------------
  const handleDownloadJSON = () => {
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
    showToast('JSON Database downloaded!');
  };

  const handleDownloadCSV = () => {
    const csvContent = exportOrchardsToCSV(orchards, offices);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bari_orchards_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('CSV Export downloaded!');
  };

  const handleJSONFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const parsed = JSON.parse(ev.target?.result as string);
        if (Array.isArray(parsed.offices) && Array.isArray(parsed.orchards)) {
          onImportJSON({ offices: parsed.offices, orchards: parsed.orchards });
          showToast(`Successfully imported ${parsed.orchards.length} orchards!`);
        } else {
          alert('Invalid format. File must contain "offices" and "orchards" arrays.');
        }
      } catch (err) {
        alert('Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
  };

  const filteredOrchards = orchards.filter(o => {
    const q = searchQuery.toLowerCase();
    return (
      o.name.toLowerCase().includes(q) ||
      o.address.toLowerCase().includes(q) ||
      o.district.toLowerCase().includes(q) ||
      o.upazila.toLowerCase().includes(q) ||
      o.varieties.some(v => v.fruit.toLowerCase().includes(q) || v.variety.toLowerCase().includes(q))
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-emerald-800/80 rounded-2xl w-full max-w-4xl max-h-[90vh] shadow-2xl flex flex-col overflow-hidden text-slate-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">BARI GIS Management Panel</h3>
              <p className="text-xs text-slate-400">
                Add, modify or export geographical orchard records & research stations
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toast alert */}
        {toastMessage && (
          <div className="bg-emerald-900/90 text-white px-4 py-2 text-xs font-semibold flex items-center gap-2 border-b border-emerald-700 animate-in slide-in-from-top-2">
            <Check className="w-4 h-4 text-emerald-300" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center px-6 border-b border-slate-800 bg-slate-950/50 text-xs font-semibold">
          <button
            onClick={() => {
              setActiveTab('orchards');
              setEditingOrchard(null);
            }}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'orchards'
                ? 'border-emerald-400 text-white bg-emerald-950/40'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Trees className="w-4 h-4 text-emerald-400" />
            <span>Orchards ({orchards.length})</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('offices');
              setEditingOffice(null);
            }}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'offices'
                ? 'border-emerald-400 text-white bg-emerald-950/40'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Building2 className="w-4 h-4 text-amber-400" />
            <span>BARI Offices ({offices.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('importExport')}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'importExport'
                ? 'border-emerald-400 text-white bg-emerald-950/40'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Download className="w-4 h-4 text-indigo-400" />
            <span>Backup & Export for GitHub</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* ========================================================= */}
          {/* TAB 1: ORCHARDS MANAGEMENT                                */}
          {/* ========================================================= */}
          {activeTab === 'orchards' && (
            <div>
              {editingOrchard ? (
                /* Orchard Form */
                <form onSubmit={handleSaveOrchardForm} className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Trees className="w-4 h-4 text-emerald-400" />
                      <span>{isCreatingOrchard ? 'Add New Orchard' : `Edit: ${editingOrchard.name}`}</span>
                    </h4>
                    <button
                      type="button"
                      onClick={() => setEditingOrchard(null)}
                      className="text-xs text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    {/* Supervising Office */}
                    <div>
                      <label className="block text-slate-400 font-medium mb-1">
                        Supervising BARI Office *
                      </label>
                      <select
                        value={editingOrchard.officeId}
                        onChange={e => setEditingOrchard({ ...editingOrchard, officeId: e.target.value })}
                        className="w-full bg-slate-950 text-white rounded-lg px-3 py-2 border border-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                        required
                      >
                        {offices.map(o => (
                          <option key={o.id} value={o.id}>
                            {o.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Orchard Name */}
                    <div>
                      <label className="block text-slate-400 font-medium mb-1">Orchard Name *</label>
                      <input
                        type="text"
                        value={editingOrchard.name}
                        onChange={e => setEditingOrchard({ ...editingOrchard, name: e.target.value })}
                        placeholder="e.g. Lakkha field, Haralda, Pomology section"
                        className="w-full bg-slate-950 text-white rounded-lg px-3 py-2 border border-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                        required
                      />
                    </div>

                    {/* District */}
                    <div>
                      <label className="block text-slate-400 font-medium mb-1">District *</label>
                      <select
                        value={editingOrchard.district}
                        onChange={e => {
                          const dist = e.target.value;
                          const upzs = getUpazilasForDistrict(dist);
                          setEditingOrchard({
                            ...editingOrchard,
                            district: dist,
                            upazila: upzs[0] || ''
                          });
                        }}
                        className="w-full bg-slate-950 text-white rounded-lg px-3 py-2 border border-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                        required
                      >
                        {districts.map(d => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Upazila */}
                    <div>
                      <label className="block text-slate-400 font-medium mb-1">Upazila / Thana *</label>
                      <select
                        value={editingOrchard.upazila}
                        onChange={e => setEditingOrchard({ ...editingOrchard, upazila: e.target.value })}
                        className="w-full bg-slate-950 text-white rounded-lg px-3 py-2 border border-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                        required
                      >
                        {getUpazilasForDistrict(editingOrchard.district).map(u => (
                          <option key={u} value={u}>
                            {u}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Address */}
                    <div className="sm:col-span-2">
                      <label className="block text-slate-400 font-medium mb-1">Address / Landmark</label>
                      <input
                        type="text"
                        value={editingOrchard.address}
                        onChange={e => setEditingOrchard({ ...editingOrchard, address: e.target.value })}
                        placeholder="e.g. Haralda, Mohichal, Chandina"
                        className="w-full bg-slate-950 text-white rounded-lg px-3 py-2 border border-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                      />
                    </div>

                    {/* Latitude */}
                    <div>
                      <label className="block text-slate-400 font-medium mb-1">Latitude (WGS84) *</label>
                      <input
                        type="number"
                        step="any"
                        value={editingOrchard.latitude}
                        onChange={e => setEditingOrchard({ ...editingOrchard, latitude: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-slate-950 text-white rounded-lg px-3 py-2 border border-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-400 font-mono"
                        required
                      />
                    </div>

                    {/* Longitude */}
                    <div>
                      <label className="block text-slate-400 font-medium mb-1">Longitude (WGS84) *</label>
                      <input
                        type="number"
                        step="any"
                        value={editingOrchard.longitude}
                        onChange={e => setEditingOrchard({ ...editingOrchard, longitude: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-slate-950 text-white rounded-lg px-3 py-2 border border-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-400 font-mono"
                        required
                      />
                    </div>

                    {/* Area (Acres) */}
                    <div>
                      <label className="block text-slate-400 font-medium mb-1">Area (Acres) *</label>
                      <input
                        type="number"
                        step="0.01"
                        value={editingOrchard.areaAcre}
                        onChange={e => {
                          const val = parseFloat(e.target.value) || 0;
                          setEditingOrchard({
                            ...editingOrchard,
                            areaAcre: val,
                            areaHector: Math.round((val / 2.47105) * 1000) / 1000
                          });
                        }}
                        className="w-full bg-slate-950 text-white rounded-lg px-3 py-2 border border-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-400 font-mono"
                        required
                      />
                    </div>

                    {/* Planting Date */}
                    <div>
                      <label className="block text-slate-400 font-medium mb-1">Date of Planting</label>
                      <input
                        type="date"
                        value={editingOrchard.dateOfPlanting || ''}
                        onChange={e => setEditingOrchard({ ...editingOrchard, dateOfPlanting: e.target.value })}
                        className="w-full bg-slate-950 text-white rounded-lg px-3 py-2 border border-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                      />
                    </div>
                  </div>

                  {/* Varieties Editor Table */}
                  <div className="mt-4 pt-3 border-t border-slate-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                        Fruit Varieties in this Orchard ({editingOrchard.varieties.length})
                      </span>
                      <button
                        type="button"
                        onClick={handleAddVariety}
                        className="px-2 py-1 text-xs font-semibold bg-emerald-800 hover:bg-emerald-700 text-white rounded flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Variety</span>
                      </button>
                    </div>

                    <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                      {editingOrchard.varieties.map((v, idx) => (
                        <div
                          key={idx}
                          className="grid grid-cols-12 gap-2 items-center bg-slate-950 p-2 rounded-lg border border-slate-800 text-xs"
                        >
                          <div className="col-span-3">
                            <input
                              type="text"
                              placeholder="Fruit (e.g. Mango)"
                              value={v.fruit}
                              onChange={e => handleUpdateVariety(idx, 'fruit', e.target.value)}
                              className="w-full bg-slate-900 text-white px-2 py-1 rounded border border-slate-700"
                              required
                            />
                          </div>
                          <div className="col-span-4">
                            <input
                              type="text"
                              placeholder="Variety (e.g. BARI Aam-4)"
                              value={v.variety}
                              onChange={e => handleUpdateVariety(idx, 'variety', e.target.value)}
                              className="w-full bg-slate-900 text-white px-2 py-1 rounded border border-slate-700"
                              required
                            />
                          </div>
                          <div className="col-span-2">
                            <input
                              type="number"
                              placeholder="Plants"
                              min="0"
                              value={v.plants}
                              onChange={e => handleUpdateVariety(idx, 'plants', parseInt(e.target.value, 10) || 0)}
                              className="w-full bg-slate-900 text-white px-2 py-1 rounded border border-slate-700 font-mono"
                              required
                            />
                          </div>
                          <div className="col-span-2">
                            <input
                              type="date"
                              value={v.date || ''}
                              onChange={e => handleUpdateVariety(idx, 'date', e.target.value)}
                              className="w-full bg-slate-900 text-white px-1 py-1 rounded border border-slate-700 text-[10px]"
                            />
                          </div>
                          <div className="col-span-1 text-right">
                            <button
                              type="button"
                              onClick={() => handleRemoveVariety(idx)}
                              className="text-red-400 hover:text-red-300 p-1"
                              title="Delete variety"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Form Action Buttons */}
                  <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingOrchard(null)}
                      className="px-4 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-all shadow-md flex items-center gap-1.5"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Orchard Record</span>
                    </button>
                  </div>
                </form>
              ) : (
                /* Orchards List */
                <div>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search orchards by name, district, upazila, fruit..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full bg-slate-950 text-white text-xs rounded-lg pl-9 pr-4 py-2 border border-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                      />
                    </div>
                    <button
                      onClick={handleStartCreateOrchard}
                      className="px-3.5 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-all shadow-md flex items-center justify-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add New Orchard</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {filteredOrchards.map(orchard => {
                      const totalPlants = orchard.varieties.reduce((s, v) => s + (v.plants || 0), 0);
                      const office = offices.find(o => o.id === orchard.officeId);

                      return (
                        <div
                          key={orchard.id}
                          className="p-3 bg-slate-950 rounded-xl border border-slate-800 hover:border-slate-700 flex items-center justify-between transition-colors text-xs"
                        >
                          <div className="flex-1 pr-4">
                            <div className="flex items-center gap-2">
                              <h5 className="font-bold text-white text-sm">{orchard.name}</h5>
                              <span className="text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                                {orchard.upazila}, {orchard.district}
                              </span>
                            </div>
                            <p className="text-slate-400 text-xs mt-0.5">{orchard.address}</p>
                            <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                              <span>Station: <strong className="text-slate-300">{office?.shortName || 'BARI'}</strong></span>
                              <span>•</span>
                              <span>Area: <strong className="text-slate-300">{orchard.areaAcre} Acres</strong></span>
                              <span>•</span>
                              <span>Varieties: <strong className="text-indigo-400">{orchard.varieties.length}</strong></span>
                              <span>•</span>
                              <span>Plants: <strong className="text-teal-400 font-mono">{totalPlants}</strong></span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => {
                                setEditingOrchard(orchard);
                                setIsCreatingOrchard(false);
                              }}
                              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors"
                              title="Edit Orchard"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Are you sure you want to delete "${orchard.name}"?`)) {
                                  onDeleteOrchard(orchard.id);
                                  showToast('Orchard removed.');
                                }
                              }}
                              className="p-1.5 bg-red-950/60 hover:bg-red-900 text-red-300 rounded-lg transition-colors border border-red-800/60"
                              title="Delete Orchard"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}

                    {filteredOrchards.length === 0 && (
                      <div className="py-8 text-center text-slate-500 text-xs">
                        No orchards found matching your criteria.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: OFFICES MANAGEMENT                                 */}
          {/* ========================================================= */}
          {activeTab === 'offices' && (
            <div>
              {editingOffice ? (
                /* Office Form */
                <form onSubmit={handleSaveOfficeForm} className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-amber-400" />
                      <span>{isCreatingOffice ? 'Add New BARI Station' : `Edit: ${editingOffice.name}`}</span>
                    </h4>
                    <button
                      type="button"
                      onClick={() => setEditingOffice(null)}
                      className="text-xs text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="sm:col-span-2">
                      <label className="block text-slate-400 font-medium mb-1">Official Name *</label>
                      <input
                        type="text"
                        value={editingOffice.name}
                        onChange={e => setEditingOffice({ ...editingOffice, name: e.target.value })}
                        placeholder="e.g. Regional Agricultural Research Station (RARS), BARI, Ishwardi"
                        className="w-full bg-slate-950 text-white rounded-lg px-3 py-2 border border-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 font-medium mb-1">Short Name / Code</label>
                      <input
                        type="text"
                        value={editingOffice.shortName}
                        onChange={e => setEditingOffice({ ...editingOffice, shortName: e.target.value })}
                        placeholder="e.g. RARS Ishwardi"
                        className="w-full bg-slate-950 text-white rounded-lg px-3 py-2 border border-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 font-medium mb-1">District *</label>
                      <select
                        value={editingOffice.district}
                        onChange={e => {
                          const dist = e.target.value;
                          const upzs = getUpazilasForDistrict(dist);
                          setEditingOffice({
                            ...editingOffice,
                            district: dist,
                            upazila: upzs[0] || ''
                          });
                        }}
                        className="w-full bg-slate-950 text-white rounded-lg px-3 py-2 border border-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                        required
                      >
                        {districts.map(d => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-400 font-medium mb-1">Upazila *</label>
                      <select
                        value={editingOffice.upazila}
                        onChange={e => setEditingOffice({ ...editingOffice, upazila: e.target.value })}
                        className="w-full bg-slate-950 text-white rounded-lg px-3 py-2 border border-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                        required
                      >
                        {getUpazilasForDistrict(editingOffice.district).map(u => (
                          <option key={u} value={u}>
                            {u}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-400 font-medium mb-1">Latitude *</label>
                      <input
                        type="number"
                        step="any"
                        value={editingOffice.latitude}
                        onChange={e => setEditingOffice({ ...editingOffice, latitude: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-slate-950 text-white rounded-lg px-3 py-2 border border-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-400 font-mono"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 font-medium mb-1">Longitude *</label>
                      <input
                        type="number"
                        step="any"
                        value={editingOffice.longitude}
                        onChange={e => setEditingOffice({ ...editingOffice, longitude: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-slate-950 text-white rounded-lg px-3 py-2 border border-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-400 font-mono"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 font-medium mb-1">Contact Phone</label>
                      <input
                        type="text"
                        value={editingOffice.phone || ''}
                        onChange={e => setEditingOffice({ ...editingOffice, phone: e.target.value })}
                        className="w-full bg-slate-950 text-white rounded-lg px-3 py-2 border border-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 font-medium mb-1">Contact Email</label>
                      <input
                        type="email"
                        value={editingOffice.email || ''}
                        onChange={e => setEditingOffice({ ...editingOffice, email: e.target.value })}
                        className="w-full bg-slate-950 text-white rounded-lg px-3 py-2 border border-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-slate-400 font-medium mb-1">Full Postal Address</label>
                      <input
                        type="text"
                        value={editingOffice.address}
                        onChange={e => setEditingOffice({ ...editingOffice, address: e.target.value })}
                        className="w-full bg-slate-950 text-white rounded-lg px-3 py-2 border border-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                      />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingOffice(null)}
                      className="px-4 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-all shadow-md flex items-center gap-1.5"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save BARI Station</span>
                    </button>
                  </div>
                </form>
              ) : (
                /* Offices List */
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs text-slate-400">
                      Research complexes and regional stations overseeing fruit germplasms.
                    </span>
                    <button
                      onClick={handleStartCreateOffice}
                      className="px-3.5 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-all shadow-md flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add New BARI Station</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {offices.map(office => {
                      const count = orchards.filter(o => o.officeId === office.id).length;
                      return (
                        <div
                          key={office.id}
                          className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-start justify-between text-xs"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <h5 className="font-bold text-white text-sm">{office.name}</h5>
                              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">
                                {office.shortName}
                              </span>
                            </div>
                            <p className="text-slate-400 mt-1">{office.address}</p>
                            <div className="mt-2 flex flex-wrap items-center gap-3 text-slate-400">
                              <span>District: <strong className="text-slate-200">{office.district}</strong></span>
                              <span>Upazila: <strong className="text-slate-200">{office.upazila}</strong></span>
                              <span>Orchards: <strong className="text-emerald-400">{count}</strong></span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => {
                                setEditingOffice(office);
                                setIsCreatingOffice(false);
                              }}
                              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors"
                              title="Edit Station"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (count > 0) {
                                  alert(`Cannot delete this station because ${count} orchards are assigned to it.`);
                                  return;
                                }
                                if (confirm(`Delete office "${office.name}"?`)) {
                                  onDeleteOffice(office.id);
                                  showToast('Office deleted.');
                                }
                              }}
                              className="p-1.5 bg-red-950/60 hover:bg-red-900 text-red-300 rounded-lg transition-colors border border-red-800/60"
                              title="Delete Station"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3: BACKUP, EXPORT & GITHUB SYNC                       */}
          {/* ========================================================= */}
          {activeTab === 'importExport' && (
            <div className="space-y-6 text-xs">
              {/* GitHub Hosting Guide */}
              <div className="bg-emerald-950/40 p-4 rounded-xl border border-emerald-800/80">
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  <Download className="w-4 h-4 text-emerald-400" />
                  <span>GitHub Hosting & Deployment Instructions</span>
                </h4>
                <p className="text-slate-300 mt-1.5 leading-relaxed">
                  This web application is completely self-contained. All BARI shapefile geometries, upazila boundaries, and orchard locations are bundled. You can push this repository directly to GitHub and deploy it for free using <strong>GitHub Pages</strong> or any static host!
                </p>
                <div className="mt-3 bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-[11px] text-emerald-300">
                  git init<br />
                  git add .<br />
                  git commit -m &quot;Initial BARI Orchards GIS Portal release&quot;<br />
                  git remote add origin https://github.com/&lt;your-username&gt;/bari-orchards-gis.git<br />
                  git push -u origin main
                </div>
              </div>

              {/* Data Export Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
                  <div>
                    <h5 className="font-bold text-white text-sm flex items-center gap-2">
                      <Download className="w-4 h-4 text-amber-400" />
                      <span>Export Orchards (CSV)</span>
                    </h5>
                    <p className="text-slate-400 mt-1">
                      Download spreadsheet containing all orchards, GPS coordinates, areas, and full variety breakdown.
                    </p>
                  </div>
                  <button
                    onClick={handleDownloadCSV}
                    className="mt-4 w-full py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-all shadow-sm"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download CSV Spreadsheet</span>
                  </button>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
                  <div>
                    <h5 className="font-bold text-white text-sm flex items-center gap-2">
                      <Download className="w-4 h-4 text-indigo-400" />
                      <span>Export Complete Database (JSON)</span>
                    </h5>
                    <p className="text-slate-400 mt-1">
                      Download full structured JSON file including BARI stations, orchard coordinates, and varieties.
                    </p>
                  </div>
                  <button
                    onClick={handleDownloadJSON}
                    className="mt-4 w-full py-2 bg-indigo-700 hover:bg-indigo-600 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-all shadow-sm"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download JSON Backup</span>
                  </button>
                </div>
              </div>

              {/* Data Import & Reset */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800">
                {/* Import JSON */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <h5 className="font-bold text-white text-sm flex items-center gap-2">
                    <Upload className="w-4 h-4 text-teal-400" />
                    <span>Restore / Import Database</span>
                  </h5>
                  <p className="text-slate-400 mt-1 mb-3">
                    Upload a previously exported JSON database to restore or migrate data.
                  </p>
                  <label className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer border border-slate-700">
                    <Upload className="w-4 h-4" />
                    <span>Select JSON File</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleJSONFileImport}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Reset to Default Seed Data */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <h5 className="font-bold text-white text-sm flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 text-rose-400" />
                    <span>Reset to Original Seed Data</span>
                  </h5>
                  <p className="text-slate-400 mt-1 mb-3">
                    Reset all offices and orchards to the original Gazipur & Comilla BARI datasets.
                  </p>
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to restore the original BARI dataset? Any custom additions will be reset.')) {
                        onResetData();
                        showToast('Restored default BARI dataset.');
                      }
                    }}
                    className="w-full py-2 bg-red-950/80 hover:bg-red-900 text-red-200 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all border border-red-800/80"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Reset to Default BARI Data</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
