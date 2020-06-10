const express = require('express');
const bodyParser = require('body-parser');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errControllers = require('./controllers/error');
const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const cartItem = require('./models/cartItem');
const Order = require('./models/order');
const orderItem = require('./models/orderItem');
const path = require('path');
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname , 'public')));

app.use((req, res, next) => {
    User.findByPk(1)
    .then(user => {
        req.user = user;
        next();
    })
    .catch(err => {
        console.log(err);
    });
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(errControllers.err404);

// db.execute('SELECT * FROM products')
// .then(result => {
//     console.log(result)
// })
// .catch(err => {
//     console.log(err)
// });
Product.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, {through: cartItem});
Product.belongsToMany(Cart, {through: cartItem});
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, {through: orderItem});

sequelize
// .sync({force: true})
.sync()
.then(result => {
    //console.log(result);
    return User.findByPk(1);
    
})
.then(user => {
    if(!user){
        return User.create({name:'M Romail Asad', email:'romailasad2@gmail.com'});
    }
    return user;
})
.then(user => {
    return user.createCart();
})
.then(cart => {
    console.log(cart);
    app.listen(3000, () => {
        console.log('Server started at 3000');
    })
})
.catch(err => {
    console.log(err);
});
