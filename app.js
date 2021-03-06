const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();


const mongoose = require('mongoose');

const postsRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');

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
app.use('/images', express.static(path.join('./images')));

// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//     res.setHeader('Access-Cotrol-Allow-Methods', '*')
//     next();
// })

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
}
app.use(allowCrossDomain);

app.get('/', (req, res, next) => {
    res.send({
        message: 'this is a message',

    })
});

// app.use('/');
app.use('/api/posts', postsRoutes);
app.use('/api/user', userRoutes);

module.exports = app;