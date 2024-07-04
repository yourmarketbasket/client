import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { AddProductsComponent } from '../add-products/add-products.component';
import {SocketService} from 'src/app/services/socket.service';
import { MasterServiceService } from 'src/app/services/master-service.service';
import { computeExpectedGrossProfit, computeNumberOfApprovedItems, computeNumberOfRejectedItems, computePercentageOfExpectedGrossProfit, computeTotalInvestment, computeTotalStock } from 'src/app/services/computations';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-manage-stores',
  templateUrl: './manage-stores.component.html',
  styleUrls: ['./manage-stores.component.css']
})
export class ManageStoresComponent implements OnInit {
  title = 'Manage Stores';
  storeName = "";
  storeType = "";
  storeId!: string;
  imageurl!: string;
  storeProducts: any[] = [];
  cts!:any;
  investment!:any;
  cegp!:any;
  cpegp!:any;
  ctrp: any;
  cta: any;
  rejectionRate!: number;
  rcolor!: string;
  acolor!: string;
  pcolor!: string;

  constructor(
    private activateRoute: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog,
    private socketService: SocketService,
    private cd: ChangeDetectorRef,
    private ms: MasterServiceService,
  ) { 
    
  }
  deleteProduct(productid:any){
    const confirm = window.confirm("Click [OK] to delete the product or [CANCEL] to go back");
    if(confirm){
        // delete product from the store
        this.authService.deleteProduct(productid).subscribe((data:any)=>{
          if(data.success){
            this.storeProducts = this.storeProducts.filter((product:any)=>{
              return product._id !== productid
            })
            this.updateProductsTable(this.storeId);
          }
        });
    }
    
    
  }
  viewProducts(){
    // navigate to view products page
    this.router.navigate(['/dashboard/view-products'], { queryParams: { storeId: this.storeId } });
  }
  viewOrders(){
    this.router.navigate(['/dashboard/view-orders'], { queryParams: {storeid: this.storeId}});
  }
  editProduct(productid:any){
    // navigate to edit product page
    console.log(productid)
    // this.router.navigate(['/editproduct'], { queryParams: { productid: productid } });
  }
  async ngOnInit() {
    // Subscribe to changes in the storeId parameter
    this.activateRoute.queryParams.subscribe(params => {
      const storeId = params['storeId'];
      if (storeId) {
        this.storeId = storeId;
        this.fetchStoreDetails(storeId);        
      }
    });
    // get products of the store
    this.getStoreProducts(this.storeId);
    // listen to product added event
    this.socketService.listen('new product added').subscribe((data:any)=>{
      this.storeProducts.push(data)
      this.updateProductsTable(this.storeId);
    })
    // compute total stock
    
    
  }
  updateProductsTable(storeid:any){
    this.fetchStoreDetails(storeid);
  }
  // Fetch the details of the store using the storeId and update the properties
  async fetchStoreDetails(storeId: string) {
    this.authService.getStoreDetails(storeId).subscribe((data: any) => {
      if (data.success) {
        this.storeName = data.data[0].storename;
        this.storeType = data.data[0].storetype;
        this.imageurl = data.data[0].avatar;
        this.getStoreProducts(storeId)    
        this.populateDetails(storeId)    
      } else {
        this.storeName = "404";
      }
    });
  }
  getStoreProducts(storeid:any){
    this.authService.getPrdoucts(this.storeId).subscribe((data: any) => {
     
      if (data.success) {
        this.storeProducts = data.data;
      } else {
        this.storeProducts = [];
      }
    });

  }
  // add product to the store
  addProductToStore(storeid:any){
    // navigate to add product page
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "90%";
    dialogConfig.data = {
      storeid: storeid,
      storename: this.storeName
    };
    const dialogRef = this.dialog.open(AddProductsComponent, dialogConfig);
       
    
  }

  async populateDetails(id:any){
        this.cts = await computeTotalStock(this.storeId, this.ms,this.authService)
        this.investment = await computeTotalInvestment(this.storeId, this.ms, this.authService);
        this.cegp = await computeExpectedGrossProfit(this.storeId, this.ms, this.authService);
        this.cpegp = await computePercentageOfExpectedGrossProfit(this.storeId, this.ms, this.authService)
        this.ctrp = await computeNumberOfRejectedItems(this.storeId, this.ms, this.authService)
        this.cta = await computeNumberOfApprovedItems(this.storeId, this.ms, this.authService)
        // calculations
         this.rejectionRate = parseFloat((this.ctrp/this.cts*100).toFixed(1));
        //  manage the colors
        if(this.rejectionRate<25){
          this.rcolor = 'primary';
        }else{
          this.rcolor = 'accent'
        }
        if((this.cta/this.cts*100)>33.33){
          this.acolor = 'primary';
        }else{
          this.acolor = 'accent';
        }
        if(this.cpegp>50){
          this.pcolor = 'primary';
        }else{
          this.pcolor = 'accent';
        }
  }

}
