import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestsService } from "./services/requests.service";
import { SearchComponent } from "./components/search/search.component";
// import { RealTimeComponent } from "./components/real-time/real-time.component";
// import { HistoricalChartComponent } from "./components/historical-chart/historical-chart.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, SearchComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  title = 'trend-wave';

  constructor(private requestsService: RequestsService) {
  }

  ngOnInit() {
    this.requestsService.makeAuthenticatedRequest().subscribe(() => {
      this.requestsService.getInstruments('BTCUSD').subscribe();
    });
  }
}
