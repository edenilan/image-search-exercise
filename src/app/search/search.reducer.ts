import {createFeatureSelector, createReducer, on} from '@ngrx/store';
import {queryChanged, searchImagesFail, searchImagesSuccess} from './search.actions';
import {ImageMetadata} from '../image-metadata.type';
import {createEntityAdapter, EntityState} from '@ngrx/entity';

export interface SearchState extends EntityState<ImageMetadata> {
  query: string;
  isLoading: boolean;
  isLoaded: boolean;
  isError: boolean;
  totalHits: number;
  lastFetchedPage: number;
}

const adapter = createEntityAdapter<ImageMetadata>();

const initialState = adapter.getInitialState( {
  query: '',
  isLoading: false,
  isLoaded: false,
  isError: false,
  totalHits: 0,
  lastFetchedPage: 0,
});

export const searchReducer = createReducer(
  initialState,
  on(searchImagesSuccess, (state, payload) =>
    adapter.addMany(payload.response.hits, {
      ...state,
      isLoading: false,
      isLoaded: true,
      isError: false,
      totalHits: payload.response.totalHits,
      lastFetchedPage: payload.pageNumber,
    })
  ),
  on(searchImagesFail, (state, payload) => ({
    ...state,
    isLoading: false,
    isLoaded: false,
    isError: true
  })),
  on(queryChanged, (state, payload) =>
  adapter.removeAll({
      ...state,
      query: payload.query,
      isLoading: true,
      isLoaded: false,
      isError: false,
      totalHits: 0,
      lastFetchedPage: 0,
  })
  )
);


export const selectSearchState = createFeatureSelector<SearchState>('searchResults');
const {selectEntities, selectTotal, selectIds} = adapter.getSelectors(selectSearchState);
export const selectSearchResults = selectEntities;
export const selectTotalResults = selectTotal;
export const selectSearchResultIds = selectIds;
