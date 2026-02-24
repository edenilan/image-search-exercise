import {inject} from '@angular/core';
import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {AnnotatedImageMetadata} from './image-metadata.type';
import {map, Subscription, throttleTime} from 'rxjs';
import {Store} from '@ngrx/store';
import {selectImagesWithAnnotations} from './app.selectors';
import {moreResultsNeeded} from './search/search.actions';
import {withLatestFrom} from 'rxjs/operators';
import {selectSearchResults, selectSearchState} from './search/search.selectors';

const NEXT_PAGE_DISTANCE_THRESHOLD = 20; //todo move these consts to an injectable config, for better testability & configuration
const THROTTLE_THRESHOLD_MS = 200;

export class ImageResultsDataSourceService extends DataSource<AnnotatedImageMetadata> {
  private readonly _subscription = new Subscription();
  private store = inject(Store);
  private imageResults$ = this.store.select(selectImagesWithAnnotations);
  private searchState$ = this.store.select(selectSearchState);

  connect(collectionViewer: CollectionViewer) {
    this._subscription.add(collectionViewer.viewChange.pipe(
      withLatestFrom(this.store.select(selectSearchResults)),
      throttleTime(THROTTLE_THRESHOLD_MS)
    ).subscribe(([range, currentResults]) => {
      const distanceToNextPage = currentResults.length - range.end;

      if (distanceToNextPage < NEXT_PAGE_DISTANCE_THRESHOLD) {
        this.store.dispatch(moreResultsNeeded());
      }
    }));

    return this.imageResults$;
  }

  disconnect() {
    this._subscription.unsubscribe();
  }

  isStreamEmpty$ = this.searchState$.pipe(map(searchState => {
    const isEmptyResults = !(searchState.results?.length > 0);
    return isEmptyResults && searchState.isLoaded;
  }))
}

