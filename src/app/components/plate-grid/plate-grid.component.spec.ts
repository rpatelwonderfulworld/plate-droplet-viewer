import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlateGridComponent } from './plate-grid.component';
import { PlateService } from '../../services/plate.service';
import { PlateWell } from '../../models/plate.model';

describe('PlateGridComponent', () => {
  let component: PlateGridComponent;
  let fixture: ComponentFixture<PlateGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlateGridComponent],
      providers: [PlateService],
    }).compileComponents();

    fixture = TestBed.createComponent(PlateGridComponent);
    component = fixture.componentInstance;
  });

  it('should set up grid for 96-well plate (8x12)', () => {
    const wells: PlateWell[] = [
      { WellName: 'A01', WellIndex: 0, DropletCount: 50 },
      { WellName: 'A12', WellIndex: 11, DropletCount: 150 },
      { WellName: 'H12', WellIndex: 95, DropletCount: 80 },
    ];

    component.wells = wells;
    component.size = 96;
    component.threshold = 100;

    // trigger ngOnChanges manually
    component.ngOnChanges({
      size: {
        previousValue: undefined,
        currentValue: 96,
        firstChange: true,
        isFirstChange: () => true,
      },
    });

    expect(component.rows.length).toBe(8);  // A–H
    expect(component.cols.length).toBe(12); // 1–12
    expect(component.rowLabels[0]).toBe('A');
    expect(component.rowLabels[7]).toBe('H');

    // A1 = row 0, col 0
    expect(component.getLabel(0, 0)).toBe('L'); // 50 < 100
    expect(component.isLow(0, 0)).toBeTrue();

    // A12 = row 0, col 11
    expect(component.getLabel(0, 11)).toBe('n'); // 150 >= 100

    // H12 = row 7, col 11
    expect(component.getLabel(7, 11)).toBe('L'); // 80 < 100
  });

  it('should set up grid for 48-well plate (8x6)', () => {
    const wells: PlateWell[] = [
      { WellName: 'A01', WellIndex: 0, DropletCount: 120 },
      { WellName: 'H06', WellIndex: 47, DropletCount: 90 },
    ];

    component.wells = wells;
    component.size = 48;
    component.threshold = 100;

    component.ngOnChanges({
      size: {
        previousValue: undefined,
        currentValue: 48,
        firstChange: true,
        isFirstChange: () => true,
      },
    });

    expect(component.rows.length).toBe(8);
    expect(component.cols.length).toBe(6);

    // A1
    expect(component.getLabel(0, 0)).toBe('n'); // 120 >= 100

    // H6 (row 7, col 5)
    expect(component.getLabel(7, 5)).toBe('L'); // 90 < 100
    expect(component.isLow(7, 5)).toBeTrue();
  });
});
