import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { authenticationGuard } from './security/authentication.guard';
import { RecoverPasswordComponent } from './login/recover-password/recover-password.component';
import { RegisterComponent } from './login/register/register.component';

export const routes: Routes = [
    {path: 'login', component: LoginComponent},
    {path: 'password/recover', component: RecoverPasswordComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'dashboard', component: DashboardComponent, canActivate: [authenticationGuard]},
    {path: '**', redirectTo: '/login', pathMatch: 'full' },
];
