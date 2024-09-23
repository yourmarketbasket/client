import { Component, ViewChild } from '@angular/core';
import { MatSidenav, MatSidenavModule  } from '@angular/material/sidenav';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { OnInit } from '@angular/core';

import { CreatestoreComponent } from '../mystores/createstore/createstore.component';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Store } from '../mystores/stores-dashboard/stores-interface';
import { SocketService } from '../services/socket.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit{
  @ViewChild('sidenav') sidenav!: MatSidenav;
  rating = 3.2;
  isLoading = true;
  stores!:Store[];
  userId: any;
  phone = "";
  avatar = "";
  name = "";
  dob = "";
  verified = false;
  address = "";
  vendor = false;
  email = "";
  registered = "";
  client = false;
  title='Profile';
  showManageStoreComponent = false;
  approved: any;
  gender: any;
  city: any;
  active: any;
  zipcode: any;
  constructor(private socketService: SocketService, private router: Router, private authService: AuthService, private dialog: MatDialog) { 
  
  }
  openDialog(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    this.dialog.open(CreatestoreComponent, dialogConfig);

  }
  userLogout(){
    this.authService.logout();
  }
  
  range(count: number) {
    return Array.from({length: count}, (x, i) => i + 1);
  }
  editUserInfo(){
      
  }

  ngOnInit() { 
    // change the window title
    // get the user id from the local storage
    this.userId = localStorage.getItem('userId');
    // get user details from auth service
    this.authService.getUser(this.userId).subscribe((data: any) => {
      if(data.success){
        const date = new Date(data.data.dob);
        this.avatar = data.data.avatar;
        this.name = data.data.fname+" "+data.data.lname;
        this.phone = data.data.phone.slice(1);
        this.dob = date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear();
        this.verified = data.data.verified;
        this.address = data.data.address.toUpperCase();
        this.vendor = data.data.vendor;
        this.email = data.data.email;
        this.registered = data.data.createdAt;
        this.client = data.data.client;
        this.approved = data.data.approved;
        this.gender = data.data.gender.toUpperCase()
        this.city = data.data.city.toUpperCase();
        this.active = data.data.active;
        this.zipcode = data.data.zipcode.slice(1);

      }
      window.document.title = this.title+" | "+this.name;

    }
    
    );
    
  
   }


  

}
