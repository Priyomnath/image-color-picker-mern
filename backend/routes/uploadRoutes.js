const router = require("express").Router();

const multer = require("multer");

const supabase = require("../supabase");


const upload = multer({
storage: multer.memoryStorage()
});



router.post(
"/",
upload.single("image"),
async(req,res)=>{


try{


const file = req.file;



const {data,error}= await supabase.storage

.from("images")

.upload(

`color/${Date.now()}-${file.originalname}`,

file.buffer,

{

contentType:file.mimetype

}

);



if(error){

return res.status(500).json(error);

}




const url =

`${process.env.SUPABASE_URL}/storage/v1/object/public/images/${data.path}`;



res.json({

url

});




}catch(error){


console.log(error);


res.status(500).json({

message:"Upload failed"

});


}


});



module.exports = router;