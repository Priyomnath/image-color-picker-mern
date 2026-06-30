const router=require("express").Router();

const User=require("../models/User");

const bcrypt=require("bcrypt");

const jwt=require("jsonwebtoken");



router.post("/register",
async(req,res)=>{


const hash=
await bcrypt.hash(
req.body.password,
10
);



await User.create({

name:req.body.name,

email:req.body.email,

password:hash

});


res.json({
message:"Register done"
});


});




router.post("/login",
async(req,res)=>{


const user=
await User.findOne({

email:req.body.email

});



const ok=
await bcrypt.compare(

req.body.password,

user.password

);



const token=
jwt.sign(

{
id:user._id
},

process.env.JWT_SECRET

);



res.cookie(
"token",
token,
{
httpOnly:true,
sameSite:"lax",
secure:false,
maxAge:24*60*60*1000
}
);



res.json({
message:"Login success"
});


});



module.exports=router;