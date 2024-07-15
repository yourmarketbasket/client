import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {SelectionModel} from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Order } from 'src/app/Interfaces/interfaces-master-file';
import { MasterServiceService } from 'src/app/services/master-service.service';
import { MatDialog } from '@angular/material/dialog';
import { ProcessOrderComponent } from 'src/app/mystores/process-order/process-order.component';

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
  // 'PayID', 'PayStatus','View Route', 
  displayedColumns: string[] = ['select','Client','# Items','Total Amount','Pay Status','Route','OrderStatus','Actions'];

  selection = new SelectionModel<Order>(true,[]);
  dataSource!:MatTableDataSource<Order>;
  orders!:Order[];
  length!:any;
  // constructor
  constructor(private activateRoute: ActivatedRoute, private ms: MasterServiceService, private dialog:MatDialog,){}


  ngOnInit(): void {
    // get the store id from the route
    this.activateRoute.queryParams.subscribe(params=>{
      this.storeid = params['storeid'];
    })  
      // get the orders from the store
    this.dataRepopulate();
    
    
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if(this.dataSource.paginator){
      this.dataSource.paginator.firstPage();
    }
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

  dataRepopulate(){
    this.ms.getGroupedStoreOrders(this.storeid).subscribe((data:any)=>{
      this.orders = data.orders;
      this.dataSource = new MatTableDataSource(this.orders);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.length = this.dataSource.data.length;
    })
  
    
  }

  processOrder(data:any){
    const dialogref = this.dialog.open(ProcessOrderComponent, {
      data: data,
      width: 'auto',
      height: 'auto'
    })

   

  }
  
  


}
