const mongoose = require("mongoose");
const { Schema} = mongoose;


const PostSchema = new Schema({
    title: String,
    description: String,
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
    },
    comments:[
        {
            type: Schema.Types.ObjectId,
            ref:"Comment"
        }
    ]
}, {
  timestamps: true
});

module.exports = mongoose.model('Post', PostSchema);