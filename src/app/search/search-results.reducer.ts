import {createReducer, on} from '@ngrx/store';
import {queryChanged, searchImagesFail, searchImagesSuccess} from './search.actions';
import {ImageMetadata} from '../image-metadata.type';

export interface SearchResultsState {
  isLoading: boolean;
  isLoaded: boolean;
  results: ImageMetadata[];
}

const initialState: SearchResultsState = {
  isLoading: false,
  isLoaded: false,
  results: [],
};

export const searchResultsReducer = createReducer(
  initialState,
  on(searchImagesSuccess, (state, payload) => ({
    isLoading: false,
    isLoaded: true,
    results: payload.data,
  })),
  on(searchImagesFail, (state, payload) => ({
    ...state,
    isLoading: false,
    isLoaded: false,
  })),
  on(queryChanged, (state, payload) => ({
      ...state,
      isLoading: true,
    })
  )
);

