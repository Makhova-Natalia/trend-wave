import { Component } from '@angular/core';
import { RequestsService } from "../../services/requests.service";
import { REQUESTS, URL_WS } from "../../app.config";

@Component({
  selector: 'app-real-time',
  standalone: true,
  imports: [],
  templateUrl: './real-time.component.html',
  styleUrl: './real-time.component.scss',
})
export class RealTimeComponent {

  constructor(private requestsService: RequestsService) {}

  ngOnInit() {
  }

  subscribeToRealTimePrice() {
    let token: string = '';
    this.requestsService.token.subscribe(t => token = t);
    const URL = `${URL_WS}/${REQUESTS.REAL_TIME_PRICE_WS}?token=${token}`;

    const socket = new WebSocket(URL);

    socket.onopen = () => {
      console.log('WebSocket connection opened.');
      const message = {
        type: "l1-subscription",
        instrumentId: "2d53c0f3-1489-4720-80d6-14ff2bdbb562",
        provider: "cryptoquote",
        kinds: ["last"],
        subscribe: true
      };
      socket.send(JSON.stringify(message));
    };

    socket.onmessage = (event) => {
      console.log('Message from server: ', event.data);
      const data = JSON.parse(event.data);

      if (data.type === "l1-update" && data.last) {
        this.requestsService.price = data.last.price;
        this.requestsService.time = data.last.timestamp;
        this.requestsService.dates = new Date(data.last.timestamp);
        this.requestsService.prices = data.last.price
      }
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed.');
    };

    socket.onerror = (error) => {
      console.log('WebSocket error: ', error);
    };
  }
}
