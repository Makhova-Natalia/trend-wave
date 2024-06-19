import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { TokenResponse } from "../models/trend.model";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { REQUESTS, TOKEN_VARIABLES, URL } from "../app.config";

@Injectable({
  providedIn: 'root'
})
export class RequestsService {
  private REALM = 'fintatech';

  constructor(private readonly http: HttpClient) {
  }

  private createParams() {
    return {
      tokenUrl: `/api/${REQUESTS.TOKEN.replace('{realm}', this.REALM)}`,
      body: new HttpParams()
        .set('username', TOKEN_VARIABLES.USERNAME)
        .set('password', TOKEN_VARIABLES.PASSWORD)
        .set('grant_type', 'password')
        .set('client_id', 'app-cli'),
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    }
  }

  getToken(): Observable<TokenResponse> {
    const {tokenUrl, body, headers} = this.createParams();

    return this.http.post<TokenResponse>(tokenUrl, body.toString(), {headers});
  }
}
