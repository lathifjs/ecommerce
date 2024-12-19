const jwt = require('jsonwebtoken');
const config = require('../config/config');




const verifyToken = async (req, res, next) => {

    const token = req.body.token || req.query.token || req.headers['authorization'];

    if (!token) {
        res.status(200).send({ success: false, message: "token is require for authentication" })
    }
    try {
        const decode = jwt.verify(token, config.secretJwt);
        req.user = decode;
        return next();

    } catch (error) {
        res.status(400).send("invalid Token");
   }

}

module.exports = verifyToken;