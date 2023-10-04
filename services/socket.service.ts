import { Injectable, EventEmitter } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import io from 'socket.io-client';
@Injectable({
  providedIn: 'root'
})
export class SocketService {
  
  socket: any;
  constructor() { 
    this.socket = io('ws://localhost:3000');
  }

  listen(eventName: string): Observable<any> {
    return new Observable((subscriber) => {
      this.socket.on(eventName, (data: any) => {
        subscriber.next(data);
      });
    });
  }


  emit(eventName: string, data: any) {
    this.socket.emit(eventName, data);
  }
 
}
