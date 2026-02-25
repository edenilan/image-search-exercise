import {Component, inject} from '@angular/core';
import {ApiTokenService} from '../../../../api-token/api-token.service';
import {MatButtonModule} from '@angular/material/button';
import {Store} from '@ngrx/store';
import {apiTokenUpdated} from '../../../../api-token/api-token.actions';

@Component({
  selector: 'error-state',
  imports: [MatButtonModule],
  templateUrl: './error-state.component.html',
  styleUrl: './error-state.component.scss',
})
export class ErrorStateComponent {
  private apiTokenService = inject(ApiTokenService);
  private store = inject(Store);

  updateApiToken(value: string) {
    this.apiTokenService.updateApiToken(value);
    this.store.dispatch(apiTokenUpdated());
  }
}
