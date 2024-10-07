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

@Component({
  selector: 'app-stores-dashboard',
  templateUrl: './stores-dashboard.component.html',
  styleUrls: ['./stores-dashboard.component.css'],
})
export class StoresDashboardComponent implements OnInit{
  @ViewChild('componentoutlet', { read: ViewContainerRef }) componentOutlet!: ViewContainerRef;
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
  title= "Stores Dashboard";

  constructor(private ms:MasterServiceService,private router: Router, private activateRoute: ActivatedRoute, private authService: AuthService, private socketService: SocketService, private componentFactoryResolver: ComponentFactoryResolver, private domSanitizer:DomSanitizer,) { 
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

    window.document.title = this.title;
      const mapurl = `https://www.google.com/maps/embed/v1/place?key=AIzaSyDdvqTHmz_HwPar6XeBj8AiMxwzmFdqC1w&q=(${this.location.latitude},${this.location.longitude})&center=${this.location.latitude},${this.location.longitude}&zoom=18&maptype=roadmap`;
      this.mapurl = this.domSanitizer.bypassSecurityTrustResourceUrl(mapurl);
    
  }
  // manage store
  async manageStore(id:any){
    const data = {userid: this.userId, storeId: id};
    this.router.navigate(['dashboard/stores-dashboard/manage-store/'], {queryParams: {userId: this.userId, storeId: id}});
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
