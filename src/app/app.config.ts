import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from "@angular/common/http";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
  ]
};

export const URL = 'https://platform.fintacharts.com';
export const URL_WS = 'wss://platform.fintacharts.com';

export enum TOKEN_VARIABLES {
  USERNAME = 'r_test@fintatech.com',
  PASSWORD = 'kisfiz-vUnvy9-sopnyv'
}

export enum REQUESTS {
  TOKEN = 'identity/realms/{realm}/protocol/openid-connect/token',
  SEARCH = 'api/instruments/v1/instruments',
  DATE_RANGE = 'api/bars/v1/bars/count-back',
  REAL_TIME_PRICE_WS = 'api/streaming/ws/v1/realtime'
}
