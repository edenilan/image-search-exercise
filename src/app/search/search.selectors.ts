import {createFeatureSelector, createSelector} from '@ngrx/store';
import {SearchHistoryState} from './search-history.reducer';
import {selectSearchState} from './search.reducer';


export const selectSearchHistoryState = createFeatureSelector<SearchHistoryState>('searchHistory');

export const selectIsSearchErrorState = createSelector(selectSearchState, (searchState) => {
  return searchState.query != null && searchState.query.length > 0 && !searchState.isLoaded && !searchState.isLoading;
});
