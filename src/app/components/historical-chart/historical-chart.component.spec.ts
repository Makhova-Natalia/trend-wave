import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricalChartComponent } from './historical-chart.component';
import { HttpClientModule } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { RequestsService } from "../../services/requests.service";
import { Chart } from "chart.js";
import { registerables } from "chart.js/auto";

class MockRequestsService {
  symbol = of('BTCUSD');
  timesArr: any[] = [];
  pricesArr: any[] = [];
  historicalPrices = of([{ t: new Date().toISOString(), c: '50000' }]);

  get dates(): Observable<Date[]> {
    return of([new Date()])
  }

  set dates(date: Date) {
    this.timesArr = [date];
  }

  set prices(price: string) {
    this.pricesArr = [price];
  }

  get prices(): Observable<string[]> {
    return of(['14,25']);
  }
}

describe('HistoricalChartComponent', () => {
  let component: HistoricalChartComponent;
  let fixture: ComponentFixture<HistoricalChartComponent>;
  let requestsService: RequestsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HistoricalChartComponent,
        HttpClientModule
      ],
      providers: [
        { provide: RequestsService, useClass: MockRequestsService },
      ]
    })
    .compileComponents();

    Chart.register(...registerables);
    fixture = TestBed.createComponent(HistoricalChartComponent);
    component = fixture.componentInstance;
    requestsService = TestBed.inject(RequestsService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set symbol OnInit', () => {
    component.ngOnInit();
    expect(component['symbol']).toBe('BTCUSD');
  });

  it('should set values for chart OnInit', () => {
    spyOn(component as any, 'setValuesForChart').and.callThrough();
    component.ngOnInit();
    expect(component['setValuesForChart']).toHaveBeenCalled();
  });

  it('should update chart with new data', () => {
    spyOn(component.chart as any, 'update');
    const times = [new Date()];
    const prices = ['50000'];

    component['updateChart'](times, prices);

    expect(component.chart.update).toHaveBeenCalled();
  });

  it('should create chart with provided data', () => {
    if (component.chart) {
      component.chart.destroy();
      component.chart = null;
    }

    const times = [new Date()];
    const prices = ['50000'];

    component['createChart'](times, prices);

    expect(component.chart).toBeTruthy();
    expect(component.chart.data.labels).toEqual(times);
    expect(component.chart.data.datasets[0].data).toEqual(prices);
  });

  it('should destroy chart and clean up OnDestroy', () => {
    component.chart = new Chart(document.createElement('canvas'), {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          {
            label: 'Price',
            data: [],
            borderColor: '#34495e',
            backgroundColor: 'rgba(93, 175, 89, 0.1)',
            borderWidth: 3,
            fill: false,
          }
        ]
      }
    });

    spyOn(component.chart, 'destroy');
    spyOn(component['destroyed$$'], 'next');
    spyOn(component['destroyed$$'], 'complete');

    component.ngOnDestroy();

    expect(component.chart.destroy).toHaveBeenCalled();
    expect(component['destroyed$$'].next).toHaveBeenCalled();
    expect(component['destroyed$$'].complete).toHaveBeenCalled();
  });

});
