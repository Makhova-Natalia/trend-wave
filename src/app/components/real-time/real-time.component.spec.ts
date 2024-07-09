import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RealTimeComponent } from './real-time.component';
import { HttpClientModule } from "@angular/common/http";
import { of } from "rxjs";
import { RequestsService } from "../../services/requests.service";
import { RealTimeDataService } from "../../services/real-time-data.service";

class MockRequestsService {
  token = of('mockToken');
}

class MockRealTimeDataService {
  isWebSocketNew() {
    return true;
  }
  getWebSocket(token: string) {
    return of(new WebSocket('ws://mockurl'));
  }
  closeWebSocket() {
  }
}

describe('RealTimeComponent', () => {
  let component: RealTimeComponent;
  let fixture: ComponentFixture<RealTimeComponent>;
  let requestsService: RequestsService;
  let realTimeDataService: RealTimeDataService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RealTimeComponent,
        HttpClientModule
      ],
      providers: [
        { provide: RequestsService, useClass: MockRequestsService },
        { provide: RealTimeDataService, useClass: MockRealTimeDataService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RealTimeComponent);
    component = fixture.componentInstance;
    requestsService = TestBed.inject(RequestsService);
    realTimeDataService = TestBed.inject(RealTimeDataService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe to real-time price', () => {
    spyOn(realTimeDataService, 'isWebSocketNew').and.returnValue(true);

    component.subscribeToRealTimePrice();

    expect(realTimeDataService.isWebSocketNew).toHaveBeenCalled();
  });

  it('should subscribe to real-time price and set socket', () => {
    spyOn(realTimeDataService, 'getWebSocket').and.callThrough();

    component.subscribeToRealTimePrice();

    expect(realTimeDataService.getWebSocket).toHaveBeenCalledWith('mockToken');
  });

  it('should unsubscribe and close WebSocket on destroy', () => {
    spyOn(component['destroyed$$'], 'next');
    spyOn(component['destroyed$$'], 'complete');
    spyOn(realTimeDataService, 'closeWebSocket');

    component.ngOnDestroy();

    expect(component['destroyed$$'].next).toHaveBeenCalled();
    expect(component['destroyed$$'].complete).toHaveBeenCalled();
    expect(realTimeDataService.closeWebSocket).toHaveBeenCalled();
  });
});
