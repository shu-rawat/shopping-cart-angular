import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { HttpClient} from '@angular/common/http';
import { map } from 'rxjs/operators';

const url="http://localhost:3000";

@Injectable({
  providedIn: 'root'
})
export class DataService {
  products: Array<any> = [];
  categories: Array<any> = [];
  banners: Array<any> = [];

  cartCountSubj: BehaviorSubject<Number> = new BehaviorSubject(0);

  constructor(private http:HttpClient) { }

  getProducts() {
    if (this.products.length) {
      return of(this.products);
    };

    return this.http.get(`${url}/products`).pipe(
      map((products:Array<any>)=>{
        this.products = products;
        return this.products;
      })
    );
  }

  getCategories() {
    if (this.categories.length) {
      return of(this.categories);
    }

    return this.http.get(`${url}/categories`).pipe(
      map((categories:Array<any>)=>{
        this.categories = categories;
        return this.categories;
      })
    );
  }

  getCartItems() {
    return this.http.get(`${url}/cartItems`);
  }

  getBanners() {
    if (this.banners.length) {
      return of(this.banners);
    }

    return this.http.get(`${url}/banners`).pipe(map(
      (banners:Array<any>)=>{
        this.banners = banners;
        return this.banners;
      }
    ));
  }

  postAddToCart(productId) {
    let data = { productId, decreaseCount: false };
    return this.http.post("/addToCart",data);
  }

  postRemoveFromCart(productId) {
    let data = { productId, decreaseCount: true };
    return this.http.post("/addToCart",data);
  }
}
