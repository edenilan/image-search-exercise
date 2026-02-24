import {LineConfig} from 'konva/lib/shapes/Line';

export interface ImageMetadata {
  id: number;
  tags: string;
  previewURL: string;
  largeImageURL: string;
}

export type AnnotatedImageMetadata = ImageMetadata & {annotations: LineConfig[]};
