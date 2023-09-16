import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { NointernetComponent } from './nointernet/nointernet.component';
import { AuthService } from './auth.service';
import { OnlineStatusService } from './services/online-status.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'Market Basket';
  isLoggedin = false;
  isOnline:boolean;

  sideBarOpen = false;
   // toggle sidebar
   sideBarToggler(){
    this.sideBarOpen = !this.sideBarOpen;
  }

  constructor(private cdr: ChangeDetectorRef, private http: HttpClient, private dialog: MatDialog, private onlineStatusService: OnlineStatusService, private authService: AuthService) {
    this.isOnline = this.onlineStatusService.isOnline;
    onlineStatusService.statusChanged.subscribe((isOnline: boolean) => {
      this.isOnline = isOnline;
      if(!this.isOnline){
        this.openNoInternetDialog()
        // this.dialog.open(NointernetComponent);
      }else{
        this.closeNoInternetDialog();
      }
    });
  }
  checkIfLoggedIn(){
    if(this.authService.loggedIn()){
      this.isLoggedin = true;
      this.cdr.detectChanges();
    }
  }
  // on init
  ngOnInit() {
    if(this.authService.loggedIn()){
      this.isLoggedin = true;
      this.cdr.detectChanges();
    }
  
  }
  // open dialog
  openNoInternetDialog(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    this.dialog.open(NointernetComponent, dialogConfig);

  }

  // close the no internet dialog
  closeNoInternetDialog(){
    this.dialog.closeAll();
  }
 
}
