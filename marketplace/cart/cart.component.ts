import { Location } from '@angular/common';
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
  constructor(private location:Location, private cartService: CartService, private ms: MasterServiceService, private router: Router){}
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
        this.getTotalCost();
        this.verifyExistenceofCartItems();
      }
      
    })

      
  }
  verifyExistenceofCartItems(){
    if(this.grandtotal==0){
      this.router.navigate([''])
    }
  }
 
  getTotalCost(){
    this.grandtotal = 0
    this.cartitems.forEach((e:any) => {
      this.grandtotal+=e.totalCost;      
    });
    return this.grandtotal;
  }

  reduceQuantityByOne(productid:any,buyerid:any,available:any){
    const data = {
      productid:productid,
      buyerid:buyerid,
      available:(available+1)
    }
    this.ms.reduceQttyByOne(data).subscribe((res:any)=>{
      if(res.success){
        window.location.reload();
      }
    })
  }
  increaseQuantityByOne(productid:any,buyerid:any,available:any){
    const data = {
      productid:productid,
      buyerid:buyerid,
      available:(available+1)
    }
    this.ms.increaseQttyByOne(data).subscribe((res:any)=>{
      if(res.success){
        window.location.reload();
      }
    })

  }
  viewProduct(id:any){
    // navigate tot he product view page
    this.router.navigate(['/market_place/product'], {queryParams: {id:id}})
  }

  removeCartItem(productid:any,buyerid:any){
    const data = {
      productid:productid,
      buyerid:buyerid
    }

    this.ms.removeCartItem(data).subscribe((res:any)=>{
      if(res.success){
        window.location.reload();
      }
    })
  }

 
  

}
