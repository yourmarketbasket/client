import { Component,OnInit, HostListener, ViewChild } from '@angular/core';
import { MasterServiceService } from 'src/app/services/master-service.service';
import { truncateString } from 'src/app/services/computations';
import { Router } from '@angular/router';
import { AddToCartComponent } from '../add-to-cart/add-to-cart.component';
import { MatDialog } from '@angular/material/dialog';
import { SharedDataService } from 'src/app/services/shared-data.service';
import { SocketService } from 'src/app/services/socket.service';
import { NzCarouselComponent } from 'ng-zorro-antd/carousel';

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
    batchSize:number = 14;
    startIndex:number = 0;
    hasMore!:boolean;
    lazyLoadedProducts:any[] = [];
    searchStartIndex:number = 0;
    searchBatchSize:number = 5;
    array = [1, 2, 3, 4];
    dotPosition = 'bottom';
    carouselData!:any;
    carouselProducts:any[]=[];

    @ViewChild(NzCarouselComponent, { static: false })
  myCarousel!: NzCarouselComponent;

    goTo(index:number) {
      this.myCarousel.goTo(Number(index));
    }

    next() {
      this.myCarousel.next();
    }
    previous() {
      this.myCarousel.pre();
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
    viewProduct(product:any){
      this.sharedData.setProductData(product, 'product');
      // navigate tot he product view page
      this.router.navigate(['/market_place/product']);
    }
    // get all products
    fetchAllProducts(){
      this.ms.getAllProducts().subscribe((res:any)=>{
        if(res.success){
          this.sharedData.setProductsData(res.data, 'products');
          this.sharedData.productsData$.subscribe(data=>{            
            this.lazyLoadedProducts.push(...data);
          })
        }else{
          this.err = "Error Occured Fetching Data"
        }
      })

    }
    // add product to cart    
    addToCart(id:any, quantity:any){
      const userid = localStorage.getItem('userId')
      if(userid){
        const dialogRef = this.dialog.open(AddToCartComponent, {
          width: '400px',
          disableClose: true,
          data: {
            id:id,
            quantity: quantity
          }
        });
        dialogRef.afterClosed().subscribe(result=>{
          console.log(result)
        })
      }else{
        this.router.navigate(['/login'])
      }     
      
    }

    
    // convert to shor scale
    convertNumberToShortScale(input: number | string, discountPercentage: number | string = '0'): string {
        const number = typeof input === 'string' ? parseFloat(input) : input;
        const discount = typeof discountPercentage === 'string' ? parseFloat(discountPercentage) : discountPercentage;
    
        if (isNaN(number)) {
            return 'Invalid input';
        }
    
        if (isNaN(discount) || discount < 0 || discount > 100) {
            return 'Invalid discount percentage';
        }
    
        const discountedNumber = number * (1 - discount / 100);
        let result = "";
    
        if (discountedNumber >= 1000000000) {
            result = `${(discountedNumber / 1000000000).toFixed(1)}B`;
        } else if (discountedNumber >= 1000000) {
            result = `${(discountedNumber / 1000000).toFixed(1)}M`;
        } else if (discountedNumber >= 1000) {
            result = `${(discountedNumber / 1000).toFixed(1)}k`;
        } else {
            result = discountedNumber.toFixed(2);
        }
    
        // Remove trailing zeros
        result = result.replace(/\.?0*$/, "");
    
        return result;
    }
  
       

    // constructor
    constructor(private ms:MasterServiceService,private router:Router, private dialog: MatDialog, private sharedData: SharedDataService, private socketService:SocketService){}
    // onInit
    ngOnInit() {
      this.userid = localStorage.getItem('userId')      
      this.ms.searchQuery$.subscribe((query) => {
        this.searchQuery = query;
        this.searchMarket(this.searchQuery, this.products);
      });
      this.socketService.listen('addproductevent').subscribe((data:any) => {
        this.lazyLoadedProducts.push(data.product);
        this.sharedData.addNewProduct(data.product);    
      });
      this.sharedData.productsData$.subscribe(data=>{
        if(data){
          this.lazyLoadedProducts.push(...data);
        }else{
          this.fetchAllProducts()
        }
      })

      this.sharedData.productsInfo$.subscribe((data:any)=>{
        if(data){
          this.carouselData=data;
          // Iterate over the keys of the object
          Object.entries(data.products).forEach(([key, value]) => {
            this.carouselProducts.push({key, value});
            // Access the value associated with the key
          });

        }else{
          this.sharedData.getProductsInfo();
        }
      })

      
      


    }

    computeDiscountedSP(price:any, discount:any){
      if(discount){
        return price*((100-discount)/100)
      }else{
        return price;
      }
    }


  
    
}
