import {inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {SearchResultsResponse} from './search-results-response.type';

@Injectable({providedIn: 'root'})
export class SearchService {

  constructor() {
  }
  private httpClient = inject(HttpClient);

  executeSearch(query: string): Observable<SearchResultsResponse> {
    const url = 'https://pixabay.com/api';

    const params = {
      q: query,
      image_type: 'photo',
    };

    return this.httpClient.get<SearchResultsResponse>(url, {params}).pipe();
  }
}
