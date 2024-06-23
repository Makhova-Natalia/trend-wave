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
  "o": number,
  "h": number,
  "l": number,
  "c": number,
  "v": number
}
