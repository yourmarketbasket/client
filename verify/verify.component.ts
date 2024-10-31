import { Component, Inject, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.css']
})
export class VerifyComponent implements OnInit {

  data:any;
  otpvalue:any;
  error: any;

  constructor(private authService:AuthService, @Inject(MAT_DIALOG_DATA) public dialogData:any, private router:Router){}

  ngOnInit() {
    this.data = this.dialogData;
    // console.log(this.data);
    
  }

  verifyMobileNumber(phone:any){
    const signature = "3wZsyyh51s9";
    this.authService.sendTwilioOTP({mobilenumber: phone, signature: signature}).subscribe((res:any)=>{

    });

  }
  resendOtp(){

  }
  verifyOTP(){
    this.authService.verifyTwilioOTP({mobilenumber:this.data.zipcode+this.data.phone.slice(1), otpcode:this.otpvalue}).subscribe((res:any)=>{
      if(res.success){
        this.authService.markUserAsVerified({phone:this.data.phone}).subscribe((res:any)=>{
          if(res.success){
            window.location.reload();
          } else {
              this.error = "Invalid Code";
          }
        
        })
      }
    })

  }

}
