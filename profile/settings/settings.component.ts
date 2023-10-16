import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { currencyArray } from 'src/app/services/currency';
import { MasterServiceService } from 'src/app/services/master-service.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  userid!:any;
  storeCurrency!:any;
  storeLocation!:any;
  locationPhotos!:any;
  stores!:any;
  currencies: any = currencyArray;
  useMyLocation:boolean = true;
  sending:boolean = false;
  feedback!:any;
  hasData:boolean = true;
  passedData:boolean = false;
  

  @ViewChild('locationInput')
  locationInput!: ElementRef;


  @Input() placeholder = ""; 

  @ViewChild('infowindowContent') infowindowContentRef!: ElementRef;

  autocomplete: google.maps.places.Autocomplete | undefined;

  constructor(private ms: MasterServiceService, private fb:FormBuilder, private activateRoute:ActivatedRoute){
    
  }

  settingsform = new FormGroup({
    store: new FormControl('', Validators.required),
    currency: new FormControl('',Validators.required),
    locationInput: new FormControl('',(this.useMyLocation?Validators.required:null)),
    locationPreference: new FormControl('', Validators.required)

  })
  


  ngOnInit() { 
    this.activateRoute.queryParams.subscribe((params:any)=>{
      if(Object.keys(params).length){
          this.passedData = true; 
          this.stores = params
      }else{
        this.passedData = false;
        this.userid = localStorage.getItem('userId')
        this.ms.getStores(this.userid).subscribe((res:any)=>{
          if(res.success){
            this.stores = res.data    
            if(this.stores.length>0){
                this.hasData = true;
            }else{
              this.hasData = false
            }    
          }
    
        })
      }
    })
    
    
    // this.getLocation()
    // 
  }

  ngAfterViewInit(){
    this.initializeGoogleMaps()
  }

  
  

  listPhotos(){
    this.locationPhotos.forEach((e:any) => {
      console.log(e.getUrl())      
    });
  }
  async getLocation(){
    if(navigator.geolocation){
      await navigator.geolocation.getCurrentPosition((position:any)=>{
        this.storeLocation = {
          latitude: position.coords.latitude, 
          longitude:position.coords.longitude,
        } 
      })
      
    }else{
      console.log("Geolocation not supported")
    }
  }
  changeLocationSelectionPrefs(event:any){
    if(event.value==1){
       this.settingsform.get('locationInput')?.enable();
      }else if(event.value==2){
        this.useMyLocation = true;
        this.settingsform.get('locationInput')?.disable();
      this.getLocation();
    }
    
  }

  // initializeGoogleplaces
  initializeGoogleMaps(){
    if(this.hasData){
      this.autocomplete = new google.maps.places.Autocomplete(this.locationInput.nativeElement);
        this.autocomplete.addListener('place_changed', ()=>{
          const place = this.autocomplete?.getPlace();
          this.locationPhotos = place?.photos
          this.storeLocation = {
            latitude: place?.geometry?.location?.lat(), 
            longitude:place?.geometry?.location?.lng(),
          } 
        })

    }
  }

  submitSettings(){
    if(this.settingsform.valid){
       const data = {
         location:this.storeLocation,
         currency:this.settingsform.value.currency,
         store:this.settingsform.value.store        
       }

       this.ms.updateSellerSettings(data).subscribe((res:any)=>{
         if(res.success){
            this.feedback = res.data
         }
       })

      
    }

  }
  

  
    // Rest of your code...
  
}
