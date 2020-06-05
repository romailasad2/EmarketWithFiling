const db = require('../util/database');

module.exports = class Products{
    constructor(id, title, imageURL, price, description){
        this.id = id;
        this.title = title;
        this.imageURL = imageURL;
        this.price = price;
        this.description = description;
        
    }

    save(){
            return db.execute('INSERT INTO products (title, price, description, imageURL) Values(?, ?, ?, ?)',
            [this.title, this.price, this.description, this.imageURL]);
    }

    static deleteById(id){
        
    }

    static fetchAll(cb){
        return db.execute('SELECT * FROM products');        
    }

    static findById(id){
       return db.execute('SELECT * FROM products WHERE products.id = ?', [id])
    }
};