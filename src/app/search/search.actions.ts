import {createAction, props} from '@ngrx/store';
import {SearchResultsResponse} from './search-results-response.type';

export const queryChanged = createAction(
  '[Search] Query Changed]',
  props<{query: string}>()
);

export const searchImagesSuccess = createAction(
  '[Search] Search Images Success',
  props<{ response: SearchResultsResponse, query: string, pageNumber: number }>(),
);

export const searchImagesFail = createAction(
  '[Search] Search Images Fail'
);

export const moreResultsNeeded = createAction(
  '[Search] More Results Needed',
);
