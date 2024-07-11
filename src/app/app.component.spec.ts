import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { HttpClientModule } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { RequestsService } from "./services/requests.service";
import { LocalStorageService } from "./services/local-storage.service";

class MockRequestsService {
  isShownChart = of(true);
  isLoading$: boolean = true;
  token: string = '';
  searchValue$: string = '';
  symbol$: string = '';

  set searchValue(val: string) {
    this.searchValue$ = val;
  }

  set symbol(value: string) {
    this.symbol$ = value;
  }

  set isLoading(value: boolean) {
    this.isLoading$ = value;
  }

  get isLoading(): Observable<boolean> {
    return of(this.isLoading$);
  }

  get symbol(): Observable<string> {
    return of(this.symbol$);
  }

  get searchValue(): Observable<string> {
    return of(this.searchValue$);
  }

  getInstruments = () => (of({data: []}));
  getCurrentPrice = () => (of({data: []}));
  getHistoricalPrices = () => (of({data: []}));
  makeAuthenticatedRequest = () => (of({}));
}

class MockLocalStorageService {
  getData = () => ('mock-token');
  isDataExist = () => true;
}

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let requestsService: RequestsService;
  let localStorageService: LocalStorageService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        HttpClientModule
      ],
      providers: [
        {provide: RequestsService, useClass: MockRequestsService},
        {provide: LocalStorageService, useClass: MockLocalStorageService}
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    requestsService = TestBed.inject(RequestsService);
    localStorageService = TestBed.inject(LocalStorageService);
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize isHistoricalPrices and isLoading from requestsService', () => {
    component.ngOnInit();

    expect(component.isHistoricalPrices).toBe(true);
    expect(component.isLoading).toBe(true);
  });

  it('should call getDataWithExistedToken if token exists', () => {
    spyOn(component as any, 'getDataWithExistedToken');
    component.ngOnInit();

    expect((component as any).getDataWithExistedToken).toHaveBeenCalled();
  });

  it('should call getDataWithNewToken if token does not exist', () => {
    localStorageService.isDataExist = () => false;
    spyOn(component as any, 'getDataWithNewToken');
    component.ngOnInit();

    expect((component as any).getDataWithNewToken).toHaveBeenCalled();
  });

  it('should clean up on destroy', () => {
    spyOn(component['destroyed$$'], 'next');
    spyOn(component['destroyed$$'], 'complete');
    component.ngOnDestroy();
    expect(component['destroyed$$'].next).toHaveBeenCalled();
    expect(component['destroyed$$'].complete).toHaveBeenCalled();
  });

  it('should set loading to false after getting data with existing token', (done) => {
    spyOn(requestsService, 'getHistoricalPrices').and.returnValue(of({
      data: [{
        t: '',
        o: '',
        h: '',
        l: '',
        c: '',
        v: ''
      }]
    }));

    component['getDataWithExistedToken']();

    requestsService.isLoading.subscribe(val => {
      expect(val).toBe(false);
      done();
    });
  });

  it('should set loading to false after getting data with new token', (done) => {
    spyOn(requestsService, 'getHistoricalPrices').and.returnValue(of({
      data: [{
        t: '',
        o: '',
        h: '',
        l: '',
        c: '',
        v: ''
      }]
    }));

    component['getDataWithNewToken']();

    requestsService.isLoading.subscribe(val => {
      expect(val).toBe(false);
      done();
    });
  });

});
