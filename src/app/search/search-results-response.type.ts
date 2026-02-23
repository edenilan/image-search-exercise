import {ImageMetadata} from '../image-metadata.type';

export interface SearchResultsResponse {
  total: number;
  totalHits: number;
  hits: ImageMetadata[];
}
