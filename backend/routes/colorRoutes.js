const router=require("express").Router();


const Color=require("../models/Color");

const auth=require("../middleware/auth");





router.post("/",auth,async(req,res)=>{


const color=
await Color.create({

user:req.user.id,

hex:req.body.hex,

rgb:req.body.rgb


});


res.json(color);


});






router.get("/",auth,async(req,res)=>{


const colors=
await Color.find({

user:req.user.id

});


res.json(colors);


});



module.exports=router;