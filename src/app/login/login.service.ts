import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpUserRes } from './models/HttpUserRes';
import { Login } from './models/Login';
import { HttpClient } from '@angular/common/http';
import { User } from './models/User';
import { Router } from '@angular/router';
import { UtilsService } from '../utils/utils.service';

@Injectable({
  providedIn: 'root',
})
export class LoginService {

  apiURL = `${environment.apiURL}/api`
  user: User | undefined;

  constructor(private http: HttpClient, private router: Router, private utils: UtilsService) {
    const user = localStorage.getItem('user')
    if(user){
      this.user = !this.user ? JSON.parse(user) : this.user
    }
  }

  public login(body: Login): Observable<HttpUserRes> {
    return this.http.post<HttpUserRes>(`${this.apiURL}/login`, body)
  }

  public logout(): void {
    this.user = undefined;
    localStorage.setItem('user', '');
    localStorage.setItem('token', '');
  
    this.http.post<HttpUserRes>(`${this.apiURL}/logout`, null).subscribe({
      next: (res) => {
        this.utils.openDialog('info', res.message)
        this.router.navigate(['/login'])
      },
      error: (e) =>{
        this.utils.openDialog('error', e.error.message)
        this.router.navigate(['/login'])
      }
    })
  }

  public saveToken(user: User) {
    this.user = user;
    localStorage.setItem('user', JSON.stringify(this.user));
    localStorage.setItem('token', user.token);
  }

  public sendRecoverEmail(body: any) {
    return this.http.post<HttpUserRes>(`${this.apiURL}/recoverPassword`, body)
  }

  public updatePassword(body: any, token: string) {
    return this.http.post<HttpUserRes>(`${this.apiURL}/updatePassword/${token}`, body)
  }
}
