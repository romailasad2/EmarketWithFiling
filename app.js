const express = require('express');
const bodyParser = require('body-parser');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errControllers = require('./controllers/error');
const db = require('./util/database');
const path = require('path');
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname , 'public')));

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

app.listen(3000, () => {
    console.log("Server started on port 3000")
});