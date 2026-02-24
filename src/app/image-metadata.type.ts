export interface ImageMetadata {
  id: number;
  tags: string;
  previewURL: string;
  largeImageURL: string;
}

export type AnnotatedImageMetadata = ImageMetadata & {annotations: number[][]};

export type ImageAnnotation = number[];
