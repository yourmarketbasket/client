import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';


@Component({
  selector: 'app-process-order',
  templateUrl: './process-order.component.html',
  styleUrls: ['./process-order.component.css']
})
export class ProcessOrderComponent implements OnInit{
  googleMapsUrl!: SafeResourceUrl;
  
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private sanitizer: DomSanitizer){
    let url = this.generateGoogleMapsUrl(this.data.origins, this.data.destination);
    this.googleMapsUrl = sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  ngOnInit(): void {
    // console.log(this.data.orders.origins, this.data.orders.destination);
  }

  generateGoogleMapsUrl(origins: { latitude: number; longitude: number }[], destinations: { latitude: number; longitude: number }[]): string {
    // Convert origins to a string
    const originString = origins
      .map(origin => `${origin.latitude},${origin.longitude}`)
      .join('|');
  
    // Convert destinations to a string
    const destinationString = destinations
      .map(destination => `${destination.latitude},${destination.longitude}`)
      .join('|');
  
    // Construct the URL
    const url = `https://www.google.com/maps/dir/?api=1&origin=${origins[0].latitude},${origins[0].longitude}&destination=${destinations[destinations.length - 1].latitude},${destinations[destinations.length - 1].longitude}&waypoints=${originString}|${destinationString}&travelmode=driving&maptype=satellite&t=k&hl=en`;
    console.log(url);
    return url;
  }
  

}
