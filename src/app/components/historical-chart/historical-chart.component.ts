// import { Component, OnInit } from '@angular/core';
// import { ChartConfiguration, ChartOptions } from 'chart.js';
// import { HistoricalDataService } from "../../services/historical-data.service";
// import { CommonModule } from "@angular/common";
//
//
// @Component({
//   selector: 'app-historical-chart',
//   standalone: true,
//   imports: [CommonModule, ],
//   templateUrl: './historical-chart.component.html',
//   styleUrl: './historical-chart.component.scss'
// })
// export class HistoricalChartComponent implements OnInit{
//   public lineChartData: ChartConfiguration<'line'>['data'] = {datasets: [], labels: [], xLabels: [], yLabels: []};
//   public lineChartOptions: ChartOptions<'line'> = {
//     responsive: true
//   };
//
//   constructor(private historicalDataService: HistoricalDataService) {}
//
//   ngOnInit() {
//     this.historicalDataService.getHistoricalData('BTC').subscribe(data => {
//       this.lineChartData = {
//         labels: data.map((d: any) => d.date),
//         datasets: [
//           {
//             data: data.map((d: any) => d.price),
//             label: 'Price',
//             fill: true
//           }
//         ]
//       };
//     });
//   }
// }
