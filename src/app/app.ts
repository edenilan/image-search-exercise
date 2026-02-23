import {Component, inject} from '@angular/core';
import {DebouncedInput} from './debounced-input/debounced-input.component';
import {Store} from '@ngrx/store';
import {queryChanged} from './search/search.actions';
import {toSignal} from '@angular/core/rxjs-interop';
import {selectSearchResults} from './search/search-results.selectors';
import {ApiTokenService} from './api-token/api-token.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
  imports: [DebouncedInput]
})
export class App {
  private store = inject(Store);
  private apiTokenService = inject(ApiTokenService);
  protected searchResults = toSignal(this.store.select(selectSearchResults));

  onQueryChange(query: string) {
    this.store.dispatch(queryChanged({query}));
  }

  onTokenInput(token: string) {
    this.apiTokenService.updateApiToken(token);
  }
}
