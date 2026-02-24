import {Component, computed, effect, ElementRef, inject, signal, viewChild} from '@angular/core';
import {DebouncedInputComponent} from './debounced-input/debounced-input.component';
import {Store} from '@ngrx/store';
import {queryChanged} from './search/search.actions';
import {ApiTokenService} from './api-token/api-token.service';
import {MatDialog} from '@angular/material/dialog';
import {DialogData, ImageViewerComponent} from './image-viewer/image-viewer.component';
import {AnnotatedImageMetadata} from './image-metadata.type';
import {annotationsUpdatedForImage} from './annotations/annotations.actions';
import { ScrollingModule } from '@angular/cdk/scrolling';
import {ImageResultsDataSourceService} from './image-results-data-source.service';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {toObservable, toSignal} from '@angular/core/rxjs-interop';
import {debounceTime} from 'rxjs';
import {selectSearchHistoryState} from './search/search.selectors';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  imports: [DebouncedInputComponent, ScrollingModule, MatAutocompleteModule]
})
export class App {
  private store = inject(Store);
  private apiTokenService = inject(ApiTokenService);
  protected dataSourceService = inject(ImageResultsDataSourceService);
  readonly dialog = inject(MatDialog);
  private readonly searchInput = viewChild.required<ElementRef<HTMLInputElement>>('searchInput');
  private readonly searchInputValue = signal('');
  private readonly debouncedSearchInputValue = toSignal(
    toObservable(this.searchInputValue).pipe(debounceTime(500))
  );
  private readonly searchHistoryState = toSignal(this.store.select(selectSearchHistoryState));
  protected readonly autocompleteSuggestions = computed(() => {
    const currentSearchTerm = this.debouncedSearchInputValue();
    const searchHistory = this.searchHistoryState();

    if (currentSearchTerm == null || searchHistory == null) {
      return [];
    }
    const suggestions = searchHistory.filter(previousSearchTerm =>
      currentSearchTerm.length > 0
      && previousSearchTerm.includes(currentSearchTerm)
      && previousSearchTerm !== currentSearchTerm
      && previousSearchTerm.length > 2
    );

    return suggestions;
  });

  constructor() {
    effect(() => {
      const query = this.debouncedSearchInputValue();

      if (query != null) {
        this.store.dispatch(queryChanged({query}));
      }
    });
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

  searchInputChanged() {
    const searchInputElement = this.searchInput();
    this.searchInputValue.set(searchInputElement.nativeElement.value.trim().toLowerCase());
  }
}

