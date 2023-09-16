import { Component, OnInit, Inject, ViewChild, ElementRef, Injectable } from '@angular/core';
import {Storage, ref, uploadBytesResumable, getDownloadURL} from "@angular/fire/storage"
import { storetypes } from './storetypes';

import { AbstractControl, FormControl, FormGroup, Validators, FormBuilder} from '@angular/forms';
import { AuthService } from 'src/app/auth.service';
import { HttpClient } from '@angular/common/http';
import {SocketService} from '../../services/socket.service';

@Component({
  selector: 'app-createstore',
  templateUrl: './createstore.component.html',
  styleUrls: ['./createstore.component.css']
})

export class CreatestoreComponent implements OnInit{

  
  // input file for image
  @ViewChild('fileInput')
  fileInput!: ElementRef<HTMLInputElement>;
  // properties
  storeName!: FormControl;
  storeType!: FormControl;
  location!: FormControl;
  phone!: FormControl;
  email!: FormControl;
  imageUrl!: any;
  description!: FormControl;
  createStoreform!: FormGroup;
  imagename!:any;
  password!: FormControl;
  imagefile!:File;
  progressColor!: string;
  // firebase storage
 
  // description: FormControl = '';
  uploadProgress!: number;
  storeTypes = storetypes;
  // constructor
  constructor( private storage: Storage, private socketService: SocketService, private http: HttpClient, private authService: AuthService, private formBuilder: FormBuilder
  ) { }
  // on init
  ngOnInit(): void {
    this.createStoreform = this.formBuilder.group({
      storeName: ['', Validators.required],
      storeType: ['', Validators.required],
      location: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^(\+\d{1,3}[- ]?)?\d{10}$/)]],
      description: ['', Validators.required],
    });
    
  }
  // on file selected
  clickFileInput(){
    this.fileInput.nativeElement.click();

  }
  
  // image drag and drop logic
  onImageSelected(event:any): void {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      this.imagefile = event.target.files[0];
      this.imagename = event.target.files[0].name;
      reader.onload = (e:any) => {
        this.imageUrl = e.target.result as string;
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }
  onDrop(event:any): void {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    this.imagefile = file;
    const reader = new FileReader();
    this.imagename = file.name;
    reader.onload = (e:any) => {
      this.imageUrl = e.target.result as string;
    };
    reader.readAsDataURL(file);
  }
  onDragOver(event:any): void {
    event.preventDefault();
    event.stopPropagation();
  }

  onDragLeave(event:any): void {
    event.preventDefault();
    event.stopPropagation();
  }
  
  // create the store
  async createStore(){ 
    if(this.createStoreform.invalid){
      return;
    }else{
      const accept = confirm('Are you sure you want to create this store?');
      if(accept){
          this.progressColor = 'accent';
          const storage = this.storage;
          const imageref = ref(storage, 'stores/'+this.imagename)
          const uploadtask = uploadBytesResumable(imageref, this.imagefile);
          uploadtask.on('state_changed', (snapshot) => {
            const percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            this.uploadProgress = percentage;
          });
          // try and catch block
          try{
            await uploadtask;
            // get the download url
            const downloadurl = await getDownloadURL(imageref);
            this.imageUrl = downloadurl;
          }catch(error){
            this.progressColor = 'warn';
            console.log(error);
          }
          // send the data to the database
          const store = {
            storename: this.createStoreform.value.storeName,
            storetype: this.createStoreform.value.storeType,
            location: this.createStoreform.value.location,
            phone: this.createStoreform.value.phone,
            email: this.createStoreform.value.email,
            description: this.createStoreform.value.description,
            avatar: this.imageUrl,
            password: this.createStoreform.value.password,
            userId : localStorage.getItem('userId')

          }
          this.authService.addStore(store).subscribe((res:any) => {
             if(res.success){
                alert(`Store ${this.createStoreform.value.storeName} Created Successfully.`)
                this.progressColor = 'primary';
                this.socketService.emit('store-created', res.data);
              //  alert('Store created successfully');
             }else{
                this.progressColor = 'warn';
                alert(res.message);
             }
          });

      }else{
        return;
      }

      
      
    }
    
  }
  // phone number validator
  mobileNumberValidator(control: AbstractControl): {[key: string]: boolean} | null {
    const regex = /^[+]?[0-9]{10}$/;
    if (control.value && !regex.test(control.value)) {
      return { 'invalidMobileNumber': true };
    }
    return null;
  }
  
   






}
