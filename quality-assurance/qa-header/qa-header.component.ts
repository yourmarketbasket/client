import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {SocketService} from '../../services/socket.service';
import {AuthService} from '../../auth.service';
import { MasterServiceService } from 'src/app/services/master-service.service';
@Component({
  selector: 'app-qa-header',
  templateUrl: './qa-header.component.html',
  styleUrls: ['./qa-header.component.css']
})
export class QaHeaderComponent implements OnInit{
  connectedUser = '';
  numOfProductstoReview = 0;
  @Output() toggleSidebar = new EventEmitter<any>();

  constructor(
    private socketService: SocketService,
    private authService: AuthService,
    private masterService: MasterServiceService
    ) 
    { }
  
  toggleThisSidebar(){ 
    this.toggleSidebar.emit();
  }
  ngOnInit() {
    this.masterService.getNumOfUnapprovedProducts().subscribe((data:any)=>{
      if(data.success){
        this.numOfProductstoReview = data.number;
      }

    })
    // get the user id from the local storage
    const userId = localStorage.getItem('userId');
    // get the user details from the auth service
    this.authService.getUser(userId).subscribe((data: any) => {
      if(data.success){
        this.connectedUser = data.data.fname
      }
    });
    // get the number of unapproved products
    
    
  }

}
