import { Component, ElementRef, HostListener, OnDestroy } from '@angular/core';
import { RequestsService } from "../../services/requests.service";
import { Search } from "../../models/trend.model";
import { CommonModule } from "@angular/common";
import { Subject, takeUntil, tap } from "rxjs";
import { RealTimeDataService } from "../../services/real-time-data.service";

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent implements OnDestroy {
  private destroyed$$: Subject<void> = new Subject<void>();

  searchResults: Search[] = [];
  filteredResults: Search[] = [];
  defaultSymbol = 'BTCUSD';
  isSearchResultsVisible: boolean = false;

  constructor(
    private requestService: RequestsService,
    private realTimeService: RealTimeDataService,
    private eRef: ElementRef
  ) {
  }

  onSearch(event: any) {
    const query = event.target.value.trim();
    this.requestService.searchValue = query ? query.toUpperCase() : this.defaultSymbol;

    this.requestService.getInstruments()
      .pipe(
        takeUntil(this.destroyed$$),
        tap(results => {
          this.searchResults = results.data;
          this.filteredResults = this.searchResults.slice(0, 10);
          this.isSearchResultsVisible = true;
        })
      )
      .subscribe();
  }

  onChangeData(result: Search) {
    this.realTimeService.closeWebSocket();
    this.filteredResults = [];
    this.defaultSymbol = result.symbol;
    this.requestService.symbol = result.symbol;
    this.requestService.instrumentId = result.id;
    this.requestService.timesArr = [];
    this.requestService.pricesArr = [];
    this.requestService.getCurrentPrice()
      .pipe(
        takeUntil(this.destroyed$$)
      )
      .subscribe();
    this.requestService.getHistoricalPrices()
      .pipe(
        takeUntil(this.destroyed$$)
      )
      .subscribe();
    this.isSearchResultsVisible = false;
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.isSearchResultsVisible = false;
    }
  }

  ngOnDestroy() {
    this.destroyed$$.next();
    this.destroyed$$.complete();
  }
}
