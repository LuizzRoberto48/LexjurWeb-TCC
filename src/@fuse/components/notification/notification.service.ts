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

  success(message: string, action: string) {
    this._snackBar.open(message, '', {
      data: message,
      panelClass: ['success'],
      horizontalPosition:'right',
      verticalPosition: 'top',
      duration:1115000
    });
  }

  waning(message: string, action: string) {
    this._snackBar.open(message, '', {
      data: message,
      panelClass: ['warning'],
      horizontalPosition:'right',
      verticalPosition: 'top',
      duration:1115000
    });
  }

  danger(message: string, action: string) {
    this._snackBar.open(message, '', {
      data: message,
      panelClass: ['danger'],
      horizontalPosition:'right',
      verticalPosition: 'top',
      duration:1115000
    });
  }

  /* success({ msg }: Message) {
    
    this._snackBar.openFromComponent(ResponseNotificationComponent, {
      horizontalPosition: 'right',
      verticalPosition: 'top',
      duration: 11115000,
    });
  }

  warning({ msg }: Message) {
    this._snackBar.openFromComponent(ResponseNotificationComponent, {
      data: { msg, type: 'warning' },
      panelClass: ['warning'],
      horizontalPosition: 'right',
      verticalPosition: 'top',
      duration: 5000,
    });
  }

  error({ msg }: Message) {
    const snackBarRef = this._snackBar.openFromComponent(
      ResponseNotificationComponent,
      {
        data: { msg, type: 'error' },
        panelClass: 'error',
        horizontalPosition: 'right',
        verticalPosition: 'top',
        duration: 5000,
      }
    );
    snackBarRef
      .onAction()
      .pipe(take(1))
      .subscribe(() => {
        snackBarRef.dismiss();
      });
  } */

 
}
