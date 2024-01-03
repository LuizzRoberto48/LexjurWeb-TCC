import { Component, Inject, Injectable, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { take } from 'rxjs/operators';

type Message = {
  msg: string;
  severity?: string;
};

@Injectable({ providedIn: 'root' })
export class NotificationService {
  constructor(private _snackBar: MatSnackBar) {}

  success(message: string, action?: string) {
    this._snackBar.open(message, '', {
      data: message,
      panelClass: ['success'],
      horizontalPosition:'right',
      verticalPosition: 'top',
      duration:5000
    });
  }

  waning(message: string, action?: string) {
    this._snackBar.open(message, '', {
      data: message,
      panelClass: ['warning'],
      horizontalPosition:'right',
      verticalPosition: 'top',
      duration:5000
    });
  }

  danger(message: string, action?: string) {
    this._snackBar.open(message, '', {
      data: message,
      panelClass: ['danger'],
      horizontalPosition:'right',
      verticalPosition: 'top',
      duration:5000
    });
  }

}
