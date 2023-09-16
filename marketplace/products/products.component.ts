import { Component,OnInit, HostListener } from '@angular/core';
import { MasterServiceService } from 'src/app/services/master-service.service';
import { truncateString } from 'src/app/services/computations';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit{
    
    // properties
    dWidth!:any;
    dHeight!:any;
    products:any[] = [];
    err!:any;
    favorite:boolean=false;
    page:number = 1;
    userid!:any;
    isfavorite!:boolean;
    searchQuery!:any;
    searchedProduct:any[]=[]
    numberOfResults:any;
    numberofDisplayedProducts!:number;
    batchSize:number = 20;
    startIndex:number = 0;
    hasMore!:boolean;
    lazyLoadedProducts:any[] = [];
    searchStartIndex:number = 0;
    searchBatchSize:number = 5;
    // host listener
    @HostListener('window:resize', ['$event'])
    onResize(event:any){
      this.updateScreenSize();
      // update the number of products
      this.updateNumberOfDisplayedProducts(this.dWidth)
      // this.loadProducts();

    }
    // update the number of products
    updateNumberOfDisplayedProducts(width:number){
      if(width<=1536){
          this.numberofDisplayedProducts = 10
      }else{
        this.numberofDisplayedProducts = 30
      }
    }
    // methods
    toggleFavorite(product:any){
        if(this.userid !== null){
          product.favorite = !product.favorite
          // mark as favorite
          if(this.markFavorite(product,product.favorite)){
            product.favorite = !product.favorite
          }
        }else{
          this.router.navigate(['/login'])
        }
        
       
    }
    // lazy load products
    async loadProducts(){
      const data = {
        batchSize: this.batchSize, 
        startIndex: this.startIndex
      }
      this.ms.getLazyLoadedProducts(data).subscribe((res:any)=>{
        if(res.success){
          this.lazyLoadedProducts.push(...res.data);
          this.startIndex += this.batchSize;
            if(res.data.length>0){
              this.hasMore = true
            }else{
              this.hasMore = false;
            }
        }else{
          alert('Error'+res.err)
        }
      })
    }
    // truncate the name and model
    truncateName(name:any){
      return truncateString(name);
    }
    discountedPrice(sp:any,discount:any){
      if(!discount){
        return sp.toLocaleString('en-US');
      }else{
         const discountedprice = sp*((100-discount)/100);
        return discountedprice.toLocaleString('en-US')
      }

    }
    // search products
    searchMarket(query:any, products:any){
      if(query){
          const data = {
            query: query,
            startIndex: this.searchStartIndex,
            batchSize: this.searchBatchSize
          }
          this.ms.searchProduct(data).subscribe((res:any)=>{
            this.searchedProduct = [];
            this.numberOfResults = 0;
            if(res.data.length>0){
              this.searchedProduct = res.data
              this.numberOfResults = res.data.length;
            }else{
              console.log("Error occured "+res.message)
            }
          })        
      }
      

      

    }
    // update screen size
    updateScreenSize(){
      this.dHeight = window.innerHeight;
      this.dWidth = window.innerWidth;
    }
    // mark a product favorite for persistence
    markFavorite(product:any, favorite:Boolean): Boolean{
      let success = false;
        const data = {
          productid: product._id,  
          userid:localStorage.getItem('userId'),     
          favorite:favorite   
        }
        if(localStorage.getItem('userId')!==null){
            this.ms.addFavorite(data).subscribe((res:any)=>{
                if(res.success){
                  success = true;
                }else{
                  success = false;
                }
            })
        }else{
          success = false
        }
        
        return success;
    }
    // view product
    viewProduct(id:any){
      // navigate tot he product view page
      this.router.navigate(['/product'], {queryParams: {id:id}})
    }
    // get all products
    fetchAllProducts(){
      this.ms.getAllProducts().subscribe((res:any)=>{
        if(res.success){
          this.products = res.data;
        }else{
          this.err = "Error Occured Fetching Data"
        }
      })

    }

       

    // constructor
    constructor(private ms:MasterServiceService,private router:Router){}
    // onInit
    ngOnInit() {
      this.updateScreenSize();
      this.updateNumberOfDisplayedProducts(this.dWidth)
      this.userid = localStorage.getItem('userId')
      this.loadProducts();
      
      // fetch the products
      // this.fetchAllProducts()
      
      this.ms.searchQuery$.subscribe((query) => {
        this.searchQuery = query;
        this.searchMarket(this.searchQuery, this.products);
      });


    }
    
}
