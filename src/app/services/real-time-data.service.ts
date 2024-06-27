import { Injectable } from '@angular/core';
import { REQUESTS, URL_WS } from "../app.config";
import { BehaviorSubject, Observable } from "rxjs";
import { RequestsService } from "./requests.service";

@Injectable({
  providedIn: 'root'
})
export class RealTimeDataService {
  private webSocket$: BehaviorSubject<WebSocket> = new BehaviorSubject<WebSocket>(new WebSocket(''));

  constructor(private requestsService: RequestsService) {
  }

  private createWebSocket(token: string) {
    const URL = `${URL_WS}/${REQUESTS.REAL_TIME_PRICE_WS}?token=${token}`;
    const webSocket = new WebSocket(URL);

    webSocket.onopen = () => {
      console.log('WebSocket connection opened.');
      const message = {
        type: "l1-subscription",
        instrumentId: this.requestsService.instrumentId,
        provider: "cryptoquote",
        kinds: ["last"],
        subscribe: true
      };
      webSocket.send(JSON.stringify(message));
    };

    webSocket.onmessage = (event) => {
      console.log('Message from server: ', event.data);
      const data = JSON.parse(event.data);

      if (data.type === "l1-update" && data.last) {
        this.requestsService.price = data.last.price;
        this.requestsService.time = data.last.timestamp;
        this.requestsService.dates = new Date(data.last.timestamp);
        this.requestsService.prices = data.last.price
      }
    };

    webSocket.onclose = () => {
      this.webSocket$.next(new WebSocket(''));

      console.log('WebSocket connection closed.');
    };

    webSocket.onerror = (error) => {
      console.log('WebSocket error: ', error);
    };

    this.webSocket$.next(webSocket);
  }

  isWebSocketNew(): boolean {
    return !this.webSocket$.value.url.includes(URL_WS)
  }

  getWebSocket(token: string): Observable<WebSocket> {
    this.createWebSocket(token);
    return this.webSocket$.asObservable();
  }

  closeWebSocket() {
    if (this.webSocket$.value.url.includes(URL_WS))
      this.webSocket$.value.close();
  }

}
