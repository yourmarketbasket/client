import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OnlineStatusService {
  private isOnlineSubject = new BehaviorSubject<boolean>(navigator.onLine);
  public isOnline$ = this.isOnlineSubject.asObservable();

  constructor() {
    // Listen to online/offline events
    window.addEventListener('online', () => {
      console.log('Online event detected');
      this.isOnlineSubject.next(true);
    });

    window.addEventListener('offline', () => {
      console.log('Offline event detected');
      this.isOnlineSubject.next(false);
    });

    // Polling fallback: Check every 5 seconds if the browser is online or offline
    setInterval(() => {
      const currentStatus = navigator.onLine;
      if (currentStatus !== this.isOnlineSubject.getValue()) {
        this.isOnlineSubject.next(currentStatus);
        console.log('Polling detected status change:', currentStatus ? 'Online' : 'Offline');
      }
    }, 1000);
  }

  get isOnline(): boolean {
    return this.isOnlineSubject.getValue();
  }

  get statusChanged() {
    return this.isOnlineSubject.asObservable();
  }
}
