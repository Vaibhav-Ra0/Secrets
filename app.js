require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser : true});

const userSchema = new mongoose.Schema({
    email : String,
    password : String
})

// userSchema.plugin(encrypt,{secret : secret});  // this wiil encrypt our entire database
//encrypt only certain fields
//.env work here

userSchema.plugin(encrypt,{secret: process.env.SECRET,encryptedFields:["password"]})


const User = new mongoose.model("User",userSchema);

app.get("/",function(req,res){
    res.render("home");
})
app.get("/register",function(req,res){
    res.render("register");
})
app.get("/login",function(req,res){
    res.render("login");
})

app.post("/register",function(req,res){
    const user = new User({
        email : req.body.username,
        password : req.body.password
    })

    user.save();
    function Err(err){
        if(err){
            console.log(err);
        }
        else{
            res.render("secrets");
        }
    }
    Err();
  
})

app.post("/login",function(req,res){
    const userName = req.body.username;
    const password = req.body.password;

    async function getUser(err)
    {
        if(err){
            console.log(err);
        }
        else{
         const foundUser = await User.findOne({email : userName});
         if(foundUser.password === password){
            res.render("secrets");
         }
        }
    }
    getUser();
})
app.listen(3000,function(){
    console.log("server started at port : 3000");

})
