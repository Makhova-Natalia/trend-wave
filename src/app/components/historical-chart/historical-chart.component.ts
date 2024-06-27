import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from "@angular/common";
import { RequestsService } from "../../services/requests.service";
import { Chart, registerables } from "chart.js/auto";
import 'chartjs-adapter-date-fns';
import zoomPlugin from 'chartjs-plugin-zoom';
import { Subject, takeUntil, tap } from "rxjs";
import { DateRange } from "../../models/trend.model";

Chart.register(zoomPlugin);

@Component({
  selector: 'app-historical-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historical-chart.component.html',
  styleUrl: './historical-chart.component.scss',
})
export class HistoricalChartComponent implements OnInit, OnDestroy {
  private symbol: string = '';
  private destroyed$$: Subject<void> = new Subject<void>();
  chart: any;

  constructor(private requestsService: RequestsService) {
    Chart.register(...registerables);
  }

  ngOnInit() {
    this.requestsService.symbol
      .pipe(
        takeUntil(this.destroyed$$),
        tap((s: string) => {
          this.symbol = s;
        })
      )
      .subscribe();

    this.setValuesForChart();
  }

  private setValuesForChart() {
    this.requestsService.timesArr = [];
    this.requestsService.pricesArr = [];

    this.requestsService.historicalPrices.pipe(
      takeUntil(this.destroyed$$),
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
    ).subscribe();
  }

  private updateChart(times: Date[], prices: string[]): void {
    if (this.chart) {
      this.chart.update();
    } else {
      this.createChart(times, prices);
    }
    this.requestsService.dates
      .pipe(
        takeUntil(this.destroyed$$),
        tap((dates: Date[]) => {
          this.chart.data.labels = dates;
        })
      )
      .subscribe();
    this.requestsService.prices
      .pipe(
        takeUntil(this.destroyed$$),
        tap((prices: string[]) => {
          this.chart.data.datasets[0].data = prices;
        })
      )
      .subscribe()
  }

  private createChart(times: Date[], prices: string[]) {
    this.chart = new Chart("historical_prices", {
      type: 'line',
      data: {
        labels: times,
        datasets: [
          {
            label: 'Price',
            data: prices,
            borderColor: '#34495e',
            backgroundColor: 'rgba(93, 175, 89, 0.1)',
            borderWidth: 3,
            fill: false,
          }
        ]
      },
      options: {
        aspectRatio: 3,
        scales: {
          x: {
            type: 'time',
            ticks: {
              color: 'white',
              font: {
                size: 12,
              }
            },
          },
          y: {
            beginAtZero: true,
            ticks: {
              color: 'white',
              font: {
                size: 14,
              }
            },
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

  ngOnDestroy() {
    if (this.chart) {
      this.requestsService.timesArr = [];
      this.requestsService.pricesArr = [];
      this.requestsService.historicalPrices = [];
      this.chart.destroy();
    }
    this.destroyed$$.next();
    this.destroyed$$.complete();
  }
}
