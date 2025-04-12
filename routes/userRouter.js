const express = require('express');
const router = express.Router();
const User = require('../model/User');
const bcrypt = require("bcrypt");

router.get('/all' , async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json({
            success:true,
            users:users
        });
    } catch (error) {
        res.status(200).json({
            success:false,
            message: error.message
        });
    }
});


router.post('/create', async (req, res) => {
    try {
        let { name, email, password } = req.body;
        if(!name || !email || !password){
            return res.status(402).json({
                success:false,
                message:"Every fields are required."
            });
        }
        password = await bcrypt.hash(password, 10);
        await User.create({
            name,
            email,
            password
        });
        res.status(400).json({
            success: true,
            message: "Successfully created user"
        });
    } catch (error) {
        res.status(200).json({
            success:false,
            message:error.message
        });
    }
});


router.put('/update',async (req, res) => {
    try {
        let { id, name, password} = req.body;
        if(!id){
            return res.status(404).json({
                success:false,
                message:"User is Required"
            });
        }
        if(!name || !password) {
            return res.status(404).json({
                success: false,
                message:'Everey data is required'
            });
        }
        password = bcrypt.hash(password, 10);
        await User.updateOne(
            {
                _id:id
            },
            {
                $set:{
                    name,
                    password
                }
            },
            {
                upsert:true
            }
        );
        res.status(200).json({
            success:true,
            message:"User updated successfully."
        });
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
});

router.delete('/delete/:id',async (req, res) => {
    try {
        const {id} = req.params;
        if(!id){
            return res.status(402).json({
                success:false,
                message: "User is Required."
            });
        }
        await User.deleteOne({
            _id: id
        });
        res.status(200).json({
            success:true,
            message:"User deleted successfully.."
        });
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
});

module.exports = router;