import { Injectable } from '@angular/core';
import { CartService } from './cart.service';

@Injectable({
  providedIn: 'root'
})
export class CartSyncService {

  constructor(private cartService:CartService) { 
    window.addEventListener('storage',(event:any)=>{
      if(event.key === 'cart'){
        const updateCart = JSON.parse(event.newValue);
        this.cartService.setCartitems(updateCart);
      }
    })
  }

}
