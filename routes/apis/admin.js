const fs = require('fs')
const router = require('express').Router()
let AdminMessage = require('../../models/AdminMessage')
let Post = require('../../models/Post')
let Users = require('../../models/Users')

router.post('/send_admin_message',(req,res)=>{
    const {sender_name,sender_email,sender_message} = req.body
        try{
            const message = new AdminMessage({
                "sender_name":sender_name,
                "sender_email":sender_email,
                "sender_message":sender_message,
            })
            message.save();
        }catch(err){
            if(err){
                console.log(err)
            }
        }
        return res.send({
            "msg":"Message Sent Successfully"
        })
});


//posts to approve
router.get('/posts_to_approve',(req,res)=>{
    Post.find({"isApproved":false})
    .then(posts=>{
        res.json({
            "posts":posts
        })
    })
})

router.get('/posts_to_approve_details',(req,res)=>{
    const post_id = req.query.post_id
    Post.find({"_id":post_id})
    .then(post=>{
        res.json({
            "post":post
        })
    })
})

//approve_post
router.post('/approve_post',(req,res)=>{
    const post_id = req.query.post_id

    Post.updateOne({_id: post_id}, { $set:{isApproved:true}},(err, result) => {
      console.log(result)
      if(err){
        console.log(err)
      }else{
        res.json({
          "msg":"Post approved"
        })
      }
      
    })
    
  })

  router.get('/get_all_users',(req,res)=>{
    Users.find()
    .then(users=>{
        res.json({
            "users":users
        })
    })
})

//message
router.get('/messages', (req,res)=>{
    AdminMessage.find()
    .then(messages=>{
        res.json({
            "messages":messages
        })
    })
})

module.exports = router

