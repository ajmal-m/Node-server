const mongoose = require("mongoose");
const { Schema} = mongoose;


const CommentSchema = new Schema({
    text:{
        type:String
    },
    createdAt:{
        type:Date,
        default: Date.now,
    },
    userId:{
        type: Schema.Types.ObjectId,
        ref:"User"
    },
    postId:{
        type:Schema.Types.ObjectId,
        ref:"Post"
    },
    updatedAt:{
        type:Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Comment', CommentSchema);