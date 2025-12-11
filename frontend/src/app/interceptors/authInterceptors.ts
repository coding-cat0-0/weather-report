import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth_service';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const token = authService.getToken();
  
    console.log("Interceptor running...");
    console.log("Token from storage:", token);
  
    if (token) {
      console.log("Adding Authorization header");
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    } else {
      console.warn("NO TOKEN FOUND, request sent without auth header");
    }
  
    return next(req);
  };
  