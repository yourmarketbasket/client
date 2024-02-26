import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MasterServiceService } from 'src/app/services/master-service.service';
import { SharedDataService } from 'src/app/services/shared-data.service';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  category!:string;
  products!:any;

  constructor(private socketService:SocketService, private router:Router, private route: ActivatedRoute, private ms: MasterServiceService, private sharedData: SharedDataService){}

  ngOnInit(): void {
    this.route.params.subscribe(params=>{
      this.category = params['category'];
      this.ms.getCategoryProducts(this.category).subscribe((res:any)=>{
        if(res.success){
          this.products = res.data
        }
      })
    })

    this.socketService.listen('viewsupdate')
        .subscribe((data:any) => {
          // Update the relevant product data based on the event data
          const updatedProducts = this.products.map((product: any) => {
            if (product._id === data._id) {
              return data; // Replace the existing product data with the updated data
            }
            return product; // Return unchanged product data for other products
          });

          this.products = updatedProducts;
        

        }); 
   
  }

  viewProduct(product:any){
    this.sharedData.setProductData(product,'product');
    this.router.navigate(['market_place/product'])
  }

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


}
