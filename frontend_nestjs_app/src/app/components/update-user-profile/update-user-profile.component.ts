import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {MatProgressBarModule} from '@angular/material/progress-bar'; 
import { IUser } from 'app/interfaces/user';
import { AuthenticationService } from 'app/services/auth/authentication.service';
import { UsersService } from 'app/services/users/users.service';
import { EMPTY, catchError, map, of, switchMap, tap } from 'rxjs';
import { environment } from 'environments/environment';
import { FileUpload } from 'app/interfaces/file-upload';
import { HttpErrorResponse, HttpEventType } from '@angular/common/http';

const BASE_URL = `${environment.API_URL}`;

@Component({
  selector: 'app-update-user-profile',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, ReactiveFormsModule, MatCardModule, MatInputModule, MatButtonModule,
  MatProgressBarModule, MatIconModule],
  template: `
    <form [formGroup]="updateProfileForm" (ngSubmit)="updateProfile()">
      <mat-card class="container">
        <div class="container" style="width: 80%;">
          <mat-card>
            <mat-card-content>
            @if(updateProfileForm.get('profileImage')?.value) {
              <img src="{{ baseUrl }}/api/users/profile-image/{{ updateProfileForm.get('profileImage')?.value }}" alt="avatar">
            } @else {
              <img src="assets/images/avatar-default.png" class="avatar" alt="an avatar image for profile"> 
            }
            <ul>
            <li>
              <mat-progress-bar [value]="file.progress"></mat-progress-bar>
            </li>
          </ul>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button color="primary" (click)="onClickFile()">
              <mat-icon>cloud_upload</mat-icon>
            </button>
            <input type="file" #fileUpload name="fileUpload" id="fileUpload" accept="image/*" style="display:none">
          </mat-card-actions>
          </mat-card>
            <input matInput placeholder="id" formControlName="id" hidden>
          <mat-form-field>
            <input matInput placeholder="name" formControlName="name" data-test-id="nameField">
          </mat-form-field>
          <mat-form-field>
            <input matInput placeholder="email" formControlName="email">
          </mat-form-field>
          <button mat-flat-button color="primary" [disabled]="!updateProfileForm.valid" type="submit" data-test-id="submitButton">
          Actualizar
          </button>
        </div>
      </mat-card>
    </form>
  `,
  styles: `
    .container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .card {
      width: 80%;
      max-width: 80%;
      height: 300px;
      margin-top: 2%;
      margin-left: 10%;
    }

    mat-form-field {
      width: 100%;
      margin-top: 10px;
    }

    img {
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 5px;
      width: 150px;
    }
  `,
})
export class UpdateUserProfileComponent implements OnInit {
  updateProfileForm!: FormGroup;
  @ViewChild('fileUpload', { static: false })
  fileUpload!: ElementRef;

  file: FileUpload = {
    data: null,
    inProgress: false,
    progress: 0,
  };

  protected baseUrl: string = BASE_URL;
  
  userId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private userService: UsersService,
  ) {}

  ngOnInit(): void {
    this.updateForm();
    // uso getUserId() hasta que se arregle el tema de userId$
    this.authService.userId$.pipe(
      switchMap((userId: number | null ) => {
        if (userId !== null) {
          return this.userService.findOne(userId).pipe(
            tap((user: IUser) => {
              this.userId = userId;
              this.updateProfileForm.patchValue({
                id: user.id,
                email: user.email,
                name: user.name,
                profileImage: user.profileImage,
              });
            })
          );  
        }else {
          // Manejar el caso cuando UserId es null, por ejemplo, podrías retornar un Observable vacío.
          return EMPTY;
        }
      })
    ).subscribe();
  }

  updateForm() {
    this.updateProfileForm = this.fb.group({
      id: [{value: null, disabled: true}, [Validators.required]],
      email: [{value: null, disabled: true}, [Validators.required]],
      name: [{value: null}, [Validators.required]],
      role: [{value: null, disabled: true}, [Validators.required]],
      profileImage: [{value: null, disabled: true}],
    });
  }

  updateProfile() {
    this.userService
    .updateOne(this.updateProfileForm.getRawValue())
    .pipe(tap((user: IUser) => console.log('### User updated: ', user)))
    .subscribe();
  }

  onClickFile() {
    const fileInput = this.fileUpload.nativeElement;
    fileInput.click();
    fileInput.onchange = () => {
      this.file = {
        data: fileInput.files[0],
        inProgress: false,
        progress: 0,
      };
      this.fileUpload.nativeElement.value = '';
      this.uploadFile();
    }
  }

  uploadFile() {
    const formData = new FormData;
    formData.append('file', this.file.data);
    this.file.inProgress = true;
    // hacemos la subida
    this.userService.uploadProfileImage(formData).pipe(
      map((event) => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            this.file.progress = Math.round((event.loaded * 100) / event.total,);
            break;
            case HttpEventType.Response:
              return event;
        }
      }),
      catchError((error: HttpErrorResponse) => {
        this.file.inProgress = false;
        return of('upload Failed');
      }),
    ).subscribe((event: any) => {
      if (typeof event === 'object') {
        this.updateProfileForm.patchValue({
          profileImage: event.body.prkofileImage,
        });    
      }
    });

  }
}
