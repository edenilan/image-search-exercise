import {inject, Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {moreResultsNeeded, queryChanged, searchImagesFail, searchImagesSuccess} from './search.actions';
import {switchMap, map, catchError, withLatestFrom, filter, takeUntil, exhaustMap} from 'rxjs/operators';
import {SearchService} from './search.service';
import {of} from 'rxjs';
import {SearchResultsResponse} from './search-results-response.type';
import {Store} from '@ngrx/store';
import {selectSearchState} from './search.reducer';
import {apiTokenUpdated} from '../api-token/api-token.actions';

@Injectable()
export class SearchEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);
  private searchService = inject(SearchService);
  private readonly RESULTS_PER_PAGE = 30;

  executeSearch$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(queryChanged),
      switchMap(({query}) => {
        const pageNumber = 1;

        return this.searchService.executeSearch(query, this.RESULTS_PER_PAGE, pageNumber).pipe(
          map((response: SearchResultsResponse) => searchImagesSuccess({response, query, pageNumber})),
          catchError(error => of(searchImagesFail()))
        )
      })
    );
  });

  fetchMoreResults$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(moreResultsNeeded),
      withLatestFrom(this.store.select(selectSearchState)),
      filter(([, searchState]) => {
        const numOfResults = searchState.ids.length;
        const hitsLeft = searchState.totalHits - numOfResults;
        return hitsLeft > 0;
      }),
      exhaustMap(([, searchState]) => {
        const nextPageNumber = searchState.lastFetchedPage + 1;
        return this.searchService.executeSearch(searchState.query, this.RESULTS_PER_PAGE, nextPageNumber).pipe(
          takeUntil(this.actions$.pipe(ofType(queryChanged))),
          map(response => searchImagesSuccess({response, query: searchState.query, pageNumber: nextPageNumber})),
          catchError(() => of(searchImagesFail()))
        );
      })
    );
  });

  fetchResultsOnApiTokenChange = createEffect(() => {
    return this.actions$.pipe(
      ofType(apiTokenUpdated),
      withLatestFrom(this.store.select(selectSearchState)),
      map(([action, {query}]) => queryChanged({query}))
    )
  });
}
