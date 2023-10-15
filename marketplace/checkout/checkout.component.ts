import { Component, OnInit } from '@angular/core';
import { MasterServiceService } from 'src/app/services/master-service.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  userId!:any;
  totalCost:any=0;
  logisticFee:any = 0;
  cartItems!:any[];
  user!:any;
  constructor(private ms:MasterServiceService){

  }

  ngOnInit(): void {
    this.userId = localStorage.getItem('userId')
    this.ms.getUser(this.userId).subscribe((res:any)=>{
      if(res.success){
        this.user = res.data
      }
    })
    this.ms.getCartItems(this.userId).subscribe((res:any)=>{
      if(res.success){
        this.cartItems = res.items
        this.calculateCost();
      }
    })

    

  }
  // calculate total cost
  calculateCost(){
     this.cartItems.forEach((e:any)=>{
      this.totalCost+=e.totalCost;
     })
    return this.totalCost;
  }

}
