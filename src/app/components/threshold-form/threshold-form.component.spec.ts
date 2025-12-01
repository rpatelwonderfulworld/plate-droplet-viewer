import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ThresholdFormComponent } from './threshold-form.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ConfigService } from '../../services/config.service';

describe('ThresholdFormComponent', () => {
  let component: ThresholdFormComponent;
  let fixture: ComponentFixture<ThresholdFormComponent>;

  // Stubbed ConfigService – matches what the component expects
  const configServiceStub = {
    getConfig: () => ({ defaultThreshold: 100 }),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ThresholdFormComponent],
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
      ],
      providers: [
        { provide: ConfigService, useValue: configServiceStub },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThresholdFormComponent);
    component = fixture.componentInstance;

    // If your component has @Input() currentThreshold, you can set it here:
    // component.currentThreshold = 100;

    fixture.detectChanges(); // runs ngOnInit
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a threshold control on the form', () => {
    const ctrl = component.thresholdCtrl;
    expect(ctrl).toBeTruthy();
  });

  it('should mark out-of-range value as invalid', () => {
    component.form.setValue({ threshold: 600 }); // > 500
    expect(component.thresholdCtrl?.valid).toBeFalse();
  });

  it('should mark in-range integer value as valid', () => {
    component.form.setValue({ threshold: 150 }); // inside 0–500
    expect(component.thresholdCtrl?.valid).toBeTrue();
  });
});
