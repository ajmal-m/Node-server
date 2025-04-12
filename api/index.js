const express = require("express");
const app = express();

app.get("/", (req, res) => {
    res.send("Welcome To Express App")
});

app.get('/home', (req, res) => {
    res.send("<h2>Welcome Home Page</h2>")
})


app.listen(3000, () => console.log("Server ready on port 3000"));

module.exports = app;