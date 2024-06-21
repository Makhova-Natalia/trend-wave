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

export enum TOKEN_VARIABLES {
  USERNAME = 'r_test@fintatech.com',
  PASSWORD = 'kisfiz-vUnvy9-sopnyv'
}

export enum REQUESTS {
  TOKEN = 'identity/realms/{realm}/protocol/openid-connect/token',
  SEARCH = 'instruments/v1/instruments'
}
