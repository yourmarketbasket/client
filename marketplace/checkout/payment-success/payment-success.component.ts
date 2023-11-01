import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MasterServiceService } from 'src/app/services/master-service.service';

@Component({
  selector: 'app-payment-success',
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.css']
})
export class PaymentSuccessComponent implements OnInit{
  trackingid!:any;
  tstatus:any="Pending....";
  success!:boolean;
  processingComplete!:boolean;
  constructor(private route: ActivatedRoute, private ms: MasterServiceService){}
  ngOnInit(){
    this.route.queryParams.subscribe(params =>{
      this.trackingid = params['OrderTrackingId'];
    })
    // check the status of the transaction
    this.ms.confirmTransactionStatus(this.trackingid).subscribe((res:any)=>{
      if(res){
          this.processingComplete = true;
        if(res.status == 200 && res.payment_status_description == "Completed"){
           this.success = true;
           this.tstatus = "Checkout Successful";
        }else{
          this.success = false;
           this.tstatus = "Transaction Failed"
        }

      }
    })

    
  }
}
