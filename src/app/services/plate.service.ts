
/**
 * PlateService
 * -------------
 * Responsible for converting the raw JSON file into UI-friendly data. 
 */

import { Injectable } from '@angular/core';
import { PlateData, PlateSize, PlateWell } from '../models/plate.model';

@Injectable({
  providedIn: 'root',
})

export class PlateService {
  private readonly ROWS = 8; // A–H
  private readonly MIN_WELLS = 48;
  private readonly MAX_WELLS = 96;


  /**
   * Converts the nested PlateDropletInfo JSON into a typed PlateData object.
   */
  parseJson(raw: any): PlateData {
    const wellsRaw = raw?.PlateDropletInfo?.DropletInfo?.Wells;

    if (!Array.isArray(wellsRaw)) {
      throw new Error('Invalid JSON: Wells array not found.');
    }

    const wells: PlateWell[] = wellsRaw.map((w: any) => ({
      WellName: w.WellName,
      WellIndex: Number(w.WellIndex),
      DropletCount: Number(w.DropletCount),
    }));

    const size = this.detectPlateSize(wells.length);

    this.validateWells(wells, size);

    // Ensure wells are ordered by WellIndex
    wells.sort((a, b) => a.WellIndex - b.WellIndex);

    return { size, wells };
  }

  /**
   * Determines plate size from well count.
   */
  detectPlateSize(count: number): PlateSize {
    if (count === this.MIN_WELLS) return this.MIN_WELLS;
    if (count === this.MAX_WELLS) return this.MAX_WELLS;

    throw new Error(`Invalid plate size: expected 48 or 96 wells, got ${count}.`);
  }

  getColumns(size: PlateSize): number {
    return size === this.MIN_WELLS ? 6 : 12;
  }

  getRows(): number {
    return this.ROWS;
  }

  rowIndexToLabel(row: number): string {
    // 0 -> A, 1 -> B, ...
    return String.fromCharCode('A'.charCodeAt(0) + row);
  }

  private validateWells(wells: PlateWell[], size: PlateSize) {
    const maxIndex = size - 1;

    wells.forEach((w) => {
      if (w.WellIndex < 0 || w.WellIndex > maxIndex) {
        throw new Error(`Invalid WellIndex ${w.WellIndex} for plate size ${size}.`);
      }
      if (
        Number.isNaN(w.DropletCount) ||
        w.DropletCount < 0 ||
        w.DropletCount > 500
      ) {
        throw new Error(`Invalid DropletCount ${w.DropletCount} at ${w.WellName}.`);
      }
    });
  }
}
