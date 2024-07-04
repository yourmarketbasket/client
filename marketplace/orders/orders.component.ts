import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MasterServiceService } from 'src/app/services/master-service.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit{
  // constructor
  constructor(private activateRoute: ActivatedRoute, private ms: MasterServiceService){}
  storeid:any;


  ngOnInit(): void {
    // get the store id from the route
    this.activateRoute.queryParams.subscribe(params=>{
      this.storeid = params['storeid'];
    })  
      // get the orders from the store
    this.ms.getGroupedStoreOrders(this.storeid).subscribe((res:any)=>{
      console.log(res);
    });
    
    
  }


}
