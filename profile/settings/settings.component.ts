import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { currencyArray } from 'src/app/services/currency';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  currencies: any = currencyArray;
  @ViewChild('locationInput')
  locationInput!: ElementRef;
  @Input() placeholder = ""; 

  @ViewChild('infowindowContent') infowindowContentRef!: ElementRef;

  autocomplete: google.maps.places.Autocomplete | undefined;

  ngOnInit(): void { 
  }

  ngAfterViewInit(){
    this.autocomplete = new google.maps.places.Autocomplete(this.locationInput.nativeElement);
    this.autocomplete.addListener('place_changed', ()=>{
      const place = this.autocomplete?.getPlace();
      console.log(place)
    })
  }

  
    // Rest of your code...
  
}
