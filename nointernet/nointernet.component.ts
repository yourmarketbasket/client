import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-nointernet',
  templateUrl: './nointernet.component.html',
  styleUrls: ['./nointernet.component.css']
})
export class NointernetComponent{

  constructor(private dialogRef: MatDialogRef<NointernetComponent>) {}

  closeDialog() {
    this.dialogRef.close();
  }


}
