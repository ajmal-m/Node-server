const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const verifyToken =async (req, res, next) => {
    try {
        const token = req.headers['access-token'];
        if(!token){
            return next(new ApiError(403, "No token Provided"));
        }
        const verifiedUser =  jwt.verify(token, process.env.JWT_SECRET_KEY);
        if(!verifiedUser){
            return next(new ApiError(401, 'Unauthorized user'));
        }
        req.user = verifiedUser?.user;
        next()
    } catch (error) {
        return next(new ApiError(500, error.message) );
    }
};

module.exports = {
    verifyToken
}