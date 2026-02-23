import {Injectable} from '@angular/core';

// todo we can add localStorage logic here to improve UX
@Injectable({providedIn: 'root'})
export class ApiTokenService {
  private apiToken: string | undefined;

  updateApiToken(token: string) {
    this.apiToken = token;
  }

  getApiToken() {
    return this.apiToken;
  }
}
