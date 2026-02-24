import {createFeatureSelector, createSelector} from '@ngrx/store';
import {SearchState} from './search.reducer';

export const selectSearchState = createFeatureSelector<SearchState>('searchResults');

export const selectSearchResults = createSelector(
  selectSearchState,
  (searchResults) => searchResults.results
);


