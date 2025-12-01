import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ThresholdFormComponent } from './threshold-form.component';

describe('ThresholdFormComponent', () => {
  let component: ThresholdFormComponent;
  let fixture: ComponentFixture<ThresholdFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ThresholdFormComponent],
      imports: [ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ThresholdFormComponent);
    component = fixture.componentInstance;
    component.currentThreshold = 100;
    fixture.detectChanges();
  });

  it('should initialize form with currentThreshold', () => {
    const ctrl = component.thresholdCtrl;
    expect(ctrl?.value).toBe(100);
    expect(ctrl?.valid).toBeTrue();
  });

  it('should emit thresholdChange when form is valid', () => {
    spyOn(component.thresholdChange, 'emit');

    component.form.setValue({ threshold: 150 });
    component.onSubmit();

    expect(component.thresholdChange.emit).toHaveBeenCalledWith(150);
  });

  it('should not emit when value is out of range', () => {
    spyOn(component.thresholdChange, 'emit');

    component.form.setValue({ threshold: 600 }); // invalid > 500
    component.onSubmit();

    expect(component.thresholdChange.emit).not.toHaveBeenCalled();
    expect(component.thresholdCtrl?.valid).toBeFalse();
  });
});
