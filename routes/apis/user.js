const router = require('express').Router();
let Users = require('../../models/Users')
const fs = require('fs')
const Stripe = require('stripe')
const mongoose = require('mongoose')

const bcrypt = require('bcrypt');        
const saltRounds = 10;

//signup api
router.post('/signup',(req,res)=>{
    let hash_password;
    let name = req.body.name
    let email = req.body.email
    let password = req.body.password
    let user_reg_cat = req.body.user_reg_cat
    console.log(req.body)
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

module.exports = router;