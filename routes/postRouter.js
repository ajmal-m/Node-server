const express = require("express");
const router = express.Router();
const {connectToDB} = require('../config/db');
const dotenv = require('dotenv');

dotenv.config();

const POST_COLLECTION = process.env.POST_COLLECTION;

router.get('/posts', async (req, res) => {
    const client = await connectToDB();
    const posts = await client.collection(POST_COLLECTION).find().toArray();
    res.json({
        success: true,
        posts
    });
});


router.post('/create', async (req, res) => {
   try {
    const { title, description} = req.body;

    if(!title || !description){
        return res.status(400).json({
            success: false,
            message:"Please Provide complete Datas"
        });
    }

    const client = await connectToDB();
    await client.collection(POST_COLLECTION).insertOne({
        title: title,
        description: description
    });

    res.status(200).json({
        success:true,
        message:'Post Created successfully.'
    });
   } catch (error) {
    res.status(500).json({
        success:false,
        message:error.message
    });
   }
});


router.put('/update',async (req, res) => {
    try {
        const { id, title, description } = req.body;
        const client = await connectToDB();
        await client.collection(POST_COLLECTION).updateOne(
            {
                _id: id
            }, 
            {
                $set:{
                    title,
                    description
                }
            },
            {
                upsert:true
            }
        );

        res.status(200).json({
            success: true,
            message:'Post Updated successfully..'
        });

    } catch (error) {
        res.json({
            success:false,
            message:error.message
        });
    }
});

module.exports = router;