import { Router } from '@angular/router';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    constructor(@Inject(PLATFORM_ID) private platformId: Object, private router: Router){}
    private ACCESS_TOKEN = 'token';

    setToken(token: string){
        if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem(this.ACCESS_TOKEN, token);
        }
}

    getToken(): string | null {
        if (isPlatformBrowser(this.platformId)) {
            return localStorage.getItem(this.ACCESS_TOKEN);
        }
        return null;
    }
    removeToken(){
        if (isPlatformBrowser(this.platformId)) {
            localStorage.removeItem(this.ACCESS_TOKEN);
        }
    }

    isLoggedIn(): boolean{
        return !!this.getToken();
    }
    logout(){
        this.removeToken();
        this.router.navigate(['/signin']);
    }
}