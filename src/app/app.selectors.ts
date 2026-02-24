import {createSelector} from '@ngrx/store';
import {selectSearchResults} from './search/search.selectors';
import {selectAnnotationsState} from './annotations/annotations.selectors';

export const selectImagesWithAnnotations = createSelector(
  selectSearchResults,
  selectAnnotationsState,
  (images, annotationsState) =>
    images.map(image => ({
      ...image,
      annotations: annotationsState[image.id],
    }))
);
