import { ChangeDetectionStrategy, Component, output } from '@angular/core';

@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.component.html',
  styleUrl: './uploader.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploaderComponent {
  readonly fileSelect = output<File>();

  protected onChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    // Reset, so that picking the same file again still triggers `change`.
    input.value = '';

    if (file) {
      this.fileSelect.emit(file);
    }
  }
}
