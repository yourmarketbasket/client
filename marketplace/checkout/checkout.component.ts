import { Component, OnInit, ViewChild, ElementRef, Input, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MasterServiceService } from 'src/app/services/master-service.service';
import { DomSanitizer } from '@angular/platform-browser';
import { countries } from 'src/app/register/countrycodes';
import { MatDialog } from '@angular/material/dialog';
import { PaymentDialogComponent } from './payment-dialog/payment-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  userId!:any;
  totalCost:any=0;
  logisticFee:any = 0;
  cartItems!:any[];
  user!:any;
  useMyLocation:boolean = false;
  buyerLocation!:any;
  @ViewChild('locationField')
  locationField!: ElementRef;
  @ViewChild('selection')
  selection!: ElementRef;
  storeLocations!:any;
  origins:any = [];
  mapMarker!:any;
  buyerAddress!:any;
  deliveryCost!:any;
  logisticsDetails!:any;
  ddistance = 0;
  dduration = 0;
  logisticsResponse!:any;
  eta!:any;
  totalDistance!:any;
  location!:any;
  numberOfOriginAddresses=0;
  mapUrl!:any;
  mapfeedback!:any;
  accepttncs:boolean = false;
  savedBuyerAddress:any;


  @Input() placeholder = ""; 

  @ViewChild('infowindowContent') infowindowContentRef!: ElementRef;

  autoComplete: google.maps.places.Autocomplete | undefined;

  constructor(private ms:MasterServiceService, private domSanitizer: DomSanitizer, public dialog: MatDialog, private router: Router){}
  locationForm = new FormGroup({
    selection: new FormControl('', Validators.required),
    locationField: new FormControl('', Validators.required)
  })
// oninit
  ngOnInit(): void {
    this.userId = localStorage.getItem('userId')
    // get user
    this.ms.getUser(this.userId).subscribe((res:any)=>{
      if(res.success){
        this.user = res.data
        this.savedBuyerAddress = this.user.location;
        this.selectionPref(event);
    
      }
    })
    // get cartitems
    this.ms.getCartItems(this.userId).subscribe((res:any)=>{
      if(res.success && res.items[0]){
        this.cartItems = res.items[0].products
        this.totalCost = res.items[0].amount
        // this.calculateCost();
      }
    })   
    // get store locations
    // initialize the map
    // this.initMap()


  }

