import {createFeatureSelector} from '@ngrx/store';
import {AnnotationsState} from './annotations.reducer';

export const selectAnnotationsState = createFeatureSelector<AnnotationsState>('annotations');

