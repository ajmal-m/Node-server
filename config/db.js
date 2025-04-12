const { MongoClient, ServerApiVersion} = require("mongodb");
const dotenv = require("dotenv");
dotenv.config();


const URL = process.env.MONGODB_URL;
const DB = process.env.DB_NAME;

// mongo client Instance
const client = new MongoClient(URL, {
    serverApi:{
        version:ServerApiVersion.v1,
        strict: true,
        deprecationErrors:true
    }
});



const connectToDB = async () => {
    try {
        client.connect();
        return client.db(DB);
    } catch (error) {
        process.exit(1);
    }
};

const db = () => {
    try {
        return client.db(DB);
    } catch (error) {
        process.exit(1);
    }
}


module.exports = {
    connectToDB,
    db
}