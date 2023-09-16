import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SocketService } from 'src/app/services/socket.service';
import { AuthService } from 'src/app/auth.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
    @Output() toggleSideBar = new EventEmitter<any>();
    connected = false;
    connectedUser = '';
    avatar = "";
    fname = "";
    constructor(
      private socketService: SocketService,
      private authService: AuthService
      ) { }
  
    ngOnInit() {
      // get the user id from the local storage
      const userId = localStorage.getItem('userId');
      // get the user details from the auth service
      this.authService.getUser(userId).subscribe((data: any) => {
        if(data.success){
          this.avatar = data.data.avatar;
          this.fname = data.data.fname
        }
      });
      this.socketService.listen('connected').subscribe((response:any)=>{
        this.connected = true;
        this.connectedUser = response;
      });
    }
    // toggle sidebar
    toggleThisSideBar(){
      this.toggleSideBar.emit();
    }


}
