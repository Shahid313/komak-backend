const fs = require('fs')
const router = require('express').Router()
let AdminMessage = require('../../models/AdminMessage')
let Post = require('../../models/Post')
let Users = require('../../models/Users')
var nodemailer = require('nodemailer');

function make_reply(email,message){
  
 
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'shahidkahn11@gmail.com',
        pass: 'pasfujaowkxhzgdz'
      }
    });
  
  
  
    var mailOptions = {
      from: 'shahidkahn11@gmail.com',
      to: email,
      subject: 'Komak Reply',
      text: 'Hi Dear \n'+message
    };
  
  
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
       
        console.log(error);
      } else {
        
        console.log('Email sent: ' + info.response);
      }
    });
  }

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

router.get('/get_all_drivers',(req,res)=>{
    Users.find({'user_reg_cat':'driver'})
    .then(drivers=>{
        res.json({
            "drivers":drivers
        })
    })
})

router.get('/get_normal_users',(req,res)=>{
    Users.find({'user_reg_cat':{$ne:'driver'}})
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

//deliveries

router.get('/deliveries',(req,res)=>{
    Post.find({$and:[{"isApproved":true}, {"isCompleted":false}]})
    .then(orders=>{
        res.json({
            "orders":orders
        })
    })
})

router.post('/update_admin_name',(req,res)=>{
    const admin_id = req.body.admin_id
    const admin_name = req.body.admin_name
    Users.findById(admin_id)
    .then(async (user)=>{
  
        let filter = { _id: admin_id };
        let updateDoc = {
            $set: {
                "name":admin_name,
            }
  
        }
  
        await Users.updateMany(filter,updateDoc)
  
      return res.json({
        "msg":"Admin name updated successfully"
      })
  
    })
  })

  router.post('/reply', (req,res) => {
    const reply = req.body.sender_message
    const email = req.body.email

    make_reply(email, reply)

    return res.send({
        "msg":"Reply Sent Successfully"
      })

  })

module.exports = router

