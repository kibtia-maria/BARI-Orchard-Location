/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BARIOffice, Orchard } from '../types';

export const INITIAL_OFFICES: BARIOffice[] = [
  {
    id: "office_gazipur",
    name: "BARI Central Research Station & Headquarters, Gazipur",
    shortName: "BARI HQ Gazipur",
    district: "Gazipur",
    upazila: "Gazipur",
    division: "Dhaka Division",
    address: "Joydebpur, Gazipur-1701, Bangladesh",
    latitude: 23.9883,
    longitude: 90.4125,
    phone: "+880-2-49270001",
    email: "dg@bari.gov.bd",
    established: "1976",
    description: "Principal headquarters and national agricultural research complex of Bangladesh Agricultural Research Institute (BARI)."
  },
  {
    id: "office_comilla",
    name: "Regional Agricultural Research Station (RARS), BARI, Cumilla",
    shortName: "RARS Cumilla",
    district: "Comilla",
    upazila: "Comilla",
    division: "Chittagong Division",
    address: "Kotbari / Adarsha Sadar, Cumilla, Bangladesh",
    latitude: 23.4705,
    longitude: 91.1562,
    phone: "+880-81-65432",
    email: "cso.rars.comilla@bari.gov.bd",
    established: "1982",
    description: "Premier regional agricultural research station overseeing fruit, horticulture, and field crop research across greater Cumilla."
  }
];

