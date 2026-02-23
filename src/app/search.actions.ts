import {createAction, props} from '@ngrx/store';
import {ImageMetadata} from './image.type';

export const queryChanged = createAction(
  '[Search] Query Changed]',
  props<{query: string}>()
);

export const searchImagesSuccess = createAction(
  '[Search] Search Images Success',
  props<{ data: ImageMetadata[] }>(),
);

export const searchImagesFail = createAction(
  '[Search] Search Images Fail'
)
