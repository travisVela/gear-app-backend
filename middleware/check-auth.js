const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token =  req.headers.authorization.split(' ')[1];
        console.log(req.headers.authorization);
        const decodedToken = jwt.verify(token, 'this_is_my_secret');
        req.userData = { email: decodedToken, userId: decodedToken.userId };
        next();
    } catch (err) {
        res.status(401).json({
            message: '🌟 Auth failed'
        })
    }

}