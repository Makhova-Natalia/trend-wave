import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, switchMap, tap, throwError } from "rxjs";
import { DateRange, Search, TokenResponse } from "../models/trend.model";
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from "@angular/common/http";
import { REQUESTS, TOKEN_VARIABLES, URL } from "../app.config";

@Injectable({
  providedIn: 'root'
})
export class RequestsService {
  private REALM = 'fintatech';
  private token$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private TOKEN_FOR_TEST = 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJTUDJFWmlsdm8zS2g3aGEtSFRVU0I3bmZ6dERRN21tb3M3TXZndlI5UnZjIn0.eyJleHAiOjE3MTg5NjUxNTEsImlhdCI6MTcxODk2MzM1MSwianRpIjoiMmI0MTZjYmEtM2NiMS00OTQ0LTk3MGUtNTA3NDg3YzgyZmVjIiwiaXNzIjoiaHR0cHM6Ly9wbGF0Zm9ybS5maW50YWNoYXJ0cy5jb20vaWRlbnRpdHkvcmVhbG1zL2ZpbnRhdGVjaCIsImF1ZCI6WyJuZXdzLWNvbnNvbGlkYXRvciIsImJhcnMtY29uc29saWRhdG9yIiwidHJhZGluZy1jb25zb2xpZGF0b3IiLCJjb3B5LXRyYWRlci1jb25zb2xpZGF0b3IiLCJwYXltZW50cyIsIndlYi1zb2NrZXRzLXN0cmVhbWluZyIsInVzZXItZGF0YS1zdG9yZSIsImFsZXJ0cy1jb25zb2xpZGF0b3IiLCJ1c2VyLXByb2ZpbGUiLCJlbWFpbC1ub3RpZmljYXRpb25zIiwiaW5zdHJ1bWVudHMtY29uc29saWRhdG9yIiwiYWNjb3VudCJdLCJzdWIiOiI5NWU2NmRiYi00N2E3LTQ4ZDktOWRmZS00ZWM2Y2U0MWNiNDEiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJhcHAtY2xpIiwic2Vzc2lvbl9zdGF0ZSI6ImEwYzkyOThjLTRhMjktNDFjOC04OTZmLWRiMjg2OGJiYjNmNSIsImFjciI6IjEiLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsib2ZmbGluZV9hY2Nlc3MiLCJkZWZhdWx0LXJvbGVzLWZpbnRhdGVjaCIsInVtYV9hdXRob3JpemF0aW9uIiwidXNlcnMiXX0sInJlc291cmNlX2FjY2VzcyI6eyJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6ImVtYWlsIHByb2ZpbGUiLCJzaWQiOiJhMGM5Mjk4Yy00YTI5LTQxYzgtODk2Zi1kYjI4NjhiYmIzZjUiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicm9sZXMiOlsib2ZmbGluZV9hY2Nlc3MiLCJkZWZhdWx0LXJvbGVzLWZpbnRhdGVjaCIsInVtYV9hdXRob3JpemF0aW9uIiwidXNlcnMiXSwibmFtZSI6IkRlbW8gVXNlciIsInByZWZlcnJlZF91c2VybmFtZSI6InJfdGVzdEBmaW50YXRlY2guY29tIiwiZ2l2ZW5fbmFtZSI6IkRlbW8iLCJmYW1pbHlfbmFtZSI6IlVzZXIiLCJlbWFpbCI6InJfdGVzdEBmaW50YXRlY2guY29tIn0.lF8k8dcVl-auPfHlJxEt8QhqhTHbj3ceeumzW8SNZG18ulfXbbgwFUgwTevi8LohthABpSpQwyvHGhQSV9TKqNAGbyLF18AGjlTiHbrL8IulKCb_OYwv68qxQORx5cQSTDoJamAfX5fjae1yrJ1mPiJX6yORwjDV24zuBh8tUpqC8ds--g3yYDrJKn5XRuh-N7RzpXEX6TrvVbQpRWKEXeLr5yo3T08uKVb1I1wvx5mCd2lTSZVRXiVfi8fZx5gCtq2tEUxrtUsRqfOlVd4k-TjLFPj2wX5T_zsxddcG7xOSkJg-qb-DTzrqHzh_Nn8GFoVhZBu75z8e-pIGbgbrdQ'
  private symbol$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private instruments$: BehaviorSubject<Search[]> = new BehaviorSubject<Search[]>([]);
  private price$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private time$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private timesArr$: BehaviorSubject<Date[]> = new BehaviorSubject<Date[]>([]);
  private pricesArr$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  private historicalPrices$: BehaviorSubject<DateRange[]> = new BehaviorSubject<DateRange[]>([]);
  private instrumentId$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor(private readonly http: HttpClient) {
  }


