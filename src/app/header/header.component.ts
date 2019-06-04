import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { DataService } from '../data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, AfterViewInit, OnDestroy {
  cartCount: Number = 0;
  carteUpdateListener: any;
  overlayEle: any;
  bodyEle: any;
  cartItemCountSubs:Subscription;

  isModalOpen: boolean = false;
  isMenuOpen: boolean = false;

  constructor(private dataService: DataService) {
  }

  ngOnInit() {
    this.cartItemCountSubs = this.dataService.cartCountSubj.subscribe((count)=>{
      this.cartCount = count;
    });
  }

  ngAfterViewInit() {
    this.overlayEle = document.querySelector(".overlay");
    this.bodyEle = document.querySelector("body");
  }

  navMobileToggle() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  modalAction() {
    if (this.bodyEle.offsetWidth <= 768) {
      return;
    }

    this.isModalOpen = !this.isModalOpen;
    this.overlayEle.classList.remove("d-none");
    this.bodyEle.classList.add("no-scroll");
  }

  ngOnDestroy() {
    this.cartItemCountSubs.unsubscribe();
  }

}
