import {Component, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.styl']
})
export class UploaderComponent {
  @Output() fileLoad = new EventEmitter<HTMLImageElement>();

  public emitFile(e): void {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        this.fileLoad.emit(img);
      };

      if (!event || !event.target || !event.target.result) {
        return;
      }

      img.src = event.target.result as string;
    };

    reader.readAsDataURL(e.target.files[0]);
  }
}
