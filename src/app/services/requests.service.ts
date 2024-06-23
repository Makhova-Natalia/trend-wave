import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, switchMap, tap, throwError } from "rxjs";
import { Search, TokenResponse } from "../models/trend.model";
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from "@angular/common/http";
import { REQUESTS, TOKEN_VARIABLES, URL } from "../app.config";

@Injectable({
  providedIn: 'root'
})
export class RequestsService {
  private REALM = 'fintatech';
  private tokenSubject$: BehaviorSubject<string>  = new BehaviorSubject<string>('');
  private TOKEN_FOR_TEST = 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJTUDJFWmlsdm8zS2g3aGEtSFRVU0I3bmZ6dERRN21tb3M3TXZndlI5UnZjIn0.eyJleHAiOjE3MTg5NjUxNTEsImlhdCI6MTcxODk2MzM1MSwianRpIjoiMmI0MTZjYmEtM2NiMS00OTQ0LTk3MGUtNTA3NDg3YzgyZmVjIiwiaXNzIjoiaHR0cHM6Ly9wbGF0Zm9ybS5maW50YWNoYXJ0cy5jb20vaWRlbnRpdHkvcmVhbG1zL2ZpbnRhdGVjaCIsImF1ZCI6WyJuZXdzLWNvbnNvbGlkYXRvciIsImJhcnMtY29uc29saWRhdG9yIiwidHJhZGluZy1jb25zb2xpZGF0b3IiLCJjb3B5LXRyYWRlci1jb25zb2xpZGF0b3IiLCJwYXltZW50cyIsIndlYi1zb2NrZXRzLXN0cmVhbWluZyIsInVzZXItZGF0YS1zdG9yZSIsImFsZXJ0cy1jb25zb2xpZGF0b3IiLCJ1c2VyLXByb2ZpbGUiLCJlbWFpbC1ub3RpZmljYXRpb25zIiwiaW5zdHJ1bWVudHMtY29uc29saWRhdG9yIiwiYWNjb3VudCJdLCJzdWIiOiI5NWU2NmRiYi00N2E3LTQ4ZDktOWRmZS00ZWM2Y2U0MWNiNDEiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJhcHAtY2xpIiwic2Vzc2lvbl9zdGF0ZSI6ImEwYzkyOThjLTRhMjktNDFjOC04OTZmLWRiMjg2OGJiYjNmNSIsImFjciI6IjEiLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsib2ZmbGluZV9hY2Nlc3MiLCJkZWZhdWx0LXJvbGVzLWZpbnRhdGVjaCIsInVtYV9hdXRob3JpemF0aW9uIiwidXNlcnMiXX0sInJlc291cmNlX2FjY2VzcyI6eyJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6ImVtYWlsIHByb2ZpbGUiLCJzaWQiOiJhMGM5Mjk4Yy00YTI5LTQxYzgtODk2Zi1kYjI4NjhiYmIzZjUiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicm9sZXMiOlsib2ZmbGluZV9hY2Nlc3MiLCJkZWZhdWx0LXJvbGVzLWZpbnRhdGVjaCIsInVtYV9hdXRob3JpemF0aW9uIiwidXNlcnMiXSwibmFtZSI6IkRlbW8gVXNlciIsInByZWZlcnJlZF91c2VybmFtZSI6InJfdGVzdEBmaW50YXRlY2guY29tIiwiZ2l2ZW5fbmFtZSI6IkRlbW8iLCJmYW1pbHlfbmFtZSI6IlVzZXIiLCJlbWFpbCI6InJfdGVzdEBmaW50YXRlY2guY29tIn0.lF8k8dcVl-auPfHlJxEt8QhqhTHbj3ceeumzW8SNZG18ulfXbbgwFUgwTevi8LohthABpSpQwyvHGhQSV9TKqNAGbyLF18AGjlTiHbrL8IulKCb_OYwv68qxQORx5cQSTDoJamAfX5fjae1yrJ1mPiJX6yORwjDV24zuBh8tUpqC8ds--g3yYDrJKn5XRuh-N7RzpXEX6TrvVbQpRWKEXeLr5yo3T08uKVb1I1wvx5mCd2lTSZVRXiVfi8fZx5gCtq2tEUxrtUsRqfOlVd4k-TjLFPj2wX5T_zsxddcG7xOSkJg-qb-DTzrqHzh_Nn8GFoVhZBu75z8e-pIGbgbrdQ'

  constructor(private readonly http: HttpClient) {
  }

  get token() {
    return this.tokenSubject$.asObservable();
  }

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

  private getToken(): Observable<TokenResponse> {
    const { tokenUrl, body, headers } = this.createParams();

    return this.http.post<TokenResponse>(tokenUrl, body.toString(), { headers })
      .pipe(
        tap((resp: TokenResponse) => {
          this.tokenSubject$.next(resp.access_token);
        })
      );
  }

  handleRequest<T>(request: Observable<T>): Observable<T> {
    return request.pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          return this.getToken().pipe(
            switchMap((tokenResponse: TokenResponse) => {
              this.tokenSubject$.next(tokenResponse.access_token);
              return request;
            })
          );
        } else {
          return throwError(error);
        }
      })
    );
  }

  makeAuthenticatedRequest(): Observable<TokenResponse> {
    const request = this.getToken();

    return this.handleRequest(request);
  }

  getInstruments(symbol: string): Observable<Search[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.tokenSubject$.value}`
    });

    const params = new HttpParams()
      .set('symbol', symbol)
      .set('page', '1')
      .set('size', '30');

    const request = this.http.get<Search[]>(`${URL}/${REQUESTS.SEARCH}`, {headers, params})

    return this.handleRequest(request);
  }
}
