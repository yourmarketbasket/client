import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SocketService } from 'src/app/services/socket.service';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-qa-sidebar',
  templateUrl: './qa-sidebar.component.html',
  styleUrls: ['./qa-sidebar.component.css']
})
export class QaSidebarComponent implements OnInit {
    avatar = "";
    userId:any;
    name = "";
  
    constructor(
      private router: Router,
      private socketService: SocketService,
      private authService: AuthService
    ) { }
  
    ngOnInit(): void {
      // get user details
      this.userId = localStorage.getItem('userId');
      this.authService.getUser(this.userId).subscribe((res: any) => {
        this.avatar = res.data.avatar;
        this.name = res.data.fname + " " + res.data.lname;
      }
      );

    }

}
