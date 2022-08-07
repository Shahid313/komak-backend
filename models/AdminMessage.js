const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AdminMessageSchema = new Schema({
    sender_name:{
        type:String,
       
    },
    sender_email:{
        type:String,
    },
    sender_message:{
        type:String,
    },

}) 


const AdminMessage = mongoose.model('AdminMessage', AdminMessageSchema)
module.exports = AdminMessage