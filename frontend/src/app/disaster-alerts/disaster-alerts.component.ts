import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-disaster-alerts',
  standalone: true,
  imports: [CommonModule, FormsModule,HttpClientModule],
  templateUrl: './disaster-alerts.component.html',
  styleUrl: './disaster-alerts.component.css'
})
export class DisasterAlertsComponent {
weatherApi = 'http://localhost:9000/weather_report';
disasterApi ='http://localhost:9000/get_disaster';
earthquakes:any[]=[];
disasters:any[]=[];
summary:string='';
expanded:boolean=false;
constructor(private http:HttpClient){}


onClick(){
  this.http.get(this.disasterApi).subscribe({
      next : (res : any)=>{
        this.disasters = res.disasters||[];
        this.earthquakes = res.earthquakes||[];
        this.summary = res.summary||'';
        this.expanded = false;
        console.log("Report: ", res);
      }, error : (err)=>{
        console.log(err.detail)
      }
    });
}

}
