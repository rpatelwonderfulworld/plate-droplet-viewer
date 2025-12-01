/* Shows total wells, low wells, and the current threshold.
*/
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css'],
})
export class SummaryComponent {
  @Input() totalWells = 0;
  @Input() lowWells = 0;
}
