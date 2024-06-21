import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from "rxjs";
import { Search, TokenResponse } from "../models/trend.model";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { REQUESTS, TOKEN_VARIABLES, URL } from "../app.config";

@Injectable({
  providedIn: 'root'
})
export class RequestsService {
  private REALM = 'fintatech';
  private TOKEN: string = '';
  // private tokenSubject$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor(private readonly http: HttpClient) {
  }

  // get token(): Observable<string> {
  //   return this.tokenSubject$.asObservable();
  // }

  private createParams() {
    return {
      tokenUrl: `${URL}/${REQUESTS.TOKEN.replace('{realm}', this.REALM)}`,
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

    return this.http.post<TokenResponse>(tokenUrl, body.toString(), {headers})
      .pipe(
        tap((resp: TokenResponse) => {
          this.TOKEN = resp.access_token;
          // this.tokenSubject$.next(resp.access_token);
        })
      );
  }

  getInstruments(): Observable<Search[]>  {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.TOKEN}`
    });

    const params = new HttpParams()
      .set('symbol', 'B')
      .set('page', '1')
      .set('size', '30');

    return this.http.get<Search[]>(`${URL}/api/${REQUESTS.SEARCH}`, {headers, params})
  }
}
