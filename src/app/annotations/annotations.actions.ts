import {createAction, props} from '@ngrx/store';
import {LineConfig} from 'konva/lib/shapes/Line';

export const annotationsUpdatedForImage = createAction(
  '[annotations] annotationsUpdatedForImage',
  props<{imageId: number, annotations: LineConfig[]}>()
);
