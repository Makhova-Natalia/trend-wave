import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestsService } from "./services/requests.service";
import { SearchComponent } from "./components/search/search.component";
import { MarketDataComponent } from "./components/market-data/market-data.component";
import { switchMap } from "rxjs";
import { RealTimeComponent } from "./components/real-time/real-time.component";
import { HistoricalChartComponent } from "./components/historical-chart/historical-chart.component";

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
export class AppComponent implements OnInit {
  readonly defaultSymbol = 'BTCUSD';

  constructor(private requestsService: RequestsService) {
  }

  ngOnInit() {
    this.requestsService.makeAuthenticatedRequest().pipe(
      switchMap(() => {
        this.requestsService.searchValue = this.defaultSymbol;
        this.requestsService.symbol = this.defaultSymbol;

        return this.requestsService.getInstruments();
      }),
      switchMap(() => {
        return this.requestsService.getCurrentPrice();
      }),
      switchMap(() => {
        return this.requestsService.getHistoricalPrices();
      })
    ).subscribe(() => {
    });
  }
}
