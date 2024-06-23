import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestsService } from "./services/requests.service";
import { SearchComponent } from "./components/search/search.component";
import { MarketDataComponent } from "./components/market-data/market-data.component";
// import { RealTimeComponent } from "./components/real-time/real-time.component";
// import { HistoricalChartComponent } from "./components/historical-chart/historical-chart.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    SearchComponent,
    MarketDataComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  private defaultSymbol = 'BTCUSD';

  constructor(private requestsService: RequestsService) {
  }

  ngOnInit() {
    this.requestsService.makeAuthenticatedRequest().subscribe(() => {
      this.requestsService.symbol = this.defaultSymbol;
      this.requestsService.getInstruments().subscribe();
    });
  }
}
