import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { RealTimeComponent } from "./components/real-time/real-time.component";
import { HistoricalChartComponent } from "./components/historical-chart/historical-chart.component";
import { SharedModule } from "./shared.module";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SharedModule, RouterOutlet, RealTimeComponent, HistoricalChartComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'trend-wave';
}
