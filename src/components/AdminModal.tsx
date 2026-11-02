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
  Search,
  Check,
  Camera,
  Image as ImageIcon,
  ExternalLink
} from 'lucide-react';
import { BARIOffice, Orchard, FruitVariety, DistrictHierarchy, OrchardImage } from '../types';
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
  galleryImages: { id: string; url: string; title: string; caption: string }[];
  onSaveGalleryImage: (image: { id: string; url: string; title: string; caption: string }) => void;
  onDeleteGalleryImage: (id: string) => void;
  initialTab?: 'orchards' | 'offices' | 'gallery' | 'importExport';
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
  initialEditOrchard,
  galleryImages,
  onSaveGalleryImage,
  onDeleteGalleryImage,
  initialTab = 'orchards'
}) => {
  const [activeTab, setActiveTab] = useState<'orchards' | 'offices' | 'gallery' | 'importExport'>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingOrchard, setEditingOrchard] = useState<Orchard | null>(null);
  const [isCreatingOrchard, setIsCreatingOrchard] = useState(false);

  const [editingOffice, setEditingOffice] = useState<BARIOffice | null>(null);
  const [isCreatingOffice, setIsCreatingOffice] = useState(false);

  // Editing gallery image
  const [editingGalleryImage, setEditingGalleryImage] = useState<{ id: string; url: string; title: string; caption: string } | null>(null);
  const [isCreatingGalleryImage, setIsCreatingGalleryImage] = useState(false);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    if (initialEditOrchard) {
      setEditingOrchard(initialEditOrchard);
      setIsCreatingOrchard(false);
      setActiveTab('orchards');
    }
  }, [initialEditOrchard]);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  if (!isOpen) return null;

  // ------------------------------------------
  // ORCHARD FORM HANDLERS
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
      ],
      images: []
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

  const getUpazilasForDistrict = (districtName: string): string[] => {
    for (const div in hierarchy) {
      if (hierarchy[div][districtName]) {
        return hierarchy[div][districtName];
      }
    }
    return [];
  };

  // ------------------------------------------
  // GALLERY IMAGE FORM HANDLERS
  // ------------------------------------------
  const handleStartCreateGalleryImage = () => {
    setIsCreatingGalleryImage(true);
    setEditingGalleryImage({
      id: `img_custom_${Date.now()}`,
      url: '',
      title: '',
      caption: ''
    });
  };

  const handleSaveGalleryImageForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGalleryImage) return;
    if (!editingGalleryImage.url.trim() || !editingGalleryImage.title.trim()) {
      alert('Please enter Image URL and Title.');
      return;
    }
    onSaveGalleryImage(editingGalleryImage);
    setEditingGalleryImage(null);
    setIsCreatingGalleryImage(false);
    showToast('Orchard image saved successfully!');
  };

  // ------------------------------------------
  // EXPORT / IMPORT HANDLERS
  // ------------------------------------------
  const handleDownloadJSON = () => {
    const payload = {
      timestamp: new Date().toISOString(),
      offices,
      orchards,
      galleryImages
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-4xl max-h-[90vh] shadow-2xl flex flex-col overflow-hidden text-slate-800">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-200">
              <Building2 className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">BARI Management & Admin Panel</h3>
              <p className="text-xs text-slate-500">
                Add, modify or export geographical orchard records, images & research stations
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toast alert */}
        {toastMessage && (
          <div className="bg-emerald-600 text-white px-4 py-2 text-xs font-semibold flex items-center gap-2 border-b border-emerald-700 animate-in slide-in-from-top-2">
            <Check className="w-4 h-4 text-emerald-200" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center px-6 border-b border-slate-200 bg-slate-100/60 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => {
              setActiveTab('orchards');
              setEditingOrchard(null);
            }}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'orchards'
                ? 'border-emerald-700 text-emerald-800 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Trees className="w-4 h-4 text-emerald-700" />
            <span>Orchards ({orchards.length})</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('offices');
              setEditingOffice(null);
            }}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'offices'
                ? 'border-emerald-700 text-emerald-800 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-4 h-4 text-emerald-700" />
            <span>BARI Offices ({offices.length})</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('gallery');
              setEditingGalleryImage(null);
            }}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'gallery'
                ? 'border-emerald-700 text-emerald-800 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Camera className="w-4 h-4 text-emerald-700" />
            <span>Orchard Images ({galleryImages.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('importExport')}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'importExport'
                ? 'border-emerald-700 text-emerald-800 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Download className="w-4 h-4 text-indigo-600" />
            <span>Export & GitHub</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
          {/* ========================================================= */}
          {/* TAB 1: ORCHARDS MANAGEMENT                                */}
          {/* ========================================================= */}
          {activeTab === 'orchards' && (
            <div>
              {editingOrchard ? (
                /* Orchard Form */
                <form onSubmit={handleSaveOrchardForm} className="space-y-4 bg-white p-5 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Trees className="w-4 h-4 text-emerald-700" />
                      <span>{isCreatingOrchard ? 'Add New Orchard' : `Edit: ${editingOrchard.name}`}</span>
                    </h4>
                    <button
                      type="button"
                      onClick={() => setEditingOrchard(null)}
                      className="text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    {/* Supervising Office */}
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Supervising BARI Office *
                      </label>
                      <select
                        value={editingOrchard.officeId}
                        onChange={e => setEditingOrchard({ ...editingOrchard, officeId: e.target.value })}
                        className="w-full bg-slate-50 text-slate-800 rounded-lg px-3 py-2 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                      <label className="block text-slate-700 font-semibold mb-1">Orchard Name *</label>
                      <input
                        type="text"
                        value={editingOrchard.name}
                        onChange={e => setEditingOrchard({ ...editingOrchard, name: e.target.value })}
                        placeholder="e.g. Lakkha field, Haralda, Pomology section"
                        className="w-full bg-slate-50 text-slate-800 rounded-lg px-3 py-2 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        required
                      />
                    </div>

                    {/* District */}
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">District *</label>
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
                        className="w-full bg-slate-50 text-slate-800 rounded-lg px-3 py-2 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                      <label className="block text-slate-700 font-semibold mb-1">Upazila / Thana *</label>
                      <select
                        value={editingOrchard.upazila}
                        onChange={e => setEditingOrchard({ ...editingOrchard, upazila: e.target.value })}
                        className="w-full bg-slate-50 text-slate-800 rounded-lg px-3 py-2 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                      <label className="block text-slate-700 font-semibold mb-1">Address / Landmark</label>
                      <input
                        type="text"
                        value={editingOrchard.address}
                        onChange={e => setEditingOrchard({ ...editingOrchard, address: e.target.value })}
                        placeholder="e.g. Haralda, Mohichal, Chandina"
                        className="w-full bg-slate-50 text-slate-800 rounded-lg px-3 py-2 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    {/* Latitude */}
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Latitude (WGS84) *</label>
                      <input
                        type="number"
                        step="any"
                        value={editingOrchard.latitude}
                        onChange={e => setEditingOrchard({ ...editingOrchard, latitude: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-slate-50 text-slate-800 rounded-lg px-3 py-2 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                        required
                      />
                    </div>

                    {/* Longitude */}
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Longitude (WGS84) *</label>
                      <input
                        type="number"
                        step="any"
                        value={editingOrchard.longitude}
                        onChange={e => setEditingOrchard({ ...editingOrchard, longitude: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-slate-50 text-slate-800 rounded-lg px-3 py-2 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                        required
                      />
                    </div>

                    {/* Area (Acres) */}
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Area (Acres) *</label>
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
                        className="w-full bg-slate-50 text-slate-800 rounded-lg px-3 py-2 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                        required
                      />
                    </div>

                    {/* Planting Date */}
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Date of Planting</label>
                      <input
                        type="date"
                        value={editingOrchard.dateOfPlanting || ''}
                        onChange={e => setEditingOrchard({ ...editingOrchard, dateOfPlanting: e.target.value })}
                        className="w-full bg-slate-50 text-slate-800 rounded-lg px-3 py-2 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Varieties Editor Table */}
                  <div className="mt-4 pt-3 border-t border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        Fruit Varieties in this Orchard ({editingOrchard.varieties.length})
                      </span>
                      <button
                        type="button"
                        onClick={handleAddVariety}
                        className="px-2.5 py-1 text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Variety</span>
                      </button>
                    </div>

                    <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                      {editingOrchard.varieties.map((v, idx) => (
                        <div
                          key={idx}
                          className="grid grid-cols-12 gap-2 items-center bg-slate-50 p-2 rounded-lg border border-slate-200 text-xs"
                        >
                          <div className="col-span-3">
                            <input
                              type="text"
                              placeholder="Fruit (e.g. Mango)"
                              value={v.fruit}
                              onChange={e => handleUpdateVariety(idx, 'fruit', e.target.value)}
                              className="w-full bg-white text-slate-800 px-2 py-1 rounded border border-slate-300"
                              required
                            />
                          </div>
                          <div className="col-span-4">
                            <input
                              type="text"
                              placeholder="Variety (e.g. BARI Aam-4)"
                              value={v.variety}
                              onChange={e => handleUpdateVariety(idx, 'variety', e.target.value)}
                              className="w-full bg-white text-slate-800 px-2 py-1 rounded border border-slate-300"
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
                              className="w-full bg-white text-slate-800 px-2 py-1 rounded border border-slate-300 font-mono"
                              required
                            />
                          </div>
                          <div className="col-span-2">
                            <input
                              type="date"
                              value={v.date || ''}
                              onChange={e => handleUpdateVariety(idx, 'date', e.target.value)}
                              className="w-full bg-white text-slate-800 px-1 py-1 rounded border border-slate-300 text-[10px]"
                            />
                          </div>
                          <div className="col-span-1 text-right">
                            <button
                              type="button"
                              onClick={() => handleRemoveVariety(idx)}
                              className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
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
                  <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingOrchard(null)}
                      className="px-4 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
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
                        className="w-full bg-white text-slate-800 text-xs rounded-lg pl-9 pr-4 py-2 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <button
                      onClick={handleStartCreateOrchard}
                      className="px-3.5 py-2 text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
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
                          className="p-3.5 bg-white rounded-xl border border-slate-200 hover:border-slate-300 flex items-center justify-between transition-colors text-xs shadow-2xs"
                        >
                          <div className="flex-1 pr-4">
                            <div className="flex items-center gap-2">
                              <h5 className="font-bold text-slate-900 text-sm">{orchard.name}</h5>
                              <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 font-medium">
                                {orchard.upazila}, {orchard.district}
                              </span>
                            </div>
                            <p className="text-slate-500 text-xs mt-0.5">{orchard.address}</p>
                            <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[11px] text-slate-600">
                              <span>Station: <strong className="text-slate-800">{office?.shortName || 'BARI'}</strong></span>
                              <span>•</span>
                              <span>Area: <strong className="text-slate-800">{orchard.areaAcre} Acres</strong></span>
                              <span>•</span>
                              <span>Varieties: <strong className="text-indigo-700">{orchard.varieties.length}</strong></span>
                              <span>•</span>
                              <span>Plants: <strong className="text-teal-700 font-mono font-bold">{totalPlants}</strong></span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => {
                                setEditingOrchard(orchard);
                                setIsCreatingOrchard(false);
                              }}
                              className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
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
                              className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg transition-colors border border-rose-200 cursor-pointer"
                              title="Delete Orchard"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}

                    {filteredOrchards.length === 0 && (
                      <div className="py-8 text-center text-slate-400 text-xs">
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
              <div className="space-y-3">
                {offices.map(office => {
                  const count = orchards.filter(o => o.officeId === office.id).length;
                  return (
                    <div
                      key={office.id}
                      className="p-4 bg-white rounded-xl border border-slate-200 flex items-start justify-between text-xs shadow-2xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="font-bold text-slate-900 text-sm">{office.name}</h5>
                          <span className="text-[10px] bg-amber-50 text-amber-800 px-2 py-0.5 rounded border border-amber-200 font-semibold">
                            {office.shortName}
                          </span>
                        </div>
                        <p className="text-slate-600 mt-1">{office.address}</p>
                        <div className="mt-2 flex flex-wrap items-center gap-3 text-slate-500">
                          <span>District: <strong className="text-slate-800">{office.district}</strong></span>
                          <span>Upazila: <strong className="text-slate-800">{office.upazila}</strong></span>
                          <span>Orchards: <strong className="text-emerald-700">{count}</strong></span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3: ORCHARD IMAGES & GALLERY                           */}
          {/* ========================================================= */}
          {activeTab === 'gallery' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-emerald-700" />
                    <span>Manage Orchard Showcase Images</span>
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Add or modify the 3 orchard images shown in the last layer of the main page.
                  </p>
                </div>
                {!editingGalleryImage && (
                  <button
                    onClick={handleStartCreateGalleryImage}
                    className="px-3 py-1.5 text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Photo</span>
                  </button>
                )}
              </div>

              {editingGalleryImage ? (
                /* Edit Gallery Image Form */
                <form onSubmit={handleSaveGalleryImageForm} className="bg-white p-4 rounded-xl border border-slate-200 space-y-3 text-xs">
                  <h5 className="font-bold text-slate-900">
                    {isCreatingGalleryImage ? 'Add New Orchard Photo' : 'Edit Orchard Photo'}
                  </h5>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Image URL (Direct image link or local path) *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. https://example.com/orchard.jpg or ./assets/images/bari_mango_orchard.jpg"
                      value={editingGalleryImage.url}
                      onChange={e => setEditingGalleryImage({ ...editingGalleryImage, url: e.target.value })}
                      className="w-full bg-slate-50 text-slate-800 px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Title *</label>
                    <input
                      type="text"
                      placeholder="e.g. BARI Mango Research Field"
                      value={editingGalleryImage.title}
                      onChange={e => setEditingGalleryImage({ ...editingGalleryImage, title: e.target.value })}
                      className="w-full bg-slate-50 text-slate-800 px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Description / Caption</label>
                    <input
                      type="text"
                      placeholder="e.g. BARI Mango-4 evaluation rows with research signage"
                      value={editingGalleryImage.caption}
                      onChange={e => setEditingGalleryImage({ ...editingGalleryImage, caption: e.target.value })}
                      className="w-full bg-slate-50 text-slate-800 px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  {/* Preview */}
                  {editingGalleryImage.url && (
                    <div className="mt-2">
                      <span className="block text-slate-500 text-[11px] mb-1">Image Preview:</span>
                      <div className="w-48 h-32 rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                        <img
                          src={editingGalleryImage.url}
                          alt="preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=Invalid+Image+URL';
                          }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setEditingGalleryImage(null)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Photo</span>
                    </button>
                  </div>
                </form>
              ) : (
                /* Gallery Grid */
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {galleryImages.map(img => (
                    <div
                      key={img.id}
                      className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs flex flex-col justify-between"
                    >
                      <div className="aspect-4/3 bg-slate-100 overflow-hidden relative">
                        <img
                          src={img.url}
                          alt={img.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-3">
                        <h5 className="font-bold text-xs text-slate-900 line-clamp-1">{img.title}</h5>
                        <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{img.caption}</p>
                        <div className="mt-3 flex items-center justify-end gap-1.5 pt-2 border-t border-slate-100">
                          <button
                            onClick={() => {
                              setEditingGalleryImage(img);
                              setIsCreatingGalleryImage(false);
                            }}
                            className="p-1 text-slate-600 hover:text-emerald-700 hover:bg-slate-100 rounded cursor-pointer"
                            title="Edit details"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          {galleryImages.length > 3 && (
                            <button
                              onClick={() => {
                                if (confirm(`Remove photo "${img.title}"?`)) {
                                  onDeleteGalleryImage(img.id);
                                  showToast('Photo removed.');
                                }
                              }}
                              className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded cursor-pointer"
                              title="Delete photo"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 4: BACKUP, EXPORT & GITHUB SYNC                       */}
          {/* ========================================================= */}
          {activeTab === 'importExport' && (
            <div className="space-y-6 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col justify-between shadow-2xs">
                  <div>
                    <h5 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <Download className="w-4 h-4 text-emerald-700" />
                      <span>Export Orchards (CSV)</span>
                    </h5>
                    <p className="text-slate-500 mt-1">
                      Download spreadsheet containing all orchards, GPS coordinates, areas, and full variety breakdown.
                    </p>
                  </div>
                  <button
                    onClick={handleDownloadCSV}
                    className="mt-4 w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download CSV Spreadsheet</span>
                  </button>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col justify-between shadow-2xs">
                  <div>
                    <h5 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <Download className="w-4 h-4 text-indigo-700" />
                      <span>Export Complete Database (JSON)</span>
                    </h5>
                    <p className="text-slate-500 mt-1">
                      Download full structured JSON file including BARI stations, orchard coordinates, and varieties for GitHub.
                    </p>
                  </div>
                  <button
                    onClick={handleDownloadJSON}
                    className="mt-4 w-full py-2 bg-indigo-700 hover:bg-indigo-800 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download JSON Backup</span>
                  </button>
                </div>
              </div>

              {/* Data Import & Reset */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                  <h5 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <Upload className="w-4 h-4 text-teal-700" />
                    <span>Restore / Import Database</span>
                  </h5>
                  <p className="text-slate-500 mt-1 mb-3">
                    Upload a previously exported JSON database to restore or migrate data.
                  </p>
                  <label className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer border border-slate-300">
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

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                  <h5 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 text-rose-600" />
                    <span>Reset to Original Seed Data</span>
                  </h5>
                  <p className="text-slate-500 mt-1 mb-3">
                    Reset all offices and orchards to the original Gazipur & Comilla BARI datasets.
                  </p>
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to restore the original BARI dataset? Any custom additions will be reset.')) {
                        onResetData();
                        showToast('Restored default BARI dataset.');
                      }
                    }}
                    className="w-full py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all border border-rose-200 cursor-pointer"
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
