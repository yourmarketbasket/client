import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-qa-dashboard',
  templateUrl: './qa-dashboard.component.html',
  styleUrls: ['./qa-dashboard.component.css']
})
export class QaDashboardComponent implements OnInit {
  sideBarOpen = false;
  nobackdrop = false;
  toggleSB(){
    this.sideBarOpen = !this.sideBarOpen;
  }
  constructor() { }
  ngOnInit(): void {}

}
