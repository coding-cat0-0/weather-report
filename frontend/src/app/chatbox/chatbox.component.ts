import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatSnackBar,MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule, NgClass } from '@angular/common';

@Component({
  selector: 'app-chatbox',
  standalone: true,
  imports: [FormsModule, MatSnackBarModule, NgClass, CommonModule],
  templateUrl: './chatbox.component.html',
  styleUrl: './chatbox.component.css'
})
export class ChatboxComponent {
messages:{role:string,text:string}[]=[];
messageInput='';

constructor(private http: HttpClient, private snackBar:MatSnackBar) {}
OnPopup(message:string){
  this.snackBar.open(message,'Close',{
    duration:3000,
    horizontalPosition:'center',
    verticalPosition:'top',
    panelClass:['snackbar']
  }
)}

onSubmit(){
  if(!this.messageInput.trim()){
    this.OnPopup('Message cannot be empty!');
  }
  const userMsg = this.messageInput;
  this.messages.push({role:'user',text:userMsg});
  this.messageInput='';
this.http.post('http://localhost:9000/chat',{
  message:userMsg
}).subscribe({
  next:(response:any)=>{
    this.messages.push({
      role:'ai',
      text:response.reply
    });
    console.log('Message sent successfully:', response);},
    error:(error)=>{
      console.log('Error sending message:', error);
      this.OnPopup('Failed to send message. Please try again.');
    }
  }
)
}
}