export const INITIAL_ORCHARDS: Orchard[] = [
  // --- Gazipur Orchards ---
  {
    id: "orchard_gaz_1",
    officeId: "office_gazipur",
    name: "Fruit Division",
    address: "Fruit Division, BARI HQ Campus, Joydebpur, Gazipur",
    district: "Gazipur",
    upazila: "Gazipur",
    latitude: 23.9838117,
    longitude: 90.4074267,
    areaAcre: 0.5,
    areaHector: 0.202,
    dateOfPlanting: "2014-10-01",
    varieties: [
      { fruit: "Sofeda", variety: "Sofeda", plants: 20, date: "2014-10-01" }
    ]
  },
  {
    id: "orchard_gaz_2",
    officeId: "office_gazipur",
    name: "Lakkha field",
    address: "Lakkha field, BARI HQ Campus, Joydebpur, Gazipur",
    district: "Gazipur",
    upazila: "Gazipur",
    latitude: 23.9865945,
    longitude: 90.3999522,
    areaAcre: 2.0,
    areaHector: 0.809,
    dateOfPlanting: "2017-01-03",
    varieties: [
      { fruit: "Boroi", variety: "Boroi", plants: 500, date: "2017-01-03" }
    ]
  },
  {
    id: "orchard_gaz_3",
    officeId: "office_gazipur",
    name: "HRC backyard",
    address: "HRC backyard, BARI HQ Campus, Joydebpur, Gazipur",
    district: "Gazipur",
    upazila: "Gazipur",
    latitude: 23.9945467,
    longitude: 90.4121217,
    areaAcre: 1.5,
    areaHector: 0.607,
    dateOfPlanting: "2026-10-15",
    varieties: [
      { fruit: "Mango", variety: "BARI Mango-11", plants: 10, date: "2026-10-15" }
    ]
  },
  {
    id: "orchard_gaz_4",
    officeId: "office_gazipur",
    name: "Breeding besides temple",
    address: "Breeding besides temple, BARI HQ Campus, Joydebpur, Gazipur",
    district: "Gazipur",
    upazila: "Gazipur",
    latitude: 23.9946733,
    longitude: 90.4156017,
    areaAcre: 2.0,
    areaHector: 0.809,
    dateOfPlanting: "2025-08-13",
    varieties: [
      { fruit: "Coffee", variety: "BARI Coffee-1", plants: 120, date: "2025-08-13" }
    ]
  },
  {
    id: "orchard_gaz_5",
    officeId: "office_gazipur",
    name: "Pomology research field: HRC",
    address: "Pomology research field: HRC, BARI HQ Campus, Joydebpur, Gazipur",
    district: "Gazipur",
    upazila: "Gazipur",
    latitude: 23.9837167,
    longitude: 90.4077917,
    areaAcre: 2.0,
    areaHector: 0.809,
    dateOfPlanting: "2026-10-15",
    varieties: [
      { fruit: "ZM (ex) -003", variety: "ZM (ex) -003", plants: 10, date: "2026-10-15" }
    ]
  },
  {
    id: "orchard_gaz_6",
    officeId: "office_gazipur",
    name: "Regional Spices Research Center",
    address: "Regional Spices Research Center, BARI HQ Campus, Joydebpur, Gazipur",
    district: "Gazipur",
    upazila: "Gazipur",
    latitude: 23.987975,
    longitude: 90.4094567,
    areaAcre: 5.0,
    areaHector: 2.023,
    dateOfPlanting: "2026-10-14",
    varieties: [
      { fruit: "Tejpata", variety: "Tejpata", plants: 75, date: "2026-10-14" }
    ]
  },
  {
    id: "orchard_gaz_7",
    officeId: "office_gazipur",
    name: "Floriculture",
    address: "Floriculture, BARI HQ Campus, Joydebpur, Gazipur",
    district: "Gazipur",
    upazila: "Gazipur",
    latitude: 23.9935627,
    longitude: 90.4126694,
    areaAcre: 0.5,
    areaHector: 0.202,
    dateOfPlanting: "2025-10-25",
    varieties: [
      { fruit: "Cactus", variety: "Cactus house", plants: 150, date: "2025-10-25" }
    ]
  },
  {
    id: "orchard_gaz_8",
    officeId: "office_gazipur",
    name: "Breeding field",
    address: "Breeding field, BARI HQ Campus, Joydebpur, Gazipur",
    district: "Gazipur",
    upazila: "Gazipur",
    latitude: 23.9947356,
    longitude: 90.4158471,
    areaAcre: 0.8,
    areaHector: 0.324,
    dateOfPlanting: "2026-10-25",
    varieties: [
      { fruit: "Coffee", variety: "Bari coffee -1", plants: 50, date: "2026-10-25" }
    ]
  },
  {
    id: "orchard_gaz_9",
    officeId: "office_gazipur",
    name: "Fol bagan",
    address: "Fol bagan, BARI HQ Campus, Joydebpur, Gazipur",
    district: "Gazipur",
    upazila: "Gazipur",
    latitude: 23.9838139,
    longitude: 90.4075786,
    areaAcre: 1.5,
    areaHector: 0.607,
    dateOfPlanting: "2006-08-15",
    varieties: [
      { fruit: "Mango", variety: "Bari Aam -3", plants: 18, date: "2006-08-15" }
    ]
  },
  {
    id: "orchard_gaz_10",
    officeId: "office_gazipur",
    name: "Fruit division",
    address: "Fruit division, BARI HQ Campus, Joydebpur, Gazipur",
    district: "Gazipur",
    upazila: "Gazipur",
    latitude: 23.9847578,
    longitude: 90.4120709,
    areaAcre: 0.5,
    areaHector: 0.202,
    dateOfPlanting: "2023-04-19",
    varieties: [
      { fruit: "Banana", variety: "MS Jas-001 (sabri kola)", plants: 30, date: "2023-04-19" }
    ]
  },

  // --- Cumilla Orchards under RARS Cumilla ---
  {
    id: "orchard_com_1",
    officeId: "office_comilla",
    name: "Sribidda, Cumilla Sadar Dakhin",
    address: "Sribidda, Cumilla Sadar dakhin, Cumilla",
    district: "Comilla",
    upazila: "Comilla",
    latitude: 23.3844451,
    longitude: 91.1437979,
    areaHector: 2.0,
    areaAcre: 4.94,
    dateOfPlanting: "2021-07-15",
    varieties: [
      { fruit: "Kathal", variety: "Bari Kathal-6", plants: 7, date: "2021-07-15" },
      { fruit: "Kathal", variety: "Bari kathal1", plants: 20, date: "2021-07-15" },
      { fruit: "Kathal", variety: "Bari kathal2", plants: 20, date: "2021-07-15" },
      { fruit: "Kathal", variety: "Bari kathal3", plants: 20, date: "2021-07-15" }
    ]
  },
  {
    id: "orchard_com_2",
    officeId: "office_comilla",
    name: "Haralda, Mohichal, Chandina",
    address: "Haralda, mohichal, Chandina, Cumilla",
    district: "Comilla",
    upazila: "Chandina",
    latitude: 23.4395335,
    longitude: 90.9373093,
    areaHector: 0.081,
    areaAcre: 0.20,
    dateOfPlanting: "2021-08-01",
    varieties: [
      { fruit: "Mango", variety: "BARI Aam-3", plants: 24, date: "2021-08-01" },
      { fruit: "Mango", variety: "BARI Aam-4", plants: 18, date: "2021-08-01" },
      { fruit: "Mango", variety: "BARI Aam-11", plants: 3, date: "2021-08-01" },
      { fruit: "Malta", variety: "BARI Malta-1", plants: 10, date: "2021-08-01" },
      { fruit: "Litchi", variety: "BARI Litchi-3", plants: 3, date: "2021-08-01" },
      { fruit: "Kathal", variety: "Bari kathal2", plants: 4, date: "2021-08-01" },
      { fruit: "Jamrul", variety: "BARI Jamrul-1", plants: 1, date: "2021-08-01" },
      { fruit: "Dragon Fruit", variety: "BARI Dragon Fruit-1", plants: 2, date: "2021-08-01" },
      { fruit: "Alubokhara", variety: "BARI Alubokhara-1", plants: 1, date: "2021-08-01" }
    ]
  },
  {
    id: "orchard_com_3",
    officeId: "office_comilla",
    name: "Shushunda, Borura",
    address: "Shushunda, Borura, Cumilla",
    district: "Comilla",
    upazila: "Barura",
    latitude: 23.3851906,
    longitude: 91.0469327,
    areaHector: 0.291,
    areaAcre: 0.72,
    dateOfPlanting: "2013-06-15",
    varieties: [
      { fruit: "Lebu", variety: "BARI Lebu-6", plants: 200, date: "2013-06-15" },
      { fruit: "Lebu", variety: "BARI Lebu-5", plants: 20, date: "2013-06-15" },
      { fruit: "Litchi", variety: "BARI Litchi-3", plants: 2, date: "2013-06-15" },
      { fruit: "Mango", variety: "BARI Aam-4", plants: 9, date: "2013-06-15" },
      { fruit: "Mango", variety: "BARI Aam-3", plants: 15, date: "2013-06-15" },
      { fruit: "Guava", variety: "BARI Peyara-2", plants: 4, date: "2013-06-15" },
      { fruit: "Malta", variety: "BARI Malta-2", plants: 20, date: "2013-06-15" },
      { fruit: "Dragon Fruit", variety: "BARI Dragon Fruit-1", plants: 3, date: "2013-06-15" }
    ]
  },
  {
    id: "orchard_com_4",
    officeId: "office_comilla",
    name: "RARS-1, Adarsha Sadar",
    address: "RARS-1, Adarsha Sadar, Cumilla",
    district: "Comilla",
    upazila: "Comilla",
    latitude: 23.4712157,
    longitude: 91.1551512,
    areaHector: 0.081,
    areaAcre: 0.20,
    dateOfPlanting: "2011-07-06",
    varieties: [
      { fruit: "Mango", variety: "BARI Aam-2", plants: 2, date: "2011-07-06" },
      { fruit: "Mango", variety: "BARI Aam-3", plants: 4, date: "2011-07-06" },
      { fruit: "Mango", variety: "BARI Aam-4", plants: 20, date: "2011-07-06" },
      { fruit: "Mango", variety: "BARI Aam-7", plants: 1, date: "2011-07-06" },
      { fruit: "Mango", variety: "BARI Aam-9", plants: 1, date: "2011-07-06" },
      { fruit: "Mango", variety: "BARI Aam-10", plants: 1, date: "2011-07-06" },
      { fruit: "Mango", variety: "BARI Aam-11", plants: 1, date: "2011-07-06" },
      { fruit: "Dragon Fruit", variety: "BARI Dragon Fruit-1", plants: 21, date: "2011-07-06" },
      { fruit: "Batabilebu", variety: "BARI Batabilebu-5", plants: 1, date: "2011-07-06" },
      { fruit: "Guava", variety: "BARI Peyara-4", plants: 1, date: "2011-07-06" }
    ]
  },
  {
    id: "orchard_com_5",
    officeId: "office_comilla",
    name: "RARS-2, Adarsha Sadar",
    address: "RARS-2, Adarsha Sadar, Cumilla",
    district: "Comilla",
    upazila: "Comilla",
    latitude: 23.469927,
    longitude: 91.1574073,
    areaHector: 0.06,
    areaAcre: 0.15,
    dateOfPlanting: "2011-07-13",
    varieties: [
      { fruit: "Mango", variety: "BARI Aam-2", plants: 4, date: "2011-07-13" },
      { fruit: "Mango", variety: "BARI Aam-3", plants: 16, date: "2011-07-13" },
      { fruit: "Mango", variety: "BARI Aam-4", plants: 15, date: "2011-07-13" },
      { fruit: "Mango", variety: "BARI Aam-11", plants: 7, date: "2011-07-13" },
      { fruit: "Mango", variety: "BARI Aam-12", plants: 2, date: "2011-07-13" },
      { fruit: "Mango", variety: "BARI Aam-13", plants: 2, date: "2011-07-13" },
      { fruit: "Mango", variety: "BARI Aam-14", plants: 2, date: "2011-07-13" },
      { fruit: "Mango", variety: "BARI Aam-15", plants: 2, date: "2011-07-13" },
      { fruit: "Mango", variety: "BARI Aam-16", plants: 2, date: "2011-07-13" },
      { fruit: "Mango", variety: "BARI Aam-17", plants: 2, date: "2011-07-13" },
      { fruit: "Mango", variety: "BARI Aam-18", plants: 2, date: "2011-07-13" },
      { fruit: "Kul", variety: "BARI Kul -1", plants: 2, date: "2011-07-13" },
      { fruit: "Kul", variety: "BARI Kul-2", plants: 3, date: "2011-07-13" },
      { fruit: "Kathal", variety: "BARI Kathal-2", plants: 2, date: "2011-07-13" },
      { fruit: "Kathal", variety: "BARI Kathal-6", plants: 4, date: "2011-07-13" },
      { fruit: "Litchi", variety: "BARI Litchi-1", plants: 1, date: "2011-07-13" },
      { fruit: "Litchi", variety: "BARI Litchi-2", plants: 1, date: "2011-07-13" },
      { fruit: "Litchi", variety: "BARI Litchi-3", plants: 3, date: "2011-07-13" },
      { fruit: "Batabilebu", variety: "BARI Batabilebu-4", plants: 1, date: "2011-07-13" },
      { fruit: "Sofeda", variety: "BARI Sofeda-1", plants: 4, date: "2011-07-13" },
      { fruit: "Lebu", variety: "BARI Lebu-6", plants: 20, date: "2011-07-13" }
    ]
  },
  {
    id: "orchard_com_6",
    officeId: "office_comilla",
    name: "Basanda, Nangalkot",
    address: "Basanda, Nangalkot, Cumilla",
    district: "Comilla",
    upazila: "Nangolkot",
    latitude: 23.164217,
    longitude: 91.185783,
    areaHector: 0.242,
    areaAcre: 0.60,
    dateOfPlanting: "2020-07-01",
    varieties: [
      { fruit: "Mango", variety: "BARI Aam-3", plants: 50, date: "2020-07-01" },
      { fruit: "Mango", variety: "BARI Aam-4", plants: 50, date: "2020-07-01" },
      { fruit: "Malta", variety: "BARI Malta-1", plants: 50, date: "2020-07-01" },
      { fruit: "Guava", variety: "BARI Peyara-2", plants: 50, date: "2020-07-01" }
    ]
  }
];

