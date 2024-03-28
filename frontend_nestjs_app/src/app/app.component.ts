import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

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


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatIconModule, MatToolbarModule],
  template: `<mat-toolbar color="primary">
  <mat-toolbar-row>
  <button mat-icon-button class="example-icon" aria-label="Example icon-button with menu icon">
      <mat-icon>menu</mat-icon>
    </button>
    <span>Blog Status Code 666</span>
    <span class="example-spacer"></span>
    <button mat-flat-button class="link-button" routerLink="/users" aria-label="Example icon-button with heart icon">
      Users
    </button>
    <button mat-flat-button class="link-button" routerLink="/admin" aria-label="Example icon-button with share icon">
      Admin
    </button>
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
}
