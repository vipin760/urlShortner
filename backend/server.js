const express = require("express");
const app = express()
const mongoose = require("mongoose")
const ShortUrl  = require('./model/short.url')

mongoose.connect('mongodb://localhost/urlShortener',{ useNewUrlParser:true, useUnifiedTopology:true })

app.set("view engine","ejs");
app.use(express.urlencoded({extended:true}))

app.get("/",async(req,res)=>{
   try {
    const shortUrl = await ShortUrl.find()
    res.render("index",{shortUrl:shortUrl})
   } catch (error) {
    console.log(error.message);
   }
})
app.get("/:short",async(req,res)=>{
    try {
        const shortUrl = await ShortUrl.findOne({short:req.params.short})
     //   console.log(shortUrl);
        if(shortUrl === null) return res.sendStatus(404)
        shortUrl.clicks++
        shortUrl.save()
        console.log(shortUrl.full);
        res.redirect(shortUrl.full)
    } catch (error) {
        console.log(error);
    }
})
app.post("/shortUrl",async(req,res)=>{
 await ShortUrl.create({full: req.body.fullUrl})
 res.redirect('/')
})

app.listen(process.env.PORT || 5000);