const baseUrl = import.meta.env.BASE_URL || './';
const cleanBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;

export const INITIAL_GALLERY_IMAGES = [
  {
    id: "img_mango_orchard",
    url: `${cleanBase}assets/images/bari_mango_orchard.jpg`,
    title: "BARI Mango Research Field",
    caption: "BARI Mango-4 evaluation rows with scientists at Central Horticulture Research Center, Gazipur."
  },
  {
    id: "img_citrus_orchard",
    url: `${cleanBase}assets/images/bari_citrus_orchard.jpg`,
    title: "BARI Citrus & Malta Field",
    caption: "Citrus Research Station, Joydebpur: Evaluation of BARI Malta-1 sweet orange cultivars."
  },
  {
    id: "img_jackfruit_orchard",
    url: `${cleanBase}assets/images/bari_jackfruit_orchard.jpg`,
    title: "BARI Jackfruit Germplasm Unit",
    caption: "Genetic Resources Unit: High-yield BARI Kathal trees under scientific evaluation."
  }
];

const STORAGE_KEY_OFFICES = 'bari_orchards_offices_v1';
const STORAGE_KEY_ORCHARDS = 'bari_orchards_data_v1';
const STORAGE_KEY_GALLERY = 'bari_orchards_gallery_v1';

export function getStoredOffices(): BARIOffice[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_OFFICES);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Failed reading offices from localStorage', e);
  }
  return INITIAL_OFFICES;
}

