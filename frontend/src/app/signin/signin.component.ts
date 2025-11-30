import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from "../services/auth_service";

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [FormsModule,HttpClientModule, MatSnackBarModule,],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css'
})
export class SigninComponent {
email = '';
password = '';

constructor(private snackBar: MatSnackBar, private http : HttpClient,
private router: Router,  private authService : AuthService) {}

  openPopup(message: string) {  
     console.log("POPUP TRIGGERED:", message);
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: 'neon-snackbar'
    });
  }

onSubmit() {
  const emailRegex = /\w+@(\w+\.)?\w+\.(com)$/i;
  const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%&*^_-])[A-Za-z\d!@#$%^&_*-]{8,}$/;

  if(!this.email || !this.password){
    return this.openPopup('Please fill in all fields.');
  }

  if(!emailRegex.test(this.email)){
    return this.openPopup('Please enter a valid email address.');

  }
  if(!passwordRegex.test(this.password)){
    return this.openPopup('Password must be at least 8 characters long and include one small and one special character.');

  }
  this.http.post('http://localhost:8000/signin',{
  
    email : this.email,
    password : this.password
    }).subscribe({
     next : (response: any) => {
      const token = response.access_token;
       if(token){

        this.authService.setToken(token);
        console.log("Token saved", token)
        this.openPopup(response.message);
        this.router.navigate(['/weather_report']);

       } else{
        console.warn('No token generated');
       }
     },

      error : (error) => {
        console.log('Error response:', error.error);
        this.openPopup(error.error.detail);
      }
    })
  }
onClick(){
    this.router.navigate(['/signup']);
}  
}
