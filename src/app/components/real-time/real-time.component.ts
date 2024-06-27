import { Component, OnDestroy } from '@angular/core';
import { RequestsService } from "../../services/requests.service";
import { Subject, takeUntil, tap } from "rxjs";
import { RealTimeDataService } from "../../services/real-time-data.service";

@Component({
  selector: 'app-real-time',
  standalone: true,
  imports: [],
  templateUrl: './real-time.component.html',
  styleUrl: './real-time.component.scss',
})
export class RealTimeComponent implements OnDestroy {
  private destroyed$$: Subject<void> = new Subject<void>();
  private socket: WebSocket = new WebSocket('');

  constructor(
    private requestsService: RequestsService,
    private realTimeDataService: RealTimeDataService
  ) {
  }

  subscribeToRealTimePrice() {
    let token: string = '';

    this.requestsService.token
      .pipe(
        takeUntil(this.destroyed$$)
      )
      .subscribe(t => token = t);

    if (this.realTimeDataService.isWebSocketNew()) {
      this.realTimeDataService.getWebSocket(token)
        .pipe(
          takeUntil(this.destroyed$$),
          tap((ws: WebSocket) => this.socket = ws)
        ).subscribe();
    }


  }

  ngOnDestroy() {
    this.destroyed$$.next();
    this.destroyed$$.complete();
    this.realTimeDataService.closeWebSocket();
  }
}
