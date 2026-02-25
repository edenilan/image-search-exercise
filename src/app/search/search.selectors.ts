import {createFeatureSelector, createSelector} from '@ngrx/store';
import {SearchHistoryState} from './search-history.reducer';
import {selectSearchState} from './search.reducer';


export const selectSearchHistoryState = createFeatureSelector<SearchHistoryState>('searchHistory');

export const selectIsSearchErrorState = createSelector(selectSearchState, (searchState) => {
  const hasResults = searchState.ids.length > 0;
  return searchState.isError && !hasResults;
});

export const selectIsSearchEmptyState = createSelector(selectSearchState, (searchState) => {
  const isNoResults = searchState.ids == null || searchState.ids.length === 0;
  const isEmptyState = !searchState.isError && searchState.isLoaded && isNoResults;

  return isEmptyState;
});
export const selectIsLoadingState = createSelector(selectSearchState, (searchState) => searchState.isLoading);
