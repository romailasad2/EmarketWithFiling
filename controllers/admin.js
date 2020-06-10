const Products = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false
    });
};

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if(!editMode){
        return res.redirect('/');
    }
    const prodID = req.params.productId;
    // Products.findByPk(prodID)
    req.user.getProducts({where: {id: prodID}})
    .then(products => {
        const product = products[0]; 
        if(!product){
            return res.redirect('/');
        }
        res.render('admin/edit-product', {
            pageTitle: 'Edit Product',
            path: '/admin/edit-product',
            editing: editMode,
            product: product
        });
    })
    .catch(err => {
        console.log(err)
    });
};

exports.postEditProduct = (req, res, next) => {
    const updatedID = req.body.productID;
    // console.log(updatedID);
    const updatedTitle = req.body.title;
    const updatedimageURL = req.body.imageURL;
    const updatedPrice = req.body.price;
    const updatedDescription = req.body.description;
    Products.findByPk(updatedID)
    .then(product => {
        product.title = updatedTitle,
        product.price = updatedPrice,
        product.imageURL = updatedimageURL,
        product.description = updatedDescription
        return product.save();
    })
    .then(() => {
        console.log("Updated suck sex fully");
        res.redirect('/admin/products');
    })
    .catch(err => {
        console.log(err);
    });

    
};

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageURL = req.body.imageURL;
    const price = req.body.price;
    const description = req.body.description;

    // const product = new Products(null, title, imageURL, price, description);
    // product.save()
    // .then(() => {
    //     res.redirect("/");
    // })
    // .catch(err => {
    //     console.log(err);
    // });
    req.user.createProduct({
        title: title,
        price: price,
        imageURL: imageURL,
        description: description
    })
    .then(() => {
        console.log("Product saved in Data Base");
        res.redirect('/admin/products');
    }).catch(err => {
        console.log(err);
    });

};

exports.postDeleteProduct = (req, res, next) => {
    const prodID = req.body.productID;
    Products.findByPk(prodID)
    .then(product => {
        return product.destroy();
    })
    .then(() => {
        console.log('product deleted');
        res.redirect('/admin/products');
    })
    .catch(err => {
        console.log(err);
    });
};

exports.getAdminProducts = (req, res, next) => {
    // Products.findAll()
    req.user.getProducts()
    .then(products => {
        res.render('admin/products', {prods : products, 
            pageTitle : 'Admin Products',
            path: '/admin/products',
            hasProducts: products.length > 0
            });
    })
    .catch(err => {
        console.log(err);
    });
};

