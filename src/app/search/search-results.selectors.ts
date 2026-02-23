import {createFeatureSelector, createSelector} from '@ngrx/store';
import {SearchResultsState} from './search-results.reducer';

export const selectSearchResultsState = createFeatureSelector<SearchResultsState>('searchResults');

export const selectSearchResults = createSelector(
  selectSearchResultsState,
  (searchResults) => searchResults.results
);
