import { Component, OnInit } from '@angular/core';
import { HistoricalDataService } from "../../services/historical-data.service";
import { SharedModule } from "../../shared.module";

@Component({
  selector: 'app-historical-chart',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './historical-chart.component.html',
  styleUrl: './historical-chart.component.scss'
})
export class HistoricalChartComponent implements OnInit{
  historicalData: any[] = [];

  constructor(private historicalDataService: HistoricalDataService) {}

  ngOnInit() {
    this.historicalDataService.getHistoricalData('BTC').subscribe(data => {
      this.historicalData = data;
    });
  }
}
