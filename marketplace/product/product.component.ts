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
  disableAddToCartButton:boolean = false;
  addtocartfeedback!:any;

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
         this.displayimg = this.avatar[0]
         this.discount = this.product.discount;
         this.model = this.product.model;
         this.brand = this.product.brand;
         this.features = this.product.features;
         this.description = this.product.description;
         this.subcategory = this.product.subcategory;
         this.category = this.product.category;
         this.price = this.product.sp;
         this.storeid = this.product.storeid

      }
    })

    this.getAvailableProductQuantity(localStorage.getItem('userId'),this.productid)
    
  }
  // get the available quantity 
  getAvailableProductQuantity(userid:any, productid:any){
    const data = {
      userid: userid,
      productid: productid
    }
    this.ms.getAvailableQuantityForUser(data).subscribe((res:any)=>{
      if(res.success){
        this.quantity = res.quantity
      }
    })
  }
  
  setDisplayImage(image:any){
    this.displayimg = image
  }
  calculateDiscountedPrice(price:any,discount:any){
    if(!discount || discount==0){
      return price == null?"":price
    }else{
      const dp = ((100-discount)/100)*price
      return dp == null?"":dp
    }
  }

  // constructor
  constructor(private cartServive: CartService, private router: Router, private route: ActivatedRoute, private ms:MasterServiceService, private dialog: MatDialog){}
  // show thousands in k
  thousandsInK(price:any){
    return getKForPrice(price)
  }
  // checkout
  viewCart(){
    this.router.navigate(['/market_place/cart'])
  }
  addToCart(id:any, storeid:any, quantity:any, model:any,name:any,price:any,avatar:any,discount:any){
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
        if(result){
          const data = {
            userid: localStorage.getItem('userId'),
            name:name,
            productid: result.productid,
            storeid:storeid,
            quantity: result.qtty,
            available: quantity,
            model:model,
            totalcost: (price*result.qtty),
            price: price,
            avatar:avatar,
            discount:discount
          }

          this.ms.addToCart(data).subscribe((response:any)=>{
            if(response.success){
              this.addtocartfeedback = response.message
              this.quantity = response.available;
              
              if(response.available===0){
                this.disableAddToCartButton = true;
              }              
            }else{
              this.quantity = response.available;
              this.addtocartfeedback = "Product ran out, sorry for the inconviniences"
              this.disableAddToCartButton = true;
            }
          })
        }       
      })
    }else{
      this.router.navigate(['/login'])
    }     
    
  }
}
