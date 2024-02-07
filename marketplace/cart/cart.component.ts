import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';
import { SocketService } from 'src/app/services/socket.service';
import { MasterServiceService } from 'src/app/services/master-service.service';
import { SharedDataService } from 'src/app/services/shared-data.service';
// interface
export interface CartItemsInterface{
  position: number;
  name: string;
  model: string;
  qtty:number;
  price:number;
  total:number;
  action:string;
  
}
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})

export class CartComponent implements OnInit {
  productname: any;
  productmodel: any;
  qtty: any;
  available: any;
  cartItemCount!:any;
  userid = localStorage.getItem('userId')
  cartitems!:any;
  productDetails:any = [];
  totalcost = 0;
  grandtotal = 0;
  
  constructor(private location:Location, private cartService: CartService, private socketService: SocketService, private ms: MasterServiceService, private router: Router, private sharedData: SharedDataService){}
  // displayed column names
  displayedColumnNames:any = ['position', 'Name','Model','Qtty','Price','Total','Actions'];
  dataSource = this.productDetails;

  ngOnInit() {
    this.socketService.listen('cartoperationsevent').subscribe((data:any) => {
      if(data.userid==localStorage.getItem('userId')){
        this.getCartItems(this.userid);        
      }
      // Your logic for product added to cart event
    });

    this.getCartItems(this.userid);

    

      
  }

  getCartItems(userid:any){
    // get the cart items
    this.ms.getCartItems(userid).subscribe((response:any)=>{
      // console.log()
      if(response.success && response.items[0]){
        this.cartitems = response.items[0].products;
        this.grandtotal = response.items[0].amount;
      }else{
        this.cartitems = [];
        this.grandtotal = 0;
        this.router.navigate(['market_place/'])
      }
      
    })

  }
  

  goToCheckout(totalamount:any){
      this.router.navigate(['/market_place/checkout'])
  }
 

  reduceQuantityByOne(productid:any,buyerid:any,available:any){
    const data = {
      productid:productid,
      buyerid:this.userid,
      available:(available+1)
    }
    this.ms.reduceQttyByOne(data).subscribe((res:any)=>{
      if(res.success){
        this.getCartItems(this.userid);
      }
    })
  }
  increaseQuantityByOne(productid:any,buyerid:any,available:any){
    const data = {
      productid:productid,
      buyerid:this.userid,
      available:(available+1)
    }
    this.ms.increaseQttyByOne(data).subscribe((res:any)=>{
      if(res.success){
        this.getCartItems(this.userid);
      }
    })

  }
  viewProduct(id:any){
    const data = {
      pid:id,
      uid:localStorage.getItem('userId')
    }
    this.ms.getProductDetails(data).subscribe((res:any)=>{
      if(res.success){
        this.sharedData.setProductData(res.productDetails[0], 'product');
        this.router.navigate(['/market_place/product'])
      }
    })
    // navigate tot he product view page
  }

  removeCartItem(productid:any,buyerid:any){
    const data = {
      productid:productid,
      buyerid:this.userid
    }

    this.ms.removeCartItem(data).subscribe((res:any)=>{
      if(res.success){
        this.getCartItems(this.userid);
      }
    })
  }

 
  

}
