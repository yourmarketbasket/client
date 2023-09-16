import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-quality-assurance',
  templateUrl: './quality-assurance.component.html',
  styleUrls: ['./quality-assurance.component.css']
})
export class QualityAssuranceComponent implements OnInit {
  title = "Review Store";

  ngOnInit(){
    document.title = this.title;
    
  }



}
