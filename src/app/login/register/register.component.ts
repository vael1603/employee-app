import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { LoginService } from '../login.service';
import { UtilsService } from '../../utils/utils.service';
import { HttpUserRes } from '../models/HttpUserRes';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [MatInputModule, MatButtonModule, ReactiveFormsModule, MatFormFieldModule, CommonModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  registerForm;

  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private utils: UtilsService,
    private router: Router
  ) {

    this.registerForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      group: ['', [Validators.required]],
    });
  }

  onSubmit = () => {

    // if there is no error we call to the api
    if(this.registerForm.valid) {

      const form = this.registerForm.controls;
  
      const user = {
        name: form.name.value ?? '',
        lastname: form.lastname.value ?? '',
        email: form.email.value ?? '',
        password: form.password.value ?? '',
        group: form.group.value ?? ''
      }
  
      this.loginService.createUser(user).subscribe({
        next: (res: HttpUserRes) => {
          this.utils.openDialog('info', res.message);
          this.router.navigate(['/login'])
        },
        error: (e) => {
          this.utils.openDialog('error', e.error.message);
        }
      })
    }
  }
}
