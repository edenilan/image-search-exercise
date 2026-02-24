import {createReducer, on} from '@ngrx/store';
import {searchImagesSuccess} from './search.actions';

export type SearchHistoryState = string[];

const initialState: string[] = [];

export const searchHistoryReducer = createReducer<SearchHistoryState>(initialState,
  on(searchImagesSuccess, (state, payload) => {
    const queryAlreadyExists = state.includes(payload.query);
    const queryHasResults = payload.response.totalHits > 0;
    const shouldAddQuery = queryAlreadyExists === false && queryHasResults;
    if (shouldAddQuery) {
      state = [...state, payload.query];
    }
    return state;
  }),
)
