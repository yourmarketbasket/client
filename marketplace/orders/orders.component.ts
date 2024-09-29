import { Component, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {SelectionModel} from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Order, Payment,  } from 'src/app/Interfaces/interfaces-master-file';
import { MasterServiceService } from 'src/app/services/master-service.service';
import { MatDialog } from '@angular/material/dialog';
import { ProcessOrderComponent } from 'src/app/mystores/process-order/process-order.component';
import { SelectStoreDialogComponent } from './select-store-dialog/select-store-dialog.component';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})

export class OrdersComponent implements OnInit{
  // properties
  @ViewChild(MatPaginator) paginator!:MatPaginator;
  @ViewChild(MatSort) sort!:MatSort;
  storeid:any;
  selectedStore:any;
  // 'PayID', 'PayStatus','View Route', 
  displayedColumns: string[] = ['select','Client','items','Total Amount','Pay Status','Route','OrderStatus','Actions'];

  selection = new SelectionModel<Order>(true,[]);
  dataSource!:MatTableDataSource<Order>;
  orders!:any;
  length!:any;
  userid: any;
  // constructor
  constructor(private activateRoute: ActivatedRoute, private ms: MasterServiceService, private dialog:MatDialog,){}


  ngOnInit(): void {
    this.selectedStore = localStorage.getItem('selectedStore');
    if(!this.selectedStore){
      this.selectStore();
    }
    this.getStoreOrders(this.selectedStore);
      
  }

  changeStore(){
    this.selectStore();
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.length;
    return numSelected === numRows;
  }
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }
  checkboxLabel(order?: Order): string {
    if (!order) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(order) ? 'deselect' : 'select'} Product ${order.buyername}`;
  }

  
  
  selectStore(){
    const dialogRef = this.dialog.open(SelectStoreDialogComponent, {
      width: 'auto',
      data: {
        userid: this.userid
      },
      disableClose: true // Prevent closing on outside click
    });
  
    // After the dialog is closed, you can retrieve the data passed back
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getStoreOrders(result._id)
      } else {
        console.log("Dialog closed without selecting a store.");
      }
    });
  }
  

  getStoreOrders(storeid:any){
    // get the store orders for the selected ID
    this.ms.getStoreOrders(storeid).subscribe((res: any) => {
      this.orders = res.orders;
      this.dataSource = new MatTableDataSource(this.orders); // Initialize dataSource
      this.dataSource.paginator = this.paginator; // Assign paginator
      this.dataSource.sort = this.sort; 
    });

  }

  processOrder(data:any){
    const dialogref = this.dialog.open(ProcessOrderComponent, {
      data: data,
      width: 'auto',
      height: 'auto'
    })

   

  }
  
  


}
