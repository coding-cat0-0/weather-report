import { Component } from '@angular/core';
import { DisasterAlertsComponent } from '../disaster-alerts/disaster-alerts.component';
import { ChatboxComponent } from '../chatbox/chatbox.component';
import { WeatherAlertsComponent } from '../weather-alerts/weather-alerts.component';

@Component({
  selector: 'app-weather-report',
  standalone: true,
  imports: [DisasterAlertsComponent, ChatboxComponent, WeatherAlertsComponent,],
  templateUrl: './weather-report.component.html',
  styleUrl: './weather-report.component.css'
})
export class WeatherReportComponent {

}
