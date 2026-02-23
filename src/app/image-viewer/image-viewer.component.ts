import {Component, inject} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'image-viewer',
  imports: [],
  templateUrl: './image-viewer.component.html',
  styleUrl: './image-viewer.component.scss',
})
export class ImageViewerComponent {
  private matDialogData = inject(MAT_DIALOG_DATA);

  imageUrl = this.matDialogData.imageMetadata.largeImageURL;
}
