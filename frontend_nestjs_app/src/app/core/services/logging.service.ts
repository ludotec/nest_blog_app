import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggingService {

  constructor() { }

  logError(message: string) {
    // Send errors to server here
    console.log('LogginService: ' + message);
  }
}
