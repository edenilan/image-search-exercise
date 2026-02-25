import {createFeatureSelector} from '@ngrx/store';
import {SearchHistoryState} from './search-history.reducer';


export const selectSearchHistoryState = createFeatureSelector<SearchHistoryState>('searchHistory');


