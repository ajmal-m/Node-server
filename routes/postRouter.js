const express = require("express");
const router = express.Router();
const dotenv = require('dotenv');
const Post = require("../model/Post");

dotenv.config();


router.get('/posts', async (req, res) => {
    const posts = await Post.find({}).populate("author");
    res.json({
        success: true,
        posts
    });
});


router.post('/create', async (req, res) => {
   try {
    const { title, description, authorId} = req.body;

    if(!title || !description){
        return res.status(400).json({
            success: false,
            message:"Please Provide complete Datas"
        });
    }

    await Post.create({
        title: title,
        description: description,
        author: authorId
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

        await Post.updateOne(
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

router.delete('/delete', async (req, res) => {
    try {
        const { id } = req.body;
        await Post.deleteOne({
            _id: id
        });
        res.status(200).json({
            success:true,
            message:"Post deleted successfully."
        });
    } catch (error) {
        res.json({
            success: false,
            message:error.message
        });
    }
})

module.exports = router;