const jwt = require("jsonwebtoken");
const messModel = require("../model/messModel");

const auth = async (req, res, next) => {
    let token = null;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const verify = jwt.verify(token, "messsecret");
            req.mess = await messModel.findOne({_id: verify.uid});
            next();
        } catch (err) {
            console.log("Unauthorized user");
            return res.status(401).json({success: false, message: `user not authorized`})
        }
    }
    if (token == null) {
        console.log("Token null");
        return res.status(401).json({success: false, message: `user not authorized`})
    }
}

module.exports = auth;