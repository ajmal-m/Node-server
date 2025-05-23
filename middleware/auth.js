const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const verifyToken =async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        if(!token){
            return res.status(403).json({
                success:false,
                message:"Token is required"
            });
        }
        const verifiedUser =  jwt.verify(token, process.env.JWT_SECRET_KEY);
        if(!verifiedUser){
            return res.status(401).json({
                success:false,
                message:"Unauthorized user"
            });
        }
        req.user = verifiedUser?.user;
        next()
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
};

module.exports = {
    verifyToken
}