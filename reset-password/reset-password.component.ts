import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router, Route} from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  constructor(private auth: AuthService, private router: Router){}
  resetError!:any;
  resetFeedback!:any;
  showPassword!:any;
  showNPassword!:any;
  enablefields:boolean = false;
  zipcode!:any;
  codeid!:any;
  feedback!:any;
  feedbackerror!:any;
  invalid:boolean = true;;


  // initiate the fields
  resetPasswordForm = new FormGroup({
    phone: new FormControl('',Validators.required),
    otp: new FormControl('', Validators.required),
    password: new FormControl('', [Validators.required, this.passwordValidator]),
    npassword: new FormControl('', [Validators.required, this.passwordValidator]),


  });

  // reset password
  resetPassword(){
    const phone = this.resetPasswordForm.value.phone;
    const otp = this.resetPasswordForm.value.otp;
    const password = this.resetPasswordForm.value.password;
    const npassword = this.resetPasswordForm.value.npassword;

    if(password===npassword && this.resetPasswordForm.value.npassword!=="" && this.resetPasswordForm.value.password!=="" && this.resetPasswordForm.value.phone!=="" && this.resetPasswordForm.value.otp!==""){
      const data = {
        phone:phone,
        password:password
      }
      this.feedbackerror = "";
      this.auth.resetUserPassword(data).subscribe((response:any)=>{
        if(response.success){
          this.router.navigate(['/login']);
        }else{
          this.feedbackerror.message;
        }
      })

    }else{
      this.feedback = "";
      this.feedbackerror = "Check the form for Errors";
    }

  }
  // send otp
  async sendOtp(){
    const data = {
      mobile: this.resetPasswordForm.value.phone,  
    } 
    // get the zip code
    await this.auth.getZipCode(data).subscribe((response:any)=>{
      if(response.success){
        this.zipcode = response.message;
        // send otp
        const mobiledata = {
          zip: this.zipcode,
          phone: this.resetPasswordForm.value.phone
        }
        this.auth.sendResetPasswordOTP(mobiledata).subscribe((response:any)=>{
          this.codeid = response.data.pinid
        })        
      }else{
        this.resetPasswordForm.get('phone')?.setErrors({'invalid':true})

      }
    });

  }
  // verify otp
  async verifyOTP(){
    if(this.resetPasswordForm.value.otp?.length===6){
      const data = {
        otp: this.resetPasswordForm.value.otp,
        codeid: this.codeid
      }
      this.auth.verifyResetPasswordOTP(data).subscribe((response:any)=>{
        if(response.success){
          this.feedbackerror = "";
          this.enablefields = true;
        }else{
          this.feedback = "";
          this.enablefields = false;
          this.feedbackerror = response.message;
        }
      })
    }else{
      this.enablefields = false;
      this.resetPasswordForm.get('otp')?.setErrors({'invalid':true})
    }
  }

  // password validator
  passwordValidator (control: AbstractControl): { [key: string]: boolean } | null  {
    const minLength = 8;
    const capitalRegex = /[A-Z]/;
    const numberRegex = /\d/;
    const symbolRegex = /[!@#$%^&*(),.?":{}|<>]/;
    const password = control.value;
    if (!password) {
      return null;
    }

    const hasMinLength = password.length >= minLength;
    const hasCapital = capitalRegex.test(password);
    const hasNumber = numberRegex.test(password);
    const hasSymbol = symbolRegex.test(password);

    const valid = hasMinLength && hasCapital && hasNumber && hasSymbol;
    return valid ? null : { 'invalidPassword': true };
  };

}
