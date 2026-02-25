import {createSelector} from '@ngrx/store';
import {selectAnnotationsState} from './annotations/annotations.selectors';
import {selectSearchResultIds, selectSearchResults} from './search/search.reducer';

export const selectImagesWithAnnotations = createSelector(
  selectSearchResultIds,
  selectSearchResults,
  selectAnnotationsState,
  (resultIds, resultDictionary, annotationsState) => {

    const annotatedImages = resultIds.map((id) => {
      const imageMetadata = resultDictionary[id];

      if (imageMetadata == null) {
        return undefined;
      }

      return {
        ...imageMetadata,
        annotations: annotationsState[id as number],
      };
    });

    const result = annotatedImages.filter((image) => image != null);
    return result;
  }
);
