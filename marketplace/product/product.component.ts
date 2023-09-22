import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { MasterServiceService } from 'src/app/services/master-service.service';
import { Product } from 'src/app/Interfaces/product';
import { getKForPrice } from 'src/app/services/computations';
import { CartService } from 'src/app/services/cart.service';
import { AddToCartComponent } from '../add-to-cart/add-to-cart.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit{

  // properties
  productid:any;
  product!:any;
  pname!:any;
  storeid!:any;
  brand!:any;
  category!:any;
  subcategory!:any;
  model!:any;
  description!:any;
  sp!:any;
  avatar!:any;
  quantity!:any;
  features!:any;
  posted!:any
  displayimg!:any;
  discount!:any;
  price!:any;

  // methods
  ngOnInit() {
    // get the productid
    this.route.queryParamMap.subscribe((params:any)=>{
       this.productid = params.get('id');
    })
    // fetch the product data
    this.ms.getProductDetails(this.productid).subscribe((res:any)=>{
      if(res.success){
         this.product = res.productDetails[0] 
         this.posted = this.product.createdAt 
         this.pname = this.product.name
         this.avatar = this.product.avatar
         this.quantity = this.product.quantity
         this.displayimg = this.avatar[0]
         this.discount = this.product.discount;
         this.model = this.product.model;
         this.brand = this.product.brand;
         this.features = this.product.features;
         this.description = this.product.description;
         this.subcategory = this.product.subcategory;
         this.category = this.product.category;
         this.price = this.product.sp;

      }
    })
  }
  setDisplayImage(image:any){
    this.displayimg = image
  }
  calculateDiscountedPrice(price:any,discount:any){
    if(!discount || discount==0){
      return price == null?"":price.toLocaleString('en-US')
    }else{
      const dp = ((100-discount)/100)*price
      return dp == null?"":dp.toLocaleString('en-US')
    }
  }

  // constructor
  constructor(private cartServive: CartService, private router: Router, private route: ActivatedRoute, private ms:MasterServiceService, private dialog: MatDialog){}
  // show thousands in k
  thousandsInK(price:any){
    return getKForPrice(price)
  }
  // checkout
  checkOut(id:any){
    this.cartServive.addToCart(id)
    console.log(this.cartServive.getCartItems())
  }
  addToCart(id:any, quantity:any){
    const userid = localStorage.getItem('userId')
    if(userid){
      const dialogRef = this.dialog.open(AddToCartComponent, {
        width: '400px',
        disableClose: true,
        data: {
          id:id,
          quantity: quantity
        }
      });
      dialogRef.afterClosed().subscribe(result=>{
        console.log(result)
      })
    }else{
      this.router.navigate(['/login'])
    }     
    
  }
}
