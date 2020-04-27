const Post = require('../models/post');

exports.createPost = (req, res, next) => {
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
    })
    .catch(err => {
        res.status(500).json({
            message: '🖋 Creating post failed 🖋'
        });
    });

}

exports.getPosts = (req, res, next) => {
    Post.find()
        .then(documents => {
            res.status(200).json({
                message: '🎁 Posts fetched successfully',
                posts: documents
            });
        })
        .catch(err => {
            res.status(500).json({
                message: '🔍 Fetching posts failed 🔍'
            })
        });
}

exports.getSinglePost = (req, res, next) => {
    Post.findById(req.params.id).then(post => {
        if (post) {
            res.status(200).json(post);
        } else {
            res.stauts(404).json({
                messages: '🏺 post not found'
            });
        }
    })
    .catch(err => {
        res.status(500).json({
            message: '🔍 Fetching posts failed 🔍'
        })
    })
}

exports.deletePost = (req, res, next) => {

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
    })
    .catch(err => {
        res.status(500).json({
            message: 'Fetching posts failed'
        })
    });
}

exports.updatePost = (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
        const url = req.protocol + '://' + req.get('host');
        imagePath = url + '/images/' + req.file.filename;
    }
    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content ,
        imagePath: imagePath,
        creator: req.userData.userId
    });
    Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post).then(result => {
        console.log(result);
        if (result.n > 0) {
            res.status(200).json({
                message: 'update successful!'
            });
        } else {
            res.status(401).json({
                message: 'Not authorized'
            })
        }
    })
    .catch(err => {
        res.status(500).json({
            message: '📁 Could not update post 📁'
        })
    });
}