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
    Products.findById(prodID, product => {
        res.render('admin/edit-product', {
            pageTitle: 'Edit Product',
            path: '/admin/edit-product',
            editing: editMode,
            product: product
        });
    });
};

exports.postEditProduct = (req, res, next) => {
    const updatedID = req.body.productID;
    // console.log(updatedID);
    const updatedTitle = req.body.title;
    const updatedimageURL = req.body.imageURL;
    const updatedPrice = req.body.price;
    const updatedDescription = req.body.description;

    const updateProduct = new Products(updatedID, updatedTitle, updatedimageURL, updatedPrice, updatedDescription);
    updateProduct.save();

    res.redirect('/admin/products')
};

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageURL = req.body.imageURL;
    const price = req.body.price;
    const description = req.body.description;

    const product = new Products(null, title, imageURL, price, description);
    product.save()
    .then(() => {
        res.redirect("/");
    })
    .catch(err => {
        console.log(err);
    });

};

exports.postDeleteProduct = (req, res, next) => {
    const prodID = req.body.productID;
    Products.deleteById(prodID);
    res.redirect('/admin/products');
};

exports.getAdminProducts = (req, res, next) => {
    Products.fetchAll(products => {
        res.render('admin/products', {prods : products, 
            pageTitle : 'Admin Products',
            path: '/admin/products',
            hasProducts: products.length > 0
            });
    });
};

