import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private searchInputSource = new BehaviorSubject<string>('');
  currentSearchInput = this.searchInputSource.asObservable();

  constructor() {}

  changeSearchInput(searchInput: string) {
    this.searchInputSource.next(searchInput);
  }
}
