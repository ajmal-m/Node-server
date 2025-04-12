const express = require("express");
const app = express();
const dotenv = require("dotenv");
const {connectToDB} = require('../config/db');``
const postRouter = require('../routes/postRouter');
const userRouter = require('../routes/userRouter');

dotenv.config();

const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use('/user', userRouter);
app.use('/post', postRouter);


connectToDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running PORT ${PORT}`)
    })
});

module.exports = app;