import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchComponent } from './search.component';
import { HttpClientModule } from "@angular/common/http";
import { BehaviorSubject, of } from "rxjs";
import { RequestsService } from "../../services/requests.service";
import { RealTimeDataService } from "../../services/real-time-data.service";
import { ElementRef } from "@angular/core";
import { Search } from "../../models/trend.model";

class MockRequestsService {
  private searchValue$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  symbol: string = '';
  instrumentId: string = '';
  timesArr: any[] = [];
  pricesArr: any[] = [];

  getInstruments() {
    return of({ data: [{ symbol: 'BTCUSD', id: '1' }] });
  }

  set searchValue(val: string) {
    this.searchValue$.next(val);
  }

  getCurrentPrice() {
    return of({});
  }

  getHistoricalPrices() {
    return of({});
  }
}

class MockRealTimeDataService {
  closeWebSocket() { }
}

class MockElementRef {
  nativeElement = {
    contains: (target: any) => true
  };
}


describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let requestsService: RequestsService;
  let realTimeService: RealTimeDataService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SearchComponent,
        HttpClientModule
      ],
      providers: [
        { provide: RequestsService, useClass: MockRequestsService },
        { provide: RealTimeDataService, useClass: MockRealTimeDataService },
        { provide: ElementRef, useClass: MockElementRef }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should update search results and visibility on search', () => {
    const mockEvent = { target: { value: 'BTC' } };

    component.onSearch(mockEvent);

    expect(component.searchResults.length).toBe(1);
    expect(component.filteredResults.length).toBe(1);
    expect(component.isSearchResultsVisible).toBe(true);
  });

  it('should update request service and hide search results on data change', () => {
    const mockResult: Search = { symbol: 'ETHUSD', id: '2', baseCurrency: "" };

    component.onChangeData(mockResult);

    expect(component.filteredResults.length).toBe(0);
    expect(component.defaultSymbol).toBe('ETHUSD');
    expect(component.isSearchResultsVisible).toBe(false);
  });

  it('should hide search results when clicking outside', () => {
    const mockEvent = new Event('click');
    spyOn(component["eRef"].nativeElement, 'contains').and.returnValue(false);

    component.clickOutside(mockEvent);

    expect(component.isSearchResultsVisible).toBe(false);
  });

  it('should unsubscribe from observables on destroy', () => {
    spyOn(component['destroyed$$'], 'next');
    spyOn(component['destroyed$$'], 'complete');

    component.ngOnDestroy();

    expect(component['destroyed$$'].next).toHaveBeenCalled();
    expect(component['destroyed$$'].complete).toHaveBeenCalled();
  });
});
