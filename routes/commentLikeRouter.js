const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Comment = require("../model/Comment");
const LIkeComment = require("../model/LIkeComment");


router.post("/create" ,async (req, res) => {
    const {commentId, postId} = req.body;
    const userId = req.user._id;
    if(!commentId){
        return res.status(200).json({
            success:false,
            message:"Comment is required."
        })
    }
    if(!postId){
        return res.status(200).json({
            success:false,
            message:"Post is required."
        })
    }

    if(!userId){
        return res.status(200).json({
            success:false,
            message:"User is required."
        });
    }
    const session = await mongoose.startSession();
   try {
    session.startTransaction();
    const response = await LIkeComment.create([{
        user: userId,
        comment: commentId,
        post:postId
    }], { session : session});
    await Comment.updateOne(
        {
            _id: commentId
        },
        {
            $push:{
                likes: response[0].toObject()._id
            }
        }
    ).session(session)
    await session.commitTransaction();
    session.endSession();
    res.status(200).json({
        success:true,
        message:"Like added successfully."
    })
   } catch (error) {
    session.abortTransaction();
    session.endSession();
    res.status(200).json({
        success:false,
        message:  error.message
    })
   }
});


router.delete("/delete", async(req, res) => {
    const {commentId, postId } = req.query;
    const userId = req.user._id;
    if(!userId) return res.status(200).json({
        success:false,
        message:"User is not authenticated"
    });
    if(!commentId) return res.status(200).json({
        success:false,
        message:"Comment Id is Required."
    });
    if(!postId) return res.status(200).json({
        success:false,
        message:"Like Id is required."
    });

    const commentLiked = await LIkeComment.find({
        user: userId,
        post: postId,
        comment: commentId
    });

    if(!commentLiked) return res.status(200).json({
        success:false,
        messsage:"User not Liked this comment"
    })

    const commentLLikedId = commentLiked[0]._id.toString();

    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        // Delete Like Model
        await LIkeComment.deleteOne({
           _id: commentLLikedId
        }).session(session);


        // Pull likeId from Cmment Model
        await Comment.updateOne(
            {
                _id: commentId
            },
            {
                $pull:{
                    likes: commentLLikedId
                }
            }
        ).session(session);

        await session.commitTransaction();

        session.endSession();

        res.status(200).json({
            success:true,
            message:"Comment Like Deleted successfully."
        })
    } catch (error) {
        session.abortTransaction();
        session.endSession();
        res.status(200).json({
            success:false,
            message: error.message
        })
    }
})
module.exports = router;