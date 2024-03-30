import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';


// Materials
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { environment } from 'environments/environment';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatIconModule, MatToolbarModule, RouterLink, MatFormFieldModule,
  MatSelectModule],
  template: `<mat-toolbar color="primary">
  <mat-toolbar-row>
  <button mat-icon-button class="example-icon" aria-label="Example icon-button with menu icon">
      <mat-icon>menu</mat-icon>
    </button>
    <span>Blog Status Code 666</span>
    <span class="example-spacer"></span>
    <button mat-flat-button class="link-button" routerLink="users" aria-label="Example button admin">
      Users
    </button>
    <button mat-flat-button class="link-button" style="margin-left: 10px;" routerLink="admin" aria-label="Example button users">
      Admin
    </button>
    <mat-form-field name="loginRegisterDropdown" style="margin-left: 16px; margin-top: 16px;">
      <mat-select placeholder="Acceso" (selectionChange)="navigateTo($event.value)">
      @for(entry of entries; track entry.title) {
        <mat-option  [value]="entry.link">
        {{ entry.title }}
        </mat-option> 
        }
      </mat-select>
    </mat-form-field>
  </mat-toolbar-row>
</mat-toolbar>
<router-outlet />
`,
  styles: `
  .example-spacer {
  flex: 1 1 auto;
}
  `
})
export class AppComponent {
  title = 'frontend_nestjs_app';

  entries= [
    {
      title: 'Register',
      decription: 'Register a new user',
      link: 'register'
    },
    {
      title: 'Login',
      decription: 'Login as a user',
      link: 'login'
    }
  ];

  constructor(private router: Router) {
    console.log('environment Control: ', environment.CONTROL);
    console.log('environment API_URL: ', environment.API_URL);
  }

  navigateTo(value: string) {
    this.router.navigate(['../', value]) 
  }
}
