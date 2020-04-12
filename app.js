const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Cotrol-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS')
    next();
})

app.post('/api/posts', (req, res, next) => {
    const post = req.body;
    console.log('🤖 post', post);
    res.status(201).json({
        message: 'post added successfully'
    });
})

app.get('/api/posts', (req, res, next) => {
    const posts = [
        {
            id: 'sdifh73',
            title: 'First server side post',
            content: 'this is coming from the server'
        },
        {
            id: 'lkajsdfjelfe',
            title: 'Second server side post',
            content: 'This too is coming from the server!'
        }
    ]

    res.status(200).json({
        message: 'Posts fetched successfully',
        posts: posts
    });
})

module.exports = app;