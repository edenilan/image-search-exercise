import {Component, inject} from '@angular/core';
import {DebouncedInputComponent} from './debounced-input/debounced-input.component';
import {Store} from '@ngrx/store';
import {queryChanged} from './search/search.actions';
import {toSignal} from '@angular/core/rxjs-interop';
import {ApiTokenService} from './api-token/api-token.service';
import {MatDialog} from '@angular/material/dialog';
import {DialogData, ImageViewerComponent} from './image-viewer/image-viewer.component';
import {AnnotatedImageMetadata} from './image-metadata.type';
import {annotationsUpdatedForImage} from './annotations/annotations.actions';
import {selectImagesWithAnnotations} from './app.selectors';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  imports: [DebouncedInputComponent]
})
export class App {
  private store = inject(Store);
  private apiTokenService = inject(ApiTokenService);
  protected searchResults = toSignal(this.store.select(selectImagesWithAnnotations));
  readonly dialog = inject(MatDialog);

  onQueryChange(query: string) {
    this.store.dispatch(queryChanged({query}));
  }

  onTokenInput(token: string) {
    this.apiTokenService.updateApiToken(token);
  }

  resultClicked(result: AnnotatedImageMetadata) {
    const data: DialogData = {imageMetadata: result};
    const dialogRef = this.dialog.open(ImageViewerComponent, {
      data,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data.annotations) {
        this.store.dispatch(annotationsUpdatedForImage({imageId: result.id, annotations: data.annotations}))
      }
    })
  }
}
