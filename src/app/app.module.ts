import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms'; 
import { HttpClientModule } from '@angular/common/http';
import { ConfigService } from './services/config.service';
import { AppComponent } from './app.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { ThresholdFormComponent } from './components/threshold-form/threshold-form.component';
import { SummaryComponent } from './components/summary/summary.component';
import { PlateGridComponent } from './components/plate-grid/plate-grid.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';

export function initConfig(configService: ConfigService) {
  return () => configService.loadConfig();
}

@NgModule({
  declarations: [
    AppComponent,
    FileUploadComponent,
    ThresholdFormComponent,
    SummaryComponent,
    PlateGridComponent,
  ],
  imports: [  BrowserModule,
  ReactiveFormsModule,
  HttpClientModule,
  MatToolbarModule,
  MatCardModule,
  MatButtonModule,
  MatInputModule,
  MatFormFieldModule,
  MatTooltipModule],
  providers: [    ConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: initConfig,
      deps: [ConfigService],
      multi: true
    }],
  bootstrap: [AppComponent],
})
export class AppModule {}
