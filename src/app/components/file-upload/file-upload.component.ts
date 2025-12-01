/**file-upload – Reads the JSON file and sends parsed data upward.
**/
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css'],
})
export class FileUploadComponent {
  @Output() jsonLoaded = new EventEmitter<any>();
  errorMessage = '';

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    this.errorMessage = '';

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = reader.result as string;
        const json = JSON.parse(text);
        this.jsonLoaded.emit(json);
      } catch (err) {
        console.error(err);
        this.errorMessage = 'Could not parse JSON file.';
      }
    };
    reader.readAsText(file);
  }
}
