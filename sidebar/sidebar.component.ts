import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { SocketService } from 'src/app/services/socket.service';
import { Store } from 'src/app/mystores/stores-dashboard/stores-interface';
import {Storage, ref, uploadBytesResumable, getDownloadURL} from "@angular/fire/storage"
import { Dimensions, ImageCroppedEvent, LoadedImage, base64ToFile } from 'ngx-image-cropper';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  [x: string]: any;
  // hide the sidebar and sidenav
  @Output () hideSidebar: EventEmitter<any> = new EventEmitter();
  @ViewChild('fileInput', { static: true }) fileInput!: ElementRef;
  @ViewChild('ppwrapper', { static: true }) profilepicwrapper!: ElementRef;
  @ViewChild('cropperarea', { static: true }) cropperarea!: ElementRef;
  @ViewChild('progressbar', { static: true }) progressbar!: ElementRef;
  // user information variables
  isLoggedin = false;
  uploading = false;
  showCropperArea = false;
  progress = 0;
  croppedImageFile!: any;
  isLoading = true;
  stores!:Store[];
  userId: any;
  fname = "";
  lname = "";
  phone = "";
  admin= false;
  avatar!:any;
  verified = false;
  active=false;
  panelOpenState = false;
  sidenavOpened = false;
  userName = "";
  userPhone = "";
  userVerification = "";
  vendor = false;
  client = false;
  zipcode = "";
  city = "";
  address = "";
  task!: any;
  imageref!: any;
  constructor(private socketService: SocketService, private storage: Storage, private router: Router, private authService: AuthService, private dialog: MatDialog, private sanitizer: DomSanitizer) { }
  
  // image cropper methods and variables
  imageChangedEvent: any = '';
  croppedImage: any = '';
  imageURL?:string;
  containWithinAspectRatio = false;
  showCropper = false;
  scale = 1;
  aspectRatio = 4/4;
  hidden = false;

  selectFile(){
    
    this.fileInput.nativeElement.click();
    // show the cropper area
    this.cropperarea.nativeElement.style.display = "flex";
    // hide the profilepic wrapper
    this.profilepicwrapper.nativeElement.style.display = "none";
  }
  
  onFileSelected(e: any) {
      this.imageChangedEvent = e;     
      this.showCropperArea = true;   
  }
  fileChangeEvent(event: any): void {
      this.imageChangedEvent = event;

  }
  async imageCropped(e: ImageCroppedEvent) {
    this.croppedImage = e.base64;
    const split = this.croppedImage.split(',');
    const type = split[0].replace('data:', '').replace(';base64', '');
    // this.croppedImageFile = this.blobUrlToFile(this.croppedImage, `${this.userId}.jpg`);
    let croppedImageBlob = this.base64ToBlob(this.croppedImage);
    this.croppedImageFile= new File([croppedImageBlob], `${this.userId}.jpg`, { type: "image/jpeg" });  
    

  }
  // data url to file
  base64ToBlob(base64Data:any) {
    const split = base64Data.split(',');
    const type = split[0].replace('data:', '').replace(';base64', '');
    const byteString = atob(split[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i += 1) {
      ia[i] = byteString.charCodeAt(i);
    }
    const fileBlob = new Blob([arrayBuffer], {type}); 
    return fileBlob// upload this to firebase.
  }
  
  

  
  
  imageLoaded() {
    // get the details of the loaded image
        // show cropper
  }
  cropperReady(sourceImageDimension: Dimensions) {
    console.log('cropper ready', sourceImageDimension)
    this.isLoading = false;
    // cropper ready
  }
  loadImageFailed() {
    console.error("failed to load the image")
    // show message
  }
  // toggle sidebar
  async cropImage(){
    this.avatar = this.croppedImage;
    // hide the cropper area
    this.cropperarea.nativeElement.style.display = "none";
    // show the profilepic wrapper
    this.profilepicwrapper.nativeElement.style.display = "flex";
    // upload image to firebase and return the url
    // await new Promise<void>(resolve => setTimeout(() => resolve(), 0));
    console.log(this.croppedImageFile)
    const storage = this.storage;
    if(this.croppedImageFile){
      this.imageref = ref(storage, `avatar/${this.croppedImageFile.name}`);
       this.task = uploadBytesResumable(this.imageref, this.croppedImageFile);
      this.task.on('state_changed', (snapshot: any) => {
        this.uploading = true;
        this.progress = Math.floor((snapshot.bytesTransferred / snapshot.totalBytes) * 100);

      });
    }else{
      alert("Please select an image to upload");
    }
    
    // try and catch block
    try{
      await this.task;
      const downloadURL = await getDownloadURL(this.imageref);
      this.avatar = downloadURL;
      console.log("download url", this.avatar)
      // update the user avatar
      const data = {
        avatar: this.avatar,
        userid: this.userId
      }
      if(this.progress == 100){
        
        this.authService.changeUserAvatar(data).subscribe(
          (response: any) => {
            if (response.success) {
              this.uploading = false;
            } else {
              this.uploading = false;
              // show error message
              alert("Error updating profile picture")
            }
          }
        );
      }
    } catch (error){
      console.log(error);
    }


  }

  ngAfterViewInit(): void {
  }
  
  // logout user
  userLogout(){
    this.authService.logout();
    localStorage.removeItem('userId')
  }
  // get the user information
  ngOnInit(): void {
    // hide cropper area
    this.cropperarea.nativeElement.style.display = "none";
    this.isLoggedin = this.authService.loggedIn();
    this.userId = localStorage.getItem('userId');
    this.authService.getUser(this.userId).subscribe(
      (response: any) => {
        if (response.success) {
          const userData = response.data;
          this.fname = userData.fname;
          this.lname = userData.lname;
          this.phone = userData.phone;
          this.admin = userData.admin;
          this.avatar = userData.avatar;
          this.verified = userData.verified;
          this.active = userData.active;
          this.vendor = userData.vendor;
          this.client = userData.client;
          this.zipcode = userData.zipcode;
          this.city = userData.city;
          this.address = userData.address;
          this.userName = this.fname + " " + this.lname;
          this.userPhone = this.phone;
          this.userVerification = this.verified ? "Verified" : "Not Verified";
        } else {
          this.router.navigate(['/login']);
        }
      },
      (error) => {
        this.router.navigate(['/login']);
      }
    );
  }
  
  // to safe url
  toSafeUrl(url: any): SafeUrl{
    return this.sanitizer.bypassSecurityTrustUrl(url);

  }
  

}
