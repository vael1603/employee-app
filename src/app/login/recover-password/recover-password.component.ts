import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { LoginService } from '../login.service';
import { UtilsService } from '../../utils/utils.service';
import { HttpUserRes } from '../models/HttpUserRes';
import * as Jwt from 'jwt-decode';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-recover-password',
  standalone: true,
  imports: [MatInputModule, MatButtonModule, ReactiveFormsModule, MatFormFieldModule, CommonModule, RouterModule],
  templateUrl: './recover-password.component.html',
  styleUrl: './recover-password.component.scss'
})
export class RecoverPasswordComponent {

  recoverForm;
  updaterForm;
  showUpdaterForm = false;

  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private utils: UtilsService,
    private router: Router
  ) {

    this.recoverForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.updaterForm = this.formBuilder.group({
      token: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]]
    }, {
      validator: this.updaterFormValidator(),
    });
  }

  updaterFormValidator = () => {
    return (formGroup: FormGroup) => {

      const passwordControl = formGroup.controls['password'];
      const confirmPasswordControl = formGroup.controls['confirmPassword'];
      const tokenControl = formGroup.controls['token'];
      let decoded: any;

      // if the passwords arent equal returns an error
      if (passwordControl.value !== confirmPasswordControl.value) {
          confirmPasswordControl.setErrors({ passwordMismatch: true });
      }
      
      try {
        decoded = Jwt.jwtDecode(tokenControl.value) // decodes the token, to validates if is a real token
      } catch (error) {
        tokenControl.setErrors({invalidToken: true})
      }

      if(this.loginService.user && decoded) { // then it compares the decoded data with the user data
        if(this.loginService.user.id !== decoded.data._id) {
          // If there is any diference set the property invalidToken
          tokenControl.setErrors({invalidToken: true})
          }
      }

      return null;
  };
  }

  onSubmitRecover = () => {
    // if there is no error we call to the api
    if(this.recoverForm.valid) {

      const body = {
        email: this.recoverForm.controls.email.value ?? ''
      }

      this.loginService.sendRecoverEmail(body).subscribe({
        next: (res: HttpUserRes) => {
          this.utils.openDialog('info', res.message)
          this.showUpdaterForm = true;
        },
        error: (e) => {
          this.utils.openDialog('error', e.error.message)
        }
      });
    }
  }

  onSubmitUpdater = () => {
    if(this.updaterForm.valid){
      const passwordControl = this.updaterForm.controls['password'];
      const confirmPasswordControl = this.updaterForm.controls['confirmPassword'];
      const tokenControl = this.updaterForm.controls['token'];

      let body = {
        password: passwordControl.value,
        confirmPassword: confirmPasswordControl.value,
      }
      this.loginService.updatePassword(body, tokenControl.value).subscribe({
        next: (res: HttpUserRes) => {
          this.utils.openDialog('info', res.message)
          this.router.navigate(['/login'])
        },
        error: (e) => {
          this.utils.openDialog('error', e.error.message)
        }
      })
    }
  }
}
