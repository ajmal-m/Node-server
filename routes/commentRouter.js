const express = require("express");
const dotenv = require("dotenv");
const router = express.Router();

const Comment = require("../model/Comment");
const Post = require("../model/Post");
const mongoose = require("mongoose");
const LIkeComment = require("../model/LIkeComment");

dotenv.config();


router.post('/create',async (req, res) => {
    let session = await mongoose.startSession();
    try {
        const userId = req.user?._id;
        const {text, postId} = req.body;
        if(!userId){
            return res.status(200).json({
                success:false,
                message:"User is not authenticated."
            });
        }
        if(!text){
            return res.status(200).json({
                success:false,
                message:"Please give comment"
            });
        }
        if(!postId){
            return res.status(200).json({
                success:false,
                message:"Post is missing."
            })
        }

        session.startTransaction();

        const response = await Comment.create([{
            text,
            userId,
            postId,
            user: userId,
            post: postId
        }], { session: session});
        
        if(!response){
            res.status(200).json({
                success:false,
                message:"DB error"
            });
        }

        await Post.updateOne(
            {
                _id: postId
            },
            {
                $push:{
                    comments: response[0].toObject()._id
                }
            }
        ).session(session);


        await session.commitTransaction();
        session.endSession();

        res.status(200).json({
            success:true,
            message:"Comment added successfully.",
            response
        });
    } catch (error) {
        session.abortTransaction();
        session.endSession();
        return res.status(200).json({
            success:false,
            message: error?.message
        })
    }
})

router.get("/:postId",async (req, res) => {
    try {
        let {postId} = req.params;
        let { page, limit} = req.query;
        const userId = req.user._id;

        if(!userId){
            return res.status(200).json({
                success:false,
                message:"User is not authenticated"
            })
        }

        if(!page){
            return res.status(200).json({
                success:false,
                message:"Page is required."
            })
        }
        if(!limit){
             return res.status(200).json({
                success:false,
                message:"Limit is required."
            })
        }
        if(!postId){
            return res.status(200).json({
                success:false,
                message:"Post is required."
            });
        }
        page = parseInt(page);
        limit = parseInt(limit);
        const skipCount = (page-1)*limit;
        const totalCount = await Comment.countDocuments({ postId: postId});
        const totalPages = Math.ceil(totalCount/limit);
        const comments = await Comment.find({ postId: postId }).skip(skipCount).limit(limit).populate("likes").populate("user");
        for(let comment of comments){
            let userLiked = false;
            const likes = comment.likes ?? [];
            for(let like of likes){
                if(like.user.toString() === userId){
                    userLiked = true;
                    break;
                }
            }
            comment.hasLiked = userLiked;
        }
        const nextPage = totalPages > page;
        res.status(200).json({
            success:true,
            message:'Comments reterived successfully.',
            comments,
            totalPages,
            nextPage
        });
    } catch (error) {
        res.status(200).json({
            success:false,
            message:error?.message
        });
    }
})

router.delete('/:commentId', async  (req, res) => {
    const { commentId } = req.params;
    const {postId} = req.query;

    if(!postId){
        return res.status(200).json({
            success:false,
            message:"Post is required."
        })
    }
    if(!commentId){
        return res.status(200).json({
            success:false,
            message:"CommentId is required"
        });
    }

    try {
        const session = await mongoose.startSession();
        session.startTransaction();

        // Delete comment
        await Comment.findByIdAndDelete(commentId).session(session);

        // Delete commentId  from Post
        await Post.updateOne(
            {
                _id:postId
            },
            {
                $pull:{
                    comments: commentId
                }
            }
        ).session(session);

        await session.commitTransaction();

        session.endSession();

        res.status(200).json({
            success:true,
            message:"comment Deleted successfully."
        });
    } catch (error) {
        session.abortTransaction();
        session.endSession();

        res.status(200).json({
            success:false,
            message:error.message
        });
    }
})

module.exports = router;