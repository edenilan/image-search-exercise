import {createFeatureSelector, createSelector} from '@ngrx/store';
import {SearchState} from './search.reducer';
import {SearchHistoryState} from './search-history.reducer';

export const selectSearchState = createFeatureSelector<SearchState>('searchResults');

export const selectSearchHistoryState = createFeatureSelector<SearchHistoryState>('searchHistory');

export const selectSearchResults = createSelector(
  selectSearchState,
  (searchResults) => searchResults.results
);


