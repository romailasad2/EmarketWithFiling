const fs = require('fs');
const path = require('path');
const rootDir = require('../util/path');

const p = path.join(rootDir, 
    'data',
    'cart.json'
);

module.exports = class Cart {
    static addProduct(id, totalPrice) {
        //Fetch the previous cart
        fs.readFile(p, (err, fileContent) => {
            let cart = {products: [], totalPrice: 0};
            if(!err){
                cart = JSON.parse(fileContent);
                //Analyze the cart => Find existing product
            }
            const existingProdIndex = cart.products.findIndex(prod => prod.id === id);
            const existingProduct = cart.products[existingProdIndex];
            let updatedProduct;
            //Add new product/ increase quantity
            if(existingProduct){
                updatedProduct = {...existingProduct};
                updatedProduct.qty += 1; 
                cart.products = [...cart.products];
                cart.products[existingProdIndex] = updatedProduct;
            }else{
                updatedProduct = {id : id, qty: 1};
                cart.products = [...cart.products, updatedProduct];
            }
            cart.totalPrice = cart.totalPrice + +totalPrice;
            fs.writeFile(p, JSON.stringify(cart), err => {
                console.log(err);
            });
            
        });
    }
    static deleteProduct(id, productPrice){
        fs.readFile(p, (err, fileContent) => {
            if(err){
                return;
            }
            const updatedCart = {...JSON.parse(fileContent)};
            const product = updatedCart.products.find(prod => prod.id === id);
            const productQty = product.qty;
            updatedCart.products = updatedCart.products.filter(prod => prod.id !== id);
            updatedCart.totalPrice -= productPrice * productQty;

            fs.writeFile(p, JSON.stringify(updatedCart), err => {
                console.log(err);
            });
        });
    };

    static addProductCart(id, productPrice){
        fs.readFile(p, (err, fileContent) => {
            if(err){
                console.log("F*ked in minusProductCart in cart.js")
                return;
            }
            const updatedCart = {...JSON.parse(fileContent)};
            const productIndex = updatedCart.products.findIndex(prod => prod.id === id);
            updatedCart.products[productIndex].qty += 1;
            //const product = updatedCart.products.find(prod => prod.id === id);
            // const productQty = updatedCart.products[productIndex].qty;
            updatedCart.totalPrice += +productPrice;
            
            fs.writeFile(p, JSON.stringify(updatedCart), err => {
                console.log(err);
            });
        });
    };

    static minusProductCart(id, productPrice){
        fs.readFile(p, (err, fileContent) => {
            if(err){
                console.log("F*ked in minusProductCart in cart.js")
                return;
            }
            const updatedCart = {...JSON.parse(fileContent)};
            const productIndex = updatedCart.products.findIndex(prod => prod.id === id);
            updatedCart.products[productIndex].qty -= 1;
            //const product = updatedCart.products.find(prod => prod.id === id);
            const productQty = updatedCart.products[productIndex].qty;
            if(productQty === 0){
                this.deleteProduct(id, productPrice);
                return;
            }
            updatedCart.totalPrice -= +productPrice;
            
            fs.writeFile(p, JSON.stringify(updatedCart), err => {
                console.log(err);
            });
        });
    };

    static readCart(cb){
        fs.readFile(p, (err, fileContent) => {
            if(err){
                cb(null);
            }
            //console.log("In readCart");
            const products = JSON.parse(fileContent);
            cb(products);
        });
    }
} 