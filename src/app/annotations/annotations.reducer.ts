import {createReducer, on} from '@ngrx/store';
import {annotationsUpdatedForImage} from './annotations.actions';

export type AnnotationsState = Record<number, number[][]>;

const initialState: AnnotationsState = {};

export const annotationsReducer = createReducer(
  initialState,
  on(annotationsUpdatedForImage, (state: AnnotationsState, action)=> ({
      ...state,
    [action.imageId]: action.annotations
    })
  )
);
