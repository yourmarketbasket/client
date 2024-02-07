import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MasterServiceService } from './master-service.service';

@Injectable({
  providedIn: 'root',
})
export class SharedDataService {
  constructor(private ms: MasterServiceService){}


  private productDataSubject = new BehaviorSubject<any>(this.loadDataFromStorage('product'));
  public productData$ = this.productDataSubject.asObservable();

  private productsDataSubject = new BehaviorSubject<any>(this.loadDataFromStorage('products'));
  public productsData$ = this.productsDataSubject.asObservable();

  private productsInfoSubject = new BehaviorSubject<any>(this.loadDataFromStorage('productsinfo'));
  public productsInfo$ = this.productsInfoSubject.asObservable();

  setProductData(data: any, key:string): void {
    const existingData = this.productDataSubject.value;
    const newData = { ...existingData, ...data };
    this.productDataSubject.next(newData);
    this.saveDataToStorage(newData, key);
  }

  setProductsInfoData(data: any, key:string): void {
    const existingData = this.productsInfoSubject.value;
    const newData = { ...existingData, ...data };
    this.productsInfoSubject.next(newData);
    this.saveDataToStorage(newData, key);
  }
  
  setProductsData(data: any[], key: string): void {
    const existingData = this.productsDataSubject.value || [];
    
    // Ensure that the new data is treated as an array
    const newData = Array.isArray(data) ? data : [data];
  
    // Append the new data to the existing array
    const updatedData = [...existingData, ...newData];
  
    // Update the productsDataSubject and save to storage
    this.productsDataSubject.next(updatedData);
    this.saveDataToStorage(updatedData, key);
  }

  getProductsInfo(){
    this.productsInfo$.subscribe(data=>{
      if(!data){
        this.ms.getBrandCategories().subscribe((res:any)=>{
          if(res.success){
            const data = {
              data: res.data,
              brands: res.brands,
              categories: res.categories,
              subcategories: res.subcategories,
              products: res.products
            }
            this.setProductsInfoData(data, 'productsinfo');            
          }
        })
      }
    })
  }

  

  addNewProduct(product: any): void {
    const currentData = this.productsDataSubject.value || [];
  
    // Check if the product already exists based on its unique identifier (_id)
    const isProductExists = currentData.some((existingProduct: any) => existingProduct._id === product._id);
  
    if (!isProductExists) {
      // Append the new product to the existing array
      const updatedData = [...currentData, product];
  
      // Update the productsDataSubject and save to storage
      this.productsDataSubject.next(updatedData);
      this.saveDataToStorage(updatedData, 'products');
    } else {
      console.log('Product already exists. Duplicate not added.');
    }
  }
  
  
  
  
  
  
  
  
  

  private saveDataToStorage(data: any, key: string): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  private loadDataFromStorage(key:string): any {
    const storedData = localStorage.getItem(key);
    return storedData ? JSON.parse(storedData) : null;
  }
}
