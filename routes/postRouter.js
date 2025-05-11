const express = require("express");
const router = express.Router();
const dotenv = require('dotenv');
const Post = require("../model/Post");

dotenv.config();


router.get('/posts', async (req, res) => {
    let {page, limit} = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    const totalCount = await Post.countDocuments();
    const totalPages = Math.ceil(totalCount/limit);

    const skip = (page-1)*limit;

    const posts = await Post.find({}).skip(skip).limit(limit).populate("author");
    const nextPage = totalPages > page;

    res.json({
        success: true,
        posts,
        totalPages,
        nextPage
    });
});


router.post('/create', async (req, res) => {
   try {
    console.log(req.body)
    const { description, authorId, htmlContent,htmlObject } = req.body;

    if(!htmlContent || !htmlObject){
        return res.status(200).json({
            success: false,
            message:"Please Provide complete Datas"
        });
    }

    // take Title
    let title='';
    try {
        title = htmlObject?.content?.find((x) => (x.type ==="heading"))?.content[0]?.text;
    } catch (error) {
        console.log(error);
        
    }

    let thumbnail = null;
    let altname = '';
    try {
        // extracting thumbnail
        const image = htmlObject?.content?.find((x) => (x.type ==="image"));
        thumbnail = image?.attrs?.src;
        altname = image?.attrs?.title;
    } catch (error) {
        console.log(error);
    }

    let createObject = {
        title: title,
        description: description,
        author: authorId,
        htmlObject,
        htmlContent
    };

    if(thumbnail){
        createObject = {...createObject, thumbnail: { src: thumbnail, alt: altname}}
    }

    await Post.create(createObject);

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

// Get posts by auhtors
router.get('/user/:id',async (req, res) => {
    try {
        const {id} = req.params;
        if(!id){
            return res.status(404).json({
                success:false,
                message:"User is Required"
            });
        }
        const posts = await Post.find(
            {
                author: id
            }
        ).populate("author");
        
        res.status(200).json({
            success:true,
            posts: posts,
        });
    } catch (error) {
        res.status(500).json({
            success:false,
            message: error.message
        });
    }
} );


router.put('/update',async (req, res) => {
    try {
        const { id, htmlContent, htmlObject } = req.body;

        if(!id) {
            return res.status(200).json({
                success:false,
                message:"Post is not found."
            });
        }

        if(!htmlContent || !htmlObject){
            return res.status(200).json({
                success:false,
                message:"All Fields are required."
            });
        }

        let title='';
        try {
            title = htmlObject?.content?.find((x) => (x.type ==="heading"))?.content[0]?.text;
        } catch (error) {
            console.log(error);
            
        }

        await Post.updateOne(
            {
                _id: id
            },
            {
                $set:{
                    htmlContent,
                    htmlObject,
                    title
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

router.post('/delete', async (req, res) => {
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
});


// get Post by id
router.get('/get-post/:id', async (req, res) => {
    const {id} = req.params;
    if(!id){
        return res.status(203).json({
            success:false,
            message:"Post Id is Required."
        });
    }

    const post = await Post.findById(id);

    if(!post){
        return res.status(404).json({
            success:false,
            message:'Post is not found.'
        });
    }

    res.status(200).json({
        success:true,
        message:"post fetched successfully.",
        post
    });
});

module.exports = router;