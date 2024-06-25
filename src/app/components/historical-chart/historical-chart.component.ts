import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from "@angular/common";
import { RequestsService } from "../../services/requests.service";
import { Chart, registerables } from "chart.js/auto";
import { DateRange } from "../../models/trend.model";
import 'chartjs-adapter-date-fns';
import zoomPlugin from 'chartjs-plugin-zoom';

Chart.register(zoomPlugin);

@Component({
  selector: 'app-historical-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historical-chart.component.html',
  styleUrl: './historical-chart.component.scss',
  providers: [DatePipe]
})
export class HistoricalChartComponent implements OnInit {
  private symbol: string = '';
  chart: any;

  constructor(private requestsService: RequestsService, private datePipe: DatePipe) {
    Chart.register(...registerables);
  }

  ngOnInit() {
    this.requestsService.symbol.subscribe(s => {
      this.symbol = s;
    })
    this.requestsService.historicalPrices.subscribe((response: DateRange[]) => {
      if (response.length) {
        const times = response.map(data => new Date(data.t))
        const prices = response.map(data => data.c);
        this.createChart(times, prices)
      }

    })

  }

  private createChart(times: Date[], prices: string[]) {
    this.chart = new Chart("historical_prices", {
      type: 'line',
      data: {
        labels: times,
        datasets: [
          {
            label: this.symbol,
            data: prices,
            borderColor: '#0d47a1',
            backgroundColor: 'rgba(93, 175, 89, 0.1)',
            borderWidth: 1,
            fill: false,
          }
        ]
      },
      options: {
        aspectRatio: 3,
        scales: {
          x: {
            type: 'time',
          },
          y: {
            beginAtZero: true,
          }
        },
        plugins: {
          zoom: {
            zoom: {
              wheel: {
                enabled: true,
              },
              drag: {
                enabled: true,
              },
              pinch: {
                enabled: true
              },
              mode: 'x',
            }
          }
        }
      }
    });
  }
}
