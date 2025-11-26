import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SignupComponent } from './signup/signup.component';
import { SigninComponent } from './signin/signin.component';
import { HomeComponent } from './home/home.component';
import { Router, NavigationEnd } from '@angular/router';
import { Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SigninComponent, SignupComponent, HomeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor(
    private router: Router,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ){
this.router.events.subscribe((event) => {
  if (event instanceof NavigationEnd) {
    const isHome = event.urlAfterRedirects === '' || event.urlAfterRedirects === '/home';
    const bg = document.querySelector('.background-image');
    const glassOverlay = document.querySelector('.glass-overlay');
    if (bg && glassOverlay) {
      if (isHome) {
        this.renderer.removeClass(bg,'bg-blur');
        this.renderer.addClass(glassOverlay,'hidden');
      } else{
        this.renderer.addClass(bg,'bg-blur');
        this.renderer.removeClass(glassOverlay,'hidden');
      }
    }
  }
});
}
}
