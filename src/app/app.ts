import {Component, inject} from '@angular/core';
import {SearchComponent} from './search-component/search-component';
import {Store} from '@ngrx/store';
import {queryChanged} from './search.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
  imports: [SearchComponent]
})
export class App {
  private store = inject(Store);

  onQueryChange(query: string) {
    this.store.dispatch(queryChanged({query}));
  }
}