  set symbol(value: string) {
    this.symbol$.next(value);
  }

  set price(value: string) {
    this.price$.next(value);
  }

  set instrumentId(id: string) {
    this.instrumentId$.next(id);
  }

  set time(value: string) {
    this.time$.next(value);
  }

  set dates(date: Date) {
    const currentTimes = this.timesArr$.value;
    this.timesArr$.next([...currentTimes, date]);
  }

  set prices(price: string) {
    const currentPrice = this.pricesArr$.value;
    this.pricesArr$.next([...currentPrice, price]);
  }

  set timesArr(arr: Date[]) {
    this.timesArr$.next(arr)
  }

  set pricesArr(arr: string[]) {
    this.pricesArr$.next(arr)
  }

  get dates(): Observable<Date[]> {
    return this.timesArr$.asObservable();
  }

  get prices(): Observable<string[]> {
    return this.pricesArr$.asObservable()
  }

  get token() {
    return this.token$.asObservable();
  }

  get instrumentsArr(): Observable<Search[]> {
    return this.instruments$.asObservable();
  }

  get symbol(): Observable<string> {
    return this.symbol$.asObservable();
  }

  get price(): Observable<string> {
    return this.price$.asObservable();
  }

  get time(): Observable<string> {
    return this.time$.asObservable();
  }

  get historicalPrices(): Observable<DateRange[]> {
    return this.historicalPrices$.asObservable();
  }

  private createParamsForToken() {
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
    const {tokenUrl, body, headers} = this.createParamsForToken();

    return this.http.post<TokenResponse>(tokenUrl, body.toString(), {headers})
      .pipe(
        tap((resp: TokenResponse) => {
          this.token$.next(resp.access_token);
        })
      );
  }

  private createParamsForDateRange(type: string): Observable<HttpParams> {
    return this.instrumentsArr.pipe(
      map((val: Search[]) => {
        const params = new HttpParams()
          .set('instrumentId', this.instrumentId$.value ? this.instrumentId$.value : val[0].id)
          .set('provider', 'cryptoquote')
          .set('interval', '1');

        if (type === 'currentPrice') {
          const currentDate = new Date().toISOString();
          return params
            .set('periodicity', 'minute')
            .set('barsCount', '1')
            .set('date', currentDate);
        } else if (type === 'historicalPrices') {
          return params
            .set('periodicity', 'day')
            .set('barsCount', '14');
        } else {
          throw new Error('Invalid type parameter');
        }
      })
    )
  }

  private handleRequest<T>(request: Observable<T>): Observable<T> {
    return request.pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          return this.getToken().pipe(
            switchMap((tokenResponse: TokenResponse) => {
              this.token$.next(tokenResponse.access_token);
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

  getInstruments(): Observable<{ data: Search[] }> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token$.value}`
    });
    const symbol = this.symbol$.value;

    const params = new HttpParams()
      .set('symbol', symbol)
      .set('page', '1')
      .set('size', '30');

    const request = this.http.get<{ data: Search[] }>(`${URL}/${REQUESTS.SEARCH}`, {headers, params})

    return this.handleRequest(request).pipe(
      tap((response: { data: Search[] }) => {
        this.instruments$.next(response.data);
      })
    );
  }

  private getDateRange(type: string): Observable<{ data: DateRange[] }> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token$.value}`
    });
    let params: HttpParams = new HttpParams();

    this.createParamsForDateRange(type).subscribe(v => params = v);
    const request = this.http.get<{ data: DateRange[] }>(`${URL}/${REQUESTS.DATE_RANGE}`, {headers, params});

    return this.handleRequest(request);


  }

  getCurrentPrice(): Observable<{ data: DateRange[] }> {
    return this.getDateRange('currentPrice').pipe(
      tap(((response: { data: DateRange[] }) => {
        if (response && response.data.length > 0) {
          this.price$.next(response.data[0].c);
          this.time$.next(response.data[0].t);
        }
      })));
  }

  getHistoricalPrices(): Observable<{ data: DateRange[] }> {
    return this.getDateRange('historicalPrices').pipe(
      tap(((response: { data: DateRange[] }) => {
        this.historicalPrices$.next(response.data)
      }))
    );
  }
}
