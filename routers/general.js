const express = require('express')
const dayjs = require('dayjs')
const db = require('../db')

const router = express.Router()

router.get('/', async (req,res)=>{
    let allPosts = []
    try{
        allPosts = await db
            .select('posts.id','posts.title','posts.user','posts.content','posts.createdAt')
            .count('comments.id as commentsCount')
            .from('posts')
            .leftJoin('comments','posts.id','comments.post_id')
            .groupBy('posts.id')
            .orderBy('posts.id','desc')
        allPosts = allPosts.map((post)=>{
            const createdAt_new = dayjs(post.createdAt).format('D MMM YYYY - HH:mm')
            return {...post,createdAt_new}
        })
    }catch(error){
        console.log(error)
    }
    res.render("home",{allPosts})
})


module.exports = router