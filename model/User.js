const mongoose = require('mongoose');
const {Schema} = mongoose;

const UserSchema = new  Schema({
    name: String,
    email: String,
    password: String,
    posts: [
        {
            type: Schema.Types.ObjectId,
            ref:'Post'
        }
    ],
    avatar:{
        type:String,
        default:null
    }
},{
    timestamps:true
});

module.exports = mongoose.model('User', UserSchema);