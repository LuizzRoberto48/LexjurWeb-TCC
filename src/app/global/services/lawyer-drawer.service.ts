// drawer.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'any',
})
export class DrawerService {
  private drawerState = new BehaviorSubject<boolean>(false);

  constructor() {}

  public open() {
    this.drawerState.next(true);
  }

  public close() {
    this.drawerState.next(false);
  }

  public toggle() {
    this.drawerState.next(!this.drawerState.value);
  }

  public getDrawerState() {
    return this.drawerState.asObservable();
  }
}
