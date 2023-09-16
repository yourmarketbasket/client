import { Component, OnInit, ViewChild, AfterViewInit, Injectable} from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MasterServiceService } from 'src/app/services/master-service.service';
import { DatePipe } from '@angular/common';
import {MatTableDataSource, MatTableModule} from '@angular/material/table'
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subject } from 'rxjs';
import * as moment from 'moment';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/auth.service';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

interface Product{
  _id:number;
  name: string;
  storeid:string;
  brand:string;
  model:string;
  description:string;
  category:string;
  subcategory:string;
  bp:number;
  sp:number;
  avatar:[];
  features:[];
  quantity:number;
  approved:boolean;
  verified:boolean;
  createdAt:Date;

}



@Component({
  selector: 'app-review-products',
  templateUrl: './review-products.component.html',
  styleUrls: ['./review-products.component.css']
  
})


export class ReviewProductsComponent implements OnInit{

  
  

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  // Update with your slide images
  images!:[]; 
  currentIndex: number = 0;
  loading:boolean = true;
  selectedProductId!:string;
  showOverlay:boolean = false;
  selectedProductDescription: any;
  selectedProductVerified!: boolean;  
  length!:any;  
  products:Product[] = [];
  dataSource!: MatTableDataSource<Product>;
  displayedColumns:string[] = ['select','name', 'brand', 'category', 'model','bp','sp','quantity','createdAt'];
  selection = new SelectionModel<Product>(true, []);
  product_rev_details!:any;
  product_name!:any; product_description!:any; product_images!:any;
  userid!:any;
  advancedActionAllowed!:any;
  

  previousImage() {
    if (!this.loading && this.currentIndex > 0) {
      this.loading = true;
      this.currentIndex--;
    }
  }

  nextImage() {
    if (!this.loading && this.currentIndex < this.images.length - 1) {
      this.loading = true;
      this.currentIndex++;
    }
  }

  onImageLoad() {
    this.loading = false;
  }



   


  
  
  constructor(private snackBar:MatSnackBar, private ms: MasterServiceService, private datePipe: DatePipe, private http: HttpClient, private authService: AuthService){

  }

  openSnackBar(message:any, action:any){
    this.snackBar.open(message, action, {
      horizontalPosition: 'right',
      verticalPosition: 'bottom'
    })
  }
  
  
 
  showOverLayButtons(){
    this.showOverlay = true;

  }
  hideOverlayButtons(){
    this.showOverlay = false;
  }

  ngOnInit() {

    document.title = "Product Review"
    this.dataRepopulate();
   

    
  }
 
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
    applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();

      if(this.dataSource.paginator){
        this.dataSource.paginator.firstPage();
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

    /** The label for the checkbox on the passed row */
    checkboxLabel(product?: Product): string {
      if (!product) {
        return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
      }
      return `${this.selection.isSelected(product) ? 'deselect' : 'select'} Product ${product.name}`;
    }

    viewProduct(pname:any, pverified:any, pdescription:any, pimage:any, id:any){
      this.images = pimage;
      this.loading = true;
      this.selectedProductId = id;
      this.selectedProductDescription = pdescription;
      this.selectedProductVerified = pverified;
    }
    approveListedItem(id:any){
      const data = {
        action:"approve",
        id:id
      }

      this.authService.reviewListedItemAction(data).subscribe((data:any)=>{
        if(data.success){
          this.openSnackBar(data.message, 'CLOSE')
          this.dataRepopulate()
        }
      })   
        
      
    }
    rejectListedItem(id:any){
      const reason = prompt("Please give your reason for rejection!");
      if (reason!==""){
        const data = {
          action:"reject",
          id:id,
          reason:reason,
        }
  
        this.authService.reviewListedItemAction(data).subscribe((data:any)=>{
          if(data.success){
            this.openSnackBar(data.message, 'CLOSE')
            this.dataRepopulate()
          }
        })   
      }
      
    }
    // repopulate the data when changes occur to the table
    dataRepopulate(){
      this.userid = localStorage.getItem('userId')
    
      // check if advanced action is allowed
      // console.log(this.userid)
      this.ms.advancedActionAllowed({id:this.userid}).subscribe((data:any)=>{
        if(data.allowed){
          this.advancedActionAllowed = true
          // get the products
          this.ms.reviewProducts({allowed: this.advancedActionAllowed}).subscribe((data:any)=>{
            this.products = data;
            this.dataSource = new MatTableDataSource(this.products);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.length = this.dataSource.data.length;
  
  
          })
        }
      })
    }
    

   
  

}
