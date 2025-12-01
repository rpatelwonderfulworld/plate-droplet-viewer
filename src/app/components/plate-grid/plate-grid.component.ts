/**
 * PlateGridComponent
 * ------------------
 * Renders the 2D plate layout (8x6 or 8x12).
 *
 * This component receives all data from the
 * parent and focuses on only visual representation.
 */

import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { PlateSize, PlateWell } from '../../models/plate.model';
import { PlateService } from '../../services/plate.service';

@Component({
  selector: 'app-plate-grid',
  templateUrl: './plate-grid.component.html',
  styleUrls: ['./plate-grid.component.css'],
})
export class PlateGridComponent implements OnChanges {
  @Input() wells: PlateWell[] = [];
  @Input() size!: PlateSize;
  @Input() threshold!: number; 

  rows: number[] = [];
  cols: number[] = [];
  rowLabels: string[] = [];

  constructor(private plateService: PlateService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['size']) {
      const rowCount = this.plateService.getRows();
      const colCount = this.plateService.getColumns(this.size);

      this.rows = Array.from({ length: rowCount }, (_, i) => i);
      this.cols = Array.from({ length: colCount }, (_, i) => i);
      this.rowLabels = this.rows.map((r) => this.plateService.rowIndexToLabel(r));

      console.log('Grid setup:', {
      size: this.size,
      rows: this.rows,
      cols: this.cols,
      rowLabels: this.rowLabels,
    }); // 🔍 debug
    }
  }

/**
 * Finds the matching well using row/col -> WellIndex mapping.
 * 
 * Note: WellIndex is row-major encoded from the JSON file.
 */
  getWell(row: number, col: number): PlateWell | undefined {
    const index = row * this.cols.length + col;
    return this.wells.find((w) => w.WellIndex === index);
  }

  /**
 * Returns true if the well is considered "low".
 */
  isLow(row: number, col: number): boolean {
    const w = this.getWell(row, col);
    return isLowWell(w, this.threshold);
  }

  getLabel(row: number, col: number): string {
    const w = this.getWell(row, col);
    if (!w) return '-';
    return w.DropletCount < this.threshold ? 'L' : 'n';
  }
/**
 * Tooltip for each well
 */
  getTooltip(row: number, col: number): string {
    const well = this.getWell(row, col);
    if (!well) return 'Empty well';

    const status = well.DropletCount < this.threshold ? 'LOW' : 'NORMAL';

    return `${well.WellName} 
Index: ${well.WellIndex}
Droplets: ${well.DropletCount}
Status: ${status}`;
  }

}

function isLowWell(well: PlateWell | undefined, threshold: number): boolean {
  if (!well) return false;
  return well.DropletCount < threshold;
}
