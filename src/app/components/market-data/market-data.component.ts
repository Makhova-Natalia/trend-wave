import { Component, OnDestroy, OnInit } from '@angular/core';
import { RequestsService } from "../../services/requests.service";
import { DatePipe } from "@angular/common";
import { Subject, takeUntil, tap } from "rxjs";

@Component({
  selector: 'app-market-data',
  standalone: true,
  imports: [],
  templateUrl: './market-data.component.html',
  styleUrl: './market-data.component.scss',
  providers: [DatePipe]
})
export class MarketDataComponent implements OnInit, OnDestroy {
  private destroyed$$: Subject<void> = new Subject<void>();

  symbol: string = '';
  time: string = '';
  price: string = '';

  constructor(
    private requestsService: RequestsService,
    private datePipe: DatePipe
  ) {
  }

  ngOnInit() {
    this.setData();
  }

  private setData() {
    this.requestsService.symbol
      .pipe(
        takeUntil(this.destroyed$$),
        tap((val: string) => this.symbol = val)
      )
      .subscribe();

    this.requestsService.price
      .pipe(
        takeUntil(this.destroyed$$),
        tap((price: string) => {
          if (price) {
            this.price = price;
          }
        })
      )
      .subscribe();
    this.requestsService.time
      .pipe(
        takeUntil(this.destroyed$$),
        tap((time: string) => {
          if (time) {
            this.time = this.formatDate(time);
          }
        })
      )
      .subscribe();
  }

  private formatDate(time: string): string {
    return <string>this.datePipe.transform(time, 'MMM d, h:mm a', 'GMT');
  }

  ngOnDestroy() {
    this.destroyed$$.next();
    this.destroyed$$.complete();
  }

}
