import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SignupComponent } from './signup/signup.component';
import { SigninComponent } from './signin/signin.component';
import { HomeComponent } from './home/home.component';
import { Router, NavigationEnd } from '@angular/router';
import { Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { AfterViewInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SigninComponent, SignupComponent, HomeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements AfterViewInit {
  constructor(
    private router: Router,
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document
  ) { }
  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const bg = this.document.querySelector('.background-image');
    const glassOverlay = this.document.querySelector('.glass-overlay');

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const isHome = event.urlAfterRedirects === '/' || event.urlAfterRedirects === '/home';

        if (bg && glassOverlay) {
          if (isHome) {
            this.renderer.removeClass(bg, 'bg-blur');
            this.renderer.addClass(glassOverlay, 'hidden');
            this.renderer.setStyle(this.document.body, 'font-weight', '800');
          } else {
            this.renderer.addClass(bg, 'bg-blur');
            this.renderer.removeClass(glassOverlay, 'hidden');
            this.renderer.setStyle(this.document.body, 'font-weight', '600');
          }
        }
      }
    });
  }
}