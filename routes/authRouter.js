const express = require("express");
const router = express.Router();
const User = require('../model/User');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();


router.post('/sign-in', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if(!email || !password) {
            return res.status(404).json({
                success:false,
                message:"All fields are required"
            });
        }


        const userExist = await User.findOne({
            email: email
        });

        if(!userExist){
            return res.status(404).json({
                success:false,
                message:"User doesn't exist"
            });
        }

        const passwordCorrect = await  bcrypt.compare(password, userExist.password);

        console.log(passwordCorrect)

        if(!passwordCorrect){
            return res.status(402).json({
                success:false,
                message:"Password is incorrect"
            });
        }

        const token = jwt.sign({ id: userExist._id, name: userExist.name}, process.env.JWT_SECRET_KEY , { expiresIn: '24h'}  );

        res.status(200).json({
            success: true,
            token,
            message:"User signed successfully."
        })

    } catch (error) {
        res.status(500).json({
            success:false,
            message: error.message
        });
    }
});


router.post('/sign-up', async (req, res) => {
    try {
        let {email, password, name} = req.body;

        if(!email || !password || !name) {
            return res.status(404).json({
                success:false,
                message:"All fields are required"
            });
        }

        const userExist = await User.findOne({
            email
        });

        if(userExist){
            return res.status(402).json({
                success:false,
                message:"Email already used"
            })
        }

        password = await bcrypt.hash(password, 10);

        const createdUser = await User.create({
            name, 
            email,
            password
        });


        const token =  jwt.sign({ id: createdUser._id, name: createdUser.name}, process.env.JWT_SECRET_KEY, { expiresIn: '24h'});


        res.status(200).json({
            success:true,
            message:'User sign up successfully.',
            token
        });
        
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
});


module.exports = router;