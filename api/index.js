const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");

const {connectToDB} = require('../config/db');``
const postRouter = require('../routes/postRouter');
const userRouter = require('../routes/userRouter');
const authRouter = require('../routes/authRouter');
const {verifyToken} = require('../middleware/auth');


dotenv.config(); 

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors())

app.use('/user', verifyToken,  userRouter);
app.use('/post', verifyToken,  postRouter);
app.use('/auth', authRouter);


connectToDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running PORT ${PORT}`)
    })
});

module.exports = app;