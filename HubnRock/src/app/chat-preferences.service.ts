import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ChatPreferencesService {

  private targetUserId: BehaviorSubject<string>; 
  private popupDisplay: BehaviorSubject<string>;

  constructor() {
    this.targetUserId = new BehaviorSubject<string>('');
    this.popupDisplay = new BehaviorSubject<string>('none');
  }

  getValue(): Observable<string> {
    return this.popupDisplay.asObservable();
  }
  setValue(newValue): void {
    this.popupDisplay.next(newValue);
  }

  getTargetUserId(): Observable<string> {
    return this.targetUserId.asObservable();
  }
  setTargetUserId(newValue): void {
    this.targetUserId.next(newValue);
  }

  
}
