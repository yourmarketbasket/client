import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginFeedback = '';
  showPassword!:any;
  loginError = "";

  constructor(private formBuilder: FormBuilder, private router: Router, private authService: AuthService) { 
    this.loginForm = this.formBuilder.group({
      phone: ['', [Validators.required, this.phoneValidator.bind(this)]],
      password: ['', Validators.required]
    });
  }

  loginForm = new FormGroup({
    phone: new FormControl('', [Validators.required, this.phoneValidator.bind(this)]),
    password: new FormControl('', Validators.required)
  });
  ngOnInit(): void {
      window.document.title = "Login";
  }
  
  async userLogin() {
    if(this.loginForm.invalid){
      this.loginFeedback = "";
      this.loginError = "Check the form for Errors!";
      return
    }
    this.authService.loginUser(this.loginForm.value).subscribe(
      (response: any) => {
        if (response.success) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('userId', response.userId);
          const userData = response.data;
          this.router.navigate(['/market_place']);
          this.loginError = "";
        } else {
          this.loginFeedback = "";
          this.loginError = response.message;
        }
      },
      (error) => {
        this.loginFeedback = "";
        this.loginError = error.message;
      }
    );
    
  }

  onRegister() {
    this.router.navigate(['/register']);
  }

  phoneValidator(control: any) {
        const value = control.value;
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const phonePattern = /^[0-9.%+-]{10,}$/;

        if (!value) {
          return { 'phone': 'Field cannot be empty' };

        }
        else if(value.match(phonePattern) == null){
          return{ 'phone': 'Invalid Details'}
        }

        return null;
     
  }

}
