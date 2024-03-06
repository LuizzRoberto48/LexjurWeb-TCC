// src/app/core/services/date-util.service.ts
import { Injectable } from '@angular/core';
import { DateTime } from 'luxon';

@Injectable({
  providedIn: 'root',
})
export class DateUtilService {
  constructor() {
    DateTime.local().setLocale('pt-BR');
  }

  public now(): DateTime {
    return DateTime.local().setLocale('pt-BR');
  }

  public fromISO(isoString: string): DateTime {
    return DateTime.fromISO(isoString).toUTC().setLocale('pt-BR');
  }

  // Add other methods as needed, ensuring each uses the 'pt-BR' locale
}