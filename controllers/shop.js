const Products = require('../models/product');
const Cart = require('../models/cart');

exports.getProduct =  (req, res, next) => {
    Products.fetchAll()
    .then(([rows, fileData]) => {
        res.render('shop/product-list', {prods : rows, 
            pageTitle : 'All products',
            path: '/products',
            hasProducts: rows.length > 0
            });
    })
    .catch(err => {
        console.log(err);
    });
};

exports.getProductDetails = (req, res, next) => {
        const prodID = req.params.productID;
        Products.findById(prodID)
        .then(([product, fileData]) => {
            res.render('shop/product-detail', {
                pageTitle: 'Product Details',
                path: '',
                product: product[0]
            });    
        })
        .catch(err => {
            console.log(err);
        });   
};
exports.getIndex = (req, res, next) => {
    Products.fetchAll()
    .then(([rows, fileData]) => {
        console.log(rows);
        res.render('shop/index', {
            prods : rows, 
            pageTitle : 'Shop',
            path: '/',
            hasProducts: rows.length > 0
            });
    })
    .catch(err => {
        console.log(err);
    });
    
};
exports.getCart = (req, res, next) => {
    const cartProductToShow = [];
    Cart.readCart(cartProducts => {
        Products.fetchAll(products => {
        for(product of products){
            const cartMatchedProduct = cartProducts.products.find(prod => prod.id === product.id);
            if(cartMatchedProduct){
                cartProductToShow.push({productData: product, qty: cartMatchedProduct.qty});
            }
        }
        res.render('shop/cart', { 
            pageTitle : 'My Cart',
            path: '/cart',
            prods: cartProductToShow
            });

        });
    });
}
    
exports.postCart = (req, res, next) => {
    const prodID = req.body.productID;
    Products.findById(prodID, product => {
        Cart.addProduct(prodID, product.price);
    });
    res.redirect('/cart');
};

exports.postDelCart = (req, res, next) => {
    const prodID = req.body.productID;
    Products.findById(prodID, product => {

        Cart.deleteProduct(prodID, product.price);
    });
    res.redirect('/cart');
};

exports.postQuantityCart = (req, res, next) => {
    const prodID = req.body.productID;
    const sign = req.body.sign;
    //console.log(sign);
    Products.findById(prodID, product => {
        if(sign === '+'){
            Cart.addProductCart(prodID, product.price);
        }else if(sign === '-'){
            Cart.minusProductCart(prodID, product.price);
        }else{
            console.log("Kya daba diya bhae!!!??")
        }
    });
    res.redirect('/cart');
};

