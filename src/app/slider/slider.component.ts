import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Renderer2, QueryList, ViewChildren } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent implements OnInit, AfterViewInit {
  banners: Array<any> = [];
  initOnce: boolean = false;
  resizeEventListener: any = null;
  activeBanrIndx: number = 0;
  disableLeft:boolean = true;
  disableRight:boolean = false;
  bannerWrapperWidth;

  @ViewChild('bannerWrapperOuter', null) bannerWrapperOuter:ElementRef;
  @ViewChild('bannerWrapperEle', null) bannerWrapperEle:ElementRef;
  @ViewChildren('bnrImg') bnrImgQueryLst !: QueryList<ElementRef>;

  constructor(private dataService: DataService, private renderer:Renderer2) {

  }

  ngOnInit() {
    this.dataService.getBanners().subscribe((banners) => {
      this.banners = banners;
    });
  }

  //when window gets resized
  onResize() {
    //initializing slider data again
    this.initData();
    //appling css based on changed data aftere resizing
    this.applyCss();
  }

  ngAfterViewInit() {
    this.initData();
    this.applyCss();
    this.attachEvents();
    this.setDisableBtns();
  }

  initData() {
    this.bannerWrapperWidth = this.bannerWrapperOuter.nativeElement.offsetWidth;
  }

  attachEvents() {
    //attaching event listeners
    this.initOnce = true;
    this.resizeEventListener = this.onResize.bind(this);
    window.addEventListener("resize", this.resizeEventListener);
  }

  onDotsClick(e) {
    let targetIndex = 0;
    if (e.target.tagName == "SPAN") {
      targetIndex = Array.from(e.currentTarget.children).indexOf(e.target);
      this.slideToImageIndex(0, targetIndex);
    }
    return false;
  }

  slideToImageIndex(directionCount = 0, targetBnrIndx) {
    //slides to image index given        
    if (targetBnrIndx == null) {
      targetBnrIndx = (this.activeBanrIndx + directionCount) % this.banners.length;
    }
    //sets wrapper left 
    this.updateWrapperLeft(targetBnrIndx);
    this.activeBanrIndx = targetBnrIndx;
    //checks for disble button
    this.setDisableBtns();
  }

  updateWrapperLeft(targetBnrIndx) {
    //updates wrapper left based on current slider index.
    var wraprLeftWdth = targetBnrIndx * this.bannerWrapperWidth;
    this.bannerWrapperEle.nativeElement.style.left = `-${wraprLeftWdth}px`;
  }


  setDisableBtns() {
    //checks for disbling next and prev button 
    this.disableRight = this.activeBanrIndx == (this.banners.length - 1);
    this.disableLeft = this.activeBanrIndx == 0;
  }

  applyCss() {
    this.renderer.setStyle( this.bannerWrapperEle.nativeElement,'width',`${this.bannerWrapperWidth * this.banners.length + 100}px`)
    this.renderer.setStyle( this.bannerWrapperEle.nativeElement,'left', -this.activeBanrIndx * this.bannerWrapperWidth);
    this.bnrImgQueryLst.map((element:ElementRef)=>{
      this.renderer.setStyle(element.nativeElement,'width',`${this.bannerWrapperWidth}px`);
    });
  }

  //Lifecycle hook
  //invoked before component gets destroyed
  destroy() {
    window.removeEventListener("resize", this.resizeEventListener);
  }

}
