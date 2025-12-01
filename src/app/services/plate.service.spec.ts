import { TestBed } from '@angular/core/testing';
import { PlateService } from './plate.service';
import { PlateData } from '../models/plate.model';

describe('PlateService', () => {
  let service: PlateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlateService);
  });

it('should detect 96-well plate and map wells correctly', () => {
  const wells = Array.from({ length: 96 }, (_, i) => ({
    WellName: `A${String(i + 1).padStart(2, '0')}`,
    WellIndex: i,
    DropletCount: i === 0 ? 50 : 100, // first one low, rest normal
  }));

  const raw = {
    PlateDropletInfo: {
      DropletInfo: {
        Wells: wells,
      },
    },
  };

  const plate: PlateData = service.parseJson(raw);

  expect(plate.size).toBe(96);
  expect(plate.wells.length).toBe(96);
  expect(plate.wells[0].WellIndex).toBe(0);
  expect(plate.wells[0].DropletCount).toBe(50);
});


  it('should detect 48-well plate', () => {
    const raw = {
      PlateDropletInfo: {
        DropletInfo: {
          Wells: Array.from({ length: 48 }, (_, i) => ({
            WellName: `A${String(i + 1).padStart(2, '0')}`,
            WellIndex: i,
            DropletCount: 100,
          })),
        },
      },
    };

    const plate = service.parseJson(raw);
    expect(plate.size).toBe(48);
    expect(plate.wells.length).toBe(48);
  });

  it('should throw error on invalid plate size', () => {
    const raw = {
      PlateDropletInfo: {
        DropletInfo: {
          Wells: [
            { WellName: 'A01', WellIndex: 0, DropletCount: 50 },
            { WellName: 'A02', WellIndex: 1, DropletCount: 60 },
            // only 2 wells → invalid
          ],
        },
      },
    };

    expect(() => service.parseJson(raw)).toThrowError(
      /Invalid plate size/
    );
  });

  it('should throw error when Wells array is missing', () => {
    const badRaw = { somethingElse: {} };
    expect(() => service.parseJson(badRaw)).toThrowError(
      /Wells array not found/
    );
  });
});
