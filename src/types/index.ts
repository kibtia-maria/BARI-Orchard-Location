/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface FruitVariety {
  id?: string;
  fruit: string;
  variety: string;
  plants: number;
  date?: string;
}

export interface Orchard {
  id: string;
  officeId: string;
  name: string;
  address: string;
  district: string;
  upazila: string;
  latitude: number;
  longitude: number;
  areaAcre: number;
  areaHector: number;
  dateOfPlanting: string;
  varieties: FruitVariety[];
  notes?: string;
}

export interface BARIOffice {
  id: string;
  name: string;
  shortName: string;
  district: string;
  upazila: string;
  division?: string;
  address: string;
  latitude: number;
  longitude: number;
  phone?: string;
  email?: string;
  established?: string;
  description?: string;
}

export interface UpazilaFeatureProperties {
  recid: number;
  geocode: number;
  div_name: string;
  dist_name: string;
  thana_name: string;
}

export interface UpazilaGeoJSONFeature {
  type: 'Feature';
  id?: number | string;
  properties: UpazilaFeatureProperties;
  geometry: {
    type: 'Polygon' | 'MultiPolygon';
    coordinates: any;
  };
}

export interface UpazilaGeoJSON {
  type: 'FeatureCollection';
  bbox?: number[];
  features: UpazilaGeoJSONFeature[];
}

export type DistrictHierarchy = Record<string, Record<string, string[]>>;

export interface AggregatedStats {
  totalOffices: number;
  totalOrchards: number;
  totalFruitTypes: number;
  totalVarieties: number;
  totalTrees: number;
  totalAreaAcre: number;
  totalAreaHector: number;
  fruitBreakdown: {
    fruit: string;
    totalTrees: number;
    varietiesCount: number;
    varieties: string[];
  }[];
}
