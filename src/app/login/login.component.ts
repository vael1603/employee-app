import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { LoginService } from './login.service';
import { Login } from './models/Login';
import { provideHttpClient } from '@angular/common/http';
import { HttpUserRes } from './models/HttpUserRes';
import { UtilsService } from '../utils/utils.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatInputModule, MatButtonModule, ReactiveFormsModule, MatFormFieldModule, CommonModule, RouterModule],
  providers: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  loginForm;

  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private utils: UtilsService,
    private router: Router
  ) {

    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  onSubmit = () => {

    // if there is no error we call to the api
    if(this.loginForm.valid) {

      const body:Login = {
        email: this.loginForm.controls.email.value ?? '',
        password: this.loginForm.controls.password.value ?? ''
      }

        this.loginService.login(body).subscribe({
          next: (res: HttpUserRes) => {
            this.loginService.saveToken(res.data);
          },
          complete: () => {
            this.router.navigate(['/dashboard'])
          },
          error: (e) => {
            this.utils.openDialog('error', e.error.message)
          }
        }
      )
    }
  }
}
