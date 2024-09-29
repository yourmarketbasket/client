import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { Order } from 'src/app/Interfaces/interfaces-master-file';
import { MasterServiceService } from 'src/app/services/master-service.service';
import { MatDialog } from '@angular/material/dialog';
import { ProcessOrderComponent } from 'src/app/mystores/process-order/process-order.component';
import { SelectStoreDialogComponent } from './select-store-dialog/select-store-dialog.component';



@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})

export class OrdersComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  storeid: any;
  selectedStore: any;
  displayedColumns: string[] = ['select','Client', 'Contact',  'Pay Status', 'OrderStatus','TransactionID', 'Actions'];
  selection = new SelectionModel<Order>(true, []);
  OrdersDataSource = new MatTableDataSource<Order>([]); // Initialize with an empty data source
  orders: Order[] = [];
  userid: any;

  constructor(private ms: MasterServiceService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.selectedStore = localStorage.getItem('selectedStore');
    if (!this.selectedStore) {
      this.selectStore();
    }
    this.getStoreOrders(this.selectedStore);
  }

  ngAfterViewInit(): void {
    // Ensure paginator and sort are set after view is initialized
    if (this.OrdersDataSource) {
      this.OrdersDataSource.paginator = this.paginator;
      this.OrdersDataSource.sort = this.sort;
    }
  }

  selectStore() {
    localStorage.removeItem("selectedStore");
    const dialogRef = this.dialog.open(SelectStoreDialogComponent, {
      width: 'auto',
      data: { userid: this.userid },
      disableClose: true // Prevent closing on outside click
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getStoreOrders(result._id);
      } else {
        console.log("Dialog closed without selecting a store.");
      }
    });
  }

  getStoreOrders(storeid: any) {
    this.ms.getStoreOrders(storeid).subscribe((res: any) => {
      this.orders = res.orders;
      this.OrdersDataSource.data = this.orders; // Set the new data
      // Assign paginator and sort after data is set
      if (this.paginator && this.sort) {
        this.OrdersDataSource.paginator = this.paginator;
        this.OrdersDataSource.sort = this.sort;
      }
    });
  }

  processOrder(data: any) {
    if(data){
      const dialogRef = this.dialog.open(ProcessOrderComponent, {
        data: data,
        width: 'auto',
        height: 'auto'
      });
    }else{
      console.log("no data from parent")
    }
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.OrdersDataSource.data.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.selection.select(...this.OrdersDataSource.data);
    }
  }

  checkboxLabel(order?: Order): string {
    if (!order) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(order) ? 'deselect' : 'select'} Product ${order.buyername}`;
  }
}