// after init
ngAfterViewInit() {
  if (this.locationField && this.locationField.nativeElement) {
    this.loadGoogleMaps(); // Only load maps after view is initialized
  }
}
// selectin prefs
  async selectionPref(event:any){
    if(event.value == 1){
      this.buyerLocation = null;
      this.locationForm.get('locationField')?.enable();
      
    }else if(event.value == 2){
      this.buyerLocation = null;
      this.locationForm.get('locationField')?.disable();
      this.getLocation();  
      
    }else if(this.savedBuyerAddress){
      this.buyerLocation = {
        latitude:this.savedBuyerAddress.latitude,
        longitude:this.savedBuyerAddress.longitude
      };
      this.locationForm.get('locationField')?.disable;
    }

  }
  async getLocation(){
    if(navigator.geolocation && !this.savedBuyerAddress){
      await navigator.geolocation.getCurrentPosition((position:any)=>{
        this.buyerLocation = {
          latitude: position.coords.latitude, 
          longitude:position.coords.longitude,
        } 
      })
      
      
    }else if(navigator.geolocation && this.savedBuyerAddress){
      this.buyerLocation = {
        latitude: this.savedBuyerAddress.latitude,
        longitude: this.savedBuyerAddress.longitude
      }

    } else {
      console.log("Geolocation not supported")
    }
  }

  async preview(){
    this.dduration = 0;
    this.ddistance = 0;
    this.numberOfOriginAddresses = 0;
    // this.buyerLocation = null;
    // console.log(this.buyerLocation)
    const response:any = await this.previewLogistics();
    if(!response.error){
      this.mapfeedback = ''
        this.logisticsDetails = response.details
    }else{
      this.buyerLocation = ''
      this.mapfeedback = response.message
    }
    
    
    this.logisticsDetails.rows.forEach((e:any) => {
      this.dduration+=e.elements[0].duration.value 
      this.numberOfOriginAddresses++; 
    });
    this.logisticsDetails.rows.forEach((e:any)=>{
      this.ddistance+=e.elements[0].distance.value
    })
    // this.logisticsDetails.rows[0].elements[0].duration.value
    // this.logisticsDetails.rows[0].elements[0].distance.value
    console.log(this.logisticsDetails)
    const time = this.convertSecondsToTime(this.dduration);
    const dist = this.metersToKilometers(this.ddistance);
    this.eta = time;
    this.totalDistance = dist;
    this.logisticFee = ((dist/this.numberOfOriginAddresses)*this.numberOfOriginAddresses)
    const mylocation = this.replaceSpacesWithPlus(this.logisticsDetails.destinationAddresses[0]);
    console.log(mylocation)
    
    const mapUrl = await `https://www.google.com/maps/embed/v1/place?key=AIzaSyDdvqTHmz_HwPar6XeBj8AiMxwzmFdqC1w&q=${mylocation}&center=${this.buyerLocation.latitude},${this.buyerLocation.longitude}&zoom=18&maptype=satellite`;

    this.mapUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(mapUrl);


    // this.logisticsDetails.
   
  }

  async previewLogistics() {
    return new Promise(async (resolve, reject) => {
      try {
         this.logisticsResponse = await this.ms.getStoreLocations(this.userId).toPromise();
         console.log(this.logisticsResponse)
  
        if (this.logisticsResponse.success && (this.buyerLocation || this.savedBuyerAddress)) {
          const origins = this.logisticsResponse.origins.map((e: any) => new google.maps.LatLng(e.latitude, e.longitude));
          const destination = this.savedBuyerAddress ? new google.maps.LatLng(this.savedBuyerAddress.latitude, this.savedBuyerAddress.longitude) : new google.maps.LatLng(this.buyerLocation.latitude, this.buyerLocation.longitude);
          const service = new google.maps.DistanceMatrixService();
  
          service.getDistanceMatrix(
            {
              origins,
              destinations: [destination],
              travelMode: google.maps.TravelMode.DRIVING,
            },
            (response: any, status: any) => {
              // console.log(response)
              if (status === google.maps.DistanceMatrixStatus.OK) {
                console.log(response)
                if(response.rows[0].elements[0].status!='ZERO_RESULTS'){
                  resolve({ details: response, status: status, error:false });
                }else{
                  resolve({error:true,message: 'Distance out of the covered range'})
                }
              } else {
                resolve({error:true,message: 'Some error occured'});
              }
            }
          );
        } else {
          resolve({error:true,message: 'Failed to fetch store locations or buyer location is missing.'});
        }
      } catch (error) {
        resolve({error:true,message: error});
      }
    });
  }
  
  
  // calculate total cost
  calculateCost(){
     this.cartItems.forEach((e:any)=>{
      this.totalCost+=e.totalCost;
     })
    return this.totalCost;
  }
  // load google maps
  async loadGoogleMaps(){
    this.autoComplete = new google.maps.places.Autocomplete(this.locationField.nativeElement);
      this.autoComplete.addListener('place_changed', ()=>{
        const place = this.autoComplete?.getPlace();
        this.buyerLocation = {
          latitude: place?.geometry?.location?.lat(), 
          longitude:place?.geometry?.location?.lng(),
        } 
        
      })
    
  }
  // convert seconds to time
  convertSecondsToTime(seconds:any) {
    if (seconds < 0) {
      throw new Error("Input must be a non-negative number of seconds.");
    }
  
    const secondsInMinute = 60;
    const secondsInHour = 3600;
    const secondsInDay = 86400;
    const secondsInWeek = 604800; // 7 days
    const secondsInMonth = 2629746; // Average month length (30.44 days)
  
    const months = Math.floor(seconds / secondsInMonth);
    seconds -= months * secondsInMonth;
  
    const weeks = Math.floor(seconds / secondsInWeek);
    seconds -= weeks * secondsInWeek;
  
    const days = Math.floor(seconds / secondsInDay);
    seconds -= days * secondsInDay;
  
    const hours = Math.floor(seconds / secondsInHour);
    seconds -= hours * secondsInHour;
  
    const minutes = Math.floor(seconds / secondsInMinute);
    const remainingSeconds = seconds % secondsInMinute;
  
    return {
      months: months,
      weeks: weeks,
      days: days,
      hours: hours,
      minutes: minutes,
      seconds: remainingSeconds,
    };
  }
  metersToKilometers(meters:any) {
    const kilometers = meters / 1000;
    return Math.round(kilometers);
  }
  
  replaceSpacesWithPlus(inputString:any) {
    // Use the split method to split the string into words
    const words = inputString.split(' ');
  
    // Use the join method to join the words with a plus sign
    const result = words.join('+');
  
    return result;
  }
  async completeCheckout(amount:any){
    // get the origin
    const origins:any =  this.logisticsResponse = await this.ms.getStoreLocations(this.userId).toPromise();
    // console.log(origins.origins[0])
    // getting the country code
    let code = null;
    for(let i=0; i<countries.length; i++){
      if(countries[i].phone == this.user.zipcode.slice(1)){
        code = countries[i].code;
        break;
      }
    }
    
    const data = {
      transactionID: this.generateRandomCode(10),
      amount: amount,
      phone: this.user.phone,
      zipcode: this.user.zipcode,
      fname:this.user.fname,
      lname:this.user.lname,
      countryCode: code,
      description: "Purchase of goods",
      userid: this.userId,
      deliveryfee: this.logisticFee,
      destination: this.buyerLocation,
      origin: origins.origins[0]
    }

    // send to the backend
   await this.ms.pesapalSOR(data).subscribe((res:any)=>{
    // console.log(res)
     if(res.status == 200){
        const url = res.redirect_url;
        const sanitizedurl = this.domSanitizer.bypassSecurityTrustResourceUrl(url);
        const dialogRef = this.dialog.open(PaymentDialogComponent, {
          width: '60vw',
          data: {
            trackingID: res.order_tracking_id,
            merchantref: res.merchant_reference,
            url: sanitizedurl
          },
          disableClose: true
        });
     }else if(res.status==402){
      const dialogRef = this.dialog.open(PaymentDialogComponent, {
        width: '30vw',
        data: {
          message: res.message
        }
      });
     }else{
        window.location.reload();
     }
   })
  


    
  }
  generateRandomCode(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters.charAt(randomIndex);
    }
  
    return code;
  }
  
  


}
