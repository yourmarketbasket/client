import { Component, OnInit, ViewChild, ElementRef, Input, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MasterServiceService } from 'src/app/services/master-service.service';

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


  @Input() placeholder = ""; 

  @ViewChild('infowindowContent') infowindowContentRef!: ElementRef;

  autoComplete: google.maps.places.Autocomplete | undefined;

  constructor(private ms:MasterServiceService){}
  locationForm = new FormGroup({
    selection: new FormControl('', Validators.required),
    locationField: new FormControl('', Validators.required)
  })
// oninit
  ngOnInit(): void {
    this.userId = localStorage.getItem('userId')
    this.ms.getUser(this.userId).subscribe((res:any)=>{
      if(res.success){
        this.user = res.data
      }
    })
    
    this.ms.getCartItems(this.userId).subscribe((res:any)=>{
      if(res.success){
        this.cartItems = res.items
        this.calculateCost();
      }
    })   

  }

// after init
  ngAfterViewInit(){
      this.loadGoogleMaps();
  }
// selectin prefs
  selectionPref(event:any){
    if(event.value == 1){
      this.locationForm.get('locationField')?.enable();
    }else if(event.value == 2){
      this.locationForm.get('locationField')?.disable();
      this.getLocation();

    }

  }
  async getLocation(){
    if(navigator.geolocation){
      await navigator.geolocation.getCurrentPosition((position:any)=>{
        this.buyerLocation = {
          latitude: position.coords.latitude, 
          longitude:position.coords.longitude,
        } 
      })
      
    }else{
      console.log("Geolocation not supported")
    }
  }
  preview(){
    var origin1 = new google.maps.LatLng(this.buyerLocation.latitude, this.buyerLocation.longitude);
    var destinationB = new google.maps.LatLng(-0.5727289999999999, 37.3250898);
    
    var service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix(
      {
        origins: [origin1],
        destinations: [destinationB],
        travelMode: google.maps.TravelMode.DRIVING,
      }, callback);

    function callback(response:any, status:any) {
      console.log(response, status)
      // See Parsing the Results for
      // the basics of a callback function.
    }
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

}
