import { Component, HostListener, OnInit, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn} from '@angular/forms';
import { FormControl } from '@angular/forms';
import {countries} from './countrycodes';
import { MatStepperModule,MatStepper } from '@angular/material/stepper';
import {RegistrationResponse} from '../register/registrationResponse';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatStep } from '@angular/material/stepper';

// services 
import { AuthService } from '../auth.service';

import {BreakpointObserver} from '@angular/cdk/layout';
import {StepperOrientation} from '@angular/material/stepper';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit{
  @ViewChild('stepper') stepper!: MatStepper;
  feedbackerror = "";
  isChecked = false;
  isMediumScreen = false;
  isLargeScreen = false;
  isExtraLargeScreen = false;
  isSmallScreen = false;
  stepperOrientation: Observable<StepperOrientation>;
  invalidSteps: number[] = [];
  userInfo: any = {};
  feedback = '';
  // formate date
  formatDate(date: string | null | undefined): string | null {
    if (!date) {
      return null;
    }
    return this.datePipe.transform(date, 'yyyy-MM-dd');
  }
  // collect the data from the registration form

  onSubmit(stepper: MatStepper) {
    if(this.isChecked && this.passwordInfo.value.password === this.passwordInfo.value.confirmPassword){



      this.userInfo['zipcode'] = `+${this.mobileInfo.value.countryCode}`;
      this.userInfo['phone'] = this.mobileInfo.value.mobileNumber;
      this.userInfo['fname'] = this.namesInfo.value.firstName;
      this.userInfo['lname'] = this.namesInfo.value.lastName;
      this.userInfo['gender'] = this.otherInfo.value.gender;
      this.userInfo['dob'] = this.formatDate(this.otherInfo.value.dob);
      this.userInfo['address'] = this.contactInfo.value.address;
      this.userInfo['city'] = this.contactInfo.value.city;
      this.userInfo['password'] = this.passwordInfo.value.password;


      this.authService.registerUser(this.userInfo).subscribe(
        (response) => {
          this.feedbackerror = "";
          const regresponse = response as RegistrationResponse;
          if(regresponse.success === true){
            this.feedback = `${regresponse.message}`
            console.log(regresponse.data)         
            this.router.navigate(['/confirmation'], {state: {data:regresponse.data}} );
          }else{
            this.feedback = "";
            this.feedbackerror = `${regresponse.message}`
          }
          
        },
        (error) => {
          this.feedback = "";
          const regerror = error as RegistrationResponse;
          this.feedbackerror = regerror.message;
        });
        this.isChecked = false;

    }else{

      if(this.isChecked === false){
        this.feedback = "";
        this.feedbackerror = 'Please Accept our Terms and Conditions';
      }else{
        this.feedback = "";
        this.feedbackerror = 'Passwords do not Match';
      }
    }
   
  }
   

 @HostListener('window:resize', ['$event'])
onResize(event: Event) {
  const screenWidth = event?.target instanceof Window ? event.target.innerWidth : 0;
  this.isExtraLargeScreen = screenWidth >= 1920;
  this.isLargeScreen = screenWidth >= 1200 && screenWidth < 1920;
  this.isMediumScreen = screenWidth >= 768 && screenWidth < 1200;
  this.isSmallScreen = screenWidth < 768;
}

  registerFormInfo = new FormGroup({
    acceptTerms: new FormControl('', [Validators.required]),
  });

  mobileInfo = new FormGroup({    
    countryCode: new FormControl('', [Validators.required]),
    mobileNumber: new FormControl('', [Validators.required, this.mobileNumberValidator]),
  });
  namesInfo = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
  });
 otherInfo = new FormGroup({  
  gender: new FormControl('', [Validators.required]),
  dob: new FormControl('', [Validators.required]),
 });
//  new formgroup
 passwordInfo = new FormGroup({  
  password: new FormControl('', [Validators.required, this.passwordValidator]),
  confirmPassword: new FormControl('', [Validators.required, this.passwordValidator]),
 });
 contactInfo = new FormGroup({  
  city: new FormControl('', [Validators.required]),
  address: new FormControl('', [Validators.required]),
 });

  countryCodes = countries;
  selectedCode = new FormControl();

  isLinear = true;
  hidePassword = true;
  hideConfirmPassword = true;

  constructor(private _formBuilder: FormBuilder, breakpointObserver: BreakpointObserver, private authService: AuthService, private datePipe: DatePipe, private router: Router) {
      this.stepperOrientation = breakpointObserver
        .observe('(min-width: 710px)')
        .pipe(map(({matches}) => (matches ? 'horizontal' : 'vertical')));
    }
  

  mobileNumberValidator(control: AbstractControl): {[key: string]: boolean} | null {
    const regex = /^[+]?[0-9]{10}$/;
    if (control.value && !regex.test(control.value)) {
      return { 'invalidMobileNumber': true };
    }
    return null;
  }
   
    
  
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

    ngOnInit(): void {
      window.document.title = 'Register';
    }
  
}


