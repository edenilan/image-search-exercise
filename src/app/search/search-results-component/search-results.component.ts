import {ChangeDetectionStrategy, Component, inject, output, signal} from '@angular/core';
import {
  CdkFixedSizeVirtualScroll,
  CdkVirtualForOf,
  CdkVirtualScrollViewport
} from '@angular/cdk/scrolling';
import {toSignal} from '@angular/core/rxjs-interop';
import {ImageResultsDataSourceService} from '../../image-results-data-source.service';
import {AnnotatedImageMetadata} from '../../image-metadata.type';
import {Store} from '@ngrx/store';
import {selectIsLoadingState, selectIsSearchErrorState} from '../search.selectors';
import {ErrorStateComponent} from './error-state/error-state-component/error-state.component';

@Component({
  selector: 'search-results',
  imports: [
    CdkFixedSizeVirtualScroll,
    CdkVirtualForOf,
    CdkVirtualScrollViewport,
    ErrorStateComponent
  ],
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchResultsComponent {
  protected dataSourceService = new ImageResultsDataSourceService();
  protected isEmptyState = toSignal(this.dataSourceService.isStreamEmpty$);
  private store = inject(Store);
  protected isLoadingState = toSignal(this.store.select(selectIsLoadingState));
  protected isErrorState = toSignal(this.store.select(selectIsSearchErrorState));
  protected resultClicked = output<AnnotatedImageMetadata>();
  protected hoveredResult = signal<number|null>(null);

  onResultClicked(result: AnnotatedImageMetadata) {
    this.resultClicked.emit(result);
  }

  protected trackByResultId(index: number, result: AnnotatedImageMetadata) {
    return result.id;
  }

  onMouseEnterResult(result: AnnotatedImageMetadata) {
    this.hoveredResult.set(result.id);
  }

  onMouseLeaveResult() {
    this.hoveredResult.set(null);
  }
}
