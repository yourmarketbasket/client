import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  constructor(private cartService: CartService){}
  cartItemCount!:any;

  ngOnInit(): void {
    this.cartItemCount = localStorage.getItem('cart')
    console.log(this.cartItemCount)
  }

}
