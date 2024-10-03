import { Component, OnInit } from '@angular/core';
import { MasterServiceService } from 'src/app/services/master-service.service';
import { AuthService } from 'src/app/auth.service';
import { Router } from '@angular/router';
import { SocketService } from 'src/app/services/socket.service';
import { trigger, state, style, animate, transition, query, keyframes } from '@angular/animations';
import { debounceTime } from 'rxjs';



@Component({
  selector: 'app-products-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  animations: [
    trigger('iconAnimationExitToApp', [
      state('up', style({
        transform: 'translateY(-10px)' // Adjust the distance as needed for initial position
      })),
      state('down', style({
        transform: 'translateY(0)'
      })),
      transition('up <=> down', [
        animate('500ms ease-in-out', keyframes([
          style({ transform: 'translateY(-10px)', offset: 0 }), // Initial position
          style({ transform: 'translateY(0)', offset: 0.25 }), // Bounce up
          style({ transform: 'translateY(-5px)', offset: 0.5 }), // Bounce down less
          style({ transform: 'translateY(0)', offset: 0.75 }), // Bounce up again
          style({ transform: 'translateY(-2px)', offset: 0.85 }), // Bounce down less
          style({ transform: 'translateY(0)', offset: 1 }) // Final position
        ]))
      ]),
      transition('* => down', [
        animate('500ms ease-in-out', keyframes([
          style({ transform: 'translateY(0)', offset: 0 }), // Initial position
          style({ transform: 'translateY(-5px)', offset: 0.25 }), // Bounce up
          style({ transform: 'translateY(-10px)', offset: 0.5 }), // Bounce down less
          style({ transform: 'translateY(-5px)', offset: 0.75 }), // Bounce up again
          style({ transform: 'translateY(0)', offset: 1 }) // Final position
        ]))
      ]) // Adjust duration and easing as needed
    ]),
    trigger('iconAnimationNotificationsNone', [
      state('up', style({
        transform: 'translateY(-10px)' // Adjust the distance as needed for initial position
      })),
      state('down', style({
        transform: 'translateY(0)'
      })),
      transition('up <=> down', [
        animate('500ms ease-in-out', keyframes([
          style({ transform: 'translateY(-10px)', offset: 0 }), // Initial position
          style({ transform: 'translateY(0)', offset: 0.25 }), // Bounce up
          style({ transform: 'translateY(-5px)', offset: 0.5 }), // Bounce down less
          style({ transform: 'translateY(0)', offset: 0.75 }), // Bounce up again
          style({ transform: 'translateY(-2px)', offset: 0.85 }), // Bounce down less
          style({ transform: 'translateY(0)', offset: 1 }) // Final position
        ]))
      ]),
      transition('* => down', [
        animate('500ms ease-in-out', keyframes([
          style({ transform: 'translateY(0)', offset: 0 }), // Initial position
          style({ transform: 'translateY(-5px)', offset: 0.25 }), // Bounce up
          style({ transform: 'translateY(-10px)', offset: 0.5 }), // Bounce down less
          style({ transform: 'translateY(-5px)', offset: 0.75 }), // Bounce up again
          style({ transform: 'translateY(0)', offset: 1 }) // Final position
        ]))
      ]) // Adjust duration and easing as needed
    ]),
    trigger('iconAnimationShoppingCart', [
      state('up', style({
        transform: 'translateY(-10px)' // Adjust the distance as needed for initial position
      })),
      state('down', style({
        transform: 'translateY(0)'
      })),
      transition('up <=> down', [
        animate('500ms ease-in-out', keyframes([
          style({ transform: 'translateY(-10px)', offset: 0 }), // Initial position
          style({ transform: 'translateY(0)', offset: 0.25 }), // Bounce up
          style({ transform: 'translateY(-5px)', offset: 0.5 }), // Bounce down less
          style({ transform: 'translateY(0)', offset: 0.75 }), // Bounce up again
          style({ transform: 'translateY(-2px)', offset: 0.85 }), // Bounce down less
          style({ transform: 'translateY(0)', offset: 1 }) // Final position
        ]))
      ]),
      transition('* => down', [
        animate('500ms ease-in-out', keyframes([
          style({ transform: 'translateY(0)', offset: 0 }), // Initial position
          style({ transform: 'translateY(-5px)', offset: 0.25 }), // Bounce up
          style({ transform: 'translateY(-10px)', offset: 0.5 }), // Bounce down less
          style({ transform: 'translateY(-5px)', offset: 0.75 }), // Bounce up again
          style({ transform: 'translateY(0)', offset: 1 }) // Final position
        ]))
      ])
    ])
    
    ,    
    trigger('avatarAnimation', [
      state('large', style({
        transform: 'scale(1.2)' // Increase size by 10%
      })),
      state('small', style({
        transform: 'scale(1)' // Original size
      })),
      transition('small <=> large', animate('200ms ease-in-out')) // Adjust duration and easing as needed
    ]),
    

  ]
})
export class HeaderComponent implements OnInit {
  
  // properties
  isLoggedIn!:any;
  accountUser:any;
  userPic!:any;
  searchQuery!:any;
  numOfItemsInCart:any = 0;
  notifications:any;
  iconStateExitToApp = 'down';
  iconStateNotificationsNone = 'down';
  iconStateShoppingCart = 'down';
  avatarState = 'small';



  // constructor
  constructor(private ms:MasterServiceService, private socketService:SocketService, private authService:AuthService, private router:Router){}
  // methods
  ngOnInit() {
    

    this.socketService.listen('cartoperationsevent').subscribe((data:any) => {
      if(data.userid==localStorage.getItem('userId')){
        this.toggleIconAnimationShoppingCart();
        setTimeout(() => {
          this.toggleIconAnimationShoppingCart();
        }, 0);
        this.getNumOfCartItems();
        

      }
      // Your logic for product added to cart event
    });
    
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

  toggleIconAnimationExitToApp() {
    this.iconStateExitToApp = (this.iconStateExitToApp === 'up' ? 'down' : 'up');
  }

  toggleIconAnimationNotificationsNone() {
    this.iconStateNotificationsNone = (this.iconStateNotificationsNone === 'up' ? 'down' : 'up');
  }

  toggleIconAnimationShoppingCart() {
    this.iconStateShoppingCart = (this.iconStateShoppingCart === 'down' ? 'up' : 'down');
}

  toggleAvatarAnimation() {
    this.avatarState = (this.avatarState === 'small' ? 'large' : 'small');
  }

  async getNumOfCartItems(){
    const data = {userid:localStorage.getItem('userId')};

    await this.ms.getNumOfItemsIncart(data.userid).subscribe((res:any)=>{
      if(res.success){
        this.numOfItemsInCart =  res.count         
      }else{
        this.numOfItemsInCart =  ""
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
  
  searchProduct(searchQuery:string){
    this.ms.setSearchQuery(searchQuery);    

  }

  onSearchFieldFocus() {
    this.router.navigate(['/market_place']);
  }

  goToCart(){
    this.router.navigate(['/market_place/cart'])
  }

  

  // this.ms.socket.on('')


}
