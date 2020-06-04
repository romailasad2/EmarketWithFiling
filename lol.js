const express = require('express');

const app = express();

app.get('/', (req, res) => {res.send("<h1>All good vro..</h1>"); 
console.log("Hell no!")});

app.listen(4000, () => {console.log("server started on prot 4000")});