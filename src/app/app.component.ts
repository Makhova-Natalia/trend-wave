import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestsService } from "./services/requests.service";
import { SearchComponent } from "./components/search/search.component";
import { MarketDataComponent } from "./components/market-data/market-data.component";
import { Subject, switchMap, takeUntil } from "rxjs";
import { RealTimeComponent } from "./components/real-time/real-time.component";
import { HistoricalChartComponent } from "./components/historical-chart/historical-chart.component";
import { LocalStorageService } from "./services/local-storage.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    SearchComponent,
    MarketDataComponent,
    HistoricalChartComponent,
    RealTimeComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  readonly defaultSymbol = 'BTCUSD';
  private destroyed$$: Subject<void> = new Subject<void>();

  constructor(
    private requestsService: RequestsService,
    private localStorageService: LocalStorageService
  ) { }

  ngOnInit() {
    if (this.localStorageService.isDataExist('token')) {
      this.requestsService.token = this.localStorageService.getData('token');
      this.setSymbols();
      this.getDataWithExistedToken();
    } else {
      this.getDataWithNewToken();
    }
  }

  private setSymbols(): void {
    this.requestsService.searchValue = this.defaultSymbol;
    this.requestsService.symbol = this.defaultSymbol;
  }

  private getDataWithExistedToken() {
    this.requestsService.getInstruments().pipe(
      takeUntil(this.destroyed$$),
      switchMap(() => {
        return this.requestsService.getCurrentPrice();
      }),
      switchMap(() => {
        return this.requestsService.getHistoricalPrices();
      })
    ).subscribe();
  }

  private getDataWithNewToken() {
    this.requestsService.makeAuthenticatedRequest().pipe(
      takeUntil(this.destroyed$$),
      switchMap(() => {
        this.setSymbols();
        return this.requestsService.getInstruments();
      }),
      switchMap(() => {
        return this.requestsService.getCurrentPrice();
      }),
      switchMap(() => {
        return this.requestsService.getHistoricalPrices();
      })
    ).subscribe();
  }

  ngOnDestroy() {
    this.destroyed$$.next();
    this.destroyed$$.complete();
  }
}
