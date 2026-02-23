import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class ApiTokenService {
  private apiToken: string | undefined;

  updateApiToken(token: string) {
    this.apiToken = token;
    localStorage.setItem('token', token);
  }

  getApiToken() {
    if (this.apiToken == null) {
      this.apiToken = localStorage.getItem('token') || undefined;
    }
    return this.apiToken;
  }
}
