const express = require('express');
const hbs = require('hbs');
const generalRouter = require('./routers/general')
const postsRouter = require('./routers/posts')

const app = express();

app.use(express.urlencoded({extended : true}))
app.set("view engine","hbs")
hbs.registerPartials(__dirname + '/views/partials')
app.use('/static',express.static('static'))

app.use('/',generalRouter)
app.use('/post',postsRouter)

app.listen(5000,()=>{
    console.log("Start port 5000")
})