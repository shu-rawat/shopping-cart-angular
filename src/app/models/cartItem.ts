export class CartItem{
    constructor(public id,public price,public quantity=0,
        public name, public imageURL,public description,
        public stock, public category, public sku){
    }

    increaseCount(){
        ++this.quantity;
        return this.quantity;
    }

    decreaseCount(){
        --this.quantity;
        return this.quantity;
    }

    getTotalAmount(){
        return this.price*this.quantity;
    }
}

