import { CartItem } from './cartItem';

export class CartModel{
    cartItems: Array<CartItem> = [];
    constructor(private products:Array<CartItem> = [], items:Array<any>){
        this.cartItems = this.getSavedCart(items);
    }

    addItemCount(id) {
        //finding item from cart.    
        let item = this.getItem(id);
        if (!item) {
            //item not present in cart
            //finding product by it's id in product list
            let product = this.findProductById(id);
            if (!product) {
                //item with particular id not present in products list
                alert("Could not find this product!");
                return null;
            }
            else {
                //item created and added to cart
                item = new CartItem(product.id, product.price, 1, product.name, product.imageURL, product.description, product.stock,
                    product.category, product.sku);
                this.cartItems.push(item);
            }
        }
        else {
            // item present in cart
            item.increaseCount();
        }
        return item;
    }

    getTotalAmount() {
        //returns total amount of cart
        return this.cartItems.reduce((sum, item) => {
            return sum + item.getTotalAmount();
        }, 0);
    }

    getTotalQty = function () {
        //return total number of items quanity present in cart
        return this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
    }

    removeItemCount(id) {
        //finding item in cart
        let item = this.getItem(id);
        if (!item) {
            //item not found in cart
            alert("Can not remove. Item not found in cart!");
            return null;
        }
        else {
            //decreases item count and removes item from cart if  quantiy is 0
            if (item.decreaseCount() == 0) {
                this.removeItem(item.id);
            }
        }
        return item;
    }

    removeItem = function (id) {
        //finding index of item in items array
        let itemIndex = this.cartItems.findIndex((item) => {
            return item.id == id;
        });
    
        if (itemIndex >= 0) {
            //removing item from items.
            this.cartItems.splice(itemIndex, 1);
        }
        else {
            alert("Item Not found in Cart. Can't remove");
        }
    }

    getItem(id) {
        return this.cartItems.find((item) => item.id == id);
    }

    findProductById(id) {
        return this.products.find(product => product.id == id);
    }

    getSavedCart = function (itemsList) {
        let items = []
        if (!itemsList) {
            items = [];
        }
        else {
            items = itemsList.map(item => {
                return new CartItem(item.id, item.price, item.quantity, item.name, item.imageURL, item.description, item.stock, item.category, item.sku);
            });
        }
        return items;
    }
}
