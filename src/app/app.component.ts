/**
 * AppComponent
 * ------------
 * Acts as the orchestrator for the viewer:
 * - Holds wells, plate size, and threshold
 * - Handles JSON load events
 * - Recalculates low-well counts on updates
 */
import { Component } from '@angular/core';
import { PlateService } from './services/plate.service';
import { PlateData, PlateSize, PlateWell } from './models/plate.model';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Plate Droplet Viewer';

  wells: PlateWell[] = [];
  plateSize: PlateSize | null = null;
  threshold = 0;
  lowCount = 0;
  errorMessage = '';

  constructor(
    private plateService: PlateService,
    private http: HttpClient) {}
/**
 * Handles JSON upload event from the FileUploadComponent.
 * Parses the file using PlateService, validates, and updates UI state.
 */
  onJsonLoaded(raw: any): void {
    this.errorMessage = '';

    try {
      const plateData: PlateData = this.plateService.parseJson(raw);
      this.wells = plateData.wells;
      this.plateSize = plateData.size;
      this.recalculateSummary();
    } catch (err: any) {
      console.error(err);
      this.errorMessage = err?.message ?? 'Failed to load plate data.';
      this.wells = [];
      this.plateSize = null;
      this.lowCount = 0;
    }
  }

  onThresholdChange(newThreshold: number): void {
    this.threshold = newThreshold;
    this.recalculateSummary();
  }

  ngOnInit(): void {
    this.http
      .get<{ defaultThreshold: number }>('assets/app-config.json')
      .subscribe({
        next: (cfg) => {
          if (
            cfg &&
            typeof cfg.defaultThreshold === 'number' &&
            cfg.defaultThreshold >= 0 &&
            cfg.defaultThreshold <= 500
          ) {
            this.threshold = cfg.defaultThreshold;
          }
        },
        error: (err) => {
          console.error('Failed to load config, using default threshold 100.', err);
        },
      });
  }
/**
 * Recalculates the number of low wells whenever threshold or data changes.
 */
  private recalculateSummary(): void {
    if (!this.wells || this.wells.length === 0) {
      this.lowCount = 0;
      return;
    }
    this.lowCount = this.wells.filter(
      (w) => w.DropletCount < this.threshold
    ).length;
  }

  get hasPlate(): boolean {
    return !!this.plateSize && this.wells.length > 0;
  }
}
