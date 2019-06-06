import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { ActivatedRoute, Params } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  categories: Array<any> = [];
  products: Array<any> = [];
  empty: boolean = true;
  allSelected: boolean = true;
  selectedCategory: string;
  isCategDrpOpen: boolean = false;

  constructor(private dataService: DataService, private activeRoute: ActivatedRoute,
     private toastr: ToastrService) { }


  ngOnInit() {
    this.dataService.getProducts().subscribe((products: Array<any>) => {
      this.products = products;
      this.empty = this.products.length == 0;
      this.allSelected = !this.activeRoute.snapshot.params.id || this.activeRoute.snapshot.params.id.length == 0;
    });

    this.dataService.getCategories().subscribe((categories: Array<any>) => {
      this.categories = categories.map(category => {
        return { ...category, active: this.activeRoute.snapshot.params.id == category.id };
      }).filter((category)=>{
        return category.enabled;
      });
    });

    this.selectedCategory = this.activeRoute.snapshot.params.id;

    this.activeRoute.params.subscribe((params: Params) => {
      this.selectedCategory = params.id;
    });
  }

  onBuyNow(productId) {
    this.dataService.postAddToCart(productId).subscribe((resp: any) => {
      if (resp.response === "Success") {
        this.toastr.success('Success!', resp.responseMessage);
        this.dataService.cartModel.addItemCount(productId);
        this.dataService.cartCountSubj.next(this.dataService.cartModel.getTotalQty());
        this.dataService.cartItemsSubj.next(this.dataService.cartModel.cartItems);
      }
      else {        
        this.toastr.error('Failure!', resp.responseMessage);
      }
    }, () => {
      this.toastr.error('Failure!', "Something went wrong");
    });
  }

  categLinkAction(e) {
    this.isCategDrpOpen = !this.isCategDrpOpen;
  }

}
