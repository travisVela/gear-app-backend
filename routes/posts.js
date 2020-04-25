const express = require('express');
const Post = require('../models/post');
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');

// accepted mime types
const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
}

// set up for uploading image
const storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error('Invalid mime type');
        if (isValid) {
            error = null
        }
        callBack(error, 'images');
    },
    filename: (req, file, callBack) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        callBack(null, name + '-' + Date.now() + '.' + ext);
    }
});

router.post('', checkAuth, multer({storage: storage}).single('image'), (req, res, next) => {
    const url = req.protocol + '://' + req.get('host');
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + '/images/' + req.file.filename,
        creator: req.userData.userId
    });
    console.log('🤖 post', post);
    post.save().then(result => {
        console.log(result);
        res.status(201).json({
            message: '🎉 post added successfully',
            post: {
                id: result._id,
                title: result.title,
                content: result.content,
                imagePath: result.imagePath
            }
        });
    });

})

router.get('', (req, res, next) => {
    Post.find()
        .then(documents => {
            res.status(200).json({
                message: '🎁 Posts fetched successfully',
                posts: documents
            });
        });
});

router.get('/:id', (req, res, next) => {
    Post.findById(req.params.id).then(post => {
        if (post) {
            res.status(200).json(post);
        } else {
            res.stauts(404).json({
                messages: '🏺 post not found'
            });
        }
    })
})

router.delete('/:id', checkAuth, (req, res, next) => {

    Post.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then(result => {
        console.log(result);
        if (result.n > 0) {
            res.status(200).json({
                message: 'Delete successful'
            });
        } else {
            res.status(401).json({
                message: 'Not authorized'
            })
        }
    });
});

router.put('/:id', checkAuth, (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
        const url = req.protocol + '://' + req.get('host');
        imagePath = url + '/images/' + req.file.filename;
    }
    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content ,
        imagePath: imagePath
    });
    Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post).then(result => {
        console.log(result);
        if (result.nModified > 0) {
            res.status(200).json({
                message: 'update successful!'
            });
        } else {
            res.status(401).json({
                message: 'Not authorized'
            })
        }
    });
});

module.exports = router;
