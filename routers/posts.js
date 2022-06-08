const express = require('express')
const dayjs = require('dayjs')

const db = require('../db')

const router = express.Router()

async function getPostAndComments(postId){
    let onePost = null
    let postComments = []
    try{
        const somePost = await db
            .select('*')
            .from('posts')
            .where('id',+postId)

        onePost = somePost[0]
        onePost.createdAt = dayjs(onePost.createdAt).format('D MMM YYYY - HH:mm')

        postComments = await db
            .select('*')
            .from('comments')
            .where('post_id',+postId)
        postComments = postComments.map((post)=>{
            const createdAt_new = dayjs(post.createdAt).format('D MMM YYYY - HH:mm')
            return {...post,createdAt_new}
        })

    }catch(error){
        console.log(error)
    }

    const customTitle = onePost ? onePost.title : "ไม่พบข้อมูล"
    return {onePost,postComments,customTitle}
}

router.get('/new',(req,res)=>{
    res.render("post")
})

router.post('/create',async (req,res)=>{
    const { title,content,user,accepted } = req.body ?? {}
    try{
        if(!title || !content || !user ){
            throw new Error('no text')
        }else if(accepted != 'on'){
            throw new Error('no accepted')
        }

        await db.insert({title,user,content,createdAt: new Date()}).into('posts')

    }catch(error){
        console.log(error)
        let errorMsg = 'ผิดพลาดอะไรซักอย่าง'
        if(error.message === 'no text'){
            errorMsg = 'กรุณาใส่ข้อมูลให้ครบ'
        }else if(error.message === 'no accepted'){
            errorMsg = 'กรุณายอมรับเงื่อนไข'
        }
        return res.render('post',{errorMsg, values:{title,content,user}})
    }
    res.redirect('/post/create/done')
})

router.get('/create/done',(req,res)=>{
    res.render('postCreate')
})

router.get('/:id', async (req,res)=>{
    const postId = req.params.id
    const postData = await getPostAndComments(postId)
    
    res.render("postId",postData)
})

router.post('/:id/comment',async (req,res)=>{
    const { content,user,accepted } = req.body ?? {}
    const post_id = req.params.id

    try{
        if(!content || !user){
            throw new Error('no text')
        }else if(accepted != 'on'){
            throw new Error('no accepted')
        }

        await db.insert({content,user,createdAt: new Date(),post_id}).into('comments')

    }catch(error){
        console.log(error)
        let errorMsg = 'ผิดพลาดอะไรซักอย่าง'
        if(error.message === 'no text'){
            errorMsg = 'กรุณาใส่ข้อมูลให้ครบ'
        }else if(error.message === 'no accepted'){
            errorMsg = 'กรุณายอมรับเงื่อนไข'
        }

        const postData = await getPostAndComments(post_id)
        return res.render('postId',{...postData,errorMsg,values:{content,user}})
    }
    res.redirect(`/post/${post_id}`)
})


module.exports = router