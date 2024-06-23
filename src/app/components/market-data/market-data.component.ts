import { Component, OnInit } from '@angular/core';
import { RequestsService } from "../../services/requests.service";

@Component({
  selector: 'app-market-data',
  standalone: true,
  imports: [],
  templateUrl: './market-data.component.html',
  styleUrl: './market-data.component.scss'
})
export class MarketDataComponent implements OnInit{
  symbol: string = '';
  time: string = '2';
  price: string = '3';

  constructor(private requestsService: RequestsService) {
  }

  ngOnInit() {
    this.requestsService.symbol.subscribe(val => {
      this.symbol = val;
    })
  }

}
