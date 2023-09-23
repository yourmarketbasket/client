import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MasterServiceService } from './master-service.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemSubject = new BehaviorSubject<any>([]);
  cartItems$ = this.cartItemSubject.asObservable();

  constructor(private ms: MasterServiceService) { 
    
  }
  // add to cart
  addToCart(item:any){
    const currentCart = this.cartItemSubject.value;
    if(currentCart.length===0)
      currentCart.push(item);
    else
      
    this.cartItemSubject.next(currentCart);
    this.saveCartItems(currentCart)
  }
  removeFromCart(item:any){
    const currentCart = this.cartItemSubject.value;
    const updatedCart = currentCart.filter((cartItem:any)=>cartItem!== item);
    this.cartItemSubject.next(updatedCart);

    this.saveCartItems(updatedCart);
  }

  private loadCartItems(){
    const storedCart = localStorage.getItem('cart');
    this.cartItemSubject.next(storedCart);
  }

  private saveCartItems(cart: any){
    localStorage.setItem('cart', cart)
  }

  getCartItems(){
    return this.cartItemSubject.value;
  }

  setCartitems(cart: any){
    this.cartItemSubject.next(cart);
    this.saveCartItems(cart)
  }

}
