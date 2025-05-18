const mongoose = require("mongoose");
const {Schema} = mongoose;

const LikeSchema = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref:"User"
    },
    comment:{
        type:Schema.Types.ObjectId,
        ref:"Comment"
    },
    post:{
        type: Schema.Types.ObjectId,
        ref:"Post"
    }
}, {
    timestamps:true
})

module.exports = mongoose.model("CommentLike", LikeSchema);