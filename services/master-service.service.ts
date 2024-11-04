import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
// import io from 'socket.io-client';
@Injectable({
  providedIn: 'root'
})
export class MasterServiceService {
  baseurl = "https://marketapi.fly.dev";
  // baseurl = "http://localhost:3000";
  // socket = io('wss://marketapi.fly.dev');

  // provider logic
  productData!:any;


  constructor(
    private http: HttpClient,
    private router: Router
  ) { }
  // properties
  private searchQuerySubject = new Subject<string>();
  searchQuery$: Observable<string> = this.searchQuerySubject.asObservable();

  categoryProductsData = new Subject<any[]>();
  categoryProducts$: Observable<any[]> = this.categoryProductsData.asObservable();

  private  getToken(){
    return localStorage.getItem('token')
  }

  private  getAuthHeaders() {
      const token = this.getToken();
      if (token) {
          return {
              headers: new HttpHeaders({
                  'Authorization': `Bearer ${token}`
              })
          };
      }
      return {};
  }

  async generateAccessToken() {
    const data = {
      userId: localStorage.getItem('userId'),
      token: localStorage.getItem('token')
    };
  
    const result: any = await this.http.post(`${this.baseurl}/api/auth/accessToken`, data).toPromise();
    return result.accessToken;
  }



  // private numbOfItemsInCartSubject = new Subject<number>();
  // numberOfItemsInCart$ = this.numbOfItemsInCartSubject.asObservable();

  // methods go here
  setSearchQuery(query:string){
    this.searchQuerySubject.next(query);
  }
  

  // getLazyLoadedProducts
  async getLazyLoadedProducts(data:any){
    return this.http.post(`${this.baseurl}/getlazyLoadedProducts`, data, this.getAuthHeaders());
  }
 
  getAllProducts(){
    return this.http.get(`${this.baseurl}/getAllProducts`, this.getAuthHeaders());
  }
  isFavorite(data:any){
    return this.http.post(`${this.baseurl}/isFavorite`, data, this.getAuthHeaders())
  }
  addFavorite(data:any){
    return this.http.post(`${this.baseurl}/addFavorite`, data, this.getAuthHeaders());
  }
  editProduct(data:any){
    return this.http.post(`${this.baseurl}/editProduct`, data, this.getAuthHeaders());
  }
  getPrdoucts(storeId: any) {
    return this.http.get(`${this.baseurl}/getProducts/${storeId}`, this.getAuthHeaders());
  }
  addProductView(data:any){
    return this.http.post(`${this.baseurl}/api/products/addProductView`, data, this.getAuthHeaders());
  }
  getProductDetails(data:any){
    return this.http.post(`${this.baseurl}/api/products/getProductDetails`, data, this.getAuthHeaders());
  }
  deleteProduct(productId: any) {
    return this.http.delete(`${this.baseurl}/deleteProduct/${productId}`);
  }
  addProduct(product: any) {
    return this.http.post(`${this.baseurl}/api/products/addProduct`, product);
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
    return this.http.post(`${this.baseurl}/addStore`, data, this.getAuthHeaders());
  }
  getStoreLocations(userid:any){
    return this.http.get(`${this.baseurl}/api/sellers/storelocation/${userid}`, this.getAuthHeaders());
  }
  updateSellerSettings(data:any){
    return this.http.post(`${this.baseurl}/api/sellers/updateSettings`, data, this.getAuthHeaders());
  }
  getStores (userId: any) {
    return this.http.get(`${this.baseurl}/getStores/${userId}`, this.getAuthHeaders());
  }
  getStoreDetails(storeId: any) {
    return this.http.get(`${this.baseurl}/getStoreDetails/${storeId}`, this.getAuthHeaders());
  }
  addToCart(data:any){
    return this.http.post(`${this.baseurl}/api/products/addToCart`, data, this.getAuthHeaders());
  }
  searchProduct(data:any){
    return this.http.post(`${this.baseurl}/searchProduct`, data, this.getAuthHeaders());
  }
  // changeUserAvatar
  changeUserAvatar(data: any) {
    return this.http.post(`${this.baseurl}/changeUserAvatar`, data, this.getAuthHeaders());
  }
  // get all the products that have not been reviewed
  reviewProducts(data: any){
    return this.http.post(`${this.baseurl}/reviewproducts`, data, this.getAuthHeaders());
  }
  getNumOfUnapprovedProducts(){
    return this.http.get(`${this.baseurl}/unapprovedproducts`, this.getAuthHeaders());
  }
  rejectedproducts(storeid:any){
    return this.http.get(`${this.baseurl}/getRejectedProducts/${storeid}`, this.getAuthHeaders());
  }
  reviewstores(data:any){
    return this.http.post(`${this.baseurl}/reviewstores`, data, this.getAuthHeaders());
  }
  advancedActionAllowed(data:any){
    return this.http.post(`${this.baseurl}/advancedAction`, data, this.getAuthHeaders());
  }
  getAvailableQuantityForUser(data:any){
    return this.http.post(`${this.baseurl}/api/products/availableQttyForUser`, data, this.getAuthHeaders());
  }
  getCartItems(userid:any){
    return this.http.get(`${this.baseurl}/api/products/getCartItems/${userid}`, this.getAuthHeaders());
  }
  reduceQttyByOne(data:any){
    return this.http.post(`${this.baseurl}/api/products/decreaseCartItemByOne`, data, this.getAuthHeaders());
  }
  increaseQttyByOne(data:any){
    return this.http.post(`${this.baseurl}/api/products/increaseCartItemByOne`, data, this.getAuthHeaders());
  }
  removeCartItem(data:any){
    return this.http.post(`${this.baseurl}/api/products/removeCartItem`, data, this.getAuthHeaders());
  }
  pesapalSOR(data:any){
    return this.http.post(`${this.baseurl}/api/payments/pesapalSOR`, data, this.getAuthHeaders());
  }
  confirmTransactionStatus(trackingid:any){
    return this.http.get(`${this.baseurl}/api/payments/pesapalTransactionStatus/${trackingid}`, this.getAuthHeaders());
  }
  
  fetchProductDetails(productid:any){
    return this.http.get(`${this.baseurl}/api/products/productDetails/${productid}`, this.getAuthHeaders());
  }
  getNumOfItemsIncart(userid:any){
    return this.http.get(`${this.baseurl}/api/products/numOfItemsInCart/${userid}`, this.getAuthHeaders());
  }
  getBrandCategories(){
    return this.http.get(`${this.baseurl}/api/products/getcategoriesSubcatBrand`, this.getAuthHeaders());
  }
  getCategoryProducts(category:any){
    return this.http.get(`${this.baseurl}/api/products/getCategoryProducts/${category}`, this.getAuthHeaders());
  }
  getUserOrders(userid:any){
    return this.http.get(`${this.baseurl}/api/products/getUserOrders/${userid}`, this.getAuthHeaders());
  }
  getStoresAndProductsByOwnerId(ownerid:any){
    return this.http.get(`${this.baseurl}/api/products/getStoresAndProductsByOwnerId/${ownerid}`, this.getAuthHeaders());
  }
  getPaginatedProducts(data:any){
    return this.http.post(`${this.baseurl}/api/products/getPaginatedProducts`, data, this.getAuthHeaders());
  }
  getGroupedStoreOrders(storeid:any){
    return this.http.get(`${this.baseurl}/api/products/groupAllStoreOrders/${storeid}`, this.getAuthHeaders())
  }
  getStoreOrders(storeid:any){
    return this.http.get(`${this.baseurl}/api/products/getStoreOrders/${storeid}`, this.getAuthHeaders())
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
