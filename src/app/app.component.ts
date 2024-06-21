import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestsService } from "./services/requests.service";
import { TokenResponse } from "./models/trend.model";
// import { RealTimeComponent } from "./components/real-time/real-time.component";
// import { HistoricalChartComponent } from "./components/historical-chart/historical-chart.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  title = 'trend-wave';

  constructor(private requestsService: RequestsService) {
  }

  ngOnInit() {
    this.requestsService.makeAuthenticatedRequest().subscribe(() => {
      this.requestsService.getInstruments().subscribe()
    });

  }
}
