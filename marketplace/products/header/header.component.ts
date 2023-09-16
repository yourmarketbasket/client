import { Component, OnInit } from '@angular/core';
import { MasterServiceService } from 'src/app/services/master-service.service';
import { AuthService } from 'src/app/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-products-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  // properties
  isLoggedIn!:any;
  accountUser:any;
  userPic!:any;
  searchQuery!:any;

  // constructor
  constructor(private ms:MasterServiceService, private authService:AuthService, private router:Router){}
  // methods
  async ngOnInit() {
    // set login status
      this.isLoggedIn = await this.authService.loggedIn();
     
        // get the user data
        if(this.isLoggedIn){
          await this.authService.getUser(localStorage.getItem('userId')).subscribe((res:any)=>{
            if(res.success){
              this.accountUser = res.data
              this.userPic = res.data.avatar
            }
          })

        }
       
        
      }
  gotoDashboard(){
    this.router.navigate(['/dashboard'])

  }
  videoError(){
    console.log('playback error')
  }
  // logout
  logoutUser(){
    this.authService.logout()
  }
  
  searchProduct(){
    this.ms.setSearchQuery(this.searchQuery);    

  }


}
