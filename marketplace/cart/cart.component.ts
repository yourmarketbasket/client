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
  action:string
  
}
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})

export class CartComponent implements OnInit {
  constructor(private cartService: CartService, private ms: MasterServiceService, private router: Router){}
  cartItemCount!:any;
  userid = localStorage.getItem('userId')
  cartitems!:any;
  productDetails:any = [];
  totalcost = 0;

  // displayed column names
  displayedColumnNames:any = ['position', 'Name','Model','Qtty','Price','Total','Actions'];
  dataSource = this.productDetails;

  ngOnInit(): void {
    // get the cart items
    this.ms.getCartItems(this.userid).subscribe((response:any)=>{
      if(response.success){
        this.cartitems = response.items
      }
      this.getProductDetails()

    })

      
  }
  // get the product details
  getProductDetails(){
    this.cartitems.forEach((e:any) => {
      this.totalcost+=e.totalCost
      this.ms.fetchProductDetails(e.productid).subscribe((res:any)=>{
        this.productDetails.push(res.product[0])
      })
    });
  }

  calculateDiscountedPrice(originalPrice: number, discountPercentage: number = 0): number {
    // Ensure that the discountPercentage is within the valid range (0-100)
    if (discountPercentage < 0 || discountPercentage > 100) {
      throw new Error("Discount percentage must be between 0 and 100.");
    }
  
    // Calculate the discounted price
    const discount = (discountPercentage / 100) * originalPrice;
    const discountedPrice = originalPrice - discount;
  
    // Round the discounted price to one decimal place
    const roundedDiscountedPrice = parseFloat(discountedPrice.toFixed(1));
  
    return roundedDiscountedPrice;
  }
  viewProduct(id:any){
    // navigate tot he product view page
    this.router.navigate(['/product'], {queryParams: {id:id}})
  }
  

}
