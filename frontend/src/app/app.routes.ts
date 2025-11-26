import { Routes } from '@angular/router';
import { SignupComponent } from './signup/signup.component';
import { SigninComponent } from './signin/signin.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
    {path: '', redirectTo:'/home', pathMatch:'full' },
    {path:'home', component:HomeComponent},
    {path:'signin', component:SigninComponent},
    {path:'signup', component:SignupComponent}
];
