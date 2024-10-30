import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatSidenav, MatSidenavModule  } from '@angular/material/sidenav';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { CreatestoreComponent } from '../mystores/createstore/createstore.component';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Store } from '../mystores/stores-dashboard/stores-interface';
import { SocketService } from '../services/socket.service';
import { MasterServiceService } from '../services/master-service.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';

export interface OrdersData {
  items: string;
  total: number;
  deliveryFee: number;
  paymentStatus: string;
}

export interface StoresData {
  name: string;
  type: string;
  currency: string;
  items:number;
  totalvalue:number;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})


export class ProfileComponent implements OnInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  rating = 3.2;
  isLoading = true;
  stores:any;
  userId: any;
  displayedColumns: string[] = ['#', 'items', 'total', 'deliveryFee', 'paymentStatus', 'actions'];
  displayedStoresColumns: string[] = ['#', 'name', 'items', 'totalvalue', 'actions'];
  phone = "";
  avatar = "";
  name = "";
  dob = "";
  verified = false;
  address = "";
  vendor = false;
  email = "";
  registered = "";
  client = false;
  title='Profile';
  showManageStoreComponent = false;
  approved: any;
  gender: any;
  city: any;
  active: any;
  zipcode: any;
  createdAt:any;
  location:any;
  mapurl:any;
  orders:any;
  dataSource = new MatTableDataSource<OrdersData>();  // Initialize in the class
  storesDataSource: any;
  
  constructor(private socketService: SocketService, private ms: MasterServiceService, private router: Router, private domSanitizer:DomSanitizer, private authService: AuthService, private dialog: MatDialog) { 
  
  }
  openDialog(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    this.dialog.open(CreatestoreComponent, dialogConfig);

  }
  userLogout(){
    this.authService.logout();
  }
  
  range(count: number) {
    return Array.from({length: count}, (x, i) => i + 1);
  }
  editUserInfo(){
      
  }

  calculateTimeDifference(dateString: string): string {
    const targetDate = new Date(dateString);
    const currentDate = new Date();

    // Get the total difference in milliseconds
    const diffInMs = Math.abs(currentDate.getTime() - targetDate.getTime());

    // Helper values for conversions
    const msPerSecond = 1000;
    const msPerMinute = msPerSecond * 60;
    const msPerHour = msPerMinute * 60;
    const msPerDay = msPerHour * 24;
    const msPerWeek = msPerDay * 7;
    const msPerMonth = msPerDay * 30.44;  // Average month length
    const msPerYear = msPerDay * 365.25;  // Accounting for leap years

    // Calculate years, months, weeks, days, hours, minutes, and seconds
    const years = Math.floor(diffInMs / msPerYear);
    const remainingAfterYears = diffInMs % msPerYear;

    const months = Math.floor(remainingAfterYears / msPerMonth);
    const remainingAfterMonths = remainingAfterYears % msPerMonth;

    const weeks = Math.floor(remainingAfterMonths / msPerWeek);
    const remainingAfterWeeks = remainingAfterMonths % msPerWeek;

    const days = Math.floor(remainingAfterWeeks / msPerDay);
    const remainingAfterDays = remainingAfterWeeks % msPerDay;

    const hours = Math.floor(remainingAfterDays / msPerHour);
    const remainingAfterHours = remainingAfterDays % msPerHour;

    const minutes = Math.floor(remainingAfterHours / msPerMinute);
    const remainingAfterMinutes = remainingAfterHours % msPerMinute;

    const seconds = Math.floor(remainingAfterMinutes / msPerSecond);

    // Conditional logic for returning only two units at once
    if (years > 0 && months > 0) {
        return `${years} year${years !== 1 ? 's' : ''}, ${months} month${months !== 1 ? 's' : ''}`;
    } else if (months > 0 && weeks > 0) {
        return `${months} month${months !== 1 ? 's' : ''}, ${weeks} week${weeks !== 1 ? 's' : ''}`;
    } else if (weeks > 0 && days > 0) {
        return `${weeks} week${weeks !== 1 ? 's' : ''}, ${days} day${days !== 1 ? 's' : ''}`;
    } else if (days > 0 && hours > 0) {
        return `${days} day${days !== 1 ? 's' : ''}, ${hours} hour${hours !== 1 ? 's' : ''}`;
    } else if (hours > 0 && minutes > 0) {
        return `${hours} hour${hours !== 1 ? 's' : ''}, ${minutes} minute${minutes !== 1 ? 's' : ''}`;
    } else if (minutes > 0 && seconds > 0) {
        return `${minutes} minute${minutes !== 1 ? 's' : ''}, ${seconds} second${seconds !== 1 ? 's' : ''}`;
    } else if (seconds > 0) {
        return `${seconds} second${seconds !== 1 ? 's' : ''}`;
    } else {
        return '0 seconds';
    }
  }

  

  @ViewChild(MatPaginator) paginator!: MatPaginator;
   

  async ngOnInit() { 
    // change the window title
    // get the user id from the local storage
    this.userId = localStorage.getItem('userId');
    
    // get user details from auth service
    this.authService.getUser(this.userId).subscribe((data: any) => {
      if(data.success){
        const date = new Date(data.data.dob);
        this.avatar = data.data.avatar;
        this.name = data.data.fname+" "+data.data.lname;
        this.phone = data.data.phone;
        this.dob = date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear();
        this.verified = data.data.verified;
        this.address = data.data.address.toUpperCase();
        this.vendor = data.data.vendor;
        this.email = data.data.email;
        this.registered = data.data.createdAt;
        this.client = data.data.client;
        this.approved = data.data.approved;
        this.gender = data.data.gender.toUpperCase()
        this.city = data.data.city.toUpperCase();
        this.active = data.data.active;
        this.zipcode = data.data.zipcode;
        this.location = data.data.location;

      }
      window.document.title = this.title+" | "+this.name;
      const mapurl = `https://www.google.com/maps/embed/v1/place?key=AIzaSyDdvqTHmz_HwPar6XeBj8AiMxwzmFdqC1w&q=(${this.location.latitude},${this.location.longitude})&center=${this.location.latitude},${this.location.longitude}&zoom=18&maptype=roadmap`;
      this.mapurl = this.domSanitizer.bypassSecurityTrustResourceUrl(mapurl);

      console.log(this.verified);

    }

    

    
    
    );
    // get user orders
    this.ms.getUserOrders(this.userId).subscribe((res: any) => {
      if (res.success && res.data.length > 0) {
        this.orders = res.data;
        this.dataSource = new MatTableDataSource<OrdersData>(this.orders);
        this.dataSource.paginator = this.paginator;  // Set paginator after dataSource is populated
      }
    }); 

    this.ms.getStoresAndProductsByOwnerId(this.userId).subscribe((res:any)=>{
      if(res.success && res.data){
        this.stores = res.data;
        this.storesDataSource = new MatTableDataSource<StoresData>(this.stores);
        this.storesDataSource.paginator = this.paginator;
      }
    })

    
  
   }

   getAdjustedIndex(index: number): number {
      return index + (this.paginator.pageIndex * this.paginator.pageSize) + 1;
    }
   


  

}
