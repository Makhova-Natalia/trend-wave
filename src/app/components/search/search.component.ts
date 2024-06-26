import { Component } from '@angular/core';
import { RequestsService } from "../../services/requests.service";
import { Search } from "../../models/trend.model";
import { CommonModule } from "@angular/common";

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {
  searchResults: Search[] = [];
  filteredResults: Search[] = [];
  defaultSymbol = 'BTCUSD';

  constructor(private requestService: RequestsService) {
  }

  onSearch(event: any) {
    const query = event.target.value.trim();
    this.requestService.symbol = query ? query.toUpperCase() : this.defaultSymbol;

    this.requestService.getInstruments().subscribe(results => {
      this.searchResults = results.data;
      this.filteredResults = this.searchResults
        .slice(0, 10);
    });
  }

  onChangeData(result: Search) {
    this.filteredResults = [];
    this.defaultSymbol = result.symbol;
    this.requestService.symbol = result.symbol;
    this.requestService.instrumentId = result.id;
    this.requestService.timesArr = [];
    this.requestService.pricesArr = [];
    this.requestService.getCurrentPrice().subscribe();
    this.requestService.getHistoricalPrices().subscribe()
  }
}
