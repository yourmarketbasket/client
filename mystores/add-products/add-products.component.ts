import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {Storage, ref, uploadBytesResumable, getDownloadURL} from "@angular/fire/storage"
import { AuthService } from 'src/app/auth.service';
import { HttpClient } from '@angular/common/http';
import { SocketService } from 'src/app/services/socket.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { MatChip, MatChipInputEvent } from '@angular/material/chips';

@Component({
  selector: 'app-add-products',
  templateUrl: './add-products.component.html',
  styleUrls: ['./add-products.component.css']
})
export class AddProductsComponent {
  @ViewChild('stepper') stepper!: MatStepper;
  @ViewChild('productphoto', {static:false}) productphoto!: ElementRef;
  @ViewChild('productpic', {static:false}) productpic!: ElementRef;
  // images array
  selectedImages: any[] = [];

  isLinear = true;
  progressColor = "";
  storeid = "";
  storename = "";
  uploadProgress = 0;
  imageUrl = "";
  featuresText: string[] = [];
  formControl = new FormControl('');
  imageNames:any[]=[];
  isChecked = false;
  feedbackerror = "";
  feedback = '';
  imageUrls: any[] = [];
  imageFiles: any[] = [];
  imageControl = new FormControl('', [Validators.required]);
  addFeature(event: MatChipInputEvent) {
    // get the value of the features input
    const feature = (event.value || '').trim();
    // check if the value is not empty
    if (feature) {
      this.featuresText.push(feature);      
    }
    // clear the input
    event.chipInput!.clear();
  }
  
  productdetails = new FormGroup({
    name: new FormControl('', [Validators.required]),
    brand: new FormControl('', [Validators.required]),
  });
  category = new FormGroup({
    category: new FormControl('', [Validators.required]),
    subcategory: new FormControl('', [Validators.required]),

  });
  description = new FormGroup({
    description: new FormControl('', [Validators.required]),
  });
  productimage = new FormGroup({
    image: new FormControl(''),
  });
  modelandqtty = new FormGroup({
    quantity: new FormControl('', [Validators.required, Validators.min(1)]),
    model: new FormControl('', [Validators.required]),
  });
  features = new FormGroup({
    featureslist: new FormControl('', [Validators.required]),
  });
  price = new FormGroup({
    bp: new FormControl('', [Validators.required, Validators.min(1)]),
    sp: new FormControl('', [Validators.required, Validators.min(1)]),
  });
  submitinfo = new FormGroup({
    terms: new FormControl(""),
  });
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddProductsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private socketService: SocketService,
    private http: HttpClient,
    private auth: AuthService,
    private storage: Storage

  ) { 
    this.storeid = data.storeid;
    this.storename = data.storename;
  }

  ngOnInit(){
  }

  // on image selected
  onImageSelected(event: any){
    // uploading multiple images
    if(event.target.files.length > 0){
      const file: FileList = event.target.files;
      // add the images to the images array
      for (let i = 0; i < file.length; i++) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.selectedImages.push(e.target.result);
          this.imageNames.push(file[i].name); 
          this.imageFiles.push(file[i])// Add the image name to the array
        }
        reader.readAsDataURL(file[i]);
      }

    }else{
      this.feedbackerror = "Please select an image";
    }
  }

  onSubmit(stepper: MatStepper){
    // disable the submit button
    // 

    // alert("Product added successfully")
  }  
  removeFeature(feature: string) {
    const index = this.featuresText.indexOf(feature);
    if (index >= 0) {
      this.featuresText.splice(index, 1);
    }
  }

  // submit product details
  async submitAddProductDetails(){
    // check if the fields are not empty
    if(this.productdetails.valid && this.features.valid && this.price.valid && this.modelandqtty.valid && this.description.valid && this.category.valid && this.productimage.valid){
      // check if there are images that have been selected
      if(this.selectedImages.length==0){
        this.feedbackerror = "Please select an image";
        return;
      }else{
        this.feedbackerror = "";
        if(this.isChecked){
          // submit the product details
          this.feedbackerror= "";     
          
          const confirm = window.confirm("Are you sure you want to add this product?");
          if(confirm){
            this.feedback = "Uploading images..."+this.uploadProgress+"%";
            this.progressColor = 'accent';
            const storage = this.storage;
            const imageUrls = []; // Array to store the URLs
            for (const image of this.imageFiles) { // Loop over each selected image file
              const imageref = ref(storage, 'products/' + image.name);
              const uploadtask = uploadBytesResumable(imageref, image);
              uploadtask.on('state_changed', (snapshot) => {
                const percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                this.uploadProgress = percentage;
                this.feedback = "Uploading images..."+this.uploadProgress+"%";
              });
              try {
                await uploadtask;
                // get the download url
                const downloadurl = await getDownloadURL(imageref);
                imageUrls.push(downloadurl); // Add the URL to the array
              } catch (error) {
                this.progressColor = 'warn';
                console.log(error);
              }
            }
            this.feedback = "Uploading images..."+this.uploadProgress+"%";
            this.imageUrls = imageUrls; 
            const productData = {
              name: this.productdetails.value.name,
              brand: this.productdetails.value.brand,
              category: this.category.value.category,
              subcategory: this.category.value.subcategory,
              description: this.description.value.description,
              features: this.featuresText,
              quantity: this.modelandqtty.value.quantity,
              model: this.modelandqtty.value.model,
              bp: this.price.value.bp,
              sp: this.price.value.sp,
              images: this.imageUrls,
              storeid: this.storeid,
  
            }
            this.feedback = "Processing the data..."+this.uploadProgress+"%";
            // send the data to the backend
            if(this.uploadProgress==100){
              this.feedback = "Processing..."+this.uploadProgress+"%";
              this.auth.addProduct(productData).subscribe((res:any)=>{
                if(res.success){
                  this.progressColor = 'primary';
                  // emit a product add event
                  this.socketService.emit('productadded', productData);
                  alert("Product added successfully");
                  // close the dialog
                  this.dialogRef.close();
                }else{
                  this.progressColor = 'warn';
                  this.feedback = "Error adding product";
                }
              });
            }else{
              this.feedback = "Processing...."
            }

          }
         
          // first upload the images to firestorage and return the urls
        }else{
          this.feedbackerror = "Please accept the terms and conditions";
        }
      }
      
    }else{
      this.feedbackerror = "Please ensure that all fields are completed";
    }
  }

}
