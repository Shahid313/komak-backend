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

module.exports = router