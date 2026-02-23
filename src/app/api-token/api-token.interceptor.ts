
import {HttpHandlerFn, HttpRequest} from '@angular/common/http';
import {inject} from '@angular/core';
import {ApiTokenService} from './api-token.service';

export function ApiTokenInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  const apiTokenService = inject(ApiTokenService);
  const token = apiTokenService.getApiToken();

  if (token != null) {
    req = req.clone({
      params: req.params.set('key', token),
    });
  }

  return next(req);
}
