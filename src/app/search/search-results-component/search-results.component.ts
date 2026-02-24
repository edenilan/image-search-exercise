import {ChangeDetectionStrategy, Component, output} from '@angular/core';
import {
  CdkFixedSizeVirtualScroll,
  CdkVirtualForOf,
  CdkVirtualScrollViewport
} from '@angular/cdk/scrolling';
import {toSignal} from '@angular/core/rxjs-interop';
import {ImageResultsDataSourceService} from '../../image-results-data-source.service';
import {AnnotatedImageMetadata} from '../../image-metadata.type';

@Component({
  selector: 'search-results',
  imports: [
    CdkFixedSizeVirtualScroll,
    CdkVirtualForOf,
    CdkVirtualScrollViewport
  ],
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchResultsComponent {
  protected dataSourceService = new ImageResultsDataSourceService();
  protected isEmptyState = toSignal(this.dataSourceService.isStreamEmpty$);
  protected resultClicked = output<AnnotatedImageMetadata>();

  onResultClicked(result: AnnotatedImageMetadata) {
    this.resultClicked.emit(result);
  }

  protected trackByResultId(index: number, result: AnnotatedImageMetadata) {
    return result.id;
  }
}
