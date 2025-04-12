const mongoose = require('mongoose');
const {Schema} = mongoose;

const UserSchema = new  Schema({
    name: String,
    email: String,
    password: String,
    createdAt: {
        type:Date,
        default: Date.now
    },
    posts: [
        {
            type: Schema.Types.ObjectId,
            ref:'POST'
        }
    ]
});

module.exports = mongoose.model('User', UserSchema);