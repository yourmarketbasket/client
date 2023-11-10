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
  numOfItemsInCart:any = 0;

  // constructor
  constructor(private ms:MasterServiceService, private authService:AuthService, private router:Router){}
  // methods
  ngOnInit() {
    // set login status
      this.isLoggedIn = this.authService.loggedIn();     
        // get the user data
        if(this.isLoggedIn){
          this.authService.getUser(localStorage.getItem('userId')).subscribe((res:any)=>{
            if(res.success){
              this.accountUser = res.data
              this.userPic = res.data.avatar
            }
          })

        }

         // get number of items in cart
      this.getNumOfCartItems();
       
        
  }
  async getNumOfCartItems(){
    const data = {userid:localStorage.getItem('userId')};

    await this.ms.getNumOfItemsIncart(data).subscribe((res:any)=>{
      if(res.num.success){
        this.numOfItemsInCart =  res.num.count          
      }
    })
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

  goToCart(){
    this.router.navigate(['/market_place/cart'])
  }


}
