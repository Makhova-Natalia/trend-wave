import { Component } from '@angular/core';
import { RequestsService } from "../../services/requests.service";
import { Search } from "../../models/trend.model";

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {
  searchResults: Search[] = [];
  defaultSymbol = 'BTCUSD';

  constructor(private requestService: RequestsService) {
  }

  onSearch(event: any) {
    const query = event.target.value.trim();
    this.requestService.symbol = query ? query.toUpperCase() : this.defaultSymbol;

    this.requestService.getInstruments().subscribe(results => {
      this.searchResults = results.data;
    });
  }
}
