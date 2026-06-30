const router=require("express").Router();

const supabase=require("../supabase");

const auth=require("../middleware/auth");



// SAVE COLOR

router.post("/",
auth,
async(req,res)=>{


const {data,error}=

await supabase

.from("colors")

.insert({

user_id:req.user.id,

color:req.body.color,

image:req.body.image

});


res.json(data);


});




// GET COLORS


router.get("/",
auth,
async(req,res)=>{


const {data}=

await supabase

.from("colors")

.select("*")

.eq(

"user_id",

req.user.id

);



res.json(data);


});



module.exports=router;