import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms'
import { IUsersPaginated } from 'app/interfaces/user';
import { UsersService } from 'app/services/users.service';
import { map } from 'rxjs';

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
  selector: 'app-users',
  standalone: true,
  imports: [MatFormFieldModule, FormsModule, MatTableModule, MatPaginatorModule, MatInputModule],
  template: `
    <h1>Todos los usuarios</h1>

    <mat-form-field>
      <mat-label>Buscar por nombre</mat-label>
      <input type="text" matInput [(ngModel)]="filterValue" (input)="findByName(filterValue)"
      placeholder="Search name" data-test-id="searchNameField">
    </mat-form-field>

    @if(dataSource){
      <div>
        <mat-table [dataSource]="dataSource.items" class="mat-elevation-z8" data-test-id="usersTable">
        <!-- Id Column -->
          <ng-container matColumnDef="id">
            <mat-header-cell *matHeaderCellDef mat-sort-header>
               ID 
            </mat-header-cell>
            <mat-cell *matCellDef="let row">{{ row.id }}</mat-cell>
          </ng-container>
        <!-- Name Column -->
        <ng-container matColumnDef="name">
            <mat-header-cell *matHeaderCellDef mat-sort-header>
               Name
            </mat-header-cell>
            <mat-cell *matCellDef="let row">{{ row.name }}</mat-cell>
          </ng-container>
        <!-- Email Column -->
        <ng-container matColumnDef="email">
            <mat-header-cell *matHeaderCellDef mat-sort-header>
               Email
            </mat-header-cell>
            <mat-cell *matCellDef="let row">{{ row.email }}</mat-cell>
          </ng-container>
        <!-- Role Column -->
        <ng-container matColumnDef="role">
            <mat-header-cell *matHeaderCellDef mat-sort-header>
               Role
            </mat-header-cell>
            <mat-cell *matCellDef="let row">{{ row.role }}</mat-cell>
        </ng-container>

         <!-- definition structure table --> 
        <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
          <mat-row *matRowDef="let row, columns: displayedColumns" (click)="navigateToProfile(row.id)">
        </mat-row>
        </mat-table>
        <mat-paginator
          [length]="dataSource.meta.totalItems"
          [pageSize]="dataSource.meta.itemsPerPage"
          [pageSizeOptions]="pageSizeOptions"
          (page)="pageEvent = $event; onPaginateChange($event)"
          showFirstLastButtons
        ></mat-paginator>
      </div>
    }
    
    
  `,
  styles: ``
})
export class UsersComponent implements OnInit {
  //tabla
  dataSource?: IUsersPaginated;
  displayedColumns: string[] = ['id', 'name', 'email', 'role'];

  //paginator
  pageEvent?: PageEvent;
  pageSizeOptions = [5 , 10, 25, 100];

  //filtering
  filterValue: string = '';

  constructor(
    private userService: UsersService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
      this.initDataSource();
  }

  initDataSource() {
    this.userService.findAll().pipe(
      map((userPaginated: IUsersPaginated) => {
        this.dataSource = userPaginated;
        console.log('### DATA SOURCE: ', this.dataSource);
        return userPaginated;
      })
    ).subscribe();
  }

  onPaginateChange(event: PageEvent) {
    let page = event.pageIndex + 1;
    const size = event.pageSize;

    if(this.filterValue == null || this.filterValue == '') {
      this.userService.findAll(page, size).pipe(
        map((userPAginated: IUsersPaginated) => {
          this.dataSource = userPAginated;
          return userPAginated;      
        })
      ).subscribe();
    }else {
      this.userService.paginateByName(page, size, this.filterValue).pipe(
        map((userPAginated: IUsersPaginated) => {
          this.dataSource = userPAginated;
          return userPAginated;      
        })
      ).subscribe();
    }
  }

  navigateToProfile(id: number) {
    this.router.navigate(['/users' + id], { relativeTo: this.activatedRoute });
  }

  findByName(name: string) {
    this.userService
      .paginateByName(0, 10, name)
      .pipe(
        map(
          (usersPaginated: IUsersPaginated) =>
            (this.dataSource = usersPaginated),
        ),
      )
      .subscribe();
  }

}
