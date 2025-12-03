import { Component } from '@angular/core';
import { DisasterAlertsComponent } from '../disaster-alerts/disaster-alerts.component';
import { ChatboxComponent } from '../chatbox/chatbox.component';
import { WeatherAlertsComponent } from '../weather-alerts/weather-alerts.component';
import {
  trigger, transition, style, animate, query, stagger
} from '@angular/animations';

@Component({
  selector: 'app-weather-report',
  standalone: true,
  imports: [DisasterAlertsComponent, ChatboxComponent, WeatherAlertsComponent,],
  templateUrl: './weather-report.component.html',
  styleUrl: './weather-report.component.css',
  animations: [
    trigger('pageFadeSlide',[
      transition(':enter',[
        query('.animate-block',[
          style({opacity:0, transform: 'translateY(60px)'}),
          stagger(150,[animate('600ms ease-out', style({opacity:1, transform: 'translateY(0)'

          })
        )]
      )
        ]), 
      ])
    ])
  ],
})
export class WeatherReportComponent {

}
