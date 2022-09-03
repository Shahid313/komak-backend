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
    driver_id:{
        type:String,
    },
    isApproved:{
        type:Boolean
    },
    isCompleted:{
        type:Boolean
    },
    latitude:{
        type:String,
    },
    longitude:{
        type:String,
    },

post_data:{
    type:Date
}



}) 


const Post = mongoose.model('Post', PostSchema)
module.exports = Post