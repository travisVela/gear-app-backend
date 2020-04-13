const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
require('dotenv').config();

const postsRoutes = require('./routes/posts');

const app = express();

var uri = process.env.MONGO_URI;
mongoose.connect(encodeURI(uri))
    .then(res => {
        console.log('Connected to the database');
    })
    .catch(err => {
        console.log('Connection failed');
    });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//     res.setHeader('Access-Cotrol-Allow-Methods', '*')
//     next();
// })

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}
app.use(allowCrossDomain);

app.use('/api/posts', postsRoutes);

module.exports = app;