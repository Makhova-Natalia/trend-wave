import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  setData(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  getData(key: string): any {
    const item = localStorage.getItem(key) || '';

    return JSON.parse(item);
  }

  isDataExist(key: string): boolean {
    return Boolean(localStorage.getItem(key));
  }

  clearData(key: string): void {
    localStorage.removeItem(key);
  }
}
