import {ImageMetadata} from '../image-metadata.type';

export interface SearchResultsResponse {
  totalHits: number;
  hits: ImageMetadata[];
}
