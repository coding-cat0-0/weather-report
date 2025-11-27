import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatSnackBar,MatSnackBarModule } from '@angular/material/snack-bar';
@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, HttpClientModule, MatSnackBarModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
name='';
email='';
password='';

constructor(private http: HttpClient, private router: Router, private snackBar : MatSnackBar){}
OnPopup(message:string){
  this.snackBar.open(message,'Close',{
    duration:3000,
    horizontalPosition:'center',
    verticalPosition:'top',
    panelClass:['snackbar']
  });
}
onSubmit(){
    const emailRegex = /\w+@(\w+\.)?\w+\.(com)$/i;
  const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%&*^_-])[A-Za-z\d!@#$%^&_*-]{8,}$/;
  if(!this.name || !this.email || !this.password){
    this.OnPopup('All fields are required!');
  }
  if(!emailRegex.test(this.email)||!passwordRegex.test(this.password)){
    this.OnPopup('Invalid email or password format!');
  }
  this.http.post('http://localhost:9000/signup',{
    name:this.name,
    email:this.email,
    password:this.password
  }).subscribe({
    next:(response:any)=>{
      this.OnPopup('Signup successful!');
      this.router.navigate(['/signin']);}
    ,
    error: (error) => {
      console.log('Error response:', error.error); 
      this.OnPopup(error.error.detail);
      }
    }
  );
}
}




