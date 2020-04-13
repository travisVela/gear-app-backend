const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.spilt(' ')[1];
        jwt.verify(token, 'this_is_my_secret');
        next();
    } catch (err) {
        res.status(401).json({
            message: 'Auth failed'
        })
    }

}