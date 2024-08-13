import { CanActivateFn } from '@angular/router';
import * as Jwt from 'jwt-decode';
import { LoginService } from '../login/login.service';
import { inject } from '@angular/core';

export const authenticationGuard: CanActivateFn = (route, state) => {
  const token = localStorage.getItem('token');
  const loginService = inject(LoginService);

  if(token) { // check if token exists
    let authorize = true;
    let res:any
    try {
      res = Jwt.jwtDecode(token) // decodes the token, to validates if is a real token
    } catch (error) {
      loginService.logout();
      return false
    }

    if(loginService.user) { // then it compares the decoded data with the user data
      Object.keys(res.data).forEach( (key) => {
        
        if(loginService.user![key] !== res.data[key]) {
          // If there is any diference logouts the user and it redirects the user to the login
          authorize = false; 
          loginService.logout();
          }
      })
    }

    return authorize;

  } else {
    return false
  }
};
