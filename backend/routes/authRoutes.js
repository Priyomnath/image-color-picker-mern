const router=require("express").Router();

const bcrypt=require("bcrypt");

const jwt=require("jsonwebtoken");

const User=require("../models/User");




// REGISTER

router.post("/register",async(req,res)=>{


const {name,email,password}=req.body;



const hash=
await bcrypt.hash(password,10);



const user=
await User.create({

name,
email,
password:hash

});



res.json(user);


});





// LOGIN

router.post("/login",async(req,res)=>{


const {email,password}=req.body;



const user=
await User.findOne({email});



const match=
await bcrypt.compare(
password,
user.password
);



if(!match)
return res.json("wrong password");



const token=
jwt.sign(
{id:user._id},
process.env.JWT_SECRET
);



res.cookie("token",token,{
httpOnly:true
});



res.json("login success");


});




module.exports=router;