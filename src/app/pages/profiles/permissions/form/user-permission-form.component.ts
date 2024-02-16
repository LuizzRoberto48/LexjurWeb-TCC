import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Observable, map, startWith } from 'rxjs';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { LiveAnnouncer } from '@angular/cdk/a11y';
@Component({
  selector: 'user-permission-form',
  templateUrl: './user-permission-form.component.html',
  styleUrls: ['./user-permission-form.component.scss'],
})
export class UserPermissionFormComponent {
  @ViewChild('fruitInput') fruitInput: ElementRef<HTMLInputElement>;
  items:any[] = [1, 3]
  allFruits: string[] = ['Apple', 'Lemon', 'Lime', 'Orange', 'Strawberry'];
  selectedFruits: string[] = [];
  fruitCtrl = new FormControl();
  filteredFruits: Observable<string[]>;

  announcer = inject(LiveAnnouncer);

  constructor() {
    this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
      startWith(''),
      map(() => this._filter()),
    );
  }

  ngOnInit() {}

  add(event: any): void {
    const input = event.input;
    let value = event.value;

    // Ensure the value exists
    if (value) {
      value = value.trim();
      const isValidFruit =
        this.allFruits.includes(value) && !this.selectedFruits.includes(value);

      if (isValidFruit) {
        this.selectedFruits.push(value);
      }

      // Reset the input value regardless of whether the item was added
      if (input) {
        input.value = '';
      }

      // Clear the input form control to reset the autocomplete list
      this.fruitCtrl.setValue(null);
    }
  }

  remove(fruit: string): void {
    const index = this.selectedFruits.indexOf(fruit);
    if (index >= 0) {
      this.selectedFruits.splice(index, 1);
    }
    this.fruitCtrl.setValue(null); // Trigger the filter update
  }

  selected(event: any): void {
    this.add(event.option);
  }

  private _filter(): string[] {
    return this.allFruits.filter(
      (fruit) => !this.selectedFruits.includes(fruit),
    );
  }
}
