import { SelectionModel } from '@angular/cdk/collections';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Order } from 'src/app/Interfaces/interfaces-master-file';


@Component({
  selector: 'app-process-order',
  templateUrl: './process-order.component.html',
  styleUrls: ['./process-order.component.css']
})
export class ProcessOrderComponent implements OnInit{
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  googleMapsUrl!: SafeResourceUrl;
  origins:any;
  destinations:any;
  mapUrl:any;
  orderData:any;
   // Initialize with an empty data source
  orders: any;
  products:any;
  
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private sanitizer: DomSanitizer){}
  
  ngOnInit(): void {
    console.log(this.data)
    this.orderData = this.ensureArrays(this.data, ['products','payment'])

    // console.log(this.orderData);
    
  }
  
  ensureArrays(obj: any, keysToConvert: string[]): any {
    // Iterate over all keys in the object
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        // If the key is one of the properties that should be an array
        if (keysToConvert.includes(key)) {
          // Convert the value to an array if it's not already an array
          if (!Array.isArray(obj[key])) {
            obj[key] = obj[key] ? [obj[key]] : []; // Wrap in an array or set to an empty array if undefined/null
          }
        }
  
        // If the value is an object, recursively apply the function
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          this.ensureArrays(obj[key], keysToConvert);
        }
      }
    }
    return obj;
  }
  

  

  

  generateGoogleMapsUrl(
    origins: { latitude: number; longitude: number }[] = [],
    destinations: { latitude: number; longitude: number }[] = []
  ): string {
    if (origins.length === 0 || destinations.length === 0) {
      console.error('Origins or destinations are missing.');
      return '';
    }
  
    const apiKey = 'AIzaSyDdvqTHmz_HwPar6XeBj8AiMxwzmFdqC1w';
  
    const originString = origins
      .map(origin => `${origin.latitude},${origin.longitude}`)
      .join('|');
    
    const destinationString = destinations
      .map(destination => `${destination.latitude},${destination.longitude}`)
      .join('|');
  
    const url = `https://www.google.com/maps/embed/v1/directions?key=${apiKey}&origin=${origins[0].latitude},${origins[0].longitude}&destination=${destinations[destinations.length - 1].latitude},${destinations[destinations.length - 1].longitude}&waypoints=${originString}|${destinationString}&mode=driving`;
  
    console.log(url);
    return url;
  }
  
  
  

}
