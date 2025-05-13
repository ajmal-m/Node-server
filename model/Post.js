const mongoose = require("mongoose");
const { Schema} = mongoose;


const PostSchema = new Schema({
    title: String,
    description: String,
    creadtedAt: { type: Date, default: Date.now},
    author:{
        type: Schema.Types.ObjectId,
        ref:'User'
    },
    htmlContent:String,
    htmlObject: Object,
    thumbnail:{
        src: { type: String },
        alt: { type: String }
    },
    likeCount:{
        type: Number,
        default: 0,
    },
    likedUsers:[
        {
            type: Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    hasLiked:{
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Post', PostSchema);