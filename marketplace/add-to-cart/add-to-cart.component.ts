import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-to-cart',
  templateUrl: './add-to-cart.component.html',
  styleUrls: ['./add-to-cart.component.css']
})
export class AddToCartComponent {
  constructor(
    public dialogRef: MatDialogRef<AddToCartComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  
  addToCartForm = new FormGroup({
    quantity: new FormControl(null, [this.maxValueValidator(this.data.quantity)])
  });

  maxValueValidator(max: any) {
    return (control:any) => {
      const value = control.value;
      if (value > max || value<0) {
        return { maxValueExceeded: true };
      }
      return null; // No error if the value is within the limit
    };
  }

  submitAddToCartData(){
    if(this.addToCartForm.valid && this.addToCartForm.value.quantity){      
      const data = {
        qtty: this.addToCartForm.value.quantity,
        productid: this.data.id
      }
      
      this.dialogRef.close(data)
    }else{
      this.dialogRef.close();
    }
  }
}
