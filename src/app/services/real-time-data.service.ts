import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class RealTimeDataService {

  constructor(private socket: Socket) { }

  getRealTimeData() {
    return this.socket.fromEvent<any>('market-data');
  }
}
