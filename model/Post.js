const mongoose = require("mongoose");
const { Schema} = mongoose;


const PostSchema = new Schema({
    title: String,
    description: String,
    creadtedAt: { type: Date, default: Date.now},
    author:{
        type: Schema.Types.ObjectId,
        ref:'User'
    }
});

module.exports = mongoose.model('Post', PostSchema);