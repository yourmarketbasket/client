import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css']
})
export class ConfirmationComponent implements OnInit{
  data: any;
  phone = '';
  zip = '';
  codeid = '';
  feedback = '';
  verificationError = '';

  ngOnInit() {
    window.document.title = "Confirmation";
     this.data = history.state.data;
     this.phone = this.data.phone;
     this.zip = this.data.zip;
     this.codeid = this.data.pinid

     if(history.state.data){
        // this.router.navigate(['/register']);
        console.log(history.state.data)
      }else{
        this.router.navigate(['/register']);
      }
  }

  confirmation =  new FormGroup({
    otpCode: new FormControl('', [Validators.required]),
  })
  resendOTP(){
    this. data = {
      phone: this.phone,
      zip: this.zip,
      codeid: this.codeid,
    }

    if(this.data.phone !=="" && this.data.zip !== "" && this.data.channel !== "" ){
      this.authService.sendOTP(this.data).subscribe(
        (response:any) => {
          if(response.success){
            this.codeid = response.data.pinid;
            this.feedback = response.message;
          }else{
            this.feedback = response.message;
          }
          // alert(response)
        },
        (error:any) => {
          this.feedback = error.message;
          console.log(error)
        }  
  
      )
    }else{
      return
      alert("Action not Allowed")
      this.verificationError = "Action not Allowed";
    }
   
  }
  confirmMobile(){
    console.log(this.phone, this.confirmation.value.otpCode)
    const user = {
      zip: this.zip,
      phone: this.phone,
      otp: this.confirmation.value.otpCode,
      codeid: this.codeid
    }
    if(this.phone !=="" || this.zip !== "" || this.confirmation.value.otpCode !== ""){
      this.authService.verifyUser(user).subscribe(
        (response:any) => {
          if(response.success){
            this.verificationError = "";
            this.feedback = response.message;
            this.router.navigate(['/login']);
          }else{
            this.feedback ="";
           this.verificationError = response.message;
          }
          // alert(response)
        },
        (error) => {
          this.feedback ="";
           this.verificationError = error.message;
          console.log(error)
        }
  
      )
    }
    


  }

  constructor(private route: ActivatedRoute, private authService : AuthService, private router: Router) { }

}
