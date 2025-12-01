import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { ThresholdFormComponent } from './components/threshold-form/threshold-form.component';
import { SummaryComponent } from './components/summary/summary.component';
import { PlateGridComponent } from './components/plate-grid/plate-grid.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PlateService } from './services/plate.service';
import { PlateData } from './models/plate.model';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';


describe('AppComponent', () => {
  let component: AppComponent;
  let plateServiceSpy: jasmine.SpyObj<PlateService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('PlateService', ['parseJson']);

    await TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        FileUploadComponent,
        ThresholdFormComponent,
        SummaryComponent,
        PlateGridComponent,
      ],
      imports: [
        ReactiveFormsModule,
        MatToolbarModule,
        MatCardModule,
      ],

      providers: [{ provide: PlateService, useValue: spy }],
    }).compileComponents();

    const fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    plateServiceSpy = TestBed.inject(
      PlateService
    ) as jasmine.SpyObj<PlateService>;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should load plate data and calculate low wells with default threshold', () => {
    const mockPlate: PlateData = {
      size: 96,
      wells: [
        { WellName: 'A01', WellIndex: 0, DropletCount: 50 },  // low
        { WellName: 'A02', WellIndex: 1, DropletCount: 150 }, // normal
        { WellName: 'A03', WellIndex: 2, DropletCount: 80 },  // low
      ],
    };

    plateServiceSpy.parseJson.and.returnValue(mockPlate);

    component.onJsonLoaded({ some: 'rawJson' });

    expect(plateServiceSpy.parseJson).toHaveBeenCalled();
    expect(component.plateSize).toBe(96);
    expect(component.wells.length).toBe(3);
    expect(component.threshold).toBe(100);
    expect(component['lowCount']).toBe(2); // 50 & 80 are below 100
    expect(component.hasPlate).toBeTrue();
    expect(component.errorMessage).toBe('');
  });

  it('should update low wells when threshold changes', () => {
    const mockPlate: PlateData = {
      size: 48,
      wells: [
        { WellName: 'A01', WellIndex: 0, DropletCount: 50 },
        { WellName: 'A02', WellIndex: 1, DropletCount: 150 },
        { WellName: 'A03', WellIndex: 2, DropletCount: 250 },
      ],
    };

    plateServiceSpy.parseJson.and.returnValue(mockPlate);

    // Load plate
    component.onJsonLoaded({});

    // Default threshold = 100 -> only 50 is low
    expect(component['lowCount']).toBe(1);

    // Now raise threshold to 200
    component.onThresholdChange(200);

    // 50 and 150 are below 200
    expect(component.threshold).toBe(200);
    expect(component['lowCount']).toBe(2);
  });

  it('should handle errors from PlateService gracefully', () => {
    plateServiceSpy.parseJson.and.throwError('Invalid JSON: Wells array not found.');

    component.onJsonLoaded({ bad: 'data' });

    expect(component.wells.length).toBe(0);
    expect(component.plateSize).toBeNull();
    expect(component['lowCount']).toBe(0);
    expect(component.errorMessage).toContain('Invalid JSON');
  });
});
