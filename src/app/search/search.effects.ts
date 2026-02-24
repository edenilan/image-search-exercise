import {inject, Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {moreResultsNeeded, queryChanged, searchImagesFail, searchImagesSuccess} from './search.actions';
import {switchMap, map, catchError, withLatestFrom, filter, takeUntil} from 'rxjs/operators';
import {SearchService} from './search.service';
import {of} from 'rxjs';
import {SearchResultsResponse} from './search-results-response.type';
import {Store} from '@ngrx/store';
import {selectSearchState} from './search.selectors';
import {SearchState} from './search.reducer';

@Injectable()
export class SearchEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);
  private searchService = inject(SearchService);
  private readonly RESULTS_PER_PAGE = 20;

  executeSearch$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(queryChanged),
      switchMap(({query}) =>
        this.searchService.executeSearch(query, this.RESULTS_PER_PAGE).pipe(
          map((response: SearchResultsResponse) => searchImagesSuccess({response})),
          catchError(error => of(searchImagesFail()))
        )
      )
    );
  });

  fetchMoreResults$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(moreResultsNeeded),
      withLatestFrom(this.store.select(selectSearchState)),
      filter(([, searchState]) => {
        const hitsLeft = searchState.totalHits - searchState.results.length;
        return hitsLeft > 0;
      }),
      switchMap(([, searchState]) => {
        const nextPageNumber = getNextPageNumber(searchState, this.RESULTS_PER_PAGE);
        return this.searchService.executeSearch(searchState.query, this.RESULTS_PER_PAGE, nextPageNumber).pipe(
          takeUntil(this.actions$.pipe(ofType(queryChanged))),
          map(response => searchImagesSuccess({response})),
          catchError(() => of(searchImagesFail()))
        );
      })
    );
  })
}

function getNextPageNumber(searchState: SearchState, resultsPerPage: number): number {
  const currentPage = Math.floor(searchState.results.length / resultsPerPage);

  return currentPage + 1;
}
