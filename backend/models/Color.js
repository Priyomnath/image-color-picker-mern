const mongoose=require("mongoose");


const colorSchema=new mongoose.Schema({

user:{
type:mongoose.Schema.Types.ObjectId,
ref:"User"
},


hex:String,

rgb:String


});


module.exports=
mongoose.model("Color",colorSchema);