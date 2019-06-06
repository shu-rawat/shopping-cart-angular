import { Component, OnInit, AfterViewInit, Output, EventEmitter, Input, ChangeDetectorRef, OnDestroy, ViewEncapsulation } from '@angular/core';
import { DataService } from '../data.service';
import { Subscription } from 'rxjs';
import { CartItem } from '../models/cartItem';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CartComponent implements OnInit, AfterViewInit, OnDestroy {
  totalQuantity: number = 0;
  cartItemsSubs: Subscription;
  items: Array<CartItem> = [];
  totalAmount: number = 0;
  showEmptyCart: boolean = true;
  showAdvt: boolean = false;
  overlayEl:HTMLElement;
  bodyEl:HTMLElement;

  // @Input('isMoalOpen') isMoalOpen:boolean = true;
  @Output('modalClosed') modalClosedEE= new EventEmitter();

  constructor(private dataService: DataService, private toastr: ToastrService, private cdRef:ChangeDetectorRef) { }

  ngOnInit() {
    this.cartItemsSubs = this.dataService.cartItemsSubj.subscribe((cartItems: Array<CartItem>) => {
      if(!this.dataService.cartModel){
        return ;
      }

      this.items = cartItems.map((cartItem:CartItem)=>{
        cartItem['totalPrice'] = cartItem.getTotalAmount();
        return cartItem;
      });

      console.log("items", this.items);
      this.totalQuantity = this.dataService.cartModel.getTotalQty();
      this.totalAmount = this.dataService.cartModel.getTotalAmount();
      this.showEmptyCart = this.totalQuantity == 0;
      this.showAdvt = this.totalQuantity != 0;
      this.cdRef.detectChanges();      
    });
  }

  ngAfterViewInit() {
    this.initData();
  }

  initData() {
    
  }

  modalCloseAction() {
    this.modalClosedEE.emit(true);
  }


  onAddItemEl(cartItemId) {
    this.dataService.postAddToCart(cartItemId).subscribe((resp:any) => {
      if (resp.response === "Failure") {
        this.toastr.error('Error!', resp.responseMessage);
      }
      else {
        this.dataService.cartModel.addItemCount(cartItemId);
        this.dataService.cartItemsSubj.next(this.dataService.cartModel.cartItems);
        this.toastr.success('Success!', resp.responseMessage);
      }
    }, () => {
      this.toastr.error('Error!', "Something went wrong");
    });
  }

  onRemoveItemEl(cartItemId) {
    this.dataService.postRemoveFromCart(cartItemId).subscribe((resp:any) => {
      if (resp.response === "Failure") {
        this.toastr.error('Error!', resp.responseMessage);
      }
      else {
        this.dataService.cartModel.removeItemCount(cartItemId);
        this.dataService.cartItemsSubj.next(this.dataService.cartModel.cartItems);
        this.toastr.success('Success!', resp.responseMessage);
      }
    }, () => {
      this.toastr.error('Error!', "Something went wrong");
    });
  }

  ngOnDestroy() {
   this.cartItemsSubs.unsubscribe();
  }
}
