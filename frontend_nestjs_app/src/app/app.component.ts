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
    <span>My App</span>
    <span class="example-spacer"></span>
    <button mat-icon-button class="example-icon" aria-label="Example icon-button with menu icon">
      <mat-icon>menu</mat-icon>
    </button>
  </mat-toolbar-row>

  <mat-toolbar-row>
    <span>Second Line</span>
    <span class="example-spacer"></span>
    <button mat-icon-button class="example-icon favorite-icon" aria-label="Example icon-button with heart icon">
      <mat-icon>favorite</mat-icon>
    </button>
    <button mat-icon-button class="example-icon" aria-label="Example icon-button with share icon">
      <mat-icon>share</mat-icon>
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
