const router = require('express').Router();
let Users = require('../../models/Users')
const fs = require('fs')
const Stripe = require('stripe')
const mongoose = require('mongoose')
var nodemailer = require('nodemailer');
require('dotenv').config();

const bcrypt = require('bcrypt');        
const saltRounds = 10;

function forgot_password_mail(email,code){
  
 
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
    subject: 'Komak Verification Code',
    text: 'Your Verification Code is : ' + code
  };


  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
     
      console.log(error);
    } else {
      
      console.log('Email sent: ' + info.response);
    }
  });
}

//node mailer

function send_mail(email,code){
  
 
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
    subject: 'Komak Verification Code',
    text: 'Your Verification Code is : ' + code
  };


  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
     
      console.log(error);
    } else {
      
      console.log('Email sent: ' + info.response);
    }
  });
}

//nodemailer

//send mail to driver

function send_mail_to_driver(email,password){
  
 
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
    subject: 'Komak Verification',
    text: 'Your email: ' + email+'\nYour password: '+password
  };


  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
     
      console.log(error);
    } else {
      
      console.log('Email sent: ' + info.response);
    }
  });
}

router.get('/email_verification',(req,res)=>{
  let email = req.query.email
    try{
    
      Users.findOne({email:email})
     .then(result=>{
       if(result != null){
 
         return res.send({
           "msg":"User Already Exist"
         })
       }else{
        var random_digits = Math.floor(1000 + Math.random() * 9000);
        send_mail(email,random_digits)
         
         return res.send({
           "code":random_digits,
           "msg":"OTP sent"
         })
 
       }
 
     })
     
   }
   catch(err){
     return res.status(422).send(err.message)
   }


})

//signup api
router.post('/signup',(req,res)=>{
    let hash_password;
    let name = req.body.name
    let email = req.body.email
    let password = req.body.password
    let user_reg_cat = req.body.user_reg_cat
    bcrypt.hash(password,saltRounds,(err,hash)=>{
      hash_password = hash
      try{
      
        Users.findOne({email:email})
       .then(result=>{
         if(result != null){
   
           return res.send({
             "msg":"User Already Exist"
           })
         }else{
           const user = new Users({
             "name":name,
             "email":email,
             "password":hash_password,
             "user_reg_cat":user_reg_cat,
             "image":"",
           });
   
            user.save();
            if(user_reg_cat == 'driver'){
              send_mail_to_driver(email, password)
            }
           console.log("signed Up")
           return res.send({
             "msg":"User Registered Successfully"
           })
   
         }
   
       })
       
     }
     catch(err){
       return res.status(422).send(err.message)
     }
    })
  
  })


  //signin
  router.post('/signin',(req,res)=>{
    const {email,password} = req.body
     Users.findOne({email:email})
     .then(user=>{
      if(user != null){
        bcrypt.compare(password, user.password, function(error, response) {
          console.log(response)
         if(response == true){
          console.log(user)
           res.send({
             "user":user,
             "msg":"logged in Succesfully"
           })
         }else{
           res.send({
             "msg":"Incorrect email or password"
           })
         }
      });
      }else{
       res.send({
         "msg":"Incorrect email or password"
       })
     }
  
  
     })
    })

  //update user

  router.post('/profile_image',(req,res)=>{
    const user_id = req.body.user_id
    const file = req.files.profileImage
    console.log(file)
    const filename = file.name
    console.log(filename)
    Users.findById(user_id)
    .then(async (user)=>{
      await fs.unlink('public/user_images/'+user.image,function(result){
       console.log(result)
      })
  
      await file.mv('public/user_images/'+filename, function(err){
          if(err){
              res.send(err)
          }
        })
  
        let filter = { _id: user_id };
        let updateDoc = {
            $set: {
                "image":filename,
            }
  
        }
  
        await Users.updateMany(filter,updateDoc)
  
      return res.json({
        "msg":"Profile Image Uploaded Succesfully"
      })
  
    })
  })


  router.get('/getUserImage',(req,res)=>{
    const user_id = mongoose.Types.ObjectId(req.query.user_id)
    Users.findOne({"_id":user_id})
    .then(userImage=>{
      console.log(userImage)
        res.json({
            "userImage":userImage.image
        })
    })
})

router.get('/getUserData',(req,res)=>{
  const user_id = mongoose.Types.ObjectId(req.query.user_id)
  Users.findOne({"_id":user_id})
  .then(user=>{
    console.log(user)
      res.json({
          "user":user
      })
  })
})


router.post('/login_for_changing_password',(req,res)=>{
  const {email,password} = req.body
   Users.findOne({email:email})
   .then(user=>{
    if(user != null){
      bcrypt.compare(password, user.password, function(error, response) {
        console.log(response)
       if(response == true){
         res.send({
           "msg":"logged in Succesfully"
         })
       }else{
         res.send({
           "msg":"Incorrect email or password"
         })
       }
    });
    }else{
     res.send({
       "msg":"Incorrect email or password"
     })
   }


   })
  })


  router.post('/update_password',(req,res)=>{
    const user_id = req.body.user_id
    const new_password = req.body.new_password
    let hash_password;
    bcrypt.hash(new_password,saltRounds, (error, hash) => {
      hash_password = hash
    })

    Users.updateOne({user_id: user_id}, { $set:{password:hash_password}},(err, result) => {
      console.log(result)
      if(err){
        console.log(err)
      }else{
        res.json({
          "msg":"Password updated succesfully"
        })
      }
      
    } )

  })

const stripe = new Stripe('sk_test_51JvHo6IFWqjmRPIaYdR14LZYgxXIqxGjLJvcVtPj44DAQrXfHyQreZbQDP4sZ26qAEbcxEzv0nVhGJACNzqtZlH600rYWkFqcw', {
  apiVersion:'2022-08-01',
  typescript: false,
});

router.post('/create-payment-intent', async (req, res) => {
  const amount = req.body.amount
  console.log(amount)
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: 'usd',
  });
  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

//forgot password
router.get("/forgot_password",(req,res)=>{
  var random_digits = Math.floor(1000 + Math.random() * 9000);
  const email = req.query.email
  Users.findOne({email:email})
  .then(user_res=>{
    if(user_res != null){
      forgot_password_mail(user_res.email,random_digits)

      res.send({
        "msg":"Verification Code Sent",
        "user_id":user_res._id,
        "otp":random_digits
    })
    }else{
      res.send({
        "msg":"user does not exist"
      })
    }
      
  })
})

router.post("/create_new_password", async (req, res) => {
const user_id = req.body.user_id
let password = req.body.password

bcrypt.hash(password, saltRounds, async (err, hash) => {
  let filter = { _id: user_id };
  let updateDoc = {
    $set: {
     password:hash,
    },
  };

  await Users.updateMany(filter,updateDoc)
  Users.findById(user_id)
  .then(result=>{
   
     res.send({
       "msg":"Password Updated"
     })
  })

})

})

module.exports = router;