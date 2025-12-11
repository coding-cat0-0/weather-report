import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-weather-alerts',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './weather-alerts.component.html',
  styleUrl: './weather-alerts.component.css'
})
export class WeatherAlertsComponent {
weatherApi = 'http://localhost:9000/weather_report';
latitude=0.0;
longitude=0.0;
report:any[]=[];
summary:string='';
expanded:boolean=false;
constructor(private http:HttpClient){}
  getReport() {
    const url = `${this.weatherApi}?lat=${this.latitude}&long=${this.longitude}`;

    this.http.get(url).subscribe({
      next: (res: any) => {
        this.report = res["Weather Report"] || [];
        this.summary = res["Summary"] || "";
        this.expanded = !this.expanded;
        console.log("Weather API Response:", res);
      },
      error: (err) => {
        console.error("Error: ", err);
      }
    });
  }
}
