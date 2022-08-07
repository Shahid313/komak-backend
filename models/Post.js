const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PostSchema = new Schema({
    post_name:{
        type:String,
       
    },
    post_location:{
        type:String,
    },
    post_description:{
        type:String
    },
    post_image:{
        type:String,
    },
    user_id:{
        type:String
    },
    isApproved:{
        type:Boolean
    }




}) 


const Post = mongoose.model('Post', PostSchema)
module.exports = Post