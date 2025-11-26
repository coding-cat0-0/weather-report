import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
isSliding = false

constructor(private router : Router){}
    startSlide() {
    this.isSliding = true;

    // Wait for animation to complete, then navigate
    setTimeout(() => {
      this.router.navigate(['/signin']);
    }, 700); // matches CSS animation time
  }

}
