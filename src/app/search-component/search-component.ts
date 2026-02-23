import {Component, ElementRef, viewChild} from '@angular/core';
import {outputFromObservable, toObservable} from '@angular/core/rxjs-interop';
import {debounceTime, fromEvent, map, switchMap} from 'rxjs';


@Component({
  selector: 'search',
  imports: [],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  private searchInputElement = viewChild.required<ElementRef<HTMLInputElement>>("searchInput");

  private searchInputElementValues$ = toObservable(this.searchInputElement).pipe(
    map(elementRef => elementRef.nativeElement),
    switchMap(inputElement =>
      fromEvent(inputElement, 'input')
        .pipe(map(() => inputElement.value))
    ),
    debounceTime(1000)
  );

  query = outputFromObservable(this.searchInputElementValues$);
}
