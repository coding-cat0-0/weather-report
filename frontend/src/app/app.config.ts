import { ApplicationConfig, ViewEncapsulation } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AuthInterceptor } from './interceptors/authInterceptors';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideAnimations(),
   { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: ViewEncapsulation, useValue: ViewEncapsulation.None }, provideAnimationsAsync()
  ]
};
