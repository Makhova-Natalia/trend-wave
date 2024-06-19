import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class HistoricalDataService {
  private apiUrl = 'https://api.fintacharts.com/historical-prices';

  constructor(private http: HttpClient) { }

  getHistoricalData(asset: string): Observable<any> {
    return this.http.get(`${this.apiUrl}?asset=${asset}`);
  }

}
