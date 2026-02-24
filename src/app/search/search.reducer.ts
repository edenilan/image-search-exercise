import {createReducer, on} from '@ngrx/store';
import {queryChanged, searchImagesFail, searchImagesSuccess} from './search.actions';
import {ImageMetadata} from '../image-metadata.type';

export interface SearchState {
  query: string;
  isLoading: boolean;
  isLoaded: boolean;
  results: ImageMetadata[];
  totalHits: number;
}

const initialState: SearchState = {
  query: '',
  isLoading: false,
  isLoaded: false,
  results: [],
  totalHits: 0,
};

export const searchReducer = createReducer(
  initialState,
  on(searchImagesSuccess, (state, payload) => ({
    ...state,
    isLoading: false,
    isLoaded: true,
    results: [...state.results, ...payload.response.hits],
    totalHits: payload.response.totalHits,
  })),
  on(searchImagesFail, (state, payload) => ({
    ...state,
    isLoading: false,
    isLoaded: false,
  })),
  on(queryChanged, (state, payload) => ({
      ...state,
      query: payload.query,
      isLoading: true,
      results: [],
      totalHits: 0,
    })
  )
);

