import {createAction, props} from '@ngrx/store';

export const annotationsUpdatedForImage = createAction(
  '[annotations] annotationsUpdatedForImage',
  props<{imageId: number, annotations: number[][]}>()
);
