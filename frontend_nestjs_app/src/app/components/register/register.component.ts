import  {  AbstractControl, FormControl, FormsModule,  ReactiveFormsModule, ValidationErrors  }  from  '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'app/services/authentication.service';
import { UsersService } from 'app/services/users.service';
import { map } from 'rxjs/operators';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Observable, from } from 'rxjs';

class CustomValidators {
  static passwordsMatch(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if(password == confirmPassword) {
      return null;
    }else {
      return {passwordsMatching: true};
    }
  }
}


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  template: `
  <h1>Registro de usuario</h1>
  <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
    <div class="container">
      <mat-form-field>
        <input matInput formControlName="name" placeholder="Your name" data-test-id="nameField">
        @if(nameField?.invalid && nameField?.touched) {
        <mat-error>
          Por favor provea un nombre válido (entre 3 y 20 caracteres)
        </mat-error>
        }
      </mat-form-field>
      <mat-form-field>
        <input matInput formControlName="email" placeholder="youremail@example.com" (change)="onChange($event)" data-test-id="emailField">
        @if(emailField?.hasError('email')) {
        <mat-error>
          Por favor ingrese email válido.
        </mat-error>
        }
        @if(emailField?.hasError('required')) {
        <mat-error>
          El email es requerido.
        </mat-error>
        }
        @if(emailField?.hasError('emailIsUsed')) {
        <mat-error  data-test-id="EmailIsUded">
          Este email ya está en uso.
        </mat-error>
        }
      </mat-form-field>
      <mat-form-field>
        <input matInput formControlName="password" [type]="hidePassword ? 'password' : 'text'" placeholder="password"  data-test-id="passwordField">
        <mat-icon matSuffix (click)="hidePassword = !hidePassword">{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
        @if(passwordField?.invalid && passwordField?.touched) {
        <mat-error>
          Contraseña requerida (mínimo 8 caracteres). 
        </mat-error>
        }
      </mat-form-field>
      <mat-form-field>
        <input matInput formControlName="confirmPassword" [type]="hideConfirmPassword ? 'password' : 'text'" placeholder="repeat password" data-test-id="confirmPasswordField">  
        <mat-icon matSuffix (click)="hideConfirmPassword = !hideConfirmPassword">{{hideConfirmPassword ? 'visibility_off' : 'visibility'}}</mat-icon>
        @if(confirmPasswordField?.invalid && confirmPasswordField?.touched) {
        <mat-error>
        Contraseña no válida (mínimo 8 caracteres).
        </mat-error>
        }
        @if(registerForm.hasError('passwordsMatching') && (passwordField?.valid && confirmPasswordField?.valid)) {
          <mat-hint>
            Las contraseñas deben ser iguales.
          </mat-hint>
        }
      </mat-form-field>
      <div>
        <button mat-flat-button color="primary" type="submit" [disabled]="!registerForm.valid" data-test-id="submitButton">
        Enviar
        </button>
      </div>
    </div>
  </form>
  `,
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


export class RegisterComponent implements OnInit {
  hidePassword = true;
  hideConfirmPassword = true;
  registerForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private userService: UsersService,
    private router: Router
  ) {
    
  }
  
  ngOnInit(): void {
    this.createRegisterForm();
  }
  

  createRegisterForm() {
    this.registerForm = this.fb.group({
      name: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      email: [null, [Validators.required, Validators.email], [this.userExist.bind(this)],],
      password: [null, [Validators.required, Validators.minLength(8), Validators.maxLength(50)]],
      confirmPassword: [null, [Validators.required, Validators.minLength(8), Validators.maxLength(50)]]
    },
    {
      validators: CustomValidators.passwordsMatch
    });
  }  


  onSubmit() {
    if (this.registerForm.invalid) {
      return;
    }

    this.authService.register(this.registerForm.value).pipe(
      map(() => this.router.navigate(['login'])) 
    ).subscribe();
    // TODO: Use EventEmitter with form value
    console.warn(this.registerForm.value);
  }

  onChange($event: any) {
    if (this.emailField) {
      this.emailField.updateValueAndValidity();
    }
  }

  userExist(control: FormControl): Observable<ValidationErrors | null> {
    return from(this.userService.userExists(control.value)).pipe(
      map((userExist) => {
        if (userExist) {
          return { emailIsUsed: true };
        }else {
          return null;
        }
      })
    );
  }

  get nameField() {
    return this.registerForm.get("name");
  }
  get emailField() {
    return this.registerForm.get("email");
  }
  get passwordField() {
    return this.registerForm.get("password");
  }
  get confirmPasswordField() {
    return this.registerForm.get("confirmPassword");
  }
}
