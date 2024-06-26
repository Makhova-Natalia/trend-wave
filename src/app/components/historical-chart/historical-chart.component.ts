import { Component, OnInit } from '@angular/core';
import { CommonModule } from "@angular/common";
import { RequestsService } from "../../services/requests.service";
import { Chart, registerables } from "chart.js/auto";
import 'chartjs-adapter-date-fns';
import zoomPlugin from 'chartjs-plugin-zoom';
import { tap } from "rxjs";
import { DateRange } from "../../models/trend.model";

Chart.register(zoomPlugin);

@Component({
  selector: 'app-historical-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historical-chart.component.html',
  styleUrl: './historical-chart.component.scss',
})
export class HistoricalChartComponent implements OnInit {
  private symbol: string = '';
  chart: any;

  constructor(private requestsService: RequestsService) {
    Chart.register(...registerables);
  }

  ngOnInit() {
    this.requestsService.symbol.subscribe(s => {
      this.symbol = s;
    })

    this.requestsService.historicalPrices.pipe(
      tap((response: DateRange[]) => {
        if (response.length) {
          const dates = response.map(data => {
            this.requestsService.dates = new Date(data.t)
            return new Date(data.t)
          })
          const prices = response.map(data => {
            this.requestsService.prices = data.c
            return data.c
          });
          this.updateChart(dates, prices)
        }
      })
    ).subscribe(() => {})


  }

  private updateChart(times: Date[], prices: string[]): void {
    if (this.chart) {
      this.requestsService.dates.subscribe((dates) =>  {
        this.chart.data.labels = dates
      })
      this.requestsService.prices.subscribe((prices) =>  {
        this.chart.data.datasets[0].data = prices;
      })
      this.chart.update();
    } else {
      this.createChart(times, prices);
    }
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
          legend: {
            display: false
          },
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
