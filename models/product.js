const fs = require('fs');
const path = require('path');
const Cart = require('./cart')
const rootDir = require('../util/path');

const p = path.join(rootDir, 
    'data',
    'products.json'
);

const getDataFromFile = cb => {

    fs.readFile(p, (err, fileContent) => {
        if(err){
            cb([]);
        }else{
            cb(JSON.parse(fileContent));
        }
    });
};

module.exports = class Products{
    constructor(id, title, imageURL, price, description){
        this.id = id;
        this.title = title;
        this.imageURL = imageURL;
        this.price = price;
        this.description = description;
        
    }

    save(){
            getDataFromFile(products => {
                // If already a product exists / having a ID
                if(this.id){
                    const existingProductIndex = products.findIndex(
                        prod => prod.id === this.id
                        );
                    const updatedProduct = [...products];

                    updatedProduct[existingProductIndex] = this;

                    fs.writeFile(p , JSON.stringify(updatedProduct), err => {
                        console.log(err);
                        });
                        // For creating and saving new products / having no previous ID
                }else{
                    this.id = Math.random().toString();
                    products.push(this);
                    fs.writeFile(p , JSON.stringify(products), err => {
                    console.log(err);
                });

                }
                
            });
    }

    static deleteById(id){
        getDataFromFile(products => {
            const product = products.find(prod => prod.id === id);
            const updatedProduct = products.filter(p => p.id !== id);
            fs.writeFile(p, JSON.stringify(updatedProduct), err => {
                if(!err){
                    Cart.deleteProduct(id, product.price)                    
                }
            });
        });
    }

    static fetchAll(cb){
        getDataFromFile(cb);
    }

    static findById(id, cb){
        getDataFromFile(products => {
            const product = products.find(p => p.id === id);
            cb(product);
        });
    }
};