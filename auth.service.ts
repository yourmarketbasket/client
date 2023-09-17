import { EventEmitter, Injectable, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // isLoggedIn = false;
  baseurl = 'http://localhost:3000';
  loginUser(user: any) {
    return this.http.post(`${this.baseurl}/api/users/login`, user);
  }
  registerUser(user: any) {
    return this.http.post(`${this.baseurl}/api/users/register`, user);
  }
  getPrdoucts(storeId: any) {
    return this.http.get(`${this.baseurl}/getProducts/${storeId}`);
  }
  deleteProduct(productId: any) {
    return this.http.delete(`${this.baseurl}/deleteProduct/${productId}`);
  }
  addProduct(product: any) {
    return this.http.post(`${this.baseurl}/addProduct`, product);
  }
  verifyUser(user: any) {
    return this.http.post(`${this.baseurl}/api/users/verifyOTP`, user);
  }
  getZipCode(data:any) {
    return this.http.post(`${this.baseurl}/api/users/getZipCode`, data);
  }
  getUser(userId:any){
    return this.http.get(`${this.baseurl}/getUser/${userId}`);
  }
  sendOTP(data: any) {
    return this.http.post(`${this.baseurl}/sendOTP`, data);
  }
  sendResetPasswordOTP(data: any) {
    return this.http.post(`${this.baseurl}/api/users/sendResetPasswordOTP`, data);
  }
  verifyResetPasswordOTP(data: any) {
    return this.http.post(`${this.baseurl}/api/users/verifyResetPasswordOTP`, data);
  }
  resetUserPassword(data:any){
    return this.http.post(`${this.baseurl}/api/users/resetUserPassword`, data);
  }
  addStore (data: any) {
    return this.http.post(`${this.baseurl}/addStore`, data);
  }
  getStores (userId: any) {
    return this.http.get(`${this.baseurl}/getStores/${userId}`);
  }
  getStoreDetails(storeId: any) {
    return this.http.get(`${this.baseurl}/getStoreDetails/${storeId}`);
  }
  // changeUserAvatar
  changeUserAvatar(data: any) {
    return this.http.post(`${this.baseurl}/api/users/changeUserAvatar`, data);
  }
  reviewListedItemAction(data:any){     
      return this.http.post(`${this.baseurl}/reviewlisteditem`, data);
    
  }
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId')
    this.router.navigate(['/login']);
  }
  get isLoggedIn() {
    return !!localStorage.getItem('token');
  }
  set isLoggedIn(value: boolean) {
    this.isLoggedIn = value;
  }

  loggedIn(){
    return !!localStorage.getItem('token')
  }
  constructor(private http: HttpClient, private router: Router) { }


}
