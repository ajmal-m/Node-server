const mongoose = require('mongoose');
const dotenv = require("dotenv");
dotenv.config();


const URL = process.env.MONGODB_URL;



const connectToDB = async () => {
    try {
        return await mongoose.connect(URL, { serverSelectionTimeoutMS: 5000});
    } catch (error) {
        process.exit(1);
    }
};



module.exports = {
    connectToDB,
}