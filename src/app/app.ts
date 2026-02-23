import {Component, inject} from '@angular/core';
import {DebouncedInputComponent} from './debounced-input/debounced-input.component';
import {Store} from '@ngrx/store';
import {queryChanged} from './search/search.actions';
import {toSignal} from '@angular/core/rxjs-interop';
import {selectSearchResults} from './search/search-results.selectors';
import {ApiTokenService} from './api-token/api-token.service';
import {MatDialog} from '@angular/material/dialog';
import {ImageViewerComponent} from './image-viewer/image-viewer.component';
import {ImageMetadata} from './image-metadata.type';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
  imports: [DebouncedInputComponent]
})
export class App {
  private store = inject(Store);
  private apiTokenService = inject(ApiTokenService);
  protected searchResults = toSignal(this.store.select(selectSearchResults));
  readonly dialog = inject(MatDialog);

  onQueryChange(query: string) {
    this.store.dispatch(queryChanged({query}));
  }

  onTokenInput(token: string) {
    this.apiTokenService.updateApiToken(token);
  }

  resultClicked(result: ImageMetadata) {
    this.dialog.open(ImageViewerComponent, {data: {imageMetadata: result}});
  }
}
