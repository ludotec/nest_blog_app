import { Component, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import  {  AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule,  ReactiveFormsModule, ValidationErrors, Validators  }  from  '@angular/forms';
import { AuthenticationService } from 'app/services/authentication.service';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatFormFieldModule, MatButtonModule, MatIconModule, MatInputModule, ReactiveFormsModule, FormsModule],
  template: `
  <h1>Login de usuario</h1>
  <form [formGroup]="loginForm" (ngSubmit)="onSubmit(loginForm)">
  <div class="container">
    <mat-form-field>
      <input type="text" matInput formControlName="email" placeholder="Enter your email" data-test-id="emailField">
      @if(emailField?.invalid) {
        <mat-error>
          Ingrese un correo válido.
        </mat-error>
      }
    </mat-form-field>
    <mat-form-field>
      <input [type]="hide ? 'password' : 'text'" matInput formControlName="password" placeholder="Enter your password" data-test-id="passwordField">
      <mat-icon matSuffix (click)="hide = !hide">{{hide ? 'visibility_off' : 'visibility'}}</mat-icon>
      @if(emailField?.invalid) {
        <mat-error>
          Ingrese una contraseña válida (mínimo 8 caracteres).
        </mat-error>
      }
    </mat-form-field>
    <div>
      <button mat-flat-button color="primary" type="submit" [disabled]="!loginForm.valid" data-test-id="submitButton">
      Ingresar

      </button>
    </div>
  </div>

  </form>
  ` ,
  styles: `
  h1 {
    text-align: center; 
  }
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .container > * {
    width: 90%;
  }
  .container input {
    width: 100%;
    padding-top: 5px;
    padding-bottom: 5px;
  }
  .container button {
    width: 100%;
  }
  @media screen and (min-width: 600px) {
    .container > * {
      width: 50%;
    }
  }
  @media screen and (min-width: 1024px) {
    .container > * {
      width: 30%;
    }
  }
  `
})
export class LoginComponent implements OnInit {
  hide = true;
  loginForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private router: Router
    ) {}

  ngOnInit(): void {
    this.createLoginForm();
  }

  createLoginForm() {
    this.loginForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(8), Validators.maxLength(50)]],
    })
  }

  get emailField() {
    return this.loginForm.get("email");
  }
  get passwordField() {
    return this.loginForm.get("password");
  }

  onSubmit(loginForm: FormGroup) {
    console.log('### form values', this.loginForm.value);
    if(this.loginForm.invalid) {
      return;
    }
    this.authService.login(this.loginForm.value).pipe(
      map(token => this.router.navigate(['/']))).subscribe();
    
  }

}
