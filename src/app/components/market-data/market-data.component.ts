import { Component, OnInit } from '@angular/core';
import { RequestsService } from "../../services/requests.service";
import { DatePipe } from "@angular/common";

@Component({
  selector: 'app-market-data',
  standalone: true,
  imports: [],
  templateUrl: './market-data.component.html',
  styleUrl: './market-data.component.scss',
  providers: [DatePipe]
})
export class MarketDataComponent implements OnInit {
  symbol: string = '';
  time: string = '';
  price: string = '';

  constructor(private requestsService: RequestsService, private datePipe: DatePipe) {
  }

  ngOnInit() {
    this.requestsService.symbol.subscribe(val => {
      this.symbol = val;
    })
    this.requestsService.price.subscribe(price => {
      if (price) {
        this.price = price;
      }
    });
    this.requestsService.time.subscribe(time => {
      if (time) {
        this.time = this.formatDate(time);
      }
    });
  }

  private formatDate(time: string): string {
    return <string>this.datePipe.transform(time, 'MMM d, h:mm a', 'GMT');
  }

}
