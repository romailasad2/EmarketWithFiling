const Products = require('../models/product');
const Cart = require('../models/cart');

exports.getProduct =  (req, res, next) => {
    Products.findAll()
    .then(products => {
        res.render('shop/product-list', {prods : products, 
            pageTitle : 'All products',
            path: '/products',
            hasProducts: products.length > 0
            });
    }).catch(err => {
        console.log(err);
    });
};

exports.getProductDetails = (req, res, next) => {
        const prodID = req.params.productID;
        // Products.findAll({where: {id: prodID}}).then(product => {
        //     res.render('shop/product-detail', {
        //         pageTitle: 'Product Details',
        //         path: '',
        //         product: product[0]
        //     });    
        // }).catch(err => {
        //     console.log(err);
        // }); 
        Products.findByPk(prodID)
        .then(product => {
            res.render('shop/product-detail', {
                pageTitle: 'Product Details',
                path: '',
                product: product
            });    
        })
        .catch(err => {
            console.log(err);
        });   
};
exports.getIndex = (req, res, next) => {
    Products.findAll()
    .then(products => {
        res.render('shop/index', {
            prods : products, 
            pageTitle : 'Shop',
            path: '/',
            hasProducts: products.length > 0
            });
    }).catch(err => {
        console.log(err);
    });
};
exports.getCart = (req, res, next) => {
    req.user
    .getCart()
    .then(cart => {
        return cart.getProducts();
    })
    .then(products => {
        res.render('shop/cart', { 
                    pageTitle : 'My Cart',
                    path: '/cart',
                    prods: products
                    });
    })
    .catch(err => {
        console.log(err);
    });
    // const cartProductToShow = [];
    // Cart.readCart(cartProducts => {
    //     Products.fetchAll(products => {
    //     for(product of products){
    //         const cartMatchedProduct = cartProducts.products.find(prod => prod.id === product.id);
    //         if(cartMatchedProduct){
    //             cartProductToShow.push({productData: product, qty: cartMatchedProduct.qty});
    //         }
    //     }
    //     res.render('shop/cart', { 
    //         pageTitle : 'My Cart',
    //         path: '/cart',
    //         prods: cartProductToShow
    //         });

    //     });
    // });
}
    
exports.postCart = (req, res, next) => {
    const prodID = req.body.productID;
    let fetchedCart;
    let newQuantity = 1;
    // getting whole cart
    req.user
    .getCart()
    .then(cart => {
        fetchedCart = cart;
        // getting product of particular id from cart
        return cart.getProducts({where: {id: prodID}});
    })
    .then(products => {
        let product;
        // checking if something is present of that id or not<>
        if(products.length>0){
            product = products[0];
        }
        
        // checking aleady present prod for incrementing its id
        if(product){
            const oldQuantity = product.cartItem.qty;
            newQuantity = oldQuantity + 1;
            return product;
            // 
        }
        // getting that product whole data from database
        return Products.findByPk(prodID);
    })
    .then(product => {
        return fetchedCart.addProduct(product, {through: {qty: newQuantity}});
    })
    .then(() => {
        res.redirect('/cart');
    })
    .catch(err => {
        console.log(err);
    });
};

exports.postDelCart = (req, res, next) => {
    const prodID = req.body.productID;
    req.user
    .getCart()
    .then(cart => {
        return cart.getProducts({where: {id: prodID}});
    })
    .then(products => {
        let product;
        if(products.length>0){
            product = products[0];
            return product.cartItem.destroy();
        }
    })
    .then(() => {
        res.redirect('/cart');
    })
    .catch(err => {
        console.log(err);
    });
};

exports.postOrder = (req, res, next) => {
    let fetchedCart;
    req.user
    .getCart()
    .then(cart => {
        fetchedCart = cart;
        return cart.getProducts();
    })
    .then(products => {
        req.user.createOrder()
        .then(order => {
            order.addProducts(products.map(product => {
                product.orderItem = {qty: product.cartItem.qty};
                return product;
            })
            );
        })
        .catch(err => {
            console.log(err);
        })
    })
    .then(() => {
        return fetchedCart.setProducts(null);
    })
    .then(() => {
        res.redirect('/order');
    })
    .catch(err => {
        console.log(err);
    });
};

exports.getOrder = (req, res, next) => {
    let products = [];
    req.user
    .getOrders({include: ['products']})
    .then(order => {
        console.log(order);
        res.render('shop/orders', { 
            pageTitle : 'My Orders',
            path: '/order',
            prods: order
            });
    })
    .catch(err => {
        console.log(err);
    });
        
};

exports.postQuantityCart = (req, res, next) => {
    const prodID = req.body.productID;
    const sign = req.body.sign;
    //console.log(sign);
    req.user
    .getCart()
    .then(cart => {
        fetchedCart = cart;
        // getting product of particular id from cart
        return cart.getProducts({where: {id: prodID}});
    })
    .then(products => {
        let product;
        // checking if something is present of that id or not<>
        if(products.length>0){
            product = products[0];
        }
        if(sign === '+'){
            if(product){
                const oldQuantity = product.cartItem.qty;
                newQuantity = oldQuantity + 1;
                return product;
                // 
            }
        }else if(sign === '-'){
            if(product){
                const oldQuantity = product.cartItem.qty;
                newQuantity = oldQuantity - 1;
                return product;
                // 
            }
        }
        // checking aleady present prod for incrementing its id
        
        // getting that product whole data from database
        return Products.findByPk(prodID);
    })
    .then(product => {
        return fetchedCart.addProduct(product, {through: {qty: newQuantity}});
    })
    .then(() => {
        res.redirect('/cart');
    })
    .catch(err => {
        console.log(err);
    });
};

