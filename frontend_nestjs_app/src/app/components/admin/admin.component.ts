import { Component } from '@angular/core';

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
  selector: 'app-admin',
  standalone: true,
  imports: [MatButtonModule,
   MatCardModule, MatFormFieldModule,
   MatIconModule, MatInputModule, MatPaginatorModule,
   MatSelectModule, MatTableModule, MatToolbarModule,],
  template: `
    <p>
      overview works!
    </p>
  `,
  styles: ``
})
export class AdminComponent {

}
