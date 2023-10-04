import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';
import { MasterServiceService } from 'src/app/services/master-service.service';
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
  constructor(private cartService: CartService, private ms: MasterServiceService, private router: Router){}
  cartItemCount!:any;
  userid = localStorage.getItem('userId')
  cartitems!:any;
  productDetails:any = [];
  totalcost = 0;
  grandtotal = 0;

  // displayed column names
  displayedColumnNames:any = ['position', 'Name','Model','Qtty','Price','Total','Actions'];
  dataSource = this.productDetails;

  ngOnInit() {
    // get the cart items
   this.ms.getCartItems(this.userid).subscribe((response:any)=>{
      if(response.success){
        this.cartitems = response.items;
        this.productname = response.items.productname;
        this.productmodel = response.items.productmodel;
        this.qtty = response.items.quantity;
        this.available = response.items.available;
        this.totalcost = response.items.totalcost;
      }
      
    })

      
  }
 
  getTotalCost(){
    let cost = 0;
    this.cartitems.forEach((e:any) => {
      cost+=e.totalCost;      
    });
    return cost.toLocaleString();
  }

 
  

}
