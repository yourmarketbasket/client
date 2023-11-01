import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MasterServiceService } from 'src/app/services/master-service.service';

@Component({
  selector: 'app-payment-dialog',
  templateUrl: './payment-dialog.component.html',
  styleUrls: ['./payment-dialog.component.css']
})
export class PaymentDialogComponent implements OnInit{
  iframurl!:any;

  constructor(@Inject(MAT_DIALOG_DATA) public data:any,private ms: MasterServiceService, public dialogRef: MatDialogRef<PaymentDialogComponent>){

  }
  ngOnInit(): void {
    this.iframurl = this.data.url
  }
  refreshIframe(trackingid:any){
    // check the status of the paymment
    this.ms.confirmTransactionStatus(trackingid).subscribe((res:any)=>{
      if(res.status == 200 && res.payment_status_description == "Completed"){
        console.log("transaction confirmed")
      }else{
        console.log("transaction failed")
      }
    })
  
  }

}
