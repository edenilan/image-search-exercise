import {createSelector, MemoizedSelector} from '@ngrx/store';
import {selectAnnotationsState} from './annotations/annotations.selectors';
import {selectSearchResults} from './search/search.reducer';
import {AnnotatedImageMetadata} from './image-metadata.type';



export const selectImagesWithAnnotations: MemoizedSelector<any, AnnotatedImageMetadata[]> = createSelector(
  selectSearchResults,
  selectAnnotationsState,
  (imageDictionary, annotationsState) => Object.values(imageDictionary).filter(x => x != null).map(image => ({
      ...image,
      annotations: annotationsState[image.id],
    }))
  );

