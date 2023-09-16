import { Component, Inject, OnInit, ElementRef, ViewChild, HostListener } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatChip, MatChipInputEvent } from '@angular/material/chips';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {HttpClient} from '@angular/common/http'
import {Storage, ref, uploadBytesResumable, getDownloadURL} from "@angular/fire/storage"
import { MasterServiceService } from 'src/app/services/master-service.service';


@Component({
  selector: 'app-edit-product-modal',
  templateUrl: './edit-product-modal.component.html',
  styleUrls: ['./edit-product-modal.component.css']
})
export class EditProductModalComponent implements OnInit{
  // properties
  productDetails:any;
  selectedImages:any[] = [];
  uploadProgress!:number;
  formControl = new FormControl('');
  imageNames:any[]= [];
  imageUrls:any[] = [];
  imageFiles:any[] = [];
  feedbackError:any="";
  featuresText: any[]=[];
  imageControl = new FormControl('');
  productImage = new FormControl('');
  formerror: boolean = false;
 
  // methods
  ngOnInit(): void {
    this.productDetails = this.productData;
    this.productDetails.features.forEach((f:any)=>{
      this.featuresText.push(f)
    });
    

  }
  editProductFormGroup = new FormGroup({
    bp: new FormControl(),
    sp: new FormControl(),
    qtty: new FormControl(),
    discount: new FormControl(),
    description: new FormControl()

  })

  async editProduct(storeid:any){
    // check that all the data is complete
    const productData = {
      bp: this.editProductFormGroup.value.bp,
      sp: this.editProductFormGroup.value.sp,
      qtty:this.editProductFormGroup.value.qtty,
      discount:this.editProductFormGroup.value.discount,
      storeid: storeid,
      id:this.productData._id,
      description: this.editProductFormGroup.value.description

    }
    // check if the values are null
    if(productData.bp!==null && productData.sp!==null && productData.qtty!==null && productData.discount!==null){
      if(this.selectedImages.length==0){
        this.formerror = true;
        this.feedbackError = "No Images Selected!!"
      }else{
        this.formerror = false;
        this.feedbackError = "";
        if(confirm("Are you sure you want submit the changes?")){
          this.formerror = false;
          this.feedbackError = "Uploading images...."+this.uploadProgress+"%";
          const storage = this.storage;
          const imageUrls = [];
          for(const image of this.imageFiles){
            const imageref = ref(storage, 'products/'+image.name);
            const uploadtask = uploadBytesResumable(imageref, image);

            uploadtask.on('state_changed', (snapshot)=>{
              const percentage = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
              this.uploadProgress = percentage;
              this.feedbackError = "Uploading images..."+this.uploadProgress+"%";
            });
            try{
              await uploadtask;

              const downloadurl = await getDownloadURL(imageref);
              imageUrls.push(downloadurl);
              Object.assign(productData, {images: imageUrls, features: this.featuresText})
            }catch(e){
              console.log(e)
            }
            // send the data
            this.imageUrls = imageUrls;
            if(this.uploadProgress==100 && this.imageUrls.length===this.selectedImages.length){
              this.feedbackError = "Processing....."
              this.ms.editProduct(productData).subscribe((response:any)=>{
                if(response.success){
                  this.formerror = false;
                  this.feedbackError = response.message
                  this.dialogRef.close()
                }else{
                  this.formerror = true;
                  this.feedbackError = response.message
                }
              })
            }else{
              console.log("uploading")
            }
          }
        }
      }
    }else{
      this.formerror = true;
      this.feedbackError = "Form Not Complete!"

    }
    
  }
  removeImage(i:any){
    if(confirm("Do you want to remove this image?")){
      const index = this.selectedImages.indexOf(i);
      if(index>=0){
        this.selectedImages.splice(index,1);
        this.imageFiles.splice(index,1);
        this.imageNames.splice(index,1);
      }
    }
  }
  addFeature(e:MatChipInputEvent){
    const feature = (e.value || '').trim();
    if(feature){
      this.featuresText.push(feature)
    }
    e.chipInput!.clear();
    console.log(this.featuresText)
  }
  removeFeature(f:string){
    const index = this.featuresText.indexOf(f);
    if(index>=0){
      this.featuresText.splice(index,1);
    }
  }

  onImageSelected(e:any){
    if(e.target.files.length>0){
      const file: FileList = e.target.files;
      for(let i=0; i<file.length; i++){
        const reader = new FileReader();
        reader.onload = (event:any)=>{
          this.selectedImages.push(event.target.result);
          this.imageNames.push(file[i].name);
          this.imageFiles.push(file[i]);
        }
        reader.readAsDataURL(file[i]);
      }
    }else{
      this.feedbackError = "Please Select an Image";
    }

  }
  // update the features in the matchip element
  

  // constructor
  constructor(@Inject(MAT_DIALOG_DATA) public productData: any, private storage: Storage, private ms: MasterServiceService, public dialogRef: MatDialogRef<EditProductModalComponent>){
    
  };

  // oninit
  
}
