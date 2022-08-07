const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name:{
        type:String
    },

    email:{
        type:String,
        unique: true,
    },

    password:{
        type:String
    },

    image:{
        type:String,
        required:false
    },

    user_reg_cat:{
        type:String
    },

    status:{
        type:String
    }
    
})

const Users = mongoose.model('Users', userSchema)

module.exports = Users