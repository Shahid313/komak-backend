const fs = require('fs')
const router = require('express').Router()


let Post = require('../../models/Post')

router.post('/add_post',(req,res)=>{
    const {leftOverName,latitude,postLocation,longitude,postDescription,user_id,isApproved} = req.body
    console.log("this is the latitude")
    console.log(latitude)
    console.log(user_id)
    const file = req.files.postImage;
    console.log(file)
    const filename=file.name
    console.log(filename)
    file.mv('public/uploads/'+filename,function(err){
        if(err){
            res.send(err)
        }
    })

    const post = new Post({
        "post_name":leftOverName,
        "latitude":latitude,
        "longitude":longitude,
        "postLocation":postLocation,
        "post_description":postDescription,
        "post_image":filename,
        "user_id":user_id,
        "driver_id":"",
        "isApproved":isApproved,
        "isCompleted":false
    })
    post.save()
    return res.send({
        "msg":"Post Added Successfully"
    })
})

router.get('/get_all_approved_posts',(req,res)=>{
    Post.find({"isApproved":true})
    .then(item=>{
        res.json({
            "item":item
        })
    })
})

router.get('/get_specific_user_posts',(req,res)=>{
    const user_id = req.query.user_id
    Post.find({"user_id":user_id})
    .then(item=>{
        res.json({
            "item":item
        })
    })
})

router.get('/Post_details',(req,res)=>{
    const post_id = req.query.post_id
    Post.find({"_id":post_id})
    .then(item=>{
        res.json({
            "item":item
        })
    })
})

module.exports = router