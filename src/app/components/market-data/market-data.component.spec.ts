import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketDataComponent } from './market-data.component';
import { HttpClientModule } from "@angular/common/http";
import { of } from "rxjs";
import { RequestsService } from "../../services/requests.service";
import { DatePipe } from "@angular/common";

class MockRequestsService {
  symbol = of('BTCUSD');
  price = of('150.1234');
  time = of('2024-07-09T12:34:56Z');
}

describe('MarketDataComponent', () => {
  let component: MarketDataComponent;
  let fixture: ComponentFixture<MarketDataComponent>;
  let requestsService: RequestsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MarketDataComponent,
        HttpClientModule
      ],
      providers: [
        { provide: RequestsService, useClass: MockRequestsService },
        DatePipe
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarketDataComponent);
    component = fixture.componentInstance;
    requestsService = TestBed.inject(RequestsService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set symbol and price OnInit', () => {
    component.ngOnInit();

    expect(component.symbol).toBe('BTCUSD');
    expect(component.price).toBe('150.12');
  });

  it('should set correct time when call OnInit', () => {
    component.ngOnInit();

    expect(component.time).toBe('Jul 9, 12:34 PM');
  });

  it('should unsubscribe from observables on destroy', () => {
    const destroyed$$Spy = spyOn(component['destroyed$$'], 'next');

    component.ngOnDestroy();

    expect(destroyed$$Spy).toHaveBeenCalled();
  });
});
