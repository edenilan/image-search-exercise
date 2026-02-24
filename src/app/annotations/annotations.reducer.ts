import {createReducer, on} from '@ngrx/store';
import {annotationsUpdatedForImage} from './annotations.actions';
import {LineConfig} from 'konva/lib/shapes/Line';

export type AnnotationsState = Record<number, LineConfig[]>;

const initialState: AnnotationsState = {};

export const annotationsReducer = createReducer(
  initialState,
  on(annotationsUpdatedForImage, (state: AnnotationsState, action)=> ({
      ...state,
    [action.imageId]: action.annotations
    })
  )
);
