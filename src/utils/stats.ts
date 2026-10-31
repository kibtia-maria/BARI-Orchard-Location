/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Orchard, BARIOffice, AggregatedStats } from '../types';

export function calculateAggregatedStats(
  orchards: Orchard[],
  officesInRegion: BARIOffice[]
): AggregatedStats {
  const fruitMap: Record<
    string,
    { totalTrees: number; varieties: Set<string> }
  > = {};

  let totalTrees = 0;
  let totalAreaAcre = 0;
  let totalAreaHector = 0;
  const varietySet = new Set<string>();

  orchards.forEach(o => {
    totalAreaAcre += o.areaAcre || 0;
    totalAreaHector += o.areaHector || (o.areaAcre ? o.areaAcre / 2.47105 : 0);

    o.varieties.forEach(v => {
      const fruitName = (v.fruit || 'Other').trim();
      const varietyName = (v.variety || fruitName).trim();
      const plants = v.plants || 0;

      totalTrees += plants;
      varietySet.add(`${fruitName}:::${varietyName}`);

      if (!fruitMap[fruitName]) {
        fruitMap[fruitName] = { totalTrees: 0, varieties: new Set() };
      }
      fruitMap[fruitName].totalTrees += plants;
      fruitMap[fruitName].varieties.add(varietyName);
    });
  });

  const fruitBreakdown = Object.entries(fruitMap)
    .map(([fruit, data]) => ({
      fruit,
      totalTrees: data.totalTrees,
      varietiesCount: data.varieties.size,
      varieties: Array.from(data.varieties).sort()
    }))
    .sort((a, b) => b.totalTrees - a.totalTrees);

  return {
    totalOffices: officesInRegion.length,
    totalOrchards: orchards.length,
    totalFruitTypes: Object.keys(fruitMap).length,
    totalVarieties: varietySet.size,
    totalTrees,
    totalAreaAcre: Math.round(totalAreaAcre * 100) / 100,
    totalAreaHector: Math.round(totalAreaHector * 100) / 100,
    fruitBreakdown
  };
}

export function exportOrchardsToCSV(orchards: Orchard[], offices: BARIOffice[]): string {
  const officeMap = new Map(offices.map(o => [o.id, o.name]));
  const headers = [
    'Office Name',
    'District',
    'Upazila',
    'Orchard Name',
    'Address',
    'Latitude',
    'Longitude',
    'Area (Acre)',
    'Area (Hector)',
    'Date of Planting',
    'Fruit Name',
    'Variety Name',
    'Number of Plants'
  ];

  const rows: string[] = [headers.join(',')];

  orchards.forEach(o => {
    const officeName = `"${(officeMap.get(o.officeId) || o.officeId).replace(/"/g, '""')}"`;
    const district = `"${(o.district || '').replace(/"/g, '""')}"`;
    const upazila = `"${(o.upazila || '').replace(/"/g, '""')}"`;
    const name = `"${(o.name || '').replace(/"/g, '""')}"`;
    const address = `"${(o.address || '').replace(/"/g, '""')}"`;
    const lat = o.latitude;
    const lng = o.longitude;
    const areaAcre = o.areaAcre;
    const areaHect = o.areaHector;
    const date = `"${(o.dateOfPlanting || '').replace(/"/g, '""')}"`;

    if (o.varieties.length === 0) {
      rows.push([officeName, district, upazila, name, address, lat, lng, areaAcre, areaHect, date, '""', '""', 0].join(','));
    } else {
      o.varieties.forEach((v, idx) => {
        const fruit = `"${(v.fruit || '').replace(/"/g, '""')}"`;
        const variety = `"${(v.variety || '').replace(/"/g, '""')}"`;
        const plants = v.plants || 0;
        // Output row
        rows.push([
          idx === 0 ? officeName : '""',
          idx === 0 ? district : '""',
          idx === 0 ? upazila : '""',
          idx === 0 ? name : '""',
          idx === 0 ? address : '""',
          idx === 0 ? lat : '""',
          idx === 0 ? lng : '""',
          idx === 0 ? areaAcre : '""',
          idx === 0 ? areaHect : '""',
          idx === 0 ? date : '""',
          fruit,
          variety,
          plants
        ].join(','));
      });
    }
  });

  return rows.join('\n');
}
