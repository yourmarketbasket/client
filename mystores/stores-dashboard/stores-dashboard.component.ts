import { Component, ElementRef, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver, Type } from '@angular/core';
import { AuthService } from 'src/app/auth.service';
import { Store } from 'src/app/mystores/stores-dashboard/stores-interface';
import { SocketService } from 'src/app/services/socket.service';
import { NavigationEnd, Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ManageStoresComponent } from '../manage-stores/manage-stores.component';
import { MasterServiceService } from 'src/app/services/master-service.service';
import { computePercentageOfExpectedGrossProfit } from 'src/app/services/computations';
import { DomSanitizer } from '@angular/platform-browser';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AddProductsComponent } from '../add-products/add-products.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { Product } from 'src/app/Interfaces/interfaces-master-file';
import { EditProductModalComponent } from '../view-products/edit-product-modal/edit-product-modal.component';
import moment from 'moment';


@Component({
  selector: 'app-stores-dashboard',
  templateUrl: './stores-dashboard.component.html',
  styleUrls: ['./stores-dashboard.component.css'],
})
export class StoresDashboardComponent implements OnInit{
  @ViewChild('componentoutlet', { read: ViewContainerRef }) componentOutlet!: ViewContainerRef;
  @ViewChild(MatPaginator) paginator!:MatPaginator;
  @ViewChild(MatSort) sort!:MatSort;
  selection = new SelectionModel<Product>(true,[]);
  dataSource!:MatTableDataSource<Product>;
  stores: Store[];
  userId!: any;
  reload = false;
  storeid!:any;
  cepgp!:any;
  storeProfitability:any={};
  activeStoreID:any;
  storename:any;
  location:any;
  mapurl:any;
  length!:any;
  productDetails!:any;
  showProductFeatures!:boolean;
  products:any;
  showEditProduct!:boolean;
  title= "Stores Dashboard";
  displayedProductColumns: string[] = ['select','name', 'brand', 'model', 'category', 'subcategory', 'bp', 'sp', 'quantity', 'approved', 'verified', 'createdAt', 'Actions'];

  constructor(private ms:MasterServiceService,private router: Router, private activateRoute: ActivatedRoute, private authService: AuthService, private socketService: SocketService, private componentFactoryResolver: ComponentFactoryResolver, private domSanitizer:DomSanitizer,private dialog: MatDialog, private skb:MatSnackBar) { 
    this.stores = [];
  }

  async ngOnInit() {
    
    this.userId = localStorage.getItem('userId');
    // get the stores affiliated to the user
    this.authService.getStores(this.userId).subscribe((response: any) => {
      if(response.success){
        this.stores = response.data;
      }
    });


    this.activateRoute.queryParams.subscribe(params => {
      if(params['storeId']){
        this.manageStore(params['storeId']);
        this.storeid = params['storeId']
      }
    });

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Get the current component and call a method to update its content
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(ManageStoresComponent as Type<ManageStoresComponent>);
        const componentRef = this.componentOutlet.createComponent(componentFactory);
        const component = componentRef.instance as ManageStoresComponent;
      }
    });
    // display the profitability
    this.getProfitability();

  }
  setActiveStoreID(event:any){
    this.activeStoreID = this.stores[event.index]._id;
    this.storename = this.stores[event.index].storename;  

    this.location = this.stores[event.index].location;
    this.dataRepopulate(this.activeStoreID);

    window.document.title = this.title;
      const mapurl = `https://www.google.com/maps/embed/v1/place?key=AIzaSyDdvqTHmz_HwPar6XeBj8AiMxwzmFdqC1w&q=(${this.location.latitude},${this.location.longitude})&center=${this.location.latitude},${this.location.longitude}&zoom=18&maptype=roadmap`;
      this.mapurl = this.domSanitizer.bypassSecurityTrustResourceUrl(mapurl);
    
  }
  // manage store
  async manageStore(id:any){
    const data = {userid: this.userId, storeId: id};
    this.router.navigate(['dashboard/stores-dashboard/manage-store/'], {queryParams: {userId: this.userId, storeId: id}});
  }
  addProductToStore(storeid:any){
    // navigate to add product page
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "90%";
    dialogConfig.data = {
      storeid: storeid,
      storename: this.storename
    };
    const dialogRef = this.dialog.open(AddProductsComponent, dialogConfig);
       
    
  }

  readableDate(date: any) {
    const now = moment();
    const inputDate = moment(date);

    if (now.diff(inputDate, 'seconds') < 5) {
      return 'a few seconds ago';
    } else if (inputDate.isSame(now, 'day')) {
      return inputDate.format('LT');
    } else if (inputDate.isSame(now.clone().subtract(1, 'day'), 'day')) {
      return 'Yesterday';
    } else if (inputDate.isSame(now, 'month')) {
      return inputDate.format('MMM D');
    } else {
      return inputDate.format('MMM D, YYYY');
    }
  }

  editProduct(id:any){
      this.showEditProduct = true;
      this.showProductFeatures = false;
    this.ms.fetchProductDetails(id).subscribe((data:any)=>{
      if(data.success){
        const dialogref = this.dialog.open(EditProductModalComponent, {
          data: data.product[0],
          width: 'auto',
          height: 'auto'
        })
  
      }
    })

    

  }

  deleteProduct(id:any, name:any, model:any){
    
    if(confirm(`Do you want to delete Product: ${name} Model: ${model}? Click OK to Proceed or CANCEL to Exit.`)){
      this.authService.deleteProduct(id).subscribe((data:any)=>{
        if(data.success){
          this.openSkb(data.message);
          // reload the table
          // this.dataRepopulate();
        }
      })
    }


  }

  dataRepopulate(storeid:any){
    this.ms.getPrdoucts(this.storeid).subscribe((data:any)=>{
      console.log(data);
      this.products = data.data;
      this.dataSource = new MatTableDataSource(this.products);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.length = this.dataSource.data.length;
    })      
  }
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }
  checkboxLabel(product?: Product): string {
    if (!product) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(product) ? 'deselect' : 'select'} Product ${product.name}`;
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.length;
    return numSelected === numRows;
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if(this.dataSource.paginator){
      this.dataSource.paginator.firstPage();
    }
  }

  openSkb(message:any){
    this.skb.open(message, 'CLOSE', {
      horizontalPosition:'right',
      verticalPosition: 'bottom'
    });
  }
  async getProfitability(){

    for(const store of this.stores){
      this.cepgp = await computePercentageOfExpectedGrossProfit(this.storeid,this.ms, this.authService)
      Object.assign(this.storeProfitability, {[store.storename]: this.cepgp})
      console.log(store.storename, this.cepgp)

    }
    // console.log(this.storeProfitability)
  }
}
