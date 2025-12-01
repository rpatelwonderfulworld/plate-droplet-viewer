export interface PlateWell {
  WellName: string;
  WellIndex: number;
  DropletCount: number;
}

export type PlateSize = 48 | 96;

export interface PlateData {
  size: PlateSize;
  wells: PlateWell[];
}
