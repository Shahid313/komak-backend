const fs = require('fs')
const router = require('express').Router()

let Post = require('../../models/Post')
let Users = require('../../models/Users')



router.get('/new_orders',(req,res)=>{
    Post.find({"isApproved":true})
    .then(orders=>{
        res.json({
            "orders":orders
        })
    })
})

router.post('/assign_post_to_driver',(req,res)=>{
    const driver_id = req.body.driver_id
    const post_id = req.body.post_id

    Post.updateOne({_id: post_id}, { $set:{driver_id:driver_id}},(err, result) => {
      console.log(result)
      if(err){
        console.log(err)
      }else{
        res.json({
          "msg":"Post assigned to driver succesfully"
        })
      }
      
    } )

  })


  router.get('/get_assignend_posts',(req,res)=>{
    const driver_id = req.query.driver_id
    console.log(driver_id)
    Post.find({$and:[{"isApproved":true}, {"driver_id":driver_id}, {"isCompleted":false}]})
    .then(orders=>{
        res.json({
            "orders":orders
        })
    })
})

router.post('/order_delivered',(req,res)=>{
  const post_id = req.body.post_id

  Post.updateOne({_id:post_id}, {$set:{isCompleted:true}},(err, result) => {
    console.log(result)
    if(err){
      console.log(err)
    }else{
      res.json({
        "msg":"Order Marked As Completed"
      })
    }
    
  } )

})

router.get('/get_all_delivered_orders',(req,res)=>{
  Post.find({$and:[{"isApproved":true}, {"isCompleted":true}]})
  .then(orders=>{
    console.log(orders)
      res.json({
          "orders":orders
      })
  })
})

module.exports = router