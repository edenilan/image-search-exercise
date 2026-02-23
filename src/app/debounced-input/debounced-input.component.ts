import {Component, ElementRef, input, viewChild} from '@angular/core';
import {outputFromObservable, toObservable} from '@angular/core/rxjs-interop';
import {debounceTime, fromEvent, map, switchMap} from 'rxjs';


@Component({
  selector: 'debounced-input',
  imports: [],
  templateUrl: './debounced-input.component.html',
  styleUrl: './debounced-input.component.scss'
})
export class DebouncedInput {
  public placeholder = input.required();

  private inputElement = viewChild.required<ElementRef<HTMLInputElement>>('inputElement');

  private inputElementValues$ = toObservable(this.inputElement).pipe(
    map(elementRef => elementRef.nativeElement),
    switchMap(inputElement =>
      fromEvent(inputElement, 'input')
        .pipe(map(() => inputElement.value))
    ),
    debounceTime(500)
  );

  value = outputFromObservable(this.inputElementValues$);
}
