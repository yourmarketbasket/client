import { Component, ViewChild, ElementRef } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatMenu, MenuCloseReason } from '@angular/material/menu';
import { MatSidenav } from '@angular/material/sidenav';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { FlexLayoutModule } from '@angular/flex-layout';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
  animations: [
    trigger('hamburgerAnimation', [
      state('closed', style({
        transform: 'rotate(0deg)'
      })),
      state('open', style({
        transform: 'rotate(-180deg)'
      })),
      transition('closed <=> open', [
        animate('0.3s ease-out', style({
          transform: 'rotate(-180deg)'
        })),
        animate('0.3s ease-out', style({
          transform: 'rotate(-360deg)'
        })),
        animate('0.3s ease-out', style({
          transform: 'rotate(-180deg)'
        })),
      ])
    ])
  ]
})
export class NavigationComponent {
  @ViewChild('sidenav', {static: true}) sidenav!: MatSidenav;
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;
  @ViewChild(MatMenu) menu!: MatMenu;
  isOpen: boolean = false;

  toggleSidenav() {
    this.isOpen = !this.isOpen;
  }

 
  

  searchTerm: string = '';

  sayHello(): void {
    if(this.searchTerm.length == 0){
      console.log("empty field")
    } else{
      alert(this.searchTerm)
    }
    

  }

  clearSearch(): void {
    // if (this.searchInput) {
    //   this.searchInput.nativeElement.value = '';
    // }
    // if (this.menu && this.menu.menuOpean) {
    //   this.menu.close();
    // }
  }

  toggleMenu(): void {
    // if (this.menu && this.menu.isOpen()) {
    //   this.menu.close();
    // } else if (this.menu) {
    //   this.menu.open();
    // }
  }
}
