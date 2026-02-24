import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import {provideState, provideStore} from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import {searchResultsReducer} from './search/search-results.reducer';
import {provideStoreDevtools} from '@ngrx/store-devtools';
import {SearchEffects} from './search/search.effects';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {ApiTokenInterceptor} from './api-token/api-token.interceptor';
import {annotationsReducer} from './annotations/annotations.reducer';


export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideStore(),
    provideState('searchResults', searchResultsReducer),
    provideState('annotations', annotationsReducer),
    provideEffects([SearchEffects]),
    provideStoreDevtools({
      maxAge: 25, // Retains last 25 states
      // logOnly: !isDevMode(), // Restrict extension to log-only mode
      autoPause: true, // Pauses recording actions and state changes when the extension window is not open
      trace: false, //  If set to true, will include stack trace for every dispatched action, so you can see it in trace tab jumping directly to that part of code
      traceLimit: 75, // maximum stack trace frames to be stored (in case trace option was provided as true)
      connectInZone: true, // If set to true, the connection is established within the Angular zone
    }),
    provideHttpClient(withInterceptors([ApiTokenInterceptor]))
]
};
