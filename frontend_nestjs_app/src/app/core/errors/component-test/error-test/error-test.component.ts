import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-error-test',
  standalone: true,
  imports: [],
  template: `
    <div style="margin: 40px">
      <button (click)="throwError()">Error</button>
      <button (click)="throwHttpError()">HTTP</button>
    </div>
  `,
  styles: ``
})
export class ErrorTestComponent {

  constructor(private  http: HttpClient) {}

  throwError() {
    throw new Error('My Pretty Error');
  }

  throwHttpError() {
    this.http.get('urlHere').subscribe();
  }

}
