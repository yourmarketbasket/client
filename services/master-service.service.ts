import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class MasterServiceService {
  baseurl = "http://localhost:3000";

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }
  // properties
  private searchQuerySubject = new Subject<string>();
  searchQuery$: Observable<string> = this.searchQuerySubject.asObservable();


  // methods go here
  setSearchQuery(query:string){
    this.searchQuerySubject.next(query);
  }

  // getLazyLoadedProducts
  getLazyLoadedProducts(data:any){
    return this.http.post(`${this.baseurl}/getlazyLoadedProducts`, data);
  }
 
  getAllProducts(){
    return this.http.get(`${this.baseurl}/getAllProducts`);
  }
  isFavorite(data:any){
    return this.http.post(`${this.baseurl}/isFavorite`, data)
  }
  addFavorite(data:any){
    return this.http.post(`${this.baseurl}/addFavorite`, data);
  }
  editProduct(data:any){
    return this.http.post(`${this.baseurl}/editProduct`, data);
  }
  getPrdoucts(storeId: any) {
    return this.http.get(`${this.baseurl}/getProducts/${storeId}`);
  }
  getProductDetails(productId:any){
    return this.http.get(`${this.baseurl}/getProductDetails/${productId}`);
  }
  deleteProduct(productId: any) {
    return this.http.delete(`${this.baseurl}/deleteProduct/${productId}`);
  }
  addProduct(product: any) {
    return this.http.post(`${this.baseurl}/addProduct`, product);
  }
  verifyUser(user: any) {
    return this.http.post(`${this.baseurl}/verify`, user);
  }
  getUser(userId:any){
    return this.http.get(`${this.baseurl}/getUser/${userId}`);
  }
  sendOTP(data: any) {
    return this.http.post(`${this.baseurl}/sendOTP`, data);
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
  searchProduct(data:any){
    return this.http.post(`${this.baseurl}/searchProduct`, data);
  }
  // changeUserAvatar
  changeUserAvatar(data: any) {
    return this.http.post(`${this.baseurl}/changeUserAvatar`, data);
  }
  // get all the products that have not been reviewed
  reviewProducts(data: any){
    return this.http.post(`${this.baseurl}/reviewproducts`, data);
  }
  getNumOfUnapprovedProducts(){
    return this.http.get(`${this.baseurl}/unapprovedproducts`);
  }
  rejectedproducts(storeid:any){
    return this.http.get(`${this.baseurl}/getRejectedProducts/${storeid}`);
  }
  reviewstores(data:any){
    return this.http.post(`${this.baseurl}/reviewstores`, data);
  }
  advancedActionAllowed(data:any){
    return this.http.post(`${this.baseurl}/advancedAction`, data);
  }
  logout() {
    localStorage.removeItem('token');
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
  
}
