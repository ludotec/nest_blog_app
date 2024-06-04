import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute } from '@angular/router';
import { IUser } from 'app/interfaces/user';
import { UsersService } from 'app/services/users/users.service';
import { environment } from 'environments/environment';
import { Subscription, map } from 'rxjs';

const BASE_URL = `${environment.API_URL}`;

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [MatCardModule],
  template: `
    @if(user){
      <div class="main-div">
        <mat-card class="card">
          <mat-card-header>
            <mat-card-title-group>
              <mat-card-title data-test-id="nameField">
                Name: {{ user.name }} | id: {{ user.id }}
              </mat-card-title>
              <mat-card-subtitle>
                {{ user.role }}
              </mat-card-subtitle>
              <div mat-card-avatar>
                @if(user.profileImage) {
                  <img src="{{ baseUrl }}/api/users/profile-image/{{ user.profileImage }}" alt="avatar" class="avatar"> 
                }@else {
                  <img src="assets/images/avatar-default.png" class="avatar" alt="an avatar image for profile"> 
                }
              </div>
            </mat-card-title-group>
          </mat-card-header>
        </mat-card>
      </div>
    }
  `,
  styles: `
    .avatar {
      width: 50px;
      height: 50px;
      position: relative;
      right: 50px !important;
    }
  `
})
export class UserProfileComponent implements OnInit, OnDestroy {
  userId?: number;
  private subscription!: Subscription;
  protected baseUrl: string = BASE_URL;

  user?: IUser;

  constructor(
    private userService: UsersService,
    private activatedRoute: ActivatedRoute) {}

    ngOnInit(): void {
      this.subscription = this.activatedRoute.params.subscribe(
        (params) => {
          this.userId = parseInt(params['id']);
          this.userService.findOne(this.userId).pipe(
            map((user: IUser) => (this.user = user))
          ).subscribe();
        }
      );
    }

    ngOnDestroy(): void {
      this.subscription.unsubscribe()
    }
}
