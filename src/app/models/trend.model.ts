export interface TokenResponse {
  access_token: string,
}

export interface Search {
  id: string,
  symbol: string,
  baseCurrency: string,
}

export interface DateRange {
  "t": string,
  "o": string,
  "h": string,
  "l": string,
  "c": string,
  "v": string
}
