import { Routes } from '@angular/router';
import { SignupComponent } from './signup/signup.component';
import { SigninComponent } from './signin/signin.component';
import { HomeComponent } from './home/home.component';
import { WeatherReportComponent } from './weather-report/weather-report.component';
import { WeatherAlertsComponent } from './weather-alerts/weather-alerts.component';
import { ChatboxComponent } from './chatbox/chatbox.component';
import { DisasterAlertsComponent } from './disaster-alerts/disaster-alerts.component';

export const routes: Routes = [
    {path: '', redirectTo:'/home', pathMatch:'full' },
    {path:'home', component:HomeComponent},
    {path:'signin', component:SigninComponent},
    {path:'signup', component:SignupComponent},
    {path:'disaster-alerts', component: DisasterAlertsComponent},
    {path:'weather-alert', component: WeatherAlertsComponent},
    {path:'chatbox', component: ChatboxComponent},    
    {path:'weather_report', component: WeatherReportComponent}
];
