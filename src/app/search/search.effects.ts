import {inject, Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {queryChanged, searchImagesFail, searchImagesSuccess} from './search.actions';
import {switchMap, map, catchError} from 'rxjs/operators';
import {SearchService} from './search.service';
import {of} from 'rxjs';
import {SearchResultsResponse} from './search-results-response.type';

@Injectable()
export class SearchEffects {
  private actions$ = inject(Actions);

  private searchService = inject(SearchService);
  executeSearch$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(queryChanged),
      switchMap(({query}) =>
        this.searchService.executeSearch(query).pipe(
          map((response: SearchResultsResponse) => searchImagesSuccess({data: response.hits})),
          catchError(error => of(searchImagesFail()))
        )
      )
    );
  });
}
