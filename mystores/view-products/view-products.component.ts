import { Component, OnInit, ViewChild } from '@angular/core';
import { MasterServiceService } from 'src/app/services/master-service.service';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/Interfaces/product';
import {SelectionModel} from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AuthService } from 'src/app/auth.service';
import * as moment from 'moment';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { EditProductModalComponent } from './edit-product-modal/edit-product-modal.component';

@Component({
  selector: 'app-view-products',
  templateUrl: './view-products.component.html',
  styleUrls: ['./view-products.component.css']
})
export class ViewProductsComponent implements OnInit{
  // viewchild
  @ViewChild(MatPaginator) paginator!:MatPaginator;
  @ViewChild(MatSort) sort!:MatSort;
  // properties
  storeId!:any;
  products!:Product[];
  displayedColumns: string[] = ['select','name', 'brand', 'model', 'category', 'subcategory', 'bp', 'sp', 'quantity', 'approved', 'verified', 'createdAt', 'Actions'];

  selection = new SelectionModel<Product>(true,[]);
  dataSource!:MatTableDataSource<Product>;
  length!:any;
  productDetails!:any;
  showProductFeatures!:boolean;
  showEditProduct!:boolean;

  // constructor
  constructor(private dialog:MatDialog, private authService:AuthService, private ms: MasterServiceService, private activateRoute:ActivatedRoute, private skb:MatSnackBar){}


  ngOnInit(){
    this.getStoreId();
    this.dataRepopulate();
    
  }
  deleteProduct(id:any, name:any, model:any){
    
    if(confirm(`Do you want to delete Product: ${name} Model: ${model}? Click OK to Proceed or CANCEL to Exit.`)){
      this.authService.deleteProduct(id).subscribe((data:any)=>{
        if(data.success){
          this.openSkb(data.message);
          // reload the table
          this.dataRepopulate();
        }
      })
    }


  }

  openSkb(message:any){
    this.skb.open(message, 'CLOSE', {
      horizontalPosition:'right',
      verticalPosition: 'bottom'
    });
  }

  getStoreId(){
    this.activateRoute.queryParams.subscribe(params=>{
      this.storeId = params['storeId'];
    })
  }
  // table logic
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if(this.dataSource.paginator){
      this.dataSource.paginator.firstPage();
    }
  }
  // format date
   //format date
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
// selection logic
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
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
  dataRepopulate(){
    this.ms.getPrdoucts(this.storeId).subscribe((data:any)=>{
      this.products = data.data;
      this.dataSource = new MatTableDataSource(this.products);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.length = this.dataSource.data.length;
    })
  
    
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

}
