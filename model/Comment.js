const mongoose = require("mongoose");
const { Schema} = mongoose;


const CommentSchema = new Schema({
    text:{
        type:String
    },
    userId:{
        type: Schema.Types.ObjectId,
        ref:"User"
    },
    postId:{
        type:Schema.Types.ObjectId,
        ref:"Post"
    },
    likes:[
        {
            type:Schema.Types.ObjectId,
            ref:"CommentLike"
        }
    ],
    hasLiked:{
        type:Boolean,
        default:false
    },
    likeCount:{
        type:Number,
        default:0
    },
    user:{
        type: Schema.Types.ObjectId,
        ref:"User"
    },
    post:{
        type:Schema.Types.ObjectId,
        ref:"Post"
    }
},{
    timestamps:true
});

module.exports = mongoose.model('Comment', CommentSchema);