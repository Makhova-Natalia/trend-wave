import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, switchMap, tap, throwError } from "rxjs";
import { DateRange, Search, TokenResponse } from "../models/trend.model";
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from "@angular/common/http";
import { REQUESTS, TOKEN_VARIABLES, URL } from "../app.config";
import { LocalStorageService } from "./local-storage.service";

@Injectable({
  providedIn: 'root'
})
export class RequestsService {
  private REALM = 'fintatech';
  private token$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private symbol$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private instruments$: BehaviorSubject<Search[]> = new BehaviorSubject<Search[]>([]);
  private price$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private time$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private timesArr$: BehaviorSubject<Date[]> = new BehaviorSubject<Date[]>([]);
  private pricesArr$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  private historicalPrices$: BehaviorSubject<DateRange[]> = new BehaviorSubject<DateRange[]>([]);
  private instrumentId$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private searchValue$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor(
    private readonly http: HttpClient,
    private localStorageService: LocalStorageService
  ) {}

  set symbol(value: string) {
    this.symbol$.next(value);
  }

  set price(value: string) {
    this.price$.next(value);
  }

  set instrumentId(id: string) {
    this.instrumentId$.next(id);
  }

  set searchValue(val: string) {
    this.searchValue$.next(val);
  }

  set time(value: string) {
    this.time$.next(value);
  }

  set token(value: string) {
    this.token$.next(value);
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

  get instrumentId(): string {
    return this.instrumentId$.value;
  }

  get token(): Observable<string> {
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
          this.localStorageService.setData('token', resp.access_token)
          this.token = resp.access_token;
        })
      );
  }

  private createParamsForDateRange(type: string): Observable<HttpParams> {
    return this.instrumentsArr.pipe(
      map((val: Search[]) => {
        let instrument = this.instrumentId$.value ? this.instrumentId$.value : val[0].id;
        this.instrumentId$.next(instrument);
        const params = new HttpParams()
          .set('instrumentId', instrument)
          .set('provider', 'cryptoquote')
          .set('interval', '1');
        if (type === 'currentPrice') {
          const currentDate = new Date().toISOString();
          return params
            .set('periodicity', 'day')
            .set('barsCount', '1')
            .set('date', currentDate);
        } else if (type === 'historicalPrices') {
          return params
            .set('periodicity', 'minute')
            .set('barsCount', '30');
        } else {
          throw new Error('Invalid type parameter');
        }
      })
    )
  }

  private handleRequest<T>(request: Observable<T>, requestFn: () => Observable<T>): Observable<T> {
    return request.pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          return this.getToken().pipe(
            switchMap((tokenResponse: TokenResponse) => {
              this.token = tokenResponse.access_token;
              this.localStorageService.setData('token', tokenResponse.access_token);
              return requestFn();
            })
          );
        } else {
          return throwError(error);
        }
      })
    );
  }

  makeAuthenticatedRequest(): Observable<TokenResponse> {
    const createRequest = (): Observable<TokenResponse> => {
      return this.getToken();
    };

    return this.handleRequest(createRequest(), createRequest);
  }

  getInstruments(): Observable<{ data: Search[] }> {
    const createRequest = (): Observable<{ data: Search[] }> => {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${this.token$.value}`
      });

      const params = new HttpParams()
        .set('symbol', this.searchValue$.value)
        .set('page', '1')
        .set('size', '30');

      return this.http.get<{ data: Search[] }>(`${URL}/${REQUESTS.SEARCH}`, { headers, params });
    };

    return this.handleRequest(createRequest(), createRequest).pipe(
      tap((response: { data: Search[] }) => {
        this.instruments$.next(response.data);
      })
    );
  }

  private getDateRange(type: string): Observable<{ data: DateRange[] }> {
    const createRequest = (params: HttpParams): Observable<{ data: DateRange[] }> => {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${this.token$.value}`
      });
      return this.http.get<{ data: DateRange[] }>(`${URL}/${REQUESTS.DATE_RANGE}`, { headers, params });
    };

    let params: HttpParams = new HttpParams();

    this.createParamsForDateRange(type).subscribe(v => params = v);
    return this.handleRequest(createRequest(params), () => createRequest(params));
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
