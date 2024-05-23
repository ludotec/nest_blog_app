import { Component, OnInit } from '@angular/core';
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
import { AuthenticationService, JWT_NAME } from './services/auth/authentication.service';
import { UserNavigationEntries } from './core/interfaces/user-navigation-entries';
import { map } from 'rxjs';


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
    @if(userIsAdmin()) {
      <button mat-flat-button class="link-button" routerLink="users" aria-label="Example button admin">
      Users
      </button>
      <button mat-flat-button class="link-button" style="margin-left: 10px;" routerLink="admin" aria-label="Example button users">
      Admin
      </button>
    }
    <mat-form-field name="loginRegisterDropdown" style="margin-left: 16px; margin-top: 16px;">
      <mat-select placeholder="Acceso" (selectionChange)="navigateTo($event.value)">
      @for(entry of userNavigationEntries; track entry.name) {
        <mat-option  [value]="entry.link">
        {{ entry.name }}
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
export class AppComponent implements OnInit {
  title = 'frontend_nestjs_app';
  isLogged= false;
  private userId: number | null = null;

  userNavigationEntries: UserNavigationEntries[] = [
    {
      name: 'login',
      link: 'login',
    },
    {
      name: 'register',
      link: 'register',
    }
  ];

  constructor(
    private router: Router,
    private authService: AuthenticationService) {
    console.log('environment Control: ', environment.CONTROL);
    console.log('environment API_URL: ', environment.API_URL);
  }

  ngOnInit(): void {
    this.authService.userId$.pipe(
      map((userId: number | null) => {
        this.userId = userId;
        this.updateUserId(userId);
      }),
    ).subscribe();
    this.authService.isLogged$.subscribe((isLogged) => {
      this.updateUserNavigationEntries(isLogged);
      this.updateUserAuthentication(isLogged);
    });
  }

  private updateUserNavigationEntries(isLogged: boolean) {
    if (isLogged) {
      this.userNavigationEntries = [
        {
          name: 'Logout',
          link: 'logout',
          description: 'this will log you out of the aplication',
        },
        {
          name: 'Profile',
          link: `users/${this.userId}`,
        },
        {
          name: 'Update Profile',
          link: 'update-profile',
        }
      ];
    }else {
      this.userNavigationEntries = [
        {
          name: 'Login',
          link: 'login',
          description: 'this will login you in to of the aplication',
        },
        {
          name: 'Register',
          link: 'register',
        },
      ];
    }
  }

  private updateUserAuthentication(isLogged: boolean) {
    if (!isLogged) {
      this.isLogged = false;
      this.clearUserData();
      this.router.navigate(['/login']);
    }else {
      this.isLogged = true;
    }
  }

  private clearUserData() {
    this.updateUserId(null);
  }

  private updateUserId(userId: number | null) {
    if (this.authService.isAuthenticated()) {
      const profileEntry = this.userNavigationEntries.find(
        (entry) => entry.name === 'Profile',
      );
      if (profileEntry) {
        profileEntry.link = userId ? `users/${userId}` : ``;
      }
    }
  }

  userIsAdmin(): boolean {
    console.log('### User is Admin? : ',this.authService.userIsAdmin() )
    return this.authService.userIsAdmin();
  }

  navigateTo(value: string) {
    if (value !== 'logout') {
      this.router.navigate([value]) ;
    }else {
      this.authService.logout();
    }
  }

}
