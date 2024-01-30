import { Injectable } from '@angular/core';
import { Observable, Subject, filter, map } from 'rxjs';
import io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: any;
  private eventSubject: Subject<any> = new Subject<any>();
  private emittedEvents: Set<string> = new Set<string>();

  constructor() {
    this.socket = io('http://localhost:3000'); // Update the URL to match your server

    // Register all events
    this.socket.onAny((eventName: string, data: any) => {
      this.eventSubject.next({ eventName, data });
      this.emittedEvents.add(eventName); // Add the event to the set when received
    });
  }

  listen(eventName: string): Observable<any> {
    return this.eventSubject.asObservable().pipe(
      // Filter events based on the provided eventName
      filter(event => event.eventName === eventName),
      map((event: { data: any }) => event.data)
    );
  }

  emit(eventName: string, data: any) {
    console.log(`Emitting event: ${eventName}`);
    this.socket.emit(eventName, data);
    this.emittedEvents.add(eventName); // Add the event to the set when emitted
  }

  hasEventBeenEmitted(eventName: string): Observable<boolean> {
    return new Observable((observer) => {
      if (this.emittedEvents.has(eventName)) {
        observer.next(true);
        observer.complete();
      } else {
        const subscription = this.listen(eventName).subscribe(() => {
          observer.next(true);
          observer.complete();
          subscription.unsubscribe(); // Unsubscribe after the event is received
        });
      }
    });
  }
}
