const express = require('express');
const bodyParser = require('body-parser');
const Post = require('./models/post');
const mongoose = require('mongoose');
require('dotenv').config();

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

app.post('/api/posts', (req, res, next) => {
    const post = new Post({
        title: req.body.title,
        content: req.body.content
    });
    console.log('🤖 post', post);
    post.save().then(result => {
        console.log(result);
        res.status(201).json({
            message: 'post added successfully',
            postId: result._id
        });
    });

})

app.get('/api/posts', (req, res, next) => {
    Post.find()
        .then(documents => {
            res.status(200).json({
                message: 'Posts fetched successfully',
                posts: documents
            });
        });
});

app.delete('/api/posts/:id', (req, res, next) => {

    Post.deleteOne({ _id: req.params.id }).then(result => {
        console.log(result);
        res.status(200).json({
            message: 'Post deleted'
        });
    });
});

module.exports = app;