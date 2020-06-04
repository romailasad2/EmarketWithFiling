const path = require('path');
const express = require('express');
// const rootDir = require('../util/path');

const shopController = require('../controllers/shop');


const router = express.Router();

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProduct);

router.get('/products/:productID', shopController.getProductDetails);

router.get('/cart', shopController.getCart);

router.post('/cart', shopController.postCart);

router.post('/delete-cart', shopController.postDelCart);

router.post('/quantity-cart', shopController.postQuantityCart);

module.exports = router;
