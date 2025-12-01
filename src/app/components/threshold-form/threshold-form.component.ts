/**
 * Small form component for controlling the droplet threshold.
 */
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ConfigService } from '../../services/config.service';

@Component({
  selector: 'app-threshold-form',
  templateUrl: './threshold-form.component.html',
  styleUrls: ['./threshold-form.component.css'],
})
export class ThresholdFormComponent implements OnChanges {
  @Input() currentThreshold!: number;
  @Output() thresholdChange = new EventEmitter<number>();

  form: FormGroup;

  constructor(private fb: FormBuilder, private configService: ConfigService) {
    this.form = this.fb.group({
      threshold: [
        this.currentThreshold,
        [Validators.required, Validators.min(0), Validators.max(500),
           (control: AbstractControl) => {
          const value = control.value;

          // Skip empty value (handled by required)
          if (value === null || value === '') return null;

          // Allow only integers
          if (!Number.isInteger(Number(value))) {
            return { notInteger: true };
          }
          return null;
        }],
      ],
    });
  }

  ngOnInit(): void {
    // If parent did not pass a threshold, use config value
    if (this.currentThreshold == null) {
      this.currentThreshold = this.configService.getConfig<number>('defaultThreshold', 200);
    }

    this.form.patchValue({ threshold: this.currentThreshold });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['currentThreshold'] &&
      !changes['currentThreshold'].firstChange
    ) {
      this.form.patchValue(
        { threshold: this.currentThreshold },
        { emitEvent: false }
      );
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    let value = Number(this.form.value.threshold);
    value = Math.round(value);
    this.thresholdChange.emit(value);
  }

/**
 * Resets the threshold input to the current value coming from the parent.
 */
  resetThreshold() {
    const defaultThreshold = this.configService.getConfig<number>('defaultThreshold', 200);
    this.form.setValue({ threshold: defaultThreshold });
    this.thresholdChange.emit(defaultThreshold);
  }


  get thresholdCtrl() {
    return this.form.get('threshold');
  }
}