export function saveStoredOffices(offices: BARIOffice[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_OFFICES, JSON.stringify(offices));
  } catch (e) {
    console.error('Failed saving offices to localStorage', e);
  }
}

export function getStoredOrchards(): Orchard[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_ORCHARDS);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Failed reading orchards from localStorage', e);
  }
  return INITIAL_ORCHARDS;
}

export function saveStoredOrchards(orchards: Orchard[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_ORCHARDS, JSON.stringify(orchards));
  } catch (e) {
    console.error('Failed saving orchards to localStorage', e);
  }
}

export function getStoredGalleryImages(): typeof INITIAL_GALLERY_IMAGES {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_GALLERY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Failed reading gallery images from localStorage', e);
  }
  return INITIAL_GALLERY_IMAGES;
}

export function saveStoredGalleryImages(images: typeof INITIAL_GALLERY_IMAGES): void {
  try {
    localStorage.setItem(STORAGE_KEY_GALLERY, JSON.stringify(images));
  } catch (e) {
    console.error('Failed saving gallery images to localStorage', e);
  }
}

export function resetToDefaults(): {
  offices: BARIOffice[];
  orchards: Orchard[];
  galleryImages: typeof INITIAL_GALLERY_IMAGES;
} {
  localStorage.removeItem(STORAGE_KEY_OFFICES);
  localStorage.removeItem(STORAGE_KEY_ORCHARDS);
  localStorage.removeItem(STORAGE_KEY_GALLERY);
  return {
    offices: INITIAL_OFFICES,
    orchards: INITIAL_ORCHARDS,
    galleryImages: INITIAL_GALLERY_IMAGES
  };
}
