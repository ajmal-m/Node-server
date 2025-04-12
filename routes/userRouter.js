const express = require('express');
const router = express.Router();

router.get('/users' , (req, res) => {
    res.send("<h1>User Profile</h1>")
});

module.exports = router;